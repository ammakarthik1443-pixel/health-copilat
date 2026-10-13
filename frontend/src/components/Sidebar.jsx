import {
  Bell, ChartNoAxesColumn, ClipboardList, HeartPulse, House,
  Pill, UserRound, X
} from 'lucide-react'
import '../styles/Sidebar.css'

const links = [
  { label: 'Dashboard', icon: House },
  { label: 'My Reports', icon: ClipboardList },
  { label: 'Health Insights', icon: ChartNoAxesColumn },
  { label: 'Prescriptions', icon: Pill },
  { label: 'Reminders', icon: Bell },
  { label: 'Profile', icon: UserRound },
]

export default function Sidebar({ activePage, onNavigate, mobileOpen, onClose }) {
  const navigate = (label) => { onNavigate(label); onClose() }
  return (
    <>
      {mobileOpen && <button className="sidebar-scrim" onClick={onClose} aria-label="Close menu" />}
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div>
          <button className="sidebar-close icon-button" onClick={onClose} aria-label="Close menu"><X size={20} /></button>
          <nav className="sidebar-nav">
            {links.map(({ label, icon: Icon }) => (
              <button key={label} className={`nav-item ${activePage === label ? 'active' : ''}`} onClick={() => navigate(label)}>
                <Icon size={22} /><span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="assistant-card">
          <div className="mini-robot" aria-hidden="true">
            <span className="robot-antenna" />
            <div className="robot-face"><i /><i /><b /></div>
            <div className="robot-body" />
          </div>
          <h3>Your AI Health Companion</h3>
          <p>Understand. Organize.<br />Take Control.<br />Stay Healthier.</p>
        </div>
      </aside>
    </>
  )
}
