
import { useRef, useState } from "react";
import {
  FileText,
  UploadCloud,
  Pill,
  Brain,
  Clock3,
  ChevronRight,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import "../styles/Prescriptions.css";

const sampleMedicines = [
  {
    name: "Paracetamol",
    strength: "500 mg",
    purpose: "Fever & Pain relief",
    dosage: "1 tablet",
    timing: "After food (3 times a day)",
    instruction: "Take with water",
    type: "blue",
  },
  {
    name: "Amoxicillin",
    strength: "500 mg",
    purpose: "Bacterial infection",
    dosage: "1 capsule",
    timing: "After food (2 times a day)",
    instruction: "Complete course",
    type: "pink",
  },
  {
    name: "Cetirizine",
    strength: "10 mg",
    purpose: "Allergy relief",
    dosage: "1 tablet",
    timing: "At night (1 time a day)",
    instruction: "May cause drowsiness",
    type: "pink",
  },
  {
    name: "Vitamin D3",
    strength: "60,000 IU",
    purpose: "Bone health",
    dosage: "1 capsule",
    timing: "Once a week",
    instruction: "Take after food",
    type: "orange",
  },
];

const initialPrescriptions = [
  { id: 1, name: "Prescription_01.jpg", date: "Oct 10, 2026", status: "Processed" },
  { id: 2, name: "Doctor_Prescription.pdf", date: "Oct 5, 2026", status: "Processed" },
  { id: 3, name: "Clinic_Prescription.jpg", date: "Sep 28, 2026", status: "Processed" },
];

const quickActions = [
  {
    title: "Upload Prescription",
    subtitle: "PDF, image or photo",
    icon: FileText,
    color: "purple",
    action: "upload",
  },
  {
    title: "AI Explanation",
    subtitle: "Understand your medicines",
    icon: Brain,
    color: "green",
    action: "explain",
  },
  {
    title: "Set Reminders",
    subtitle: "Never miss a dose",
    icon: Clock3,
    color: "orange",
    action: "reminders",
  },
];

export default function Prescriptions() {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);
  const [showAll, setShowAll] = useState(false);
  const [message, setMessage] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [dragging, setDragging] = useState(false);

  function handleFile(file) {
    if (!file) return;

    const validTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];

    const validExtension = /\.(pdf|jpe?g|png)$/i.test(file.name);

    if (!validTypes.includes(file.type) && !validExtension) {
      setMessage("Please select a PDF, JPG or PNG file.");
      setSelectedFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage("File size must be 10 MB or less.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setMessage("");
  }

  function handleUpload() {
    if (!selectedFile) {
      fileInputRef.current?.click();
      return;
    }

    const newPrescription = {
      id: Date.now(),
      name: selectedFile.name,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: "Selected",
    };

    setPrescriptions((current) => [newPrescription, ...current]);
    setMessage(
      "File added to this session. Connect a backend to store and analyze prescriptions."
    );
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleQuickAction(action) {
    if (action === "upload") {
      fileInputRef.current?.click();
    } else if (action === "explain") {
      setShowExplanation((value) => !value);
    } else if (action === "reminders") {
      window.location.href = "/reminders";
    }
  }

  const displayedPrescriptions = showAll
    ? prescriptions
    : prescriptions.slice(0, 3);

  return (
    <main className="prescriptions-page">
      <section className="pres-hero">
        <div className="pres-hero-copy">
          <h1>Prescriptions</h1>
          <h2>View, manage and understand your medicines</h2>
          <p>
            Upload your prescription, get AI-powered explanations,
            track your medicines and never miss a dose.
          </p>
        </div>

        <div className="pres-hero-art" aria-hidden="true">
          <div className="pres-plant plant-one"><i /><i /><i /></div>
          <div className="pres-plant plant-two"><i /><i /><i /></div>

          <div className="pres-float pres-float-pill"><Pill /></div>
          <div className="pres-float pres-float-plus"><AlertCircle /></div>
          <div className="pres-float pres-float-med"><FileText /></div>

          <div className="pres-robot">
            <span className="pres-antenna" />
            <div className="pres-robot-ear ear-left" />
            <div className="pres-robot-ear ear-right" />
            <div className="pres-robot-head">
              <span className="pres-eye" />
              <span className="pres-eye" />
              <span className="pres-smile" />
            </div>
            <div className="pres-robot-body">
              <CheckCircle2 size={34} />
            </div>
            <div className="pres-robot-arm arm-left" />
            <div className="pres-robot-arm arm-right" />
            <div className="pres-robot-paper">
              <span />
              <span />
              <span />
              <b>+</b>
            </div>
          </div>

          <div className="pres-speech">
            I'll help you understand your prescription, medicine usage and
            important tips!
          </div>
        </div>
      </section>

      <section className="pres-quick-actions">
        {quickActions.map(({ title, subtitle, icon: Icon, color, action }) => (
          <button
            type="button"
            className="pres-action-card"
            key={title}
            onClick={() => handleQuickAction(action)}
          >
            <span className={`pres-action-icon ${color}`}>
              <Icon size={30} />
            </span>
            <span className="pres-action-text">
              <strong>{title}</strong>
              <small>{subtitle}</small>
            </span>
            <ChevronRight size={21} className="pres-action-chevron" />
          </button>
        ))}
      </section>

      <section className="pres-content-grid">
        <div className="pres-left-column">
          <section className="pres-card pres-upload-card">
            <div className="pres-section-heading">
              <span className="pres-heading-icon upload-heading-icon">
                <UploadCloud size={29} />
              </span>
              <div>
                <h3>Upload Prescription</h3>
                <p>Upload a prescription image or PDF to extract medicine details.</p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              className="pres-hidden-input"
              onChange={(event) => handleFile(event.target.files?.[0])}
            />

            <div
              className={`pres-dropzone ${dragging ? "pres-dragging" : ""}`}
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);
                handleFile(event.dataTransfer.files?.[0]);
              }}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Choose a prescription file"
            >
              {selectedFile ? (
                <>
                  <FileText size={39} />
                  <strong className="pres-selected-filename">
                    {selectedFile.name}
                  </strong>
                  <span>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                  <button
                    type="button"
                    className="pres-remove-file"
                    aria-label="Remove selected file"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedFile(null);
                      setMessage("");
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <>
                  <UploadCloud size={39} />
                  <strong>Drag and drop your prescription here</strong>
                  <span>or click to browse</span>
                </>
              )}
            </div>

            <p className="pres-file-hint">Supported formats: PDF, JPG, PNG (Max 10MB)</p>

            <button
              type="button"
              className="pres-browse-btn"
              onClick={selectedFile ? handleUpload : () => fileInputRef.current?.click()}
            >
              {selectedFile ? "Add Prescription" : "Browse Files"}
            </button>

            {message && (
              <p className="pres-upload-message" role="status">{message}</p>
            )}
          </section>

          <section className="pres-card pres-recent-card">
            <div className="pres-recent-heading">
              <div className="pres-section-heading compact">
                <Clock3 size={24} />
                <h3>Recent Prescriptions</h3>
              </div>
              <button
                type="button"
                className="pres-view-all"
                onClick={() => setShowAll((value) => !value)}
              >
                {showAll ? "Show Less" : "View All"}
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="pres-recent-list">
              {displayedPrescriptions.map((item) => (
                <div className="pres-recent-row" key={item.id}>
                  <span className="pres-recent-file-icon">
                    <FileText size={23} />
                  </span>
                  <strong className="pres-recent-name">{item.name}</strong>
                  <span className="pres-recent-date">{item.date}</span>
                  <span
                    className={`pres-processed ${
                      item.status === "Selected" ? "pres-selected-status" : ""
                    }`}
                  >
                    {item.status}
                  </span>
                  <ChevronRight size={19} className="pres-recent-chevron" />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="pres-right-column">
          <section className="pres-card pres-details-card">
            <div className="pres-section-heading">
              <span className="pres-heading-icon details-heading-icon">
                <FileText size={29} />
              </span>
              <div>
                <h3>Extracted Medicine Details</h3>
                <p>Medicine information from your prescription</p>
              </div>
            </div>

            <div className="pres-table-wrap">
              <table className="pres-medicine-table">
                <thead>
                  <tr>
                    <th>Medicine Name</th>
                    <th>Purpose</th>
                    <th>Dosage</th>
                    <th>Timing</th>
                    <th>Instructions</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleMedicines.map((medicine) => (
                    <tr key={medicine.name}>
                      <td>
                        <div className="pres-medicine-name">
                          <span className={`pres-pill-icon ${medicine.type}`}>
                            <Pill size={22} />
                          </span>
                          <span>
                            <strong>{medicine.name}</strong>
                            <small>{medicine.strength}</small>
                          </span>
                        </div>
                      </td>
                      <td>{medicine.purpose}</td>
                      <td>{medicine.dosage}</td>
                      <td>{medicine.timing}</td>
                      <td>
                        <span className={`pres-instruction ${
                          medicine.instruction === "Complete course"
                            ? "instruction-green"
                            : medicine.instruction === "May cause drowsiness"
                            ? "instruction-orange"
                            : "instruction-blue"
                        }`}>
                          {medicine.instruction}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pres-ai-insights">
              <div className="pres-ai-title">
                <Lightbulb size={25} />
                <h3>AI Insights</h3>
              </div>
              <ul>
                <li>Take medicines exactly as prescribed by your doctor.</li>
                <li>Do not stop antibiotics before completing the prescribed course.</li>
                <li>If you experience side effects like rash or stomach upset, contact your doctor.</li>
                <li>Avoid self-medication and consult your doctor for any changes.</li>
              </ul>
            </div>

            {showExplanation && (
              <div className="pres-explanation-panel">
                <h4>Medicine explanation</h4>
                <p>
                  These are example medicine entries for the UI preview.
                  Confirm every medicine, dose and instruction against your
                  own prescription with your pharmacist or doctor.
                </p>
              </div>
            )}
          </section>
        </div>
      </section>

      <footer className="pres-disclaimer">
        <AlertCircle size={18} />
        <span>
          Medicine details shown here are sample data for demonstration.
          Always follow your healthcare professional's instructions.
        </span>
      </footer>
    </main>
  );
}
