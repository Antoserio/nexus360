import { useEffect } from 'react'
import { useLang } from '@/lib/lang'
import { LangToggle } from '@/components/LangToggle'
import { AVISO_LEGAL, PRIVACIDAD, COOKIES, type LegalDoc } from '@/lib/legalContent'

const C = {
  bg: '#05070D', blue: '#00B8FF', white: '#F4F7FB', gray: '#AAB3C2', border: '#223044',
}

const DOCS: Record<string, { doc: LegalDoc; path: string }> = {
  'aviso-legal':        { doc: AVISO_LEGAL, path: '/aviso-legal' },
  'politica-privacidad': { doc: PRIVACIDAD, path: '/politica-privacidad' },
  'politica-cookies':    { doc: COOKIES,    path: '/politica-cookies' },
}

function slugFromPath(): keyof typeof DOCS {
  const p = window.location.pathname.replace(/\/$/, '').replace(/^\//, '')
  return (p in DOCS ? p : 'aviso-legal') as keyof typeof DOCS
}

export default function LegalPage() {
  const [lang, setLang] = useLang()
  const slug = slugFromPath()
  const { doc } = DOCS[slug]

  useEffect(() => {
    document.title = `${doc.title[lang]} — MAIGIA`
    const canonical = document.querySelector('link[rel="canonical"]')
    canonical?.setAttribute('href', `https://maigia.tech${DOCS[slug].path}`)
  }, [lang, doc, slug])

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.white }}>
      <header style={{
        position: 'fixed', top: 0, insetInline: 0, zIndex: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 28px', background: 'rgba(5,7,13,0.85)', backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/maigia-logo-girasomnis.png" alt="MAIGIA by Girasomnis" style={{ height: 64, width: 'auto' }} />
        </a>
        <div className="flex items-center gap-4">
          <LangToggle lang={lang} setLang={setLang} />
          <a href="/" style={{
            color: C.white, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.15em',
            textDecoration: 'none', border: `1px solid ${C.border}`, borderRadius: 999,
            padding: '8px 18px', display: 'flex', alignItems: 'center', gap: 8,
          }}>
            {lang === 'es' ? '← Volver' : '← Back'}
          </a>
        </div>
      </header>

      <main style={{ paddingTop: 140, paddingBottom: 100 }}>
        <div className="mx-auto px-6" style={{ maxWidth: 760 }}>

          {/* ── Title ── */}
          <p style={{
            color: C.blue, fontSize: 12, fontWeight: 700, letterSpacing: '0.2em',
            textTransform: 'uppercase', marginBottom: 12,
          }}>
            MAIGIA · {doc.updated}
          </p>
          <h1 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: '-0.03em',
            fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', lineHeight: 1.1, marginBottom: 24, color: C.white,
          }}>
            {doc.title[lang]}
          </h1>
          {doc.intro && (
            <p style={{ color: C.gray, fontSize: '1.05rem', lineHeight: 1.7, marginBottom: 56, maxWidth: 620 }}>
              {doc.intro[lang]}
            </p>
          )}

          {/* ── Sections ── */}
          <div className="flex flex-col" style={{ gap: 44 }}>
            {doc.sections.map((section, si) => (
              <section key={si} style={{ borderTop: si === 0 ? 'none' : `1px solid ${C.border}`, paddingTop: si === 0 ? 0 : 40 }}>
                <h2 style={{
                  fontFamily: "'Syne', sans-serif", fontWeight: 650, letterSpacing: '-0.01em',
                  fontSize: '1.3rem', color: C.white, marginBottom: 18,
                }}>
                  {section.heading[lang]}
                </h2>
                <div className="flex flex-col" style={{ gap: 16 }}>
                  {section.blocks.map((block, bi) => {
                    if (block.type === 'p') {
                      return (
                        <p key={bi} style={{ color: C.gray, fontSize: '0.98rem', lineHeight: 1.75 }}>
                          {block[lang]}
                        </p>
                      )
                    }
                    if (block.type === 'list') {
                      return (
                        <ul key={bi} className="flex flex-col" style={{ gap: 10, paddingLeft: 0, listStyle: 'none' }}>
                          {block[lang].map((item, ii) => (
                            <li key={ii} style={{
                              color: C.gray, fontSize: '0.98rem', lineHeight: 1.65,
                              display: 'flex', gap: 12, alignItems: 'flex-start',
                            }}>
                              <span style={{ color: C.blue, marginTop: 8, width: 5, height: 5, borderRadius: '50%', background: C.blue, flexShrink: 0 }} />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )
                    }
                    // table
                    return (
                      <div key={bi} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                        {block.rows.map((row, ri) => (
                          <div key={ri} className="flex flex-col sm:flex-row" style={{
                            borderTop: ri === 0 ? 'none' : `1px solid ${C.border}`,
                            background: ri % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                          }}>
                            <div className="w-full sm:w-[220px] shrink-0" style={{
                              padding: '12px 16px', fontSize: '0.78rem', fontWeight: 700,
                              letterSpacing: '0.04em', textTransform: 'uppercase', color: C.blue,
                            }}>
                              {row[lang]}
                            </div>
                            <div style={{ padding: '12px 16px', fontSize: '0.92rem', color: C.white, wordBreak: 'break-word' }}>
                              {row.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>

          {/* ── Cross-links ── */}
          <div className="flex flex-wrap gap-3" style={{ marginTop: 64, paddingTop: 32, borderTop: `1px solid ${C.border}` }}>
            {(Object.keys(DOCS) as (keyof typeof DOCS)[]).filter(k => k !== slug).map(k => (
              <a key={k} href={DOCS[k].path}
                style={{
                  color: C.gray, fontSize: '0.85rem', textDecoration: 'none',
                  border: `1px solid ${C.border}`, borderRadius: 999, padding: '9px 18px',
                }}>
                {DOCS[k].doc.title[lang]}
              </a>
            ))}
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="py-10 px-6" style={{ borderTop: `1px solid ${C.border}`, background: C.bg }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/maigia-logo-girasomnis.png" alt="MAIGIA by Girasomnis" style={{ height: 34, width: 'auto', objectFit: 'contain', opacity: 0.6 }} />
            <span className="text-xs" style={{ color: C.border }}>MAIGIA 2026</span>
          </div>
          <span className="text-xs" style={{ color: C.border, opacity: 0.5 }}>
            {lang === 'es' ? 'Dudas sobre esta página: ' : 'Questions about this page: '}
            <a href="mailto:info@girasomnis.com" style={{ color: C.border, textDecoration: 'none', opacity: 0.7 }}>info@girasomnis.com</a>
          </span>
        </div>
      </footer>
    </div>
  )
}
