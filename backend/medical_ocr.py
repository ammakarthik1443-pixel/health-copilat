
import re
from pathlib import Path

import pymupdf


TESSERACT_PATH = Path(
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)
TESSDATA_PATH = Path(
    r"C:\Program Files\Tesseract-OCR\tessdata"
)


def configure_tesseract():
    """Configure the Windows Tesseract executable when found."""
    if TESSERACT_PATH.exists():
        import pytesseract
        pytesseract.pytesseract.tesseract_cmd = str(TESSERACT_PATH)


def extract_text(file_path: str) -> dict:
    """
    Extract selectable PDF text first.
    Use OCR for pages that have little or no selectable text.
    Supports PDFs and common image files.
    """
    path = Path(file_path)

    if not path.is_file():
        raise FileNotFoundError("Medical report file not found")

    allowed = {".pdf", ".png", ".jpg", ".jpeg"}
    if path.suffix.lower() not in allowed:
        raise ValueError("Only PDF, PNG and JPG files are supported")

    configure_tesseract()

    document = pymupdf.open(str(path))
    page_texts = []
    ocr_used = False

    try:
        for page in document:
            text = page.get_text("text").strip()

            # Scanned pages often have no selectable text.
            if len(text) < 30:
                text_page = page.get_textpage_ocr(
                    language="eng",
                    dpi=200,
                    full=True,
                    tessdata=str(TESSDATA_PATH)
                    if TESSDATA_PATH.exists()
                    else None,
                )
                text = page.get_text(
                    "text", textpage=text_page
                ).strip()
                ocr_used = True

            page_texts.append(text)
    finally:
        document.close()

    return {
        "text": "\n".join(page_texts),
        "ocr_used": ocr_used,
    }


def extract_lab_values(text: str) -> list:
    """Heuristic lab extraction; values need confirmation."""
    lab_patterns = [
        (
            "Hemoglobin",
            r"\b(?:hemoglobin|haemoglobin|hgb|hb)\b",
        ),
        (
            "Fasting Glucose",
            r"\b(?:fasting\s+glucose|blood\s+sugar|glucose)\b",
        ),
        (
            "Total Cholesterol",
            r"\b(?:total\s+cholesterol|cholesterol)\b",
        ),
        (
            "Vitamin D",
            r"\b(?:25[- ]?oh\s+vitamin\s*d|vitamin\s*d)\b",
        ),
        (
            "Creatinine",
            r"\bcreatinine\b",
        ),
    ]

    results = []
    seen = set()

    for line in text.splitlines():
        cleaned = " ".join(line.split())

        for test_name, pattern in lab_patterns:
            if not re.search(pattern, cleaned, re.I):
                continue

            # Find numeric values in the same line.
            numbers = re.findall(
                r"(?<![A-Za-z])[-+]?\d+(?:\.\d+)?",
                cleaned,
            )

            if not numbers:
                continue

            # The first number may be a test-name number in some
            # reports. Treat this as a candidate, not verified data.
            value = numbers[0]
            key = (test_name, value)

            if key in seen:
                continue

            seen.add(key)
            results.append({
                "test_name": test_name,
                "result_value": value,
                "source_line": cleaned,
                "needs_review": True,
            })

    return results


def extract_medicines(text: str) -> list:
    """
    Candidate prescription-line extraction.
    Does not determine or recommend a dose.
    """
    medicines = []
    seen_lines = set()

    medicine_cues = re.compile(
        r"\b(tab(?:let)?|cap(?:sule)?|syrup|"
        r"ointment|drops|inhaler|injection)\b",
        re.I,
    )

    dosage_pattern = re.compile(
        r"\b\d+(?:\.\d+)?\s*"
        r"(?:mg|mcg|µg|g|ml|mL|units?)\b",
        re.I,
    )

    frequency_pattern = re.compile(
        r"\b(?:once|twice|thrice)\s+(?:a\s+)?day\b"
        r"|\b\d+\s*(?:times?\s*)?(?:daily|per\s+day)\b"
        r"|\b(?:OD|BD|BID|TDS|TID|QID|HS|SOS)\b",
        re.I,
    )

    duration_pattern = re.compile(
        r"\b(?:for\s+)?\d+\s*"
        r"(?:days?|weeks?|months?)\b",
        re.I,
    )

    for line in text.splitlines():
        cleaned = " ".join(line.split())

        if not cleaned or cleaned in seen_lines:
            continue

        # Include likely prescription lines, but avoid claiming
        # that every matched line is a confirmed medicine.
        if not (
            medicine_cues.search(cleaned)
            or (
                dosage_pattern.search(cleaned)
                and (
                    frequency_pattern.search(cleaned)
                    or duration_pattern.search(cleaned)
                )
            )
        ):
            continue

        seen_lines.add(cleaned)

        medicines.append({
            "source_line": cleaned,
            "dosage_candidates": dosage_pattern.findall(cleaned),
            "frequency_candidates": frequency_pattern.findall(cleaned),
            "duration_candidates": duration_pattern.findall(cleaned),
            "needs_review": True,
        })

    return medicines


def analyze_medical_file(file_path: str) -> dict:
    extracted = extract_text(file_path)
    text = extracted["text"]

    if not text.strip():
        return {
            "text": "",
            "ocr_used": extracted["ocr_used"],
            "lab_results": [],
            "medicines": [],
            "message": "No text detected. Try a clearer scan.",
        }

    return {
        "text": text,
        "ocr_used": extracted["ocr_used"],
        "lab_results": extract_lab_values(text),
        "medicines": extract_medicines(text),
        "message": (
            "Review all extracted information against the original report."
        ),
    }
