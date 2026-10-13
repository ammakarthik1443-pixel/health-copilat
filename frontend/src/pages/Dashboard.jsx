import { useState } from 'react'
import WelcomeBanner from '../components/WelcomeBanner.jsx'
import QuickActions from '../components/QuickActions.jsx'
import UploadReport from '../components/UploadReport.jsx'
import RecentReports, { initialReports } from '../components/RecentReports.jsx'
import DashboardStats from '../components/DashboardStats.jsx'
import HealthAssistant from '../components/HealthAssistant.jsx'
import '../styles/Dashboard.css'

export default function Dashboard({ onNavigate }) {
  const [uploadedFiles, setUploadedFiles] = useState([])
  const reports = uploadedFiles.length
    ? [...uploadedFiles.map((file) => ({ name: file.name, date: 'Just now', status: 'Processing', color: 'blue' })), ...initialReports].slice(0, 4)
    : initialReports

  const openUpload = () => {
    onNavigate('Dashboard')
    document.getElementById('upload-panel')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <>
      <WelcomeBanner onUpload={openUpload} />
      <QuickActions onNavigate={onNavigate} onUpload={openUpload} />
      <div className="content-grid">
        <UploadReport onFilesUploaded={setUploadedFiles} />
        <RecentReports reports={reports} onViewAll={() => onNavigate('My Reports')} />
      </div>
      <DashboardStats totalReports={4 + uploadedFiles.length} />
      <HealthAssistant />
    </>
  )
}
