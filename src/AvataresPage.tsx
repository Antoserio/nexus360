import { useEffect, useRef, useState } from 'react'
import { GlowCursor, CursorParticles } from './components/GlowCursor'
import { useLang, type Lang } from '@/lib/lang'
import { LangToggle } from '@/components/LangToggle'

const C = {
  bg: '#05070D', blue: '#00B8FF', cyan: '#22D3FF',
  deep: '#1B3DFF', gold: '#FFD42A', goldSoft: '#F6B93B', purple: '#7B2FFF',
  white: '#F4F7FB', gray: '#AAB3C2', border: '#223044',
}

type T = { es: string; en: string }

interface Avatar {
  num: string
  name: string
  accent: string
  image: string
  imagePosition?: string
  video?: string
  youtube?: { cas: string; eng: string }
  desc: T
  tags: T[]
  note?: T
}

const AVATARS: Avatar[] = [
  {
    num: '01', name: 'Viky · Girasomnis', accent: C.blue,
    image: '/avatares/viky.jpg',
    youtube: { cas: 'W0EKcrfuCL8', eng: 'qmQq8Bkq_TY' },
    desc: {
      es: 'Avatar conversacional interactivo para eventos, marcas y espacios corporativos. Reel de presentación con contenido LED de alta gama, disponible en español e inglés.',
      en: 'Interactive conversational avatar for events, brands and corporate spaces. Presentation reel with high-end LED content, available in Spanish and English.',
    },
    tags: [
      { es: 'Conversación en vivo', en: 'Live conversation' },
      { es: 'Multilingüe', en: 'Multilingual' },
      { es: 'Presencia en eventos', en: 'Event presence' },
      { es: 'Captación de leads', en: 'Lead capture' },
    ],
  },
  {
    num: '02', name: 'Viky · DES', accent: C.blue,
    image: '/avatares/viky.jpg',
    video: '/avatares/viky-des.mp4',
    desc: {
      es: 'Viky ha conversado en tiempo real con cientos de personas sobre el escenario de DES Málaga 2026, manteniendo más de 800 conversaciones reales con asistentes.',
      en: 'Viky has held real-time conversations with hundreds of people on stage at DES Málaga 2026, holding more than 800 real conversations with attendees.',
    },
    tags: [
      { es: 'Conversación en vivo', en: 'Live conversation' },
      { es: 'Multilingüe', en: 'Multilingual' },
      { es: 'Presencia en eventos', en: 'Event presence' },
      { es: 'Captación de leads', en: 'Lead capture' },
    ],
  },
  {
    num: '03', name: 'Joy', accent: C.cyan,
    image: '/avatares/joy.png',
    video: '/avatares/joy-hotel.mp4',
    desc: {
      es: 'Humano digital 3D con presencia realista: expresiones faciales, mirada, parpadeo, gestos y sincronización labial. Pensada para hospitality, turismo, marca y atención premium.',
      en: 'A 3D digital human with a realistic presence: facial expressions, gaze, blinking, gestures and lip sync. Designed for hospitality, tourism, branding and premium guest care.',
    },
    tags: [
      { es: 'Hospitality y turismo', en: 'Hospitality & tourism' },
      { es: 'Atención premium', en: 'Premium guest care' },
      { es: 'Recepción y showrooms', en: 'Reception & showrooms' },
      { es: 'Multilingüe', en: 'Multilingual' },
    ],
    note: {
      es: '📍 Próxima parada: estaremos con Joy en el TIS Sevilla (Tourism Innovation Summit), con un mapa interactivo del recinto diseñado en exclusiva para ellos.',
      en: '📍 Next stop: we\'ll be with Joy at TIS Sevilla (Tourism Innovation Summit), with an interactive venue map designed exclusively for them.',
    },
  },
  {
    num: '04', name: 'Toby', accent: C.gold,
    image: '/avatares/toby.png',
    imagePosition: 'center 30%',
    desc: {
      es: 'Personaje robótico generado proceduralmente, con ojos y núcleo luminosos y animaciones propias. Latencia casi cero y capaz de hablar en más de 50 idiomas en tiempo real.',
      en: 'A procedurally generated robotic character, with glowing eyes and core and its own animations. Near-zero latency and able to speak in more than 50 languages in real time.',
    },
    tags: [
      { es: 'Industria y tecnología', en: 'Industry & technology' },
      { es: 'Educación', en: 'Education' },
      { es: '+50 idiomas', en: '50+ languages' },
      { es: 'Latencia casi cero', en: 'Near-zero latency' },
    ],
  },
  {
    num: '05', name: 'Velázquez', accent: C.purple,
    image: '/avatares/velazquez.png',
    desc: {
      es: 'Personaje de marca a medida: embajador corporativo o histórico. Personalidad, vestuario, colores, entorno y tono se diseñan a medida de cada cliente.',
      en: 'A custom brand character: corporate or historical ambassador. Personality, wardrobe, colours, setting and tone are all designed to each client\'s needs.',
    },
    tags: [
      { es: 'Personajes a medida', en: 'Custom characters' },
      { es: 'Museos y cultura', en: 'Museums & culture' },
      { es: 'Marca e institucional', en: 'Brand & institutional' },
      { es: 'Eventos', en: 'Events' },
    ],
  },
]

function SoundIcon({ muted }: { muted: boolean }) {
  return muted ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function YoutubeMedia({ a, lang }: { a: Avatar & { youtube: { cas: string; eng: string } }; lang: Lang }) {
  const [videoLang, setVideoLang] = useState<'cas' | 'eng'>('cas')
  const [playing, setPlaying] = useState(false)
  const videoId = a.youtube[videoLang]

  return (
    <div className="relative overflow-hidden rounded-2xl"
      style={{
        aspectRatio: '4 / 5',
        border: `1px solid ${a.accent}40`,
        boxShadow: `0 0 50px ${a.accent}25, 0 20px 50px rgba(0,0,0,0.5)`,
        background: '#000',
      }}>
      {playing ? (
        <iframe
          key={videoId}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1`}
          title={lang === 'es' ? `Vídeo de ${a.name}` : `${a.name} video`}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0" />
      ) : (
        <button onClick={() => setPlaying(true)}
          className="absolute inset-0 w-full h-full"
          style={{ border: 'none', cursor: 'pointer', padding: 0, background: 'none' }}
          aria-label={lang === 'es' ? `Reproducir vídeo de ${a.name}` : `Play ${a.name} video`}>
          <img src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt=""
            className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: 'center 15%' }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 55%, rgba(5,7,13,0.75) 100%)` }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: `${a.accent}CC`, color: '#05070D', boxShadow: `0 0 30px ${a.accent}80` }}>
              <PlayIcon />
            </span>
          </div>
        </button>
      )}

      <span className="absolute bottom-4 left-5 font-black pointer-events-none" style={{ fontSize: 42, color: `${a.accent}55`, letterSpacing: '-0.03em' }}>
        {a.num}
      </span>

      <div className="absolute top-3 right-3 flex rounded-full overflow-hidden"
        style={{ border: `1px solid ${C.border}`, background: 'rgba(5,7,13,0.6)', backdropFilter: 'blur(6px)' }}>
        {(['cas', 'eng'] as const).map(l => (
          <button key={l} onClick={() => { setVideoLang(l); setPlaying(false) }}
            style={{
              padding: '6px 12px', fontSize: 11, fontWeight: 800, letterSpacing: '0.04em',
              border: 'none', cursor: 'pointer',
              background: videoLang === l ? a.accent : 'transparent',
              color: videoLang === l ? '#05070D' : C.white,
            }}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  )
}

function AvatarMedia({ a, lang }: { a: Avatar; lang: Lang }) {
  const ref = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [canPlay, setCanPlay] = useState(false)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    if (!a.video) return
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setCanPlay(true); obs.disconnect() }
    }, { rootMargin: '400px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [a.video])

  const toggleSound = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    if (!v.muted) v.play().catch(() => {})
    setMuted(v.muted)
  }

  if (a.youtube) return <YoutubeMedia a={a as Avatar & { youtube: { cas: string; eng: string } }} lang={lang} />

  return (
    <div ref={ref} className="relative overflow-hidden rounded-2xl"
      style={{
        aspectRatio: '4 / 5',
        border: `1px solid ${a.accent}40`,
        boxShadow: `0 0 50px ${a.accent}25, 0 20px 50px rgba(0,0,0,0.5)`,
      }}>
      {a.video ? (
        <video
          ref={videoRef}
          src={canPlay ? a.video : undefined}
          poster={a.image}
          autoPlay muted loop playsInline preload="none"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: a.imagePosition ?? 'center 15%' }} />
      ) : (
        <img src={a.image} alt={lang === 'es' ? `Avatar ${a.name}` : `${a.name} avatar`} loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: a.imagePosition ?? 'center 15%' }} />
      )}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `linear-gradient(180deg, transparent 55%, rgba(5,7,13,0.75) 100%)` }} />
      <span className="absolute bottom-4 left-5 font-black" style={{ fontSize: 42, color: `${a.accent}55`, letterSpacing: '-0.03em' }}>
        {a.num}
      </span>
      {a.video && canPlay && (
        <button onClick={toggleSound}
          aria-label={muted ? (lang === 'es' ? 'Activar sonido' : 'Unmute') : (lang === 'es' ? 'Silenciar' : 'Mute')}
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(5,7,13,0.6)', backdropFilter: 'blur(6px)',
            border: `1px solid ${muted ? C.border : a.accent}`, color: muted ? C.white : a.accent,
            cursor: 'pointer',
          }}>
          <SoundIcon muted={muted} />
        </button>
      )}
    </div>
  )
}

export default function AvataresPage() {
  const [lang, setLang] = useLang()
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
          <img src="/maigia-logo-girasomnis.png" alt="MAIGIA by Girasomnis" style={{ height: 92, width: 'auto', objectFit: 'contain' }} />
        </a>
        <div className="flex items-center gap-4 md:gap-6">
          <a href="/" style={{ color: C.gray, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
            {lang === 'es' ? '← Volver' : '← Back'}
          </a>
          <LangToggle lang={lang} setLang={setLang} />
          <button onClick={() => openContact()}
            style={{
              background: `linear-gradient(90deg, ${C.blue}, ${C.deep})`, color: C.white,
              boxShadow: '0 0 18px rgba(0,184,255,0.3)', border: 'none', cursor: 'pointer',
              padding: '9px 20px', borderRadius: 999, fontSize: 13, fontWeight: 700, letterSpacing: '0.03em',
            }}>
            {lang === 'es' ? 'Contactar' : 'Contact'}
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
          {lang === 'es' ? 'Avatares IA' : 'AI Avatars'}
        </span>
        <h1 className="relative" style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 750, textTransform: 'uppercase',
          letterSpacing: '-0.03em', lineHeight: 1.05, fontSize: 'clamp(2.1rem,5vw,3.8rem)', maxWidth: 780,
        }}>
          {lang === 'es'
            ? <>Presencia digital que <span style={{ color: C.blue }}>habla, mira y conecta</span></>
            : <>A digital presence that <span style={{ color: C.blue }}>speaks, watches and connects</span></>}
        </h1>
        <p className="relative mt-5" style={{ color: C.gray, fontSize: 'clamp(0.95rem,1.3vw,1.15rem)', maxWidth: 620 }}>
          {lang === 'es'
            ? 'Cinco avatares listos para llevar a tu evento, stand o espacio. Cuéntanos tu proyecto y te mostramos cuál encaja mejor — y si quieres, lo pruebas en directo.'
            : 'Five avatars ready to bring to your event, stand or space. Tell us about your project and we\'ll show you which one fits best — and if you like, you can try it live.'}
        </p>
        <div className="relative flex flex-wrap items-center justify-center gap-4 mt-8">
          <button onClick={() => openContact()}
            style={{
              background: `linear-gradient(90deg, ${C.blue}, ${C.deep})`, color: C.white,
              boxShadow: '0 0 24px rgba(0,184,255,0.4)', border: 'none', cursor: 'pointer',
              padding: '13px 30px', borderRadius: 999, fontSize: 14, fontWeight: 700, letterSpacing: '0.03em',
            }}>
            {lang === 'es' ? 'Contáctanos' : 'Contact us'}
          </button>
          <a href="#avatares-lista"
            onClick={e => { e.preventDefault(); document.getElementById('avatares-lista')?.scrollIntoView({ behavior: 'smooth' }) }}
            style={{
              color: C.white, textDecoration: 'none', fontSize: 14, fontWeight: 600,
              border: `1px solid ${C.border}`, borderRadius: 999, padding: '13px 26px', cursor: 'pointer',
            }}>
            {lang === 'es' ? 'Ver avatares ↓' : 'See avatars ↓'}
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

                {/* Imagen / vídeo */}
                <div className="w-full md:w-[38%] shrink-0">
                  <AvatarMedia a={a} lang={lang} />
                </div>

                {/* Texto */}
                <div className="w-full md:w-[62%] flex flex-col gap-5">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span style={{
                        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                        border: `1px solid ${a.accent}90`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700, fontFamily: "'Syne', sans-serif", color: a.accent,
                      }}>
                        {a.num}
                      </span>
                      <span style={{
                        fontSize: 11, fontWeight: 700, fontFamily: "'Syne', sans-serif",
                        letterSpacing: '0.15em', textTransform: 'uppercase', color: C.white,
                      }}>
                        {lang === 'es' ? 'Avatar' : 'Avatar'}
                      </span>
                    </div>
                    <h2 style={{
                      fontFamily: "'Syne', sans-serif", fontWeight: 650,
                      letterSpacing: '-0.04em', fontSize: 'clamp(1.9rem,3vw,2.8rem)', color: C.white, lineHeight: 1.05,
                    }}>
                      {a.name}
                    </h2>
                  </div>

                  <p className="leading-relaxed" style={{ color: C.gray, fontSize: '1rem', maxWidth: 560 }}>
                    {a.desc[lang]}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {a.tags.map(tag => (
                      <span key={tag.es} className="text-xs px-3 py-1.5 rounded-full"
                        style={{ background: `${a.accent}14`, border: `1px solid ${a.accent}35`, color: a.accent }}>
                        {tag[lang]}
                      </span>
                    ))}
                  </div>

                  {a.note && (
                    <div className="rounded-xl px-4 py-3 text-sm leading-relaxed"
                      style={{ background: `${a.accent}0F`, border: `1px solid ${a.accent}30`, color: C.white }}>
                      {a.note[lang]}
                    </div>
                  )}

                  {/* CTA card — sin conversación en directo, solo contacto */}
                  <div className="mt-2 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}` }}>
                    <div>
                      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-1" style={{ color: a.accent }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: a.accent }} />
                        {lang === 'es' ? '¿Te lo imaginas en tu evento?' : 'Can you picture it at your event?'}
                      </span>
                      <p style={{ color: C.gray, fontSize: '0.85rem' }}>
                        {lang === 'es' ? 'Cuéntanos tu caso y, si quieres, te lo mostramos en directo.' : 'Tell us about your case and, if you like, we\'ll show it to you live.'}
                      </p>
                    </div>
                    <button onClick={() => openContact(a.name)}
                      className="shrink-0"
                      style={{
                        background: a.accent, color: '#05070D', border: 'none', cursor: 'pointer',
                        padding: '11px 22px', borderRadius: 999, fontSize: 13, fontWeight: 800, letterSpacing: '0.02em',
                        whiteSpace: 'nowrap',
                      }}>
                      {lang === 'es' ? 'Solicitar info' : 'Request info'}
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
        <h2 className="relative leading-tight mb-4" style={{
          fontSize: 'clamp(1.7rem,3.2vw,2.8rem)', maxWidth: 640,
          fontFamily: "'Syne', sans-serif", fontWeight: 650, letterSpacing: '-0.04em',
        }}>
          {lang === 'es' ? 'Una presencia digital que la gente recuerda' : 'A digital presence people remember'}
        </h2>
        <p className="relative mb-8" style={{ color: C.gray, maxWidth: 520 }}>
          {lang === 'es'
            ? 'Diseñamos un anfitrión digital con un objetivo, una personalidad y un comportamiento pensado para tu espacio. Hablemos de tu proyecto.'
            : 'We design a digital host with a purpose, a personality and a behaviour built for your space. Let\'s talk about your project.'}
        </p>
        <button onClick={() => openContact()}
          className="relative"
          style={{
            background: `linear-gradient(90deg, ${C.blue}, ${C.deep})`, color: C.white,
            boxShadow: '0 0 28px rgba(0,184,255,0.45)', border: 'none', cursor: 'pointer',
            padding: '14px 32px', borderRadius: 999, fontSize: 15, fontWeight: 700, letterSpacing: '0.03em',
          }}>
          {lang === 'es' ? 'Contactar ahora' : 'Contact now'}
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
                <h3 className="text-xl" style={{ color: C.white, fontFamily: "'Syne', sans-serif", fontWeight: 650, letterSpacing: '-0.02em' }}>{lang === 'es' ? '¡Mensaje enviado!' : 'Message sent!'}</h3>
                <p style={{ color: C.gray }}>{lang === 'es' ? 'Te responderemos lo antes posible.' : 'We\'ll get back to you as soon as possible.'}</p>
                <button onClick={() => { setContactOpen(false); setFormSent(false) }}
                  className="mt-2 px-6 py-2 rounded-full text-sm font-bold"
                  style={{ background: 'linear-gradient(135deg,#7B2FFF,#1B3DFF)', color: C.white, border: 'none', cursor: 'pointer' }}>
                  {lang === 'es' ? 'Cerrar' : 'Close'}
                </button>
              </div>
            ) : (
              <>
                <img src="/maigia-logo-girasomnis.png" alt="MAIGIA by Girasomnis" style={{ height: 64, objectFit: 'contain', marginBottom: 20 }} />
                <h2 className="text-2xl mb-1" style={{ color: C.white, fontFamily: "'Syne', sans-serif", fontWeight: 650, letterSpacing: '-0.02em' }}>{lang === 'es' ? 'Cuéntanos tu proyecto' : 'Tell us about your project'}</h2>
                <p className="text-sm mb-6" style={{ color: C.gray }}>{lang === 'es' ? 'Responderemos en menos de 24h.' : 'We\'ll reply within 24h.'}</p>

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
                      <label className="text-xs uppercase tracking-wider" style={{ color: C.gray }}>{lang === 'es' ? 'Nombre' : 'Name'}</label>
                      <input name="nombre" required placeholder={lang === 'es' ? 'Tu nombre' : 'Your name'}
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
                    <label className="text-xs uppercase tracking-wider" style={{ color: C.gray }}>{lang === 'es' ? 'Tipo de proyecto' : 'Project type'}</label>
                    <select name="tipo" defaultValue="Avatar IA"
                      style={{ background: '#0D1829', border: `1px solid ${C.border}`, color: C.white }}
                      className="rounded-xl px-4 py-3 text-sm outline-none">
                      <option value="">{lang === 'es' ? 'Selecciona una opción' : 'Select an option'}</option>
                      <option>{lang === 'es' ? 'Avatar IA' : 'AI Avatar'}</option>
                      <option>{lang === 'es' ? 'Instalación interactiva' : 'Interactive installation'}</option>
                      <option>{lang === 'es' ? 'Producción audiovisual con IA' : 'AI audiovisual production'}</option>
                      <option>{lang === 'es' ? 'Solución digital / Web' : 'Digital solution / Website'}</option>
                      <option>{lang === 'es' ? 'Otro' : 'Other'}</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs uppercase tracking-wider" style={{ color: C.gray }}>{lang === 'es' ? 'Cuéntanos tu idea' : 'Tell us your idea'}</label>
                    <textarea name="mensaje" required rows={4}
                      defaultValue={selectedAvatar ? (lang === 'es' ? `Me interesa el avatar ${selectedAvatar} para mi evento/espacio. ` : `I'm interested in the ${selectedAvatar} avatar for my event/space. `) : ''}
                      placeholder={lang === 'es' ? 'Describe tu proyecto, evento, marca o lo que necesitas...' : 'Describe your project, event, brand or what you need...'}
                      className="rounded-xl px-4 py-3 text-sm outline-none resize-none"
                      style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, color: C.white }} />
                  </div>

                  <button type="submit"
                    style={{
                      background: `linear-gradient(90deg, ${C.blue}, ${C.deep})`, color: C.white,
                      border: 'none', cursor: 'pointer', padding: '13px', borderRadius: 999,
                      fontSize: 14, fontWeight: 700, letterSpacing: '0.03em', marginTop: 4,
                    }}>
                    {lang === 'es' ? 'Enviar mensaje' : 'Send message'}
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
