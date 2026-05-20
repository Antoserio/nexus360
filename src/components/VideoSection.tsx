import { useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

export function VideoSection() {
  const [muted, setMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  function toggleMute() {
    setMuted(m => {
      if (videoRef.current) videoRef.current.muted = !m
      return !m
    })
  }

  return (
    <section className="relative w-full bg-[#010305]">

      <p className="font-mono text-xs tracking-[0.3em] text-[#00d4ff]/50 uppercase text-center py-10">
        {'// NEXUS_360 — SHOWREEL'}
      </p>

      {/* Video full-bleed, natural aspect ratio, no cropping */}
      <div className="relative w-full">
        <video
          ref={videoRef}
          src="/Hero.mp4"
          autoPlay
          loop
          muted={muted}
          playsInline
          preload="none"
          className="w-full h-auto block"
        />

        {/* Mute toggle */}
        <button
          onClick={toggleMute}
          aria-label={muted ? 'Activar sonido' : 'Silenciar'}
          className="absolute bottom-4 right-4 flex items-center justify-center size-9 rounded-full bg-black/50 border border-white/15 text-white backdrop-blur-sm hover:bg-black/70 transition-colors z-10"
        >
          {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </button>
      </div>

      {/* Subtle bottom fade into next section */}
      <div className="h-12 bg-gradient-to-b from-[#010305] to-black" />
    </section>
  )
}
