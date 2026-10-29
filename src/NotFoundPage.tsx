import { useEffect } from 'react'
import { useLang } from '@/lib/lang'
import { LangToggle } from '@/components/LangToggle'

// Página 404 real. Netlify sirve dist/404.html con estado 404 para cualquier
// ruta inexistente (antes devolvía la portada con 200: "soft 404").
const C = { bg: '#05070D', blue: '#00B8FF', white: '#F4F7FB', gray: '#AAB3C2', border: '#223044' }

const LINKS = [
  { href: '/', es: 'Inicio', en: 'Home' },
  { href: '/avatares', es: 'Avatares IA', en: 'AI Avatars' },
  { href: '/maigiaapps/', es: 'Instalaciones interactivas', en: 'Interactive installations' },
  { href: '/maigiaav/', es: 'Producción audiovisual', en: 'Audiovisual production' },
  { href: '/maigiaos/', es: 'MAIGIA OS', en: 'MAIGIA OS' },
  { href: '/proyectos', es: 'Proyectos', en: 'Projects' },
]

export default function NotFoundPage() {
  const [lang, setLang] = useLang()
  useEffect(() => {
    document.title = lang === 'es' ? 'Página no encontrada — MAIGIA' : 'Page not found — MAIGIA'
  }, [lang])

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.white }} className="flex flex-col">
      <header className="flex items-center justify-between px-5 py-4">
        <a href="/" aria-label={lang === 'es' ? 'MAIGIA, ir al inicio' : 'MAIGIA, go to home'}>
          <img src="/maigia-logo-girasomnis.png" alt="MAIGIA by Girasomnis" style={{ height: 40 }} />
        </a>
        <LangToggle lang={lang} setLang={setLang} />
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center px-5 py-16 gap-6">
        <p style={{ color: C.blue, fontWeight: 700, letterSpacing: '0.2em' }}>404</p>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 650, fontSize: 'clamp(1.8rem,5vw,3rem)', letterSpacing: '-0.03em' }}>
          {lang === 'es' ? 'Esta página no existe' : 'This page does not exist'}
        </h1>
        <p style={{ color: C.gray, maxWidth: 480 }}>
          {lang === 'es'
            ? 'Puede que el enlace esté mal escrito o que la página se haya movido. Estas son nuestras secciones:'
            : 'The link may be mistyped or the page may have moved. These are our sections:'}
        </p>
        <nav aria-label={lang === 'es' ? 'Secciones' : 'Sections'}>
          <ul className="flex flex-wrap justify-center gap-3">
            {LINKS.map(l => (
              <li key={l.href}>
                <a href={l.href} className="inline-block rounded-full px-5 py-2.5 text-sm"
                  style={{ border: `1px solid ${C.border}`, color: C.white, textDecoration: 'none' }}>
                  {l[lang]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-sm" style={{ color: C.gray }}>
          {lang === 'es' ? '¿Buscas algo concreto? Escríbenos a ' : 'Looking for something specific? Email us at '}
          <a href="mailto:info@girasomnis.com" style={{ color: C.blue }}>info@girasomnis.com</a>
        </p>
      </main>
    </div>
  )
}
