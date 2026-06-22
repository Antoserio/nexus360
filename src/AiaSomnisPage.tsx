import { Suspense, lazy, useEffect, useRef, useState, useCallback } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from 'framer-motion'
import { CuboFramesSection } from './components/CuboFramesSection'
import { GlowCursor, CursorParticles } from './components/GlowCursor'
import { ImageTrail } from '@/components/ui/image-trail'
import { ParticleText } from '@/components/ui/particle-text'
import { FxSlider, type SliderItem } from '@/components/ui/fx-slider'
import { Mail, MapPin, ChevronDown, Cpu, Play, Share2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// Heavy components loaded only when needed
const Spline = lazy(() => import('@splinetool/react-spline'))

// ── Brand palette ─────────────────────────────────────────────────────────────
const C = {
  bg: '#05070D', bg2: '#071120', blue: '#00B8FF', cyan: '#22D3FF',
  deep: '#1B3DFF', gold: '#FFD42A', goldSoft: '#F6B93B',
  white: '#F4F7FB', gray: '#AAB3C2', border: '#223044',
}

// ── Custom icon: scan/target ring (for Avatares IA) ──────────────────────────
const ScanRingIcon = ({ size = 22, style }: { size?: number; style?: React.CSSProperties }) => {
  const color = (style?.color as string) ?? 'currentColor'
  // outer arc: ~82% of circle, gap at top-right
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ transform: 'rotate(-55deg)' }}>
      <circle cx="12" cy="12" r="9"   stroke={color} strokeWidth="1.8" strokeDasharray="46.3 10.2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="4.5" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="12" cy="12" r="1.6" fill={color} />
    </svg>
  )
}

// ── 4 Services ────────────────────────────────────────────────────────────────
const SERVICES: {
  num: string; id: string; title: string; cardDesc: string; subtitle: string;
  desc: string; tags: string[]; accent: string; glow: string; Icon: LucideIcon
  reel: string | null   // drop any .mp4 in /public and put its path here e.g. '/reel-01.mp4'
}[] = [
  {
    num: '01', id: 'avatares', Icon: ScanRingIcon as typeof Cpu,
    title: 'Avatares IA',
    cardDesc: 'Avatares conversacionales para eventos, ferias y espacios físicos.',
    subtitle: 'para eventos, ferias y espacios físicos',
    desc: 'Creamos avatares conversacionales personalizados que pueden atender al público, presentar contenidos, responder preguntas, hablar en varios idiomas y captar leads en tiempo real.',
    tags: ['Ferias y exposiciones', 'Centros comerciales', 'Eventos corporativos', 'Presentador virtual', 'Multilingüe', 'Conectado a marca'],
    accent: '#00B8FF', glow: 'rgba(0,184,255,0.3)',
    reel: '/Avatares IA.mp4',
  },
  {
    num: '02', id: 'instalaciones', Icon: Cpu,
    title: 'Instalaciones interactivas',
    cardDesc: 'Experiencias con IA, cámaras y pantallas en tiempo real.',
    subtitle: 'con Inteligencia Artificial',
    desc: 'Diseñamos experiencias donde el público interactúa con cámaras, pantallas, sensores y sistemas generativos, creando contenido visual en tiempo real.',
    tags: ['Cámara + IA', 'Visuales reactivos', 'Photocalls inteligentes', 'Tótems interactivos', 'Holográfico', '360° inmersivo'],
    accent: '#22D3FF', glow: 'rgba(34,211,255,0.28)',
    reel: null,
  },
  {
    num: '03', id: 'visuales', Icon: Play,
    title: 'Producción audiovisual con IA',
    cardDesc: 'Contenido publicitario, visuales generativos y videomapping.',
    subtitle: 'y producción audiovisual con IA',
    desc: 'Creamos imágenes, animaciones y mundos visuales con IA, combinando dirección artística, 3D, motion graphics y producción audiovisual profesional.',
    tags: ['Campañas publicitarias', 'Pantallas LED', 'Videomapping IA', 'Animaciones generativas', 'Conciertos y espectáculos'],
    accent: '#FFD42A', glow: 'rgba(255,212,42,0.22)',
    reel: '/Produccion Audiovisual_1.mp4',
  },
  {
    num: '04', id: 'digital', Icon: Share2,
    title: 'Soluciones digitales con IA',
    cardDesc: 'Webs, automatizaciones y agentes inteligentes para empresas.',
    subtitle: 'y automatizaciones',
    desc: 'Creamos soluciones digitales con IA para automatizar procesos, captar leads, mejorar la atención al cliente y crear experiencias web más inteligentes.',
    tags: ['Webs con IA', 'Asistentes virtuales', 'Automatización de procesos', 'CRM integration', 'Experiencias 3D web'],
    accent: '#F6B93B', glow: 'rgba(246,185,59,0.22)',
    reel: '/Soluciones Digitales.mp4',
  },
]

const TEAM = [
  { name: 'Paco Gramaje',      role: 'Business Developer', initials: 'PG', photo: '/team/paco.jpg',   imgStyle: { objectPosition: 'center 12%' } },
  { name: 'Leonardo Bautista', role: 'Director Creativo', initials: 'LB', photo: '/team/LEO.png',    imgStyle: { objectPosition: 'center 10%' } },
  { name: 'Anto Loriso',       role: 'CTO',               initials: 'AL', photo: '/team/anto.jpg',   imgStyle: { objectPosition: 'center 20%' } },
  { name: 'Martin Julià',      role: '3D & IA Developer', initials: 'MJ', photo: '/team/MARTIN.png', imgStyle: { objectPosition: 'center 10%' } },
]


// Trail images — logo descompuesto en 6 letras (mismo set para todos los servicios)
const LETRA_IMAGES = [
  '/letras/Letra01.png',
  '/letras/Letra02.png',
  '/letras/Letra03.png',
  '/letras/Letra04.png',
  '/letras/Letra05.png',
  '/letras/Letra06.png',
]
const TRAIL_IMAGES: string[][] = [
  LETRA_IMAGES,
  LETRA_IMAGES,
  LETRA_IMAGES,
  LETRA_IMAGES,
]

// Projects for FxSlider — real Pexels backgrounds
const PROJECTS: SliderItem[] = [
  {
    num: '01', year: '2024', accent: '#00B8FF',
    title: 'Avatar Viky · Girasomnis', category: 'Avatares IA',
    // Futuristic AI robot face
    bg: `url('https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop') center/cover no-repeat`,
  },
  {
    num: '02', year: '2024', accent: '#22D3FF',
    title: 'Canet Rock IA', category: 'Visuales Generativos',
    // Concert stage with dramatic lights
    bg: `url('https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop') center/cover no-repeat`,
  },
  {
    num: '03', year: '2024', accent: '#FFD42A',
    title: 'Quiniela Planeta', category: 'Instalación Interactiva',
    // Neon / immersive light installation
    bg: `url('https://images.pexels.com/photos/2387418/pexels-photo-2387418.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop') center/cover no-repeat`,
  },
  {
    num: '04', year: '2024', accent: '#F6B93B',
    title: 'FLUGE — Avatar Demo', category: 'Avatar Interactivo',
    // Holographic / digital human
    bg: `url('https://images.pexels.com/photos/3862021/pexels-photo-3862021.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop') center/cover no-repeat`,
  },
  {
    num: '05', year: '2023', accent: '#1B3DFF',
    title: 'Interactivos Táctiles', category: 'Instalación Interactiva',
    // Dramatic light art / projection mapping
    bg: `url('https://images.pexels.com/photos/3756165/pexels-photo-3756165.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop') center/cover no-repeat`,
  },
]


// ── Interactive Dot Grid ──────────────────────────────────────────────────────
function useInteractiveDotGrid() {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const mouseRef   = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const section = sectionRef.current; if (!section) return
    const ctx = canvas.getContext('2d'); if (!ctx) return

    const GAP    = 28   // grid spacing
    const BASE_R = 1.8  // resting dot radius
    const RADIUS = 120  // influence radius
    const PUSH   = 28   // max displacement

    type Dot = { ox: number; oy: number; x: number; y: number }
    let dots: Dot[] = []
    let raf: number

    const build = () => {
      canvas.width  = section.offsetWidth
      canvas.height = section.offsetHeight
      dots = []
      for (let x = GAP; x < canvas.width;  x += GAP)
        for (let y = GAP; y < canvas.height; y += GAP)
          dots.push({ ox: x, oy: y, x, y })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const { x: mx, y: my } = mouseRef.current

      for (const d of dots) {
        const dx = d.x - mx, dy = d.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < RADIUS && dist > 0) {
          const f   = (1 - dist / RADIUS) * PUSH
          const ang = Math.atan2(dy, dx)
          d.x += (d.ox + Math.cos(ang) * f - d.x) * 0.22
          d.y += (d.oy + Math.sin(ang) * f - d.y) * 0.22
        } else {
          d.x += (d.ox - d.x) * 0.1
          d.y += (d.oy - d.y) * 0.1
        }

        const disp = Math.sqrt((d.x - d.ox) ** 2 + (d.y - d.oy) ** 2) / PUSH
        const r    = BASE_R + disp * 3.5

        if (disp > 0.05) {
          // glow halo around active dots
          const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, r * 4)
          g.addColorStop(0, `rgba(0,184,255,${(disp * 0.35).toFixed(2)})`)
          g.addColorStop(1, 'rgba(0,184,255,0)')
          ctx.beginPath(); ctx.arc(d.x, d.y, r * 4, 0, Math.PI * 2)
          ctx.fillStyle = g; ctx.fill()
          // bright core
          ctx.beginPath(); ctx.arc(d.x, d.y, r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(0,184,255,${Math.min(0.95, 0.5 + disp * 0.8).toFixed(2)})`
          ctx.fill()
        } else {
          // resting dot — clearly visible white-ish
          ctx.beginPath(); ctx.arc(d.x, d.y, BASE_R, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(255,255,255,0.22)'
          ctx.fill()
        }
      }

      raf = requestAnimationFrame(draw)
    }

    const getPos = (clientX: number, clientY: number) => {
      const r = section.getBoundingClientRect()
      mouseRef.current = { x: clientX - r.left, y: clientY - r.top }
    }
    const onMove   = (e: MouseEvent)  => getPos(e.clientX, e.clientY)
    const onLeave  = ()               => { mouseRef.current = { x: -9999, y: -9999 } }
    const onTouch  = (e: TouchEvent)  => { const t = e.touches[0]; if (t) getPos(t.clientX, t.clientY) }
    const onTouchEnd = ()             => { mouseRef.current = { x: -9999, y: -9999 } }

    const ro = new ResizeObserver(build)
    ro.observe(section); build(); draw()
    section.addEventListener('mousemove',  onMove)
    section.addEventListener('mouseleave', onLeave)
    section.addEventListener('touchmove',  onTouch,   { passive: true })
    section.addEventListener('touchend',   onTouchEnd)
    return () => {
      cancelAnimationFrame(raf); ro.disconnect()
      section.removeEventListener('mousemove',  onMove)
      section.removeEventListener('mouseleave', onLeave)
      section.removeEventListener('touchmove',  onTouch)
      section.removeEventListener('touchend',   onTouchEnd)
    }
  }, [])

  return { canvasRef, sectionRef }
}

// ── HUD service card (hero corners) ───────────────────────────────────────────
// corner: 0=top-left  1=top-right  2=bottom-left  3=bottom-right
const CORNER_STYLES: React.CSSProperties[] = [
  { top: '8%',     left: '1.5%' },
  { top: '8%',     right: '1.5%' },
  { bottom: '11%', left: '1.5%' },
  { bottom: '11%', right: '1.5%' },
]

// L-shaped bracket descriptor for each corner
const BRACKET_DEFS: Array<{
  top?: 0; bottom?: 0; left?: 0; right?: 0;
  borderTop: boolean; borderLeft: boolean; borderBottom: boolean; borderRight: boolean;
}> = [
  { top: 0,    left: 0,    borderTop: true,    borderLeft: true,    borderBottom: false, borderRight: false },
  { top: 0,    right: 0,   borderTop: true,    borderLeft: false,   borderBottom: false, borderRight: true  },
  { bottom: 0, left: 0,    borderTop: false,   borderLeft: true,    borderBottom: true,  borderRight: false },
  { bottom: 0, right: 0,   borderTop: false,   borderLeft: false,   borderBottom: true,  borderRight: true  },
]

// Rounded corner for each bracket (outer corner only)
const BRACKET_RADIUS = [
  { borderTopLeftRadius: 7 },
  { borderTopRightRadius: 7 },
  { borderBottomLeftRadius: 7 },
  { borderBottomRightRadius: 7 },
] as const

function HudCard({
  s, delay, corner, active, visible, onClick,
}: {
  s: typeof SERVICES[0]
  delay: number
  corner: 0 | 1 | 2 | 3
  active: boolean
  visible: boolean
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const lit = active || hovered
  const isRight = corner === 1 || corner === 3
  const { Icon } = s
  const BLEN = 19
  const R = 14 // card border radius

  return (
    <motion.div
      className="absolute z-20 hidden lg:block"
      style={{ ...CORNER_STYLES[corner], cursor: 'pointer' }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 14 }}
      transition={{ duration: 0.7, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}>

      <motion.div
        animate={{
          boxShadow: active
            ? `0 8px 60px ${s.glow}, 0 0 40px ${s.accent}40, inset 0 0 40px ${s.accent}10`
            : hovered
            ? `0 6px 40px ${s.glow}, 0 0 26px ${s.accent}30`
            : `0 4px 28px rgba(0,0,0,0.7), 0 0 20px ${s.accent}18`,
          borderColor: active ? `${s.accent}35` : hovered ? `${s.accent}25` : `${s.accent}15`,
        }}
        transition={{ duration: 0.32 }}
        className="relative"
        style={{
          background: active ? 'rgba(3,7,18,0.97)' : 'rgba(3,7,18,0.88)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: `1px solid ${s.accent}15`,
          width: 'clamp(200px, 24vw, 295px)',
          padding: 'clamp(16px, 2vw, 26px)',
          borderRadius: R,
        }}>

        {/* ── Corner bloom spots (inner radial glow at each corner) ── */}
        {[
          { top: 0,    left: 0,  bg: `radial-gradient(circle at 0% 0%,   ${s.accent}22 0%, transparent 65%)` },
          { top: 0,    right: 0, bg: `radial-gradient(circle at 100% 0%,  ${s.accent}22 0%, transparent 65%)` },
          { bottom: 0, left: 0,  bg: `radial-gradient(circle at 0% 100%,  ${s.accent}22 0%, transparent 65%)` },
          { bottom: 0, right: 0, bg: `radial-gradient(circle at 100% 100%,${s.accent}22 0%, transparent 65%)` },
        ].map((c, i) => (
          <motion.div key={`bloom-${i}`} className="absolute pointer-events-none"
            style={{ ...c, width: 70, height: 70, background: c.bg }}
            animate={{ opacity: active ? 1 : hovered ? 0.65 : 0.3 }}
            transition={{ duration: 0.32 }} />
        ))}

        {/* ── Corner bracket accents ── */}
        {BRACKET_DEFS.map((b, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            style={{
              ...(b.top    !== undefined ? { top:    b.top    } : {}),
              ...(b.bottom !== undefined ? { bottom: b.bottom } : {}),
              ...(b.left   !== undefined ? { left:   b.left   } : {}),
              ...(b.right  !== undefined ? { right:  b.right  } : {}),
              width: BLEN, height: BLEN,
              borderTop:    b.borderTop    ? `1.5px solid ${s.accent}` : 'none',
              borderLeft:   b.borderLeft   ? `1.5px solid ${s.accent}` : 'none',
              borderBottom: b.borderBottom ? `1.5px solid ${s.accent}` : 'none',
              borderRight:  b.borderRight  ? `1.5px solid ${s.accent}` : 'none',
              ...BRACKET_RADIUS[i],
            }}
            animate={{
              opacity: active ? 1 : hovered ? 0.92 : 0.72,
              filter: active
                ? `drop-shadow(0 0 6px ${s.accent}) drop-shadow(0 0 14px ${s.accent}90)`
                : hovered
                ? `drop-shadow(0 0 5px ${s.accent}) drop-shadow(0 0 8px ${s.accent}70)`
                : `drop-shadow(0 0 4px ${s.accent}CC)`,
            }}
            transition={{ duration: 0.32 }}
          />
        ))}

        {/* Top glow line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          animate={{ opacity: active ? 0.75 : hovered ? 0.45 : 0.18 }}
          transition={{ duration: 0.32 }}
          style={{
            background: `linear-gradient(90deg, transparent 5%, ${s.accent} 50%, transparent 95%)`,
            borderTopLeftRadius: R, borderTopRightRadius: R,
          }}
        />

        {/* Corner bg tint */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `linear-gradient(135deg, ${s.accent}0E 0%, transparent 50%)`, borderRadius: R }} />

        {/* ── Icon + title ── */}
        <div className={`flex items-start gap-3 mb-3 ${isRight ? 'flex-row-reverse' : ''}`}>
          <motion.div
            className="flex-shrink-0 flex items-center justify-center"
            animate={{
              background: lit ? `${s.accent}30` : `${s.accent}14`,
              boxShadow: active
                ? `0 0 28px ${s.glow}, 0 0 12px ${s.accent}70`
                : hovered
                ? `0 0 18px ${s.glow}`
                : `0 0 8px ${s.accent}40`,
            }}
            transition={{ duration: 0.32 }}
            style={{
              width: 'clamp(44px, 3.8vw, 58px)',
              height: 'clamp(44px, 3.8vw, 58px)',
              border: `1.5px solid ${s.accent}70`,
              borderRadius: 12,
            }}>
            <Icon size={24} style={{ color: s.accent }} />
          </motion.div>

          <div className={`flex-1 pt-1 ${isRight ? 'text-right' : ''}`}>
            <motion.h3
              animate={{ color: lit ? C.white : '#D0E4F4' }}
              transition={{ duration: 0.28 }}
              className="font-black leading-snug"
              style={{ fontSize: 'clamp(16px, 1.6vw, 22px)' }}>
              {s.title}
            </motion.h3>
          </div>
        </div>

        {/* Description */}
        <p className={`leading-relaxed ${isRight ? 'text-right' : ''}`}
          style={{ fontSize: 'clamp(12px, 1vw, 14px)', color: '#8AABB8', lineHeight: 1.65 }}>
          {s.cardDesc}
        </p>

        {/* Bottom glow line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
          animate={{ opacity: active ? 0.55 : hovered ? 0.3 : 0.08 }}
          transition={{ duration: 0.32 }}
          style={{
            background: `linear-gradient(90deg, transparent 8%, ${s.accent} 50%, transparent 92%)`,
            borderBottomLeftRadius: R, borderBottomRightRadius: R,
          }}
        />
      </motion.div>
    </motion.div>
  )
}

// ── Typewriter Tags ───────────────────────────────────────────────────────────
function TypewriterTags({ tags, accent }: { tags: string[]; accent: string }) {
  const ref      = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)
  const [doneIdx, setDoneIdx] = useState(-1)   // last fully-typed tag index
  const [charLen, setCharLen] = useState(0)    // chars shown on in-progress tag

  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStarted(true) },
      { threshold: 0.25 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    const typingIdx = doneIdx + 1
    if (typingIdx >= tags.length) return
    if (charLen < tags[typingIdx].length) {
      const t = setTimeout(() => setCharLen(n => n + 1), 36)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => { setDoneIdx(typingIdx); setCharLen(0) }, 100)
      return () => clearTimeout(t)
    }
  }, [started, doneIdx, charLen, tags])

  const typingIdx = doneIdx + 1

  return (
    <div ref={ref} className="flex flex-col gap-1">
      {tags.map((tag, i) => {
        const isDone   = i <= doneIdx
        const isTyping = started && i === typingIdx
        const isHidden = !isDone && !isTyping
        return (
          <span key={tag} className="text-sm" style={{ color: isHidden ? 'transparent' : C.gray }}>
            {'· '}
            {isDone || isHidden ? tag : (
              <>
                {tag.slice(0, charLen)}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.45, repeat: Infinity, repeatType: 'reverse' }}
                  style={{ display: 'inline-block', width: 2, height: '0.72em', background: accent, marginLeft: 1, verticalAlign: 'middle', borderRadius: 1 }}
                />
              </>
            )}
          </span>
        )
      })}
    </div>
  )
}

// ── Social icons ──────────────────────────────────────────────────────────────
const IconLinkedin = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
  </svg>
)
const IconYoutube = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#05070D"/>
  </svg>
)
const IconInstagram = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)

// ── Unfocused scroll image ────────────────────────────────────────────────────
function UnfocusedImage({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const blur  = useTransform(scrollYProgress, [0, 0.7], [28, 0])
  const scale = useTransform(scrollYProgress, [0, 0.7], [1.12, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.25], [0, 1])
  const blurFilter = useTransform(blur, v => `blur(${v}px)`)

  return (
    <div ref={ref} className="w-full overflow-hidden" style={{ borderRadius: 16, height: 'clamp(420px,65vh,700px)' }}>
      <motion.img
        src={src}
        alt=""
        className="w-full h-full object-cover"
        style={{ filter: blurFilter, scale, opacity }}
      />
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
// corner→service index mapping: top-left=0, top-right=1, bottom-left=2, bottom-right=3
const CORNER_SERVICE = [0, 1, 2, 3] as const

// ── Ticker items ──────────────────────────────────────────────────────────────
const TICKER_ITEMS = ['AI PARA EVENTOS', 'MARCAS Y CULTURA', 'AI FOR EVENTS', 'BRANDS AND CULTURE', 'CREATIVIDAD + IA', 'EXPERIENCIAS INMERSIVAS']

// ── Loading Screen ────────────────────────────────────────────────────────────
function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    let p = 0
    const start = Date.now()
    const MIN_MS = 2800
    const interval = setInterval(() => {
      p += Math.random() * 3 + 0.8
      if (p >= 100) {
        p = 100
        clearInterval(interval)
        const elapsed = Date.now() - start
        const wait = Math.max(0, MIN_MS - elapsed)
        setTimeout(() => { setLeaving(true); setTimeout(onDone, 700) }, wait)
      }
      setPct(Math.floor(p))
    }, 50)
    return () => clearInterval(interval)
  }, [onDone])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: 0.7 }}
      style={{ position: 'fixed', inset: 0, background: C.bg, zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
    >
      {/* Ticker background */}
      <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, transform: 'translateY(-50%)', overflow: 'hidden', pointerEvents: 'none' }}>
        {[-1, 0, 1].map(row => (
          <motion.div key={row}
            animate={{ x: row % 2 === 0 ? ['0%', '-50%'] : ['-50%', '0%'] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            style={{ display: 'flex', gap: 64, whiteSpace: 'nowrap', padding: '12px 0', opacity: 0.06 + Math.abs(row) * 0.03 }}>
            {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} style={{ fontSize: 'clamp(2rem,5vw,4rem)', fontWeight: 900, color: C.white, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                {item} <span style={{ color: C.blue }}>·</span>
              </span>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Logo */}
      <motion.img src="/MAIGIA-LOGO-V1.png" alt="AIA SOMNIS"
        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        style={{ height: 60, marginBottom: 48, position: 'relative', zIndex: 1 }} />

      {/* Counter */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <motion.div
          key={pct}
          initial={{ opacity: 0.6, y: 4 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 'clamp(4rem,12vw,9rem)', fontWeight: 900, color: C.white, lineHeight: 1, letterSpacing: '-0.04em' }}>
          {String(pct).padStart(2, '0')}
          <span style={{ fontSize: '0.35em', color: C.blue }}>%</span>
        </motion.div>
        <div style={{ width: 200, height: 1, background: C.border, borderRadius: 1, margin: '16px auto 0', overflow: 'hidden' }}>
          <motion.div style={{ height: '100%', background: C.blue, width: `${pct}%`, transition: 'width 0.05s linear' }} />
        </div>
      </div>
    </motion.div>
  )
}

// ── Tilt 3D + Scan Line card ─────────────────────────────────────────────────
function TiltScanCard({
  s, index, opacity, x,
}: {
  s: typeof SERVICES[0]
  index: number
  opacity: MotionValue<number>
  x: MotionValue<string>
}) {
  const cardRef  = useRef<HTMLDivElement>(null)
  const [tilt,   setTilt]   = useState({ rx: 0, ry: 0 })
  const [shine,  setShine]  = useState({ x: 50, y: 50 })
  const [active, setActive] = useState(false)
  const { Icon } = s

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current; if (!el) return
    const r  = el.getBoundingClientRect()
    const dx = ((e.clientX - r.left) / r.width  - 0.5) * 2   // -1→1
    const dy = ((e.clientY - r.top)  / r.height - 0.5) * 2
    setTilt({ rx: -dy * 14, ry: dx * 14 })
    setShine({ x: ((e.clientX - r.left) / r.width)  * 100,
               y: ((e.clientY - r.top)  / r.height) * 100 })
  }
  const onLeave = () => { setTilt({ rx: 0, ry: 0 }); setActive(false) }
  const onEnter = () => setActive(true)

  return (
    <motion.div style={{ opacity, x, perspective: 700 }}>
      <div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 16,
          cursor: 'pointer',
          transform: `perspective(700px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${active ? 1.04 : 1})`,
          transition: active ? 'transform 0.08s ease' : 'transform 0.5s ease',
          display: 'flex', alignItems: 'center', gap: 18,
          padding: '16px 28px',
          background: `linear-gradient(135deg, rgba(5,7,13,0.97) 0%, ${s.accent}12 100%)`,
          border: `1px solid ${active ? s.accent : `${s.accent}80`}`,
          backdropFilter: 'blur(20px)',
          boxShadow: active
            ? `0 0 60px ${s.accent}70, 0 0 120px ${s.accent}28, 0 12px 40px rgba(0,0,0,0.7), inset 0 0 40px ${s.accent}18`
            : `0 0 40px ${s.accent}35, 0 0 80px ${s.accent}15, 0 8px 32px rgba(0,0,0,0.6), inset 0 0 28px ${s.accent}10`,
        }}
      >
        {/* ── Scan line ── */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 10 }}>
          <div
            className="scanline-anim"
            style={{
              position: 'absolute', left: 0, right: 0, height: 3,
              background: `linear-gradient(90deg, transparent 0%, ${s.accent}90 40%, ${s.accent} 50%, ${s.accent}90 60%, transparent 100%)`,
              boxShadow: `0 0 10px ${s.accent}, 0 0 20px ${s.accent}80`,
              animationDelay: `${index * 0.65}s`,
            }}
          />
        </div>

        {/* ── Shine on hover ── */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 16,
          background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, ${s.accent}22 0%, transparent 55%)`,
          opacity: active ? 1 : 0,
          transition: 'opacity 0.2s',
          zIndex: 5,
        }} />

        {/* ── Icon ── */}
        <div style={{
          width: 50, height: 50, borderRadius: 12, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `${s.accent}22`,
          border: `1.5px solid ${s.accent}`,
          boxShadow: `0 0 22px ${s.accent}60, 0 0 44px ${s.accent}20`,
          position: 'relative', zIndex: 6,
        }}>
          <Icon size={24} style={{ color: s.accent, filter: `drop-shadow(0 0 8px ${s.accent})` }} />
        </div>

        {/* ── Title ── */}
        <span style={{
          color: '#fff', fontSize: 18, fontWeight: 800, whiteSpace: 'nowrap',
          textShadow: `0 0 24px ${s.accent}60, 0 2px 8px rgba(0,0,0,0.9)`,
          position: 'relative', zIndex: 6,
        }}>
          {s.title}
        </span>
      </div>
    </motion.div>
  )
}

// ── Sticky Robot Section (desktop hero) ───────────────────────────────────────
function StickyRobotSection({ ready }: { ready: boolean }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: p } = useScroll({ target: wrapperRef, offset: ['start start', 'end end'] })
  const [logoVisible, setLogoVisible] = useState(false)

  // Logo aparece cuando ready=true, desaparece cuando las cards empiezan a llegar
  useEffect(() => { if (ready) setLogoVisible(true) }, [ready])
  useMotionValueEvent(p, 'change', v => {
    if (v > 0.14) setLogoVisible(false)
    else if (ready) setLogoVisible(true)
  })

  // Animations complete by p≈0.32 (288vh of 900vh total)
  const robotX      = useTransform(p, [0.06, 0.26],  ['0vw', '-28vw'])
  const robotScale  = useTransform(p, [0, 0.15],     [1, 1.1])
  const textOpacity = useTransform(p, [0.04, 0.14],  [0, 1])
  const textX       = useTransform(p, [0.04, 0.14],  ['-40px', '0px'])

  const cardOpacity0 = useTransform(p, [0.18, 0.22], [0, 1])
  const cardX0       = useTransform(p, [0.18, 0.22], ['50px', '0px'])
  const cardOpacity1 = useTransform(p, [0.22, 0.26], [0, 1])
  const cardX1       = useTransform(p, [0.22, 0.26], ['50px', '0px'])
  const cardOpacity2 = useTransform(p, [0.26, 0.29], [0, 1])
  const cardX2       = useTransform(p, [0.26, 0.29], ['50px', '0px'])
  const cardOpacity3 = useTransform(p, [0.29, 0.32], [0, 1])
  const cardX3       = useTransform(p, [0.29, 0.32], ['50px', '0px'])

  const cardOpacities = [cardOpacity0, cardOpacity1, cardOpacity2, cardOpacity3]
  const cardXs        = [cardX0, cardX1, cardX2, cardX3]

  return (
    <div ref={wrapperRef} style={{ height: '900vh', position: 'relative', background: C.bg }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'clip' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 60% 70% at 50% 60%, rgba(0,184,255,0.10) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Spline robot — center, translates left on scroll */}
        <motion.div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          x: robotX,
          scale: robotScale,
          translateX: '-50%',
          translateY: '-50%',
          width: 'clamp(320px, 55vw, 700px)',
          height: 'clamp(320px, 55vw, 700px)',
          zIndex: 1,
        }}>
          <Suspense fallback={
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="w-12 h-12 rounded-full border-2 border-transparent animate-spin"
                style={{ borderTopColor: C.blue, borderRightColor: `${C.blue}30` }} />
            </div>
          }>
            <Spline
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              style={{ width: '100%', height: '100%' }}
            />
          </Suspense>
        </motion.div>

        {/* Logo MAIGIA + tagline — aparece al cargar, se desvanece antes de que lleguen las cards */}
        <div style={{
          position: 'absolute',
          left: '58%',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 18,
          pointerEvents: 'none',
          opacity: logoVisible ? 1 : 0,
          transition: logoVisible ? 'opacity 0.9s ease 0.2s' : 'opacity 0.35s ease',
        }}>
          <img
            src="/MAIGIA-LOGO-V1.png"
            alt="MAIGIA"
            style={{ height: 'clamp(90px, 13vw, 180px)', width: 'auto', objectFit: 'contain',
              filter: 'drop-shadow(0 0 40px rgba(0,184,255,0.75)) drop-shadow(0 0 20px rgba(0,184,255,0.4))' }}
          />
          <p style={{
            color: C.blue,
            fontSize: 'clamp(0.56rem, 0.75vw, 0.72rem)',
            fontWeight: 600,
            fontFamily: "'Orbitron', monospace",
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            textAlign: 'center',
            lineHeight: 1.7,
            textShadow: `0 0 20px rgba(0,184,255,0.7), 0 0 40px rgba(0,184,255,0.3)`,
            margin: 0,
          }}>
            AI Agency for<br />Extraordinary Experiences
          </p>
        </div>

        {/* Left — ¿Qué hacemos? */}
        <motion.div style={{
          position: 'absolute',
          left: '5vw',
          top: '50%',
          translateY: '-50%',
          opacity: textOpacity,
          x: textX,
          zIndex: 2,
        }}>
          <h2 style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 900, color: C.white, lineHeight: 1.05, margin: 0 }}>
            <span style={{ display: 'block' }}>¿Qué</span>
            <span style={{ display: 'block' }}>hacemos?</span>
          </h2>
          <p style={{ color: C.blue, letterSpacing: '0.18em', fontSize: '0.9rem', marginTop: 16, textTransform: 'uppercase' }}>
            Creatividad · Tecnología · IA
          </p>
        </motion.div>

        {/* Right — 4 service cards (máximo protagonismo) */}
        <div style={{
          position: 'absolute',
          right: '5vw',
          top: '50%',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          zIndex: 4,
          transform: 'translateY(-50%)',
        }}>
          {SERVICES.map((s, i) => (
            <TiltScanCard key={s.id} s={s} index={i} opacity={cardOpacities[i]} x={cardXs[i]} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Lazy video — solo carga cuando entra en viewport ────────────────────────
function LazyVideo({ src, className, style }: { src: string; className?: string; style?: React.CSSProperties }) {
  const ref  = useRef<HTMLVideoElement>(null)
  const [canPlay, setCanPlay] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setCanPlay(true); obs.disconnect() }
    }, { rootMargin: '200px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <video
      ref={ref}
      src={canPlay ? src : undefined}
      autoPlay muted loop playsInline
      preload="none"
      className={className}
      style={style}
    />
  )
}

// ── About tilt card — mismo efecto 3D que las tarjetas de hero ───────────────
function AboutTiltCard({ children, accent, delay = 0, compact = false }: {
  children: React.ReactNode; accent: string; delay?: number; compact?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt,  setTilt]  = useState({ rx: 0, ry: 0 })
  const [shine, setShine] = useState({ x: 50, y: 50 })
  const [active, setActive] = useState(false)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return
    const r  = el.getBoundingClientRect()
    const dx = ((e.clientX - r.left) / r.width  - 0.5) * 2
    const dy = ((e.clientY - r.top)  / r.height - 0.5) * 2
    setTilt({ rx: -dy * 12, ry: dx * 12 })
    setShine({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.6, delay }}
      style={{ flex: compact ? undefined : 1 }}
    >
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => { setTilt({ rx: 0, ry: 0 }); setActive(false) }}
        style={{
          position: 'relative', overflow: 'hidden',
          borderRadius: compact ? 14 : 18,
          padding: compact ? '16px 8px' : '24px',
          textAlign: 'center',
          background: `linear-gradient(135deg, rgba(7,17,32,0.92) 0%, ${accent}0D 100%)`,
          border: `1px solid ${active ? `${accent}80` : `${accent}30`}`,
          backdropFilter: 'blur(12px)',
          boxShadow: active
            ? `0 0 40px ${accent}35, 0 0 80px ${accent}12, inset 0 0 24px ${accent}10`
            : `0 0 20px ${accent}15, inset 0 0 12px ${accent}06`,
          transform: `perspective(600px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${active ? 1.04 : 1})`,
          transition: active ? 'transform 0.08s ease, border-color 0.2s, box-shadow 0.2s' : 'transform 0.5s ease, border-color 0.3s, box-shadow 0.3s',
        }}
      >
        {/* Scan line */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
          <div className="scanline-anim" style={{
            position: 'absolute', left: 0, right: 0, height: 2,
            background: `linear-gradient(90deg, transparent, ${accent}80, transparent)`,
            boxShadow: `0 0 8px ${accent}`,
            animationDuration: '3s',
            animationDelay: `${delay}s`,
          }} />
        </div>
        {/* Shine */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none',
          background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, ${accent}18 0%, transparent 60%)`,
          opacity: active ? 1 : 0, transition: 'opacity 0.2s', zIndex: 0,
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
      </div>
    </motion.div>
  )
}

// ── About Section (self-contained so it can use the hook) ─────────────────────
function AboutSection() {
  const { canvasRef, sectionRef } = useInteractiveDotGrid()
  return (
    <section ref={sectionRef} className="relative py-32 px-6 overflow-hidden" style={{ background: C.bg }}>
      {/* Dot grid — behind content */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} aria-hidden />

      <div className="relative max-w-6xl mx-auto" style={{ zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] mb-6 block" style={{ color: C.blue }}>Sobre nosotros</span>
            <h2 className="font-black leading-tight mb-8" style={{ fontSize: 'clamp(2rem,4.5vw,3.5rem)', color: C.white }}>
              Más de 20 años<br /><span style={{ color: C.gold }}>evolucionando</span>
            </h2>
            <div className="space-y-5 text-base leading-relaxed" style={{ color: C.gray }}>
              <p>Esta nueva línea nace como una evolución natural de{' '}<span style={{ color: C.white, fontWeight: 600 }}>Girasomnis</span>, un estudio creativo con más de 20 años de experiencia en espectáculos audiovisuales, experiencias inmersivas, video mapping, contenido escénico e innovación visual.</p>
              <p>Ahora aplicamos la inteligencia artificial a ese mismo universo creativo para desarrollar <span style={{ color: C.cyan }}>avatares interactivos</span>, <span style={{ color: C.cyan }}>instalaciones inteligentes</span>, producción audiovisual con IA y soluciones digitales para empresas.</p>
              <p>Esta división surge de la unión entre Girasomnis e{' '}<span style={{ color: C.white, fontWeight: 600 }}>Immerso</span>, especializada en desarrollo de software, aplicaciones web, soluciones IA y avatares 3D en tiempo real.</p>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex gap-6">
              {([
                { brand: 'Girasomnis', sub: 'Arte & Creatividad', accent: C.blue,  grad: `${C.blue}, ${C.deep}` },
                { brand: 'Immerso',    sub: 'Tech & Software',    accent: C.gold,  grad: `${C.gold}, ${C.goldSoft}` },
              ] as const).map(({ brand, sub, accent, grad }, i) => (
                <AboutTiltCard key={brand} accent={accent} delay={i * 0.1}>
                  <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${grad})` }}>
                    <span className="font-black text-white text-sm">{brand[0]}</span>
                  </div>
                  <span className="font-bold text-sm block" style={{ color: C.white }}>{brand}</span>
                  <span className="text-xs mt-1 block" style={{ color: C.gray }}>{sub}</span>
                </AboutTiltCard>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {([
                { n: '20+', l: 'años de experiencia', accent: C.blue },
                { n: '4',   l: 'líneas de servicio',  accent: C.cyan },
                { n: '3',   l: 'oficinas',             accent: C.gold },
              ] as const).map(({ n, l, accent }, i) => (
                <AboutTiltCard key={l} accent={accent} delay={i * 0.08} compact>
                  <div className="font-black text-2xl mb-1" style={{ color: accent }}>{n}</div>
                  <div className="text-xs" style={{ color: C.gray }}>{l}</div>
                </AboutTiltCard>
              ))}
            </div>
            <div className="flex gap-4 justify-center">
              {[
                { Icon: IconLinkedin,  url: 'https://www.linkedin.com/company/girasomnis/' },
                { Icon: IconYoutube,   url: 'https://www.youtube.com/@PacoGramajegirasomnis' },
                { Icon: IconInstagram, url: 'https://www.instagram.com/aiasomnis' },
              ].map(({ Icon, url }, i) => (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, color: C.gray }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = C.blue; (e.currentTarget as HTMLAnchorElement).style.color = C.blue }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = C.border; (e.currentTarget as HTMLAnchorElement).style.color = C.gray }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default function AiaSomnisPage() {
  const [loading, setLoading] = useState(true)
  const [heroVisible, setHeroVisible] = useState(false)
  const [activeService, setActiveService] = useState(0)
  const [scrolledPastHero, setScrolledPastHero] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [formSent, setFormSent] = useState(false)
  const [splineInView, setSplineInView] = useState(false)
  const [splineReady, setSplineReady] = useState(false)
  const [heroQuadrant, setHeroQuadrant] = useState<0|1|2|3|null>(null)
  const [soundOn, setSoundOn] = useState(false)
  const [logoEntranceDone, setLogoEntranceDone] = useState(false)
  const [trackIdx, setTrackIdx] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])
  const heroRef = useRef<HTMLElement>(null)

  const TRACKS = [
    '/magnific-hand-covers-bruise.mp3',
    '/magnific-in-motion.mp3',
    '/magnific-you-were-right.mp3',
  ]

  const toggleSound = useCallback(() => {
    if (!audioRef.current) return
    if (soundOn) {
      audioRef.current.pause()
      setSoundOn(false)
    } else {
      audioRef.current.volume = 0.55
      audioRef.current.play().catch(() => {})
      setSoundOn(true)
    }
  }, [soundOn])

  // Avanza al siguiente track al terminar
  const handleTrackEnd = useCallback(() => {
    setTrackIdx(i => (i + 1) % TRACKS.length)
  }, [TRACKS.length])

  // Cuando cambia el track y el sonido está activo, reproduce el nuevo
  useEffect(() => {
    const audio = audioRef.current; if (!audio || !soundOn) return
    audio.src = TRACKS[trackIdx]
    audio.volume = 0.55
    audio.play().catch(() => {})
  }, [trackIdx]) // eslint-disable-line

  useEffect(() => {
    if (loading) return
    const t = setTimeout(() => setHeroVisible(true), 200)
    return () => clearTimeout(t)
  }, [loading])

  useEffect(() => {
    if (loading) { document.body.style.overflow = 'hidden' }
    else { document.body.style.overflow = '' }
    return () => { document.body.style.overflow = '' }
  }, [loading])

  useEffect(() => {
    const onScroll = () => setScrolledPastHero(window.scrollY > window.innerHeight * 0.6)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setSplineInView(true) }, { threshold: 0.05 })
    if (heroRef.current) obs.observe(heroRef.current)
    const t = setTimeout(() => setSplineReady(true), 800)
    return () => { clearTimeout(t); obs.disconnect() }
  }, [])

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    sectionRefs.current.forEach((el, i) => {
      if (!el) return
      const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActiveService(i) }, { threshold: 0.5 })
      obs.observe(el); observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  const lastQuadrant = useRef<number | null>(null)

  const detectQuadrant = useCallback((clientX: number, clientY: number, el: HTMLElement) => {
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const isRight = clientX >= cx
    const isBottom = clientY >= cy
    const q = (!isRight && !isBottom) ? 0 : (isRight && !isBottom) ? 1 : (!isRight && isBottom) ? 2 : 3
    if (q !== lastQuadrant.current) { lastQuadrant.current = q; setHeroQuadrant(q as 0|1|2|3) }
  }, [])

  const onHeroMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    detectQuadrant(e.clientX, e.clientY, e.currentTarget as HTMLElement)
  }, [detectQuadrant])

  const onHeroTouchMove = useCallback((e: React.TouchEvent<HTMLElement>) => {
    const touch = e.touches[0]
    if (!touch) return
    detectQuadrant(touch.clientX, touch.clientY, e.currentTarget as HTMLElement)
  }, [detectQuadrant])

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity: heroVisible ? 1 : 0,
    transform: heroVisible ? 'translateY(0)' : 'translateY(32px)',
    transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
  })

  const scrollTo = useCallback((i: number) => {
    sectionRefs.current[i]?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleLoadDone = useCallback(() => setLoading(false), [])

  return (
    <div style={{ background: C.bg, color: C.white, overflowX: 'clip' }}>
      <GlowCursor />
      <CursorParticles />
      {loading && <LoadingScreen onDone={handleLoadDone} />}

      {/* ── STICKY NAV ── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-10"
        style={{ height: 64 }}>
        <div className="absolute inset-0 backdrop-blur-md transition-all duration-500"
          style={{
            background: scrolledPastHero ? 'rgba(5,7,13,0.92)' : 'rgba(5,7,13,0.25)',
            borderBottom: `1px solid ${scrolledPastHero ? C.border : 'rgba(34,48,68,0.2)'}`,
          }} />
        <div className="relative z-10 flex items-center justify-between w-full">
          {/* Logo */}
          <img src="/MAIGIA-LOGO-V1.png" alt="MAIGIA"
            style={{ height: 42, width: 'auto', objectFit: 'contain',
              filter: 'drop-shadow(0 0 12px rgba(0,184,255,0.4))' }} />

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: 'Servicios',  href: '#servicios' },
              { label: 'Proyectos', href: '#proyectos' },
              { label: 'Equipo',    href: '#equipo' },
            ].map(({ label, href }) => (
              <a key={label} href={href}
                className="transition-all duration-300"
                style={{
                  color: C.gray, textDecoration: 'none',
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '14px', fontWeight: 600,
                  letterSpacing: '0.04em',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = C.white)}
                onMouseLeave={e => (e.currentTarget.style.color = C.gray)}>
                {label}
              </a>
            ))}
            <a href="#contacto"
              onClick={e => { e.preventDefault(); setContactOpen(true) }}
              className="transition-all duration-300"
              style={{
                background: `linear-gradient(90deg, ${C.blue}, ${C.deep})`, color: C.white,
                boxShadow: `0 0 18px rgba(0,184,255,0.3)`, textDecoration: 'none',
                padding: '8px 22px', borderRadius: 999,
                fontFamily: "'Syne', sans-serif",
                fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em',
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 30px rgba(0,184,255,0.6)`)}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = `0 0 18px rgba(0,184,255,0.3)`)}>
              Contacto
            </a>
          </div>

          {/* Mobile: contact button */}
          <a href="#contacto" onClick={e => { e.preventDefault(); setContactOpen(true) }}
            className="md:hidden px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase"
            style={{ background: `linear-gradient(90deg, ${C.blue}, ${C.deep})`, color: C.white }}>
            Contacto
          </a>
        </div>
      </nav>

      {/* ── SOCIAL ICONS — fixed bottom-left ── */}
      <div className="fixed bottom-8 left-6 z-50 flex flex-col gap-4"
        style={{ opacity: heroVisible ? 1 : 0, transition: 'opacity 0.8s ease 1s' }}>
        {/* Vertical line above icons */}
        <div style={{ width: 1, height: 40, background: `linear-gradient(to bottom, transparent, ${C.border})`, margin: '0 auto' }} />
        {[
          { Icon: IconLinkedin,  url: 'https://www.linkedin.com/company/girasomnis/', label: 'LinkedIn' },
          { Icon: IconYoutube,   url: 'https://www.youtube.com/@PacoGramajegirasomnis',  label: 'YouTube' },
          { Icon: IconInstagram, url: 'https://www.instagram.com/aiasomnis',             label: 'Instagram' },
        ].map(({ Icon, url, label }) => (
          <a key={label} href={url} target="_blank" rel="noopener noreferrer"
            aria-label={label}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 group"
            style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, color: C.gray }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.borderColor = C.blue
              el.style.color = C.blue
              el.style.boxShadow = `0 0 18px rgba(0,184,255,0.55)`
              el.style.background = `rgba(0,184,255,0.12)`
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.borderColor = C.border
              el.style.color = C.gray
              el.style.boxShadow = 'none'
              el.style.background = 'rgba(255,255,255,0.04)'
            }}>
            <Icon size={15} />
          </a>
        ))}
        {/* Vertical line below icons */}
        <div style={{ width: 1, height: 40, background: `linear-gradient(to top, transparent, ${C.border})`, margin: '0 auto' }} />
      </div>

      {/* ══════════ HERO — mobile only ══════════ */}
      <div className="lg:hidden">
      <section
        ref={heroRef}
        className="relative min-h-screen overflow-hidden"
        style={{ background: C.bg }}
        onMouseMove={onHeroMouseMove}
        onMouseLeave={() => { lastQuadrant.current = null; setHeroQuadrant(null) }}
        onTouchMove={onHeroTouchMove}
        onTouchEnd={() => { lastQuadrant.current = null; setHeroQuadrant(null) }}>


        {/* Dynamic subtle glow — only when hovering a quadrant */}
        {heroQuadrant !== null && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full pointer-events-none"
            animate={{ background: `radial-gradient(circle, ${SERVICES[CORNER_SERVICE[heroQuadrant]].glow} 0%, transparent 65%)` }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}

        {/* ── 4 CORNER CARDS — all screen sizes ── */}
        {([0, 1, 2, 3] as const).map(corner => (
          <HudCard
            key={corner}
            s={SERVICES[CORNER_SERVICE[corner]]}
            delay={300 + corner * 100}
            corner={corner}
            active={heroQuadrant === corner}
            visible={heroVisible}
            onClick={() => scrollTo(CORNER_SERVICE[corner])}
          />
        ))}

        {/* ── CENTER: Robot + title + CTA ── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">

          {/* Badge */}
          <div className="mb-6 pointer-events-none px-2" style={fadeUp(0)}>
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold tracking-widest uppercase"
              style={{ background: 'rgba(0,184,255,0.10)', border: `1px solid rgba(0,184,255,0.35)`, color: C.blue, fontSize: 'clamp(12px, 2.8vw, 17px)' }}>
              <span className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse" style={{ background: C.blue }} />
              Artificial Intelligence Agency
            </span>
          </div>

          {/* Spline robot */}
          <div style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
            transition: 'opacity 1.1s ease 300ms, transform 1.1s ease 300ms',
            width: 'clamp(280px, 72vw, 780px)',
            height: 'clamp(280px, 72vw, 780px)',
            position: 'relative',
            pointerEvents: 'auto',
          }}>
            {splineInView && splineReady ? (
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full border-2 border-transparent animate-spin"
                    style={{ borderTopColor: C.blue, borderRightColor: `${C.blue}30` }} />
                </div>
              }>
                <Spline scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" style={{ width: '100%', height: '100%' }} />
              </Suspense>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-2 border-transparent animate-spin"
                  style={{ borderTopColor: C.blue, borderRightColor: `${C.blue}30` }} />
              </div>
            )}
          </div>

          {/* Title */}
          <div className="text-center px-4 -mt-6 flex flex-col items-center gap-3">

            {/* ── Animated logo ── */}
            <div className="relative flex items-center justify-center">

              {/* Ambient glow layer — breathes in idle */}
              <motion.div
                className="absolute pointer-events-none"
                style={{
                  width: 'clamp(120px, 20vw, 240px)',
                  height: 'clamp(60px, 10vw, 120px)',
                  background: `radial-gradient(ellipse, ${C.blue}55 0%, transparent 68%)`,
                  filter: 'blur(24px)',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={logoEntranceDone
                  ? { opacity: [0.45, 1, 0.45], scale: [0.85, 1.3, 0.85] }
                  : { opacity: heroVisible ? 0.4 : 0, scale: 1 }}
                transition={logoEntranceDone
                  ? { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
                  : { duration: 0.7, delay: 1.1 }}
              />

              {/* Shockwave ring — one-shot on entrance complete */}
              {logoEntranceDone && (
                <motion.div
                  className="absolute rounded-full pointer-events-none"
                  style={{ width: 'clamp(80px, 12vw, 150px)', height: 'clamp(80px, 12vw, 150px)', border: `1.5px solid ${C.blue}` }}
                  initial={{ scale: 0.7, opacity: 0.9 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 1.0, ease: 'easeOut' }}
                />
              )}

              {/* Logo with glitch entrance + idle breathing */}
              <motion.img
                src="/MAIGIA-LOGO-V1.png"
                alt="AIA-SOMNIS"
                initial={{ opacity: 0, scale: 0.78, filter: 'blur(14px)' }}
                animate={
                  !heroVisible
                    ? { opacity: 0, scale: 0.78, filter: 'blur(14px)' }
                    : logoEntranceDone
                      ? {
                          scale:  [1, 1.018, 1],
                          filter: [
                            'drop-shadow(0 0 28px rgba(0,184,255,0.55))',
                            'drop-shadow(0 0 64px rgba(0,184,255,1))',
                            'drop-shadow(0 0 28px rgba(0,184,255,0.55))',
                          ],
                        }
                      : {
                          opacity: [0, 0.25, 0.04, 0.75, 0.6, 1],
                          scale:   [0.78, 0.86, 0.83, 0.97, 1.03, 1],
                          filter:  [
                            'blur(14px)',
                            'blur(5px) brightness(2)',
                            'blur(11px) brightness(0.6)',
                            'blur(2px) brightness(1.4)',
                            'blur(0.5px)',
                            'drop-shadow(0 0 28px rgba(0,184,255,0.55))',
                          ],
                        }
                }
                transition={logoEntranceDone ? {
                  duration: 2.8, repeat: Infinity, ease: 'easeInOut',
                } : {
                  duration: 1.25, delay: 0.25, ease: 'easeInOut',
                  times: [0, 0.16, 0.32, 0.62, 0.82, 1],
                }}
                onAnimationComplete={() => {
                  if (!logoEntranceDone && heroVisible) setLogoEntranceDone(true)
                }}
                style={{
                  height: 'clamp(50px, 8vw, 100px)',
                  width: 'auto',
                  objectFit: 'contain',
                  position: 'relative',
                  zIndex: 1,
                }}
              />
            </div>

            <p className="text-base max-w-sm mx-auto font-medium" style={{ ...fadeUp(1400), color: C.gray }}>
              Para <span style={{ color: C.white }}>eventos, marcas y cultura.</span>
            </p>
          </div>

        </div>

        {/* ── Mobile-only lateral 01/02/03/04 nav ── */}
        <div
          className="md:hidden absolute right-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2.5 pointer-events-auto"
          style={{ opacity: heroVisible ? 1 : 0, transition: 'opacity 0.8s ease 500ms' }}
        >
          {SERVICES.map((s, i) => {
            const isActive = activeService === i
            return (
              <motion.button
                key={s.num}
                onClick={() => scrollTo(i)}
                whileTap={{ scale: 0.82 }}
                style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
              >
                <motion.div
                  animate={{
                    background: isActive ? `${s.accent}20` : 'rgba(255,255,255,0.04)',
                    borderColor: isActive ? s.accent : C.border,
                    boxShadow: isActive ? `0 0 12px ${s.glow}` : 'none',
                    scale: isActive ? 1.12 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="rounded-full flex items-center justify-center"
                  style={{ width: 28, height: 28, border: `1.5px solid ${C.border}` }}
                >
                  <motion.span
                    animate={{ color: isActive ? s.accent : C.gray }}
                    transition={{ duration: 0.3 }}
                    style={{ fontSize: 9, fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.03em', lineHeight: 1 }}
                  >
                    {s.num}
                  </motion.span>
                </motion.div>
              </motion.button>
            )
          })}
        </div>


        {/* Scroll indicator */}
        <div style={fadeUp(900)} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
          <span className="text-xs uppercase tracking-widest" style={{ color: C.gray }}>Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ChevronDown size={20} style={{ color: C.blue }} />
          </motion.div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-32 pointer-events-none"
          style={{ background: `linear-gradient(to top, ${C.bg}, transparent)` }} />
      </section>
      </div>

      {/* ══════════ HERO — desktop only (sticky robot) ══════════ */}
      <div className="hidden lg:block">
        <StickyRobotSection ready={!loading} />
      </div>

      {/* ══════════ PARTICLE TEXT TRANSITION ══════════ */}
      <section className="relative overflow-hidden hidden sm:block" style={{ height: '40vh', background: C.bg }}>
        {/* top fade from hero */}
        <div className="absolute inset-x-0 top-0 h-20 pointer-events-none z-10"
          style={{ background: `linear-gradient(to bottom, ${C.bg}, transparent)` }} />
        {/* bottom fade into services — strong so video fades in cleanly */}
        <div className="absolute inset-x-0 bottom-0 h-32 pointer-events-none z-10"
          style={{ background: `linear-gradient(to top, ${C.bg}, transparent)` }} />
        <ParticleText
          text="MAIGIA"
          fontSize={130}
          fontWeight={200}
          colors={['#00B8FF', '#22D3FF', '#1B3DFF', '#0099FF', '#4DA6FF', '#00B8FF', '#22D3FF', '#00B8FF', '#FFD42A']}
          particleSize={2}
          mouseRadius={100}
          returnSpeed={0.07}
          density={5}
          className="cursor-none"
        />
      </section>

      {/* ══════════ SERVICIOS ══════════ */}
      <section id="servicios" style={{ background: C.bg }}>
        {SERVICES.map((s, i) => {
              // i=0,2: text LEFT · reel RIGHT   |   i=1,3: reel LEFT · text RIGHT
              const textRight = i % 2 !== 0

              return (
                <div key={s.id} ref={el => { sectionRefs.current[i] = el }}
                  className="relative"
                  style={{ height: '100svh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                  {/* Glow bg */}
                  <div className="absolute inset-0 pointer-events-none" style={{
                    background: `radial-gradient(ellipse at 50% 55%, ${s.glow} 0%, transparent 62%)`,
                    opacity: i === activeService ? 1 : 0,
                    transition: 'opacity 0.6s ease',
                  }} />

                  {/* ── 2-COLUMN BODY ── */}
                  <div className="flex-1 flex flex-col md:flex-row relative z-10 min-h-0">

                    {/* ── TEXT COLUMN ── fixed width on desktop, full width on mobile */}
                    <div
                      className={`flex flex-col justify-center gap-4 p-6 md:p-10 lg:p-14 shrink-0 w-full md:w-[320px] lg:w-[380px] overflow-y-auto border-b md:border-b-0 ${textRight ? 'md:order-2 md:border-l' : 'md:order-1 md:border-r'}`}
                      style={{ borderColor: C.border }}>

                      {/* num + title */}
                      <div>
                        <span className="block font-black leading-none mb-1"
                          style={{ fontSize: 'clamp(2.5rem,5vw,6rem)', color: `${s.accent}30`, letterSpacing: '-0.04em', lineHeight: 1 }}>{s.num}</span>
                        <h2 className="font-black leading-tight mb-2"
                          style={{ fontSize: 'clamp(1.5rem,2.8vw,2.5rem)', color: C.white, marginTop: '-0.5rem' }}>{s.title}</h2>
                        <p style={{ color: `${s.accent}CC`, fontSize: '0.9rem' }}>{s.subtitle}</p>
                      </div>

                      {/* description */}
                      <p className="leading-relaxed"
                        style={{ color: C.gray, fontSize: 'clamp(0.88rem,1vw,1rem)' }}>
                        {s.desc}
                      </p>

                      {/* tags — typewriter reveal on scroll */}
                      <TypewriterTags tags={s.tags} accent={s.accent} />
                    </div>

                    {/* ── REEL COLUMN ── fills all remaining space, edge-to-edge */}
                    <div className={`flex-1 relative min-h-0 ${textRight ? 'md:order-1' : 'md:order-2'}`}>

                      <div className="absolute inset-0" style={{ background: '#02040B' }}>

                        {s.reel ? (
                          /* ── Real video: full-bleed, no ImageTrail ── */
                          <>
                            <LazyVideo
                              src={s.reel}
                              className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
                            {/* top fade-in — stronger on first section */}
                            <div className="absolute top-0 inset-x-0 pointer-events-none" style={{
                              height: i === 0 ? '45%' : '25%',
                              background: `linear-gradient(to bottom, ${C.bg} 0%, transparent 100%)`,
                            }} />
                            {/* vignette toward text column */}
                            <div className="absolute inset-0 pointer-events-none" style={{
                              background: textRight
                                ? `linear-gradient(to left,  rgba(5,7,13,0.5), transparent 55%)`
                                : `linear-gradient(to right, rgba(5,7,13,0.5), transparent 55%)`,
                            }} />
                          </>
                        ) : (
                          /* ── No video yet: ImageTrail + dark bg image + mouse hint ── */
                          <ImageTrail images={TRAIL_IMAGES[i]} triggerDistance={30} maxImages={8}
                            imageWidth={window.innerWidth < 768 ? 90 : 160}
                            imageHeight={window.innerWidth < 768 ? 90 : 160}
                            maxRotation={8}>
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 cursor-none select-none">

                              {/* Dark background image for sections without reel */}
                              <div className="absolute inset-0 pointer-events-none" style={{
                                backgroundImage: 'url(/abstract.jpg)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                opacity: 0.35,
                              }} />
                              {/* Dark overlay to keep contrast */}
                              <div className="absolute inset-0 pointer-events-none" style={{
                                background: `linear-gradient(to bottom, rgba(2,4,11,0.55) 0%, rgba(2,4,11,0.2) 50%, rgba(2,4,11,0.6) 100%)`,
                              }} />

                              {/* bottom glow */}
                              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-36 pointer-events-none" style={{
                                background: `radial-gradient(ellipse at bottom, ${s.glow} 0%, transparent 70%)`,
                                opacity: i === activeService ? 1 : 0.4,
                                transition: 'opacity 0.6s ease',
                              }} />

                              {/* Mouse hint */}
                              <motion.div
                                className="relative z-10 flex flex-col items-center gap-4"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                                {/* animated cursor ring */}
                                <div className="relative w-14 h-14 flex items-center justify-center">
                                  <motion.div
                                    className="absolute inset-0 rounded-full"
                                    style={{ border: `1px solid ${s.accent}` }}
                                    animate={{ scale: [1, 1.35, 1], opacity: [0.8, 0, 0.8] }}
                                    transition={{ duration: 2, repeat: Infinity }} />
                                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.accent, boxShadow: `0 0 12px ${s.accent}` }} />
                                </div>
                                <span className="text-xs uppercase tracking-[0.35em] text-center" style={{ color: `${s.accent}80` }}>
                                  Mueve el cursor
                                </span>
                              </motion.div>

                              {/* Corner brackets */}
                              {['top-4 left-4','top-4 right-4','bottom-4 left-4','bottom-4 right-4'].map((pos, ci) => (
                                <div key={ci} className={`absolute ${pos} w-5 h-5 pointer-events-none`} style={{
                                  borderTop:    ci < 2       ? `1px solid ${s.accent}30` : 'none',
                                  borderBottom: ci >= 2      ? `1px solid ${s.accent}30` : 'none',
                                  borderLeft:   ci % 2 === 0 ? `1px solid ${s.accent}30` : 'none',
                                  borderRight:  ci % 2 !== 0 ? `1px solid ${s.accent}30` : 'none',
                                }} />
                              ))}
                            </div>
                          </ImageTrail>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              )
        })}
      </section>

      {/* ══════════ TICKER — transición hacia proyectos ══════════ */}
      <div className="relative overflow-hidden py-5 select-none" style={{ background: C.bg, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        {/* fade edges */}
        <div className="absolute inset-y-0 left-0 w-24 pointer-events-none z-10" style={{ background: `linear-gradient(to right, ${C.bg}, transparent)` }} />
        <div className="absolute inset-y-0 right-0 w-24 pointer-events-none z-10" style={{ background: `linear-gradient(to left, ${C.bg}, transparent)` }} />
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
        >
          {[...Array(2)].map((_, rep) => (
            <div key={rep} className="flex gap-12 items-center">
              {['Avatar Viky', 'Canet Rock IA', 'Quiniela Planeta', 'FLUGE', 'Interactivos Táctiles'].map((name) => (
                <span key={name} className="flex items-center gap-12">
                  <span className="font-black uppercase tracking-widest text-sm" style={{ color: C.white }}>{name}</span>
                  <span className="text-lg font-black" style={{ color: C.blue }}>·</span>
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* ══════════ PROYECTOS — FxSlider ══════════ */}
      <section id="proyectos">
        <FxSlider items={PROJECTS} headerText="Proyectos seleccionados" duration={0.64} parallaxAmount={5} />
      </section>

      {/* ══════════ CUBO FRAMES ══════════ */}
      <CuboFramesSection />

      {/* ══════════ AURORA — Experiencias que conectan ══════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: '70vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

        {/* Aurora orbs */}
        <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'hidden' }}>
          <div className="aurora1 absolute" style={{ width: '70vw', height: '70vw', borderRadius: '50%', top: '-20%', left: '-15%', background: `radial-gradient(circle, ${C.deep}55 0%, ${C.blue}22 40%, transparent 70%)`, filter: 'blur(60px)' }} />
          <div className="aurora2 absolute" style={{ width: '60vw', height: '60vw', borderRadius: '50%', bottom: '-25%', right: '-10%', background: `radial-gradient(circle, ${C.blue}40 0%, ${C.cyan}18 45%, transparent 70%)`, filter: 'blur(70px)' }} />
          <div className="aurora3 absolute" style={{ width: '40vw', height: '40vw', borderRadius: '50%', top: '30%', left: '35%', background: `radial-gradient(circle, rgba(27,61,255,0.35) 0%, transparent 65%)`, filter: 'blur(50px)' }} />
          {/* Grid lines */}
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(${C.border}18 1px, transparent 1px), linear-gradient(90deg, ${C.border}18 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
          }} />
        </div>

        {/* Content */}
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}
          className="relative z-10 flex flex-col items-center text-center gap-6 px-6 py-24">
          <span className="text-xs uppercase tracking-[0.3em]" style={{ color: C.cyan, fontFamily: "'Syne',sans-serif", fontWeight: 600 }}>Creatividad · Tecnología · IA</span>
          <h2 className="font-black leading-tight" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)', color: C.white, maxWidth: 800 }}>
            Experiencias que{' '}
            <span style={{ backgroundImage: `linear-gradient(90deg, ${C.blue} 0%, ${C.cyan} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              conectan
            </span>
          </h2>
          <p className="max-w-xl text-base md:text-lg leading-relaxed" style={{ color: '#B8CCE0' }}>
            La fusión entre la experiencia artística de Girasomnis y la capacidad tecnológica de Immerso.
          </p>
          {/* Divider line */}
          <div style={{ width: 80, height: 1, background: `linear-gradient(90deg, transparent, ${C.blue}, transparent)`, marginTop: 8 }} />
        </motion.div>

        <div className="absolute bottom-0 inset-x-0 h-32 pointer-events-none" style={{ background: `linear-gradient(to top, ${C.bg}, transparent)` }} />
        <div className="absolute top-0 inset-x-0 h-32 pointer-events-none" style={{ background: `linear-gradient(to bottom, ${C.bg}, transparent)` }} />
      </section>

      {/* ══════════ ABOUT US — Dot Grid ══════════ */}
      <AboutSection />


      {/* ══════════ TEAM ══════════ */}
      <section id="equipo" className="relative py-24 px-6" style={{ background: C.bg2 }}>
        {/* fade from About bg (#05070D) into this section */}
        <div className="absolute top-0 inset-x-0 h-24 pointer-events-none"
          style={{ background: `linear-gradient(to bottom, ${C.bg}, ${C.bg2})` }} />
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.3em] mb-4 block" style={{ color: C.blue }}>El equipo</span>
            <h2 className="font-black" style={{ fontSize: 'clamp(2rem,4vw,3rem)', color: C.white }}>Las personas detrás</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TEAM.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="rounded-2xl overflow-hidden text-center cursor-default transition-all duration-300 group"
                style={{ background: 'rgba(5,7,13,0.8)', border: `1px solid ${C.border}` }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = C.blue}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = C.border}>

                {/* Photo / avatar area */}
                <div className="relative w-full aspect-[3/4] overflow-hidden"
                  style={{ background: `linear-gradient(160deg, #0D1829 0%, ${C.bg} 100%)` }}>
                  {member.photo ? (
                    <>
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        style={member.imgStyle}
                      />
                      {/* Dark gradient overlay at bottom */}
                      <div className="absolute inset-0"
                        style={{ background: 'linear-gradient(to top, rgba(5,7,13,0.9) 0%, rgba(5,7,13,0.1) 55%, transparent 100%)' }} />
                    </>
                  ) : (
                    /* No photo yet: initials placeholder */
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${C.bg2}, #0D1829)`, border: `1px solid ${C.border}` }}>
                        <span className="font-black text-2xl" style={{ color: C.blue }}>{member.initials}</span>
                      </div>
                      <span className="text-xs" style={{ color: C.border }}>Próximamente</span>
                    </div>
                  )}
                  {/* Bottom gradient to blend into card body */}
                  <div className="absolute bottom-0 inset-x-0 h-1" style={{ background: `linear-gradient(90deg, ${C.deep} 0%, ${C.blue} 45%, ${C.cyan} 100%)` }} />
                </div>

                {/* Name / role */}
                <div className="px-4 py-4">
                  <h3 className="font-bold text-sm mb-1" style={{ color: C.white }}>{member.name}</h3>
                  <span className="text-xs uppercase tracking-wide" style={{ color: C.gray }}>{member.role}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CONTACTO ══════════ */}
      <section id="contacto" className="relative py-24 px-6 overflow-hidden" style={{ background: C.bg }}>
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, rgba(0,184,255,0.06) 0%, transparent 70%)` }} />
        <div className="absolute top-1/2 right-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, rgba(255,212,42,0.04) 0%, transparent 70%)` }} />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* LEFT: contact text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}>
              <span className="text-xs uppercase tracking-[0.3em] mb-6 block" style={{ color: C.gold }}>Hablemos</span>
              <h2 className="font-black leading-none mb-6" style={{ fontSize: 'clamp(2.5rem,5vw,4.5rem)', color: C.white }}>
                ¿Tienes un{' '}
                <span style={{
                  backgroundImage: `linear-gradient(90deg, ${C.deep} 0%, ${C.blue} 45%, ${C.cyan} 100%)`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>proyecto?</span>
              </h2>
              <p className="text-base md:text-lg mb-10 max-w-md" style={{ color: '#B8CCE0', lineHeight: 1.7 }}>
                Cuéntanos tu idea. Transformamos creatividad, tecnología e inteligencia artificial en experiencias que impactan.
              </p>
              <a href="mailto:info@girasomnis.com"
                className="inline-flex items-center gap-3 px-9 py-4 rounded-full font-bold text-base transition-all duration-300 mb-10"
                style={{
                  background: `linear-gradient(135deg, ${C.deep} 0%, ${C.blue} 60%, ${C.cyan} 100%)`,
                  color: C.white,
                  boxShadow: `0 0 40px ${C.blue}55`,
                }}>
                <Mail size={18} /> info@girasomnis.com
              </a>

              <div className="flex gap-6 mt-2">
                {['Madrid', 'Valencia', 'Barcelona'].map(city => (
                  <div key={city} className="flex items-center gap-2">
                    <MapPin size={13} style={{ color: C.blue }} />
                    <span className="text-sm font-semibold" style={{ color: C.gray }}>{city}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* RIGHT: Unfocused scroll image */}
            <UnfocusedImage src="/abstract.jpg" />

          </div>
        </div>
      </section>

      {/* ── AUDIO + SOUND TOGGLE ── */}
      <audio
        ref={audioRef}
        src={TRACKS[trackIdx]}
        preload="none"
        onEnded={handleTrackEnd}
      />
      <motion.button
        onClick={toggleSound}
        className="fixed z-50 flex items-center gap-2 rounded-full cursor-pointer"
        style={{
          bottom: '1.5rem',
          right: '1.5rem',
          padding: '10px 16px',
          background: soundOn ? 'rgba(123,47,255,0.18)' : 'rgba(5,7,13,0.82)',
          border: `1px solid ${soundOn ? '#7B2FFF' : C.border}`,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
        animate={{ boxShadow: soundOn ? ['0 0 0px #7B2FFF', '0 0 20px #7B2FFF88', '0 0 0px #7B2FFF'] : '0 4px 20px rgba(0,0,0,0.5)' }}
        transition={soundOn ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}>
        {/* Audio waveform bars */}
        <div className="flex items-end gap-[3px]" style={{ height: 22 }}>
          {[10, 16, 10, 20, 8, 16, 10].map((h, i) => (
            <motion.div
              key={i}
              style={{ width: 3, borderRadius: 2, originY: 1 }}
              animate={soundOn ? {
                height: [h, h * 0.3, h * 1.8, h * 0.5, h],
                background: ['#7B2FFF', '#00B8FF', '#7B2FFF'],
              } : {
                height: 4,
                background: C.gray,
              }}
              transition={soundOn ? {
                duration: 0.65 + i * 0.07,
                repeat: Infinity,
                delay: i * 0.08,
                ease: 'easeInOut',
              } : { duration: 0.3 }}
            />
          ))}
        </div>
        <span className="text-[10px] font-bold tracking-widest uppercase ml-1"
          style={{ color: soundOn ? '#7B2FFF' : C.gray }}>
          {soundOn ? 'ON' : 'OFF'}
        </span>
      </motion.button>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-6" style={{ borderTop: `1px solid ${C.border}`, background: C.bg }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/MAIGIA-LOGO-V1.png" alt="MAIGIA" style={{ height: 24, width: 'auto', objectFit: 'contain', opacity: 0.6 }} />
            <span className="text-xs" style={{ color: C.border }}>MAIGIA 2026</span>
          </div>
          <div className="flex gap-4">
            {[
              { Icon: IconLinkedin,  url: 'https://www.linkedin.com/company/girasomnis/' },
              { Icon: IconYoutube,   url: 'https://www.youtube.com/@PacoGramajegirasomnis' },
              { Icon: IconInstagram, url: 'https://www.instagram.com/aiasomnis' },
            ].map(({ Icon, url }, i) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                className="transition-colors duration-300" style={{ color: C.border }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = C.blue}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = C.border}>
                <Icon size={18} />
              </a>
            ))}
          </div>
          <span className="text-xs" style={{ color: C.border, opacity: 0.5 }}>
            Powered by{' '}
            <a href="https://immerso.live" target="_blank" rel="noopener noreferrer"
              style={{ color: C.border, textDecoration: 'none', opacity: 0.7 }}
              onMouseEnter={e => (e.currentTarget.style.color = C.gray)}
              onMouseLeave={e => (e.currentTarget.style.color = C.border)}>
              immerso.live
            </a>
          </span>
        </div>
      </footer>

      {/* ══════════ CONTACT MODAL ══════════ */}
      {contactOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          onClick={() => setContactOpen(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0" style={{ background: 'rgba(5,7,13,0.92)', backdropFilter: 'blur(12px)' }} />

          {/* Panel */}
          <motion.div
            className="relative w-full max-w-lg rounded-2xl p-8 md:p-10"
            style={{ background: '#071120', border: `1px solid ${C.border}`, boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}>

            {/* Close */}
            <button onClick={() => { setContactOpen(false); setFormSent(false) }}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', color: C.gray }}>✕</button>

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
                  style={{ background: 'linear-gradient(135deg,#7B2FFF,#1B3DFF)', color: C.white }}>
                  Cerrar
                </button>
              </div>
            ) : (
              <>
                <img src="/MAIGIA-LOGO-V1.png" alt="AIA-SOMNIS" style={{ height: 28, objectFit: 'contain', marginBottom: 20 }} />
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
                        className="rounded-xl px-4 py-3 text-sm outline-none transition-all"
                        style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, color: C.white }}
                        onFocus={e => e.currentTarget.style.borderColor = C.blue}
                        onBlur={e => e.currentTarget.style.borderColor = C.border} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs uppercase tracking-wider" style={{ color: C.gray }}>Email</label>
                      <input name="email" type="email" required placeholder="tu@email.com"
                        className="rounded-xl px-4 py-3 text-sm outline-none transition-all"
                        style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, color: C.white }}
                        onFocus={e => e.currentTarget.style.borderColor = C.blue}
                        onBlur={e => e.currentTarget.style.borderColor = C.border} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs uppercase tracking-wider" style={{ color: C.gray }}>Tipo de proyecto</label>
                    <select name="tipo" style={{ background: '#0D1829', border: `1px solid ${C.border}`, color: C.white }}
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
                    <textarea name="mensaje" required rows={4} placeholder="Describe tu proyecto, evento, marca o lo que necesitas..."
                      className="rounded-xl px-4 py-3 text-sm outline-none transition-all resize-none"
                      style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, color: C.white }}
                      onFocus={e => e.currentTarget.style.borderColor = C.blue}
                      onBlur={e => e.currentTarget.style.borderColor = C.border} />
                  </div>

                  <button type="submit"
                    className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wide mt-1"
                    style={{ background: `linear-gradient(135deg, ${C.deep} 0%, ${C.blue} 60%, ${C.cyan} 100%)`, color: C.white, boxShadow: `0 0 32px ${C.blue}66` }}>
                    Enviar proyecto →
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  )
}
