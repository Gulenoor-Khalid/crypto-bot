import React, { useEffect, useState } from 'react'

type Props = { assets: string[] }

function fakePrice(base: number) {
  return +(base * (0.995 + Math.random() * 0.01)).toFixed(2)
}

export default function LiveTicker({ assets }: Props) {
  const [prices, setPrices] = useState(
    Object.fromEntries(assets.map((a, i) => [a, 1000 * (1 + i * 0.2)]))
  )

  useEffect(() => {
    const t = setInterval(() => {
      setPrices((p) => {
        const next: any = { ...p }
        assets.forEach((a, idx) => {
          next[a] = fakePrice(next[a])
        })
        return next
      })
    }, 1200)
    return () => clearInterval(t)
  }, [assets])

  return (
    <div className="live-ticker" aria-label="live tickers">
      {assets.map((a, i) => (
        <div key={a} className="ticker-item">
          <span className="sym">{a}</span>
          <span className="price">{prices[a]?.toFixed(2) ?? '0.00'}</span>
        </div>
      ))}
    </div>
  )
}
