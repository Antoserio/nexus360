import { useState } from 'react'
import { GlowCursor, CursorParticles } from './components/GlowCursor'

const C = {
  bg: '#05070D', blue: '#00B8FF', cyan: '#22D3FF',
  deep: '#1B3DFF', gold: '#FFD42A', goldSoft: '#F6B93B', purple: '#7B2FFF',
  white: '#F4F7FB', gray: '#AAB3C2', border: '#223044',
}

interface Avatar {
  num: string
  name: string
  accent: string
  image: string
  imagePosition?: string
  desc: string
  tags: string[]
}

const AVATARS: Avatar[] = [
  {
    num: '01', name: 'Viky', accent: C.blue,
    image: '/avatares/viky.jpg',
    desc: 'Nuestro avatar en vivo. Viky ha conversado en tiempo real con cientos de personas sobre el escenario de DES Málaga 2026, manteniendo más de 800 conversaciones reales con asistentes.',
    tags: ['Conversación en vivo', 'Multilingüe', 'Presencia en eventos', 'Captación de leads'],
  },
  {
    num: '02', name: 'Joy', accent: C.cyan,
    image: '/avatares/joy.png',
    desc: 'Humano digital 3D con presencia realista: expresiones faciales, mirada, parpadeo, gestos y sincronización labial. Pensada para hospitality, turismo, marca y atención premium.',
    tags: ['Hospitality y turismo', 'Atención premium', 'Recepción y showrooms', 'Multilingüe'],
  },
  {
    num: '03', name: 'Toby', accent: C.gold,
    image: '/avatares/toby.png',
    imagePosition: 'center 30%',
    desc: 'Personaje robótico generado proceduralmente, con ojos y núcleo luminosos y animaciones propias. Latencia casi cero y capaz de hablar en más de 50 idiomas en tiempo real.',
    tags: ['Industria y tecnología', 'Educación', '+50 idiomas', 'Latencia casi cero'],
  },
  {
    num: '04', name: 'Velázquez', accent: C.purple,
    image: '/avatares/velazquez.png',
    desc: 'Personaje de marca a medida: embajador corporativo o histórico. Personalidad, vestuario, colores, entorno y tono se diseñan a medida de cada cliente.',
    tags: ['Personajes a medida', 'Museos y cultura', 'Marca e institucional', 'Eventos'],
  },
]

export default function AvataresPage() {
  const [contactOpen, setContactOpen] = useState(false)
  const [formSent, setFormSent] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)

  const openContact = (avatarName?: string) => {
    setSelectedAvatar(avatarName ?? null)
    setContactOpen(true)
  }

  return (
    <div style={{ background: C.bg, color: C.white, minHeight: '100vh', overflowX: 'clip' }}>
      <GlowCursor />
      <CursorParticles />

      {/* ── HEADER ── */}
      <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-10"
        style={{ height: 64, background: 'rgba(5,7,13,0.85)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}` }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/MAIGIA-LOGO-V1.png" alt="MAIGIA" style={{ height: 34, width: 'auto', objectFit: 'contain' }} />
        </a>
        <div className="flex items-center gap-4 md:gap-6">
          <a href="/" style={{ color: C.gray, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
            ← Volver
          </a>
          <button onClick={() => openContact()}
            style={{
              background: `linear-gradient(90deg, ${C.blue}, ${C.deep})`, color: C.white,
              boxShadow: '0 0 18px rgba(0,184,255,0.3)', border: 'none', cursor: 'pointer',
              padding: '9px 20px', borderRadius: 999, fontSize: 13, fontWeight: 700, letterSpacing: '0.03em',
            }}>
            Contactar
          </button>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center justify-center text-center px-6"
        style={{ minHeight: '68vh', paddingTop: 90 }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(0,184,255,0.14) 0%, transparent 70%)',
        }} />
        <span className="relative inline-block mb-5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
          style={{ background: 'rgba(0,184,255,0.10)', border: `1px solid rgba(0,184,255,0.35)`, color: C.blue }}>
          Avatares IA
        </span>
        <h1 className="relative font-black leading-tight" style={{ fontSize: 'clamp(2rem,5vw,3.8rem)', maxWidth: 780 }}>
          Presencia digital que <span style={{ color: C.blue }}>habla, mira y conecta</span>
        </h1>
        <p className="relative mt-5" style={{ color: C.gray, fontSize: 'clamp(0.95rem,1.3vw,1.15rem)', maxWidth: 620 }}>
          Cuatro avatares listos para llevar a tu evento, stand o espacio. Cuéntanos tu proyecto y te mostramos cuál encaja mejor — y si quieres, lo pruebas en directo.
        </p>
        <div className="relative flex flex-wrap items-center justify-center gap-4 mt-8">
          <button onClick={() => openContact()}
            style={{
              background: `linear-gradient(90deg, ${C.blue}, ${C.deep})`, color: C.white,
              boxShadow: '0 0 24px rgba(0,184,255,0.4)', border: 'none', cursor: 'pointer',
              padding: '13px 30px', borderRadius: 999, fontSize: 14, fontWeight: 700, letterSpacing: '0.03em',
            }}>
            Contáctanos
          </button>
          <a href="#avatares-lista"
            onClick={e => { e.preventDefault(); document.getElementById('avatares-lista')?.scrollIntoView({ behavior: 'smooth' }) }}
            style={{
              color: C.white, textDecoration: 'none', fontSize: 14, fontWeight: 600,
              border: `1px solid ${C.border}`, borderRadius: 999, padding: '13px 26px', cursor: 'pointer',
            }}>
            Ver avatares ↓
          </a>
        </div>
      </section>

      {/* ── AVATARES ── */}
      <section id="avatares-lista" className="relative" style={{ padding: '40px 0 100px' }}>
        {AVATARS.map((a, i) => {
          const imageRight = i % 2 !== 0
          return (
            <div key={a.name} className="max-w-6xl mx-auto px-6"
              style={{ padding: '56px 0', borderBottom: i < AVATARS.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <div className={`flex flex-col md:flex-row items-center gap-10 md:gap-16 ${imageRight ? 'md:flex-row-reverse' : ''}`}>

                {/* Imagen */}
                <div className="w-full md:w-[38%] shrink-0">
                  <div className="relative overflow-hidden rounded-2xl"
                    style={{
                      aspectRatio: '4 / 5',
                      border: `1px solid ${a.accent}40`,
                      boxShadow: `0 0 50px ${a.accent}25, 0 20px 50px rgba(0,0,0,0.5)`,
                    }}>
                    <img src={a.image} alt={`Avatar ${a.name}`}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ objectPosition: a.imagePosition ?? 'center 15%' }} />
                    <div className="absolute inset-0 pointer-events-none"
                      style={{ background: `linear-gradient(180deg, transparent 55%, rgba(5,7,13,0.75) 100%)` }} />
                    <span className="absolute bottom-4 left-5 font-black" style={{ fontSize: 42, color: `${a.accent}55`, letterSpacing: '-0.03em' }}>
                      {a.num}
                    </span>
                  </div>
                </div>

                {/* Texto */}
                <div className="w-full md:w-[62%] flex flex-col gap-5">
                  <div>
                    <span className="block text-xs uppercase tracking-widest font-bold mb-2" style={{ color: a.accent }}>
                      Avatar {a.num}
                    </span>
                    <h2 className="font-black" style={{ fontSize: 'clamp(1.7rem,2.6vw,2.4rem)', color: C.white }}>
                      {a.name}
                    </h2>
                  </div>

                  <p className="leading-relaxed" style={{ color: C.gray, fontSize: '1rem', maxWidth: 560 }}>
                    {a.desc}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {a.tags.map(tag => (
                      <span key={tag} className="text-xs px-3 py-1.5 rounded-full"
                        style={{ background: `${a.accent}14`, border: `1px solid ${a.accent}35`, color: a.accent }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA card — sin conversación en directo, solo contacto */}
                  <div className="mt-2 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}` }}>
                    <div>
                      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-1" style={{ color: a.accent }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: a.accent }} />
                        ¿Te lo imaginas en tu evento?
                      </span>
                      <p style={{ color: C.gray, fontSize: '0.85rem' }}>
                        Cuéntanos tu caso y, si quieres, te lo mostramos en directo.
                      </p>
                    </div>
                    <button onClick={() => openContact(a.name)}
                      className="shrink-0"
                      style={{
                        background: a.accent, color: '#05070D', border: 'none', cursor: 'pointer',
                        padding: '11px 22px', borderRadius: 999, fontSize: 13, fontWeight: 800, letterSpacing: '0.02em',
                        whiteSpace: 'nowrap',
                      }}>
                      Solicitar info
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </section>

      {/* ── CIERRE ── */}
      <section className="relative flex flex-col items-center text-center px-6" style={{ padding: '80px 24px 110px' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 55% 55% at 50% 50%, rgba(123,47,255,0.12) 0%, transparent 70%)',
        }} />
        <h2 className="relative font-black leading-tight mb-4" style={{ fontSize: 'clamp(1.7rem,3.2vw,2.8rem)', maxWidth: 640 }}>
          Una presencia digital que la gente recuerda
        </h2>
        <p className="relative mb-8" style={{ color: C.gray, maxWidth: 520 }}>
          Diseñamos un anfitrión digital con un objetivo, una personalidad y un comportamiento pensado para tu espacio. Hablemos de tu proyecto.
        </p>
        <button onClick={() => openContact()}
          className="relative"
          style={{
            background: `linear-gradient(90deg, ${C.blue}, ${C.deep})`, color: C.white,
            boxShadow: '0 0 28px rgba(0,184,255,0.45)', border: 'none', cursor: 'pointer',
            padding: '14px 32px', borderRadius: 999, fontSize: 15, fontWeight: 700, letterSpacing: '0.03em',
          }}>
          Contactar ahora
        </button>
      </section>

      {/* ── MODAL DE CONTACTO ── */}
      {contactOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          onClick={() => setContactOpen(false)}>
          <div className="absolute inset-0" style={{ background: 'rgba(5,7,13,0.92)', backdropFilter: 'blur(12px)' }} />

          <div className="relative w-full max-w-lg rounded-2xl p-8 md:p-10"
            style={{ background: '#071120', border: `1px solid ${C.border}`, boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}
            onClick={e => e.stopPropagation()}>

            <button onClick={() => { setContactOpen(false); setFormSent(false) }}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full"
              style={{ background: 'rgba(255,255,255,0.06)', color: C.gray, border: 'none', cursor: 'pointer' }}>✕</button>

            {formSent ? (
              <div className="flex flex-col items-center justify-center py-8 gap-4 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(123,47,255,0.15)', border: '1px solid #7B2FFF' }}>
                  <span style={{ fontSize: 28 }}>✓</span>
                </div>
                <h3 className="font-black text-xl" style={{ color: C.white }}>¡Mensaje enviado!</h3>
                <p style={{ color: C.gray }}>Te responderemos lo antes posible.</p>
                <button onClick={() => { setContactOpen(false); setFormSent(false) }}
                  className="mt-2 px-6 py-2 rounded-full text-sm font-bold"
                  style={{ background: 'linear-gradient(135deg,#7B2FFF,#1B3DFF)', color: C.white, border: 'none', cursor: 'pointer' }}>
                  Cerrar
                </button>
              </div>
            ) : (
              <>
                <img src="/MAIGIA-LOGO-V1.png" alt="MAIGIA" style={{ height: 28, objectFit: 'contain', marginBottom: 20 }} />
                <h2 className="font-black text-2xl mb-1" style={{ color: C.white }}>Cuéntanos tu proyecto</h2>
                <p className="text-sm mb-6" style={{ color: C.gray }}>Responderemos en menos de 24h.</p>

                <form
                  name="contacto-aiasomnis"
                  method="POST"
                  data-netlify="true"
                  onSubmit={async e => {
                    e.preventDefault()
                    const form = e.currentTarget as HTMLFormElement
                    const params = new URLSearchParams()
                    new FormData(form).forEach((v, k) => params.append(k, v.toString()))
                    const data = params.toString()
                    try {
                      await fetch('/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: data,
                      })
                    } catch (_) { /* en local puede fallar, en Netlify funciona */ }
                    setFormSent(true)
                  }}
                  className="flex flex-col gap-4">

                  <input type="hidden" name="form-name" value="contacto-aiasomnis" />

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs uppercase tracking-wider" style={{ color: C.gray }}>Nombre</label>
                      <input name="nombre" required placeholder="Tu nombre"
                        className="rounded-xl px-4 py-3 text-sm outline-none"
                        style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, color: C.white }} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs uppercase tracking-wider" style={{ color: C.gray }}>Email</label>
                      <input name="email" type="email" required placeholder="tu@email.com"
                        className="rounded-xl px-4 py-3 text-sm outline-none"
                        style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, color: C.white }} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs uppercase tracking-wider" style={{ color: C.gray }}>Tipo de proyecto</label>
                    <select name="tipo" defaultValue="Avatar IA"
                      style={{ background: '#0D1829', border: `1px solid ${C.border}`, color: C.white }}
                      className="rounded-xl px-4 py-3 text-sm outline-none">
                      <option value="">Selecciona una opción</option>
                      <option>Avatar IA</option>
                      <option>Instalación interactiva</option>
                      <option>Producción audiovisual con IA</option>
                      <option>Solución digital / Web</option>
                      <option>Otro</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs uppercase tracking-wider" style={{ color: C.gray }}>Cuéntanos tu idea</label>
                    <textarea name="mensaje" required rows={4}
                      defaultValue={selectedAvatar ? `Me interesa el avatar ${selectedAvatar} para mi evento/espacio. ` : ''}
                      placeholder="Describe tu proyecto, evento, marca o lo que necesitas..."
                      className="rounded-xl px-4 py-3 text-sm outline-none resize-none"
                      style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, color: C.white }} />
                  </div>

                  <button type="submit"
                    style={{
                      background: `linear-gradient(90deg, ${C.blue}, ${C.deep})`, color: C.white,
                      border: 'none', cursor: 'pointer', padding: '13px', borderRadius: 999,
                      fontSize: 14, fontWeight: 700, letterSpacing: '0.03em', marginTop: 4,
                    }}>
                    Enviar mensaje
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
