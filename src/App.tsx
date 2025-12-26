import React, { useState } from 'react'
import Landing from './components/Landing'
import BotDashboard from './components/BotDashboard'
import OnboardingWizard from './components/OnboardingWizard'
import LanguageSwitcher from './components/LanguageSwitcher'

type View = 'landing' | 'onboarding' | 'dashboard'

export default function App() {
  const [view, setView] = useState<View>('landing')
  const [cfg, setCfg] = useState({
    budget: 1000,
    category: 'Beginner',
    risk: 'Low',
    assets: ['BTC', 'ETH', 'SOL'] as string[]
  })

  const startDashboard = (newCfg: any) => {
    setCfg(newCfg)
    setView('dashboard')
  }

  return (
    <div className="app">
      <LanguageSwitcher />
      {view === 'landing' && (
        <Landing onLaunch={() => setView('onboarding')} onDemo={() => setView('dashboard')} />
      )}
      {view === 'onboarding' && (
        <OnboardingWizard
          initial={cfg}
          onComplete={(payload) => startDashboard(payload)}
          onBack={() => setView('landing')}
        />
      )}
      {view === 'dashboard' && (
        <BotDashboard cfg={cfg} />
      )}
    </div>
  )
}
