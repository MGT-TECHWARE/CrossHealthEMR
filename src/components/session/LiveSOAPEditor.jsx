import { useState } from 'react'
import { useNoteStore } from '@/stores/noteStore'
import useVoiceDictation from '@/hooks/useVoiceDictation'
import VoiceButton from '@/components/session/VoiceButton'
import SubjectiveSection from '@/components/notes/sections/SubjectiveSection'
import ObjectiveSection from '@/components/notes/sections/ObjectiveSection'
import AssessmentSection from '@/components/notes/sections/AssessmentSection'
import PlanSection from '@/components/notes/sections/PlanSection'
import { NOTE_TYPE_LABELS } from '@/constants/noteTypes'
import Badge from '@/components/ui/Badge'

const SOAP_TABS = [
  { key: 'subjective', label: 'S', fullLabel: 'Subjective', color: 'text-blue-600' },
  { key: 'objective', label: 'O', fullLabel: 'Objective', color: 'text-emerald-600' },
  { key: 'assessment', label: 'A', fullLabel: 'Assessment', color: 'text-amber-600' },
  { key: 'plan', label: 'P', fullLabel: 'Plan', color: 'text-purple-600' },
]

export default function LiveSOAPEditor({ noteType = 'daily_note', patient }) {
  const { draft, updateDraft } = useNoteStore()
  const [activeTab, setActiveTab] = useState('subjective')
  const { isSupported, isListening, interimTranscript, startListening, stopListening } =
    useVoiceDictation()

  const handleMicToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening((finalText) => {
        // Append dictated text to the free_text field of the active section
        const sectionKey = activeTab === 'subjective' ? 'subjective_data'
          : activeTab === 'objective' ? 'objective_data'
          : activeTab === 'assessment' ? 'assessment_data'
          : 'plan_data'
        const current = draft[sectionKey] || {}
        const freeText = current.free_text || ''
        const separator = freeText && !freeText.endsWith(' ') && !freeText.endsWith('\n') ? ' ' : ''
        updateDraft(sectionKey, { ...current, free_text: freeText + separator + finalText })
      })
    }
  }

  // Check which tabs have data
  const hasData = (key) => {
    const sectionKey = key === 'subjective' ? 'subjective_data'
      : key === 'objective' ? 'objective_data'
      : key === 'assessment' ? 'assessment_data'
      : 'plan_data'
    const d = draft[sectionKey]
    if (!d) return false
    return Object.values(d).some((v) => v !== '' && v !== null && v !== undefined && !(Array.isArray(v) && v.length === 0))
  }

  return (
    <div className="space-y-2 h-full flex flex-col">
      {/* Header with note type and voice button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px]">
            {NOTE_TYPE_LABELS[noteType] || 'Daily Note'}
          </Badge>
          <p className="text-xs font-sans text-muted-foreground">
            Dictate or type in each section
          </p>
        </div>
        <VoiceButton
          isListening={isListening}
          isSupported={isSupported}
          onClick={handleMicToggle}
        />
      </div>

      {/* SOAP Tabs */}
      <div className="flex border-b border-border/60">
        {SOAP_TABS.map((tab) => {
          const isActive = activeTab === tab.key
          const filled = hasData(tab.key)
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-sans font-medium border-b-2 transition-colors ${
                isActive
                  ? `border-primary ${tab.color}`
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className={`inline-flex items-center justify-center h-5 w-5 rounded text-[10px] font-bold ${
                isActive ? 'bg-primary text-white' : filled ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'
              }`}>
                {tab.label}
              </span>
              <span className="hidden sm:inline">{tab.fullLabel}</span>
            </button>
          )
        })}
      </div>

      {/* Active Section */}
      <div className="flex-1 overflow-y-auto pr-1">
        {activeTab === 'subjective' && (
          <SubjectiveSection
            data={draft.subjective_data || {}}
            onChange={(val) => updateDraft('subjective_data', val)}
            patient={patient}
          />
        )}
        {activeTab === 'objective' && (
          <ObjectiveSection
            data={draft.objective_data || {}}
            onChange={(val) => updateDraft('objective_data', val)}
          />
        )}
        {activeTab === 'assessment' && (
          <AssessmentSection
            data={draft.assessment_data || {}}
            onChange={(val) => updateDraft('assessment_data', val)}
          />
        )}
        {activeTab === 'plan' && (
          <PlanSection
            data={draft.plan_data || {}}
            onChange={(val) => updateDraft('plan_data', val)}
          />
        )}
      </div>

      {/* Listening indicators */}
      {isListening && interimTranscript && (
        <div className="rounded-md bg-secondary/50 px-3 py-2">
          <p className="text-sm font-sans text-muted-foreground italic">
            {interimTranscript}
          </p>
        </div>
      )}

      {isListening && !interimTranscript && (
        <div className="flex items-center gap-2 px-1">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <p className="text-xs font-sans text-muted-foreground">Listening... speak now</p>
        </div>
      )}
    </div>
  )
}
