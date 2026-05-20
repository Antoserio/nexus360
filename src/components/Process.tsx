import { MessageSquare, Lightbulb, Code2, Rocket } from 'lucide-react'

const STEPS = [
  {
    icon: MessageSquare,
    number: '01',
    title: 'Descubrimiento',
    description: 'Analizamos tu negocio, competencia y objetivos para entender exactamente qué necesitas y diseñar la estrategia ideal.',
  },
  {
    icon: Lightbulb,
    number: '02',
    title: 'Estrategia y Diseño',
    description: 'Creamos la propuesta visual y técnica: wireframes, arquitectura, selección de tecnologías y plan de ejecución detallado.',
  },
  {
    icon: Code2,
    number: '03',
    title: 'Desarrollo',
    description: 'Construimos con las mejores prácticas del sector. Iteraciones semanales con feedback continuo para asegurar el resultado.',
  },
  {
    icon: Rocket,
    number: '04',
    title: 'Lanzamiento y Crecimiento',
    description: 'Desplegamos, medimos y optimizamos. El trabajo no termina en el lanzamiento: crecemos contigo a largo plazo.',
  },
]

export function Process() {
  return (
    <section id="proceso" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary">
            Proceso
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Cómo trabajamos
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Un proceso claro y transparente pensado para darte máxima visibilidad en cada etapa.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-border" />

          {STEPS.map(({ icon: Icon, number, title, description }) => (
            <div key={number} className="relative flex flex-col items-center text-center space-y-4">
              {/* Icon circle */}
              <div className="relative z-10 size-20 rounded-full border-2 border-border bg-background flex items-center justify-center shadow-sm">
                <Icon className="size-7 text-primary" />
                <span className="absolute -top-1 -right-1 size-6 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {number.slice(1)}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
