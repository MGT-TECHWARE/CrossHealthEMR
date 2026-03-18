import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left — Branding panel with hero image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="/hero_image.jpeg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* Right — Login form */}
      <div className="flex w-full items-center justify-center bg-white px-6 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex justify-center mb-4">
            <img src="/cross_health_logo.png" alt="CrossHealth" className="h-16 w-16 object-contain" />
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
