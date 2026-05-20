import { Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const TESTIMONIALS = [
  {
    name: 'Laura Martínez',
    role: 'CEO, Modanova',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    rating: 5,
    text: 'IMMERSO transformó completamente nuestra presencia online. En 4 meses triplicamos el tráfico orgánico y el equipo de IA que implementaron atiende el 70% de consultas automáticamente.',
  },
  {
    name: 'Carlos Ruiz',
    role: 'Director, ClinicaDental360',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    rating: 5,
    text: 'Pasamos de gestionar reservas por teléfono a tener un sistema completamente automatizado. El ROI fue evidente desde el primer mes. Equipo profesional y muy comunicativo.',
  },
  {
    name: 'Ana Gómez',
    role: 'Fundadora, FinStack',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
    rating: 5,
    text: 'El rediseño de nuestra landing page multiplicó por 3 la conversión. Saben combinar diseño premium con estrategia de negocio real. Los recomiendo sin dudarlo.',
  },
  {
    name: 'Miguel Torres',
    role: 'Gerente, LogiTech Express',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    rating: 5,
    text: 'Los agentes de IA que desarrollaron para nuestro proceso de logística redujeron el tiempo operativo un 60%. Una inversión que se paga sola en pocas semanas.',
  },
  {
    name: 'Sofía Herrera',
    role: 'Marketing, GourmetBCN',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    rating: 5,
    text: 'Nuestra web nueva es exactamente lo que necesitábamos: elegante, rápida y optimizada para SEO local. Las reservas online crecieron un 65% el primer trimestre.',
  },
  {
    name: 'Javier Sánchez',
    role: 'CTO, ConsultB2B',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    rating: 5,
    text: 'La estrategia de SEO y automatización de captación de leads que implementaron cambió completamente nuestro embudo de ventas. Resultados medibles desde el día uno.',
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="size-4 fill-primary text-primary" />
      ))}
    </div>
  )
}

export function Testimonials() {
  return (
    <section id="testimonios" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary">
            Testimonios
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Más de 120 empresas confían en IMMERSO Studio para crecer online.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ name, role, avatar, rating, text }) => (
            <Card key={name} className="border-border bg-muted/30 hover:bg-muted/50 transition-colors">
              <CardContent className="pt-6 space-y-4">
                <Stars count={rating} />
                <p className="text-sm text-foreground leading-relaxed">"{text}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-border">
                  <img
                    src={avatar}
                    alt={name}
                    className="size-9 rounded-full object-cover border border-border"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{name}</p>
                    <p className="text-xs text-muted-foreground">{role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
