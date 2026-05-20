import { Suspense, lazy, useEffect, useRef, useState } from 'react'

// Spline is only imported once the section enters the viewport
const Spline = lazy(() => import('@splinetool/react-spline'))

const SCENE_URL = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode'

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full h-full">
      <div
        className="size-10 rounded-full border-2 border-transparent animate-spin"
        style={{ borderTopColor: '#00d4ff', borderRightColor: 'rgba(0,212,255,0.25)' }}
      />
      <span className="font-mono text-xs tracking-widest text-[#00d4ff]/40 uppercase">
        Cargando escena 3D…
      </span>
    </div>
  )
}

export function SplineScene() {
  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  // Only load Spline when section enters viewport — avoids blocking initial load
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.05 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: '100svh' }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,30,40,0.98) 0%, #010305 100%)',
        }}
      />

      {/* Cyan glow */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(0,212,255,0.10) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Section header — lightweight, always rendered */}
      <div className="relative z-10 flex flex-col items-center pt-16 pb-4 px-6 text-center">
        <span
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-medium mb-5"
          style={{
            borderColor: 'rgba(0,212,255,0.25)',
            background: 'rgba(0,212,255,0.06)',
            color: 'rgba(0,212,255,0.85)',
          }}
        >
          <span className="size-1.5 rounded-full bg-[#00d4ff] animate-pulse" />
          Tecnología IA Interactiva
        </span>

        <h2
          className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-3"
          style={{ textShadow: '0 0 40px rgba(0,212,255,0.15)' }}
        >
          Tu Agente IA,{' '}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(135deg, #00d4ff 0%, #00ff88 100%)' }}
          >
            Siempre Activo
          </span>
        </h2>

        <p className="text-white/40 max-w-md text-sm leading-relaxed">
          Automatiza atención al cliente, ventas y soporte con agentes de IA que trabajan 24/7.
        </p>
      </div>

      {/* 3D canvas — rendered only when in viewport */}
      <div
        className="absolute inset-0 top-[180px]"
        style={{ pointerEvents: inView ? 'auto' : 'none' }}
      >
        {inView ? (
          <Suspense fallback={<Spinner />}>
            <Spline scene={SCENE_URL} style={{ width: '100%', height: '100%' }} />
          </Suspense>
        ) : (
          <Spinner />
        )}
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 inset-x-0 h-20 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #010305 0%, transparent 100%)' }}
      />
    </section>
  )
}
