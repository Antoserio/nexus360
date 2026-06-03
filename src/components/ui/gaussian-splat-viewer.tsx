import { useEffect, useRef, useState } from 'react'

interface GaussianSplatViewerProps {
  src: string
  className?: string
  style?: React.CSSProperties
}

export function GaussianSplatViewer({ src, className, style }: GaussianSplatViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError]     = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let viewer: any = null
    let cancelled   = false
    let timeoutId:  ReturnType<typeof setTimeout>

    // 60s timeout — if still loading, show error instead of hanging forever
    timeoutId = setTimeout(() => {
      if (!cancelled && loading) {
        setError('La escena tardó demasiado en cargar.')
        setLoading(false)
      }
    }, 60000)

    import('@mkkellogg/gaussian-splats-3d').then(GS3D => {
      if (cancelled) return

      try {
        viewer = new GS3D.Viewer({
          cameraUp:               [0, -1, 0],
          initialCameraPosition:  [0, 0.5, 5],
          initialCameraLookAt:    [0, 0, 0],
          rootElement:            container,
          selfDrivenMode:         true,
          useBuiltInControls:     true,
          logLevel:               GS3D.LogLevel?.Error ?? 3,
          gpuAcceleratedSort:     false,
        })

        viewer.addSplatScene(src, {
          splatAlphaRemovalThreshold: 5,
          showLoadingUI:              false,
          progressiveLoad:            true,
        })
        .then(() => {
          if (cancelled) return
          clearTimeout(timeoutId)
          setLoading(false)
          viewer.start()
        })
        .catch((e: Error) => {
          if (cancelled) return
          clearTimeout(timeoutId)
          setError(`Error al cargar la escena: ${e.message}`)
          setLoading(false)
        })

      } catch (e: any) {
        clearTimeout(timeoutId)
        if (!cancelled) setError(`Error al iniciar el viewer: ${e.message}`)
      }
    }).catch((e: Error) => {
      clearTimeout(timeoutId)
      if (!cancelled) setError(`Error al cargar la librería: ${e.message}`)
    })

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
      try { viewer?.dispose?.() } catch {}
      Array.from(container.querySelectorAll('canvas')).forEach(c => c.remove())
    }
  }, [src])

  return (
    <div ref={containerRef} className={className} style={{ position: 'relative', ...style }}>
      {loading && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none"
          style={{ background: '#05070D', zIndex: 10 }}>
          <div className="w-10 h-10 rounded-full border-2 border-transparent animate-spin"
            style={{ borderTopColor: '#00B8FF', borderRightColor: 'rgba(0,184,255,0.2)' }} />
          <span className="text-xs uppercase tracking-widest" style={{ color: '#00B8FF' }}>
            Cargando escena 3D…
          </span>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center pointer-events-none"
          style={{ background: '#05070D', zIndex: 10 }}>
          <span className="text-sm" style={{ color: '#AAB3C2' }}>{error}</span>
        </div>
      )}
    </div>
  )
}
