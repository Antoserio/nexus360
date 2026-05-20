import { Navbar } from '@/components/Navbar'
import { AnimatedShaderHero } from '@/components/ui/animated-shader-hero'
import { SplineScene } from '@/components/ui/spline-scene'
import { NexusSection } from '@/components/NexusSection'
import { Services } from '@/components/Services'
import { Process } from '@/components/Process'
import { Portfolio } from '@/components/Portfolio'
import { Testimonials } from '@/components/Testimonials'
import { CtaSection } from '@/components/CtaSection'
import { Footer } from '@/components/Footer'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <AnimatedShaderHero
          headline1="Transforma Tu Negocio"
          headline2="Con IA y Automatización"
          subtitle="IMMERSO Studio — Webs premium, SEO y agentes de IA para empresas que quieren destacar."
        />
        <SplineScene />
        <NexusSection />
        <Services />
        <Process />
        <Portfolio />
        <Testimonials />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}

export default App
