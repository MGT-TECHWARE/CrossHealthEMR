import RegisterForm from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left — Branding panel with hero image */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-between relative overflow-hidden">
        <img
          src="/hero_image.jpeg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 p-12">
          <img src="/cross_health_logo.png" alt="CrossHealth" className="h-14 w-14 object-contain" />
        </div>

        <div className="relative z-10 p-12 space-y-6">
          <h1 className="text-5xl leading-tight font-semibold tracking-tight text-white">
            Join the future
            <br />
            of care.
          </h1>
          <p className="max-w-md text-lg font-sans leading-relaxed text-white/70">
            Equip your practice with intelligent clinical tools designed for
            modern physical therapy professionals.
          </p>
        </div>

        <div className="relative z-10 p-12">
          <p className="text-sm font-sans text-white/40">
            &copy; 2026 Cross Health. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right — Register form */}
      <div className="flex w-full items-center justify-center bg-white px-6 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex justify-center mb-4">
            <img src="/cross_health_logo.png" alt="CrossHealth" className="h-16 w-16 object-contain" />
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
