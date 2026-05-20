import { useEffect, useRef, useState } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&'

interface TextScrambleProps {
  text: string
  className?: string
  duration?: number
  trigger?: boolean
}

export function TextScramble({
  text,
  className,
  duration = 1200,
  trigger = true,
}: TextScrambleProps) {
  const [display, setDisplay] = useState(text)
  const frameRef = useRef<number>(0)
  const startRef = useRef<number>(0)

  useEffect(() => {
    if (!trigger) return

    cancelAnimationFrame(frameRef.current)
    startRef.current = performance.now()

    const chars = text.split('')
    const total = chars.length

    function tick(now: number) {
      const elapsed = now - startRef.current
      const progress = Math.min(elapsed / duration, 1)

      const revealed = Math.floor(progress * total)

      setDisplay(
        chars
          .map((ch, i) => {
            if (ch === ' ') return ' '
            if (i < revealed) return ch
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join(''),
      )

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick)
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [text, duration, trigger])

  return <span className={className}>{display}</span>
}
