import { ROM_TEMPLATES, BODY_REGIONS } from '@/constants/bodyRegionTemplates'

export default function ROMTable({ regions = [], data = {}, onChange }) {
  const handleCellChange = (regionKey, movementIdx, field, value) => {
    const regionData = data[regionKey] || ROM_TEMPLATES[regionKey]?.map(() => ({ arom_left: '', arom_right: '', prom_left: '', prom_right: '' })) || []
    const updated = [...regionData]
    updated[movementIdx] = { ...updated[movementIdx], [field]: value }
    onChange({ ...data, [regionKey]: updated })
  }

  if (regions.length === 0) {
    return <p className="text-xs font-sans text-muted-foreground italic">Select body regions above to see ROM measurements.</p>
  }

  return (
    <div className="space-y-4">
      {regions.map((regionKey) => {
        const template = ROM_TEMPLATES[regionKey]
        if (!template) return null
        const regionLabel = BODY_REGIONS.find((r) => r.key === regionKey)?.label || regionKey
        const regionData = data[regionKey] || template.map(() => ({ arom_left: '', arom_right: '', prom_left: '', prom_right: '' }))

        return (
          <div key={regionKey}>
            <h4 className="text-xs font-semibold font-sans text-foreground mb-1.5">{regionLabel} ROM</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-sans border-collapse">
                <thead>
                  <tr className="border-b border-border/60">
                    <th className="text-left py-1.5 pr-2 text-muted-foreground font-medium w-36">Movement</th>
                    <th className="text-center py-1.5 px-1 text-muted-foreground font-medium w-16">Normal</th>
                    <th className="text-center py-1.5 px-1 text-muted-foreground font-medium" colSpan={2}>AROM</th>
                    <th className="text-center py-1.5 px-1 text-muted-foreground font-medium" colSpan={2}>PROM</th>
                  </tr>
                  <tr className="border-b border-border/30">
                    <th />
                    <th />
                    <th className="text-center py-1 px-1 text-muted-foreground/60 font-normal">L</th>
                    <th className="text-center py-1 px-1 text-muted-foreground/60 font-normal">R</th>
                    <th className="text-center py-1 px-1 text-muted-foreground/60 font-normal">L</th>
                    <th className="text-center py-1 px-1 text-muted-foreground/60 font-normal">R</th>
                  </tr>
                </thead>
                <tbody>
                  {template.map((row, idx) => (
                    <tr key={row.movement} className="border-b border-border/20">
                      <td className="py-1.5 pr-2 text-foreground/80">{row.movement}</td>
                      <td className="text-center py-1.5 px-1 text-muted-foreground/60">{row.normalRange}</td>
                      {['arom_left', 'arom_right', 'prom_left', 'prom_right'].map((field) => (
                        <td key={field} className="py-1 px-0.5">
                          <input
                            type="text"
                            value={regionData[idx]?.[field] || ''}
                            onChange={(e) => handleCellChange(regionKey, idx, field, e.target.value)}
                            className="w-14 rounded border border-border/50 bg-white px-1.5 py-1 text-center text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                            placeholder="—"
                          />
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
