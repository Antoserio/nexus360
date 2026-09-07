import { useEffect, useState } from 'react'

export type Lang = 'es' | 'en'

const KEY = 'maigia-lang'

export function getLang(): Lang {
  if (typeof window === 'undefined') return 'es'
  const stored = window.localStorage.getItem(KEY)
  return stored === 'en' ? 'en' : 'es'
}

function setStoredLang(lang: Lang) {
  window.localStorage.setItem(KEY, lang)
  window.dispatchEvent(new CustomEvent('maigia-lang-change', { detail: lang }))
}

export function useLang(): [Lang, (l: Lang) => void] {
  const [lang, setLangState] = useState<Lang>(getLang)

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
