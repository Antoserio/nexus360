import { useEffect, useRef, useState } from 'react'

// ── Partículas ligeras que siguen el cursor ───────────────────────────────────
export function CursorParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); if (!ctx) return

    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight

    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)

    type P = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; r: number; color: string }
    const particles: P[] = []
    const COLORS = ['#00B8FF', '#22D3FF', '#1B3DFF', '#ffffff', '#00B8FF']
    let mx = -999, my = -999, moving = false, moveTimer = 0

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; moving = true; clearTimeout(moveTimer); moveTimer = window.setTimeout(() => { moving = false }, 80) }
    window.addEventListener('mousemove', onMove)

    let raf: number
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Spawn partículas solo al mover
      if (moving && Math.random() < 0.6) {
        particles.push({
          x: mx + (Math.random() - 0.5) * 8,
          y: my + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.8) * 1.4,
          life: 0,
          maxLife: 28 + Math.random() * 18,
          r: 1.2 + Math.random() * 2,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        })
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life++
        p.x += p.vx; p.y += p.vy
        p.vy -= 0.03  // leve flotación hacia arriba
        const t = p.life / p.maxLife
        const alpha = Math.max(0, (1 - t) * 0.85)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * (1 - t * 0.4), 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = alpha
        ctx.shadowBlur = 8
        ctx.shadowColor = p.color
        ctx.fill()
        ctx.globalAlpha = 1
        ctx.shadowBlur = 0
        if (p.life >= p.maxLife) particles.splice(i, 1)
      }

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 99997, mixBlendMode: 'screen' }}
    />
  )
}

export function GlowCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos     = useRef({ x: -200, y: -200 })
  const ring    = useRef({ x: -200, y: -200 })
  const rafRef  = useRef<number>(0)
  const [hovered, setHovered] = useState(false)
  const [color, setColor]     = useState('#00B8FF')
  const [hidden, setHidden]   = useState(true)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      setHidden(false)

      // Detect accent color from hovered element
      const el = document.elementFromPoint(e.clientX, e.clientY)
      if (el) {
        // Walk up to find data-accent
        let node: Element | null = el
        let found = false
        while (node && !found) {
          const accent = node.getAttribute('data-cursor-accent')
          if (accent) { setColor(accent); found = true }
          const tag = node.tagName
          if (tag === 'BUTTON' || tag === 'A' || node.getAttribute('role') === 'button') {
            setHovered(true)
          }
          node = node.parentElement
        }
        if (!found) setColor('#00B8FF')
      }
    }

    const onEnter = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      if (el.tagName === 'BUTTON' || el.tagName === 'A' || el.getAttribute('role') === 'button' || el.closest('button') || el.closest('a')) {
        setHovered(true)
      }
    }
    const onLeave = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      if (el.tagName === 'BUTTON' || el.tagName === 'A' || el.closest('button') || el.closest('a')) {
        setHovered(false)
      }
    }

    const onLeaveWindow = () => setHidden(true)
    const onEnterWindow = () => setHidden(false)

    // Smooth ring animation
    const animate = () => {
      const ease = 0.10
      ring.current.x += (pos.current.x - ring.current.x) * ease
      ring.current.y += (pos.current.y - ring.current.y) * ease

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 5}px, ${pos.current.y - 5}px)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x - 22}px, ${ring.current.y - 22}px)`
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onEnter)
    document.addEventListener('mouseout', onLeave)
    document.addEventListener('mouseleave', onLeaveWindow)
    document.addEventListener('mouseenter', onEnterWindow)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onEnter)
      document.removeEventListener('mouseout', onLeave)
      document.removeEventListener('mouseleave', onLeaveWindow)
      document.removeEventListener('mouseenter', onEnterWindow)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  if (typeof window === 'undefined') return null
  return (
    <>
      {/* Dot — sigue exacto */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 10, height: 10,
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 12px ${color}, 0 0 24px ${color}80`,
          pointerEvents: 'none',
          zIndex: 99999,
          transition: 'opacity 0.2s, background 0.3s, box-shadow 0.3s, width 0.2s, height 0.2s',
          opacity: hidden ? 0 : 1,
          willChange: 'transform',
          mixBlendMode: 'screen',
        }}
      />

      {/* Ring — sigue con lag */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: hovered ? 56 : 44,
          height: hovered ? 56 : 44,
          borderRadius: '50%',
          border: `1.5px solid ${color}`,
          boxShadow: `0 0 16px ${color}60, inset 0 0 8px ${color}20`,
          pointerEvents: 'none',
          zIndex: 99998,
          transition: 'opacity 0.2s, border-color 0.3s, box-shadow 0.3s, width 0.25s, height 0.25s',
          opacity: hidden ? 0 : hovered ? 0.9 : 0.55,
          willChange: 'transform',
        }}
      />
    </>
  )
}
