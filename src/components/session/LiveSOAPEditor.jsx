import { useState } from 'react'
import { useNoteStore } from '@/stores/noteStore'
import useVoiceDictation from '@/hooks/useVoiceDictation'
import VoiceButton from '@/components/session/VoiceButton'

export default function LiveSOAPEditor() {
  const { draft, updateDraft } = useNoteStore()
  const { isSupported, isListening, interimTranscript, startListening, stopListening } =
    useVoiceDictation()

  // Use the "subjective" field as the single notes field
  const notes = draft.subjective || ''

  const handleChange = (e) => {
    updateDraft('subjective', e.target.value)
  }

  const handleMicToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening((finalText) => {
        const separator = notes && !notes.endsWith(' ') && !notes.endsWith('\n') ? ' ' : ''
        updateDraft('subjective', notes + separator + finalText)
      })
    }
  }

  return (
    <div className="space-y-2 h-full flex flex-col">
      {/* Header with voice button */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-sans text-muted-foreground">
          Document the session as it happens. Use the mic to dictate.
        </p>
        <VoiceButton
          isListening={isListening}
          isSupported={isSupported}
          onClick={handleMicToggle}
        />
      </div>

      {/* Single notes textarea */}
      <div className="relative flex-1">
        <textarea
          value={notes}
          onChange={handleChange}
          placeholder="Type or dictate your session notes here...&#10;&#10;Document observations, patient responses, treatments performed, ROM measurements, pain levels, exercises completed during the session, patient education provided, etc."
          className="w-full h-full min-h-[300px] rounded-lg border border-border bg-white px-4 py-3 text-sm font-sans shadow-sm transition-all duration-200 placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
        />
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
