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
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const mouse      = useRef({ x: -9999, y: -9999 })
  const particles  = useRef<Particle[]>([])
  const raf        = useRef(0)
  const size       = useRef({ w: 0, h: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    // ── build particle list from text pixel-sampling ──────────────────────
    async function buildParticles(w: number, h: number) {
      // Wait for fonts so the text renders correctly
      try { await document.fonts.ready } catch (_) { /* ignore */ }

      const off = document.createElement('canvas')
      off.width = w
      off.height = h
      const oc = off.getContext('2d')!
      const fs = Math.min(fontSize, w * 0.15)
      oc.clearRect(0, 0, w, h)
      oc.font = `900 ${fs}px "Inter", "Helvetica Neue", Arial, sans-serif`
      oc.fillStyle = '#ffffff'
      oc.textAlign = 'center'
      oc.textBaseline = 'middle'
      oc.fillText(text, w / 2, h / 2)

      const imgData = oc.getImageData(0, 0, w, h)
      const d = imgData.data
      const list: Particle[] = []

      for (let y = 0; y < h; y += density) {
        for (let x = 0; x < w; x += density) {
          const alpha = d[(y * w + x) * 4 + 3]
          if (alpha > 128) {
            list.push({
              x: Math.random() * w,
              y: Math.random() * h,
              baseX: x,
              baseY: y,
              vx: 0, vy: 0,
              color: colors[Math.floor(Math.random() * colors.length)],
            })
          }
        }
      }
      particles.current = list
    }

    // ── resize: reset canvas + rebuild ────────────────────────────────────
    function resize() {
      const el = canvas!.parentElement ?? canvas!
      const w = el.clientWidth  || canvas!.offsetWidth
      const h = el.clientHeight || canvas!.offsetHeight
      if (w < 2 || h < 2) return        // not laid out yet

      size.current = { w, h }
      canvas!.width  = w * dpr
      canvas!.height = h * dpr
      // reset transform then apply DPR scale (avoids accumulation)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildParticles(w, h)
    }

    // ── animation loop ─────────────────────────────────────────────────────
    function draw() {
      raf.current = requestAnimationFrame(draw)
      const { w, h } = size.current
      if (w < 2 || h < 2 || particles.current.length === 0) return

      ctx!.clearRect(0, 0, w, h)

      const mx = mouse.current.x
      const my = mouse.current.y
      const r2 = mouseRadius * mouseRadius

      for (const p of particles.current) {
        const dx = mx - p.x
        const dy = my - p.y
        const d2 = dx * dx + dy * dy

        if (d2 < r2 && d2 > 0.01) {
          const d = Math.sqrt(d2)
          const f = (mouseRadius - d) / mouseRadius
          const angle = Math.atan2(dy, dx)
          p.vx -= Math.cos(angle) * f * 8
          p.vy -= Math.sin(angle) * f * 8
        }

        // spring return
        p.vx += (p.baseX - p.x) * returnSpeed
        p.vy += (p.baseY - p.y) * returnSpeed
        // damping
        p.vx *= 0.90
        p.vy *= 0.90

        p.x += p.vx
        p.y += p.vy

        ctx!.fillStyle = p.color
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, particleSize, 0, Math.PI * 2)
        ctx!.fill()
      }
    }

    // ── init: defer one frame so layout is done ───────────────────────────
    const initId = requestAnimationFrame(() => {
      resize()
      draw()
    })

    // resize observer for container changes
    const ro = new ResizeObserver(resize)
    ro.observe(canvas!.parentElement ?? canvas!)

    // ── mouse / touch ──────────────────────────────────────────────────────
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

    // listen on window so cursor tracked even outside canvas
    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onTouch, { passive: true })
    canvas.addEventListener('mouseleave', onLeave)
    canvas.addEventListener('touchend', onLeave)

    return () => {
      cancelAnimationFrame(initId)
      cancelAnimationFrame(raf.current)
      ro.disconnect()
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onTouch)
      canvas.removeEventListener('mouseleave', onLeave)
      canvas.removeEventListener('touchend', onLeave)
    }
  }, [text, fontSize, colors, particleSize, mouseRadius, returnSpeed, density])

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100%', height: '100%' }}
      className={className}
    />
  )
})
