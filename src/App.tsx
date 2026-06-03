import { lazy, Suspense } from 'react'
import AiaSomnisPage from './AiaSomnisPage'

const ConvertPage = lazy(() => import('./ConvertPage'))
const SplatPage   = lazy(() => import('./SplatPage'))

function App() {
  if (window.location.pathname === '/convert') return <Suspense><ConvertPage /></Suspense>
  if (window.location.pathname === '/splat')   return <Suspense><SplatPage /></Suspense>
  return <AiaSomnisPage />
}

export default App
