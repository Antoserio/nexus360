// Ruta actual. En el navegador es location.pathname; durante el pre-render
// (scripts/prerender.mjs) se fija con setSSRPath antes de renderizar.
let ssrPath: string | null = null
export function setSSRPath(p: string) { ssrPath = p }
export function currentPath(): string {
  if (ssrPath !== null) return ssrPath
  return typeof window !== 'undefined' ? window.location.pathname : '/'
}
export const isServer = typeof window === 'undefined'
