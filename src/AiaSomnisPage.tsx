import { Suspense, lazy, memo, useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ImageTrail } from '@/components/ui/image-trail'
import { FxSlider, type SliderItem } from '@/components/ui/fx-slider'
import { Mail, MapPin, ChevronDown, ArrowRight } from 'lucide-react'

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
const SERVICES = [
  {
    num: '01', id: 'avatares',
    title: 'Avatares IA',
    subtitle: 'para eventos, ferias y espacios físicos',
    desc: 'Creamos avatares conversacionales personalizados que pueden atender al público, presentar contenidos, responder preguntas, hablar en varios idiomas y captar leads en tiempo real.',
    tags: ['Ferias y exposiciones', 'Centros comerciales', 'Eventos corporativos', 'Presentador virtual', 'Multilingüe', 'Conectado a marca'],
    accent: '#00B8FF', glow: 'rgba(0,184,255,0.3)',
  },
  {
    num: '02', id: 'instalaciones',
    title: 'Instalaciones interactivas',
    subtitle: 'con Inteligencia Artificial',
    desc: 'Diseñamos experiencias donde el público interactúa con cámaras, pantallas, sensores y sistemas generativos, creando contenido visual en tiempo real.',
    tags: ['Cámara + IA', 'Visuales reactivos', 'Photocalls inteligentes', 'Tótems interactivos', 'Holográfico', '360° inmersivo'],
    accent: '#22D3FF', glow: 'rgba(34,211,255,0.28)',
  },
  {
    num: '03', id: 'visuales',
    title: 'Visuales generativos',
    subtitle: 'y producción audiovisual con IA',
    desc: 'Creamos imágenes, animaciones y mundos visuales con IA, combinando dirección artística, 3D, motion graphics y producción audiovisual profesional.',
    tags: ['Campañas publicitarias', 'Pantallas LED', 'Videomapping IA', 'Animaciones generativas', 'Conciertos y espectáculos'],
    accent: '#FFD42A', glow: 'rgba(255,212,42,0.22)',
  },
  {
    num: '04', id: 'digital',
    title: 'Desarrollo digital, IA',
    subtitle: 'y automatizaciones',
    desc: 'Creamos soluciones digitales con IA para automatizar procesos, captar leads, mejorar la atención al cliente y crear experiencias web más inteligentes.',
    tags: ['Webs con IA', 'Asistentes virtuales', 'Automatización de procesos', 'CRM integration', 'Experiencias 3D web'],
    accent: '#F6B93B', glow: 'rgba(246,185,59,0.22)',
  },
]

const TEAM = [
  { name: 'Paco Gramaje',      role: 'Creative Director', initials: 'PG' },
  { name: 'Leonardo Bautista', role: 'Director Creativo', initials: 'LB' },
  { name: 'Anto Loriso',       role: 'CTO',               initials: 'AL' },
  { name: 'Martin Julià',      role: '3D & IA Developer', initials: 'MJ' },
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
  { top: '10%',    left: '3%'  },
  { top: '10%',    right: '3%' },
  { bottom: '18%', left: '3%'  },
  { bottom: '18%', right: '3%' },
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

  return (
    <motion.div
      className="absolute z-20"
      style={{ ...CORNER_STYLES[corner], pointerEvents: 'auto' }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.92 }}
      transition={{ duration: 0.6, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}>
      <motion.div
        animate={{
          boxShadow: active ? `0 0 40px ${s.glow}, 0 0 80px ${s.glow}` : '0 0 0px transparent',
          borderColor: active ? s.accent : C.border,
        }}
        transition={{ duration: 0.4 }}
        className="relative p-4 rounded-xl"
        style={{
          background: active ? `rgba(5,10,20,0.85)` : 'rgba(5,10,20,0.65)',
          backdropFilter: 'blur(16px)',
          width: 190,
          border: `1px solid ${C.border}`,
        }}>
        {/* HUD corner brackets */}
        <motion.div animate={{ borderColor: active ? s.accent : `${s.accent}50` }} transition={{ duration: 0.4 }}
          className="absolute top-0 left-0 w-3 h-3" style={{ borderTop: `1.5px solid ${s.accent}50`, borderLeft: `1.5px solid ${s.accent}50` }} />
        <motion.div animate={{ borderColor: active ? s.accent : `${s.accent}50` }} transition={{ duration: 0.4 }}
          className="absolute top-0 right-0 w-3 h-3" style={{ borderTop: `1.5px solid ${s.accent}50`, borderRight: `1.5px solid ${s.accent}50` }} />
        <motion.div animate={{ borderColor: active ? s.accent : `${s.accent}50` }} transition={{ duration: 0.4 }}
          className="absolute bottom-0 left-0 w-3 h-3" style={{ borderBottom: `1.5px solid ${s.accent}50`, borderLeft: `1.5px solid ${s.accent}50` }} />
        <motion.div animate={{ borderColor: active ? s.accent : `${s.accent}50` }} transition={{ duration: 0.4 }}
          className="absolute bottom-0 right-0 w-3 h-3" style={{ borderBottom: `1.5px solid ${s.accent}50`, borderRight: `1.5px solid ${s.accent}50` }} />

        <div className={`flex items-start gap-3 ${isRight ? 'flex-row-reverse' : ''}`}>
          <motion.div animate={{ background: active ? `${s.accent}28` : `${s.accent}10`, borderColor: active ? `${s.accent}70` : `${s.accent}30` }}
            transition={{ duration: 0.4 }}
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
            style={{ border: `1px solid ${s.accent}30` }}>
            <motion.span animate={{ color: active ? s.accent : `${s.accent}80` }} transition={{ duration: 0.4 }}
              className="font-black text-xs">{s.num}</motion.span>
          </motion.div>
          <div className={isRight ? 'text-right' : ''}>
            <motion.h3 animate={{ color: active ? C.white : C.gray }} transition={{ duration: 0.4 }}
              className="font-bold text-sm leading-tight mb-1">{s.title}</motion.h3>
            <motion.p animate={{ color: active ? C.gray : `${C.gray}60` }} transition={{ duration: 0.4 }}
              className="text-xs leading-snug">{s.subtitle}</motion.p>
          </div>
        </div>

        {/* Active scan line */}
        <motion.div
          animate={{ scaleX: active ? 1 : 0, opacity: active ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute bottom-0 inset-x-0 h-px rounded-full"
          style={{ background: `linear-gradient(90deg, transparent, ${s.accent}, transparent)`, transformOrigin: 'center' }} />
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
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])
  const heroRef = useRef<HTMLElement>(null)

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
  const onHeroMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const isRight = e.clientX >= cx
    const isBottom = e.clientY >= cy
    const q = (!isRight && !isBottom) ? 0 : (isRight && !isBottom) ? 1 : (!isRight && isBottom) ? 2 : 3
    if (q !== lastQuadrant.current) { lastQuadrant.current = q; setHeroQuadrant(q as 0|1|2|3) }
  }, [])

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
          <span className="font-black text-lg tracking-widest" style={{ color: C.blue }}>AIA-SOMNIS</span>
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
        onMouseLeave={() => setHeroQuadrant(null)}>

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

        {/* ── 4 CORNER CARDS ── */}
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
          <div className="mb-6 pointer-events-none" style={fadeUp(0)}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
              style={{ background: 'rgba(0,184,255,0.08)', border: `1px solid rgba(0,184,255,0.25)`, color: C.blue }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.blue }} />
              Artificial Intelligence Agency
            </span>
          </div>

          {/* Spline robot */}
          <div style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
            transition: 'opacity 1.1s ease 300ms, transform 1.1s ease 300ms',
            width: 'clamp(280px, 38vw, 520px)',
            height: 'clamp(280px, 38vw, 520px)',
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

          {/* CTAs */}
          <div style={fadeUp(600)} className="flex flex-wrap gap-4 justify-center mt-7 pointer-events-auto">
            <button onClick={() => scrollTo(0)} className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-sm tracking-wide"
              style={{ background: `linear-gradient(90deg, ${C.blue}, ${C.deep})`, color: C.white, boxShadow: `0 0 30px rgba(0,184,255,0.35)` }}>
              Ver servicios <ArrowRight size={16} />
            </button>
            <a href="#contacto" className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-sm tracking-wide"
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

      {/* ══════════ SERVICIOS ══════════ */}
      <section id="servicios">
        <div className="flex" style={{ background: C.bg }}>
          {/* LEFT: sticky robot eye */}
          <div className="hidden lg:flex flex-col items-center justify-center gap-8 sticky top-0 h-screen"
            style={{ width: '34%', flexShrink: 0, borderRight: `1px solid ${C.border}` }}>
            <RobotEye active={activeService} />
            <div className="flex flex-col gap-4 w-40">
              {SERVICES.map((s, i) => (
                <motion.button key={s.id} className="flex items-center gap-3 text-left"
                  onClick={() => scrollTo(i)} animate={{ opacity: i === activeService ? 1 : 0.35 }}>
                  <motion.div className="flex-shrink-0 rounded-full" style={{ width: 6, height: 6 }}
                    animate={{ backgroundColor: i === activeService ? s.accent : C.border, boxShadow: i === activeService ? `0 0 8px ${s.accent}` : 'none' }}
                    transition={{ duration: 0.4 }} />
                  <div>
                    <div className="text-xs font-black tracking-widest" style={{ color: i === activeService ? s.accent : C.gray }}>{s.num}</div>
                    <div className="text-xs leading-tight" style={{ color: i === activeService ? C.white : C.gray }}>{s.title}</div>
                  </div>
                </motion.button>
              ))}
            </div>
            <span className="text-xs tracking-widest uppercase" style={{ color: C.border }}>Girasomnis × Immerso</span>
          </div>

          {/* RIGHT: 4 service panels — stacked: text top · reel centered */}
          <div className="flex-1 min-w-0">
            {SERVICES.map((s, i) => (
              <div key={s.id} ref={el => { sectionRefs.current[i] = el }}
                className="min-h-screen flex flex-col relative"
                style={{ padding: 0 }}>

                {/* Glow bg */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at 50% 60%, ${s.glow} 0%, transparent 65%)`,
                    opacity: i === activeService ? 1 : 0,
                    transition: 'opacity 0.6s ease',
                  }} />

                {/* Left accent bar */}
                <div className="absolute left-0 top-1/4 bottom-1/4 w-0.5 rounded-full pointer-events-none"
                  style={{
                    background: `linear-gradient(to bottom, transparent, ${s.accent}, transparent)`,
                    opacity: i === activeService ? 1 : 0,
                    transform: `scaleY(${i === activeService ? 1 : 0})`,
                    transformOrigin: 'center',
                    transition: 'opacity 0.5s ease, transform 0.5s ease',
                  }} />

                {/* ── TOP: compact service info ── */}
                <div className="relative z-10 flex items-start gap-5"
                  style={{ padding: 'clamp(1.8rem, 3vw, 3rem) clamp(1.8rem, 3vw, 3rem) 1.2rem' }}>
                  {/* Big number watermark */}
                  <span className="font-black leading-none select-none flex-shrink-0"
                    style={{
                      fontSize: 'clamp(3rem,5vw,5rem)',
                      color: s.accent,
                      opacity: i === activeService ? 0.15 : 0.05,
                      letterSpacing: '-0.05em',
                      transition: 'opacity 0.5s ease',
                    }}>{s.num}</span>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-black leading-tight mb-1"
                      style={{ fontSize: 'clamp(1.4rem,2.5vw,2.2rem)', color: C.white }}>{s.title}</h2>
                    <p className="text-sm mb-3" style={{ color: s.accent }}>{s.subtitle}</p>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: C.gray, maxWidth: 480 }}>{s.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {s.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, color: C.gray }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── CENTER: full-width dark reel area ── */}
                {/* NO overflow-hidden — position:fixed trail images must escape to viewport */}
                <div className="flex-1 relative mx-5 mb-5"
                  style={{ minHeight: 340, borderRadius: 16, background: 'rgba(2,4,11,0.98)', border: `1px solid ${C.border}` }}>
                  {/* Accent corner glow when active */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-32 pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse at bottom, ${s.glow} 0%, transparent 70%)`,
                      opacity: i === activeService ? 1 : 0,
                      transition: 'opacity 0.6s ease',
                    }} />

                  <ImageTrail
                    images={TRAIL_IMAGES[i]}
                    triggerDistance={38}
                    maxImages={8}
                    imageWidth={160}
                    imageHeight={160}
                    maxRotation={8}
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center cursor-none select-none">
                      {/* Play icon */}
                      <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                        style={{ background: `${s.accent}16`, border: `1px solid ${s.accent}30` }}>
                        <div className="w-0 h-0" style={{
                          borderTop: '8px solid transparent', borderBottom: '8px solid transparent',
                          borderLeft: `14px solid ${s.accent}`, marginLeft: 3,
                        }} />
                      </div>
                      <span className="text-xs uppercase tracking-[0.3em]" style={{ color: `${s.accent}55` }}>
                        Reel {s.num}
                      </span>
                      {/* Corner HUD brackets */}
                      {[
                        'top-4 left-4',
                        'top-4 right-4',
                        'bottom-4 left-4',
                        'bottom-4 right-4',
                      ].map((pos, ci) => (
                        <div key={ci} className={`absolute ${pos} w-5 h-5 pointer-events-none`}
                          style={{
                            borderTop:    ci < 2     ? `1px solid ${s.accent}35` : 'none',
                            borderBottom: ci >= 2    ? `1px solid ${s.accent}35` : 'none',
                            borderLeft:   ci % 2 === 0 ? `1px solid ${s.accent}35` : 'none',
                            borderRight:  ci % 2 !== 0 ? `1px solid ${s.accent}35` : 'none',
                          }} />
                      ))}
                    </div>
                  </ImageTrail>
                </div>
              </div>
            ))}
          </div>
        </div>
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
                className="rounded-2xl p-6 text-center cursor-default transition-all duration-300"
                style={{ background: 'rgba(5,7,13,0.8)', border: `1px solid ${C.border}` }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = C.blue}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = C.border}>
                <div className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${C.bg2}, #0D1829)`, border: `1px solid ${C.border}` }}>
                  <span className="font-black text-xl" style={{ color: C.blue }}>{member.initials}</span>
                  <div className="absolute bottom-0 inset-x-0 h-1" style={{ background: `linear-gradient(90deg, ${C.blue}, ${C.gold})` }} />
                </div>
                <h3 className="font-bold text-sm mb-1" style={{ color: C.white }}>{member.name}</h3>
                <span className="text-xs uppercase tracking-wide" style={{ color: C.gray }}>{member.role}</span>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-xs mt-8" style={{ color: C.border }}>Fotos próximamente</p>
        </div>
      </section>

      {/* ══════════ CONTACTO ══════════ */}
      <section id="contacto" className="relative py-32 px-6 overflow-hidden" style={{ background: C.bg }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, rgba(0,184,255,0.06) 0%, transparent 70%)` }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <span className="text-xs uppercase tracking-[0.3em] mb-6 block" style={{ color: C.gold }}>Hablemos</span>
            <h2 className="font-black leading-none mb-6" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)', color: C.white }}>
              ¿Tienes un{' '}
              <span style={{ backgroundImage: `linear-gradient(90deg, ${C.blue}, ${C.gold})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>proyecto?</span>
            </h2>
            <p className="text-lg mb-12 max-w-xl mx-auto" style={{ color: C.gray }}>
              Cuéntanos tu idea. Transformamos creatividad, tecnología e inteligencia artificial en experiencias que impactan.
            </p>
            <a href="mailto:info@girasomnis.com"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-base transition-all duration-300"
              style={{ background: `linear-gradient(90deg, ${C.blue}, ${C.deep})`, color: C.white, boxShadow: `0 0 40px rgba(0,184,255,0.3)` }}>
              <Mail size={18} /> info@girasomnis.com
            </a>
            <div className="flex justify-center gap-8 mt-12">
              {['Madrid', 'Valencia', 'Barcelona'].map(city => (
                <div key={city} className="flex items-center gap-2">
                  <MapPin size={14} style={{ color: C.blue }} />
                  <span className="text-sm font-semibold" style={{ color: C.gray }}>{city}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

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
