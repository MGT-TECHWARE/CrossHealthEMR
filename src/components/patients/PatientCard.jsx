import Card from '@/components/ui/Card'
import { formatDate } from '@/utils/formatDate'

function getInitials(firstName, lastName) {
  const first = firstName?.[0]?.toUpperCase() || ''
  const last = lastName?.[0]?.toUpperCase() || ''
  return `${first}${last}`
}

export default function PatientCard({ patient, onClick }) {
  const {
    first_name,
    last_name,
    date_of_birth,
    last_visit,
    primary_diagnosis_description,
    phone,
  } = patient

  const initials = getInitials(first_name, last_name)

  return (
    <Card
      className="p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick?.(patient)}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center h-11 w-11 rounded-full bg-primary/10 text-primary font-semibold text-sm font-sans shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold font-sans text-foreground truncate">
            {first_name} {last_name}
          </h4>
          {date_of_birth && (
            <p className="text-xs font-sans text-muted-foreground">
              DOB: {formatDate(date_of_birth)}
            </p>
          )}
          {primary_diagnosis_description && (
            <p className="text-xs font-sans text-muted-foreground/70 truncate">
              {primary_diagnosis_description}
            </p>
          )}
          {!date_of_birth && phone && (
            <p className="text-xs font-sans text-muted-foreground">
              {phone}
            </p>
          )}
          {last_visit && (
            <p className="text-xs font-sans text-muted-foreground/60">
              Last visit: {formatDate(last_visit)}
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}
