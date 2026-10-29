import { useEffect, useId, useRef, useState } from 'react'
import type { Lang } from '@/lib/lang'

// Formulario de contacto compartido (portada y /avatares).
// - Solo muestra "enviado" si Netlify Forms responde 2xx.
// - Ante error conserva lo escrito y ofrece reintento + correo alternativo.
// - Diálogo accesible: role=dialog, foco inicial, Tab confinado, Escape cierra,
//   el foco vuelve al botón que lo abrió.
// - En pantallas cortas el panel tiene scroll propio y el cierre siempre visible.

const FORM_NAME = 'contacto-aiasomnis'
const FALLBACK_EMAIL = 'info@girasomnis.com'
const TIMEOUT_MS = 15000

const C = {
  bg2: '#071120', blue: '#00B8FF', cyan: '#22D3FF', deep: '#1B3DFF',
  white: '#F4F7FB', gray: '#AAB3C2', border: '#223044', error: '#FF6B6B',
}

// value estable (lo que llega a Netlify) + etiqueta traducida
export const PROJECT_TYPES = [
  { value: 'Avatar IA', es: 'Avatar IA', en: 'AI Avatar' },
  { value: 'Instalación interactiva', es: 'Instalación interactiva', en: 'Interactive installation' },
  { value: 'Producción audiovisual con IA', es: 'Producción audiovisual con IA', en: 'AI audiovisual production' },
  { value: 'Solución digital / Web', es: 'Solución digital / Web', en: 'Digital solution / Website' },
  { value: 'Otro', es: 'Otro', en: 'Other' },
] as const

type Status = 'idle' | 'submitting' | 'success' | 'error'

const T = {
  title: { es: 'Cuéntanos tu proyecto', en: 'Tell us about your project' },
  subtitle: { es: 'Responderemos en menos de 24h.', en: "We'll reply within 24h." },
  name: { es: 'Nombre', en: 'Name' },
  namePh: { es: 'Tu nombre', en: 'Your name' },
  emailPh: { es: 'tu@email.com', en: 'you@email.com' },
  type: { es: 'Tipo de proyecto', en: 'Project type' },
  select: { es: 'Selecciona una opción', en: 'Select an option' },
  idea: { es: 'Cuéntanos tu idea', en: 'Tell us your idea' },
  ideaPh: { es: 'Describe tu proyecto, evento, marca o lo que necesitas...', en: 'Describe your project, event, brand or what you need...' },
  send: { es: 'Enviar proyecto →', en: 'Send project →' },
  sending: { es: 'Enviando…', en: 'Sending…' },
  close: { es: 'Cerrar', en: 'Close' },
  closeDialog: { es: 'Cerrar formulario de contacto', en: 'Close contact form' },
  okTitle: { es: '¡Mensaje enviado!', en: 'Message sent!' },
  okText: { es: 'Te responderemos lo antes posible.', en: "We'll get back to you as soon as possible." },
  errTitle: { es: 'No hemos podido enviar tu mensaje.', en: "We couldn't send your message." },
  errText: {
    es: 'Lo que has escrito sigue aquí. Vuelve a intentarlo o escríbenos a',
    en: 'Your message is still here. Please try again or email us at',
  },
  privacy: { es: 'Usaremos tus datos para responder a tu consulta. Más información en la', en: 'We will use your data to reply to your enquiry. More information in our' },
  privacyLink: { es: 'política de privacidad', en: 'privacy policy' },
}

const fieldStyle = { background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, color: C.white }

export function ContactModal({ open, onClose, lang, defaultType = '', defaultMessage = '' }: {
  open: boolean
  onClose: () => void
  lang: Lang
  defaultType?: string
  defaultMessage?: string
}) {
  const [status, setStatus] = useState<Status>('idle')
  const panelRef = useRef<HTMLDivElement>(null)
  const firstFieldRef = useRef<HTMLInputElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)
  const uid = useId()
  const id = (s: string) => `${uid}-${s}`

  // Abrir: guardar disparador, bloquear scroll del fondo, foco inicial.
  // Cerrar: restaurar scroll y devolver foco.
  useEffect(() => {
    if (!open) return
    openerRef.current = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => {
      (firstFieldRef.current ?? panelRef.current)?.focus()
    }, 0)
    return () => {
      window.clearTimeout(t)
      document.body.style.overflow = prevOverflow
      openerRef.current?.focus?.()
      setStatus('idle')
    }
  }, [open])

  // Escape y Tab confinado
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return }
      if (e.key !== 'Tab' || !panelRef.current) return
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([type="hidden"]):not([disabled]):not([tabindex="-1"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )).filter(el => el.offsetParent !== null)
      if (!items.length) return
      const first = items[0], last = items[items.length - 1]
      const active = document.activeElement
      if (e.shiftKey && (active === first || !panelRef.current.contains(active))) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && (active === last || !panelRef.current.contains(active))) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status === 'submitting') return
    setStatus('submitting')
    const params = new URLSearchParams()
    new FormData(e.currentTarget).forEach((v, k) => params.append(k, v.toString()))
    const ctrl = new AbortController()
    const timer = window.setTimeout(() => ctrl.abort(), TIMEOUT_MS)
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
        signal: ctrl.signal,
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    } finally {
      window.clearTimeout(timer)
    }
  }

  const titleId = id('title')
  const descId = id('desc')
  const sending = status === 'submitting'

  return (
    <div
      className="fixed inset-0 z-[200] overflow-y-auto overscroll-contain"
      style={{ background: 'rgba(5,7,13,0.92)', backdropFilter: 'blur(12px)' }}
      onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
      <div
        className="flex min-h-full items-center justify-center"
        style={{ padding: 'max(12px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right)) max(12px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left))' }}
        onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descId}
          tabIndex={-1}
          className="relative w-full max-w-lg rounded-2xl overflow-y-auto overscroll-contain outline-none max-h-[calc(100vh-24px)] max-h-[calc(100dvh-24px)]"
          style={{ background: C.bg2, border: `1px solid ${C.border}`, boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}>

          {/* Cierre siempre visible (sticky dentro del panel con scroll) */}
          <div className="sticky top-0 z-10 flex justify-end p-3 pb-0" style={{ background: 'linear-gradient(#071120 70%, transparent)' }}>
            <button type="button" onClick={onClose} aria-label={T.closeDialog[lang]}
              className="w-11 h-11 flex items-center justify-center rounded-full cursor-pointer focus-visible:outline focus-visible:outline-2"
              style={{ background: 'rgba(255,255,255,0.06)', color: C.gray, border: 'none', outlineColor: C.cyan }}>
              <span aria-hidden="true">✕</span>
            </button>
          </div>

          <div className="px-5 pb-6 sm:px-8 sm:pb-8 md:px-10 md:pb-10 -mt-4">
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-8 gap-4 text-center" role="status">
                <div className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(123,47,255,0.15)', border: '1px solid #7B2FFF' }}>
                  <span aria-hidden="true" style={{ fontSize: 28 }}>✓</span>
                </div>
                <h2 id={titleId} className="text-xl" style={{ color: C.white, fontFamily: "'Syne', sans-serif", fontWeight: 650, letterSpacing: '-0.02em' }}>{T.okTitle[lang]}</h2>
                <p id={descId} style={{ color: C.gray }}>{T.okText[lang]}</p>
                <button type="button" onClick={onClose}
                  className="mt-2 px-6 py-2 rounded-full text-sm font-bold cursor-pointer"
                  style={{ background: 'linear-gradient(135deg,#7B2FFF,#1B3DFF)', color: C.white, border: 'none' }}>
                  {T.close[lang]}
                </button>
              </div>
            ) : (
              <>
                <img src="/maigia-logo-girasomnis.png" alt="MAIGIA by Girasomnis" className="h-12 sm:h-16 mb-4 sm:mb-5" style={{ objectFit: 'contain' }} />
                <h2 id={titleId} className="text-2xl mb-1" style={{ color: C.white, fontFamily: "'Syne', sans-serif", fontWeight: 650, letterSpacing: '-0.02em' }}>{T.title[lang]}</h2>
                <p id={descId} className="text-sm mb-5 sm:mb-6" style={{ color: C.gray }}>{T.subtitle[lang]}</p>

                <form name={FORM_NAME} method="POST" data-netlify="true" data-netlify-honeypot="bot-field"
                  onSubmit={onSubmit} className="flex flex-col gap-4" aria-busy={sending}>
                  <input type="hidden" name="form-name" value={FORM_NAME} />
                  {/* honeypot antispam: invisible para personas */}
                  <p className="sr-only" aria-hidden="true">
                    <label>No rellenar <input name="bot-field" tabIndex={-1} autoComplete="off" /></label>
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label htmlFor={id('nombre')} className="text-xs uppercase tracking-wider" style={{ color: C.gray }}>{T.name[lang]}</label>
                      <input ref={firstFieldRef} id={id('nombre')} name="nombre" required autoComplete="name"
                        placeholder={T.namePh[lang]} className="rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00B8FF]" style={fieldStyle} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label htmlFor={id('email')} className="text-xs uppercase tracking-wider" style={{ color: C.gray }}>Email</label>
                      <input id={id('email')} name="email" type="email" required autoComplete="email" inputMode="email"
                        placeholder={T.emailPh[lang]} className="rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00B8FF]" style={fieldStyle} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor={id('tipo')} className="text-xs uppercase tracking-wider" style={{ color: C.gray }}>{T.type[lang]}</label>
                    <select id={id('tipo')} name="tipo" defaultValue={defaultType}
                      className="rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00B8FF]"
                      style={{ ...fieldStyle, background: '#0D1829' }}>
                      <option value="">{T.select[lang]}</option>
                      {PROJECT_TYPES.map(o => <option key={o.value} value={o.value}>{o[lang]}</option>)}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor={id('mensaje')} className="text-xs uppercase tracking-wider" style={{ color: C.gray }}>{T.idea[lang]}</label>
                    <textarea id={id('mensaje')} name="mensaje" required rows={4} defaultValue={defaultMessage}
                      placeholder={T.ideaPh[lang]}
                      className="rounded-xl px-4 py-3 text-sm outline-none resize-none focus:border-[#00B8FF]" style={fieldStyle} />
                  </div>

                  <div aria-live="assertive">
                    {status === 'error' && (
                      <div className="rounded-xl px-4 py-3 text-sm" style={{ border: `1px solid ${C.error}`, color: C.white, background: 'rgba(255,107,107,0.08)' }}>
                        <strong style={{ color: C.error }}>{T.errTitle[lang]}</strong>{' '}
                        {T.errText[lang]}{' '}
                        <a href={`mailto:${FALLBACK_EMAIL}`} style={{ color: C.cyan, textDecoration: 'underline' }}>{FALLBACK_EMAIL}</a>.
                      </div>
                    )}
                  </div>

                  <button type="submit" disabled={sending}
                    className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wide mt-1 cursor-pointer disabled:cursor-wait disabled:opacity-70"
                    style={{ background: `linear-gradient(135deg, ${C.deep} 0%, ${C.blue} 60%, ${C.cyan} 100%)`, color: C.white, boxShadow: `0 0 32px ${C.blue}66`, border: 'none' }}>
                    {sending ? T.sending[lang] : T.send[lang]}
                  </button>

                  <p className="text-xs leading-relaxed" style={{ color: C.gray }}>
                    {T.privacy[lang]}{' '}
                    <a href="/politica-privacidad" target="_blank" rel="noopener" style={{ color: C.cyan, textDecoration: 'underline' }}>{T.privacyLink[lang]}</a>.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
