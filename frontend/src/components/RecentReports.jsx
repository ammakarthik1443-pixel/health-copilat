import { Bone, ChevronRight, Clock3, FileText, Pill, TestTube2 } from 'lucide-react'
import '../styles/Components.css'

const initialReports = [
  { name: 'Blood Test Report.pdf', date: 'Oct 10, 2026', status: 'Analyzed', icon: TestTube2, color: 'red' },
  { name: 'Prescription.jpg', date: 'Oct 5, 2026', status: 'Analyzed', icon: Pill, color: 'blue' },
  { name: 'X-Ray Report.pdf', date: 'Sep 28, 2026', status: 'Processing', icon: Bone, color: 'purple' },
  { name: 'Medical Report.pdf', date: 'Sep 15, 2026', status: 'Analyzed', icon: FileText, color: 'teal' },
]

export { initialReports }

export default function RecentReports({ reports = initialReports, onViewAll }) {
  return (
    <section className="panel recent-panel">
      <div className="recent-heading">
        <div className="recent-title"><Clock3 size={23} /><h2>Recent Reports</h2></div>
        <button className="view-all" onClick={onViewAll}>View All</button>
      </div>
      <div className="report-list">
        {reports.map(({ name, date, status, icon: Icon = FileText, color }, index) => (
          <button className="report-row" key={`${name}-${index}`} onClick={() => window.alert(`${name}\nStatus: ${status}`)}>
            <span className={`report-icon ${color}`}><Icon size={25} /></span>
            <span className="report-info"><strong>{name}</strong><small>{date}</small></span>
            <span className={`status-pill ${status === 'Analyzed' ? 'analyzed' : 'processing'}`}>{status}</span>
            <ChevronRight size={21} className="report-arrow" />
          </button>
        ))}
      </div>
    </section>
  )
}
