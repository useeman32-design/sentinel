import { useRef, useState, useEffect } from 'react';
import { StatusBar, BottomNav } from '../components/Chrome';
import { askGemini, SENTINEL_SYSTEM } from '../services/gemini';
import { api } from '../services/api';

const STARTERS = [
  'Is this website safe?',
  'How do I secure my WhatsApp?',
  'How do scammers steal bank accounts in Nigeria?',
  'What is a SIM swap attack?',
  'How do I avoid fake BVN texts?',
];

export default function Assistant() {
  const [msgs, setMsgs] = useState([
    {
      role: 'ai',
      text: 'Hello! I am your Sentinel AI Security Advisor. How can I help you protect your accounts, analyze a suspicious message, or investigate a potential scam today?',
    },
  ]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const end = useRef(null);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, busy]);

  const send = async (value) => {
    const q = (value || text).trim();
    if (!q || busy) return;
    setText('');
    setMsgs((m) => [...m, { role: 'me', text: q }]);
    setBusy(true);

    try {
      await api.chat({ message: q });
      const gem = await askGemini({ prompt: q, system: SENTINEL_SYSTEM });
      const reply = gem.ok
        ? gem.text
        : 'Sentinel Advisor is in local security mode. For real-time cloud AI responses, configure your Gemini API key in settings or environment.';
      setMsgs((m) => [...m, { role: 'ai', text: reply }]);
    } catch {
      setMsgs((m) => [
        ...m,
        {
          role: 'ai',
          text: 'I encountered an error reaching the security backend. Please check your network connection and try again.',
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <StatusBar />
      <div className="scroll page-enter" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className="topbar">
          <div className="grow">
            <h1>Sentinel Advisor</h1>
            <p>Autonomous cybersecurity intelligence</p>
          </div>
          <span className="chip chip-safe" style={{ fontSize: 10 }}>
            Active
          </span>
        </div>

        <div className="msgs">
          {msgs.map((m, i) => (
            <div key={i} className={`bubble ${m.role}`}>
              {m.text}
            </div>
          ))}
          {busy && (
            <div className="bubble ai" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="loader" style={{ width: 16, height: 16 }} />
              <span className="tiny muted">Analyzing query...</span>
            </div>
          )}
          <div ref={end} />
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '8px 0' }}>
          {STARTERS.map((s) => (
            <button
              key={s}
              className="chip chip-info"
              style={{
                border: '1px solid var(--line)',
                background: 'var(--surface-2)',
                cursor: 'pointer',
                fontSize: 11,
              }}
              onClick={() => send(s)}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="composer">
          <textarea
            rows={1}
            placeholder="Ask anything (e.g. Is this SMS real?)..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <button className="send" onClick={() => send()} aria-label="Send message" disabled={!text.trim() || busy}>
            ↑
          </button>
        </div>
      </div>
      <BottomNav active="assistant" />
    </>
  );
}
