export default function PlanSection({ data = {}, onChange }) {
  const update = (field, value) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="space-y-4">
      {/* Treatment Frequency & Duration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium font-sans text-foreground/80">
            Frequency
          </label>
          <select
            value={data.frequency || ''}
            onChange={(e) => update('frequency', e.target.value)}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm font-sans shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Select frequency...</option>
            <option value="1x/week">1x / week</option>
            <option value="2x/week">2x / week</option>
            <option value="3x/week">3x / week</option>
            <option value="4x/week">4x / week</option>
            <option value="5x/week">5x / week</option>
            <option value="1x/2weeks">1x / 2 weeks</option>
            <option value="1x/month">1x / month</option>
            <option value="prn">PRN (as needed)</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium font-sans text-foreground/80">
            Duration (weeks)
          </label>
          <select
            value={data.duration_weeks || ''}
            onChange={(e) => update('duration_weeks', e.target.value)}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm font-sans shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Select duration...</option>
            {[2, 4, 6, 8, 10, 12, 16, 20, 24].map((w) => (
              <option key={w} value={w}>{w} weeks</option>
            ))}
          </select>
        </div>
      </div>

      {/* Patient Education */}
      <div>
        <label className="mb-1.5 block text-xs font-medium font-sans text-foreground/80">
          Patient Education
        </label>
        <textarea
          value={data.patient_education || ''}
          onChange={(e) => update('patient_education', e.target.value)}
          rows={2}
          placeholder="Education provided: body mechanics, posture, activity modification..."
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-xs font-sans shadow-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
        />
      </div>

      {/* HEP Summary */}
      <div>
        <label className="mb-1.5 block text-xs font-medium font-sans text-foreground/80">
          Home Exercise Program Summary
        </label>
        <textarea
          value={data.hep_summary || ''}
          onChange={(e) => update('hep_summary', e.target.value)}
          rows={2}
          placeholder="Summary of home exercises prescribed..."
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-xs font-sans shadow-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
        />
      </div>

      {/* Next Visit Plan */}
      <div>
        <label className="mb-1.5 block text-xs font-medium font-sans text-foreground/80">
          Next Visit Plan
        </label>
        <textarea
          value={data.next_visit_plan || ''}
          onChange={(e) => update('next_visit_plan', e.target.value)}
          rows={3}
          placeholder="Plan for next session: continue current interventions, progress exercises, reassess ROM..."
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm font-sans shadow-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
        />
      </div>

      {/* Additional Notes */}
      <div>
        <label className="mb-1.5 block text-xs font-medium font-sans text-foreground/80">
          Additional Plan Notes
        </label>
        <textarea
          value={data.free_text || ''}
          onChange={(e) => update('free_text', e.target.value)}
          rows={2}
          placeholder="Referrals, precautions, coordination of care..."
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-xs font-sans shadow-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
        />
      </div>
    </div>
  )
}
