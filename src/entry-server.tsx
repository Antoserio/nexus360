// Pre-render en build (F08 de la auditoría): genera el HTML de cada ruta con
// los MISMOS componentes que usa la web, para que buscadores y rastreadores
// de IA que no ejecutan JavaScript lean el contenido real. En el navegador,
// main.tsx usa createRoot, que sustituye este HTML al montar.
import { StrictMode } from 'react'
import { prerenderToNodeStream } from 'react-dom/static'
import App from './App'
import { setSSRPath } from '@/lib/ssrPath'

export async function render(path: string): Promise<string> {
  setSSRPath(path)
  const { prelude } = await prerenderToNodeStream(<StrictMode><App /></StrictMode>)
  const chunks: Buffer[] = []
  for await (const c of prelude) chunks.push(Buffer.from(c))
  return Buffer.concat(chunks).toString('utf8')
}
