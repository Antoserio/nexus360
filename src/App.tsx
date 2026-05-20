import { Navbar } from '@/components/Navbar'
import { AnimatedShaderHero } from '@/components/ui/animated-shader-hero'
import { SplineScene } from '@/components/ui/spline-scene'
import { NexusSection } from '@/components/NexusSection'
import { Footer } from '@/components/Footer'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <AnimatedShaderHero />
        <SplineScene />
        <NexusSection />
      </main>
      <Footer />
    </>
  )
}

export default App
