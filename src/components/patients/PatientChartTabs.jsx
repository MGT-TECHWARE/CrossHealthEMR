import { clsx } from 'clsx'
import {
  User,
  FileText,
  FolderOpen,
  Shield,
  Activity,
  Dumbbell,
} from 'lucide-react'

const TABS = [
  { key: 'overview', label: 'Overview', icon: User },
  { key: 'notes', label: 'Notes', icon: FileText },
  { key: 'documents', label: 'Documents', icon: FolderOpen },
  { key: 'insurance', label: 'Insurance', icon: Shield },
  { key: 'tracking', label: 'Tracking', icon: Activity },
  { key: 'hep', label: 'HEP', icon: Dumbbell },
]

export default function PatientChartTabs({ activeTab, onTabChange }) {
  return (
    <div className="flex border-b border-border/60 overflow-x-auto">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium font-sans border-b-2 transition-colors whitespace-nowrap',
              isActive
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
