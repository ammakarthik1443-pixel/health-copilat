import { useState } from 'react'
import RecentReports, { initialReports } from '../components/RecentReports.jsx'
import '../styles/Dashboard.css'

export default function MyReports() {
  const [filter, setFilter] = useState('All')
  const reports = filter === 'All' ? initialReports : initialReports.filter((r) => r.status === filter)
  return (
    <section className="page-wrap">
      <div className="page-intro"><p className="eyebrow">DOCUMENT CENTRE</p><h1>My Reports</h1><p>Browse the sample reports in your health workspace.</p></div>
      <div className="filter-row">{['All', 'Analyzed', 'Processing'].map((item) => <button key={item} className={filter === item ? 'filter-active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div>
      <RecentReports reports={reports} onViewAll={() => setFilter('All')} />
    </section>
  )
}
