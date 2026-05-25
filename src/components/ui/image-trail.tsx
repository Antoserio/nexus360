import { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TrailItem {
  id: number
  x: number
  y: number
  src: string
  rotate: number
}

interface ImageTrailProps {
  images: string[]
  children: React.ReactNode
  triggerDistance?: number
  maxImages?: number
  imageWidth?: number
  imageHeight?: number
  maxRotation?: number
}

export function ImageTrail({
  images,
  children,
  triggerDistance = 85,
  maxImages = 8,
  imageWidth = 160,
  imageHeight = 160,
  maxRotation = 8,
}: ImageTrailProps) {
  const [items, setItems] = useState<TrailItem[]>([])
  const lastPos  = useRef({ x: -9999, y: -9999 })
  const imgIdx   = useRef(0)
  const rafGate  = useRef(false)   // one spawn per animation frame max
  const timers   = useRef<ReturnType<typeof setTimeout>[]>([])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    // RAF gate — skip if a frame is already queued
    if (rafGate.current) return
    rafGate.current = true
    requestAnimationFrame(() => { rafGate.current = false })

    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    if (dx * dx + dy * dy < triggerDistance * triggerDistance) return

    lastPos.current = { x: e.clientX, y: e.clientY }

    const id  = Date.now() + Math.random()
    const src = images[imgIdx.current % images.length]
    imgIdx.current++

    setItems(prev => [
      ...prev.slice(-(maxImages - 1)),
      { id, x: e.clientX, y: e.clientY, src, rotate: (Math.random() - 0.5) * maxRotation * 2 },
    ])

    const t = setTimeout(
      () => setItems(prev => prev.filter(item => item.id !== id)),
      650,
    )
    timers.current.push(t)
    // clean up old timers to avoid memory leak
    if (timers.current.length > maxImages * 2) {
      timers.current = timers.current.slice(-maxImages)
    }
  }, [images, triggerDistance, maxImages, maxRotation])

  const onMouseLeave = useCallback(() => {
    lastPos.current = { x: -9999, y: -9999 }
  }, [])

  return (
    // absolute inset-0 → always fills the nearest positioned ancestor,
    // no dependency on height:100% chain through flex items
    <div onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} className="absolute inset-0">
      {children}
      <AnimatePresence>
        {items.map(item => (
          <motion.div
            key={item.id}
            className="pointer-events-none fixed z-[200]"
            style={{ left: item.x, top: item.y, x: '-50%', y: '-50%', willChange: 'transform, opacity' }}
            initial={{ opacity: 0, scale: 0.6, rotate: item.rotate + 8 }}
            animate={{ opacity: 1, scale: 1, rotate: item.rotate }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}>
            <div
              className="overflow-hidden rounded-xl"
              style={{ width: imageWidth, height: imageHeight, boxShadow: '0 16px 40px rgba(0,0,0,0.6)' }}>
              <img
                src={item.src}
                alt=""
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
