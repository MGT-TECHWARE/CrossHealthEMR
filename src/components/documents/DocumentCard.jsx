import { FileText, Download, Trash2, Clock } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { formatDate } from '@/utils/formatDate'

const TYPE_LABELS = {
  prescription: 'Prescription',
  intake_form: 'Intake Form',
  imaging: 'Imaging',
  lab_results: 'Lab Results',
  referral: 'Referral',
  insurance_card: 'Insurance Card',
  id_card: 'ID Card',
  consent_form: 'Consent',
  medical_records: 'Med Records',
  other: 'Other',
}

export default function DocumentCard({ document, onDownload, onDelete }) {
  const isExpired = document.expiration_date && new Date(document.expiration_date) < new Date()
  const sizeKB = document.file_size ? Math.round(document.file_size / 1024) : null

  return (
    <div className="border border-border/60 rounded-lg p-3 bg-white hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 min-w-0">
          <div className="rounded-lg bg-primary/10 p-2 shrink-0">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium font-sans text-foreground truncate">{document.file_name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="outline" className="text-[10px]">
                {TYPE_LABELS[document.document_type] || document.document_type}
              </Badge>
              {isExpired && <Badge variant="destructive" className="text-[10px]">Expired</Badge>}
              {sizeKB && <span className="text-[10px] text-muted-foreground">{sizeKB} KB</span>}
            </div>
            {document.description && (
              <p className="text-xs font-sans text-muted-foreground mt-1 line-clamp-1">{document.description}</p>
            )}
            <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatDate(document.created_at)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onDownload?.(document)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            title="Download"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete?.(document)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-50 hover:text-destructive transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
