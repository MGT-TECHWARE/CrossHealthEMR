import { useState } from 'react'
import { FileText } from 'lucide-react'
import NoteHistoryCard from './NoteHistoryCard'
import NotePreview from './NotePreview'
import NoteSignatureModal from './NoteSignatureModal'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { NOTE_TYPE_LABELS } from '@/constants/noteTypes'

export default function NoteHistoryList({ notes = [], onSignNote, ptProfile }) {
  const [selectedNote, setSelectedNote] = useState(null)
  const [showSignModal, setShowSignModal] = useState(false)
  const [filterType, setFilterType] = useState('all')

  const filtered = filterType === 'all'
    ? notes
    : notes.filter((n) => n.note_type === filterType)

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  )

  const noteTypes = [...new Set(notes.map((n) => n.note_type).filter(Boolean))]

  return (
    <div>
      {/* Filter tabs */}
      {noteTypes.length > 1 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          <button
            onClick={() => setFilterType('all')}
            className={`rounded-full px-3 py-1 text-xs font-medium font-sans transition-colors ${
              filterType === 'all' ? 'bg-primary text-white' : 'bg-secondary text-foreground/60 hover:bg-secondary/80'
            }`}
          >
            All ({notes.length})
          </button>
          {noteTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`rounded-full px-3 py-1 text-xs font-medium font-sans transition-colors ${
                filterType === type ? 'bg-primary text-white' : 'bg-secondary text-foreground/60 hover:bg-secondary/80'
              }`}
            >
              {NOTE_TYPE_LABELS[type] || type} ({notes.filter((n) => n.note_type === type).length})
            </button>
          ))}
        </div>
      )}

      {/* Notes list */}
      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <FileText className="h-10 w-10 mb-2 text-border" />
          <p className="text-sm font-medium font-sans">No notes found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((note) => (
            <NoteHistoryCard
              key={note.id}
              note={note}
              onClick={setSelectedNote}
            />
          ))}
        </div>
      )}

      {/* Preview modal */}
      <Modal
        open={!!selectedNote}
        onOpenChange={(open) => { if (!open) setSelectedNote(null) }}
        title="Note Preview"
      >
        {selectedNote && (
          <div>
            <NotePreview note={selectedNote} />
            {selectedNote.status === 'completed' && onSignNote && (
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={() => setShowSignModal(true)}
                  className="gap-2"
                >
                  Sign & Finalize
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Signature modal */}
      <NoteSignatureModal
        open={showSignModal}
        onOpenChange={setShowSignModal}
        ptProfile={ptProfile}
        onSign={async (signatureData) => {
          if (selectedNote && onSignNote) {
            await onSignNote(selectedNote.id, signatureData)
            setSelectedNote(null)
          }
        }}
      />
    </div>
  )
}
