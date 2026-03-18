import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/stores/authStore'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

const registerSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'pt'], {
    required_error: 'Please select a role',
  }),
})

export default function RegisterForm() {
  const { register: authRegister, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'pt' },
  })

  async function onSubmit(values) {
    try {
      setServerError('')
      setSuccess(false)
      const data = await authRegister(values)

      // If session exists (auto-confirm enabled), navigate to dashboard
      if (data?.session) {
        const userRole = values.role || 'pt'
        const base = userRole === 'admin' ? '/admin' : '/pt'
        navigate(`${base}/dashboard`)
      } else {
        // Email confirmation required — show success message
        setSuccess(true)
      }
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please try again.')
    }
  }

  async function handleGoogleSignIn() {
    try {
      setServerError('')
      await signInWithGoogle()
    } catch (err) {
      setServerError(err.message || 'Google sign-in failed. Please try again.')
    }
  }

  if (success) {
    return (
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 text-center space-y-3">
        <h3 className="text-lg font-semibold text-primary font-sans">Check your email</h3>
        <p className="text-sm font-sans text-muted-foreground">
          We&apos;ve sent a confirmation link to your email address.
          Click the link to activate your account, then{' '}
          <a href="/login" className="text-primary font-medium hover:underline">sign in</a>.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm font-sans text-destructive">
            {serverError}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            placeholder="John"
            error={errors.first_name?.message}
            {...register('first_name')}
          />

          <Input
            label="Last Name"
            placeholder="Doe"
            error={errors.last_name?.message}
            {...register('last_name')}
          />
        </div>

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Create a password"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="w-full">
          <label
            htmlFor="role"
            className="mb-1.5 block text-sm font-medium font-sans text-foreground/80"
          >
            Role
          </label>
          <select
            id="role"
            className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-sans shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            {...register('role')}
          >
            <option value="pt">Physical Therapist</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && (
            <p className="mt-1 text-sm font-sans text-destructive">{errors.role.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 font-sans text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium font-sans text-foreground shadow-sm transition-all duration-200 hover:bg-secondary"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Sign up with Google
      </button>
    </div>
  )
}
