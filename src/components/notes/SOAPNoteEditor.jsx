import { useState } from 'react'
import { Save, Sparkles } from 'lucide-react'
import Button from '@/components/ui/Button'
import SOAPSection from '@/components/notes/SOAPSection'
import NoteStatusBar from '@/components/notes/NoteStatusBar'
import { useNoteStore } from '@/stores/noteStore'
import { useSessionNotes } from '@/hooks/useSessionNotes'
import { useAuthStore } from '@/stores/authStore'

const TABS = [
  {
    key: 'subjective',
    label: 'Subjective',
    placeholder:
      'Patient reports pain level, symptoms, functional limitations, and relevant history...',
  },
  {
    key: 'objective',
    label: 'Objective',
    placeholder:
      'ROM measurements, strength tests, palpation findings, gait analysis, special tests...',
  },
  {
    key: 'assessment',
    label: 'Assessment',
    placeholder:
      'Clinical impression, progress toward goals, barriers to recovery, diagnosis updates...',
  },
  {
    key: 'plan',
    label: 'Plan',
    placeholder:
      'Treatment plan, exercise prescription, frequency, referrals, patient education, goals...',
  },
]

export default function SOAPNoteEditor({
  appointmentId,
  patientId,
  onSaveSuccess,
  onRunAIMatch,
}) {
  const [activeTab, setActiveTab] = useState('subjective')
  const [saveStatus, setSaveStatus] = useState('idle')
  const { draft, updateDraft } = useNoteStore()
  const { saveNote } = useSessionNotes()
  const user = useAuthStore((s) => s.user)

  const handleSave = async () => {
    setSaveStatus('saving')
    try {
      await saveNote({
        appointment_id: appointmentId,
        patient_id: patientId,
        pt_id: user?.id,
        ...draft,
      })
      setSaveStatus('saved')
      onSaveSuccess?.()
    } catch {
      setSaveStatus('error')
    }
  }

  const handleSaveAndMatch = async () => {
    setSaveStatus('saving')
    try {
      await saveNote({
        appointment_id: appointmentId,
        patient_id: patientId,
        pt_id: user?.id,
        ...draft,
      })
      setSaveStatus('saved')
      const combinedText = TABS.map(
        (t) => `${t.label}: ${draft[t.key] || ''}`
      ).join('\n\n')
      onRunAIMatch?.(combinedText)
    } catch {
      setSaveStatus('error')
    }
  }

  const activeTabConfig = TABS.find((t) => t.key === activeTab)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold font-sans text-foreground">SOAP Note</h3>
        <NoteStatusBar status={saveStatus} />
      </div>

      <div className="border-b border-border/60">
        <nav className="-mb-px flex gap-4">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`border-b-2 px-1 pb-3 text-sm font-medium font-sans transition-colors ${
                activeTab === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTabConfig && (
        <SOAPSection
          label={activeTabConfig.label}
          value={draft[activeTabConfig.key] || ''}
          onChange={(val) => updateDraft(activeTabConfig.key, val)}
          placeholder={activeTabConfig.placeholder}
        />
      )}

      <div className="flex items-center gap-3 pt-2">
        <Button onClick={handleSave} variant="secondary">
          <Save className="mr-2 h-4 w-4" />
          Save Note
        </Button>
        <Button onClick={handleSaveAndMatch}>
          <Sparkles className="mr-2 h-4 w-4" />
          Save &amp; Run AI Match
        </Button>
      </div>
    </div>
  )
}
