import { GaussianSplatViewer } from '@/components/ui/gaussian-splat-viewer'

export default function SplatPage() {
  const src = new URLSearchParams(window.location.search).get('src') ?? '/scene.spz'
  return (
    <GaussianSplatViewer
      src={src}
      style={{ width: '100vw', height: '100vh', background: '#05070D' }}
    />
  )
}
