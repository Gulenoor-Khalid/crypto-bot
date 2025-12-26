export type AssetSymbol = 'BTC' | 'ETH' | 'SOL'
export type RiskLevel = 'Low' | 'Medium' | 'High'

export interface AssetState {
  symbol: AssetSymbol
  price: number
  history: number[]
  change24h: number
}
export interface TradeLog {
  time: string
  asset: AssetSymbol
  type: 'BUY' | 'SELL'
  amount: number
  price: number
  pnl: number
}
export interface BotConfig {
  budget: number
  category: 'Beginner'|'Intermediate'|'Pro'
  risk: RiskLevel
  assets: AssetSymbol[]
}
export interface PortfolioPosition {
  amount: number
  avgPrice: number
}
export interface Portfolio {
  value: number
  cash: number
  dailyPnl: number
  positions: Record<AssetSymbol, PortfolioPosition>
}
export interface BotUIState {
  assets: AssetState[]
  logs: TradeLog[]
  portfolio: Portfolio
  signals: string[]
  running: boolean
  time: number
}

type UpdateFn = (state: BotUIState) => void

export class BotEngine {
  private timer?: number
  private onUpdate: UpdateFn
  private cfg: BotConfig
  private state: BotUIState
  private tickMs: number = 1500

  constructor(cfg: BotConfig, initialAssets: AssetState[], onUpdate: UpdateFn) {
    this.cfg = cfg
    this.state = {
      assets: initialAssets,
      logs: [],
      portfolio: {
        value: cfg.budget,
        cash: cfg.budget,
        dailyPnl: 0,
        positions: cfg.assets.reduce((acc, a) => {
          acc[a] = { amount: 0, avgPrice: 0 }
          return acc
        }, {} as Record<AssetSymbol, PortfolioPosition>)
      },
      signals: [],
      running: false,
      time: 0
    }
    this.onUpdate = onUpdate
  }

  start() {
    if (this.timer) return
    this.state.running = true
    this.emit()
    this.timer = window.setInterval(() => this.tick(), this.tickMs)
  }

  pause() {
    if (this.timer) {
      window.clearInterval(this.timer)
      this.timer = undefined
    }
    this.state.running = false
  }

  stop() {
    this.pause()
    this.state.logs = []
    this.state.portfolio.value = this.cfg.budget
    this.state.portfolio.cash = this.cfg.budget
    this.state.portfolio.dailyPnl = 0
    this.state.assets.forEach(a => {
      a.history = a.history.slice(-100)
    })
    this.state.signals = []
    this.emit()
  }

  private tick() {
    this.state.assets.forEach(a => {
      const next = this.nextPrice(a.price, this.mapVolatility())
      a.price = next
      a.history.push(next)
      if (a.history.length > 100) a.history.shift()
    })

    if (Math.random() < this.tradeChance()) {
      this.generateTrade()
    }

    this.state.time += 1
    this.emit()
  }

  private emit() {
    this.onUpdate(this.state)
  }

  private mapVolatility() {
    switch (this.cfg.risk) {
      case 'Low': return 0.003
      case 'Medium': return 0.007
      case 'High': return 0.015
    }
  }

  private nextPrice(cur: number, vol: number) {
    const drift = (Math.random() - 0.5) * vol * 2
    const shock = cur * drift
    const next = Math.max(0.1, cur + shock)
    return Number(next.toFixed(2))
  }

  private tradeChance() {
    const base = 0.25
    const riskFactor = this.cfg.risk === 'Low' ? 0.5 : this.cfg.risk === 'Medium' ? 0.9 : 1.4
    const catFactor = this.cfg.category === 'Beginner' ? 0.6 : this.cfg.category === 'Intermediate' ? 1.0 : 1.3
    return base * riskFactor * catFactor * (Math.random() * 0.9 + 0.4) < 0.9
  }

  private generateTrade() {
    const assetIndex = Math.floor(Math.random() * this.state.assets.length)
    const asset = this.state.assets[assetIndex]
    const maxTradeSize = Math.max(0.001 * this.cfg.budget, 0.001 * asset.price)
    const amount = Number((Math.random() * maxTradeSize).toFixed(6))
    const price = asset.price
    const type: 'BUY'|'SELL' = Math.random() > 0.5 ? 'BUY' : 'SELL'
    const pos = this.state.portfolio.positions[asset.symbol]

    const deltaCash = price * amount
    let pnl = 0
    if (type === 'BUY') {
      if (this.state.portfolio.cash >= deltaCash) {
        const totalCost = pos.amount * pos.avgPrice + amount * price
        pos.amount += amount
        pos.avgPrice = totalCost / pos.amount
        this.state.portfolio.cash -= deltaCash
        this.state.portfolio.value = this.sumPortfolioValue()
      } else {
        return
      }
    } else {
      if (pos.amount >= amount) {
        pos.amount -= amount
        pnl = (price - pos.avgPrice) * amount
        this.state.portfolio.cash += deltaCash
        this.state.portfolio.value = this.sumPortfolioValue()
        if (pos.amount === 0) pos.avgPrice = 0
      } else {
        return
      }
    }

    const log = {
      time: new Date().toLocaleTimeString(),
      asset: asset.symbol,
      type,
      amount,
      price,
      pnl: Number(pnl.toFixed(2))
    } as TradeLog
    this.state.logs.push(log)

    if (Math.random() < 0.4) {
      this.state.signals.push(type === 'BUY' ? 'Bullish Momentum Detected' : 'Profit-taking Opportunity')
      setTimeout(() => {
        this.state.signals.shift()
        this.emit()
      }, 1800)
    }

    this.state.portfolio.value = this.sumPortfolioValue()
  }

  private sumPortfolioValue() {
    let positionsValue = 0
    for (const a of this.state.assets) {
      const pos = this.state.portfolio.positions[a.symbol]
      positionsValue += pos.amount * a.price
    }
    return Math.max(0, this.state.portfolio.cash + positionsValue)
  }
}
