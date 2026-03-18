import { Link } from 'react-router-dom'
import {
  Activity,
  Brain,
  CalendarCheck,
  ChevronRight,
  ClipboardList,
  Dumbbell,
  Heart,
  Shield,
  Sparkles,
  Star,
  Users,
} from 'lucide-react'
import Button from '@/components/ui/Button'

function Navbar() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 lg:px-12">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-white">Cross</span>
        <span className="text-xl font-bold text-accent">Health</span>
      </div>
      <div className="flex items-center gap-4">
        <Link
          to="/login"
          className="text-sm font-medium font-sans text-white/80 transition-colors hover:text-white"
        >
          Sign In
        </Link>
        <Link to="/register">
          <Button variant="gold" size="sm">
            Get Started
          </Button>
        </Link>
      </div>
    </nav>
  )
}

function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-br from-[#061f1c] via-[#0a3832] to-[#0f4d46]">
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 h-[800px] w-[800px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 h-[600px] w-[600px] rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      <Navbar />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-32 lg:px-12">
        <div className="max-w-3xl space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-xs font-medium font-sans tracking-wide text-white/70">
              AI-Powered Clinical Tools
            </span>
          </div>

          <h1 className="text-5xl leading-[1.1] font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Rehabilitation,
            <br />
            <span className="text-accent">reimagined.</span>
          </h1>

          <p className="max-w-xl text-lg font-sans leading-relaxed text-white/60">
            Advanced physical therapy management that combines intelligent exercise matching,
            streamlined documentation, and precision care planning — all in one elegant platform.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link to="/register">
              <Button variant="gold" size="lg" className="gap-2">
                Book an Appointment
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 hover:text-white"
              >
                Clinical Login
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}

function ServicesSection() {
  const services = [
    {
      icon: Activity,
      title: 'Orthopedic Rehabilitation',
      description:
        'Post-surgical recovery, joint replacements, and sports injury rehabilitation with evidence-based protocols.',
    },
    {
      icon: Brain,
      title: 'Neurological Therapy',
      description:
        'Specialized treatment for stroke recovery, spinal cord injuries, and neurological conditions.',
    },
    {
      icon: Heart,
      title: 'Chronic Pain Management',
      description:
        'Comprehensive pain relief programs combining manual therapy, exercise, and education.',
    },
    {
      icon: Dumbbell,
      title: 'Sports Performance',
      description:
        'Return-to-sport programs and performance optimization for athletes at every level.',
    },
  ]

  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium font-sans uppercase tracking-widest text-accent">
            Our Services
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">
            Comprehensive care, tailored to you
          </h2>
          <p className="mt-4 font-sans text-lg text-muted-foreground">
            From acute injury to long-term wellness, our evidence-based approach
            ensures optimal outcomes at every stage of recovery.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div
              key={service.title}
              className="group rounded-xl border border-border/60 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/20"
            >
              <div className="mb-5 inline-flex rounded-lg bg-primary/10 p-3">
                <service.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground font-sans">
                {service.title}
              </h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AboutSection() {
  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Image placeholder — warm gradient with decorative elements */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a3832] to-[#1a6b5f] p-12 aspect-[4/3]">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-60" />
            <div className="relative flex h-full flex-col justify-end text-white">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm w-fit mb-4">
                <Shield className="h-4 w-4 text-accent" />
                <span className="text-xs font-medium font-sans">Evidence-Based Care</span>
              </div>
              <h3 className="text-3xl font-semibold">Where science meets compassion</h3>
              <p className="mt-3 max-w-sm font-sans text-white/60">
                Our modern clinic combines warm, welcoming spaces with cutting-edge technology.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-sm font-medium font-sans uppercase tracking-widest text-accent">
              About Cross Health
            </p>
            <h2 className="text-4xl font-semibold tracking-tight text-foreground">
              A new standard in physical therapy
            </h2>
            <p className="font-sans text-lg leading-relaxed text-muted-foreground">
              Cross Health combines the warmth of personalized care with the
              precision of modern technology. Our platform empowers physical
              therapists with AI-assisted exercise matching, streamlined SOAP
              documentation, and intelligent care planning.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              {[
                { value: '98%', label: 'Patient satisfaction' },
                { value: '2,500+', label: 'Treatments completed' },
                { value: '15+', label: 'Specialized therapists' },
                { value: '24/7', label: 'Digital care access' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-semibold text-primary">{stat.value}</p>
                  <p className="mt-1 text-sm font-sans text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function TechnologySection() {
  const features = [
    {
      icon: Brain,
      title: 'AI Exercise Matching',
      description:
        'Our AI analyzes SOAP notes and recommends personalized exercise plans tailored to each patient.',
    },
    {
      icon: ClipboardList,
      title: 'Smart Documentation',
      description:
        'Streamlined SOAP note templates with intelligent auto-suggestions to reduce documentation time.',
    },
    {
      icon: CalendarCheck,
      title: 'Scheduling & Workflow',
      description:
        'Effortless appointment management with automated reminders and calendar integrations.',
    },
    {
      icon: Users,
      title: 'Patient Management',
      description:
        'Comprehensive patient profiles, treatment history, and progress tracking in one place.',
    },
  ]

  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium font-sans uppercase tracking-widest text-accent">
            Technology
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">
            Built for the modern clinic
          </h2>
          <p className="mt-4 font-sans text-lg text-muted-foreground">
            Intelligent tools that let you focus on what matters most — your patients.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex gap-5 rounded-xl border border-border/60 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <div className="shrink-0">
                <div className="inline-flex rounded-lg bg-accent/10 p-3">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground font-sans">
                  {feature.title}
                </h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "Cross Health transformed how I manage my practice. The AI exercise matching saves me hours every week and my patients get better, more personalized plans.",
      name: 'Dr. Sarah Chen',
      title: 'DPT, Sports Medicine Specialist',
      rating: 5,
    },
    {
      quote:
        "The documentation workflow is incredible. What used to take 20 minutes per patient now takes 5. I can finally focus on treating rather than typing.",
      name: 'Marcus Rivera',
      title: 'PT, Orthopedic Rehabilitation',
      rating: 5,
    },
    {
      quote:
        "As a clinic administrator, the scheduling and patient management tools have streamlined our entire operation. Our efficiency has increased dramatically.",
      name: 'Jennifer Walsh',
      title: 'Clinic Director',
      rating: 5,
    },
  ]

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium font-sans uppercase tracking-widest text-accent">
            Testimonials
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">
            Trusted by leading practitioners
          </h2>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-xl border border-border/60 bg-background p-8 shadow-sm"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-accent text-accent"
                  />
                ))}
              </div>
              <blockquote className="flex-1 font-sans text-sm leading-relaxed text-foreground/80">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="mt-6 border-t border-border/60 pt-4">
                <p className="font-semibold font-sans text-sm text-foreground">{t.name}</p>
                <p className="text-xs font-sans text-muted-foreground">{t.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a3832] via-primary to-[#1a6b5f] px-8 py-20 text-center lg:px-16">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -right-1/4 h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -bottom-1/2 -left-1/4 h-[400px] w-[400px] rounded-full bg-accent/10 blur-3xl" />
          </div>

          <div className="relative z-10 mx-auto max-w-2xl space-y-6">
            <h2 className="text-4xl font-semibold tracking-tight text-white lg:text-5xl">
              Ready to elevate your practice?
            </h2>
            <p className="mx-auto max-w-lg font-sans text-lg text-white/60">
              Join the growing community of physical therapy professionals
              who trust Cross Health for intelligent clinical management.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link to="/register">
                <Button variant="gold" size="lg" className="gap-2">
                  Get Started Free
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/10 hover:text-white"
                >
                  Schedule a Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border/60 bg-white py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">Cross</span>
            <span className="text-lg font-bold text-foreground">Health</span>
          </div>

          <div className="flex items-center gap-8">
            <a href="#" className="text-sm font-sans text-muted-foreground transition-colors hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="text-sm font-sans text-muted-foreground transition-colors hover:text-foreground">
              Terms
            </a>
            <a href="#" className="text-sm font-sans text-muted-foreground transition-colors hover:text-foreground">
              Contact
            </a>
          </div>

          <p className="text-sm font-sans text-muted-foreground">
            &copy; 2026 Cross Health
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <TechnologySection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  )
}
