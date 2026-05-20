import { useState, useEffect } from 'react'
import { Menu, X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

const LINKS = [
  { label: 'Servicios', href: '#servicios' },
  { label: 'Proceso', href: '#proceso' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Testimonios', href: '#testimonios' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'hsl(var(--background) / 0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid hsl(var(--border))' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 font-bold text-foreground text-lg">
          <Sparkles className="size-5 text-primary" />
          NEXUS 360
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm">Iniciar sesión</Button>
          <Button size="sm">Contactar</Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Menú"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-background px-6 py-4 space-y-3">
          {LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="block text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
          <Button className="w-full mt-2" size="sm">Contactar</Button>
        </div>
      )}
    </header>
  )
}
