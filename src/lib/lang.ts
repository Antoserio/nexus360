import { useEffect, useState } from 'react'

export type Lang = 'es' | 'en'

const KEY = 'maigia-lang'

export function getLang(): Lang {
  if (typeof window === 'undefined') return 'es'
  let stored: string | null = null
  try { stored = window.localStorage.getItem(KEY) } catch { /* modo privado */ }
  return stored === 'en' ? 'en' : 'es'
}

// El atributo lang del documento debe seguir al idioma visible (lectores de
// pantalla y buscadores); antes se quedaba siempre en "es".
export function applyDocumentLang(lang: Lang) {
  if (typeof document !== 'undefined') document.documentElement.lang = lang
}

function setStoredLang(lang: Lang) {
  try { window.localStorage.setItem(KEY, lang) } catch { /* modo privado */ }
  applyDocumentLang(lang)
  window.dispatchEvent(new CustomEvent('maigia-lang-change', { detail: lang }))
}

export function useLang(): [Lang, (l: Lang) => void] {
  const [lang, setLangState] = useState<Lang>(getLang)

  useEffect(() => { applyDocumentLang(lang) }, [lang])

  useEffect(() => {
    const onChange = (e: Event) => setLangState((e as CustomEvent<Lang>).detail)
    window.addEventListener('maigia-lang-change', onChange)
    return () => window.removeEventListener('maigia-lang-change', onChange)
  }, [])

  const setLang = (l: Lang) => {
    setStoredLang(l)
    setLangState(l)
  }

  return [lang, setLang]
}
