import { useEffect, useRef, useState } from 'react'
import { TextScramble } from '@/components/core/text-scramble'

const SERVICES = [
  {
    code: '01',
    title: 'VIDEOMAPPING',
    subtitle: 'Proyecciones arquitectónicas y DanceMapping',
    desc: 'Transformamos cualquier superficie en arte vivo. Espectáculos visuales que fusionan tecnología y creatividad para eventos únicos.',
    tag: 'LIVE EXPERIENCE',
  },
  {
    code: '02',
    title: 'AVATARES IA',
    subtitle: 'Asistentes virtuales MetaHuman',
    desc: 'Avatares interactivos con IA para eventos, hoteles y retail. Tecnología de última generación que humaniza la experiencia digital.',
    tag: 'METAHUMAN TECH',
  },
  {
    code: '03',
    title: 'DISEÑO DIGITAL',
    subtitle: 'Web · SEO · IA · 3D Inmersivo',
    desc: 'Soluciones digitales completas: webs premium, automatizaciones con IA y experiencias inmersivas en 3D para marcas que quieren destacar.',
    tag: 'FULL STACK',
  },
]

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return { ref, inView }
}

export function NexusSection() {
  const { ref: headRef, inView: headVisible } = useInView(0.3)
  const { ref: gridRef, inView: gridVisible } = useInView(0.15)

  return (
    <section className="relative w-full bg-black overflow-hidden py-32">

      {/* Grid lines background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,212,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Cyan glow center */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(0,212,255,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* ── Header ── */}
        <div ref={headRef} className="mb-20">

          <p
            className="font-mono text-xs tracking-[0.3em] text-[#00d4ff]/50 uppercase mb-6"
            style={{
              opacity: headVisible ? 1 : 0,
              transition: 'opacity 0.6s ease',
            }}
          >
            {'// NEXUS_360 — LA FUSIÓN'}
          </p>

          <h2
            className="font-mono font-black uppercase leading-none text-white"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              letterSpacing: '-0.02em',
              opacity: headVisible ? 1 : 0,
              transform: headVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s',
            }}
          >
            <TextScramble
              text="GIRASOMNIS"
              trigger={headVisible}
              duration={1000}
              className="text-[#00d4ff]"
            />
            {' + '}
            <TextScramble
              text="IMMERSO"
              trigger={headVisible}
              duration={1200}
            />
          </h2>

          <div
            className="mt-6 max-w-2xl"
            style={{
              opacity: headVisible ? 1 : 0,
              transform: headVisible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s',
            }}
          >
            <p className="font-mono text-white/40 text-sm leading-relaxed tracking-wide uppercase">
              Soluciones 360° que transforman eventos, espacios y marcas.
              <br />
              <span className="text-[#00d4ff]/60">
                Tecnología de vanguardia · Experiencias inmersivas · Madrid, España
              </span>
            </p>
          </div>
        </div>

        {/* ── Service cards ── */}
        <div ref={gridRef} className="grid md:grid-cols-3 gap-px bg-white/5">
          {SERVICES.map((s, i) => (
            <div
              key={s.code}
              className="relative bg-black p-8 group"
              style={{
                opacity: gridVisible ? 1 : 0,
                transform: gridVisible ? 'translateY(0)' : 'translateY(32px)',
                transition: `opacity 0.7s ease ${i * 120}ms, transform 0.7s ease ${i * 120}ms`,
              }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-px transition-all duration-500"
                style={{
                  background: 'linear-gradient(90deg, #00d4ff, transparent)',
                  opacity: 0.3,
                }}
              />

              <div className="mb-6">
                <span className="font-mono text-[10px] tracking-[0.3em] text-[#00d4ff]/40 uppercase">
                  {s.tag}
                </span>
              </div>

              <div className="mb-4">
                <span className="font-mono text-5xl font-black text-white/8 select-none">
                  {s.code}
                </span>
              </div>

              <h3 className="font-mono font-black text-xl uppercase tracking-tight text-white mb-1">
                <TextScramble
                  text={s.title}
                  trigger={gridVisible}
                  duration={900 + i * 200}
                />
              </h3>

              <p className="font-mono text-xs text-[#00d4ff]/60 uppercase tracking-wider mb-4">
                {s.subtitle}
              </p>

              <p className="text-white/40 text-sm leading-relaxed">
                {s.desc}
              </p>

              {/* Bottom corner accent */}
              <div
                className="absolute bottom-4 right-4 size-2 rounded-full"
                style={{ background: '#00d4ff', opacity: 0.3 }}
              />
            </div>
          ))}
        </div>

        {/* ── Bottom tagline ── */}
        <div className="mt-20 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/5 pt-10">
          <p className="font-mono text-xs tracking-[0.25em] text-white/20 uppercase">
            Transformamos ideas en experiencias 360°
          </p>
          <a
            href="mailto:antonio@immerso.live"
            className="font-mono text-xs tracking-[0.2em] text-[#00d4ff]/50 uppercase hover:text-[#00d4ff] transition-colors"
          >
            antonio@immerso.live
          </a>
        </div>
      </div>
    </section>
  )
}
