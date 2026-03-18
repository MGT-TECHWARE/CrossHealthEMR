import { useState, useEffect, useCallback } from 'react'
import {
  Shield,
  Plus,
  Pencil,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  FileCheck,
  XCircle,
} from 'lucide-react'
import { supabase } from '@/services/supabase'
import { formatDate } from '@/utils/formatDate'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const INSURANCE_TYPE_OPTIONS = [
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'workers_comp', label: "Workers' Comp" },
  { value: 'auto_accident', label: 'Auto Accident' },
]

const RELATIONSHIP_OPTIONS = [
  { value: 'self', label: 'Self' },
  { value: 'spouse', label: 'Spouse' },
  { value: 'child', label: 'Child' },
  { value: 'other', label: 'Other' },
]

const VERIFICATION_STATUS_OPTIONS = [
  { value: 'verified', label: 'Verified' },
  { value: 'failed', label: 'Failed' },
  { value: 'expired', label: 'Expired' },
]

const TYPE_BADGE_VARIANT = {
  primary: 'default',
  secondary: 'outline',
  workers_comp: 'warning',
  auto_accident: 'warning',
}

const TYPE_LABELS = {
  primary: 'Primary',
  secondary: 'Secondary',
  workers_comp: "Workers' Comp",
  auto_accident: 'Auto Accident',
}

const EMPTY_FORM = {
  insurance_type: 'primary',
  payer_name: '',
  plan_name: '',
  subscriber_id: '',
  group_number: '',
  subscriber_name: '',
  subscriber_dob: '',
  subscriber_relationship: 'self',
  policy_effective_date: '',
  policy_end_date: '',
  copay_amount: '',
  coinsurance_percent: '',
  deductible_amount: '',
  out_of_pocket_max: '',
  in_network: true,
  requires_authorization: false,
  requires_referral: false,
  claim_number: '',
  date_of_injury: '',
  adjuster_name: '',
  adjuster_phone: '',
  attorney_name: '',
  attorney_phone: '',
}

const selectClassName =
  'w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-sans shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'

const textareaClassName =
  'w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-sans shadow-sm resize-none focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'

const checkboxClassName = 'rounded border-border text-primary focus:ring-primary/20'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCurrency(value) {
  if (value == null || value === '') return '--'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(value))
}

function recordToForm(record) {
  const form = { ...EMPTY_FORM }
  for (const key of Object.keys(EMPTY_FORM)) {
    if (record[key] != null) {
      if (typeof EMPTY_FORM[key] === 'boolean') {
        form[key] = Boolean(record[key])
      } else if (typeof EMPTY_FORM[key] === 'string') {
        form[key] = String(record[key])
      } else {
        form[key] = record[key]
      }
    }
  }
  return form
}

function formToPayload(form, patientId) {
  const payload = { patient_id: patientId }
  for (const [key, value] of Object.entries(form)) {
    if (typeof value === 'boolean') {
      payload[key] = value
    } else if (value === '' || value == null) {
      payload[key] = null
    } else if (
      ['copay_amount', 'coinsurance_percent', 'deductible_amount', 'out_of_pocket_max'].includes(
        key
      )
    ) {
      payload[key] = Number(value)
    } else {
      payload[key] = value
    }
  }
  return payload
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function VerificationBadge({ record }) {
  const status = record.verification_status || 'unverified'

  switch (status) {
    case 'verified':
      return (
        <Badge variant="success">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Verified{record.verification_date ? ` ${formatDate(record.verification_date)}` : ''}
        </Badge>
      )
    case 'failed':
      return (
        <Badge variant="destructive">
          <XCircle className="mr-1 h-3 w-3" />
          Verification Failed
        </Badge>
      )
    case 'expired':
      return (
        <Badge variant="warning">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Expired
        </Badge>
      )
    default:
      return (
        <Badge variant="warning">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Unverified
        </Badge>
      )
  }
}

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium font-sans text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm font-sans text-foreground mt-0.5">{value || '--'}</p>
    </div>
  )
}

function InsuranceCard({ record, onEdit, onVerify }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="p-0 overflow-hidden">
      {/* Header - always visible */}
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-secondary/40 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <Shield className="h-5 w-5 text-primary shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={TYPE_BADGE_VARIANT[record.insurance_type] || 'default'}>
                {TYPE_LABELS[record.insurance_type] || record.insurance_type}
              </Badge>
              <VerificationBadge record={record} />
            </div>
            <p className="text-base font-semibold font-sans text-foreground mt-1 truncate">
              {record.payer_name || 'Unknown Payer'}
            </p>
            {record.plan_name && (
              <p className="text-sm font-sans text-muted-foreground truncate">{record.plan_name}</p>
            )}
          </div>
        </div>
        <div className="shrink-0 ml-3 text-muted-foreground">
          {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-border/40 px-6 py-5 space-y-5">
          {/* ID / Group */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <DetailItem label="Subscriber ID" value={record.subscriber_id} />
            <DetailItem label="Group Number" value={record.group_number} />
            <DetailItem label="Copay" value={formatCurrency(record.copay_amount)} />
            <DetailItem
              label="Coinsurance"
              value={record.coinsurance_percent != null ? `${record.coinsurance_percent}%` : '--'}
            />
          </div>

          {/* Deductible */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <DetailItem label="Deductible" value={formatCurrency(record.deductible_amount)} />
            <DetailItem label="Deductible Met" value={formatCurrency(record.deductible_met)} />
            <DetailItem label="Out-of-Pocket Max" value={formatCurrency(record.out_of_pocket_max)} />
            <DetailItem
              label="Policy Dates"
              value={
                record.policy_effective_date
                  ? `${formatDate(record.policy_effective_date)}${record.policy_end_date ? ` - ${formatDate(record.policy_end_date)}` : ''}`
                  : '--'
              }
            />
          </div>

          {/* Subscriber info */}
          {(record.subscriber_name || record.subscriber_dob) && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <DetailItem label="Subscriber" value={record.subscriber_name} />
              <DetailItem
                label="Subscriber DOB"
                value={record.subscriber_dob ? formatDate(record.subscriber_dob) : null}
              />
              <DetailItem
                label="Relationship"
                value={
                  record.subscriber_relationship
                    ? record.subscriber_relationship.charAt(0).toUpperCase() +
                      record.subscriber_relationship.slice(1)
                    : null
                }
              />
            </div>
          )}

          {/* Indicators */}
          <div className="flex flex-wrap gap-2">
            {record.in_network != null && (
              <Badge variant={record.in_network ? 'success' : 'destructive'}>
                {record.in_network ? 'In Network' : 'Out of Network'}
              </Badge>
            )}
            {record.requires_authorization && (
              <Badge variant="warning">Requires Auth</Badge>
            )}
            {record.requires_referral && (
              <Badge variant="warning">Requires Referral</Badge>
            )}
          </div>

          {/* Workers comp / auto accident extra fields */}
          {(record.insurance_type === 'workers_comp' ||
            record.insurance_type === 'auto_accident') && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-border/40 pt-4">
              <DetailItem label="Claim Number" value={record.claim_number} />
              <DetailItem
                label="Date of Injury"
                value={record.date_of_injury ? formatDate(record.date_of_injury) : null}
              />
              <DetailItem label="Adjuster" value={record.adjuster_name} />
              <DetailItem label="Adjuster Phone" value={record.adjuster_phone} />
              {(record.attorney_name || record.attorney_phone) && (
                <>
                  <DetailItem label="Attorney" value={record.attorney_name} />
                  <DetailItem label="Attorney Phone" value={record.attorney_phone} />
                </>
              )}
            </div>
          )}

          {/* Verification notes */}
          {record.verification_notes && (
            <div className="border-t border-border/40 pt-4">
              <p className="text-xs font-medium font-sans text-muted-foreground uppercase tracking-wide mb-1">
                Verification Notes
              </p>
              <p className="text-sm font-sans text-foreground whitespace-pre-wrap">
                {record.verification_notes}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-border/40">
            <Button variant="outline" size="sm" onClick={() => onEdit(record)}>
              <Pencil className="mr-1.5 h-3.5 w-3.5" />
              Edit
            </Button>
            <Button variant="secondary" size="sm" onClick={() => onVerify(record)}>
              <FileCheck className="mr-1.5 h-3.5 w-3.5" />
              Verify
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Insurance Form (used inside Modal for add/edit)
// ---------------------------------------------------------------------------

function InsuranceForm({ initialData, onSubmit, onCancel, saving }) {
  const [form, setForm] = useState(initialData ? recordToForm(initialData) : { ...EMPTY_FORM })
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  function validate() {
    const errs = {}
    if (!form.payer_name.trim()) errs.payer_name = 'Payer name is required'
    if (!form.subscriber_id.trim()) errs.subscriber_id = 'Subscriber ID is required'
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    onSubmit(form)
  }

  const showExtraFields =
    form.insurance_type === 'workers_comp' || form.insurance_type === 'auto_accident'

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
      {/* Insurance Type */}
      <div>
        <label className="mb-1.5 block text-sm font-medium font-sans text-foreground/80">
          Insurance Type
        </label>
        <select
          name="insurance_type"
          value={form.insurance_type}
          onChange={handleChange}
          className={selectClassName}
        >
          {INSURANCE_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Payer / Plan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Payer Name *"
          name="payer_name"
          value={form.payer_name}
          onChange={handleChange}
          placeholder="e.g. Blue Cross Blue Shield"
          error={errors.payer_name}
        />
        <Input
          label="Plan Name"
          name="plan_name"
          value={form.plan_name}
          onChange={handleChange}
          placeholder="e.g. PPO Gold"
        />
      </div>

      {/* Subscriber ID / Group */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Subscriber ID *"
          name="subscriber_id"
          value={form.subscriber_id}
          onChange={handleChange}
          placeholder="e.g. XYZ123456"
          error={errors.subscriber_id}
        />
        <Input
          label="Group Number"
          name="group_number"
          value={form.group_number}
          onChange={handleChange}
          placeholder="e.g. GRP-001"
        />
      </div>

      {/* Subscriber Name / DOB */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Subscriber Name"
          name="subscriber_name"
          value={form.subscriber_name}
          onChange={handleChange}
          placeholder="Full name"
        />
        <Input
          label="Subscriber DOB"
          name="subscriber_dob"
          type="date"
          value={form.subscriber_dob}
          onChange={handleChange}
        />
      </div>

      {/* Subscriber Relationship */}
      <div>
        <label className="mb-1.5 block text-sm font-medium font-sans text-foreground/80">
          Subscriber Relationship
        </label>
        <select
          name="subscriber_relationship"
          value={form.subscriber_relationship}
          onChange={handleChange}
          className={selectClassName}
        >
          {RELATIONSHIP_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Policy Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Policy Effective Date"
          name="policy_effective_date"
          type="date"
          value={form.policy_effective_date}
          onChange={handleChange}
        />
        <Input
          label="Policy End Date"
          name="policy_end_date"
          type="date"
          value={form.policy_end_date}
          onChange={handleChange}
        />
      </div>

      {/* Copay / Coinsurance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Copay Amount"
          name="copay_amount"
          type="number"
          step="0.01"
          min="0"
          value={form.copay_amount}
          onChange={handleChange}
          placeholder="0.00"
        />
        <Input
          label="Coinsurance %"
          name="coinsurance_percent"
          type="number"
          min="0"
          max="100"
          value={form.coinsurance_percent}
          onChange={handleChange}
          placeholder="0"
        />
      </div>

      {/* Deductible / OOP Max */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Deductible Amount"
          name="deductible_amount"
          type="number"
          step="0.01"
          min="0"
          value={form.deductible_amount}
          onChange={handleChange}
          placeholder="0.00"
        />
        <Input
          label="Out of Pocket Max"
          name="out_of_pocket_max"
          type="number"
          step="0.01"
          min="0"
          value={form.out_of_pocket_max}
          onChange={handleChange}
          placeholder="0.00"
        />
      </div>

      {/* Checkboxes */}
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm font-sans text-foreground cursor-pointer">
          <input
            type="checkbox"
            name="in_network"
            checked={form.in_network}
            onChange={handleChange}
            className={checkboxClassName}
          />
          In Network
        </label>
        <label className="flex items-center gap-2 text-sm font-sans text-foreground cursor-pointer">
          <input
            type="checkbox"
            name="requires_authorization"
            checked={form.requires_authorization}
            onChange={handleChange}
            className={checkboxClassName}
          />
          Requires Authorization
        </label>
        <label className="flex items-center gap-2 text-sm font-sans text-foreground cursor-pointer">
          <input
            type="checkbox"
            name="requires_referral"
            checked={form.requires_referral}
            onChange={handleChange}
            className={checkboxClassName}
          />
          Requires Referral
        </label>
      </div>

      {/* Conditional fields for workers comp / auto accident */}
      {showExtraFields && (
        <div className="space-y-4 border-t border-border/40 pt-4">
          <p className="text-sm font-semibold font-sans text-foreground">
            {form.insurance_type === 'workers_comp' ? "Workers' Comp" : 'Auto Accident'} Details
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Claim Number"
              name="claim_number"
              value={form.claim_number}
              onChange={handleChange}
              placeholder="Claim #"
            />
            <Input
              label="Date of Injury"
              name="date_of_injury"
              type="date"
              value={form.date_of_injury}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Adjuster Name"
              name="adjuster_name"
              value={form.adjuster_name}
              onChange={handleChange}
              placeholder="Adjuster name"
            />
            <Input
              label="Adjuster Phone"
              name="adjuster_phone"
              type="tel"
              value={form.adjuster_phone}
              onChange={handleChange}
              placeholder="(555) 555-5555"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Attorney Name"
              name="attorney_name"
              value={form.attorney_name}
              onChange={handleChange}
              placeholder="Attorney name"
            />
            <Input
              label="Attorney Phone"
              name="attorney_phone"
              type="tel"
              value={form.attorney_phone}
              onChange={handleChange}
              placeholder="(555) 555-5555"
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-border/40">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" variant="default" size="sm" disabled={saving}>
          {saving ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Saving...
            </>
          ) : (
            'Save Insurance'
          )}
        </Button>
      </div>
    </form>
  )
}

// ---------------------------------------------------------------------------
// Verify Form (used inside Modal)
// ---------------------------------------------------------------------------

function VerifyForm({ record, onSubmit, onCancel, saving }) {
  const [status, setStatus] = useState('verified')
  const [notes, setNotes] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({ verification_status: status, verification_notes: notes })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="text-sm font-sans text-muted-foreground mb-3">
          Verifying insurance for{' '}
          <span className="font-medium text-foreground">{record.payer_name}</span>
          {record.subscriber_id && (
            <>
              {' '}
              &mdash; Subscriber ID: <span className="font-medium text-foreground">{record.subscriber_id}</span>
            </>
          )}
        </p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium font-sans text-foreground/80">
          Verification Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={selectClassName}
        >
          {VERIFICATION_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium font-sans text-foreground/80">
          Verification Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Optional notes about the verification..."
          className={textareaClassName}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" variant="default" size="sm" disabled={saving}>
          {saving ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Saving...
            </>
          ) : (
            'Confirm Verification'
          )}
        </Button>
      </div>
    </form>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function InsurancePanel({ patientId }) {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Modal states
  const [formOpen, setFormOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [verifyOpen, setVerifyOpen] = useState(false)
  const [verifyingRecord, setVerifyingRecord] = useState(null)
  const [saving, setSaving] = useState(false)

  // ---------- Data fetching ----------

  const fetchRecords = useCallback(async () => {
    if (!patientId) return
    try {
      setError(null)
      const { data, error: fetchError } = await supabase
        .from('patient_insurance')
        .select('*')
        .eq('patient_id', patientId)
        .order('insurance_type')

      if (fetchError) throw fetchError
      setRecords(data || [])
    } catch (err) {
      console.error('Failed to fetch insurance records:', err)
      setError('Unable to load insurance records. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [patientId])

  useEffect(() => {
    setLoading(true)
    fetchRecords()
  }, [fetchRecords])

  // ---------- Handlers ----------

  function handleAdd() {
    setEditingRecord(null)
    setFormOpen(true)
  }

  function handleEdit(record) {
    setEditingRecord(record)
    setFormOpen(true)
  }

  function handleVerifyOpen(record) {
    setVerifyingRecord(record)
    setVerifyOpen(true)
  }

  async function handleFormSubmit(formData) {
    setSaving(true)
    try {
      const payload = formToPayload(formData, patientId)

      if (editingRecord) {
        // Update
        const { error: updateError } = await supabase
          .from('patient_insurance')
          .update(payload)
          .eq('id', editingRecord.id)

        if (updateError) throw updateError
      } else {
        // Insert
        const { error: insertError } = await supabase
          .from('patient_insurance')
          .insert(payload)

        if (insertError) throw insertError
      }

      setFormOpen(false)
      setEditingRecord(null)
      await fetchRecords()
    } catch (err) {
      console.error('Failed to save insurance record:', err)
      setError('Failed to save insurance record. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleVerifySubmit({ verification_status, verification_notes }) {
    if (!verifyingRecord) return
    setSaving(true)
    try {
      // Get the current user for verified_by
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const { error: verifyError } = await supabase
        .from('patient_insurance')
        .update({
          verification_status,
          verification_notes,
          verification_date: new Date().toISOString(),
          verified_by: user?.id || null,
        })
        .eq('id', verifyingRecord.id)

      if (verifyError) throw verifyError

      setVerifyOpen(false)
      setVerifyingRecord(null)
      await fetchRecords()
    } catch (err) {
      console.error('Failed to verify insurance:', err)
      setError('Failed to update verification status. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // ---------- Render ----------

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Spinner size="md" />
        <p className="mt-3 text-sm font-sans text-muted-foreground">Loading insurance records...</p>
      </div>
    )
  }

  return (
    <section>
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold font-sans text-foreground">Insurance</h3>
        <Button variant="outline" size="sm" onClick={handleAdd}>
          <Plus className="mr-1.5 h-4 w-4" />
          Add Insurance
        </Button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-red-50 px-4 py-3 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-sans text-destructive">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-destructive/60 hover:text-destructive text-sm font-sans"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Empty state */}
      {records.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Shield className="h-10 w-10 mb-2 text-border" />
          <p className="text-sm font-medium font-sans">No insurance on file</p>
          <p className="text-xs font-sans text-muted-foreground mt-0.5">
            Add insurance information to get started.
          </p>
        </div>
      )}

      {/* Insurance cards */}
      {records.length > 0 && (
        <div className="space-y-3">
          {records.map((record) => (
            <InsuranceCard
              key={record.id}
              record={record}
              onEdit={handleEdit}
              onVerify={handleVerifyOpen}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        open={formOpen}
        onOpenChange={(open) => {
          if (!open) {
            setFormOpen(false)
            setEditingRecord(null)
          }
        }}
        title={editingRecord ? 'Edit Insurance' : 'Add Insurance'}
      >
        <InsuranceForm
          initialData={editingRecord}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setFormOpen(false)
            setEditingRecord(null)
          }}
          saving={saving}
        />
      </Modal>

      {/* Verify Modal */}
      <Modal
        open={verifyOpen}
        onOpenChange={(open) => {
          if (!open) {
            setVerifyOpen(false)
            setVerifyingRecord(null)
          }
        }}
        title="Verify Insurance"
      >
        {verifyingRecord && (
          <VerifyForm
            record={verifyingRecord}
            onSubmit={handleVerifySubmit}
            onCancel={() => {
              setVerifyOpen(false)
              setVerifyingRecord(null)
            }}
            saving={saving}
          />
        )}
      </Modal>
    </section>
  )
}
