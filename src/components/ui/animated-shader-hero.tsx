import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { ArrowRight, Bot, Globe, Sparkles } from 'lucide-react'

const Spline = lazy(() => import('@splinetool/react-spline'))
const SPLINE_SCENE = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode'

// ── WebGL shader source ──────────────────────────────────────────────────────

const VERT = /* glsl */ `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`

const FRAG = /* glsl */ `
  precision highp float;

  uniform float u_time;
  uniform vec2  u_resolution;

  // ── Noise / FBM ──────────────────────────────────────────────────────────
  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(hash2(i + vec2(0,0)), f - vec2(0,0)),
          dot(hash2(i + vec2(1,0)), f - vec2(1,0)), u.x),
      mix(dot(hash2(i + vec2(0,1)), f - vec2(0,1)),
          dot(hash2(i + vec2(1,1)), f - vec2(1,1)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0; float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = rot * p * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  // ── Cloud / nebula background ─────────────────────────────────────────────
  float clouds(vec2 p) {
    float f = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 4; i++) {
      f += amp * noise(p);
      p *= 2.1;
      amp *= 0.5;
    }
    return f * 0.5 + 0.5;
  }

  void main() {
    vec2 FC = gl_FragCoord.xy;
    vec2 R  = u_resolution;
    float T = u_time;

    float mn = min(R.x, R.y);

    // Centered UV [-0.5, 0.5]
    vec2 uv = (FC - 0.5 * R) / mn;
    vec2 st = uv * vec2(2.0, 1.0);

    // ── Background nebula ────────────────────────────────────────────────
    float bg = clouds(vec2(st.x + T * 0.5, -st.y));

    // Dark purple/indigo base from FBM
    vec2 q = vec2(fbm(uv * 2.5 + vec2(0.0)),
                  fbm(uv * 2.5 + vec2(5.2, 1.3)));
    vec2 r = vec2(fbm(uv * 2.5 + 4.0 * q + vec2(1.7 + T * 0.1, 9.2)),
                  fbm(uv * 2.5 + 4.0 * q + vec2(8.3, 2.8 + T * 0.1)));
    float f = fbm(uv * 2.5 + 4.0 * r);

    // Cyan/green base palette — near-black teal background (-40% intensity vs original)
    vec3 colA = vec3(0.01, 0.03, 0.05);   // near-black teal
    vec3 colB = vec3(0.02, 0.08, 0.10);   // dark cyan
    vec3 colC = vec3(0.00, 0.12, 0.12);   // deep teal
    vec3 colD = vec3(0.01, 0.06, 0.08);   // muted cyan-blue

    vec3 col = mix(colA, colB, clamp(f * f * 4.0, 0.0, 1.0));
    col = mix(col, colC, clamp(length(q), 0.0, 1.0));
    col = mix(col, colD, clamp(r.x + r.y, 0.0, 1.0));

    // Nebula tint — cyan/green (#00d4ff ≈ vec3(0,0.83,1)) reduced 40%
    col = mix(col, vec3(bg * 0.00, bg * 0.10, bg * 0.13), 0.35);

    // ── Racing light particles (cyan/neon-green palette) ─────────────────
    vec2 puv = uv;
    puv *= 1.0 - 0.3 * (sin(T * 0.2) * 0.5 + 0.5);

    for (float i = 1.0; i < 13.0; i++) {
      puv += 0.1 * cos(i * vec2(0.1 + 0.01 * i, 0.8) + i * i + T * 0.5 + 0.1 * puv.x);

      vec2  pp = puv;
      float d  = length(pp);

      // Cyan/green particle: tint towards #00d4ff (0, 0.831, 1) and neon green (0.18, 1, 0.5)
      float t = fract(sin(i * 127.1) * 43758.5);
      vec3 pCol = mix(
        vec3(0.0,  0.83, 1.0),   // #00d4ff cyan
        vec3(0.18, 1.0,  0.45),  // neon green
        t
      ) * 2.0;

      // Particle core — soft contribution so clusters don't blow out
      col += 0.0022 / d * pCol;

      // Halo trail — reduced to avoid pile-up glow
      float b = noise(i + pp + bg * 1.731);
      col += 0.003 * b / length(max(pp, vec2(b * pp.x * 0.02, pp.y))) * pCol;

      // Depth-fade into dark teal nebula
      col = mix(col, vec3(bg * 0.00, bg * 0.09, bg * 0.12), d * 0.55);
    }

    // ── Vignette ─────────────────────────────────────────────────────────
    vec2 vig = (FC / R) * (1.0 - FC / R);
    col *= pow(vig.x * vig.y * 16.0, 0.3);

    // Reinhard tone-mapping — compresses bright cluster spots instead of hard-clipping
    col = col / (col + 0.6);

    gl_FragColor = vec4(col, 1.0);
  }
`

// ── WebGL helpers ─────────────────────────────────────────────────────────────

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader))
  }
  return shader
}

function createProgram(gl: WebGLRenderingContext): WebGLProgram {
  const prog = gl.createProgram()!
  gl.attachShader(prog, compileShader(gl, gl.VERTEX_SHADER, VERT))
  gl.attachShader(prog, compileShader(gl, gl.FRAGMENT_SHADER, FRAG))
  gl.linkProgram(prog)
  return prog
}

// ── ShaderCanvas component ────────────────────────────────────────────────────

function ShaderCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl')
    if (!gl) return

    const prog = createProgram(gl)
    gl.useProgram(prog)

    // Full-screen quad
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)

    const posLoc = gl.getAttribLocation(prog, 'a_position')
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    const uTime = gl.getUniformLocation(prog, 'u_time')
    const uRes  = gl.getUniformLocation(prog, 'u_resolution')

    let rafId: number
    let startTime = performance.now()

    function resize() {
      canvas!.width  = canvas!.clientWidth
      canvas!.height = canvas!.clientHeight
      gl!.viewport(0, 0, canvas!.width, canvas!.height)
    }

    function draw() {
      const elapsed = (performance.now() - startTime) / 1000
      gl!.uniform1f(uTime, elapsed)
      gl!.uniform2f(uRes, canvas!.width, canvas!.height)
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4)
      rafId = requestAnimationFrame(draw)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()
    draw()

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden
    />
  )
}

// ── Feature pills ─────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: Globe, label: 'Videomapping & DanceMapping' },
  { icon: Sparkles, label: 'Webs Premium' },
  { icon: Bot, label: 'Avatares Interactivos' },
]

// ── Props ─────────────────────────────────────────────────────────────────────

interface AnimatedShaderHeroProps {
  headline1?: string
  headline2?: string
  subtitle?: string
}

// ── Main export ───────────────────────────────────────────────────────────────

export function AnimatedShaderHero({
  headline1 = 'NEXUS',
  headline2 = '360',
  subtitle  = 'Experiencias inmersivas. Soluciones 360° que transforman eventos, espacios y marcas.',
}: AnimatedShaderHeroProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 120)
    return () => clearTimeout(t)
  }, [])

  const fadeUp = (delay: number): React.CSSProperties => ({
    opacity:   visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(32px)',
    transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
  })

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#07040f]">

      {/* ── WebGL background ── */}
      <ShaderCanvas />

      {/* Noise texture overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'300\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'300\' height=\'300\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-28 grid lg:grid-cols-2 gap-20 items-center">

        {/* Left — copy */}
        <div className="space-y-8">

          {/* Badge */}
          <div style={fadeUp(0)}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/70 text-sm font-medium backdrop-blur-sm">
              <Sparkles className="size-3.5 text-violet-400" />
              Soluciones digitales 360
            </span>
          </div>

          {/* Headline */}
          <div style={fadeUp(160)}>
            <h1 className="font-black leading-none tracking-tighter">
              <span
                className="block bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #22d3ee 0%, #a78bfa 50%, #ec4899 100%)',
                  fontSize: 'clamp(5rem, 14vw, 10rem)',
                }}
              >
                {headline1}
              </span>
              <span
                className="block text-white"
                style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', marginTop: '-0.1em' }}
              >
                {headline2}
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <div style={fadeUp(320)}>
            <p className="text-lg text-white/55 leading-relaxed max-w-lg">
              {subtitle}
            </p>
          </div>

          {/* Feature pills */}
          <div style={fadeUp(480)} className="flex flex-wrap gap-3">
            {FEATURES.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-sm text-white/80 backdrop-blur-sm"
              >
                <Icon className="size-4 text-violet-400" />
                {label}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div style={fadeUp(640)} className="flex flex-wrap gap-3">
            <button
              className="inline-flex items-center gap-2 px-7 h-11 text-base font-semibold rounded-lg text-white cursor-pointer border-0 outline-none"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                boxShadow: '0 0 24px rgba(124,58,237,0.45), 0 2px 8px rgba(0,0,0,0.4)',
              }}
            >
              Empieza Ahora
              <ArrowRight className="size-4" />
            </button>
            <button
              className="inline-flex items-center gap-2 px-7 h-11 text-base font-semibold rounded-lg text-white/80 cursor-pointer border border-white/15 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors outline-none"
            >
              Ver Proyectos
            </button>
          </div>

          {/* Trust line */}
          <div style={fadeUp(800)} className="text-sm text-white/35 font-mono tracking-wider uppercase">
            Girasomnis · IMMERSO · Madrid · Valencia
          </div>
        </div>

        {/* Right — Spline robot */}
        <div
          style={{
            opacity:   visible ? 1 : 0,
            transform: visible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.96)',
            transition: 'opacity 1s ease 500ms, transform 1s ease 500ms',
          }}
          className="relative flex items-center justify-center"
        >
          <div className="w-full" style={{ height: 'clamp(280px, 50vw, 520px)' }}>
            <Suspense fallback={
              <div className="flex items-center justify-center w-full h-full">
                <div className="size-8 rounded-full border-2 border-transparent animate-spin"
                  style={{ borderTopColor: '#00d4ff', borderRightColor: 'rgba(0,212,255,0.2)' }} />
              </div>
            }>
              <Spline scene={SPLINE_SCENE} style={{ width: '100%', height: '100%' }} />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  )
}
