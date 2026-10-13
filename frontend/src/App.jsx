import { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Sidebar from './components/Sidebar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import MyReports from './pages/MyReports.jsx'
import HealthInsights from './pages/HealthInsights.jsx'
import Prescriptions from './pages/Prescriptions.jsx'
import Reminders from './pages/Reminders.jsx'
import Profile from './pages/Profile.jsx'
import './App.css'

const pageComponents = {
  Dashboard, 'My Reports': MyReports,
  'Health Insights': HealthInsights, Prescriptions, Reminders, Profile,
}

export default function App() {
  const [activePage, setActivePage] = useState('Dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const Page = pageComponents[activePage] || Dashboard

  return (
    <div className="app-shell">
      <Navbar onMenuClick={() => setMobileMenuOpen(true)} />
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
      <main className="main-content">
        <Page onNavigate={setActivePage} />
        <footer className="footer-note">AI Health Copilot · Your health information, organized</footer>
      </main>
    </div>
  )
}
