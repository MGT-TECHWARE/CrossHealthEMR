import { FileText, Clock } from 'lucide-react'
import { formatDate } from '@/utils/formatDate'

export default function PatientHistoryTimeline({ notes = [] }) {
  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <FileText className="h-10 w-10 mb-2 text-border" />
        <p className="text-sm font-medium font-sans">No session history</p>
        <p className="text-xs font-sans text-muted-foreground">
          Past session notes will appear here.
        </p>
      </div>
    )
  }

  const sorted = [...notes].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  )

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

      <ul className="space-y-6">
        {sorted.map((note, index) => (
          <li key={note.id || index} className="relative pl-10">
            <div className="absolute left-2.5 top-1 h-3 w-3 rounded-full bg-primary border-2 border-white shadow" />

            <div className="bg-white border border-border/60 rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <time className="text-xs font-medium font-sans text-muted-foreground">
                  {formatDate(note.created_at)}
                </time>
              </div>

              {note.assessment && (
                <p className="text-sm font-sans text-foreground leading-relaxed mb-1">
                  <span className="font-medium">Assessment:</span>{' '}
                  {note.assessment.length > 120 ? note.assessment.slice(0, 120) + '...' : note.assessment}
                </p>
              )}

              {note.subjective && !note.assessment && (
                <p className="text-sm font-sans text-foreground leading-relaxed">
                  <span className="font-medium">Subjective:</span>{' '}
                  {note.subjective.length > 120 ? note.subjective.slice(0, 120) + '...' : note.subjective}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
