
import re
from pathlib import Path
from uuid import uuid4

import fitz  # PyMuPDF
import pytesseract
from PIL import Image
from pypdf import PdfReader
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="AI Health Copilot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

MAX_FILE_SIZE = 10 * 1024 * 1024

ALLOWED_TYPES = {
    ".pdf": {"application/pdf"},
    ".jpg": {"image/jpeg"},
    ".jpeg": {"image/jpeg"},
    ".png": {"image/png"},
}

# Change this path if Tesseract was installed elsewhere.
TESSERACT_EXE = Path(
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)

if TESSERACT_EXE.exists():
    pytesseract.pytesseract.tesseract_cmd = str(TESSERACT_EXE)


@app.get("/")
def home():
    return {
        "message": "AI Health Copilot backend is running",
        "status": "success",
    }


@app.get("/api/health")
def health_check():
    return {"status": "healthy"}


def run_image_ocr(image: Image.Image) -> str:
    """Extract English text from an image using Tesseract."""
    try:
        return pytesseract.image_to_string(
            image,
            lang="eng",
            config="--psm 6",
        ).strip()
    except pytesseract.TesseractNotFoundError as exc:
        raise HTTPException(
            status_code=503,
            detail=(
                "Tesseract OCR was not found. Install Tesseract OCR "
                "and configure TESSERACT_EXE in main.py."
            ),
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=422,
            detail="OCR failed. Please check the image quality.",
        ) from exc


def extract_medical_text(file_path: Path) -> dict:
    """Extract PDF text first; OCR pages that have no selectable text."""
    extension = file_path.suffix.lower()

    if extension in {".jpg", ".jpeg", ".png"}:
        with Image.open(file_path) as image:
            text = run_image_ocr(image.convert("RGB"))

        return {
            "text": text,
            "ocr_used": True,
            "pages": 1,
        }

    if extension != ".pdf":
        raise HTTPException(
            status_code=400,
            detail="PDF, JPG, JPEG or PNG files only.",
        )

    page_texts = []
    ocr_used = False

    try:
        reader = PdfReader(str(file_path))

        if reader.is_encrypted:
            raise HTTPException(
                status_code=400,
                detail="Password-protected PDF is not supported.",
            )

        # Use the existing PDF text extraction method first.
        for page_number, page in enumerate(reader.pages):
            text = (page.extract_text() or "").strip()

            # Use OCR when a page appears to be scanned.
            if is_garbled_text(text):
                ocr_used = True

                try:
                    with fitz.open(str(file_path)) as pdf_document:
                        pdf_page = pdf_document.load_page(page_number)
                        pix = pdf_page.get_pixmap(
                            matrix=fitz.Matrix(2, 2),
                            alpha=False,
                        )
                        image = Image.frombytes(
                            "RGB",
                            [pix.width, pix.height],
                            pix.samples,
                        )
                        text = run_image_ocr(image)

                except HTTPException:
                    raise
                except Exception as exc:
                    raise HTTPException(
                        status_code=422,
                        detail=(
                            "Could not process a scanned PDF page. "
                            "Check the PDF and OCR installation."
                        ),
                    ) from exc

            page_texts.append(text)

        return {
            "text": "\n".join(page_texts).strip(),
            "ocr_used": ocr_used,
            "pages": len(reader.pages),
        }

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=422,
            detail="Could not read this PDF. Please check the file.",
        ) from exc


LAB_PATTERNS = [
    (
        "Hemoglobin",
        r"\b(?:hemoglobin|haemoglobin|hgb|hb)\b",
    ),
    (
        "Fasting glucose",
        r"\b(?:(?:fasting|blood)\s+(?:blood\s+)?sugar|"
        r"fasting\s+glucose|glucose)\b",
    ),
    (
        "Total cholesterol",
        r"\b(?:total\s+cholesterol|cholesterol)\b",
    ),
    (
        "Vitamin D",
        r"\b(?:25[- ]?oh\s+)?vitamin\s*d\b",
    ),
    (
        "Creatinine",
        r"\bcreatinine\b",
    ),
    (
        "Triglycerides",
        r"\btriglycerides?\b",
    ),
    (
        "Platelets",
        r"\bplatelets?\b",
    ),
    (
        "White blood cell count",
        r"\b(?:white\s+blood\s+cells?|wbc)\b",
    ),
    (
        "Red blood cell count",
        r"\b(?:red\s+blood\s+cells?|rbc)\b",
    ),
]

NUMBER_PATTERN = re.compile(
    r"[-+]?\d+(?:,\d{3})*(?:\.\d+)?"
)

UNIT_PATTERN = re.compile(
    r"(?:mg/dL|mmol/L|g/dL|mg/L|ng/mL|pg/mL|"
    r"mmol|µmol/L|umol/L|10\^?\d*/?L|"
    r"cells/?(?:uL|µL|mL)|%|mg|g|ml|mL|"
    r"fL|pg|U/L|IU/L|mIU/L|/cumm)",
    re.IGNORECASE,
)

RANGE_PATTERN = re.compile(
    r"(?:\b\d+(?:\.\d+)?\s*[-–]\s*\d+(?:\.\d+)?\b|"
    r"\b(?:normal|reference)\s*(?:range)?\s*:?\s*"
    r"\d+(?:\.\d+)?\s*[-–]\s*\d+(?:\.\d+)?)",
    re.IGNORECASE,
)


def extract_lab_values(text: str) -> list:
    """Find common lab-test lines and nearby values for review."""
    lines = [
        " ".join(line.split())
        for line in text.splitlines()
        if line.strip()
    ]

    results = []
    seen = set()

    for index, line in enumerate(lines):
        for test_name, pattern in LAB_PATTERNS:
            match = re.search(pattern, line, re.IGNORECASE)

            if not match:
                continue

            # Search the matching line and the next line, since some
            # reports put the value in a separate column or line.
            candidate_lines = [line]

            if index + 1 < len(lines):
                candidate_lines.append(lines[index + 1])

            source_line = " | ".join(candidate_lines)
            remainder = line[match.end():]

            # Prefer numbers appearing after the test name.
            numbers = NUMBER_PATTERN.findall(remainder)

            if not numbers:
                numbers = NUMBER_PATTERN.findall(source_line)

            if not numbers:
                continue

            value = numbers[0].replace(",", "")
            unit_match = UNIT_PATTERN.search(source_line)
            range_match = RANGE_PATTERN.search(source_line)

            key = (test_name, value, source_line)

            if key in seen:
                continue

            seen.add(key)

            results.append({
                "test": test_name,
                "value": value,
                "unit": unit_match.group(0) if unit_match else None,
                "reference_range": (
                    range_match.group(0) if range_match else None
                ),
                "flag": None,
                "source_line": source_line,
                "needs_review": True,
            })

    return results


DOSAGE_PATTERN = re.compile(
    r"\b\d+(?:\.\d+)?\s*"
    r"(?:mg|mcg|µg|g|ml|mL|units?)\b",
    re.IGNORECASE,
)

FREQUENCY_PATTERN = re.compile(
    r"\b(?:once|twice|thrice)\s+(?:a\s+)?day\b"
    r"|\b\d+\s*(?:times?\s*)?(?:daily|per\s+day)\b"
    r"|\b(?:OD|BD|BID|TDS|TID|QID|HS|SOS)\b",
    re.IGNORECASE,
)

DURATION_PATTERN = re.compile(
    r"\b(?:for\s+)?\d+\s*(?:days?|weeks?|months?)\b",
    re.IGNORECASE,
)

MEDICINE_FORM_PATTERN = re.compile(
    r"\b(?:tab(?:let)?s?|cap(?:sule)?s?|syrup|"
    r"ointment|drops?|inhaler|injection|suspension)\b",
    re.IGNORECASE,
)


def extract_medicine_candidates(text: str) -> list:
    """Extract prescription-like lines; this does not verify medicines."""
    results = []
    seen = set()

    for line in text.splitlines():
        cleaned = " ".join(line.split())

        if not cleaned or cleaned in seen:
            continue

        dosage_matches = DOSAGE_PATTERN.findall(cleaned)
        frequency_matches = FREQUENCY_PATTERN.findall(cleaned)
        duration_matches = DURATION_PATTERN.findall(cleaned)

        looks_like_prescription = (
            bool(MEDICINE_FORM_PATTERN.search(cleaned))
            or (
                bool(dosage_matches)
                and (
                    bool(frequency_matches)
                    or bool(duration_matches)
                )
            )
        )

        if not looks_like_prescription:
            continue

        seen.add(cleaned)

        results.append({
            "source_line": cleaned,
            "dosage_candidates": dosage_matches,
            "frequency_candidates": frequency_matches,
            "duration_candidates": duration_matches,
            "needs_review": True,
        })

    return results


@app.post("/api/upload")
async def upload_report(file: UploadFile = File(...)):
    original_name = Path(file.filename or "").name
    extension = Path(original_name).suffix.lower()

    if extension not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="PDF, JPG, JPEG or PNG files only.",
        )

    if file.content_type not in ALLOWED_TYPES[extension]:
        raise HTTPException(
            status_code=400,
            detail="File type does not match the allowed format.",
        )

    try:
        contents = await file.read(MAX_FILE_SIZE + 1)

        if not contents:
            raise HTTPException(
                status_code=400,
                detail="The uploaded file is empty.",
            )

        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail="Maximum file size is 10 MB.",
            )

        # Basic file signature checks; not a complete malware scan.
        if extension == ".pdf" and not contents.startswith(b"%PDF-"):
            raise HTTPException(
                status_code=400,
                detail="Invalid PDF file.",
            )

        if extension in {".jpg", ".jpeg"} and not contents.startswith(
            b"\xff\xd8\xff"
        ):
            raise HTTPException(
                status_code=400,
                detail="Invalid JPEG file.",
            )

        if extension == ".png" and not contents.startswith(
            b"\x89PNG\r\n\x1a\n"
        ):
            raise HTTPException(
                status_code=400,
                detail="Invalid PNG file.",
            )

        report_id = str(uuid4())
        saved_name = f"{report_id}{extension}"
        saved_path = UPLOAD_DIR / saved_name

        try:
            saved_path.write_bytes(contents)
        except OSError as exc:
            raise HTTPException(
                status_code=500,
                detail="Could not save the uploaded report.",
            ) from exc

        return {
            "success": True,
            "report_id": report_id,
            # Return the stored name for later analysis requests.
            "filename": saved_name,
            "original_filename": original_name,
            "size_bytes": len(contents),
            "status": "uploaded",
            "message": "Report uploaded successfully.",
        }

    finally:
        await file.close()



def is_garbled_text(text: str) -> bool:
    """Detect unreadable or incorrectly decoded PDF text."""
    if len(text.strip()) < 30:
        return True

    readable = sum(
        ch.isascii()
        and (
            ch.isalnum()
            or ch.isspace()
            or ch in ".,:%/+-()<>"
        )
        for ch in text
    )

    ratio = readable / max(len(text), 1)
    return ratio < 0.70


@app.get("/api/analyze/{filename}")
def analyze_report(filename: str):
    """Analyze an uploaded report using PDF extraction and OCR."""

    if Path(filename).name != filename:
        raise HTTPException(
            status_code=400,
            detail="Invalid filename",
        )

    file_path = UPLOAD_DIR / filename

    if not file_path.is_file():
        raise HTTPException(
            status_code=404,
            detail="Uploaded report not found",
        )

    try:
        extracted = extract_medical_text(file_path)
        text = extracted["text"]

        if not text.strip():
            raise HTTPException(
                status_code=422,
                detail=(
                    "No text detected. Please check the report "
                    "or OCR installation."
                ),
            )

        return {
            "status": "success",
            "filename": filename,
            "pages": extracted["pages"],
            "ocr_used": extracted["ocr_used"],
            "extracted_text": text,
            "lab_values": extract_lab_values(text),
            "medicine_candidates": extract_medicine_candidates(text),
            "message": (
                "Extraction completed. Verify the extracted values "
                "against the original medical report."
            ),
        }

    except HTTPException:
        raise

    except Exception as exc:
        raise HTTPException(
            status_code=422,
            detail=(
                "Could not analyze this report. Check the backend "
                "terminal for the underlying error."
            ),
        ) from exc
