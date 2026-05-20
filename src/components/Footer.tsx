import { Sparkles, X, Briefcase, Camera, GitFork } from 'lucide-react'

const LINKS = {
  Servicios: ['Webs Premium', 'SEO Avanzado', 'Agentes IA', 'Branding', 'Analítica'],
  Empresa: ['Sobre nosotros', 'Proyectos', 'Blog', 'Careers', 'Contacto'],
  Legal: ['Privacidad', 'Términos', 'Cookies', 'RGPD'],
}

const SOCIALS = [
  { icon: X, label: 'Twitter/X', href: '#' },
  { icon: Briefcase, label: 'LinkedIn', href: '#' },
  { icon: Camera, label: 'Instagram', href: '#' },
  { icon: GitFork, label: 'GitHub', href: '#' },
]

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Top */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 font-bold text-foreground text-lg">
              <Sparkles className="size-5 text-primary" />
              IMMERSO Studio
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Agencia digital especializada en webs premium, SEO y agentes de IA para empresas que quieren destacar.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="size-9 rounded-lg border border-border bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group} className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">{group}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} IMMERSO Studio. Todos los derechos reservados.</p>
          <p>Hecho con ❤️ en España</p>
        </div>
      </div>
    </footer>
  )
}
