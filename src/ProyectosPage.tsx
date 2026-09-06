import { useEffect } from 'react'
import { FxSlider, type SliderItem } from '@/components/ui/fx-slider'
import { GlowCursor, CursorParticles } from './components/GlowCursor'

const C = {
  bg: '#05070D', blue: '#00B8FF', white: '#F4F7FB', border: '#223044',
}

// TODO: proyectos reales — de momento mismo listado que la home, se actualizará
const PROJECTS: SliderItem[] = [
  {
    num: '01', year: '2026', accent: '#00B8FF',
    title: 'Avatar Viky · MAIGIA', category: 'Avatares IA',
    bg: `url('/viky-fluge.jpg') center/cover no-repeat`,
  },
  {
    num: '02', year: '2024', accent: '#22D3FF',
    title: 'Canet Rock IA', category: 'Visuales Generativos',
    bg: `url('https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop') center/cover no-repeat`,
  },
  {
    num: '03', year: '2024', accent: '#FFD42A',
    title: 'Quiniela Planeta', category: 'Instalación Interactiva',
    bg: `url('https://images.pexels.com/photos/2387418/pexels-photo-2387418.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop') center/cover no-repeat`,
  },
  {
    num: '04', year: '2026', accent: '#F6B93B',
    title: 'Mia · Avatar para Fluge Audiovisuales', category: 'Avatares IA',
    bg: `url('/mia-fluge.jpg') center 18%/cover no-repeat`,
  },
  {
    num: '05', year: '2023', accent: '#1B3DFF',
    title: 'Interactivos Táctiles', category: 'Instalación Interactiva',
    bg: `url('https://images.pexels.com/photos/3756165/pexels-photo-3756165.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop') center/cover no-repeat`,
  },
]

export default function ProyectosPage() {
  useEffect(() => {
    document.title = 'Proyectos — MAIGIA'
    const canonical = document.querySelector('link[rel="canonical"]')
    canonical?.setAttribute('href', 'https://maigia.tech/proyectos')
  }, [])

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <GlowCursor />
      <CursorParticles />
      <header style={{
        position: 'fixed', top: 0, insetInline: 0, zIndex: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 28px',
      }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/maigia-logo-girasomnis.png" alt="MAIGIA by Girasomnis" style={{ height: 50, width: 'auto' }} />
        </a>
        <a href="/" style={{
          color: C.white, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.15em',
          textDecoration: 'none', border: `1px solid ${C.border}`, borderRadius: 999,
          padding: '8px 18px', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          ← Volver
        </a>
      </header>

      <FxSlider items={PROJECTS} headerText="Proyectos" duration={0.64} parallaxAmount={5} />
    </div>
  )
}
