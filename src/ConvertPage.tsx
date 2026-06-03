import { useRef, useState } from 'react'

export default function ConvertPage() {
  const [status, setStatus]   = useState('Arrastra el archivo .spz aquí o haz clic')
  const [dlUrl,  setDlUrl]    = useState<string | null>(null)
  const [outMB,  setOutMB]    = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    if (!file) return
    setDlUrl(null)
    setStatus(`Leyendo ${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB)…`)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const blob = new Blob([arrayBuffer])
      const objectURL = URL.createObjectURL(blob)

      setStatus('Cargando librería y escena 3D… (puede tardar 30-60 seg)')

      // Hidden canvas needed by the viewer
      const canvas = document.createElement('canvas')
      canvas.width = 256; canvas.height = 256
      canvas.style.display = 'none'
      document.body.appendChild(canvas)

      const GS3D = await import('@mkkellogg/gaussian-splats-3d')

      // The library needs a URL ending in .spz to detect the format
      // We use a named file URL trick via a second blob with metadata
      const spzBlob = new Blob([arrayBuffer], { type: 'application/octet-stream' })
      const spzFile = new File([spzBlob], 'scene.spz', { type: 'application/octet-stream' })
      const spzURL  = URL.createObjectURL(spzFile)

      const viewer = new GS3D.Viewer({
        canvas,
        selfDrivenMode:     false,
        useBuiltInControls: false,
        logLevel:           (GS3D as any).LogLevel?.Error ?? 3,
        gpuAcceleratedSort: false,
      })

      setStatus('Procesando escena 3D… (30-60 seg)')

      await viewer.addSplatScene(spzURL, {
        format:                     (GS3D as any).SceneFormat?.Spz ?? 6,
        splatAlphaRemovalThreshold: 5,
        showLoadingUI:              false,
      })

      setStatus('Exportando a .ksplat…')

      // Export via built-in ksplat downloader
      const ksplatBuffer = await (viewer as any).downloadSplatSceneToSplatBuffer?.(spzURL, 0, null, false, undefined, (GS3D as any).SceneFormat?.Spz ?? 6)
        ?? await (viewer as any).exportSplatScene?.()

      let raw: Uint8Array
      if (ksplatBuffer instanceof Uint8Array) {
        raw = ksplatBuffer
      } else if (ksplatBuffer?.bufferData) {
        raw = ksplatBuffer.bufferData
      } else {
        // fallback: grab directly from splatMesh
        const splatMesh   = (viewer as any).splatMesh
        const splatBuffer = splatMesh?.getSplatBuffers?.()?.[0] ?? splatMesh?.splatBuffers?.[0]
        if (!splatBuffer) throw new Error('No se pudo acceder al splatBuffer')
        raw = splatBuffer.bufferData ?? splatBuffer.data
      }
      if (!raw) throw new Error('No se pudo extraer los datos')

      const outBlob = new Blob([raw], { type: 'application/octet-stream' })
      const url     = URL.createObjectURL(outBlob)
      const mb      = (raw.byteLength / 1024 / 1024).toFixed(1)

      setDlUrl(url)
      setOutMB(mb)
      setStatus(`✓ Listo. ${(file.size/1024/1024).toFixed(1)} MB → ${mb} MB`)

      URL.revokeObjectURL(objectURL)
      canvas.remove()
      ;(viewer as any).dispose?.()

    } catch (err: any) {
      setStatus(`Error: ${err.message}`)
      console.error(err)
    }
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div style={{ background: '#05070D', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, fontFamily: 'monospace', padding: 32 }}>
      <h2 style={{ color: '#fff', margin: 0 }}>Convertir SPZ → KSPLAT</h2>
      <p style={{ color: '#AAB3C2', margin: 0, textAlign: 'center', maxWidth: 480 }}>
        Carga el archivo .spz. Se procesa en el navegador y puedes descargar el .ksplat resultante.
      </p>

      <div
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={e => e.preventDefault()}
        style={{
          border: '2px dashed #00B8FF', borderRadius: 16,
          padding: '40px 60px', cursor: 'pointer', textAlign: 'center',
          color: '#00B8FF', fontSize: 16,
        }}>
        📂 Arrastra .spz aquí o haz clic
        <input
          ref={inputRef} type="file" accept=".spz,.splat,.ply"
          style={{ display: 'none' }}
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        />
      </div>

      <p style={{ color: '#FFD42A', margin: 0 }}>{status}</p>

      {dlUrl && (
        <a
          href={dlUrl}
          download="scene.ksplat"
          style={{
            padding: '12px 32px',
            background: 'linear-gradient(90deg, #1B3DFF, #00B8FF)',
            color: '#fff', borderRadius: 999, fontWeight: 'bold',
            textDecoration: 'none', fontSize: 16,
          }}>
          ⬇ Descargar scene.ksplat ({outMB} MB)
        </a>
      )}
    </div>
  )
}
