import { SPECIAL_TEST_TEMPLATES, SPECIAL_TEST_RESULTS, BODY_REGIONS } from '@/constants/bodyRegionTemplates'

export default function SpecialTestChecklist({ regions = [], data = {}, onChange }) {
  const handleChange = (regionKey, testIdx, value) => {
    const regionData = data[regionKey] || SPECIAL_TEST_TEMPLATES[regionKey]?.map(() => ({ result: 'not_tested', notes: '' })) || []
    const updated = [...regionData]
    updated[testIdx] = { ...updated[testIdx], result: value }
    onChange({ ...data, [regionKey]: updated })
  }

  const handleNotes = (regionKey, testIdx, notes) => {
    const regionData = data[regionKey] || SPECIAL_TEST_TEMPLATES[regionKey]?.map(() => ({ result: 'not_tested', notes: '' })) || []
    const updated = [...regionData]
    updated[testIdx] = { ...updated[testIdx], notes }
    onChange({ ...data, [regionKey]: updated })
  }

  if (regions.length === 0) {
    return <p className="text-xs font-sans text-muted-foreground italic">Select body regions above to see special tests.</p>
  }

  return (
    <div className="space-y-4">
      {regions.map((regionKey) => {
        const template = SPECIAL_TEST_TEMPLATES[regionKey]
        if (!template) return null
        const regionLabel = BODY_REGIONS.find((r) => r.key === regionKey)?.label || regionKey
        const regionData = data[regionKey] || template.map(() => ({ result: 'not_tested', notes: '' }))

        return (
          <div key={regionKey}>
            <h4 className="text-xs font-semibold font-sans text-foreground mb-1.5">{regionLabel} Special Tests</h4>
            <div className="space-y-1.5">
              {template.map((row, idx) => {
                const result = regionData[idx]?.result || 'not_tested'
                const resultColor =
                  result === 'positive' ? 'text-red-600 bg-red-50 border-red-200' :
                  result === 'negative' ? 'text-emerald-600 bg-emerald-50 border-emerald-200' :
                  result === 'equivocal' ? 'text-amber-600 bg-amber-50 border-amber-200' :
                  'text-muted-foreground bg-secondary/50 border-border/40'

                return (
                  <div key={row.test} className="flex items-center gap-2">
                    <span className="text-xs font-sans text-foreground/80 w-44 shrink-0">{row.test}</span>
                    <div className="flex gap-1">
                      {SPECIAL_TEST_RESULTS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleChange(regionKey, idx, opt.value)}
                          className={`rounded px-2 py-0.5 text-[10px] font-medium font-sans border transition-colors ${
                            result === opt.value ? resultColor : 'text-muted-foreground/60 bg-white border-border/30 hover:bg-secondary/50'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={regionData[idx]?.notes || ''}
                      onChange={(e) => handleNotes(regionKey, idx, e.target.value)}
                      placeholder="Notes..."
                      className="flex-1 min-w-0 rounded border border-border/40 bg-white px-2 py-0.5 text-[10px] font-sans focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
