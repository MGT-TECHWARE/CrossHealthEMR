import { Activity } from 'lucide-react'

export default function TreatmentPlanSection({ data = {}, onChange, authorization }) {
  const update = (field, value) => {
    onChange({ ...data, [field]: value })
  }

  const totalVisits = data.frequency && data.duration_weeks
    ? calculateVisits(data.frequency, data.duration_weeks)
    : null

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Activity className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold font-sans text-foreground">Treatment Plan</h3>
      </div>

      {/* Frequency & Duration */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium font-sans text-foreground/80">Frequency</label>
          <select
            value={data.frequency || ''}
            onChange={(e) => update('frequency', e.target.value)}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm font-sans shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Select...</option>
            <option value="1x/week">1x / week</option>
            <option value="2x/week">2x / week</option>
            <option value="3x/week">3x / week</option>
            <option value="4x/week">4x / week</option>
            <option value="5x/week">5x / week</option>
            <option value="1x/2weeks">1x / 2 weeks</option>
            <option value="1x/month">1x / month</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium font-sans text-foreground/80">Duration (weeks)</label>
          <select
            value={data.duration_weeks || ''}
            onChange={(e) => update('duration_weeks', e.target.value ? Number(e.target.value) : '')}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm font-sans shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Select...</option>
            {[2, 4, 6, 8, 10, 12, 16, 20, 24].map((w) => (
              <option key={w} value={w}>{w} weeks</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium font-sans text-foreground/80">Est. Total Visits</label>
          <div className="rounded-lg border border-border/50 bg-secondary/30 px-3 py-2 text-sm font-sans text-foreground/80">
            {totalVisits || '—'}
          </div>
        </div>
      </div>

      {/* Authorization link */}
      {authorization && (
        <div className="rounded-lg border border-border/60 bg-secondary/20 p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium font-sans text-foreground/80">Authorization</span>
            <span className="text-xs font-sans text-muted-foreground">#{authorization.auth_number}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${Math.min(100, (authorization.visits_used / authorization.authorized_visits) * 100)}%` }}
                />
              </div>
            </div>
            <span className="text-xs font-mono font-medium text-foreground">
              {authorization.visits_used}/{authorization.authorized_visits}
            </span>
          </div>
        </div>
      )}

      {/* Goal tracking */}
      <div>
        <label className="mb-1 block text-xs font-medium font-sans text-foreground/80">
          Progress Note Due
        </label>
        <select
          value={data.progress_note_interval || ''}
          onChange={(e) => update('progress_note_interval', e.target.value)}
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm font-sans shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">Select interval...</option>
          <option value="every_10">Every 10 visits</option>
          <option value="every_30_days">Every 30 days</option>
          <option value="every_60_days">Every 60 days</option>
          <option value="at_recert">At re-certification</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium font-sans text-foreground/80">
          Additional Treatment Plan Notes
        </label>
        <textarea
          value={data.notes || ''}
          onChange={(e) => update('notes', e.target.value)}
          rows={2}
          placeholder="Treatment plan specifics, progressions, precautions..."
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-xs font-sans shadow-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
        />
      </div>
    </div>
  )
}

function calculateVisits(frequency, weeks) {
  const freqMap = {
    '1x/week': 1,
    '2x/week': 2,
    '3x/week': 3,
    '4x/week': 4,
    '5x/week': 5,
    '1x/2weeks': 0.5,
    '1x/month': 0.25,
  }
  const perWeek = freqMap[frequency] || 0
  return Math.round(perWeek * weeks)
}
