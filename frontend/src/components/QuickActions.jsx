import { Brain, ChartNoAxesColumn, ChevronRight, FileText, Lightbulb, ShieldCheck } from 'lucide-react'
import '../styles/Components.css'

const actions = [
  { title: 'Upload & Process', subtitle: 'PDF, Images, Prescriptions', icon: FileText, tone: 'violet', target: 'Upload Report' },
  { title: 'AI Analysis', subtitle: 'Get clear explanations', icon: Brain, tone: 'green', target: 'Health Insights' },
  { title: 'Health Insights', subtitle: 'Personalized recommendations', icon: Lightbulb, tone: 'orange', target: 'Health Insights' },
  { title: 'Better Management', subtitle: 'Track and stay healthy', icon: ShieldCheck, tone: 'rose', target: 'Reminders' },
]

export default function QuickActions({ onNavigate, onUpload }) {
  return (
    <section className="quick-actions" aria-label="Quick actions">
      {actions.map(({ title, subtitle, icon: Icon, tone, target }) => (
        <button className="quick-card" key={title} onClick={() => target === 'Upload Report' ? onUpload() : onNavigate(target)}>
          <span className={`quick-icon ${tone}`}><Icon size={28} /></span>
          <span className="quick-text"><strong>{title}</strong><small>{subtitle}</small></span>
          <ChevronRight className="quick-chevron" size={20} />
        </button>
      ))}
    </section>
  )
}
