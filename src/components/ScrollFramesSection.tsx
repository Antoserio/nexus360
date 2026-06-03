import { useEffect, useRef, useState } from 'react'

const FRAME_COUNT = 200
const FRAMES = Array.from({ length: FRAME_COUNT }, (_, i) =>
  `/3d frames/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`
)

export function ScrollFramesSection() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const frameRef = useRef(0)
  const targetRef = useRef(0)
  const rafRef = useRef<number>(0)
  const [textOpacity, setTextOpacity] = useState(0)

  useEffect(() => {
    imagesRef.current = FRAMES.map(src => {
      const img = new Image()
      img.src = src
      return img
    })
  }, [])

  useEffect(() => {
    const wrapper = wrapperRef.current
    const canvas = canvasRef.current
    if (!wrapper || !canvas) return

    const drawFrame = (index: number) => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const img = imagesRef.current[index]
      if (!img?.complete || !img.naturalWidth) return
      const w = canvas.width
      const h = canvas.height
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight)
      const sw = img.naturalWidth * scale
      const sh = img.naturalHeight * scale
      ctx.clearRect(0, 0, w, h)
      ctx.drawImage(img, (w - sw) / 2, (h - sh) / 2, sw, sh)
    }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      drawFrame(Math.round(frameRef.current))
    }

    const onScroll = () => {
      const rect = wrapper.getBoundingClientRect()
      const scrolled = -rect.top
      const total = rect.height - window.innerHeight
      const progress = Math.max(0, Math.min(1, scrolled / total))
      targetRef.current = progress * (FRAME_COUNT - 1)

      let opacity = 0
      if (progress < 0.2) opacity = progress / 0.2
      else if (progress < 0.75) opacity = 1
      else if (progress < 0.9) opacity = 1 - (progress - 0.75) / 0.15
      setTextOpacity(opacity)
    }

    const loop = () => {
      const diff = targetRef.current - frameRef.current
      if (Math.abs(diff) > 0.05) {
        frameRef.current += diff * 0.12
      }
      drawFrame(Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(frameRef.current))))
      rafRef.current = requestAnimationFrame(loop)
    }

    window.addEventListener('resize', resize)
    window.addEventListener('scroll', onScroll, { passive: true })
    resize()
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div ref={wrapperRef} style={{ height: '300vh', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: '#05070D' }}
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
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 5vw, 4rem)',
              fontWeight: 900,
              color: '#F4F7FB',
              lineHeight: 1.15,
              textShadow: '0 0 40px rgba(0,184,255,0.6), 0 0 80px rgba(0,184,255,0.3)',
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            La tecnología que impresiona.<br />Los resultados que importan.
          </h2>
        </div>
      </div>
    </div>
  )
}
