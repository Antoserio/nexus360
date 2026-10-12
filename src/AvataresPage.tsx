import { useEffect, useRef, useState } from 'react'
import { GlowCursor, CursorParticles } from './components/GlowCursor'
import { useLang, type Lang } from '@/lib/lang'
import { LangToggle } from '@/components/LangToggle'
import { OPPORTUNITY, MODULES, DEPLOYMENT, CAPABILITIES, MARKETS, OFFER, type T } from '@/lib/avataresContent'

const C = {
  bg: '#05070D', blue: '#00B8FF', cyan: '#22D3FF',
  deep: '#1B3DFF', gold: '#FFD42A', goldSoft: '#F6B93B', purple: '#7B2FFF',
  white: '#F4F7FB', gray: '#AAB3C2', border: '#223044',
}

interface Avatar {
  num: string
  name: string
  accent: string
  image?: string
  status?: T
  imagePosition?: string
  video?: string
  youtube?: { cas: string; eng: string }
  desc: T
  tags: T[]
  note?: T
}

const TAGS_LIVE: T[] = [
  { es: 'Conversación en vivo', en: 'Live conversation' },
  { es: 'Multilingüe', en: 'Multilingual' },
  { es: 'Presencia en eventos', en: 'Event presence' },
  { es: 'Captación de leads', en: 'Lead capture' },
]

const AVATARS: Avatar[] = [
  {
    num: '01', name: 'Viky · Girasomnis', accent: C.blue,
    image: '/avatares/viky.jpg',
    youtube: { cas: 'W0EKcrfuCL8', eng: 'qmQq8Bkq_TY' },
    desc: {
      es: 'Nuestro primer modelo: avatar conversacional interactivo para eventos, marcas y espacios corporativos. Reel de presentación con contenido LED de alta gama, disponible en español e inglés.',
      en: 'Our first model: an interactive conversational avatar for events, brands and corporate spaces. Presentation reel with high-end LED content, available in Spanish and English.',
    },
    tags: TAGS_LIVE,
  },
  {
    num: '02', name: 'Viky · DES', accent: C.blue,
    image: '/avatares/viky.jpg',
    video: '/avatares/viky-des.mp4',
    desc: {
      es: 'Viky actuó en el escenario de DES Málaga 2026 en tiempo real, conversando en vivo con la presentadora en varios momentos y manteniendo más de 800 conversaciones reales con asistentes.',
      en: 'Viky performed on stage at DES Málaga 2026 in real time, chatting live with the host at several points and holding more than 800 real conversations with attendees.',
    },
    tags: TAGS_LIVE,
  },
  {
    num: '03', name: 'Viky · Versión Fluge', accent: C.goldSoft,
    image: '/viky-fluge.jpg',
    desc: {
      es: 'Variante de Viky desplegada con Fluge Audiovisuales: sesión conversacional en vivo y demostración en vídeo del avatar funcionando. Para hablar con ella, llámala por su nombre: «Viky».',
      en: 'A variant of Viky deployed with Fluge Audiovisuales: a live conversational session and a video demo of the avatar at work. To talk to her, call her by name: "Viky".',
    },
    tags: TAGS_LIVE,
  },
  {
    num: '04', name: 'Joy', accent: C.cyan,
    image: '/avatares/joy.png',
    video: '/avatares/joy-hotel.mp4',
    desc: {
      es: 'Humano digital 3D con presencia realista: expresiones faciales, mirada, parpadeo, gestos y sincronización labial. Ideal para hospitality, turismo, marca y atención premium.',
      en: 'A 3D digital human with a realistic presence: facial expressions, gaze, blinking, gestures and lip sync. Ideal for hospitality, tourism, branding and premium guest care.',
    },
    tags: [
      { es: 'Hospitality y turismo', en: 'Hospitality & tourism' },
      { es: 'Atención premium', en: 'Premium guest care' },
      { es: 'Recepción y showrooms', en: 'Reception & showrooms' },
      { es: 'Multilingüe', en: 'Multilingual' },
    ],
    note: {
      es: '📍 Versión TIS Sevilla: Joy preparada para el Tourism Innovation Summit (Sevilla, 6–8 de octubre de 2026) y enlazada a un mapa interactivo del evento creado en exclusiva para ellos.',
      en: '📍 TIS Sevilla edition: Joy set up for the Tourism Innovation Summit (Seville, 6–8 October 2026) and linked to an interactive event map created exclusively for them.',
    },
  },
  {
    num: '05', name: 'Toby', accent: C.gold,
    image: '/avatares/toby.png',
    imagePosition: 'center 30%',
    desc: {
      es: 'Robot 3D metálico generado proceduralmente, con ojos y núcleo luminosos y animaciones idle. Latencia casi cero y capaz de hablar en más de 50 idiomas en tiempo real. Ideal para industria, educación y tecnología.',
      en: 'A metallic 3D robot generated procedurally, with glowing eyes and core and idle animations. Near-zero latency and able to speak more than 50 languages in real time. Ideal for industry, education and technology.',
    },
    tags: [
      { es: 'Industria y tecnología', en: 'Industry & technology' },
      { es: 'Educación', en: 'Education' },
      { es: '+50 idiomas', en: '50+ languages' },
      { es: 'Latencia casi cero', en: 'Near-zero latency' },
    ],
  },
  {
    num: '06', name: 'Velázquez', accent: C.purple,
    image: '/avatares/velazquez.png',
    desc: {
      es: 'Personaje de marca a medida: embajador corporativo o personaje histórico. Personalidad, vestuario, colores, entorno y tono se alinean con la identidad del cliente.',
      en: 'A custom brand character: corporate ambassador or historical figure. Personality, wardrobe, colours, setting and tone are aligned with the client\'s identity.',
    },
    tags: [
      { es: 'Personajes a medida', en: 'Custom characters' },
      { es: 'Museos y cultura', en: 'Museums & culture' },
      { es: 'Marca e institucional', en: 'Brand & institutional' },
      { es: 'Eventos', en: 'Events' },
    ],
  },
  {
    num: '07', name: 'Helen', accent: C.cyan,
    status: { es: 'Demo en preparación', en: 'Demo in preparation' },
    desc: {
      es: 'Versión humana de cuerpo completo: humano digital con apariencia totalmente humana. Presencia natural para recepción, eventos y atención de marca.',
      en: 'Full-body human version: a digital human with a fully human appearance. A natural presence for reception, events and brand service.',
    },
    tags: [
      { es: 'Cuerpo completo', en: 'Full body' },
      { es: 'Recepción', en: 'Reception' },
      { es: 'Eventos', en: 'Events' },
      { es: 'Atención de marca', en: 'Brand service' },
    ],
  },
  {
    num: '08', name: 'Mia · Fluge Audiovisuales', accent: C.goldSoft,
    image: '/mia-fluge.jpg', imagePosition: 'center 18%',
    desc: {
      es: 'Humana digital creada para Fluge Audiovisuales. Presenta la marca, sus servicios y atiende a clientes en eventos y espacios corporativos.',
      en: 'A digital human created for Fluge Audiovisuales. She presents the brand and its services and looks after clients at events and corporate spaces.',
    },
    tags: [
      { es: 'Presentadora de marca', en: 'Brand presenter' },
      { es: 'Eventos corporativos', en: 'Corporate events' },
      { es: 'Atención a clientes', en: 'Client service' },
      { es: 'Conversación en vivo', en: 'Live conversation' },
    ],
  },
  {
    num: '09', name: 'Max', accent: C.blue,
    status: { es: 'En producción', en: 'In production' },
    desc: {
      es: 'Nuevo humano digital 3D en desarrollo. Presencia corporativa elegante, ideal para recepción, showrooms y eventos de marca.',
      en: 'A new 3D digital human in development. An elegant corporate presence, ideal for reception, showrooms and brand events.',
    },
    tags: [
      { es: 'Presencia corporativa', en: 'Corporate presence' },
      { es: 'Recepción', en: 'Reception' },
      { es: 'Showrooms', en: 'Showrooms' },
      { es: 'Eventos de marca', en: 'Brand events' },
    ],
  },
  {
    num: '10', name: 'Joy VR · Joy Offline', accent: C.purple,
    status: { es: 'En producción', en: 'In production' },
    desc: {
      es: 'Dos variantes de Joy en desarrollo: una para inmersión en realidad virtual y experiencias 360º, y otra para despliegue local sin dependencia de nube, pensada para entornos con requisitos estrictos de privacidad y protección de datos.',
      en: 'Two variants of Joy in development: one for virtual reality immersion and 360º experiences, and another for local deployment with no cloud dependency, designed for environments with strict privacy and data-protection requirements.',
    },
    tags: [
      { es: 'Realidad virtual y 360º', en: 'VR & 360º' },
      { es: 'Sin dependencia de nube', en: 'No cloud dependency' },
      { es: 'Privacidad de datos', en: 'Data privacy' },
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
      ) : a.image ? (
        <img src={a.image} alt={lang === 'es' ? `Avatar ${a.name}` : `${a.name} avatar`} loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: a.imagePosition ?? 'center 15%' }} />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center"
          style={{ background: `radial-gradient(ellipse 70% 55% at 50% 42%, ${a.accent}30 0%, #071120 70%)` }}>
          <span className="font-black" style={{
            fontFamily: "'Syne', sans-serif", fontSize: 'clamp(3rem, 9vw, 5.5rem)', letterSpacing: '-0.04em',
            color: 'transparent', WebkitTextStroke: `1.5px ${a.accent}80`,
          }}>
            {a.name.split(' ')[0]}
          </span>
        </div>
      )}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `linear-gradient(180deg, transparent 55%, rgba(5,7,13,0.75) 100%)` }} />
      {a.status && (
        <span className="absolute top-3 left-3 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(5,7,13,0.7)', backdropFilter: 'blur(6px)', border: `1px solid ${a.accent}70`, color: a.accent }}>
          {a.status[lang]}
        </span>
      )}
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

function SectionHead({ eyebrow, title, lang, align = 'left' }: { eyebrow: T; title: T; lang: Lang; align?: 'left' | 'center' }) {
  return (
    <div style={{ textAlign: align, marginBottom: 40 }}>
      <p style={{ color: C.blue, fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>
        {eyebrow[lang]}
      </p>
      <h2 style={{
        fontFamily: "'Syne', sans-serif", fontWeight: 650, letterSpacing: '-0.03em', lineHeight: 1.1,
        fontSize: 'clamp(1.7rem,3.2vw,2.6rem)', color: C.white, maxWidth: 760,
        marginInline: align === 'center' ? 'auto' : undefined,
      }}>
        {title[lang]}
      </h2>
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, borderRadius: 16, padding: 24,
}

export default function AvataresPage() {
  const [lang, setLang] = useLang()
  const [contactOpen, setContactOpen] = useState(false)
  const [formSent, setFormSent] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
  const [prefill, setPrefill] = useState<T | null>(null)

  const openContact = (avatarName?: string, customPrefill?: T) => {
    setSelectedAvatar(avatarName ?? null)
    setPrefill(customPrefill ?? null)
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
            ? 'Un catálogo de avatares listos para llevar a tu evento, stand o espacio. Cuéntanos tu proyecto y te mostramos cuál encaja mejor — y si quieres, lo pruebas en directo.'
            : 'A catalogue of avatars ready to bring to your event, stand or space. Tell us about your project and we\'ll show you which one fits best — and if you like, you can try it live.'}
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

      {/* ── LA OPORTUNIDAD ── */}
      <section className="relative max-w-6xl mx-auto px-6" style={{ padding: '70px 24px 30px' }}>
        <SectionHead eyebrow={OPPORTUNITY.eyebrow} title={OPPORTUNITY.title} lang={lang} />
        <p style={{ color: C.gray, fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 680, marginTop: -16, marginBottom: 36 }}>
          {OPPORTUNITY.text[lang]}
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {OPPORTUNITY.pillars.map((p, i) => (
            <div key={i} style={cardStyle}>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 650, fontSize: '1.05rem', color: C.white, marginBottom: 10 }}>
                {p.title[lang]}
              </h3>
              <p style={{ color: C.gray, fontSize: '0.9rem', lineHeight: 1.65 }}>{p.text[lang]}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl" style={{
          marginTop: 20, padding: 28, border: `1px solid ${C.cyan}40`,
          background: `linear-gradient(135deg, ${C.cyan}12 0%, rgba(255,255,255,0.02) 100%)`,
        }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 650, fontSize: '1.2rem', color: C.white, marginBottom: 10 }}>
            {OPPORTUNITY.tis.title[lang]}
          </h3>
          <p style={{ color: C.gray, fontSize: '0.95rem', lineHeight: 1.7, maxWidth: 820 }}>{OPPORTUNITY.tis.text[lang]}</p>
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

      {/* ── ARQUITECTURA MODULAR ── */}
      <section className="max-w-6xl mx-auto px-6" style={{ padding: '30px 24px 80px' }}>
        <SectionHead eyebrow={MODULES.eyebrow} title={MODULES.title} lang={lang} />
        <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
          {MODULES.items.map((m, i) => (
            <div key={i} className="flex flex-col md:flex-row md:items-start gap-2 md:gap-6" style={{
              padding: '18px 22px', borderTop: i === 0 ? 'none' : `1px solid ${C.border}`,
              background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
            }}>
              <h3 className="md:w-[220px] shrink-0" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 650, fontSize: '1rem', color: C.white }}>
                {m.name[lang]}
              </h3>
              <p className="flex-1" style={{ color: C.gray, fontSize: '0.92rem', lineHeight: 1.65 }}>{m.what[lang]}</p>
              <span className="md:w-[130px] shrink-0 md:text-right" style={{ color: C.blue, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {m.mode[lang]}
              </span>
            </div>
          ))}
        </div>
        <p style={{ color: C.gray, fontSize: '0.88rem', lineHeight: 1.65, marginTop: 18, maxWidth: 720, opacity: 0.85 }}>{MODULES.note[lang]}</p>
      </section>

      {/* ── DESPLIEGUE FÍSICO ── */}
      <section className="max-w-6xl mx-auto px-6" style={{ padding: '0 24px 80px' }}>
        <div className="rounded-2xl" style={{
          padding: 'clamp(24px,4vw,44px)', border: `1px solid ${C.border}`,
          background: 'linear-gradient(135deg, rgba(27,61,255,0.10) 0%, rgba(255,255,255,0.02) 100%)',
        }}>
          <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
            style={{ border: `1px solid ${C.blue}60`, color: C.blue, marginBottom: 18 }}>
            {DEPLOYMENT.chip[lang]}
          </span>
          <p style={{ color: C.blue, fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 }}>
            {DEPLOYMENT.eyebrow[lang]}
          </p>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 650, letterSpacing: '-0.03em', fontSize: 'clamp(1.6rem,3vw,2.3rem)', color: C.white, marginBottom: 16 }}>
            {DEPLOYMENT.title[lang]}
          </h2>
          <p style={{ color: C.gray, fontSize: '1rem', lineHeight: 1.7, maxWidth: 720 }}>{DEPLOYMENT.text[lang]}</p>
        </div>
      </section>

      {/* ── CAPACIDADES ── */}
      <section className="max-w-6xl mx-auto px-6" style={{ padding: '0 24px 80px' }}>
        <SectionHead eyebrow={CAPABILITIES.eyebrow} title={CAPABILITIES.title} lang={lang} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.items.map((c, i) => (
            <div key={i} style={cardStyle}>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 650, fontSize: '1.05rem', color: C.white, marginBottom: 10 }}>{c.title[lang]}</h3>
              <p style={{ color: C.gray, fontSize: '0.9rem', lineHeight: 1.65 }}>{c.text[lang]}</p>
            </div>
          ))}
        </div>
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 650, fontSize: '1.15rem', color: C.white, margin: '40px 0 16px' }}>
          {CAPABILITIES.voiceTitle[lang]}
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          {CAPABILITIES.voice.map((v, i) => (
            <div key={i} style={{ ...cardStyle, borderColor: `${C.blue}30` }}>
              <h4 style={{ color: C.blue, fontSize: '0.95rem', fontWeight: 700, marginBottom: 8 }}>{v.title[lang]}</h4>
              <p style={{ color: C.gray, fontSize: '0.88rem', lineHeight: 1.65 }}>{v.text[lang]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SOLUCIONES POR MERCADO ── */}
      <section className="max-w-6xl mx-auto px-6" style={{ padding: '0 24px 80px' }}>
        <SectionHead eyebrow={MARKETS.eyebrow} title={MARKETS.title} lang={lang} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MARKETS.items.map((m, i) => (
            <div key={i} style={cardStyle}>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 650, fontSize: '1rem', color: C.white, marginBottom: 10 }}>{m.title[lang]}</h3>
              <p style={{ color: C.gray, fontSize: '0.88rem', lineHeight: 1.65 }}>{m.text[lang]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── OFERTA ── */}
      <section className="max-w-6xl mx-auto px-6" style={{ padding: '0 24px 40px' }}>
        <SectionHead eyebrow={OFFER.eyebrow} title={OFFER.title} lang={lang} />
        <div className="grid gap-4 md:grid-cols-3">
          {OFFER.tiers.map(tier => (
            <div key={tier.name} className="flex flex-col" style={{
              ...cardStyle, padding: 28, position: 'relative',
              border: `1px solid ${tier.popular ? C.blue : C.border}`,
              boxShadow: tier.popular ? '0 0 40px rgba(0,184,255,0.15)' : 'none',
            }}>
              {tier.popular && (
                <span className="absolute text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                  style={{ top: -12, left: 24, background: C.blue, color: '#05070D' }}>
                  {OFFER.popular[lang]}
                </span>
              )}
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.4rem', color: C.white, letterSpacing: '-0.02em' }}>{tier.name}</h3>
              <p style={{ color: C.blue, fontSize: '0.85rem', fontWeight: 600, marginBottom: 18 }}>{tier.tagline[lang]}</p>
              <ul className="flex flex-col gap-2.5" style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1 }}>
                {tier.items.map((it, ii) => (
                  <li key={ii} style={{ color: C.gray, fontSize: '0.9rem', lineHeight: 1.55, display: 'flex', gap: 10 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.blue, marginTop: 8, flexShrink: 0 }} />
                    <span>{it[lang]}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-5" style={{ ...cardStyle, marginTop: 20, padding: 28 }}>
          <div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 650, fontSize: '1.1rem', color: C.white, marginBottom: 6 }}>{OFFER.investment.title[lang]}</h3>
            <p style={{ color: C.gray, fontSize: '0.92rem', lineHeight: 1.65, maxWidth: 640 }}>{OFFER.investment.text[lang]}</p>
          </div>
          <button onClick={() => openContact(undefined, {
              es: 'Me gustaría solicitar una propuesta personalizada de avatar. ',
              en: 'I\'d like to request a personalised avatar proposal. ',
            })}
            className="shrink-0"
            style={{
              background: `linear-gradient(90deg, ${C.blue}, ${C.deep})`, color: C.white, border: 'none', cursor: 'pointer',
              padding: '13px 28px', borderRadius: 999, fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap',
            }}>
            {OFFER.cta[lang]}
          </button>
        </div>
        <p style={{ color: C.border, fontSize: 11, textAlign: 'center', marginTop: 36, letterSpacing: '0.04em' }}>{OFFER.credit[lang]}</p>
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
                      defaultValue={prefill ? prefill[lang] : selectedAvatar ? (lang === 'es' ? `Me interesa el avatar ${selectedAvatar} para mi evento/espacio. ` : `I'm interested in the ${selectedAvatar} avatar for my event/space. `) : ''}
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
