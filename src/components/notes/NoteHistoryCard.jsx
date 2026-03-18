import { Clock, CheckCircle, FileText, AlertCircle, Edit } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { formatDate } from '@/utils/formatDate'
import { NOTE_TYPE_LABELS, NOTE_STATUS_LABELS } from '@/constants/noteTypes'

export default function NoteHistoryCard({ note, onClick }) {
  const isSigned = note.status === 'signed'
  const subj = note.subjective_data || {}

  const statusVariant =
    note.status === 'signed' ? 'success' :
    note.status === 'completed' ? 'default' :
    note.status === 'amended' ? 'warning' :
    'outline'

  const statusIcon =
    note.status === 'signed' ? <CheckCircle className="h-3 w-3" /> :
    note.status === 'completed' ? <FileText className="h-3 w-3" /> :
    note.status === 'amended' ? <Edit className="h-3 w-3" /> :
    <AlertCircle className="h-3 w-3" />

  const summary =
    subj.chief_complaint ||
    note.assessment ||
    note.subjective ||
    'No summary available'

  return (
    <div
      onClick={() => onClick?.(note)}
      className="border border-border/60 rounded-lg p-4 bg-white hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px]">
            {NOTE_TYPE_LABELS[note.note_type] || 'Note'}
          </Badge>
          <Badge variant={statusVariant} className="gap-1 text-[10px]">
            {statusIcon}
            {NOTE_STATUS_LABELS[note.status] || note.status || 'Draft'}
          </Badge>
        </div>
        <div className="flex items-center gap-1 text-xs font-sans text-muted-foreground">
          <Clock className="h-3 w-3" />
          {formatDate(note.created_at)}
        </div>
      </div>

      <p className="text-sm font-sans text-foreground/80 line-clamp-2">
        {summary.length > 150 ? summary.slice(0, 150) + '...' : summary}
      </p>

      {isSigned && note.signed_by_name && (
        <p className="text-[10px] font-sans text-muted-foreground mt-2 flex items-center gap-1">
          <CheckCircle className="h-3 w-3 text-emerald-500" />
          Signed by {note.signed_by_name}
        </p>
      )}
    </div>
  )
}
