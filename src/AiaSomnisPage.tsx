import { Suspense, lazy, memo, useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ImageTrail } from '@/components/ui/image-trail'
import { ParticleText } from '@/components/ui/particle-text'
import { FxSlider, type SliderItem } from '@/components/ui/fx-slider'
import { Magazine3D } from '@/components/ui/magazine-3d'
import { Mail, MapPin, ChevronDown, ArrowRight, Bot, Layers, Film, Globe, Volume2, VolumeX } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// Heavy components loaded only when needed
const Spline = lazy(() => import('@splinetool/react-spline'))
const GaussianSplatViewer = lazy(() =>
  import('@/components/ui/gaussian-splat-viewer').then(m => ({ default: m.GaussianSplatViewer }))
)

// ── Brand palette ─────────────────────────────────────────────────────────────
const C = {
  bg: '#05070D', bg2: '#071120', blue: '#00B8FF', cyan: '#22D3FF',
  deep: '#1B3DFF', gold: '#FFD42A', goldSoft: '#F6B93B',
  white: '#F4F7FB', gray: '#AAB3C2', border: '#223044',
}

// ── 4 Services ────────────────────────────────────────────────────────────────
const SERVICES: {
  num: string; id: string; title: string; cardDesc: string; subtitle: string;
  desc: string; tags: string[]; accent: string; glow: string; Icon: LucideIcon
  reel: string | null   // drop any .mp4 in /public and put its path here e.g. '/reel-01.mp4'
}[] = [
  {
    num: '01', id: 'avatares', Icon: Bot,
    title: 'Avatares IA',
    cardDesc: 'Avatares conversacionales para eventos, ferias y espacios físicos.',
    subtitle: 'para eventos, ferias y espacios físicos',
    desc: 'Creamos avatares conversacionales personalizados que pueden atender al público, presentar contenidos, responder preguntas, hablar en varios idiomas y captar leads en tiempo real.',
    tags: ['Ferias y exposiciones', 'Centros comerciales', 'Eventos corporativos', 'Presentador virtual', 'Multilingüe', 'Conectado a marca'],
    accent: '#00B8FF', glow: 'rgba(0,184,255,0.3)',
    reel: '/robot.mp4',
  },
  {
    num: '02', id: 'instalaciones', Icon: Layers,
    title: 'Instalaciones interactivas',
    cardDesc: 'Experiencias con IA, cámaras y pantallas en tiempo real.',
    subtitle: 'con Inteligencia Artificial',
    desc: 'Diseñamos experiencias donde el público interactúa con cámaras, pantallas, sensores y sistemas generativos, creando contenido visual en tiempo real.',
    tags: ['Cámara + IA', 'Visuales reactivos', 'Photocalls inteligentes', 'Tótems interactivos', 'Holográfico', '360° inmersivo'],
    accent: '#22D3FF', glow: 'rgba(34,211,255,0.28)',
    reel: null,
  },
  {
    num: '03', id: 'visuales', Icon: Film,
    title: 'Producción audiovisual con IA',
    cardDesc: 'Contenido publicitario, visuales generativos y videomapping.',
    subtitle: 'y producción audiovisual con IA',
    desc: 'Creamos imágenes, animaciones y mundos visuales con IA, combinando dirección artística, 3D, motion graphics y producción audiovisual profesional.',
    tags: ['Campañas publicitarias', 'Pantallas LED', 'Videomapping IA', 'Animaciones generativas', 'Conciertos y espectáculos'],
    accent: '#FFD42A', glow: 'rgba(255,212,42,0.22)',
    reel: '/reel-test.mp4',   // ← cambia esta ruta cuando tengas el video real
  },
  {
    num: '04', id: 'digital', Icon: Globe,
    title: 'Soluciones digitales con IA',
    cardDesc: 'Webs, automatizaciones y agentes inteligentes para empresas.',
    subtitle: 'y automatizaciones',
    desc: 'Creamos soluciones digitales con IA para automatizar procesos, captar leads, mejorar la atención al cliente y crear experiencias web más inteligentes.',
    tags: ['Webs con IA', 'Asistentes virtuales', 'Automatización de procesos', 'CRM integration', 'Experiencias 3D web'],
    accent: '#F6B93B', glow: 'rgba(246,185,59,0.22)',
    reel: null,
  },
]

const TEAM = [
  { name: 'Paco Gramaje',      role: 'Creative Director', initials: 'PG', photo: '/team/paco.jpg',   imgStyle: { objectPosition: 'center 12%' } },
  { name: 'Leonardo Bautista', role: 'Director Creativo', initials: 'LB', photo: '/team/LEO.png',    imgStyle: { objectPosition: 'center 10%' } },
  { name: 'Anto Loriso',       role: 'CTO',               initials: 'AL', photo: '/team/anto.jpg',   imgStyle: { objectPosition: 'center 20%' } },
  { name: 'Martin Julià',      role: '3D & IA Developer', initials: 'MJ', photo: '/team/MARTIN.png', imgStyle: { objectPosition: 'center 10%' } },
]

// ── Pexels CDN helper ─────────────────────────────────────────────────────────
const px = (id: number, w = 600, h = 400) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`

// Trail images per service (6 Pexels photos each — swap for real project images)
const TRAIL_IMAGES: string[][] = [
  // 01 Avatares IA — robots, AI, holograms, tech
  [8386440, 8386434, 8386422, 3861969, 8294404, 3862021].map(id => px(id, 400, 400)),
  // 02 Instalaciones interactivas — events, screens, exhibitions
  [1190297, 2608517, 1449940, 3861974, 1105666, 3075993].map(id => px(id, 400, 400)),
  // 03 Visuales generativos — neon, abstract art, colorful
  [2387418, 3756165, 1762851, 3612885, 2685229, 1279813].map(id => px(id, 400, 400)),
  // 04 Digital / dev — code, laptops, web
  [574069, 1181271, 546819, 3183150, 270360, 1181244].map(id => px(id, 400, 400)),
]

// Projects for FxSlider — real Pexels backgrounds
const PROJECTS: SliderItem[] = [
  {
    num: '01', year: '2024', accent: '#00B8FF',
    title: 'Avatar Viky · Girasomnis', category: 'Avatares IA',
    bg: `url('${px(8386440, 1200, 800)}') center/cover no-repeat`,
  },
  {
    num: '02', year: '2024', accent: '#22D3FF',
    title: 'Canet Rock IA', category: 'Visuales Generativos',
    bg: `url('${px(1105666, 1200, 800)}') center/cover no-repeat`,
  },
  {
    num: '03', year: '2024', accent: '#FFD42A',
    title: 'Quiniela Planeta', category: 'Instalación Interactiva',
    bg: `url('${px(3861974, 1200, 800)}') center/cover no-repeat`,
  },
  {
    num: '04', year: '2024', accent: '#F6B93B',
    title: 'FLUGE — Avatar Demo', category: 'Avatar Interactivo',
    bg: `url('${px(8386434, 1200, 800)}') center/cover no-repeat`,
  },
  {
    num: '05', year: '2023', accent: '#1B3DFF',
    title: 'Interactivos Táctiles', category: 'Instalación Interactiva',
    bg: `url('${px(3075993, 1200, 800)}') center/cover no-repeat`,
  },
]

// .spz file name — put your file in /public and set this
const SPZ_FILE = '/scene.spz'

// Magazine images: cover + interior pages (portrait crop)
const MAG_COVER = px(8386440, 480, 640)
const MAG_PAGES = [
  px(1105666, 480, 640),
  px(3861974, 480, 640),
  px(8386434, 480, 640),
  px(3075993, 480, 640),
  px(2387418, 480, 640),
]

// ── WebGL shader (blue / gold) ────────────────────────────────────────────────
const VERT = `attribute vec2 a_position; void main(){gl_Position=vec4(a_position,0,1);}`
// Shader runs at half resolution — same visual, ~4× less GPU load
const FRAG = `
  precision mediump float;
  uniform float u_time; uniform vec2 u_resolution;
  vec2 hash2(vec2 p){p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));return -1.0+2.0*fract(sin(p)*43758.5453123);}
  float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);return mix(mix(dot(hash2(i),f),dot(hash2(i+vec2(1,0)),f-vec2(1,0)),u.x),mix(dot(hash2(i+vec2(0,1)),f-vec2(0,1)),dot(hash2(i+vec2(1,1)),f-vec2(1,1)),u.x),u.y);}
  float fbm(vec2 p){float v=0.0,a=0.5;for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.0+vec2(100.0);a*=0.5;}return v;}
  float clouds(vec2 p){float f=0.0,a=0.5;for(int i=0;i<3;i++){f+=a*noise(p);p*=2.1;a*=0.5;}return f*0.5+0.5;}
  void main(){
    vec2 FC=gl_FragCoord.xy,R=u_resolution;float T=u_time;
    vec2 uv=(FC-0.5*R)/min(R.x,R.y),st=uv*vec2(2,1);
    float bg=clouds(vec2(st.x+T*0.35,-st.y));
    vec2 q=vec2(fbm(uv*2.5),fbm(uv*2.5+vec2(5.2,1.3)));
    vec2 r=vec2(fbm(uv*2.5+4.0*q+vec2(1.7+T*0.07,9.2)),fbm(uv*2.5+4.0*q+vec2(8.3,2.8+T*0.07)));
    float f=fbm(uv*2.5+4.0*r);
    vec3 cA=vec3(0.02,0.03,0.07),cB=vec3(0.04,0.07,0.15),cC=vec3(0.00,0.07,0.20),cD=vec3(0.02,0.04,0.13);
    vec3 col=mix(cA,cB,clamp(f*f*4.0,0.0,1.0));
    col=mix(col,cC,clamp(length(q),0.0,1.0));col=mix(col,cD,clamp(r.x+r.y,0.0,1.0));
    col=mix(col,vec3(0.0,bg*0.04,bg*0.12),0.35);
    vec2 puv=uv*(1.0-0.3*(sin(T*0.2)*0.5+0.5));
    for(float i=1.0;i<9.0;i++){
      puv+=0.1*cos(i*vec2(0.1+0.01*i,0.8)+i*i+T*0.5+0.1*puv.x);
      vec2 pp=puv;float d=length(pp);float tt=fract(sin(i*127.1)*43758.5);
      vec3 pCol=mix(vec3(0.0,0.72,1.0),vec3(1.0,0.83,0.16),tt)*2.5;
      col+=0.0025/d*pCol;float b=noise(i+pp+bg*1.731);
      col+=0.004*b/length(max(pp,vec2(b*pp.x*0.02,pp.y)))*pCol;
    }
    vec2 vig=(FC/R)*(1.0-FC/R);col*=pow(vig.x*vig.y*16.0,0.3);col=col/(col+0.6);
    gl_FragColor=vec4(col,1.0);
  }
`
function compileShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s
}
// Memoized — never re-renders, runs its own RAF loop
const ShaderCanvas = memo(function ShaderCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    const gl = canvas.getContext('webgl', { antialias: false, powerPreference: 'high-performance' })
    if (!gl) return
    const prog = gl.createProgram()!
    gl.attachShader(prog, compileShader(gl, gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, compileShader(gl, gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog); gl.useProgram(prog)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW)
    const pos = gl.getAttribLocation(prog, 'a_position')
    gl.enableVertexAttribArray(pos); gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)
    const uT = gl.getUniformLocation(prog, 'u_time'), uR = gl.getUniformLocation(prog, 'u_resolution')
    let raf: number, t0 = performance.now()
    // Render at 55% resolution — canvas CSS fills container via object-fit stretch
    const resize = () => {
      const scale = 0.55
      canvas.width  = Math.floor(canvas.clientWidth  * scale)
      canvas.height = Math.floor(canvas.clientHeight * scale)
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    const draw = () => {
      gl.uniform1f(uT, (performance.now() - t0) / 1000)
      gl.uniform2f(uR, canvas.width, canvas.height)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      raf = requestAnimationFrame(draw)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(canvas); resize(); draw()
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [])
  return <canvas ref={ref} className="absolute inset-0 w-full h-full" style={{ imageRendering: 'auto' }} aria-hidden />
})

// ── Robot Eye ─────────────────────────────────────────────────────────────────
const RobotEye = memo(function RobotEye({ active }: { active: number }) {
  const s = SERVICES[active]
  const dotPos = [{ top: '4%', left: '50%' }, { top: '50%', left: '96%' }, { top: '96%', left: '50%' }, { top: '50%', left: '4%' }]
  const lines = [{ x2: '100', y2: '8' }, { x2: '192', y2: '100' }, { x2: '100', y2: '192' }, { x2: '8', y2: '100' }]
  return (
    <div className="relative" style={{ width: 200, height: 200 }}>
      <div className="absolute inset-0 rounded-full" style={{ border: `1px solid ${C.border}` }} />
      <motion.div className="absolute inset-0 rounded-full" animate={{ boxShadow: `0 0 40px ${s.glow}, 0 0 80px ${s.glow}` }} transition={{ duration: 0.6 }} />
      <motion.div className="absolute inset-5 rounded-full flex flex-col items-center justify-center gap-2"
        style={{ background: 'radial-gradient(circle, #0D1829 0%, #05070D 100%)' }}
        animate={{ boxShadow: `inset 0 0 20px ${s.glow}` }} transition={{ duration: 0.6 }}>
        <div className="flex gap-3">
          {[0, 1].map(i => (
            <motion.div key={i} className="rounded-full" style={{ width: 12, height: 12 }}
              animate={{ backgroundColor: s.accent, boxShadow: `0 0 10px ${s.accent}` }} transition={{ duration: 0.4 }} />
          ))}
        </div>
        <motion.div className="rounded-full" style={{ width: 32, height: 4 }} animate={{ backgroundColor: s.accent }} transition={{ duration: 0.4 }} />
        <motion.span className="text-xs font-black tracking-widest" animate={{ color: s.accent }} transition={{ duration: 0.4 }}>{s.num}</motion.span>
      </motion.div>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200" style={{ overflow: 'visible' }}>
        {SERVICES.map((sv, i) => (
          <motion.line key={i} x1="100" y1="100" x2={lines[i].x2} y2={lines[i].y2} stroke={sv.accent}
            animate={{ opacity: i === active ? 1 : 0.12, strokeWidth: i === active ? 2 : 0.8 }} transition={{ duration: 0.5 }} />
        ))}
      </svg>
      {SERVICES.map((sv, i) => (
        <motion.div key={i} className="absolute rounded-full -translate-x-1/2 -translate-y-1/2"
          style={{ width: 12, height: 12, top: dotPos[i].top, left: dotPos[i].left }}
          animate={{ backgroundColor: i === active ? sv.accent : C.border, boxShadow: i === active ? `0 0 14px ${sv.accent}` : 'none', scale: i === active ? 1.4 : 1 }}
          transition={{ duration: 0.4 }} />
      ))}
    </div>
  )
})

// ── HUD service card (hero corners) ───────────────────────────────────────────
// corner: 0=top-left  1=top-right  2=bottom-left  3=bottom-right
const CORNER_STYLES: React.CSSProperties[] = [
  { top: '9%',     left: '1.5%' },
  { top: '9%',     right: '1.5%' },
  { bottom: '12%', left: '1.5%' },
  { bottom: '12%', right: '1.5%' },
]

function HudCard({
  s, delay, corner, active, visible,
}: {
  s: typeof SERVICES[0]
  delay: number
  corner: 0 | 1 | 2 | 3
  active: boolean
  visible: boolean
}) {
  const isRight = corner === 1 || corner === 3
  const { Icon } = s

  return (
    <motion.div
      className="absolute z-20"
      style={{ ...CORNER_STYLES[corner], pointerEvents: 'none' }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 12 }}
      transition={{ duration: 0.7, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}>

      <motion.div
        animate={{
          boxShadow: active
            ? `0 8px 32px ${s.glow}, 0 0 0 1px ${s.accent}80`
            : `0 4px 16px rgba(0,0,0,0.4), 0 0 0 1px ${C.border}`,
        }}
        transition={{ duration: 0.45 }}
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: active ? 'rgba(4,9,20,0.92)' : 'rgba(4,9,20,0.78)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          width: 'clamp(148px, 19vw, 210px)',
          padding: 'clamp(10px, 1.4vw, 18px)',
        }}>

        {/* Subtle inner border gradient when active */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{ opacity: active ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{
            background: `linear-gradient(135deg, ${s.accent}14 0%, transparent 60%)`,
          }} />

        {/* Icon row */}
        <div className={`flex items-center gap-2.5 mb-2.5 ${isRight ? 'flex-row-reverse' : ''}`}>
          <motion.div
            animate={{
              background: active ? `${s.accent}22` : `${s.accent}0D`,
              borderColor: active ? `${s.accent}55` : `${s.accent}28`,
            }}
            transition={{ duration: 0.4 }}
            className="flex-shrink-0 rounded-xl flex items-center justify-center"
            style={{
              width: 'clamp(28px, 2.4vw, 34px)',
              height: 'clamp(28px, 2.4vw, 34px)',
              border: `1px solid ${s.accent}28`,
            }}>
            <motion.div animate={{ color: active ? s.accent : `${s.accent}70` }} transition={{ duration: 0.4 }}>
              <Icon size={14} />
            </motion.div>
          </motion.div>

          <motion.h3
            animate={{ color: active ? C.white : '#8898AA' }}
            transition={{ duration: 0.4 }}
            className={`font-bold leading-tight ${isRight ? 'text-right' : ''}`}
            style={{ fontSize: 'clamp(11px, 1.1vw, 14px)' }}>
            {s.title}
          </motion.h3>
        </div>

        {/* Description — hidden on phones (< 480px), shown on larger screens */}
        <motion.p
          animate={{ color: active ? '#8898AA' : '#4A5568' }}
          transition={{ duration: 0.4 }}
          className={`hidden min-[480px]:block text-xs leading-relaxed ${isRight ? 'text-right' : ''}`}
          style={{ fontSize: 'clamp(10px, 0.85vw, 12px)' }}>
          {s.cardDesc}
        </motion.p>

        {/* Bottom accent line */}
        <motion.div
          className="absolute bottom-0 inset-x-0 h-[2px] rounded-full"
          animate={{
            background: active
              ? `linear-gradient(90deg, transparent, ${s.accent}, transparent)`
              : 'transparent',
            opacity: active ? 1 : 0,
          }}
          transition={{ duration: 0.4 }} />
      </motion.div>
    </motion.div>
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

// ── Main page ─────────────────────────────────────────────────────────────────
// corner→service index mapping: top-left=0, top-right=1, bottom-left=2, bottom-right=3
const CORNER_SERVICE = [0, 1, 2, 3] as const

export default function AiaSomnisPage() {
  const [heroVisible, setHeroVisible] = useState(false)
  const [activeService, setActiveService] = useState(0)
  const [scrolledPastHero, setScrolledPastHero] = useState(false)
  const [splineInView, setSplineInView] = useState(false)
  const [heroQuadrant, setHeroQuadrant] = useState<0|1|2|3|null>(null)
  const [soundOn, setSoundOn] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])
  const heroRef = useRef<HTMLElement>(null)

  const toggleSound = useCallback(() => {
    if (!audioRef.current) return
    if (soundOn) {
      audioRef.current.pause()
      setSoundOn(false)
    } else {
      audioRef.current.volume = 0.55
      audioRef.current.play().catch(() => {/* autoplay blocked — user gesture already happened, ignore */})
      setSoundOn(true)
    }
  }, [soundOn])

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolledPastHero(window.scrollY > window.innerHeight * 0.6)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setSplineInView(true) }, { threshold: 0.05 })
    if (heroRef.current) obs.observe(heroRef.current)
    return () => obs.disconnect()
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

  return (
    <div style={{ background: C.bg, color: C.white, overflowX: 'hidden' }}>

      {/* ── STICKY NAV ── */}
      <motion.nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-10"
        style={{ height: 64 }}
        animate={{ opacity: scrolledPastHero ? 1 : 0, y: scrolledPastHero ? 0 : -20 }}
        transition={{ duration: 0.4 }}>
        <div className="absolute inset-0 backdrop-blur-md"
          style={{ background: 'rgba(5,7,13,0.85)', borderBottom: `1px solid ${C.border}` }} />
        <div className="relative z-10 flex items-center justify-between w-full">
          <span className="font-black text-base tracking-widest" style={{ color: C.blue }}>AIA-SOMNIS</span>
          {/* Mobile: just contact link */}
          <a href="#contacto" className="md:hidden px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
            style={{ background: `linear-gradient(90deg, ${C.blue}, ${C.deep})`, color: C.white }}>
            Contacto
          </a>
          <div className="hidden md:flex items-center gap-6">
            {SERVICES.map((s, i) => (
              <button key={s.id} onClick={() => scrollTo(i)}
                className="text-xs font-semibold tracking-widest uppercase transition-all duration-300"
                style={{ color: i === activeService && scrolledPastHero ? s.accent : C.gray }}>
                {s.num}
              </button>
            ))}
            <a href="#contacto" className="px-5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
              style={{ background: `linear-gradient(90deg, ${C.blue}, ${C.deep})`, color: C.white }}>
              Contacto
            </a>
          </div>
        </div>
      </motion.nav>

      {/* ══════════ HERO — 4-corner HUD layout ══════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen overflow-hidden"
        style={{ background: `radial-gradient(ellipse at 50% 40%, #102B4A 0%, ${C.bg2} 45%, ${C.bg} 100%)` }}
        onMouseMove={onHeroMouseMove}
        onMouseLeave={() => { lastQuadrant.current = null; setHeroQuadrant(null) }}
        onTouchMove={onHeroTouchMove}
        onTouchEnd={() => { lastQuadrant.current = null; setHeroQuadrant(null) }}>

        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: `linear-gradient(${C.blue} 1px, transparent 1px), linear-gradient(90deg, ${C.blue} 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

        {/* Dynamic center glow that follows active quadrant card color */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
          animate={{
            background: heroQuadrant !== null
              ? `radial-gradient(circle, ${SERVICES[CORNER_SERVICE[heroQuadrant]].glow} 0%, transparent 65%)`
              : `radial-gradient(circle, rgba(0,184,255,0.07) 0%, transparent 65%)`
          }}
          transition={{ duration: 0.5 }} />

        {/* ── 4 CORNER CARDS — all screen sizes ── */}
        {([0, 1, 2, 3] as const).map(corner => (
          <HudCard
            key={corner}
            s={SERVICES[CORNER_SERVICE[corner]]}
            delay={300 + corner * 100}
            corner={corner}
            active={heroQuadrant === corner}
            visible={heroVisible}
          />
        ))}

        {/* ── CENTER: Robot + title + CTA ── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">

          {/* Badge */}
          <div className="mb-6 pointer-events-none px-2" style={fadeUp(0)}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold tracking-widest uppercase"
              style={{ background: 'rgba(0,184,255,0.08)', border: `1px solid rgba(0,184,255,0.25)`, color: C.blue, fontSize: 'clamp(9px, 2.3vw, 12px)' }}>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse" style={{ background: C.blue }} />
              Artificial Intelligence Agency
            </span>
          </div>

          {/* Spline robot */}
          <div style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
            transition: 'opacity 1.1s ease 300ms, transform 1.1s ease 300ms',
            width: 'clamp(220px, 55vw, 520px)',
            height: 'clamp(220px, 55vw, 520px)',
            position: 'relative',
            pointerEvents: 'auto',
          }}>
            {splineInView ? (
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
            {/* Gold ground glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-56 h-8 blur-2xl pointer-events-none"
              style={{ background: `radial-gradient(ellipse, ${C.gold}50, transparent)` }} />
          </div>

          {/* Title */}
          <div className="text-center px-4 -mt-6" style={fadeUp(200)}>
            <h1 className="font-black leading-none tracking-tight" style={{ fontSize: 'clamp(2.6rem,7vw,6rem)' }}>
              <span className="block" style={{ color: C.white }}>AIA</span>
              <span className="block" style={{
                backgroundImage: `linear-gradient(90deg, ${C.blue} 0%, ${C.deep} 55%, ${C.gold} 100%)`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>SOMNIS</span>
            </h1>
            <p className="text-sm mt-3 max-w-xs mx-auto" style={{ color: C.gray }}>
              Para <span style={{ color: C.white }}>eventos, marcas y cultura.</span>
            </p>
          </div>

          {/* CTAs — bottom-left */}
          <div style={fadeUp(600)}
            className="absolute bottom-12 left-6 md:left-12 flex flex-col sm:flex-row gap-3 pointer-events-auto z-20">
            <button onClick={() => scrollTo(0)}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm tracking-wide"
              style={{
                background: 'linear-gradient(135deg, #7B2FFF 0%, #1B3DFF 60%, #00B8FF 100%)',
                color: C.white,
                boxShadow: '0 0 36px rgba(123,47,255,0.45)',
              }}>
              Ver servicios <ArrowRight size={15} />
            </button>
            <a href="#contacto"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm tracking-wide"
              style={{ border: `1px solid ${C.border}`, color: C.gray, background: 'rgba(255,255,255,0.03)' }}>
              Contactar
            </a>
          </div>

        </div>

        {/* Horizontal scan line */}
        <div className="absolute left-0 right-0 pointer-events-none" style={{ top: '50%', height: 1, background: `linear-gradient(90deg, transparent, ${C.blue}20, ${C.blue}40, ${C.blue}20, transparent)` }} />

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

      {/* ══════════ PARTICLE TEXT TRANSITION ══════════ */}
      <section className="relative overflow-hidden" style={{ height: '55vh', background: C.bg }}>
        {/* top fade from hero */}
        <div className="absolute inset-x-0 top-0 h-24 pointer-events-none z-10"
          style={{ background: `linear-gradient(to bottom, ${C.bg2}, transparent)` }} />
        {/* bottom fade into services */}
        <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none z-10"
          style={{ background: `linear-gradient(to top, ${C.bg}, transparent)` }} />
        <ParticleText
          text="AIA SOMNIS"
          fontSize={110}
          colors={[C.blue, C.deep, '#7B2FFF', C.gold, C.white]}
          particleSize={2}
          mouseRadius={95}
          returnSpeed={0.07}
          density={4}
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
                        <span className="block text-xs font-black tracking-[0.3em] uppercase mb-2"
                          style={{ color: s.accent }}>{s.num}</span>
                        <h2 className="font-black leading-tight mb-2"
                          style={{ fontSize: 'clamp(1.5rem,2.8vw,2.5rem)', color: C.white }}>{s.title}</h2>
                        <p style={{ color: `${s.accent}CC`, fontSize: '0.9rem' }}>{s.subtitle}</p>
                      </div>

                      {/* description */}
                      <p className="leading-relaxed"
                        style={{ color: C.gray, fontSize: 'clamp(0.88rem,1vw,1rem)' }}>
                        {s.desc}
                      </p>

                      {/* tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {s.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, color: C.gray, fontSize: 11 }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* ── REEL COLUMN ── fills all remaining space, edge-to-edge */}
                    <div className={`flex-1 relative min-h-0 ${textRight ? 'md:order-1' : 'md:order-2'}`}>

                      <div className="absolute inset-0" style={{ background: '#02040B' }}>

                        {s.reel ? (
                          /* ── Real video: full-bleed, no ImageTrail ── */
                          <>
                            <video
                              src={s.reel} autoPlay muted loop playsInline
                              className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
                            {/* subtle vignette on text side */}
                            <div className="absolute inset-0 pointer-events-none" style={{
                              background: textRight
                                ? `linear-gradient(to left,  rgba(5,7,13,0.45), transparent 60%)`
                                : `linear-gradient(to right, rgba(5,7,13,0.45), transparent 60%)`,
                            }} />
                          </>
                        ) : (
                          /* ── No video yet: ImageTrail + mouse hint ── */
                          <ImageTrail images={TRAIL_IMAGES[i]} triggerDistance={38} maxImages={8} imageWidth={160} imageHeight={160} maxRotation={8}>
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 cursor-none select-none">

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

      {/* ══════════ PROYECTOS — FxSlider (immediately after services) ══════════ */}
      <section id="proyectos">
        <FxSlider items={PROJECTS} headerText="Proyectos seleccionados" duration={0.64} parallaxAmount={5} />
      </section>

      {/* ══════════ LÍNEAS DE LUZ ══════════ */}
      <section className="relative overflow-hidden" style={{ height: '70vh', background: C.bg }}>
        <ShaderCanvas />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <span className="block text-xs uppercase tracking-[0.3em] mb-4" style={{ color: C.blue }}>Creatividad · Tecnología · IA</span>
            <h2 className="font-black leading-none mb-6" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)', color: C.white }}>
              Experiencias que{' '}
              <span style={{ backgroundImage: `linear-gradient(90deg, ${C.blue}, ${C.gold})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>conectan</span>
            </h2>
            <p className="max-w-xl mx-auto text-base md:text-lg" style={{ color: C.gray }}>
              La fusión entre la experiencia artística de Girasomnis y la capacidad tecnológica de Immerso.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-24 pointer-events-none" style={{ background: `linear-gradient(to top, ${C.bg}, transparent)` }} />
      </section>

      {/* ══════════ ESCENA 3D — Gaussian Splat ══════════ */}
      <section className="relative flex flex-col items-center justify-center py-16 px-6" style={{ background: C.bg2 }}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`, backgroundSize: '80px 80px' }} />
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="text-center mb-10 relative z-10">
          <span className="text-xs uppercase tracking-[0.3em] mb-4 block" style={{ color: C.gold }}>Experiencia Interactiva</span>
          <h2 className="font-black mb-2" style={{ fontSize: 'clamp(2rem,5vw,4rem)', color: C.white }}>Escena 3D</h2>
          <p className="text-sm" style={{ color: C.gray }}>
            Pon tu archivo <code style={{ color: C.blue }}>.spz</code> en <code style={{ color: C.blue }}>/public/scene.spz</code> para verlo aquí
          </p>
        </motion.div>

        <div className="relative w-full max-w-6xl mx-auto rounded-3xl overflow-hidden"
          style={{ height: '80vh', border: `1px solid ${C.border}` }}>
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center" style={{ background: '#05070D' }}>
              <div className="w-10 h-10 rounded-full border-2 border-transparent animate-spin"
                style={{ borderTopColor: '#00B8FF', borderRightColor: 'rgba(0,184,255,0.2)' }} />
            </div>
          }>
            <GaussianSplatViewer src={SPZ_FILE} className="w-full h-full" />
          </Suspense>
          {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
            <div key={i} className={`absolute ${pos} w-8 h-8 pointer-events-none z-10`}
              style={{ borderTop: i < 2 ? `2px solid ${C.gold}` : 'none', borderBottom: i >= 2 ? `2px solid ${C.gold}` : 'none', borderLeft: i % 2 === 0 ? `2px solid ${C.gold}` : 'none', borderRight: i % 2 !== 0 ? `2px solid ${C.gold}` : 'none' }} />
          ))}
        </div>
        <p className="mt-6 text-xs text-center" style={{ color: C.border }}>
          Arrastra para orbitar · Scroll para zoom · Click derecho para desplazar
        </p>
      </section>

      {/* ══════════ ABOUT US ══════════ */}
      <section className="relative py-32 px-6" style={{ background: C.bg }}>
        <div className="max-w-6xl mx-auto">
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
                {['Girasomnis', 'Immerso'].map((brand, i) => (
                  <div key={brand} className="flex-1 rounded-2xl p-6 text-center"
                    style={{ background: 'rgba(7,17,32,0.8)', border: `1px solid ${C.border}` }}>
                    <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${i === 0 ? C.blue : C.gold}, ${i === 0 ? C.deep : C.goldSoft})` }}>
                      <span className="font-black text-white text-sm">{brand[0]}</span>
                    </div>
                    <span className="font-bold text-sm" style={{ color: C.white }}>{brand}</span>
                    <span className="text-xs mt-1 block" style={{ color: C.gray }}>{i === 0 ? 'Arte & Creatividad' : 'Tech & Software'}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[['20+', 'años de experiencia'], ['4', 'líneas de servicio'], ['3', 'oficinas']].map(([n, l]) => (
                  <div key={l} className="rounded-xl p-4 text-center"
                    style={{ background: 'rgba(0,184,255,0.05)', border: `1px solid ${C.border}` }}>
                    <div className="font-black text-2xl mb-1" style={{ color: C.blue }}>{n}</div>
                    <div className="text-xs" style={{ color: C.gray }}>{l}</div>
                  </div>
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

      {/* ══════════ TEAM ══════════ */}
      <section className="py-24 px-6" style={{ background: C.bg2, borderTop: `1px solid ${C.border}` }}>
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
                  <div className="absolute bottom-0 inset-x-0 h-1" style={{ background: `linear-gradient(90deg, ${C.blue}, ${C.gold})` }} />
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
                  backgroundImage: `linear-gradient(90deg, ${C.blue}, ${C.gold})`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>proyecto?</span>
              </h2>
              <p className="text-base md:text-lg mb-10 max-w-md" style={{ color: C.gray, lineHeight: 1.7 }}>
                Cuéntanos tu idea. Transformamos creatividad, tecnología e inteligencia artificial en experiencias que impactan.
              </p>
              <a href="mailto:info@girasomnis.com"
                className="inline-flex items-center gap-3 px-9 py-4 rounded-full font-bold text-base transition-all duration-300 mb-10"
                style={{
                  background: `linear-gradient(90deg, ${C.blue}, ${C.deep})`,
                  color: C.white,
                  boxShadow: `0 0 40px rgba(0,184,255,0.3)`,
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

            {/* RIGHT: 3D magazine */}
            <motion.div
              className="flex justify-center items-center"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}>
              {/* Scale down on mobile so it always fits the screen */}
              <div style={{ transform: 'scale(var(--mag-scale, 1))', transformOrigin: 'center top' }}
                className="[--mag-scale:0.82] sm:[--mag-scale:0.92] md:[--mag-scale:1]">
                <Magazine3D
                  cover={MAG_COVER}
                  pages={MAG_PAGES}
                  width={250}
                  height={340}
                  accent={C.blue}
                  title="AIA-SOMNIS"
                  subtitle="Portfolio 2024"
                />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── AUDIO + SOUND TOGGLE ── */}
      <audio
        ref={audioRef}
        src="/magnific-hand-covers-bruise.mp3"
        loop
        preload="none"
      />
      <motion.button
        onClick={toggleSound}
        className="fixed z-50 flex items-center gap-2 rounded-full font-bold text-xs tracking-widest uppercase cursor-pointer"
        style={{
          bottom: '2rem',
          right: '1.5rem',
          padding: '10px 18px',
          background: soundOn
            ? `linear-gradient(135deg, ${C.blue}22, ${C.deep}44)`
            : 'rgba(5,7,13,0.82)',
          border: `1px solid ${soundOn ? C.blue : C.border}`,
          color: soundOn ? C.blue : C.gray,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
        animate={{
          boxShadow: soundOn
            ? [`0 0 0px ${C.blue}`, `0 0 18px ${C.blue}88`, `0 0 0px ${C.blue}`]
            : '0 4px 20px rgba(0,0,0,0.5)',
        }}
        transition={soundOn ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}>
        {soundOn ? <Volume2 size={15} /> : <VolumeX size={15} />}
        <span>{soundOn ? 'SONIDO ON' : 'SONIDO OFF'}</span>
      </motion.button>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-6" style={{ borderTop: `1px solid ${C.border}`, background: C.bg }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-black tracking-widest" style={{ backgroundImage: `linear-gradient(90deg, ${C.blue}, ${C.gold})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>AIA-SOMNIS</span>
            <span className="text-xs" style={{ color: C.border }}>by Girasomnis × Immerso</span>
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
          <span className="text-xs" style={{ color: C.border }}>© 2025 AIA-SOMNIS · Madrid · Valencia · Barcelona</span>
        </div>
      </footer>
    </div>
  )
}
