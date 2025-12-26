import React from 'react'
import LiveTicker from './LiveTicker'

type Props = {
  onLaunch: () => void
  onDemo: () => void
}

export default function Landing({ onLaunch }: Props) {
  return (
    <div className="landing-page">
      <header className="header">
        <div className="logo">BluePulse</div>
        <nav className="nav">
          <span>Home</span><span>How It Works</span><span>Trading Bot</span><span>Pricing</span><span>FAQ</span>
        </nav>
        <div className="cta-group">
          <button className="btn" onClick={onLaunch}>Launch Trading Bot Demo</button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-left">
          <h1>Automated Crypto Trading. Smarter. Safer. Simpler.</h1>
          <p>AI-powered trading for all levels. Sophisticated automation with a clean, investor-ready UI.</p>
          <button className="btn" onClick={onLaunch}>Launch Trading Bot Demo</button>
        </div>
        <div className="hero-right">
          <div className="card demo-preview">
            <div className="demo-header">
              <span>Demo Dashboard</span>
              <span className="badge green">LIVE MOCK</span>
            </div>
            <div className="demo-body">
              <LiveTicker assets={['BTC','ETH','SOL']} />
              <div className="chart-sim" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
