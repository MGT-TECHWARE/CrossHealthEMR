// Color mappings for appointment payment types
export const PAYMENT_TYPE_COLORS = {
  cash: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
    label: 'Cash',
  },
  insurance: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
    label: 'Insurance',
  },
  medicare: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    dot: 'bg-purple-500',
    label: 'Medicare',
  },
  telehealth: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    label: 'Telehealth',
  },
  workers_comp: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    dot: 'bg-orange-500',
    label: 'Workers Comp',
  },
  auto: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-700',
    dot: 'bg-rose-500',
    label: 'Auto Accident',
  },
}

export const DEFAULT_COLOR = {
  bg: 'bg-primary/5',
  border: 'border-primary/20',
  text: 'text-primary',
  dot: 'bg-primary',
  label: 'Other',
}

export function getAppointmentColor(paymentType) {
  return PAYMENT_TYPE_COLORS[paymentType] || DEFAULT_COLOR
}
