import fs from 'fs'
import path from 'path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// La web es una SPA: todas las rutas sirven el mismo index.html, y los
// rastreadores de vista previa (WhatsApp, LinkedIn, Slack…) no ejecutan JS,
// así que mostraban siempre el título/descripción/imagen de la home. Este
// plugin genera, tras el build, un HTML por ruta con sus propias etiquetas
// (public/_redirects los sirve en esa URL sin cambiarla).
const ROUTE_META: Record<string, { title: string; description: string; image: string }> = {
  avatares: {
    title: 'Avatares IA — MAIGIA by Girasomnis',
    description: 'Avatares de IA que hablan, miran y conectan con tus visitantes. Catálogo, módulos, capacidades y oferta en tres niveles para eventos, ferias, hoteles y espacios.',
    image: 'og-avatares.jpg',
  },
  proyectos: {
    title: 'Proyectos — MAIGIA',
    description: 'Proyectos seleccionados de MAIGIA: avatares IA, visuales generativos e instalaciones interactivas para eventos, marcas y cultura.',
    image: 'og-default.jpg',
  },
  'aviso-legal': {
    title: 'Aviso legal — MAIGIA',
    description: 'Datos identificativos, condiciones de uso, propiedad intelectual y responsabilidad de maigia.tech.',
    image: 'og-default.jpg',
  },
  'politica-privacidad': {
    title: 'Política de privacidad — MAIGIA',
    description: 'Cómo tratamos tus datos personales: responsable, finalidad, derechos y plazo de conservación (RGPD y LOPDGDD).',
    image: 'og-default.jpg',
  },
  'politica-cookies': {
    title: 'Política de cookies — MAIGIA',
    description: 'Qué guarda maigia.tech en tu navegador: solo tu preferencia de idioma, sin cookies de publicidad ni de seguimiento.',
    image: 'og-default.jpg',
  },
}

function routeMeta(): Plugin {
  const esc = (v: string) => v.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
  return {
    name: 'route-meta',
    apply: 'build',
    enforce: 'post',
    closeBundle() {
      const dist = path.resolve(__dirname, 'dist')
      const base = fs.readFileSync(path.join(dist, 'index.html'), 'utf-8')
      for (const [slug, m] of Object.entries(ROUTE_META)) {
        const url = `https://maigia.tech/${slug}`
        const img = `https://maigia.tech/og/${m.image}`
        const set = (re: RegExp, to: string) => { if (!re.test(html)) throw new Error(`route-meta: no encuentro ${re}`); html = html.replace(re, () => to) }
        let html = base
        set(/<title>[^<]*<\/title>/, `<title>${esc(m.title)}</title>`)
        set(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(m.description)}" />`)
        set(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`)
        set(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`)
        set(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(m.title)}" />`)
        set(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(m.description)}" />`)
        set(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${img}" />`)
        set(/<meta name="twitter:url" content="[^"]*" \/>/, `<meta name="twitter:url" content="${url}" />`)
        set(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${esc(m.title)}" />`)
        set(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${esc(m.description)}" />`)
        set(/<meta name="twitter:image" content="[^"]*" \/>/, `<meta name="twitter:image" content="${img}" />`)
        fs.writeFileSync(path.join(dist, `${slug}.html`), html)
      }

      // 404.html — Netlify lo sirve con estado 404 para cualquier ruta que no
      // exista. Sin canonical y con noindex; React pinta NotFoundPage.
      let nf = base
      const put = (re: RegExp, to: string) => { if (!re.test(nf)) throw new Error(`route-meta 404: no encuentro ${re}`); nf = nf.replace(re, () => to) }
      put(/<title>[^<]*<\/title>/, '<title>Página no encontrada — MAIGIA</title>')
      put(/<meta name="robots" content="[^"]*" \/>/, '<meta name="robots" content="noindex, follow" />')
      put(/\s*<link rel="canonical" href="[^"]*" \/>/, '')
      fs.writeFileSync(path.join(dist, '404.html'), nf)
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    routeMeta(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['three'],
  },
})
