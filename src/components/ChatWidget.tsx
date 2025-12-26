import React, { useEffect, useState } from 'react'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<{ from: 'bot'|'user'; text: string }[]>[
    { from: 'bot', text: 'Hi! I see you’ve started a Medium/Low-risk setup. Need help?' }
  ]
  const [input, setInput] = useState('')

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => {
        setMessages((m) => [...m, { from: 'bot', text: 'Tip: Use the Budget slider in onboarding to tune volatility.' }])
      }, 1200)
      return () => clearTimeout(t)
    }
  }, [open])

  const send = () => {
    if (!input.trim()) return
    setMessages((m) => [...m, { from: 'user', text: input }])
    setInput('')
    setTimeout(() => {
      setMessages((m) => [...m, { from: 'bot', text: 'Got it — I’ll factor that into the next signal.' }])
    }, 600)
  }

  return (
    <div className={`chat-widget ${open ? 'open' : ''}`} aria-label="chat assistant">
      {!open && (
        <button className="btn chat-toggle" onClick={() => setOpen(true)}>💬 Chat</button>
      )}
      {open && (
        <div className="chat-panel card">
          <div className="chat-header">
            <strong>Trading Assistant</strong>
            <button className="btn ghost" onClick={() => setOpen(false)}>Close</button>
          </div>
          <div className="chat-log" aria-live="polite">
            {messages.map((m, idx) => (
              <div key={idx} className={`message ${m.from}`}>
                <span className="bubble">{m.text}</span>
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key==='Enter' && send()} placeholder="Ask a question…" />
            <button className="btn" onClick={send}>Send</button>
          </div>
          <div className="meta">Multilingual: English / Español / Deutsch / Français</div>
        </div>
      )}
    </div>
  )
}
