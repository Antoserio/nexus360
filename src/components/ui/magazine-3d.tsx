/**
 * Magazine3D — CSS perspective book that mimics the Framer ThreeD-magazine component.
 * Uses transform-style: preserve-3d so no Three.js / WebGL is needed.
 *
 * Sections:
 *   - Spine  (left edge, rotateY -90°)
 *   - Back cover (translateZ negative, acts as base)
 *   - Pages stack (layered white/cream strips for depth illusion)
 *   - Front cover (rotates open on click, backface shows inner page)
 *   - Ground shadow ellipse
 *
 * Interactions:
 *   - Mouse hover → smooth tilt via useMotionValue / useSpring
 *   - Click → cover opens / closes (rotateY -165°)
 *   - Floating idle animation (y + slight rotate loop)
 */

import { useState, useRef, useCallback } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'

interface Magazine3DProps {
  cover: string          // front cover image URL
  backCover?: string     // back cover image URL (optional, uses dark bg if absent)
  pages: string[]        // inner page images shown when cover is opened
  width?: number         // default 240
  height?: number        // default 320
  accent?: string        // spine + badge color
  title?: string
  subtitle?: string
}

const SPRING_CFG = { stiffness: 200, damping: 30, mass: 0.8 }

export function Magazine3D({
  cover,
  backCover,
  pages,
  width  = 240,
  height = 320,
  accent = '#00B8FF',
  title    = 'AIA-SOMNIS',
  subtitle = 'Portfolio 2024',
}: Magazine3DProps) {
  const [opened, setOpened] = useState(false)
  const [pageIdx, setPageIdx] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  // ── Mouse tilt ────────────────────────────────────────────────────────────
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const tiltX = useSpring(useTransform(rawY, [-0.5, 0.5], [ 10, -10]), SPRING_CFG)
  const tiltY = useSpring(useTransform(rawX, [-0.5, 0.5], [-18,  18]), SPRING_CFG)

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    rawX.set((e.clientX - r.left) / r.width  - 0.5)
    rawY.set((e.clientY - r.top)  / r.height - 0.5)
  }, [rawX, rawY])

  const onMouseLeave = useCallback(() => {
    rawX.set(0); rawY.set(0)
  }, [rawX, rawY])

  // ── Page navigation ───────────────────────────────────────────────────────
  const nextPage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPageIdx(p => Math.min(p + 1, pages.length - 1))
  }
  const prevPage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPageIdx(p => Math.max(p - 1, 0))
  }

  const SPINE  = 22      // spine thickness px
  const DEPTH  = 12      // book depth px
  const NLAYERS = 14     // paper stack layers

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        perspective: '1100px',
        width:  width  + SPINE + 48,
        height: height + 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>

      {/* ── Floating wrapper ── */}
      <motion.div
        animate={{ y: [0, -14, 0], rotate: [0, 0.4, -0.4, 0] }}
        transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut' }}>

        {/* ── Tilt wrapper ── */}
        <motion.div
          style={{
            rotateX: tiltX,
            rotateY: tiltY,
            transformStyle: 'preserve-3d',
            width,
            height,
            position: 'relative',
          }}>

          {/* ══ SPINE ══ */}
          <div style={{
            position: 'absolute',
            left: 0, top: 0,
            width: SPINE, height,
            transform: `translateX(-${SPINE}px) rotateY(-90deg)`,
            transformOrigin: 'right center',
            background: `linear-gradient(160deg, #1B3DFF 0%, ${accent} 55%, #FFD42A 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'inset -4px 0 8px rgba(0,0,0,0.25)',
          }}>
            <span style={{
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              fontSize: 7,
              fontWeight: 900,
              letterSpacing: 3,
              color: 'white',
              textTransform: 'uppercase',
              opacity: 0.9,
              userSelect: 'none',
            }}>
              {title}
            </span>
          </div>

          {/* ══ BACK COVER ══ */}
          <div style={{
            position: 'absolute', inset: 0,
            transform: `translateZ(-${DEPTH}px)`,
            background: backCover
              ? `url('${backCover}') center/cover no-repeat`
              : 'linear-gradient(135deg, #071120, #05070D)',
            borderRadius: 2,
            boxShadow: `0 50px 100px rgba(0,0,0,0.7), 0 0 60px rgba(0,0,0,0.4)`,
          }} />

          {/* ══ PAGES STACK (depth illusion) ══ */}
          {Array.from({ length: NLAYERS }).map((_, i) => {
            const z = -DEPTH + 1 + (i * (DEPTH - 1)) / NLAYERS
            const shade = 248 - i * 2
            return (
              <div key={i} style={{
                position: 'absolute',
                left: 1, right: 0,
                top: 1 + i * 0.08,
                bottom: 1 + i * 0.08,
                transform: `translateZ(${z}px)`,
                background: `rgb(${shade},${shade},${shade})`,
                borderRadius: 1,
              }} />
            )
          })}

          {/* ══ FRONT COVER ══ */}
          <motion.div
            animate={{ rotateY: opened ? -165 : 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setOpened(o => !o)}
            style={{
              position: 'absolute', inset: 0,
              transformOrigin: 'left center',
              transformStyle: 'preserve-3d',
              cursor: 'pointer',
              borderRadius: 2,
            }}>

            {/* Front face */}
            <div style={{
              position: 'absolute', inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              overflow: 'hidden',
              borderRadius: 2,
              boxShadow: '4px 0 20px rgba(0,0,0,0.3)',
            }}>
              {/* Cover image */}
              <img
                src={cover}
                alt=""
                loading="lazy"
                decoding="async"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              {/* Dark gradient overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to bottom, rgba(5,7,13,0.15) 30%, rgba(5,7,13,0.85) 100%)',
              }} />
              {/* Cover title */}
              <div style={{ position: 'absolute', bottom: 20, left: 16, right: 16 }}>
                <div style={{
                  color: accent, fontSize: 9, letterSpacing: 3,
                  textTransform: 'uppercase', marginBottom: 6, fontWeight: 700,
                }}>
                  {subtitle}
                </div>
                <div style={{
                  color: '#F4F7FB', fontSize: 17, fontWeight: 900,
                  letterSpacing: -0.3, lineHeight: 1.1,
                }}>
                  {title}
                </div>
              </div>
              {/* Gloss sheen */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 55%)',
                pointerEvents: 'none',
              }} />
              {/* Open hint */}
              {!opened && (
                <div style={{
                  position: 'absolute', top: 12, right: 12,
                  background: 'rgba(0,184,255,0.15)',
                  border: '1px solid rgba(0,184,255,0.3)',
                  borderRadius: 20, padding: '3px 8px',
                  color: accent, fontSize: 9, fontWeight: 700,
                  letterSpacing: 1, textTransform: 'uppercase',
                }}>
                  Abrir
                </div>
              )}
            </div>

            {/* Inner cover (back face of front cover) */}
            <div style={{
              position: 'absolute', inset: 0,
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              background: '#071120',
              borderRadius: 2,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {pages[pageIdx] && (
                <img
                  src={pages[pageIdx]}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', flex: 1, objectFit: 'cover', display: 'block' }}
                />
              )}
              {/* Page navigation */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: 'rgba(5,7,13,0.9)',
                borderTop: '1px solid #223044',
              }}>
                <button
                  onClick={prevPage}
                  disabled={pageIdx === 0}
                  style={{
                    background: 'none', border: 'none',
                    color: pageIdx === 0 ? '#223044' : '#AAB3C2',
                    fontSize: 14, cursor: pageIdx === 0 ? 'default' : 'pointer',
                    padding: '2px 6px',
                  }}>
                  ←
                </button>
                <span style={{ color: '#223044', fontSize: 9, letterSpacing: 2 }}>
                  {String(pageIdx + 1).padStart(2, '0')} / {String(pages.length).padStart(2, '0')}
                </span>
                <button
                  onClick={nextPage}
                  disabled={pageIdx === pages.length - 1}
                  style={{
                    background: 'none', border: 'none',
                    color: pageIdx === pages.length - 1 ? '#223044' : '#AAB3C2',
                    fontSize: 14, cursor: pageIdx === pages.length - 1 ? 'default' : 'pointer',
                    padding: '2px 6px',
                  }}>
                  →
                </button>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </motion.div>

      {/* ── Ground shadow ── */}
      <div style={{
        position: 'absolute',
        bottom: 4,
        left: '50%',
        transform: 'translateX(-50%)',
        width: width * 0.75,
        height: 18,
        background: 'rgba(0,0,0,0.4)',
        filter: 'blur(14px)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />
    </div>
  )
}
