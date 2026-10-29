import { Component, type ReactNode } from 'react'

// Si la escena 3D (Spline) falla al descargarse —red lenta, bloqueador,
// caída del proveedor— el error subía hasta la raíz y React desmontaba TODA
// la página (pantalla en negro). Este límite aísla el fallo: se pierde el
// robot, pero el texto, los servicios y el contacto siguen disponibles.
export class SceneBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(err: unknown) { console.warn('[MAIGIA] Escena 3D no disponible:', err) }
  render() { return this.state.failed ? (this.props.fallback ?? null) : this.props.children }
}
