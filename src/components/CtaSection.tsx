import { ArrowRight, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CtaSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-4xl mx-auto px-6 text-center space-y-8">

        {/* Glow */}
        <div className="relative">
          <div className="absolute inset-0 -z-10 flex items-center justify-center">
            <div className="w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
          </div>

          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-6">
            ¿Listo para crecer?
          </span>

          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
            Hablemos de tu proyecto
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Agenda una llamada gratuita de 30 minutos. Analizamos tu situación actual y te presentamos un plan de acción sin compromiso.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" className="px-8 h-12 text-base gap-2">
            <Calendar className="size-4" />
            Agendar llamada gratis
          </Button>
          <Button size="lg" variant="outline" className="px-8 h-12 text-base gap-2">
            Ver propuesta
            <ArrowRight className="size-4" />
          </Button>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-8 pt-4 text-sm text-muted-foreground">
          {[
            '✓ Sin compromiso',
            '✓ Respuesta en 24h',
            '✓ Presupuesto detallado',
          ].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
