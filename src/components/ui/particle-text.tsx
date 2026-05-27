import { useEffect, useRef, memo } from 'react'

interface Particle {
  x: number; y: number
  baseX: number; baseY: number
  vx: number; vy: number
  color: string
}

interface ParticleTextProps {
  text: string
  fontSize?: number
  colors?: string[]
  particleSize?: number
  mouseRadius?: number
  returnSpeed?: number
  density?: number
  className?: string
}

export const ParticleText = memo(function ParticleText({
  text = 'AIA SOMNIS',
  fontSize = 100,
  colors = ['#00B8FF', '#1B3DFF', '#FFD42A', '#F4F7FB'],
  particleSize = 2,
  mouseRadius = 90,
  returnSpeed = 0.08,
  density = 4,
  className = '',
}: ParticleTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse    = useRef({ x: -9999, y: -9999 })
  const particles = useRef<Particle[]>([])
  const raf      = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    function buildParticles(w: number, h: number) {
      const off = document.createElement('canvas')
      off.width = w; off.height = h
      const oc = off.getContext('2d')!
      const fs = Math.min(fontSize, w * 0.18)
      oc.font = `900 ${fs}px Inter, system-ui, sans-serif`
      oc.fillStyle = '#fff'
      oc.textAlign = 'center'
      oc.textBaseline = 'middle'
      // split on space for two lines if needed
      const words = text.split(' ')
      if (words.length >= 2 && w < 600) {
        const half = Math.ceil(words.length / 2)
        const l1 = words.slice(0, half).join(' ')
        const l2 = words.slice(half).join(' ')
        oc.fillText(l1, w / 2, h / 2 - fs * 0.6)
        oc.fillText(l2, w / 2, h / 2 + fs * 0.6)
      } else {
        oc.fillText(text, w / 2, h / 2)
      }
      const { data } = oc.getImageData(0, 0, w, h)
      const list: Particle[] = []
      for (let y = 0; y < h; y += density) {
        for (let x = 0; x < w; x += density) {
          if (data[(y * w + x) * 4 + 3] > 128) {
            list.push({
              x: Math.random() * w, y: Math.random() * h,
              baseX: x, baseY: y,
              vx: 0, vy: 0,
              color: colors[Math.floor(Math.random() * colors.length)],
            })
          }
        }
      }
      particles.current = list
    }

    function draw() {
      const rect = canvas!.getBoundingClientRect()
      const w = rect.width; const h = rect.height
      ctx!.clearRect(0, 0, w, h)
      const mx = mouse.current.x; const my = mouse.current.y
      const r2 = mouseRadius * mouseRadius
      for (const p of particles.current) {
        const dx = mx - p.x; const dy = my - p.y
        const d2 = dx * dx + dy * dy
        if (d2 < r2) {
          const d = Math.sqrt(d2)
          const f = (mouseRadius - d) / mouseRadius
          const a = Math.atan2(dy, dx)
          p.vx -= Math.cos(a) * f * 7
          p.vy -= Math.sin(a) * f * 7
        }
        p.vx += (p.baseX - p.x) * returnSpeed
        p.vy += (p.baseY - p.y) * returnSpeed
        p.vx *= 0.91; p.vy *= 0.91
        p.x += p.vx; p.y += p.vy
        ctx!.fillStyle = p.color
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, particleSize, 0, Math.PI * 2)
        ctx!.fill()
      }
      raf.current = requestAnimationFrame(draw)
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect()
      canvas!.width  = rect.width  * dpr
      canvas!.height = rect.height * dpr
      ctx!.scale(dpr, dpr)
      buildParticles(rect.width, rect.height)
    }

    resize()
    draw()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const onMove = (e: MouseEvent) => {
      const r = canvas!.getBoundingClientRect()
      mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0]; if (!t) return
      const r = canvas!.getBoundingClientRect()
      mouse.current = { x: t.clientX - r.left, y: t.clientY - r.top }
    }
    const onLeave = () => { mouse.current = { x: -9999, y: -9999 } }

    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('touchmove', onTouch, { passive: true })
    canvas.addEventListener('mouseleave', onLeave)
    canvas.addEventListener('touchend', onLeave)

    return () => {
      cancelAnimationFrame(raf.current)
      ro.disconnect()
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('touchmove', onTouch)
      canvas.removeEventListener('mouseleave', onLeave)
      canvas.removeEventListener('touchend', onLeave)
    }
  }, [text, fontSize, colors, particleSize, mouseRadius, returnSpeed, density])

  return <canvas ref={canvasRef} className={`w-full h-full ${className}`} />
})
