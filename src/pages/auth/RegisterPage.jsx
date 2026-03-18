import RegisterForm from '@/components/auth/RegisterForm'

export default function RegisterPage() {
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
            Join the future
            <br />
            of care.
          </h1>
          <p className="max-w-md text-lg font-sans leading-relaxed text-white/70">
            Equip your practice with intelligent clinical tools designed for
            modern physical therapy professionals.
          </p>
        </div>

        <p className="text-sm font-sans text-white/40">
          &copy; 2026 Cross Health. All rights reserved.
        </p>
      </div>

      {/* Right — Register form */}
      <div className="flex w-full items-center justify-center bg-white px-6 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden text-center mb-4">
            <h2 className="text-2xl font-bold">
              <span className="text-primary">Cross</span>{' '}
              <span className="text-foreground">Health</span>
            </h2>
          </div>

          <div>
            <h2 className="text-3xl font-semibold text-foreground">Create your account</h2>
            <p className="mt-2 font-sans text-muted-foreground">
              Get started with Cross Health in minutes
            </p>
          </div>

          <RegisterForm />

          <p className="text-center text-sm font-sans text-muted-foreground">
            Already have an account?{' '}
            <a href="/login" className="text-primary font-medium hover:text-primary-light transition-colors">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
