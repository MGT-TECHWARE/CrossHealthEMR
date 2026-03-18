import { useState, useRef } from 'react'
import { Upload, X } from 'lucide-react'
import Button from '@/components/ui/Button'

const DOCUMENT_TYPES = [
  { value: 'prescription', label: 'Prescription' },
  { value: 'intake_form', label: 'Intake Form' },
  { value: 'imaging', label: 'Imaging Results' },
  { value: 'lab_results', label: 'Lab Results' },
  { value: 'referral', label: 'Referral' },
  { value: 'insurance_card', label: 'Insurance Card' },
  { value: 'id_card', label: 'ID Card' },
  { value: 'consent_form', label: 'Consent Form' },
  { value: 'medical_records', label: 'Medical Records' },
  { value: 'other', label: 'Other' },
]

export default function DocumentUpload({ onUpload, isUploading }) {
  const fileRef = useRef(null)
  const [file, setFile] = useState(null)
  const [documentType, setDocumentType] = useState('other')
  const [description, setDescription] = useState('')
  const [dragOver, setDragOver] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) setFile(dropped)
  }

  const handleSubmit = () => {
    if (!file) return
    onUpload({ file, documentType, description })
    setFile(null)
    setDescription('')
    setDocumentType('other')
  }

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragOver ? 'border-primary bg-primary/5' : 'border-border/60 hover:border-primary/40'
        }`}
      >
        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        {file ? (
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm font-sans text-foreground">{file.name}</span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setFile(null) }}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm font-sans text-foreground/70">Drop file here or click to browse</p>
            <p className="text-xs font-sans text-muted-foreground mt-1">PDF, images, documents up to 10MB</p>
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
        />
      </div>

      {file && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium font-sans text-foreground/80">Document Type</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm font-sans shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {DOCUMENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium font-sans text-foreground/80">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description..."
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm font-sans shadow-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <Button onClick={handleSubmit} disabled={isUploading} className="w-full gap-2">
            <Upload className="h-4 w-4" />
            {isUploading ? 'Uploading...' : 'Upload Document'}
          </Button>
        </>
      )}
    </div>
  )
}
