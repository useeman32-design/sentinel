import { useNavigate } from 'react-router-dom';
import { Ico } from './Icons';

export function StatusBar() {
  const now = new Date();
  const t = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <div className="statusbar">
      <span>{t}</span>
      <div className="sb-icons">
        <svg width="15" height="12" viewBox="0 0 15 12" fill="currentColor">
          <rect x="0" y="8" width="2.2" height="4" rx="0.4" />
          <rect x="3.4" y="5.5" width="2.2" height="6.5" rx="0.4" />
          <rect x="6.8" y="3" width="2.2" height="9" rx="0.4" />
          <rect x="10.2" y="0.5" width="2.2" height="11.5" rx="0.4" opacity=".35" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M1 4.5c3.5-3.4 10.5-3.4 14 0" />
          <path d="M3.5 7c2.2-2 6.8-2 9 0" />
          <circle cx="8" cy="10" r="1.1" fill="currentColor" />
        </svg>
        <svg width="22" height="12" viewBox="0 0 22 12">
          <rect x="0.5" y="1" width="18" height="10" rx="2.4" stroke="currentColor" fill="none" />
          <rect x="2" y="2.6" width="12" height="7" rx="1.2" fill="currentColor" />
          <rect x="19.2" y="4" width="1.6" height="4" rx="0.5" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}

export function TopBar({ title, subtitle, back, right }) {
  const nav = useNavigate();
  return (
    <div className="topbar">
      {back ? (
        <button className="icon-btn" onClick={() => nav(-1)} aria-label="Back">
          {Ico.back}
        </button>
      ) : null}
      <div className="grow">
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {right}
    </div>
  );
}

export function BottomNav({ active }) {
  const nav = useNavigate();
  const go = (p) => () => nav(p);
  return (
    <nav className="bottom-nav glass">
      <button className={`nav-item ${active === 'home' ? 'active' : ''}`} onClick={go('/app/home')}>
        {Ico.home}
        <span>Home</span>
      </button>
      <button className={`nav-item ${active === 'scan' ? 'active' : ''}`} onClick={go('/app/scan')}>
        {Ico.scan}
        <span>Scan</span>
      </button>
      <button className="nav-item center" onClick={go('/app/assistant')} aria-label="AI Assistant">
        {Ico.bot}
      </button>
      <button className={`nav-item ${active === 'intel' ? 'active' : ''}`} onClick={go('/app/intel')}>
        {Ico.intel}
        <span>Intel</span>
      </button>
      <button className={`nav-item ${active === 'more' ? 'active' : ''}`} onClick={go('/app/more')}>
        {Ico.more}
        <span>More</span>
      </button>
    </nav>
  );
}

export function Verdict({ result }) {
  if (!result) return null;
  const cls = result.verdict === 'Safe' ? 'chip-safe' : result.verdict === 'Suspicious' ? 'chip-warn' : 'chip-bad';
  return (
    <div className="card page-enter" style={{ marginTop: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className={`chip ${cls}`}>{result.verdict}</span>
        <b style={{ fontFamily: 'var(--display)', fontSize: 28 }}>{result.riskScore}</b>
      </div>
      <p className="tiny muted" style={{ margin: '6px 0 10px' }}>
        Risk score · {result.threatType}
      </p>
      <p style={{ margin: 0, lineHeight: 1.5, fontSize: 14 }}>{result.explanation}</p>
      <div className="card" style={{ marginTop: 12, background: 'var(--surface-2)', padding: 12 }}>
        <div className="tiny muted" style={{ marginBottom: 4 }}>
          RECOMMENDATION
        </div>
        {result.recommendation}
      </div>
      <div className="sources">
        {(result.sources || [result.source]).filter(Boolean).map((s) => (
          <span className="chip chip-info" key={s}>
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
