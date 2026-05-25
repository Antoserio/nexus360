import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const C = {
  bg: '#05070D', bg2: '#071120', blue: '#00B8FF', cyan: '#22D3FF',
  deep: '#1B3DFF', gold: '#FFD42A', goldSoft: '#F6B93B',
  white: '#F4F7FB', gray: '#AAB3C2', border: '#223044',
}

export interface SliderItem {
  num: string
  title: string
  category: string
  year: string
  bg: string    // CSS background value — gradient or "url('…') center/cover"
  accent: string
}

interface FxSliderProps {
  items: SliderItem[]
  headerText?: string
  duration?: number
  parallaxAmount?: number
}

// ── Synthetic camera-shutter glitch sound ─────────────────────────────────────
function playGlitch() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const sampleRate = ctx.sampleRate
    const len = Math.floor(sampleRate * 0.09)
    const buf = ctx.createBuffer(1, len, sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < len; i++) {
      const env = Math.pow(1 - i / len, 1.8)
      data[i] = (Math.random() * 2 - 1) * env
    }
    const src = ctx.createBufferSource()
    src.buffer = buf
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 4200
    filter.Q.value = 1.2
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.28, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09)
    src.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    src.start()
    src.stop(ctx.currentTime + 0.1)
  } catch { /* AudioContext not available */ }
}

// ── Glitch flash overlay ──────────────────────────────────────────────────────
function GlitchFlash({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-50 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.7, 0.2, 0.9, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, times: [0, 0.1, 0.3, 0.6, 1] }}>
          {/* White flash */}
          <div className="absolute inset-0" style={{ background: 'rgba(255,255,255,0.06)' }} />
          {/* Horizontal glitch slices */}
          {[15, 38, 62, 80].map((pct, i) => (
            <motion.div
              key={i}
              className="absolute left-0 right-0"
              style={{ top: `${pct}%`, height: Math.random() * 3 + 1, background: 'rgba(255,255,255,0.35)', translateX: (i % 2 === 0 ? 1 : -1) * (Math.random() * 12 + 4) }}
              animate={{ opacity: [1, 0], translateX: [(i % 2 === 0 ? 1 : -1) * 8, 0] }}
              transition={{ duration: 0.14 }}
            />
          ))}
          {/* RGB channel split */}
          <motion.div className="absolute inset-0" style={{ background: 'rgba(0,184,255,0.04)', mixBlendMode: 'screen', transform: 'translateX(-4px)' }} />
          <motion.div className="absolute inset-0" style={{ background: 'rgba(255,212,42,0.04)', mixBlendMode: 'screen', transform: 'translateX(4px)' }} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── FxSlider — full-bleed layout ──────────────────────────────────────────────
export function FxSlider({
  items,
  headerText = 'Proyectos',
  duration = 0.55,
}: FxSliderProps) {
  const [current, setCurrent] = useState(0)
  const [dir, setDir] = useState<'down' | 'up'>('down')
  const [locked, setLocked] = useState(false)
  const [glitching, setGlitching] = useState(false)
  const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const navigate = useCallback((i: number) => {
    if (locked || i === current) return
    setDir(i > current ? 'down' : 'up')
    playGlitch()
    setGlitching(true)
    setTimeout(() => setGlitching(false), 220)
    setCurrent(i)
    setLocked(true)
    if (lockTimer.current) clearTimeout(lockTimer.current)
    lockTimer.current = setTimeout(() => setLocked(false), duration * 1000 + 100)
  }, [locked, current, duration])

  const prev = () => navigate(Math.max(0, current - 1))
  const next = () => navigate(Math.min(items.length - 1, current + 1))

  const ease = [0.16, 1, 0.3, 1] as const
  const t = { duration, ease }

  const bgVariants = {
    enter: (d: string) => ({
      clipPath: d === 'down' ? 'inset(100% 0 0 0)' : 'inset(0 0 100% 0)',
      scale: 1.06,
    }),
    center: { clipPath: 'inset(0% 0 0% 0)', scale: 1 },
    exit: (d: string) => ({
      opacity: 0,
      scale: 0.97,
      y: d === 'down' ? '-3%' : '3%',
    }),
  }

  const titleVariants = {
    enter: (d: string) => ({ y: d === 'down' ? 60 : -60, opacity: 0, filter: 'blur(4px)' }),
    center: { y: 0, opacity: 1, filter: 'blur(0px)' },
    exit: (d: string) => ({ y: d === 'down' ? -40 : 40, opacity: 0, filter: 'blur(2px)' }),
  }

  const active = items[current]
  const nextItem = items[Math.min(items.length - 1, current + 1)]

  return (
    <div
      className="relative overflow-hidden select-none"
      style={{ height: '100vh', minHeight: 600, background: '#000', cursor: 'default' }}
      onKeyDown={e => { if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next(); if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') prev() }}
      tabIndex={0}>

      {/* ── FULL-BLEED BACKGROUND ── */}
      <AnimatePresence custom={dir} mode="popLayout">
        <motion.div
          key={current}
          custom={dir}
          variants={bgVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={t}
          className="absolute inset-0"
          style={{ willChange: 'clip-path, transform' }}>
          <div className="absolute inset-0" style={{ background: active.bg }} />
          {/* Dark side vignettes for text legibility */}
          <div className="absolute inset-y-0 left-0 w-[38%]"
            style={{ background: 'linear-gradient(to right, rgba(2,4,10,0.82) 0%, rgba(2,4,10,0.3) 70%, transparent 100%)' }} />
          <div className="absolute inset-y-0 right-0 w-[38%]"
            style={{ background: 'linear-gradient(to left, rgba(2,4,10,0.82) 0%, rgba(2,4,10,0.3) 70%, transparent 100%)' }} />
          <div className="absolute inset-x-0 bottom-0 h-[35%]"
            style={{ background: 'linear-gradient(to top, rgba(2,4,10,0.7) 0%, transparent 100%)' }} />
          <div className="absolute inset-x-0 top-0 h-[20%]"
            style={{ background: 'linear-gradient(to bottom, rgba(2,4,10,0.5) 0%, transparent 100%)' }} />
        </motion.div>
      </AnimatePresence>

      {/* ── GLITCH FLASH OVERLAY ── */}
      <GlitchFlash show={glitching} />

      {/* ── LEFT LIST ── */}
      <div className="absolute left-0 inset-y-0 flex flex-col justify-center z-10"
        style={{ padding: '0 3rem', width: 280 }}>
        <div className="mb-6">
          <span className="text-xs uppercase tracking-[0.3em]" style={{ color: C.blue }}>{headerText}</span>
        </div>
        <div className="flex flex-col gap-1">
          {items.map((item, i) => (
            <button
              key={item.num}
              onClick={() => navigate(i)}
              className="flex items-center gap-2 py-1.5 text-left group transition-all duration-300"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              {/* Bullet */}
              <motion.span
                animate={{ opacity: i === current ? 1 : 0, width: i === current ? 10 : 0 }}
                transition={{ duration: 0.25 }}
                style={{ color: active.accent, fontSize: 12, flexShrink: 0, overflow: 'hidden' }}>
                ·
              </motion.span>
              <motion.span
                animate={{
                  color: i === current ? C.white : 'rgba(170,179,194,0.4)',
                  fontSize: i === current ? 15 : 13,
                  fontWeight: i === current ? 700 : 400,
                }}
                transition={{ duration: 0.3 }}
                style={{ lineHeight: 1.3 }}>
                {item.title}
              </motion.span>
            </button>
          ))}
        </div>
      </div>

      {/* ── RIGHT LIST ── */}
      <div className="absolute right-0 inset-y-0 flex flex-col justify-center z-10"
        style={{ padding: '0 3rem', width: 280, alignItems: 'flex-end' }}>
        <div className="mb-6 text-right">
          <span className="text-xs uppercase tracking-[0.3em]" style={{ color: C.blue }}>Categoría</span>
        </div>
        <div className="flex flex-col gap-1 items-end">
          {items.map((item, i) => (
            <button
              key={item.num}
              onClick={() => navigate(i)}
              className="flex items-center gap-2 py-1.5 text-right group transition-all duration-300"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <motion.span
                animate={{
                  color: i === current ? C.white : 'rgba(170,179,194,0.4)',
                  fontSize: i === current ? 15 : 13,
                  fontWeight: i === current ? 700 : 400,
                }}
                transition={{ duration: 0.3 }}
                style={{ lineHeight: 1.3 }}>
                {item.category}
              </motion.span>
              <motion.span
                animate={{ opacity: i === current ? 1 : 0, width: i === current ? 10 : 0 }}
                transition={{ duration: 0.25 }}
                style={{ color: active.accent, fontSize: 12, flexShrink: 0, overflow: 'hidden' }}>
                ·
              </motion.span>
            </button>
          ))}
        </div>
      </div>

      {/* ── CENTER TITLE ── */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
        style={{ padding: '0 320px' }}>
        <AnimatePresence custom={dir} mode="wait">
          <motion.div
            key={current}
            custom={dir}
            variants={titleVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ ...t, duration: t.duration * 0.75 }}
            className="text-center">
            <motion.p
              className="text-xs uppercase tracking-[0.35em] mb-3"
              style={{ color: active.accent }}>
              {active.year}
            </motion.p>
            <h2
              className="font-black leading-none tracking-tight"
              style={{
                fontSize: 'clamp(1.8rem, 4vw, 3.5rem)',
                color: C.white,
                textShadow: '0 2px 40px rgba(0,0,0,0.8)',
                letterSpacing: '-0.02em',
              }}>
              {active.title}
            </h2>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── BOTTOM COUNTER: ← prev ——● next → ── */}
      <div className="absolute bottom-0 inset-x-0 flex items-center justify-center z-10 pb-10">
        <div className="flex items-center gap-5">

          {/* ← Prev arrow — always visible */}
          <button
            onClick={prev}
            className="flex items-center gap-2 transition-all duration-250"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              opacity: current > 0 ? 1 : 0.28,
            }}>
            <span style={{ color: C.white, fontSize: 16, lineHeight: 1 }}>←</span>
            <span
              className="text-sm font-bold tabular-nums tracking-widest"
              style={{ color: current > 0 ? C.gray : C.border }}>
              {String(current).padStart(2, '0')}
            </span>
          </button>

          {/* Progress track */}
          <div className="relative flex items-center" style={{ width: 88, height: 2 }}>
            <div className="absolute inset-0 rounded-full" style={{ background: C.border }} />
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full"
              animate={{ width: `${(current / Math.max(items.length - 1, 1)) * 100}%` }}
              transition={t}
              style={{ background: active.accent }} />
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
              animate={{ left: `${(current / Math.max(items.length - 1, 1)) * 100}%` }}
              transition={t}
              style={{ background: active.accent, boxShadow: `0 0 6px ${active.accent}`, marginLeft: -4 }} />
          </div>

          {/* Next → arrow — always visible */}
          <button
            onClick={next}
            className="flex items-center gap-2 transition-all duration-250"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              opacity: current < items.length - 1 ? 1 : 0.28,
            }}>
            <span
              className="text-sm font-bold tabular-nums tracking-widest"
              style={{ color: current < items.length - 1 ? C.gray : C.border }}>
              {String(current + 2).padStart(2, '0')}
            </span>
            <span style={{ color: C.white, fontSize: 16, lineHeight: 1 }}>→</span>
          </button>

        </div>
      </div>

      {/* ── TOP RIGHT: accent corner ── */}
      <div className="absolute top-8 right-8 z-10 pointer-events-none flex flex-col items-end gap-1">
        <motion.div animate={{ color: active.accent }} className="text-xs uppercase tracking-[0.3em]">
          {active.num} / {String(items.length).padStart(2, '0')}
        </motion.div>
      </div>
    </div>
  )
}
