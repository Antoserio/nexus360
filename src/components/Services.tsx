import { Globe, Bot, TrendingUp, Palette, BarChart3, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

const SERVICES = [
  {
    icon: Globe,
    title: 'Webs Premium',
    description: 'Diseño y desarrollo de sitios web de alto rendimiento, optimizados para conversión y experiencia de usuario excepcional.',
    tags: ['React', 'Next.js', 'Tailwind'],
  },
  {
    icon: TrendingUp,
    title: 'SEO Avanzado',
    description: 'Estrategias SEO técnico y de contenido que posicionan tu negocio en los primeros resultados de Google de forma sostenida.',
    tags: ['On-page', 'Link building', 'Core Web Vitals'],
  },
  {
    icon: Bot,
    title: 'Agentes de IA',
    description: 'Automatizamos procesos de tu empresa con agentes inteligentes: atención al cliente, lead scoring, reportes automáticos y más.',
    tags: ['GPT-4', 'Langchain', 'Automatización'],
  },
  {
    icon: Palette,
    title: 'Branding Digital',
    description: 'Identidad visual coherente y memorable que conecta con tu audiencia y diferencia tu marca de la competencia.',
    tags: ['Logotipo', 'UI Design', 'Brand guidelines'],
  },
  {
    icon: BarChart3,
    title: 'Analítica y CRO',
    description: 'Medimos y optimizamos cada punto de contacto digital para maximizar las conversiones y el retorno de inversión.',
    tags: ['GA4', 'Hotjar', 'A/B Testing'],
  },
  {
    icon: Zap,
    title: 'Automatizaciones',
    description: 'Integramos tus herramientas y flujos de trabajo para eliminar tareas repetitivas y escalar operaciones sin más personal.',
    tags: ['Zapier', 'Make', 'n8n'],
  },
]

export function Services() {
  return (
    <section id="servicios" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary">
            Servicios
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Todo lo que necesitas para<br className="hidden sm:block" /> destacar online
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Combinamos tecnología, creatividad e inteligencia artificial para llevar tu negocio al siguiente nivel.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map(({ icon: Icon, title, description, tags }) => (
            <Card
              key={title}
              className="group border-border bg-background hover:border-primary/40 hover:shadow-lg transition-all duration-300"
            >
              <CardHeader className="pb-3">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="size-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
