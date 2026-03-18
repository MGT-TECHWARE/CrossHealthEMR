import Badge from '@/components/ui/Badge'

const roleConfig = {
  admin: { variant: 'gold', label: 'Admin' },
  pt: { variant: 'default', label: 'Physical Therapist' },
}

export default function RoleBadge({ role }) {
  const config = roleConfig[role] || { variant: 'default', label: role }

  return <Badge variant={config.variant}>{config.label}</Badge>
}
