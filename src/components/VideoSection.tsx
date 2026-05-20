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
    <section className="relative w-full bg-[#010305] py-16 px-6">
      <div className="max-w-5xl mx-auto">

        <p className="font-mono text-xs tracking-[0.3em] text-[#00d4ff]/50 uppercase mb-6 text-center">
          {'// NEXUS_360 — SHOWREEL'}
        </p>

        <div
          className="relative rounded-2xl overflow-hidden border border-white/10"
          style={{ boxShadow: '0 0 64px rgba(0,212,255,0.10), inset 0 0 0 1px rgba(255,255,255,0.07)' }}
        >
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
          <div className="absolute inset-0 bg-gradient-to-t from-[#010305]/60 via-transparent to-transparent pointer-events-none" />
          <button
            onClick={toggleMute}
            aria-label={muted ? 'Activar sonido' : 'Silenciar'}
            className="absolute bottom-4 right-4 flex items-center justify-center size-9 rounded-full bg-black/50 border border-white/15 text-white backdrop-blur-sm hover:bg-black/70 transition-colors z-10"
          >
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
        </div>
      </div>
    </section>
  )
}
