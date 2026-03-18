import { MMT_TEMPLATES, MMT_GRADES, BODY_REGIONS } from '@/constants/bodyRegionTemplates'

export default function MMTGrid({ regions = [], data = {}, onChange }) {
  const handleChange = (regionKey, muscleIdx, side, value) => {
    const regionData = data[regionKey] || MMT_TEMPLATES[regionKey]?.map(() => ({ left: '', right: '' })) || []
    const updated = [...regionData]
    updated[muscleIdx] = { ...updated[muscleIdx], [side]: value }
    onChange({ ...data, [regionKey]: updated })
  }

  if (regions.length === 0) {
    return <p className="text-xs font-sans text-muted-foreground italic">Select body regions above to see MMT grading.</p>
  }

  return (
    <div className="space-y-4">
      {regions.map((regionKey) => {
        const template = MMT_TEMPLATES[regionKey]
        if (!template) return null
        const regionLabel = BODY_REGIONS.find((r) => r.key === regionKey)?.label || regionKey
        const regionData = data[regionKey] || template.map(() => ({ left: '', right: '' }))

        return (
          <div key={regionKey}>
            <h4 className="text-xs font-semibold font-sans text-foreground mb-1.5">{regionLabel} MMT</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-sans border-collapse">
                <thead>
                  <tr className="border-b border-border/60">
                    <th className="text-left py-1.5 pr-2 text-muted-foreground font-medium w-40">Muscle</th>
                    <th className="text-center py-1.5 px-1 text-muted-foreground font-medium w-24">Left</th>
                    <th className="text-center py-1.5 px-1 text-muted-foreground font-medium w-24">Right</th>
                  </tr>
                </thead>
                <tbody>
                  {template.map((row, idx) => (
                    <tr key={row.muscle} className="border-b border-border/20">
                      <td className="py-1.5 pr-2 text-foreground/80">{row.muscle}</td>
                      {['left', 'right'].map((side) => (
                        <td key={side} className="py-1 px-0.5">
                          <select
                            value={regionData[idx]?.[side] || ''}
                            onChange={(e) => handleChange(regionKey, idx, side, e.target.value)}
                            className="w-full rounded border border-border/50 bg-white px-1 py-1 text-xs text-center focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                          >
                            <option value="">—</option>
                            {MMT_GRADES.map((g) => (
                              <option key={g.value} value={g.value}>{g.value}</option>
                            ))}
                          </select>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
    </div>
  )
}
