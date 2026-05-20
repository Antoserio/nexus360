import { Navbar } from '@/components/Navbar'
import { AnimatedShaderHero } from '@/components/ui/animated-shader-hero'
import { VideoSection } from '@/components/VideoSection'
import { NexusSection } from '@/components/NexusSection'
import { Footer } from '@/components/Footer'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <AnimatedShaderHero />
        <VideoSection />
        <NexusSection />
      </main>
      <Footer />
    </>
  )
}

export default App
