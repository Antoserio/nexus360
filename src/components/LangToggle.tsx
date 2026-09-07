import type { Lang } from '@/lib/lang'

export function LangToggle({ lang, setLang, accent = '#00B8FF', dim = '#5B6472' }: {
  lang: Lang; setLang: (l: Lang) => void; accent?: string; dim?: string
}) {
  return (
    <div className="flex items-center gap-1" style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.04em' }}>
      <button onClick={() => setLang('es')} aria-label="Español" aria-pressed={lang === 'es'}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 5px', color: lang === 'es' ? accent : dim }}>
        ES
      </button>
      <span style={{ color: dim, opacity: 0.5 }}>|</span>
      <button onClick={() => setLang('en')} aria-label="English" aria-pressed={lang === 'en'}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 5px', color: lang === 'en' ? accent : dim }}>
        EN
      </button>
    </div>
  )
}
