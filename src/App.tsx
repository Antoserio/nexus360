import { lazy, Suspense } from 'react'
import AiaSomnisPage from './AiaSomnisPage'
import { currentPath } from '@/lib/ssrPath'

const ConvertPage   = lazy(() => import('./ConvertPage'))
const SplatPage     = lazy(() => import('./SplatPage'))
const ProyectosPage = lazy(() => import('./ProyectosPage'))
const AvataresPage  = lazy(() => import('./AvataresPage'))
const LegalPage     = lazy(() => import('./LegalPage'))
const NotFoundPage  = lazy(() => import('./NotFoundPage'))

const LEGAL_PATHS = ['/aviso-legal', '/politica-privacidad', '/politica-cookies']

function App() {
  const path = currentPath().replace(/\/+$/, '') || '/'
  if (path === '/convert')   return <Suspense><ConvertPage /></Suspense>
  if (path === '/splat')     return <Suspense><SplatPage /></Suspense>
  if (path === '/proyectos') return <Suspense><ProyectosPage /></Suspense>
  if (path === '/avatares')  return <Suspense><AvataresPage /></Suspense>
  if (LEGAL_PATHS.includes(path)) return <Suspense><LegalPage /></Suspense>
  if (path === '/' || path === '/index.html') return <AiaSomnisPage />
  return <Suspense><NotFoundPage /></Suspense>
}

export default App
