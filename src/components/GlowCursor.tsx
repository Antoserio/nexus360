import { useEffect, useRef, useState } from 'react'

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
