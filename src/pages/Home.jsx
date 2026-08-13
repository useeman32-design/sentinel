import { useNavigate } from 'react-router-dom';
import { StatusBar, TopBar, BottomNav } from '../components/Chrome';
import { Ico } from '../components/Icons';
import { useApp } from '../state/AppState';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const THREATS = [4, 7, 5, 12, 8, 6, 9];
const CATS = [
  { n: 'Phish', v: 38 },
  { n: 'SMS', v: 24 },
  { n: 'Malware', v: 18 },
  { n: 'Fraud', v: 20 },
];

function Ring({ value }) {
  const r = 62;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <div className="score-wrap">
      <svg width="148" height="148" viewBox="0 0 148 148">
        <circle cx="74" cy="74" r={r} stroke="rgba(255,255,255,.06)" strokeWidth="10" fill="none" />
        <circle
          cx="74"
          cy="74"
          r={r}
          stroke="url(#g)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
          transform="rotate(-90 74 74)"
        />
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00FF88" />
            <stop offset="100%" stopColor="#00C8FF" />
          </linearGradient>
        </defs>
      </svg>
      <div className="score-num">
        <div>
          <strong>{value}</strong>
          <small>Security score</small>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { user } = useApp();
  const nav = useNavigate();
  return (
    <>
      <StatusBar />
      <div className="scroll page-enter">
        <TopBar
          title={`Hi, ${user?.name?.split(' ')[0] || 'there'}`}
          subtitle="Nigeria threat desk · live"
          right={
            <button className="icon-btn" onClick={() => nav('/app/notifications')}>
              {Ico.bell}
            </button>
          }
        />

        <div className="card" style={{ textAlign: 'center' }}>
          <Ring value={86} />
          <div className="grid-3" style={{ marginTop: 8 }}>
            <div>
              <b>128</b>
              <div className="tiny muted">Threats</div>
            </div>
            <div>
              <b>91</b>
              <div className="tiny muted">Blocked</div>
            </div>
            <div>
              <span className="chip chip-safe">Low</span>
              <div className="tiny muted" style={{ marginTop: 4 }}>
                Risk
              </div>
            </div>
          </div>
        </div>

        <div className="section-title">Quick scan</div>
        <div className="grid-2">
          {[
            ['Link', '/app/scan/link'],
            ['SMS', '/app/scan/sms'],
            ['Email', '/app/scan/email'],
            ['QR', '/app/scan/qr'],
          ].map(([l, p]) => (
            <button key={l} className="btn btn-ghost" onClick={() => nav(p)}>
              {l} scanner
            </button>
          ))}
        </div>

        <div className="section-title">Threats this week</div>
        <div className="card">
          <svg width="100%" height="110" viewBox="0 0 320 110" preserveAspectRatio="none">
            <defs>
              <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00C8FF" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#00C8FF" stopOpacity="0" />
              </linearGradient>
            </defs>
            {THREATS.map((v, i) => {
              const x = 24 + i * 44;
              const h = v * 6;
              return <rect key={i} x={x} y={100 - h} width="22" height={h} rx="6" fill={i === 3 ? '#00FF88' : '#00C8FF'} opacity="0.85" />;
            })}
          </svg>
          <div className="grid-3" style={{ gridTemplateColumns: 'repeat(7,1fr)', marginTop: 4 }}>
            {DAYS.map((d) => (
              <div key={d} className="tiny muted" style={{ textAlign: 'center' }}>
                {d}
              </div>
            ))}
          </div>
        </div>

        <div className="section-title">Categories</div>
        <div className="card">
          {CATS.map((c) => (
            <div key={c.n} style={{ marginBottom: 10 }}>
              <div className="row" style={{ padding: '4px 0', border: 0 }}>
                <span>{c.n}</span>
                <span className="muted">{c.v}%</span>
              </div>
              <div className="progress">
                <span style={{ width: `${c.v}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="section-title">Recent activity</div>
        <div className="card">
          {[
            ['SMS lottery lure blocked', '2m', 'var(--danger)'],
            ['Link scan · paystack.co', '18m', 'var(--green)'],
            ['Password check · weak', '1h', 'var(--warn)'],
            ['QR destination verified', '3h', 'var(--blue)'],
          ].map(([t, time, color]) => (
            <div className="activity" key={t}>
              <div className="dot" style={{ background: color }} />
              <div className="grow">
                <div style={{ fontSize: 14 }}>{t}</div>
                <div className="tiny muted">{time} ago</div>
              </div>
            </div>
          ))}
        </div>

        <div className="section-title">Security tip</div>
        <div className="card">
          Banks in Nigeria will never ask for your OTP, BVN or PIN on WhatsApp. Hang up and call the number on your card.
        </div>
      </div>
      <BottomNav active="home" />
    </>
  );
}
