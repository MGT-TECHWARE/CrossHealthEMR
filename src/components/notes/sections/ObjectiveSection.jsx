import { useState } from 'react'
import BodyRegionSelector from './BodyRegionSelector'
import ROMTable from './ROMTable'
import MMTGrid from './MMTGrid'
import SpecialTestChecklist from './SpecialTestChecklist'

const OBJ_TABS = [
  { key: 'rom', label: 'ROM' },
  { key: 'mmt', label: 'MMT' },
  { key: 'special', label: 'Special Tests' },
  { key: 'other', label: 'Other' },
]

export default function ObjectiveSection({ data = {}, onChange }) {
  const [activeTab, setActiveTab] = useState('rom')

  const update = (field, value) => {
    onChange({ ...data, [field]: value })
  }

  const regions = data.body_regions || []

  return (
    <div className="space-y-4">
      {/* Body Region Selector */}
      <BodyRegionSelector
        selected={regions}
        onChange={(val) => update('body_regions', val)}
      />

      {/* Sub-tabs for objective exam */}
      <div className="flex gap-1 border-b border-border/60">
        {OBJ_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1.5 text-xs font-medium font-sans border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ROM Table */}
      {activeTab === 'rom' && (
        <ROMTable
          regions={regions}
          data={data.rom || {}}
          onChange={(val) => update('rom', val)}
        />
      )}

      {/* MMT Grid */}
      {activeTab === 'mmt' && (
        <MMTGrid
          regions={regions}
          data={data.mmt || {}}
          onChange={(val) => update('mmt', val)}
        />
      )}

      {/* Special Tests */}
      {activeTab === 'special' && (
        <SpecialTestChecklist
          regions={regions}
          data={data.special_tests || {}}
          onChange={(val) => update('special_tests', val)}
        />
      )}

      {/* Other Objective Findings */}
      {activeTab === 'other' && (
        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium font-sans text-foreground/80">
              Observation / Posture
            </label>
            <textarea
              value={data.observation || ''}
              onChange={(e) => update('observation', e.target.value)}
              rows={2}
              placeholder="Posture, gait observation, visible deformities, swelling..."
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-xs font-sans shadow-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium font-sans text-foreground/80">
              Palpation
            </label>
            <textarea
              value={data.palpation || ''}
              onChange={(e) => update('palpation', e.target.value)}
              rows={2}
              placeholder="Tenderness, trigger points, muscle spasm, tissue quality..."
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-xs font-sans shadow-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium font-sans text-foreground/80">
              Sensation
            </label>
            <textarea
              value={data.sensation || ''}
              onChange={(e) => update('sensation', e.target.value)}
              rows={2}
              placeholder="Dermatome testing, light touch, proprioception..."
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-xs font-sans shadow-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium font-sans text-foreground/80">
                Functional Testing
              </label>
              <textarea
                value={data.functional_testing || ''}
                onChange={(e) => update('functional_testing', e.target.value)}
                rows={2}
                placeholder="Sit-to-stand, reaching, lifting..."
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-xs font-sans shadow-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium font-sans text-foreground/80">
                Balance / Gait
              </label>
              <textarea
                value={data.balance_gait || ''}
                onChange={(e) => update('balance_gait', e.target.value)}
                rows={2}
                placeholder="Gait pattern, balance tests, assistive device..."
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-xs font-sans shadow-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
