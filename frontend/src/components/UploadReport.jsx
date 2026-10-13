
import { useRef, useState } from "react";
import {
  UploadCloud,
  FileText,
  FileImage,
  FileCheck,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function UploadReport() {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const addFiles = (selectedFiles) => {
    setError("");

    const allowedFiles = Array.from(selectedFiles || []);
    const validFiles = [];

    for (const file of allowedFiles) {
      const isAllowed =
        /\.(pdf|png|jpe?g)$/i.test(file.name);

      if (!isAllowed) {
        setError("PDF, JPG, JPEG or PNG files mattum upload pannunga.");
        continue;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError(`${file.name} 10 MB-ku mela irukku.`);
        continue;
      }

      validFiles.push({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        file,
        name: file.name,
        size: file.size,
        status: "Ready to upload",
      });
    }

    setFiles((previous) => {
      const combined = [...previous];

      validFiles.forEach((item) => {
        if (!combined.some((existing) => existing.id === item.id)) {
          combined.push(item);
        }
      });

      return combined;
    });
  };

  const removeFile = (id) => {
    setFiles((previous) => previous.filter((item) => item.id !== id));
  };

 
const handleUpload = async () => {
  if (!files.length) {
    setError("First medical report select pannunga.");
    return;
  }

  setError("");

  const results = [];

  for (const item of files) {
    const formData = new FormData();
    formData.append("file", item.file);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Upload failed");
      }
      
  
if (data.filename && data.filename.endsWith(".pdf")) {
  localStorage.setItem(
    "latestUploadedReport",
    JSON.stringify({
      filename: data.filename,
      uploadedAt: new Date().toISOString(),
    })
  );
}

      results.push({
        id: item.id,
        success: true,
        message: `${data.filename} uploaded successfully`,
      });

      setFiles((previous) =>
        previous.map((file) =>
          file.id === item.id
            ? { ...file, status: "Uploaded" }
            : file
        )
      );
    } catch (error) {
      results.push({
        id: item.id,
        success: false,
        message: error.message || "Backend connection failed",
      });

      setFiles((previous) =>
        previous.map((file) =>
          file.id === item.id
            ? { ...file, status: "Upload failed" }
            : file
        )
      );
    }
  }

  const failed = results.filter((item) => !item.success);

  if (failed.length) {
    setError(
      failed.map((item) => item.message).join(" | ")
    );
  } else {
    setError("All reports uploaded successfully to the backend!");
  }
};


  const formatSize = (size) => {
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(0)} KB`;
    }
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <section className="dashboard-upload-card">
      <div className="dashboard-upload-heading">
        <div className="dashboard-upload-title-icon">
          <UploadCloud size={25} />
        </div>

        <div>
          <h2>Upload Medical Report</h2>
          <p>Upload your reports for easy access and AI-powered insights.</p>
        </div>
      </div>

      <div
        className={`dashboard-dropzone ${dragging ? "is-dragging" : ""}`}
        role="button"
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          addFiles(event.dataTransfer.files);
        }}
      >
        <div className="dashboard-upload-cloud">
          <UploadCloud size={38} />
        </div>

        <h3>Drag and drop your medical reports here</h3>
        <p>or click to browse files</p>
        <span>Supported formats: PDF, JPG, PNG · Maximum 10 MB per file</span>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          multiple
          hidden
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>

      {error && (
        <div className="dashboard-upload-message" role="status">
          <AlertCircle size={17} />
          <span>{error}</span>
        </div>
      )}

      {files.length > 0 && (
        <div className="dashboard-selected-files">
          <div className="dashboard-selected-header">
            <h3>Selected Reports ({files.length})</h3>
            <button
              type="button"
              onClick={() => setFiles([])}
              className="dashboard-clear-files"
            >
              Clear all
            </button>
          </div>

          {files.map((item) => (
            <div className="dashboard-selected-file" key={item.id}>
              <div className="dashboard-file-icon">
                {item.file.type === "application/pdf" ? (
                  <FileText size={22} />
                ) : (
                  <FileImage size={22} />
                )}
              </div>

              <div className="dashboard-file-info">
                <strong>{item.name}</strong>
                <span>
                  {formatSize(item.size)} · {item.status}
                </span>
              </div>

              {item.status === "Selected" ? (
                <CheckCircle className="dashboard-file-success" size={21} />
              ) : (
                <button
                  type="button"
                  className="dashboard-remove-file"
                  aria-label={`Remove ${item.name}`}
                  onClick={() => removeFile(item.id)}
                >
                  <X size={18} />
                </button>
              )}
            </div>
          ))}

          <button
  type="button"
  className="dashboard-upload-submit"
  onClick={handleUpload}
>
  <UploadCloud size={19} />
  Upload Reports
</button>
        </div>
      )}
    </section>
  );
}
