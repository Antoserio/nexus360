import { lazy, Suspense } from 'react'
import AiaSomnisPage from './AiaSomnisPage'

const ConvertPage   = lazy(() => import('./ConvertPage'))
const SplatPage     = lazy(() => import('./SplatPage'))
const ProyectosPage = lazy(() => import('./ProyectosPage'))
const AvataresPage  = lazy(() => import('./AvataresPage'))

function App() {
  if (window.location.pathname === '/convert')   return <Suspense><ConvertPage /></Suspense>
  if (window.location.pathname === '/splat')     return <Suspense><SplatPage /></Suspense>
  if (window.location.pathname === '/proyectos') return <Suspense><ProyectosPage /></Suspense>
  if (window.location.pathname === '/avatares')  return <Suspense><AvataresPage /></Suspense>
  return <AiaSomnisPage />
}

export default App
