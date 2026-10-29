// Inserta el HTML pre-renderado dentro de <div id="root"> de cada página de
// dist/. Si una ruta falla al renderizar, se deja como estaba (la web sigue
// funcionando igual que antes, solo sin el texto en el HTML inicial).
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const dist = path.resolve('dist')
const ssrEntry = path.resolve('dist-ssr/entry-server.js')
const { render } = await import(pathToFileURL(ssrEntry).href)

const ROUTES = [
  ['/', 'index.html'],
  ['/avatares', 'avatares.html'],
  ['/proyectos', 'proyectos.html'],
  ['/aviso-legal', 'aviso-legal.html'],
  ['/politica-privacidad', 'politica-privacidad.html'],
  ['/politica-cookies', 'politica-cookies.html'],
]

let failed = 0
for (const [route, file] of ROUTES) {
  const f = path.join(dist, file)
  try {
    const html = fs.readFileSync(f, 'utf8')
    if (!html.includes('<div id="root"></div>')) throw new Error('no encuentro <div id="root"></div>')
    const body = await render(route)
    fs.writeFileSync(f, html.replace('<div id="root"></div>', () => `<div id="root">${body}</div>`))
    console.log(`prerender ${route} → ${file} (${(body.length / 1024).toFixed(0)} KB)`)
  } catch (e) {
    failed++
    console.warn(`prerender ${route} FALLÓ, se deja sin pre-render:`, e?.message ?? e)
  }
}
fs.rmSync(path.resolve('dist-ssr'), { recursive: true, force: true })
if (failed) console.warn(`prerender: ${failed} ruta(s) sin pre-render`)
