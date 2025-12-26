import React, { useState } from 'react'

const locales = {
  en: { label: 'English' },
  es: { label: 'Español' },
  de: { label: 'Deutsch' },
  fr: { label: 'Français' }
}

export default function LanguageSwitcher() {
  const [lang, setLang] = useState<'en'|'es'|'de'|'fr'>('en')
  return (
    <div className="lang-switch" aria-label="language switch">
      <select value={lang} onChange={(e) => setLang(e.target.value as any)}>
        {Object.keys(locales).map((k) => (
          <option key={k} value={k}>{(locales as any)[k].label}</option>
        ))}
      </select>
    </div>
  )
}
