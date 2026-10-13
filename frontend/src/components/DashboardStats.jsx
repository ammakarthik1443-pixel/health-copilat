import { CheckCircle2, Clock3, FileText, Heart } from 'lucide-react'
import '../styles/Components.css'

const stats = [
  { label: 'Total Reports', icon: FileText, tone: 'blue', bars: [10, 18, 28, 38] },
  { label: 'Analyzed', icon: CheckCircle2, tone: 'green', bars: [9, 16, 26, 38] },
  { label: 'Processing', icon: Clock3, tone: 'orange', bars: [8, 13, 22, 35] },
]

export default function DashboardStats({ totalReports = 4 }) {
  const values = [totalReports, 3, 1]
  return (
    <section className="stats-grid">
      {stats.map(({ label, icon: Icon, tone, bars }, index) => (
        <div className={`stat-card ${tone}`} key={label}>
          <span className="stat-icon"><Icon size={28} /></span>
          <div className="stat-text"><strong>{values[index]}</strong><span>{label}</span></div>
          <div className="mini-bars">{bars.map((height, i) => <i key={i} style={{ height }} />)}</div>
        </div>
      ))}
      <div className="stat-card violet health-score">
        <span className="stat-icon"><Heart size={31} /></span>
        <div className="stat-text"><span>Health Score</span><strong>85/100</strong></div>
        <div className="mini-bars">{[12, 23, 33, 42].map((height, i) => <i key={i} style={{ height }} />)}</div>
      </div>
    </section>
  )
}
