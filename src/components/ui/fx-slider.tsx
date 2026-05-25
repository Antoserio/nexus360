import { useState } from 'react'
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

export function FxSlider({
  items,
  headerText = 'Proyectos',
  duration = 0.64,
  parallaxAmount = 5,
}: FxSliderProps) {
  const [current, setCurrent] = useState(0)
  const [dir, setDir] = useState<'down' | 'up'>('down')
  const [locked, setLocked] = useState(false)

  const navigate = (i: number) => {
    if (locked || i === current) return
    setDir(i > current ? 'down' : 'up')
    setCurrent(i)
    setLocked(true)
    setTimeout(() => setLocked(false), duration * 1000)
  }

  const ease = [0.16, 1, 0.3, 1] as const
  const t = { duration, ease }

  const imageVariants = {
    enter: (d: string) => ({
      clipPath: d === 'down' ? 'inset(100% 0 0 0)' : 'inset(0 0 100% 0)',
    }),
    center: { clipPath: 'inset(0% 0 0% 0)' },
    exit: (d: string) => ({
      y: d === 'down' ? `${parallaxAmount}%` : `-${parallaxAmount}%`,
      opacity: 0,
    }),
  }

  const textVariants = {
    enter: (d: string) => ({ y: d === 'down' ? '110%' : '-110%', opacity: 0 }),
    center: { y: 0, opacity: 1 },
    exit: (d: string) => ({ y: d === 'down' ? '-110%' : '110%', opacity: 0 }),
  }

  const active = items[current]

  return (
    <div className="flex" style={{ minHeight: '100vh', background: C.bg2 }}>

      {/* LEFT: list */}
      <div
        className="flex flex-col justify-center relative"
        style={{ width: '42%', flexShrink: 0, borderRight: `1px solid ${C.border}`, padding: '5rem 3rem' }}>

        <div className="mb-10">
          <span className="text-xs uppercase tracking-[0.3em]" style={{ color: C.blue }}>
            {headerText}
          </span>
        </div>

        <div className="flex flex-col">
          {items.map((item, i) => (
            <button
              key={item.num}
              onClick={() => navigate(i)}
              className="flex items-center gap-5 py-5 w-full text-left"
              style={{
                borderTop: `1px solid ${C.border}`,
                transform: i === current ? 'translateX(18px)' : 'translateX(0)',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              }}>
              <span
                className="text-xs font-bold tabular-nums w-8 flex-shrink-0"
                style={{ color: i === current ? item.accent : C.border, transition: 'color 0.4s' }}>
                {item.num}
              </span>
              <div className="flex-1 min-w-0 overflow-hidden">
                <div
                  className="font-black text-xl leading-tight truncate"
                  style={{ color: i === current ? C.white : C.gray, transition: 'color 0.4s' }}>
                  {item.title}
                </div>
                <div
                  className="text-xs uppercase tracking-wide mt-0.5"
                  style={{ color: i === current ? item.accent : C.border, transition: 'color 0.4s' }}>
                  {item.category}
                </div>
              </div>
              <span className="text-xs flex-shrink-0" style={{ color: C.border }}>{item.year}</span>
            </button>
          ))}
          <div style={{ borderTop: `1px solid ${C.border}` }} />
        </div>

        {/* Progress bar */}
        <div className="mt-8 relative" style={{ height: 2, background: C.border }}>
          <motion.div
            className="absolute top-0 left-0 h-full rounded-full"
            animate={{ width: `${(current / Math.max(items.length - 1, 1)) * 100}%` }}
            transition={t}
            style={{ background: active.accent }}
          />
        </div>

        {/* Counter + nav arrows */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs tabular-nums" style={{ color: C.border }}>
            {String(current + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          </span>
          <div className="flex gap-2">
            {[
              { label: '↑', delta: -1 },
              { label: '↓', delta: 1 },
            ].map(({ label, delta }) => (
              <button
                key={label}
                onClick={() => navigate(Math.max(0, Math.min(items.length - 1, current + delta)))}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
                style={{ border: `1px solid ${C.border}`, color: C.gray, background: 'transparent' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.blue; (e.currentTarget as HTMLButtonElement).style.color = C.blue }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.border; (e.currentTarget as HTMLButtonElement).style.color = C.gray }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: image panel */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence custom={dir} mode="popLayout">
          <motion.div
            key={current}
            custom={dir}
            variants={imageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={t}
            className="absolute inset-0">

            <div className="absolute inset-0" style={{ background: active.bg }} />

            {/* Gradient overlay */}
            <div
              className="absolute bottom-0 inset-x-0"
              style={{ height: '55%', background: 'linear-gradient(to top, rgba(5,7,13,0.92) 0%, transparent 100%)' }} />

            {/* Text */}
            <div className="absolute bottom-12 left-12 right-12 overflow-hidden">
              <AnimatePresence custom={dir} mode="wait">
                <motion.div
                  key={current}
                  custom={dir}
                  variants={textVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ ...t, duration: t.duration * 0.8 }}>
                  <span className="text-xs uppercase tracking-[0.3em] mb-3 block" style={{ color: active.accent }}>
                    {active.category} · {active.year}
                  </span>
                  <h3
                    className="font-black leading-none"
                    style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: C.white }}>
                    {active.title}
                  </h3>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Corner accent */}
            <div
              className="absolute top-8 right-8 w-8 h-8"
              style={{
                borderTop: `2px solid ${active.accent}`,
                borderRight: `2px solid ${active.accent}`,
                opacity: 0.6,
              }} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
