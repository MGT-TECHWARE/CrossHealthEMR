import { useState } from 'react'
import { FileCheck, Plus, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import { formatDate } from '@/utils/formatDate'

function getExpirationStatus(expirationDate) {
  if (!expirationDate) return { variant: 'outline', label: 'No expiration', icon: Clock }
  const now = new Date()
  const exp = new Date(expirationDate)
  const daysLeft = Math.ceil((exp - now) / (1000 * 60 * 60 * 24))

  if (daysLeft < 0) return { variant: 'destructive', label: 'Expired', icon: XCircle, color: 'text-red-600' }
  if (daysLeft <= 14) return { variant: 'warning', label: `${daysLeft}d left`, icon: AlertTriangle, color: 'text-amber-600' }
  return { variant: 'success', label: `${daysLeft}d left`, icon: CheckCircle, color: 'text-emerald-600' }
}

export default function PrescriptionTracker({ prescriptions = [], onCreate, isLoading }) {
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    physician_name: '',
    prescription_date: '',
    expiration_date: '',
    visits_authorized: '',
    frequency: '',
    notes: '',
  })

  const handleSubmit = async () => {
    await onCreate?.({
      ...form,
      visits_authorized: form.visits_authorized ? Number(form.visits_authorized) : null,
    })
    setShowModal(false)
    setForm({ physician_name: '', prescription_date: '', expiration_date: '', visits_authorized: '', frequency: '', notes: '' })
  }

  const active = prescriptions.filter((p) => p.status === 'active')
  const inactive = prescriptions.filter((p) => p.status !== 'active')

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileCheck className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold font-sans text-foreground">Prescriptions</h3>
        </div>
        <Button size="sm" variant="outline" className="gap-1" onClick={() => setShowModal(true)}>
          <Plus className="h-3.5 w-3.5" />
          Add Rx
        </Button>
      </div>

      {prescriptions.length === 0 ? (
        <p className="text-xs font-sans text-muted-foreground py-4 text-center">No prescriptions on file.</p>
      ) : (
        <div className="space-y-2">
          {active.map((rx) => {
            const status = getExpirationStatus(rx.expiration_date)
            const StatusIcon = status.icon
            return (
              <div key={rx.id} className="border border-border/60 rounded-lg p-3 bg-white">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium font-sans text-foreground">{rx.physician_name}</p>
                    <p className="text-xs font-sans text-muted-foreground">
                      Rx date: {formatDate(rx.prescription_date)}
                      {rx.visits_authorized && ` | ${rx.visits_authorized} visits`}
                      {rx.frequency && ` | ${rx.frequency}`}
                    </p>
                  </div>
                  <Badge variant={status.variant} className="gap-1 text-[10px]">
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </Badge>
                </div>
                {rx.notes && <p className="text-xs font-sans text-muted-foreground mt-1">{rx.notes}</p>}
              </div>
            )
          })}
          {inactive.length > 0 && (
            <div className="pt-2">
              <p className="text-[10px] font-medium font-sans text-muted-foreground mb-1">Past Prescriptions</p>
              {inactive.map((rx) => (
                <div key={rx.id} className="border border-border/30 rounded-lg p-2 bg-secondary/20 mb-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-sans text-muted-foreground">{rx.physician_name} — {formatDate(rx.prescription_date)}</span>
                    <Badge variant="outline" className="text-[10px]">{rx.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <Modal open={showModal} onOpenChange={setShowModal} title="Add Prescription">
        <div className="space-y-3">
          <Input
            label="Physician Name"
            value={form.physician_name}
            onChange={(e) => setForm((f) => ({ ...f, physician_name: e.target.value }))}
            placeholder="Dr. Smith"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Prescription Date"
              type="date"
              value={form.prescription_date}
              onChange={(e) => setForm((f) => ({ ...f, prescription_date: e.target.value }))}
            />
            <Input
              label="Expiration Date"
              type="date"
              value={form.expiration_date}
              onChange={(e) => setForm((f) => ({ ...f, expiration_date: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Visits Authorized"
              type="number"
              value={form.visits_authorized}
              onChange={(e) => setForm((f) => ({ ...f, visits_authorized: e.target.value }))}
              placeholder="e.g. 24"
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium font-sans text-foreground/80">Frequency</label>
              <select
                value={form.frequency}
                onChange={(e) => setForm((f) => ({ ...f, frequency: e.target.value }))}
                className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm font-sans shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select...</option>
                <option value="1x/week">1x/week</option>
                <option value="2x/week">2x/week</option>
                <option value="3x/week">3x/week</option>
                <option value="as needed">As needed</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium font-sans text-foreground/80">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={2}
              placeholder="Any additional notes..."
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm font-sans shadow-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>
          <Button onClick={handleSubmit} className="w-full" disabled={!form.physician_name || !form.prescription_date}>
            Save Prescription
          </Button>
        </div>
      </Modal>
    </div>
  )
}
