
import { useRef, useState } from "react";
import {
  UserRound, HeartPulse, Settings, ShieldCheck, FileText,
  Pencil, CalendarDays, MapPin, Camera, ChevronRight,
  Languages, Bell, ChartNoAxesColumn, Ruler, Palette,
  LockKeyhole, Database, CloudDownload, Trash2, Plus,
  X, Check, Pill, Activity, Shield, Heart, ClipboardList
} from "lucide-react";
import "../styles/Profile.css";

const initialPersonal = {
  name: "harinath. k",
  email: "harinath@example.com",
  birthDate: "2004-10-10",
  gender: "Male",
  bloodGroup: "O+",
  phone: "+91 98765 43210",
  emergency: "+91 98765 67890",
  location: "Tamil Nadu, India",
};

const initialHealth = {
  height: "175",
  weight: "68",
  conditions: "",
  allergies: "",
  medications: "",
};

const initialPreferences = {
  language: "English",
  notifications: "Email & In-app",
  analysis: "Detailed Insights",
  units: "Metric (kg, cm)",
  theme: "Light",
};

const accountStats = [
  { label: "Total Reports Uploaded", value: "4", icon: FileText, color: "purple" },
  { label: "Prescriptions Saved", value: "3", icon: Pill, color: "pink" },
  { label: "Reminders Set", value: "5", icon: Bell, color: "blue" },
  { label: "Days with Activity", value: "12", icon: CalendarDays, color: "green" },
  { label: "Member Since", value: "Sep 15, 2026", icon: CalendarDays, color: "orange" },
];

function SectionTitle({ icon: Icon, title, onEdit, editing }) {
  return (
    <div className="profile-section-title">
      <div className="profile-section-heading">
        <Icon size={26} />
        <h3>{title}</h3>
      </div>
      {onEdit && (
        <button
          type="button"
          className={`profile-edit-btn ${editing ? "editing" : ""}`}
          onClick={onEdit}
        >
          {editing ? <Check size={17} /> : <Pencil size={17} />}
          {editing ? "Save" : "Edit"}
        </button>
      )}
    </div>
  );
}

function DetailRow({ label, value, editing, onChange, name, options, type = "text" }) {
  return (
    <div className="profile-detail-row">
      <span className="profile-detail-label">{label}</span>
      <div className="profile-detail-value">
        {editing ? (
          options ? (
            <select
              value={value}
              onChange={(event) => onChange(name, event.target.value)}
            >
              {options.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              value={value}
              onChange={(event) => onChange(name, event.target.value)}
            />
          )
        ) : (
          <span>{value || "None"}</span>
        )}
      </div>
    </div>
  );
}

function calculateAge(dateString) {
  if (!dateString) return "";
  const birth = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return "";
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const beforeBirthday =
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());
  if (beforeBirthday) age -= 1;
  return age;
}

export default function Profile() {
  const [personal, setPersonal] = useState(initialPersonal);
  const [health, setHealth] = useState(initialHealth);
  const [preferences, setPreferences] = useState(initialPreferences);
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingHealth, setEditingHealth] = useState(false);
  const [editingPreferences, setEditingPreferences] = useState(false);
  const [photo, setPhoto] = useState("");
  const [activeDialog, setActiveDialog] = useState("");
  const [extraDetails, setExtraDetails] = useState({
    conditions: [],
    allergies: [],
    medications: [],
  });
  const [newDetail, setNewDetail] = useState("");
  const [password, setPassword] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [securityMessage, setSecurityMessage] = useState("");
  const photoInput = useRef(null);

  const bmi = Number(health.height) > 0 && Number(health.weight) > 0
    ? (Number(health.weight) / ((Number(health.height) / 100) ** 2)).toFixed(1)
    : "—";

  function updatePersonal(name, value) {
    setPersonal((current) => ({ ...current, [name]: value }));
  }

  function updateHealth(name, value) {
    setHealth((current) => ({ ...current, [name]: value }));
  }

  function updatePreferences(name, value) {
    setPreferences((current) => ({ ...current, [name]: value }));
  }

  function addHealthDetail(type) {
    const value = newDetail.trim();
    if (!value) return;
    setExtraDetails((current) => ({
      ...current,
      [type]: [...current[type], value],
    }));
    setNewDetail("");
    setActiveDialog("");
  }

  function handlePhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      window.alert("Please choose an image smaller than 5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result));
    reader.readAsDataURL(file);
  }

  function handlePasswordSave(event) {
    event.preventDefault();
    if (!password.current || !password.next || !password.confirm) {
      setSecurityMessage("Please fill in all password fields.");
      return;
    }
    if (password.next.length < 8) {
      setSecurityMessage("New password must have at least 8 characters.");
      return;
    }
    if (password.next !== password.confirm) {
      setSecurityMessage("New password and confirmation do not match.");
      return;
    }
    setSecurityMessage(
      "Demo only: connect an authentication backend to change your password."
    );
  }

  function handleSecurityAction(action) {
    setSecurityMessage("");
    if (action === "password") {
      setActiveDialog("password");
    } else if (action === "twofactor") {
      setActiveDialog("twofactor");
    } else if (action === "privacy") {
      setActiveDialog("privacy");
    } else if (action === "download") {
      const data = { personal, health, preferences, extraDetails };
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "health-copilot-profile.json";
      link.click();
      URL.revokeObjectURL(url);
    } else if (action === "delete") {
      setActiveDialog("delete");
    }
  }

  return (
    <main className="profile-page">
      <section className="profile-hero">
        <div className="profile-hero-copy">
          <h1>Profile</h1>
          <h2>Manage your personal information and health preferences</h2>
          <p>
            Keep your profile updated for better and more personalized
            health insights.
          </p>
        </div>

        <div className="profile-hero-art" aria-hidden="true">
          <div className="profile-plant profile-plant-one"><i /><i /><i /></div>
          <div className="profile-plant profile-plant-two"><i /><i /><i /></div>
          <div className="profile-float profile-float-user"><UserRound /></div>
          <div className="profile-float profile-float-heart"><Heart fill="currentColor" /></div>
          <div className="profile-float profile-float-settings"><Settings /></div>

          <div className="profile-robot">
            <span className="profile-antenna" />
            <span className="profile-robot-ear ear-left" />
            <span className="profile-robot-ear ear-right" />
            <div className="profile-robot-head">
              <span className="profile-robot-eye" />
              <span className="profile-robot-eye" />
              <span className="profile-robot-smile" />
            </div>
            <div className="profile-robot-body"><HeartPulse size={34} /></div>
            <div className="profile-robot-arm arm-left" />
            <div className="profile-robot-arm arm-right" />
            <div className="profile-robot-card">
              <UserRound size={23} />
              <span />
              <span />
            </div>
          </div>

          <div className="profile-speech">
            Your profile helps me provide more relevant insights and recommendations!
          </div>
        </div>
      </section>

      <section className="profile-top-grid">
        <section className="profile-card profile-personal-card">
          <SectionTitle
            icon={UserRound}
            title="Personal Information"
            editing={editingPersonal}
            onEdit={() => setEditingPersonal((value) => !value)}
          />

          <div className="profile-personal-layout">
            <div className="profile-person-summary">
              <div className="profile-avatar-wrap">
                <div className="profile-avatar">
                  {photo ? (
                    <img src={photo} alt="Profile" />
                  ) : (
                    <UserRound size={95} strokeWidth={1.5} />
                  )}
                </div>
                <button
                  type="button"
                  className="profile-camera-btn"
                  onClick={() => photoInput.current?.click()}
                  aria-label="Change profile photo"
                >
                  <Camera size={19} />
                </button>
                <input
                  ref={photoInput}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handlePhoto}
                />
              </div>

              <div className="profile-person-summary-text">
                {editingPersonal ? (
                  <label className="profile-inline-field">
                    Full Name
                    <input
                      value={personal.name}
                      onChange={(event) => updatePersonal("name", event.target.value)}
                    />
                  </label>
                ) : (
                  <h2>{personal.name}</h2>
                )}

                {editingPersonal ? (
                  <label className="profile-inline-field">
                    Email
                    <input
                      type="email"
                      value={personal.email}
                      onChange={(event) => updatePersonal("email", event.target.value)}
                    />
                  </label>
                ) : (
                  <p>{personal.email}</p>
                )}

                <div className="profile-meta-line">
                  <CalendarDays size={18} />
                  {editingPersonal ? (
                    <input
                      type="date"
                      value={personal.birthDate}
                      onChange={(event) => updatePersonal("birthDate", event.target.value)}
                    />
                  ) : (
                    <span>
                      {new Date(`${personal.birthDate}T00:00:00`).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric", year: "numeric" }
                      )}
                      {personal.birthDate && ` (${calculateAge(personal.birthDate)} years)`}
                    </span>
                  )}
                </div>

                <div className="profile-meta-line">
                  <MapPin size={18} />
                  {editingPersonal ? (
                    <input
                      value={personal.location}
                      onChange={(event) => updatePersonal("location", event.target.value)}
                    />
                  ) : (
                    <span>{personal.location}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="profile-detail-table">
              <DetailRow
                label="Gender"
                name="gender"
                value={personal.gender}
                editing={editingPersonal}
                onChange={updatePersonal}
                options={["Male", "Female", "Other", "Prefer not to say"]}
              />
              <DetailRow
                label="Blood Group"
                name="bloodGroup"
                value={personal.bloodGroup}
                editing={editingPersonal}
                onChange={updatePersonal}
                options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"]}
              />
              <DetailRow
                label="Phone Number"
                name="phone"
                value={personal.phone}
                editing={editingPersonal}
                onChange={updatePersonal}
              />
              <DetailRow
                label="Emergency Contact"
                name="emergency"
                value={personal.emergency}
                editing={editingPersonal}
                onChange={updatePersonal}
              />
            </div>
          </div>
        </section>

        <section className="profile-card profile-health-card">
          <SectionTitle
            icon={HeartPulse}
            title="Health Information"
            editing={editingHealth}
            onEdit={() => setEditingHealth((value) => !value)}
          />

          <div className="profile-health-table">
            <DetailRow
              label="Height"
              name="height"
              value={health.height ? `${health.height} cm` : ""}
              editing={editingHealth}
              onChange={(_, value) => updateHealth("height", value.replace(/\D/g, ""))}
            />
            <DetailRow
              label="Weight"
              name="weight"
              value={health.weight ? `${health.weight} kg` : ""}
              editing={editingHealth}
              onChange={(_, value) => updateHealth("weight", value.replace(/[^\d.]/g, ""))}
            />
            <div className="profile-detail-row">
              <span className="profile-detail-label">BMI</span>
              <div className="profile-detail-value profile-bmi-value">
                <span>{bmi}</span>
                <span className="profile-bmi-status">
                  {Number(bmi) > 0 && Number(bmi) < 25 ? "Normal" : "Review"}
                </span>
              </div>
            </div>

            {[
              { label: "Known Conditions", key: "conditions" },
              { label: "Allergies", key: "allergies" },
              { label: "Current Medications", key: "medications" },
            ].map(({ label, key }) => (
              <div className="profile-detail-row" key={key}>
                <span className="profile-detail-label">{label}</span>
                <div className="profile-detail-value profile-add-value">
                  <span>
                    {[health[key], ...extraDetails[key]]
                      .filter(Boolean)
                      .join(", ") || "None"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setNewDetail("");
                      setActiveDialog(key);
                    }}
                  >
                    <Plus size={15} /> Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>

      <section className="profile-bottom-grid">
        <section className="profile-card profile-preferences-card">
          <SectionTitle
            icon={Settings}
            title="Health Preferences"
            editing={editingPreferences}
            onEdit={() => setEditingPreferences((value) => !value)}
          />

          <div className="profile-preference-list">
            <div className="profile-preference-row">
              <Languages size={21} />
              <span>Language</span>
              <select
                disabled={!editingPreferences}
                value={preferences.language}
                onChange={(event) => updatePreferences("language", event.target.value)}
              >
                <option>English</option>
                <option>Tamil</option>
                <option>Hindi</option>
              </select>
            </div>
            <div className="profile-preference-row">
              <Bell size={21} />
              <span>Notification Preferences</span>
              <select
                disabled={!editingPreferences}
                value={preferences.notifications}
                onChange={(event) => updatePreferences("notifications", event.target.value)}
              >
                <option>Email & In-app</option>
                <option>Email only</option>
                <option>In-app only</option>
                <option>Off</option>
              </select>
            </div>
            <div className="profile-preference-row">
              <ChartNoAxesColumn size={21} />
              <span>Report Analysis Type</span>
              <select
                disabled={!editingPreferences}
                value={preferences.analysis}
                onChange={(event) => updatePreferences("analysis", event.target.value)}
              >
                <option>Detailed Insights</option>
                <option>Basic Summary</option>
                <option>Simple Explanation</option>
              </select>
            </div>
            <div className="profile-preference-row">
              <Ruler size={21} />
              <span>Units</span>
              <select
                disabled={!editingPreferences}
                value={preferences.units}
                onChange={(event) => updatePreferences("units", event.target.value)}
              >
                <option>Metric (kg, cm)</option>
                <option>Imperial (lb, ft)</option>
              </select>
            </div>
            <div className="profile-preference-row">
              <Palette size={21} />
              <span>Theme</span>
              <select
                disabled={!editingPreferences}
                value={preferences.theme}
                onChange={(event) => updatePreferences("theme", event.target.value)}
              >
                <option>Light</option>
                <option>Dark</option>
                <option>System</option>
              </select>
            </div>
          </div>
        </section>

        <section className="profile-card profile-security-card">
          <SectionTitle icon={ShieldCheck} title="Security & Account" />

          <div className="profile-security-list">
            <button type="button" onClick={() => handleSecurityAction("password")}>
              <LockKeyhole size={21} />
              <span>Change Password</span>
              <ChevronRight size={19} />
            </button>
            <button type="button" onClick={() => handleSecurityAction("twofactor")}>
              <Shield size={21} />
              <span>Two-Factor Authentication</span>
              <em>Disabled</em>
              <ChevronRight size={19} />
            </button>
            <button type="button" onClick={() => handleSecurityAction("privacy")}>
              <Database size={21} />
              <span>Manage Data Privacy</span>
              <ChevronRight size={19} />
            </button>
            <button type="button" onClick={() => handleSecurityAction("download")}>
              <CloudDownload size={21} />
              <span>Download My Data</span>
              <ChevronRight size={19} />
            </button>
            <button
              type="button"
              className="profile-delete-action"
              onClick={() => handleSecurityAction("delete")}
            >
              <Trash2 size={21} />
              <span>Delete My Account</span>
              <ChevronRight size={19} />
            </button>
          </div>
          {securityMessage && (
            <p className="profile-security-message">{securityMessage}</p>
          )}
        </section>

        <section className="profile-card profile-summary-card">
          <div className="profile-section-title">
            <div className="profile-section-heading">
              <FileText size={26} />
              <h3>Account Summary</h3>
            </div>
          </div>

          <div className="profile-summary-list">
            {accountStats.map(({ label, value, icon: Icon, color }) => (
              <div className="profile-summary-row" key={label}>
                <span className={`profile-summary-icon ${color}`}>
                  <Icon size={22} />
                </span>
                <span>{label}</span>
                <strong>{value}</strong>
                <ChevronRight size={18} />
              </div>
            ))}
          </div>
        </section>
      </section>

      {activeDialog && (
        <div
          className="profile-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActiveDialog("");
          }}
        >
          <section className="profile-modal" role="dialog" aria-modal="true">
            <button
              type="button"
              className="profile-modal-close"
              onClick={() => setActiveDialog("")}
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>

            {["conditions", "allergies", "medications"].includes(activeDialog) && (
              <>
                <h3>
                  Add {activeDialog === "conditions" ? "Known Condition" :
                    activeDialog === "allergies" ? "Allergy" : "Current Medication"}
                </h3>
                <p>Add an item to this profile session.</p>
                <input
                  autoFocus
                  value={newDetail}
                  onChange={(event) => setNewDetail(event.target.value)}
                  placeholder="Enter details"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") addHealthDetail(activeDialog);
                  }}
                />
                <button
                  type="button"
                  className="profile-modal-primary"
                  onClick={() => addHealthDetail(activeDialog)}
                >
                  <Plus size={17} /> Add
                </button>
              </>
            )}

            {activeDialog === "password" && (
              <>
                <h3>Change Password</h3>
                <p>This demo validates the form but does not change a real account password.</p>
                <form className="profile-password-form" onSubmit={handlePasswordSave}>
                  <input
                    type="password"
                    autoComplete="current-password"
                    placeholder="Current password"
                    value={password.current}
                    onChange={(event) => setPassword({ ...password, current: event.target.value })}
                  />
                  <input
                    type="password"
                    autoComplete="new-password"
                    placeholder="New password (min. 8 characters)"
                    value={password.next}
                    onChange={(event) => setPassword({ ...password, next: event.target.value })}
                  />
                  <input
                    type="password"
                    autoComplete="new-password"
                    placeholder="Confirm new password"
                    value={password.confirm}
                    onChange={(event) => setPassword({ ...password, confirm: event.target.value })}
                  />
                  <button type="submit" className="profile-modal-primary">Validate</button>
                  {securityMessage && <p className="profile-modal-message">{securityMessage}</p>}
                </form>
              </>
            )}

            {activeDialog === "twofactor" && (
              <>
                <h3>Two-Factor Authentication</h3>
                <p>Two-factor authentication is not connected yet. A secure sign-in service is needed to enable it.</p>
                <button type="button" className="profile-modal-primary" onClick={() => setActiveDialog("")}>Got it</button>
              </>
            )}

            {activeDialog === "privacy" && (
              <>
                <h3>Data Privacy</h3>
                <p>Your health information is sensitive. In this frontend demo, profile data is held in page state and is not sent to a database.</p>
                <button type="button" className="profile-modal-primary" onClick={() => setActiveDialog("")}>Close</button>
              </>
            )}

            {activeDialog === "delete" && (
              <>
                <h3>Delete My Account</h3>
                <p>Account deletion is not connected in this demo. Connect a backend with authentication and a verified deletion flow before enabling this feature.</p>
                <button type="button" className="profile-modal-primary" onClick={() => setActiveDialog("")}>Close</button>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
