import { useEffect, useRef, useState } from 'react'

export function CuboFramesSection() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [textOpacity, setTextOpacity] = useState(0)

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const onScroll = () => {
      const rect = wrapper.getBoundingClientRect()
      const scrolled = -rect.top
      const total = rect.height - window.innerHeight
      const progress = Math.max(0, Math.min(1, scrolled / total))

      let opacity = 0
      if (progress < 0.2) opacity = progress / 0.2
      else if (progress < 0.75) opacity = 1
      else if (progress < 0.9) opacity = 1 - (progress - 0.75) / 0.15
      setTextOpacity(opacity)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={wrapperRef} style={{ height: '300vh', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        <video
          src="/flower-arc.mp4"
          poster="/flower-arc.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', background: '#05070D' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0 5%',
            opacity: textOpacity,
            transition: 'opacity 0.1s linear',
            pointerEvents: 'none',
            zIndex: 10,
            background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(5,7,13,0.55) 0%, transparent 70%)',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 5vw, 4rem)',
              fontWeight: 900,
              color: '#F4F7FB',
              lineHeight: 1.15,
              textShadow: '0 0 40px rgba(255,212,42,0.6), 0 0 80px rgba(255,212,42,0.3)',
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            Creatividad sin límites.<br />Tecnología que transforma.
          </h2>
        </div>
      </div>
    </div>
  )
}
