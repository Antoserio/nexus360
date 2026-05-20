import { useEffect, useState } from 'react'
import { ArrowRight, CheckCircle2, Bot, Globe, TrendingUp, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

const FEATURES = [
  { icon: Globe, label: 'Webs Premium' },
  { icon: TrendingUp, label: 'SEO Avanzado' },
  { icon: Bot, label: 'Agentes IA' },
]

interface HeroProps {
  headline1?: string
  headline2?: string
  subtitle?: string
}

export function Hero({
  headline1 = 'Transforma Tu Negocio',
  headline2 = 'Con IA y Automatización',
  subtitle = 'IMMERSO Studio — Webs premium, SEO y agentes de IA para empresas que quieren destacar.',
}: HeroProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  })

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">

      {/* Background glows */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Dot grid */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="w-full max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">

        {/* Left — copy */}
        <div className="space-y-8">

          {/* Badge */}
          <div style={fadeUp(0)}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-muted text-muted-foreground text-sm font-medium">
              <Sparkles className="size-3.5 text-primary" />
              Agencia Digital con IA
            </span>
          </div>

          {/* Headline */}
          <div style={fadeUp(150)}>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.08]">
              <span className="text-foreground">{headline1}</span>
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    'linear-gradient(135deg, oklch(0.55 0.25 280) 0%, oklch(0.6 0.22 220) 100%)',
                }}
              >
                {headline2}
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <div style={fadeUp(300)}>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              {subtitle}
            </p>
          </div>

          {/* Feature pills */}
          <div style={fadeUp(450)} className="flex flex-wrap gap-3">
            {FEATURES.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/50 text-sm text-foreground"
              >
                <Icon className="size-4 text-primary" />
                {label}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div style={fadeUp(600)} className="flex flex-wrap gap-3">
            <Button size="lg" className="px-7 h-11 text-base gap-2">
              Empieza Ahora
              <ArrowRight className="size-4" />
            </Button>
            <Button size="lg" variant="outline" className="px-7 h-11 text-base">
              Ver Proyectos
            </Button>
          </div>

          {/* Trust line */}
          <div style={fadeUp(750)} className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="size-4 text-primary shrink-0" />
            Sin permanencias · Resultados medibles · Soporte dedicado
          </div>
        </div>

        {/* Right — visual */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0) scale(1)' : 'translateY(32px) scale(0.97)',
            transition: 'opacity 0.9s ease 400ms, transform 0.9s ease 400ms',
          }}
          className="relative hidden lg:block"
        >
          {/* Card frame */}
          <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80"
              alt="Workspace moderno con laptop y café"
              className="w-full h-[480px] object-cover"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />

            {/* Floating stat card */}
            <div className="absolute bottom-6 left-6 right-6 bg-background/90 backdrop-blur-sm border border-border rounded-xl p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Proyectos completados</p>
                <p className="text-2xl font-bold text-foreground">+120</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <p className="text-xs text-muted-foreground">Satisfacción cliente</p>
                <p className="text-2xl font-bold text-foreground">98%</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <p className="text-xs text-muted-foreground">Años de experiencia</p>
                <p className="text-2xl font-bold text-foreground">5+</p>
              </div>
            </div>
          </div>

          {/* Decorative floating badge */}
          <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
            IA Powered
          </div>
        </div>
      </div>
    </section>
  )
}
