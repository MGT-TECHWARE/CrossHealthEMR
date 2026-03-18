import { useState } from 'react'
import { FileText } from 'lucide-react'
import DocumentCard from './DocumentCard'

const TYPE_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'prescription', label: 'Prescriptions' },
  { value: 'imaging', label: 'Imaging' },
  { value: 'referral', label: 'Referrals' },
  { value: 'insurance_card', label: 'Insurance' },
  { value: 'other', label: 'Other' },
]

export default function DocumentList({ documents = [], onDownload, onDelete }) {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all'
    ? documents
    : documents.filter((d) => d.document_type === filter)

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-3 py-1 text-xs font-medium font-sans transition-colors ${
              filter === f.value ? 'bg-primary text-white' : 'bg-secondary text-foreground/60 hover:bg-secondary/80'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <FileText className="h-8 w-8 mb-2 text-border" />
          <p className="text-sm font-medium font-sans">No documents found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onDownload={onDownload}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
