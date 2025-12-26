import React, { useState } from 'react'

type Props = {
  initial: { budget: number; category: string; risk: string; assets: string[] }
  onComplete: (cfg: any) => void
  onBack: () => void
}

export default function OnboardingWizard({ initial, onComplete, onBack }: Props) {
  const [step, setStep] = useState(1)
  const [budget, setBudget] = useState<number>(initial.budget)
  const [category, setCategory] = useState<string>(initial.category)
  const [risk, setRisk] = useState<string>(initial.risk)
  const [assets] = useState<string[]>(initial.assets)

  const next = () => {
    if (step < 3) setStep(step + 1)
    else onComplete({ budget, category, risk, assets })
  }
  const presets = [500, 1000, 5000, 10000]

  return (
    <div className="onboard-modal">
      <div className="card onboarding-card">
        <div className="onboard-header">
          <h3>Set Up Your Demo Bot</h3>
        </div>

        {step === 1 && (
          <div className="step">
            <div className="step-title">STEP 1 · Budget</div>
            <input
              type="range"
              min={100}
              max={100000}
              value={budget}
              onChange={(e) => setBudget(parseInt(e.target.value))}
            />
            <div className="budget-display">${budget.toLocaleString()}</div>
            <div className="presets">
              {presets.map((p) => (
                <button key={p} className="preset" onClick={() => setBudget(p)}>
                  ${p.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="step">
            <div className="step-title">STEP 2 · User Category</div>
            <div className="cards-row">
              {['Beginner','Intermediate','Pro'].map((c) => (
                <div key={c} className={`card category-card ${category===c?'selected':''}`}
                     onClick={() => setCategory(c)}>
                  <div className="icon">🎯</div>
                  <div className="name">{c}</div>
                  <div className="desc">
                    {c==='Beginner' && 'Lower frequency trades, conservative'}
                    {c==='Intermediate' && 'Balanced trading'}
                    {c==='Pro' && 'Aggressive, higher frequency'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="step">
            <div className="step-title">STEP 3 · Risk Level</div>
            <div className="risk-cards">
              {['Low','Medium','High'].map((r) => (
                <div key={r} className={`risk-card ${risk===r?'active':''}`} onClick={() => setRisk(r)}>
                  <div className="risk-num">{r}</div>
                  <div className="vol">{r==='Low'?'20–30%':r==='Medium'?'40–60%':'70–90%'}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="onboard-actions">
          <button className="btn ghost" onClick={onBack}>Back</button>
          <button className="btn" onClick={next}>
            {step < 3 ? 'Next' : 'Launch Demo Bot'}
          </button>
        </div>
      </div>
    </div>
  )
}
