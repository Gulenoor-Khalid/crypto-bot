import React, { useEffect, useMemo, useState } from 'react'
import { BotEngine, BotConfig, AssetState, TradeLog } from '../engine/botEngine'

type Props = {
  cfg: {
    budget: number
    category: string
    risk: string
    assets: string[]
  }
}

export default function BotDashboard({ cfg }: Props) {
  // initial assets (mocked)
  const assetsSeed: AssetState[] = (cfg.assets ?? ['BTC','ETH','SOL']).map((s, idx) => ({
    symbol: s as any,
    price: 1000 * (1 + idx * 0.3),
    history: [],
    change24h: Math.random() * 4
  }))

  const [state, setState] = useState<any>({
    assets: assetsSeed,
    logs: [] as TradeLog[],
    portfolio: {
      value: cfg.budget,
      cash: cfg.budget,
      dailyPnl: 0,
      positions: (cfg.assets ?? ['BTC','ETH','SOL']).reduce((acc: any, a: string) => {
        acc[a] = { amount: 0, avgPrice: 0 }
        return acc
      }, {})
    },
    signals: [],
    running: false,
    time: 0
  })

  useEffect(() => {
    const assetsForEngine = assetsSeed.map(a => ({
      symbol: a.symbol as any,
      price: a.price,
      history: a.history
    }))

    const engineCfg: BotConfig = {
      budget: cfg.budget,
      category: cfg.category,
      risk: cfg.risk as any,
      assets: (cfg.assets ?? ['BTC','ETH','SOL']) as any
    }

    const engine = new BotEngine(engineCfg, assetsForEngine, (ns: any) => {
      setState(ns)
    })

    engine.start()
    return () => engine.stop()
  }, []) // once

  const portfolioValue = useMemo(() => {
    return state.portfolio?.value ?? cfg.budget
  }, [state.portfolio?.value, cfg.budget])

  return (
    <div className="dashboard-page">
      <header className="header">
        <div className="logo">BluePulse</div>
        <div className="ticker-row">
          {(state.assets || []).map((a: any) => (
            <div key={a.symbol} className="ticker-mini">
              <span className="sym">{a.symbol}</span>
              <span className="price">{a.price?.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </header>

      <main className="grid-3col">
        {/* LEFT: Bot Controls */}
        <section className="card panel left">
          <h3>Bot Controls</h3>
          <div className="stat-grid">
            <div className="stat">
              <span className="label">Selected Budget</span>
              <span className="value">${cfg.budget?.toLocaleString?.() ?? '0'}</span>
            </div>
            <div className="stat">
              <span className="label">User Level</span>
              <span className="value">{cfg.category}</span>
            </div>
            <div className="stat">
              <span className="label">Risk Level</span>
              <span className="value">{cfg.risk}</span>
            </div>
          </div>

          <div className="section">
            <div className="section-title">Selected Cryptos</div>
            <div className="crypto-chips">
              {(cfg.assets ?? []).map((a) => (
                <span key={a} className="chip">{a}</span>
              ))}
            </div>
          </div>

          <div className="section">
            <div className="section-title">Strategy Summary</div>
            <div className="summary">
              Auto-trading bot using ${cfg.budget} budget with {cfg.category} profile and {cfg.risk} risk.
            </div>
          </div>

          <div className="actions">
            <button className="btn play" onClick={() => alert('Demo: Bot started in dashboard.')}>▶ Start Bot</button>
            <button className="btn ghost" onClick={() => alert('Demo: Bot paused.')}>⏸ Pause</button>
            <button className="btn danger" onClick={() => alert('Demo: Bot stopped.')}>⛔ Stop</button>
          </div>

          <div className="status">
            <span className="dot" /> Scanning Market…
          </div>
        </section>

        {/* CENTER: Live Activity */}
        <section className="card panel center">
          <h3>Live Trading Activity</h3>

          <div className="chart-area" aria-label="live chart">
            <svg width="100%" height="150" viewBox="0 0 600 150">
              {state.assets.map((a: any, idx: number) => {
                const history = (a.history || []).slice(-40)
                if (!history.length) return null
                const w = 600 / history.length
                const max = Math.max(...history, 1)
                const min = Math.min(...history, 0)
                const points = history.map((v: number, i: number) => {
                  const x = i * w
                  const y = 140 - ((v - min) / (max - min)) * 120
                  return `${x},${y}`
                }).join(' ')
                const color = idx === 0 ? '#1E6AE1' : idx === 1 ? '#4DA3FF' : '#0A2540'
                return (
                  <polyline key={idx} fill="none" stroke={color} strokeWidth={2} points={points} />
                )
              })}
            </svg>
          </div>

          <div className="logs" role="log" aria-label="trade logs">
            {state.logs.slice(-8).map((l: TradeLog, i: number) => (
              <div key={i} className="log-item">
                <span className="time">{l.time}</span>
                <span className="asset">{l.asset}</span>
                <span className="type">{l.type}</span>
                <span className="amount">{l.amount.toFixed(4)}</span>
                <span className="price">{l.price.toFixed(2)}</span>
                <span className={`pnl ${l.pnl >= 0 ? 'gain' : 'loss'}`}>{l.pnl >= 0 ? '+' : ''}{l.pnl.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* RIGHT: Performance Metrics */}
        <section className="card panel right">
          <h3>Performance Metrics</h3>

          <div className="metric-grid">
            <div className="metric">
              <span className="label">Portfolio Value</span>
              <span className="value">${portfolioValue?.toLocaleString?.() ?? '0'}</span>
            </div>
            <div className="metric">
              <span className="label">Daily P&L</span>
              <span className="value">{state.portfolio?.dailyPnl?.toFixed?.(2) ?? '0.00'}</span>
            </div>
            <div className="metric">
              <span className="label">Win Rate</span>
              <span className="value">72%</span>
            </div>
            <div className="metric">
              <span className="label">Risk Exposure</span>
              <span className="value"> Moderate</span>
            </div>
          </div>

          <div className="section">
            <div className="section-title">Asset Allocation</div>
            <div className="pie" aria-label="asset allocation chart">
              {state.assets.map((a: any, i: number) => (
                <div key={a.symbol} className="slice" style={{
                  height: `${Math.min(40 + i * 12, 90)}%`,
                  background: i === 0 ? '#1E6AE1' : i === 1 ? '#4DA3FF' : '#0A2540'
                }} title={`${a.symbol}: ${((i+1)*20).toFixed(0)}%`}></div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <ChatWidget />
    </div>
  )
}
