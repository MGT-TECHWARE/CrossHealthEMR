import { User, Calendar, Phone, Clock, Mail, Shield, MapPin, AlertCircle } from 'lucide-react'
import { formatDate } from '@/utils/formatDate'

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border/40 last:border-0">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div>
        <p className="text-xs font-medium font-sans text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="text-sm font-sans text-foreground mt-0.5">{value}</p>
      </div>
    </div>
  )
}

export default function PatientInfoPanel({ patient }) {
  if (!patient) {
    return (
      <div className="p-6 text-center text-muted-foreground text-sm font-sans">
        No patient selected.
      </div>
    )
  }

  const fullName = [patient.first_name, patient.last_name].filter(Boolean).join(' ')
  const initials =
    (patient.first_name?.[0]?.toUpperCase() || '') +
    (patient.last_name?.[0]?.toUpperCase() || '')

  return (
    <aside className="w-full bg-white border border-border/60 rounded-xl shadow-sm">
      <div className="p-4 sm:p-6 border-b border-border/40">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 text-primary font-bold text-lg font-sans">
            {initials}
          </div>
          <div>
            <h2 className="text-lg font-semibold font-sans text-foreground">{fullName}</h2>
            <p className="text-sm font-sans text-muted-foreground">Patient</p>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-2">
        <InfoRow icon={Calendar} label="Date of Birth" value={patient.date_of_birth ? formatDate(patient.date_of_birth) : null} />
        <InfoRow icon={Phone} label="Phone" value={patient.phone} />
        <InfoRow icon={Mail} label="Email" value={patient.email} />
        <InfoRow icon={MapPin} label="Address" value={patient.address} />
        <InfoRow icon={Shield} label="Insurance" value={
          patient.insurance_provider
            ? `${patient.insurance_provider}${patient.insurance_id ? ` — ${patient.insurance_id}` : ''}`
            : null
        } />
        <InfoRow icon={AlertCircle} label="Emergency Contact" value={
          patient.emergency_contact_name
            ? `${patient.emergency_contact_name}${patient.emergency_contact_phone ? ` — ${patient.emergency_contact_phone}` : ''}`
            : null
        } />
        <InfoRow icon={Clock} label="Patient Since" value={patient.created_at ? formatDate(patient.created_at) : null} />
      </div>

      {patient.medical_notes && (
        <div className="px-4 sm:px-6 pb-4">
          <p className="text-xs font-medium font-sans text-muted-foreground uppercase tracking-wide mb-1">Medical Notes</p>
          <p className="text-sm font-sans text-foreground whitespace-pre-wrap">{patient.medical_notes}</p>
        </div>
      )}
    </aside>
  )
}
