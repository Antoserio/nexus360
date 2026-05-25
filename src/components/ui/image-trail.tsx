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
}

export function ImageTrail({
  images,
  children,
  triggerDistance = 85,
  maxImages = 7,
  imageWidth = 210,
  imageHeight = 145,
}: ImageTrailProps) {
  const [items, setItems] = useState<TrailItem[]>([])
  const lastPos = useRef({ x: -9999, y: -9999 })
  const imgIdx = useRef(0)

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    if (dx * dx + dy * dy < triggerDistance * triggerDistance) return

    lastPos.current = { x: e.clientX, y: e.clientY }
    const id = Date.now() + Math.random()
    const src = images[imgIdx.current % images.length]
    imgIdx.current++

    setItems(prev => [
      ...prev.slice(-(maxImages - 1)),
      { id, x: e.clientX, y: e.clientY, src, rotate: (Math.random() - 0.5) * 22 },
    ])
    setTimeout(() => setItems(prev => prev.filter(t => t.id !== id)), 950)
  }, [images, triggerDistance, maxImages])

  const onMouseLeave = useCallback(() => {
    lastPos.current = { x: -9999, y: -9999 }
  }, [])

  return (
    <div onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} className="relative w-full h-full">
      {children}
      <AnimatePresence>
        {items.map(item => (
          <motion.div
            key={item.id}
            className="pointer-events-none fixed z-[200]"
            style={{ left: item.x, top: item.y, x: '-50%', y: '-50%' }}
            initial={{ opacity: 0, scale: 0.5, rotate: item.rotate + 12 }}
            animate={{ opacity: 1, scale: 1, rotate: item.rotate }}
            exit={{ opacity: 0, scale: 0.82, y: -22 }}
            transition={{ duration: 0.58, ease: [0.175, 0.885, 0.32, 1.275] }}>
            <div
              className="overflow-hidden rounded-xl"
              style={{ width: imageWidth, height: imageHeight, boxShadow: '0 24px 60px rgba(0,0,0,0.65)' }}>
              <img src={item.src} alt="" className="w-full h-full object-cover" />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
