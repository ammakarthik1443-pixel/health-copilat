import { HeartPulse, MessageCircle } from 'lucide-react'
import '../styles/Components.css'

export default function HealthAssistant() {
  return (
    <button className="health-assistant" onClick={() => window.alert('AI Health Assistant can be connected to your AI API next.')}>
      <span><HeartPulse size={21} /></span><span>Ask Health AI</span><MessageCircle size={17} />
    </button>
  )
}
