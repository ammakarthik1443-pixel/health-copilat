import { Activity, ChevronRight, FlaskConical, HeartPulse, Pill, Upload } from 'lucide-react'
import '../styles/Components.css'

export default function WelcomeBanner({ onUpload }) {
  return (
    <section className="welcome-banner">
      <div className="welcome-copy">
        <p className="eyebrow">YOUR PERSONAL HEALTH SPACE</p>
        <h1>Understand Your <span>Health</span><br />Better with <em>AI</em></h1>
        <p className="welcome-description">Upload your medical reports, prescriptions and health data<br className="desktop-break" /> to get easy-to-understand insights, summaries and suggestions.</p>
        <button className="primary-button" onClick={onUpload}><Upload size={20} /> Upload Medical Report <ChevronRight size={20} /></button>
      </div>
      <div className="hero-art" aria-hidden="true">
        <div className="orbit orbit-one" /><div className="orbit orbit-two" />
        <div className="floating-icon heart-icon"><Activity size={27} /></div>
        <div className="floating-icon pill-icon"><Pill size={28} /></div>
        <div className="floating-icon flask-icon"><FlaskConical size={26} /></div>
        <div className="medical-sheet"><div className="sheet-clip" /><HeartPulse size={34} /><span /><span /><span /><span /></div>
        <div className="hero-robot">
          <div className="robot-ear left" /><div className="robot-ear right" />
          <div className="hero-robot-head"><div className="robot-eye" /><div className="robot-eye" /><div className="robot-smile" /></div>
          <div className="hero-robot-body"><HeartPulse size={30} /></div>
          <div className="robot-arm left" /><div className="robot-arm right" />
        </div>
        <div className="leaf leaf-left" /><div className="leaf leaf-right" />
      </div>
    </section>
  )
}
