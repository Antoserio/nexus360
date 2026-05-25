import { useEffect, useRef, useState } from 'react'

interface GaussianSplatViewerProps {
  src: string           // path to .spz / .splat / .ksplat file (put it in /public)
  className?: string
  style?: React.CSSProperties
}

export function GaussianSplatViewer({ src, className, style }: GaussianSplatViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let viewer: any = null
    let cancelled = false

    import('@mkkellogg/gaussian-splats-3d').then(GS3D => {
      if (cancelled) return
      try {
        viewer = new GS3D.Viewer({
          cameraUp: [0, -1, 0],
          initialCameraPosition: [0, 0.5, 4],
          initialCameraLookAt: [0, 0, 0],
          rootElement: container,
          selfDrivenMode: true,
          useBuiltInControls: true,
          logLevel: GS3D.LogLevel?.Error ?? 3,
        })

        viewer.addSplatScene(src, {
          splatAlphaRemovalThreshold: 5,
          showLoadingUI: false,
        }).then(() => {
          if (!cancelled) {
            setLoading(false)
            viewer.start()
          }
        }).catch((e: Error) => {
          if (!cancelled) setError(`No se pudo cargar: ${e.message}`)
        })
      } catch (e: any) {
        if (!cancelled) setError(`Error al iniciar el viewer: ${e.message}`)
      }
    }).catch((e: Error) => {
      if (!cancelled) setError(`No se pudo cargar el módulo: ${e.message}`)
    })

    return () => {
      cancelled = true
      try { viewer?.dispose?.() } catch {}
      // Remove any canvas the viewer may have appended
      Array.from(container.querySelectorAll('canvas')).forEach(c => c.remove())
    }
  }, [src])

  return (
    <div ref={containerRef} className={className} style={{ position: 'relative', ...style }}>
      {loading && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3"
          style={{ background: '#05070D', zIndex: 10 }}>
          <div className="w-10 h-10 rounded-full border-2 border-transparent animate-spin"
            style={{ borderTopColor: '#00B8FF', borderRightColor: 'rgba(0,184,255,0.2)' }} />
          <span className="text-xs uppercase tracking-widest" style={{ color: '#00B8FF' }}>
            Cargando escena 3D…
          </span>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center"
          style={{ background: '#05070D', zIndex: 10 }}>
          <span className="text-2xl">⚠️</span>
          <span className="text-sm" style={{ color: '#AAB3C2' }}>{error}</span>
          <span className="text-xs" style={{ color: '#223044' }}>
            Asegúrate de que el archivo .spz está en <code>/public/</code>
          </span>
        </div>
      )}
    </div>
  )
}
