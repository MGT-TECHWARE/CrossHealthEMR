import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left — Branding panel */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-between bg-gradient-to-br from-[#0a3832] via-primary to-[#1a6b5f] p-12 text-white">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            <span className="text-white">Cross</span>{' '}
            <span className="text-accent">Health</span>
          </h2>
        </div>

        <div className="space-y-6">
          <h1 className="text-5xl leading-tight font-semibold tracking-tight">
            Rehabilitation,
            <br />
            reimagined.
          </h1>
          <p className="max-w-md text-lg font-sans leading-relaxed text-white/70">
            Advanced physical therapy management powered by intelligent tools.
            Streamline your practice with precision and care.
          </p>
        </div>

        <p className="text-sm font-sans text-white/40">
          &copy; 2026 Cross Health. All rights reserved.
        </p>
      </div>

      {/* Right — Login form */}
      <div className="flex w-full items-center justify-center bg-white px-6 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden text-center mb-4">
            <h2 className="text-2xl font-bold">
              <span className="text-primary">Cross</span>{' '}
              <span className="text-foreground">Health</span>
            </h2>
          </div>

          <div>
            <h2 className="text-3xl font-semibold text-foreground">Welcome back</h2>
            <p className="mt-2 font-sans text-muted-foreground">
              Sign in to your clinical dashboard
            </p>
          </div>

          <LoginForm />

          <p className="text-center text-sm font-sans text-muted-foreground">
            Don&apos;t have an account?{' '}
            <a href="/register" className="text-primary font-medium hover:text-primary-light transition-colors">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
