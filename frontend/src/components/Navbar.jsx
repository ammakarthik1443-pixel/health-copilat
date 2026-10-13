import { Bell, ChevronDown, HeartPulse, Menu, UserRound } from 'lucide-react'
import '../styles/Navbar.css'

export default function Navbar({ onMenuClick }) {
  return (
    <header className="navbar">
      <button className="mobile-menu icon-button" onClick={onMenuClick} aria-label="Open menu"><Menu size={23} /></button>
      <div className="brand">
        <span className="brand-mark"><HeartPulse size={30} /></span>
        <span>AI Health Copilot</span>
      </div>
      <div className="nav-user">
        <button className="icon-button notification" aria-label="Notifications"><Bell size={22} /></button>
        <span className="avatar"><UserRound size={25} /></span>
        <span className="user-name">Karthik A</span>
        <ChevronDown size={16} />
      </div>
    </header>
  )
}
