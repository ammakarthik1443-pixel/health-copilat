
import { useMemo, useState } from "react";
import {
  Bell, Pill, CalendarDays, Stethoscope, TestTubeDiagonal,
  Activity, Clock, CheckCircle2, ChevronLeft, ChevronRight,
  Plus, BarChart3, Lightbulb, Droplets, Moon, Dumbbell,
  CalendarCheck, ClipboardList
} from "lucide-react";
import "../styles/Reminders.css";

const initialReminders = [
  {
    id: 1,
    name: "Paracetamol 500 mg",
    time: "08:00 AM",
    description: "1 tablet (After food)",
    category: "Medicine",
    status: "Taken",
  },
  {
    id: 2,
    name: "Amoxicillin 500 mg",
    time: "01:00 PM",
    description: "1 capsule (After food)",
    category: "Medicine",
    status: "Pending",
  },
  {
    id: 3,
    name: "Vitamin D3",
    time: "06:00 PM",
    description: "1 capsule (After food)",
    category: "Medicine",
    status: "Pending",
  },
  {
    id: 4,
    name: "Doctor Appointment",
    time: "10:00 AM",
    description: "General Checkup",
    category: "Appointment",
    status: "Upcoming",
  },
  {
    id: 5,
    name: "Blood Test (CBC)",
    time: "09:00 AM",
    description: "At City Lab",
    category: "Test",
    status: "Upcoming",
  },
];

const categories = [
  { name: "Medicine", subtitle: "Set your medicine schedule", Icon: Pill, color: "purple" },
  { name: "Appointment", subtitle: "Hospital visits & checkups", Icon: Stethoscope, color: "blue" },
  { name: "Test", subtitle: "Lab tests & scans", Icon: TestTubeDiagonal, color: "orange" },
  { name: "Wellness", subtitle: "Water, exercise, sleep", Icon: Activity, color: "green" },
];

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function to12Hour(value) {
  if (!value) return "08:00 AM";
  const [hourString, minute] = value.split(":");
  const hour = Number(hourString);
  return `${String(hour % 12 || 12).padStart(2, "0")}:${minute} ${hour >= 12 ? "PM" : "AM"}`;
}

function ReminderCalendar({ reminders }) {
  const [monthDate, setMonthDate] = useState(new Date(2026, 9, 1));
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();

  const days = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const previousLastDate = new Date(year, month, 0).getDate();

    return [
      ...Array.from({ length: firstDay }, (_, i) => ({
        day: previousLastDate - firstDay + i + 1,
        outside: true,
        key: `prev-${i}`,
      })),
      ...Array.from({ length: lastDate }, (_, i) => ({
        day: i + 1,
        outside: false,
        key: `current-${i + 1}`,
      })),
      ...Array.from(
        { length: (7 - ((firstDay + lastDate) % 7)) % 7 },
        (_, i) => ({ day: i + 1, outside: true, key: `next-${i}` })
      ),
    ];
  }, [year, month]);

  const markerDays = [3, 5, 8, 10, 12, 14, 15];

  function changeMonth(direction) {
    setMonthDate(new Date(year, month + direction, 1));
  }

  return (
    <section className="rem-card calendar-card">
      <h3 className="rem-card-heading">
        <CalendarDays size={23} />
        Calendar View
      </h3>

      <div className="calendar-month">
        <button
          type="button"
          className="calendar-arrow"
          onClick={() => changeMonth(-1)}
          aria-label="Previous month"
        >
          <ChevronLeft />
        </button>
        <strong>
          {monthDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </strong>
        <button
          type="button"
          className="calendar-arrow"
          onClick={() => changeMonth(1)}
          aria-label="Next month"
        >
          <ChevronRight />
        </button>
      </div>

      <div className="calendar-grid">
        {weekDays.map((day) => (
          <span className="calendar-weekday" key={day}>{day}</span>
        ))}

        {days.map((item) => {
          const isToday = !item.outside && item.day === 10 &&
            year === 2026 && month === 9;
          const hasMarker = !item.outside && markerDays.includes(item.day);

          return (
            <div
              key={item.key}
              className={`calendar-day ${item.outside ? "outside-month" : ""} ${
                isToday ? "calendar-today" : ""
              }`}
            >
              <span>{item.day}</span>
              {hasMarker && !isToday && (
                <i className={`calendar-dot dot-${item.day % 3}`} />
              )}
              {isToday && <i className="calendar-today-dot" />}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function Reminders() {
  const [activeCategory, setActiveCategory] = useState("Medicine");
  const [reminders, setReminders] = useState(initialReminders);
  const [showAll, setShowAll] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [form, setForm] = useState({
    name: "",
    dose: "",
    time: "08:00",
    repeat: "Daily",
    notes: "",
  });
  const [message, setMessage] = useState("");

  const takenCount = reminders.filter((item) => item.status === "Taken").length;
  const pendingCount = reminders.filter((item) => item.status === "Pending").length;
  const visibleReminders = showAll ? reminders : reminders.slice(0, 5);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
    setMessage("");
  }

  function addReminder(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      setMessage("Please enter a reminder name.");
      return;
    }

    const newReminder = {
      id: Date.now(),
      name: form.name.trim(),
      time: to12Hour(form.time),
      description: `${form.dose.trim() || activeCategory} ${
        form.notes.trim() ? `(${form.notes.trim()})` : `(${form.repeat})`
      }`,
      category: activeCategory,
      status: activeCategory === "Medicine" ? "Pending" : "Upcoming",
    };

    setReminders((current) =>
      [...current, newReminder].sort((a, b) => a.time.localeCompare(b.time))
    );
    setForm({
      name: "",
      dose: "",
      time: "08:00",
      repeat: "Daily",
      notes: "",
    });
    setMessage("Reminder added successfully!");
  }

  function markTaken(id) {
    setReminders((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status: "Taken" } : item
      )
    );
  }

  return (
    <main className="reminders-page">
      <section className="rem-hero">
        <div className="rem-hero-copy">
          <h1>Reminders</h1>
          <h2>Never miss a dose, test or appointment</h2>
          <p>
            Set reminders for your medicines, health checkups, appointments
            and daily wellness activities.
          </p>
        </div>

        <div className="rem-hero-art" aria-hidden="true">
          <div className="hero-orbit" />
          <div className="hero-float float-pill"><Pill /></div>
          <div className="hero-float float-clock"><Clock /></div>
          <div className="hero-float float-calendar"><CalendarDays /></div>
          <div className="hero-float float-bell"><Bell /></div>
          <div className="hero-robot">
            <div className="robot-antenna" />
            <div className="robot-head">
              <span className="robot-eye" />
              <span className="robot-eye" />
              <div className="robot-smile" />
            </div>
            <div className="robot-body">
              <CalendarCheck size={44} />
              <Bell size={28} className="robot-body-bell" />
            </div>
            <div className="robot-arm robot-arm-left" />
            <div className="robot-arm robot-arm-right" />
          </div>
          <div className="hero-speech">
            I'll remind you about your medicines, appointments and important
            health tasks!
          </div>
        </div>
      </section>

      <section className="rem-category-grid">
        {categories.map(({ name, subtitle, Icon, color }) => (
          <button
            type="button"
            key={name}
            className={`rem-category ${activeCategory === name ? "selected-category" : ""}`}
            onClick={() => {
              setActiveCategory(name);
              setMessage("");
            }}
          >
            <span className={`rem-category-icon ${color}`}><Icon size={31} /></span>
            <span className="rem-category-text">
              <strong>{name} Reminder</strong>
              <small>{subtitle}</small>
            </span>
            <ChevronRight className="category-chevron" size={22} />
          </button>
        ))}
      </section>

      <section className="rem-main-grid">
        <section className="rem-card add-reminder-card">
          <h3 className="rem-card-heading">
            <Bell size={25} fill="currentColor" />
            Add New Reminder
          </h3>

          <div className="rem-tabs">
            {categories.map(({ name }) => (
              <button
                type="button"
                key={name}
                className={activeCategory === name ? "active-rem-tab" : ""}
                onClick={() => {
                  setActiveCategory(name);
                  setMessage("");
                }}
              >
                {name}
              </button>
            ))}
          </div>

          <form onSubmit={addReminder}>
            <div className="rem-form-row">
              <label>
                {activeCategory === "Medicine" ? "Medicine Name" :
                  activeCategory === "Appointment" ? "Appointment Name" :
                  activeCategory === "Test" ? "Test Name" : "Activity Name"}
                <input
                  name="name"
                  value={form.name}
                  onChange={updateField}
                  placeholder={
                    activeCategory === "Medicine" ? "e.g. Paracetamol" :
                    activeCategory === "Appointment" ? "e.g. Doctor visit" :
                    activeCategory === "Test" ? "e.g. Blood test" :
                    "e.g. Morning walk"
                  }
                />
              </label>
              <label>
                {activeCategory === "Medicine" ? "Dose" : "Details"}
                <input
                  name="dose"
                  value={form.dose}
                  onChange={updateField}
                  placeholder={activeCategory === "Medicine" ? "e.g. 1 tablet" : "Optional details"}
                />
              </label>
            </div>

            <div className="rem-form-row">
              <label>
                Time
                <span className="time-input-wrap">
                  <Clock size={17} />
                  <input
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={updateField}
                    required
                  />
                </span>
              </label>
              <label>
                Repeat
                <select name="repeat" value={form.repeat} onChange={updateField}>
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Weekdays</option>
                  <option>Once</option>
                </select>
              </label>
            </div>

            <label className="rem-notes-toggle">
              <input
                type="checkbox"
                checked={showNotes}
                onChange={(event) => setShowNotes(event.target.checked)}
              />
              <span className="toggle-track"><i /></span>
              Add Notes (Optional)
            </label>

            {showNotes && (
              <label className="rem-notes-field">
                Notes
                <input
                  name="notes"
                  value={form.notes}
                  onChange={updateField}
                  placeholder="e.g. After food"
                />
              </label>
            )}

            {message && (
              <p className={`rem-form-message ${message.includes("successfully") ? "success" : ""}`}>
                {message}
              </p>
            )}

            <button type="submit" className="set-reminder-btn">
              <Bell size={17} fill="currentColor" />
              Set Reminder
            </button>
          </form>
        </section>

        <section className="rem-card todays-reminders-card">
          <div className="rem-card-topline">
            <h3 className="rem-card-heading">
              <CalendarDays size={24} />
              Today's Reminders
            </h3>
            <button
              type="button"
              className="view-all-btn"
              onClick={() => setShowAll((value) => !value)}
            >
              {showAll ? "Show Less" : "View All"} <ChevronRight size={17} />
            </button>
          </div>

          <div className="today-reminder-list">
            {visibleReminders.length === 0 && (
              <p className="empty-reminders">No reminders yet. Add one to get started.</p>
            )}

            {visibleReminders.map((item, index) => {
              const Icon = item.category === "Medicine" ? Pill :
                item.category === "Appointment" ? Stethoscope :
                item.category === "Test" ? TestTubeDiagonal : Activity;
              const color = item.category === "Medicine"
                ? ["pink", "blue", "green"][index % 3]
                : item.category === "Appointment" ? "purple"
                : item.category === "Test" ? "pink" : "green";

              return (
                <div className="today-reminder-row" key={item.id}>
                  <span className={`today-reminder-icon ${color}`}><Icon size={22} /></span>
                  <strong className="today-reminder-time">{item.time}</strong>
                  <div className="today-reminder-info">
                    <strong>{item.name}</strong>
                    <small>{item.description}</small>
                  </div>
                  <span className={`rem-status ${item.status.toLowerCase()}`}>
                    {item.status === "Pending" ? (
                      <button type="button" onClick={() => markTaken(item.id)}>Mark Taken</button>
                    ) : item.status}
                  </span>
                  <ChevronRight className="row-chevron" size={20} />
                </div>
              );
            })}
          </div>
        </section>

        <ReminderCalendar reminders={reminders} />
      </section>

      <section className="rem-bottom-grid">
        <section className="rem-card rem-statistics-card">
          <h3 className="rem-card-heading">
            <BarChart3 size={25} />
            Reminder Statistics
          </h3>

          <div className="rem-stat-grid">
            <div className="rem-stat stat-green">
              <span className="stat-icon"><CheckCircle2 size={27} /></span>
              <div><strong>{takenCount}/14</strong><small>Taken on time</small></div>
            </div>
            <div className="rem-stat stat-orange">
              <span className="stat-icon"><Clock size={27} /></span>
              <div><strong>{pendingCount}</strong><small>Pending today</small></div>
            </div>
            <div className="rem-stat stat-blue">
              <span className="stat-icon"><CalendarDays size={27} /></span>
              <div><strong>5</strong><small>This week</small></div>
            </div>
            <div className="rem-stat stat-purple">
              <span className="stat-icon"><BarChart3 size={27} /></span>
              <div><strong>{Math.round((takenCount / Math.max(reminders.length, 1)) * 100)}%</strong><small>Adherence rate</small></div>
            </div>
          </div>
        </section>

        <section className="rem-card quick-tips-card">
          <h3 className="rem-card-heading">
            <Lightbulb size={25} />
            Quick Tips
          </h3>
          <ul>
            <li>Take medicines at the same time every day.</li>
            <li>Do not skip doses.</li>
            <li>Keep track of your upcoming appointments and tests.</li>
            <li>Enable notifications to get timely reminders.</li>
            <li>Follow your doctor's advice.</li>
          </ul>
        </section>
      </section>
    </main>
  );
}
