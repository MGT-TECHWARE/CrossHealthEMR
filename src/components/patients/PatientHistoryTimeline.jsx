import { FileText, Clock, CheckCircle } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { formatDate } from '@/utils/formatDate'
import { NOTE_TYPE_LABELS, NOTE_STATUS_LABELS } from '@/constants/noteTypes'

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
        {sorted.map((note, index) => {
          const subj = note.subjective_data || {}
          const summary = subj.chief_complaint || note.assessment || note.subjective || 'Session note'
          const isSigned = note.status === 'signed'

          return (
            <li key={note.id || index} className="relative pl-10">
              <div className={`absolute left-2.5 top-1 h-3 w-3 rounded-full border-2 border-white shadow ${
                isSigned ? 'bg-emerald-500' : 'bg-primary'
              }`} />

              <div className="bg-white border border-border/60 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <time className="text-xs font-medium font-sans text-muted-foreground">
                      {formatDate(note.created_at)}
                    </time>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {note.note_type && (
                      <Badge variant="outline" className="text-[10px]">
                        {NOTE_TYPE_LABELS[note.note_type] || note.note_type}
                      </Badge>
                    )}
                    {isSigned && (
                      <Badge variant="success" className="text-[10px] gap-0.5">
                        <CheckCircle className="h-2.5 w-2.5" />
                        Signed
                      </Badge>
                    )}
                  </div>
                </div>

                <p className="text-sm font-sans text-foreground leading-relaxed">
                  {summary.length > 150 ? summary.slice(0, 150) + '...' : summary}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
