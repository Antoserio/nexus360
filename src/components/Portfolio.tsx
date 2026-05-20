import { ArrowUpRight } from 'lucide-react'

const PROJECTS = [
  {
    title: 'E-commerce de Moda',
    category: 'Web Premium + SEO',
    result: '+340% tráfico orgánico',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
  },
  {
    title: 'Clínica Dental Digital',
    category: 'Web + Agente IA',
    result: '+85% reservas online',
    image: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?w=800&q=80',
  },
  {
    title: 'SaaS de Finanzas',
    category: 'Branding + Desarrollo',
    result: '×3 conversión landing',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
  },
  {
    title: 'Consultoría B2B',
    category: 'SEO + Automatización',
    result: '+220% leads calificados',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
  },
  {
    title: 'Restaurante Gourmet',
    category: 'Web Premium + CRO',
    result: '+65% reservas mesa',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
  },
  {
    title: 'Startup de Logística',
    category: 'Agentes IA + Automatización',
    result: '-60% tiempo operativo',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
  },
]

export function Portfolio() {
  return (
    <section id="proyectos" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <div className="space-y-4">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary">
              Proyectos
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              Resultados reales
            </h2>
            <p className="text-muted-foreground text-lg max-w-lg">
              Cada proyecto tiene un objetivo claro y métricas que demuestran el impacto.
            </p>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline shrink-0"
          >
            Ver todos los proyectos
            <ArrowUpRight className="size-4" />
          </a>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map(({ title, category, result, image }) => (
            <div
              key={title}
              className="group relative rounded-2xl overflow-hidden border border-border bg-background hover:border-primary/40 hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              {/* Image */}
              <div className="overflow-hidden h-52">
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-5 space-y-2">
                <span className="text-xs font-medium text-primary uppercase tracking-wide">
                  {category}
                </span>
                <h3 className="text-base font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground">{result}</p>
              </div>

              {/* Arrow on hover */}
              <div className="absolute top-4 right-4 size-8 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="size-4 text-foreground" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
