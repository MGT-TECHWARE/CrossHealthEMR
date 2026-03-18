import Card from '@/components/ui/Card'
import { formatDate } from '@/utils/formatDate'

function truncate(text, maxLength = 80) {
  if (!text) return ''
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}

export default function NoteHistoryCard({ note }) {
  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-900">
          {formatDate(note.created_at)}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium text-blue-600">Subjective</p>
          <p className="text-sm text-gray-600">
            {truncate(note.subjective) || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-blue-600">Objective</p>
          <p className="text-sm text-gray-600">
            {truncate(note.objective) || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-blue-600">Assessment</p>
          <p className="text-sm text-gray-600">
            {truncate(note.assessment) || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-blue-600">Plan</p>
          <p className="text-sm text-gray-600">
            {truncate(note.plan) || 'N/A'}
          </p>
        </div>
      </div>
    </Card>
  )
}
