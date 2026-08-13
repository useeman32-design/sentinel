import { useRef, useState } from 'react';
import { StatusBar, BottomNav } from '../components/Chrome';
import { askGemini, SENTINEL_SYSTEM } from '../services/gemini';
import { api } from '../services/api';

const STARTERS = [
  'Is this website safe?',
  'How do I secure my WhatsApp?',
  'How do hackers steal bank accounts?',
  'What is ransomware?',
  'How do I avoid phishing?',
];

export default function Assistant() {
  const [msgs, setMsgs] = useState([
    {
      role: 'ai',
      text: 'I’m Sentinel’s security assistant. Ask about scams, account takeover, or a suspicious message. Live Gemini replies activate when the API key is set.',
    },
  ]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const end = useRef(null);

  const send = async (value) => {
    const q = (value || text).trim();
    if (!q || busy) return;
    setText('');
    setMsgs((m) => [...m, { role: 'me', text: q }]);
    setBusy(true);
    await api.chat({ message: q });
    const gem = await askGemini({ prompt: q, system: SENTINEL_SYSTEM });
    const reply = gem.ok
      ? gem.text
      : 'Gemini is not connected yet. Add VITE_GEMINI_API_KEY or wire /api/chat on the PHP backend. I will not invent an answer.';
    setMsgs((m) => [...m, { role: 'ai', text: reply }]);
    setBusy(false);
    setTimeout(() => end.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  return (
    <>
      <StatusBar />
      <div className="scroll page-enter" style={{ display: 'flex', flexDirection: 'column', paddingBottom: 96 }}>
        <div className="topbar">
          <div className="grow">
            <h1>Assistant</h1>
            <p>Cybersecurity, in plain language</p>
          </div>
        </div>
        <div className="msgs">
          {msgs.map((m, i) => (
            <div key={i} className={`bubble ${m.role}`}>
              {m.text}
            </div>
          ))}
          {busy && (
            <div className="bubble ai">
              <span className="loader" />
            </div>
          )}
          <div ref={end} />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
          {STARTERS.map((s) => (
            <button key={s} className="chip chip-info" style={{ border: 0 }} onClick={() => send(s)}>
              {s}
            </button>
          ))}
        </div>
        <div className="composer">
          <textarea
            rows={1}
            placeholder="Ask Sentinel…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <button className="send" onClick={() => send()} aria-label="Send">
            ↑
          </button>
        </div>
      </div>
      <BottomNav active="assistant" />
    </>
  );
}
