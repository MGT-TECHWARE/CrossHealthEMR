import { useState } from 'react'
import { Settings, User, Building2, Bell, Shield, Palette } from 'lucide-react'
import PageContainer from '@/components/layout/PageContainer'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { useAuthStore } from '@/stores/authStore'

const TABS = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'clinic', label: 'Clinic Info', icon: Building2 },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'security', label: 'Security', icon: Shield },
  { key: 'appearance', label: 'Appearance', icon: Palette },
]

function ProfileSection({ user }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary text-xl font-bold font-sans">
          {(user?.first_name?.[0] || '').toUpperCase()}{(user?.last_name?.[0] || '').toUpperCase()}
        </div>
        <div>
          <h3 className="text-lg font-semibold font-sans text-foreground">
            {user?.first_name} {user?.last_name}
          </h3>
          <p className="text-sm font-sans text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium font-sans text-foreground/80">First Name</label>
          <input
            type="text"
            defaultValue={user?.first_name || ''}
            className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-sans shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium font-sans text-foreground/80">Last Name</label>
          <input
            type="text"
            defaultValue={user?.last_name || ''}
            className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-sans shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium font-sans text-foreground/80">Email</label>
          <input
            type="email"
            defaultValue={user?.email || ''}
            disabled
            className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm font-sans shadow-sm text-muted-foreground cursor-not-allowed"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium font-sans text-foreground/80">Phone</label>
          <input
            type="tel"
            defaultValue={user?.phone || ''}
            placeholder="(555) 123-4567"
            className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-sans shadow-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium font-sans text-foreground/80">License Number</label>
          <input
            type="text"
            defaultValue={user?.license_number || ''}
            placeholder="PT-12345"
            className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-sans shadow-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium font-sans text-foreground/80">NPI</label>
          <input
            type="text"
            defaultValue={user?.npi || ''}
            placeholder="1234567890"
            className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-sans shadow-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <Button disabled>Save Changes</Button>
    </div>
  )
}

function ClinicSection() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium font-sans text-foreground/80">Clinic Name</label>
          <input
            type="text"
            defaultValue="CrossHealth Physical Therapy"
            className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-sans shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium font-sans text-foreground/80">Address</label>
          <input
            type="text"
            placeholder="123 Main St, Suite 100"
            className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-sans shadow-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium font-sans text-foreground/80">Phone</label>
          <input
            type="tel"
            placeholder="(555) 000-0000"
            className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-sans shadow-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium font-sans text-foreground/80">Fax</label>
          <input
            type="tel"
            placeholder="(555) 000-0001"
            className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-sans shadow-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium font-sans text-foreground/80">Tax ID / EIN</label>
          <input
            type="text"
            placeholder="XX-XXXXXXX"
            className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-sans shadow-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium font-sans text-foreground/80">Default Session Duration</label>
          <select className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-sans shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60" selected>60 minutes</option>
            <option value="90">90 minutes</option>
          </select>
        </div>
      </div>

      <Button disabled>Save Changes</Button>
    </div>
  )
}

function NotificationsSection() {
  return (
    <div className="space-y-4">
      {[
        { label: 'Appointment Reminders', desc: 'Send email reminders to patients before appointments' },
        { label: 'Session Summary', desc: 'Email a daily summary of completed sessions' },
        { label: 'Authorization Alerts', desc: 'Get notified when authorizations are running low' },
        { label: 'Prescription Expiration', desc: 'Alert when prescriptions are about to expire' },
        { label: 'New Patient Intake', desc: 'Notify when a new patient completes intake form' },
      ].map((item) => (
        <div key={item.label} className="flex items-center justify-between py-3 border-b border-border/40 last:border-0">
          <div>
            <p className="text-sm font-medium font-sans text-foreground">{item.label}</p>
            <p className="text-xs font-sans text-muted-foreground">{item.desc}</p>
          </div>
          <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-border transition-colors">
            <span className="inline-block h-4 w-4 rounded-full bg-white shadow-sm transform translate-x-1 transition-transform" />
          </button>
        </div>
      ))}

      <Button disabled>Save Preferences</Button>
    </div>
  )
}

function SecuritySection() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold font-sans text-foreground mb-3">Change Password</h3>
        <div className="space-y-3 max-w-md">
          <div>
            <label className="mb-1.5 block text-sm font-medium font-sans text-foreground/80">Current Password</label>
            <input
              type="password"
              placeholder="Enter current password"
              className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-sans shadow-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium font-sans text-foreground/80">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-sans shadow-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium font-sans text-foreground/80">Confirm New Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-sans shadow-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Button disabled>Update Password</Button>
        </div>
      </div>

      <div className="pt-4 border-t border-border/40">
        <h3 className="text-sm font-semibold font-sans text-foreground mb-2">Two-Factor Authentication</h3>
        <p className="text-xs font-sans text-muted-foreground mb-3">Add an extra layer of security to your account.</p>
        <Button variant="outline" disabled>Enable 2FA</Button>
      </div>

      <div className="pt-4 border-t border-border/40">
        <h3 className="text-sm font-semibold font-sans text-destructive mb-2">Danger Zone</h3>
        <p className="text-xs font-sans text-muted-foreground mb-3">Permanently delete your account and all associated data.</p>
        <Button variant="destructive" disabled>Delete Account</Button>
      </div>
    </div>
  )
}

function AppearanceSection() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold font-sans text-foreground mb-3">Theme</h3>
        <div className="flex gap-3">
          {[
            { key: 'light', label: 'Light', active: true },
            { key: 'dark', label: 'Dark', active: false },
            { key: 'system', label: 'System', active: false },
          ].map((t) => (
            <button
              key={t.key}
              className={`rounded-lg border px-6 py-3 text-sm font-medium font-sans transition-colors ${
                t.active
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border bg-white text-muted-foreground hover:bg-secondary'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold font-sans text-foreground mb-3">Sidebar</h3>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium font-sans text-foreground">Collapsed by default</p>
            <p className="text-xs font-sans text-muted-foreground">Start with the sidebar minimized</p>
          </div>
          <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-border transition-colors">
            <span className="inline-block h-4 w-4 rounded-full bg-white shadow-sm transform translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold font-sans text-foreground mb-3">Calendar</h3>
        <div>
          <label className="mb-1.5 block text-sm font-medium font-sans text-foreground/80">Default View</label>
          <select className="w-full max-w-xs rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-sans shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option value="month">Month</option>
            <option value="week">Week</option>
            <option value="day">Day</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user)
  const [activeTab, setActiveTab] = useState('profile')

  const sections = {
    profile: <ProfileSection user={user} />,
    clinic: <ClinicSection />,
    notifications: <NotificationsSection />,
    security: <SecuritySection />,
    appearance: <AppearanceSection />,
  }

  return (
    <PageContainer title="Settings">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar tabs */}
        <div className="lg:w-56 shrink-0">
          <Card className="p-2">
            <nav className="space-y-0.5">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium font-sans transition-colors ${
                    activeTab === tab.key
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/60 hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1">
          <Card>
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border/40">
              <Settings className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold font-sans text-foreground">
                {TABS.find((t) => t.key === activeTab)?.label}
              </h2>
            </div>
            {sections[activeTab]}
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
