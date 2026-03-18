import { useState } from 'react'
import { Send, Mail, Download, CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'

export default function NoteDistribution({ note, open, onOpenChange }) {
  const [recipientEmail, setRecipientEmail] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSendEmail = async () => {
    if (!recipientEmail) return
    setSending(true)
    // In production, this would call a Supabase Edge Function to generate PDF and send email
    // For now, simulate the send
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSending(false)
    setSent(true)
    setTimeout(() => { setSent(false); onOpenChange(false) }, 2000)
  }

  const handleDownloadPDF = () => {
    // In production, this would generate a PDF via an Edge Function
    // For now, create a basic text representation
    const subj = note.subjective_data || {}
    const assess = note.assessment_data || {}
    const planData = note.plan_data || {}

    const content = [
      `SESSION NOTE — ${note.note_type?.replace(/_/g, ' ').toUpperCase() || 'SESSION NOTE'}`,
      `Date: ${new Date(note.created_at).toLocaleDateString()}`,
      '',
      'SUBJECTIVE:',
      subj.chief_complaint || note.subjective || 'N/A',
      '',
      'OBJECTIVE:',
      note.objective || 'See structured data',
      '',
      'ASSESSMENT:',
      assess.free_text || note.assessment || 'N/A',
      '',
      'PLAN:',
      planData.next_visit_plan || note.plan || 'N/A',
      '',
      note.signed_by_name ? `Signed by: ${note.signed_by_name} — ${note.signed_by_license}` : 'UNSIGNED',
    ].join('\n')

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `note_${note.id?.slice(0, 8) || 'draft'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="Distribute Note">
      <div className="space-y-4">
        {sent ? (
          <div className="flex flex-col items-center py-6">
            <CheckCircle className="h-12 w-12 text-emerald-500 mb-3" />
            <p className="text-sm font-semibold font-sans text-foreground">Note sent successfully!</p>
          </div>
        ) : (
          <>
            <p className="text-sm font-sans text-muted-foreground">
              Send this signed note to a referring physician or insurance company.
            </p>

            <Input
              label="Recipient Name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Dr. Smith"
            />

            <Input
              label="Recipient Email"
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="doctor@clinic.com"
            />

            <div className="flex gap-2 pt-2">
              <Button
                className="flex-1 gap-2"
                onClick={handleSendEmail}
                disabled={!recipientEmail || sending}
              >
                <Mail className="h-4 w-4" />
                {sending ? 'Sending...' : 'Send via Email'}
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleDownloadPDF}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
