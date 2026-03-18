import { FileText } from 'lucide-react'
import NoteHistoryCard from '@/components/notes/NoteHistoryCard'

export default function NoteHistoryList({ notes }) {
  if (!notes || notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <FileText className="mb-3 h-10 w-10" />
        <p className="text-sm font-medium">No notes yet</p>
        <p className="mt-1 text-xs">
          Session notes will appear here after saving.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Note History</h3>
      <div className="space-y-3">
        {notes.map((note) => (
          <NoteHistoryCard key={note.id} note={note} />
        ))}
      </div>
    </div>
  )
}
