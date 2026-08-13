import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBar, TopBar, BottomNav } from '../components/Chrome';
import { Ico } from '../components/Icons';
import { useApp } from '../state/AppState';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SERIES = {
  Phishing: [6, 9, 7, 14, 11, 8, 12],
  SMS: [4, 5, 8, 10, 7, 6, 9],
  Malware: [2, 1, 3, 4, 2, 3, 2],
};
const COLORS = { Phishing: '#00C8FF', SMS: '#00FF88', Malware: '#FFB020' };

const NEWS = [
  { tag: 'NG', t: 'Fake CBN BVN recertification texts spike in Lagos', time: '32m' },
  { tag: 'WA', t: 'WhatsApp “family emergency” mule network active', time: '2h' },
  { tag: 'APK', t: 'Counterfeit Opay update circulating on Telegram', time: '5h' },
];

function MiniRing({ value }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <svg width="88" height="88" viewBox="0 0 88 88">
      <circle cx="44" cy="44" r={r} stroke="rgba(255,255,255,.2)" strokeWidth="8" fill="none" />
      <circle cx="44" cy="44" r={r} stroke="#fff" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} transform="rotate(-90 44 44)" />
    </svg>
  );
}

function Spark({ values, color }) {
  const max = Math.max(...values, 1);
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * 220},${70 - (v / max) * 58}`).join(' ');
  return (
    <svg width="100%" height="78" viewBox="0 0 220 78" preserveAspectRatio="none">
      <polyline fill="none" stroke={color} strokeWidth="3" points={pts} />
    </svg>
  );
}

function MiniBars({ values }) {
  const max = Math.max(...values, 1);
  return (
    <svg width="100%" height="78" viewBox="0 0 220 78">
      {values.map((v, i) => (
        <rect key={i} x={10 + i * 30} y={70 - (v / max) * 58} width="18" height={(v / max) * 58} rx="5" fill="rgba(255,255,255,.88)" />
      ))}
    </svg>
  );
}

function LineChart() {
  const w = 320;
  const h = 160;
  const max = 16;
  const path = (arr) =>
    arr.map((v, i) => `${i === 0 ? 'M' : 'L'} ${24 + i * 46} ${h - 28 - (v / max) * 110}`).join(' ');
  return (
    <div className="card">
      <div className="row" style={{ paddingTop: 0, border: 0 }}>
        <b>Threats intercepted / day</b>
        <span className="tiny muted">7 days</span>
      </div>
      <svg width="100%" height="170" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        {[0, 1, 2, 3].map((g) => (
          <line key={g} x1="20" x2="310" y1={28 + g * 28} y2={28 + g * 28} stroke="var(--chart-grid)" />
        ))}
        {Object.entries(SERIES).map(([name, arr]) => (
          <path key={name} d={path(arr)} fill="none" stroke={COLORS[name]} strokeWidth="2.6" strokeLinejoin="round" />
        ))}
      </svg>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {Object.entries(COLORS).map(([n, c]) => (
          <span key={n} className="tiny" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <i style={{ width: 10, height: 10, borderRadius: 99, background: c, display: 'inline-block' }} />
            {n}
          </span>
        ))}
      </div>
      <div className="grid-3" style={{ gridTemplateColumns: 'repeat(7,1fr)', marginTop: 8 }}>
        {DAYS.map((d) => (
          <div key={d} className="tiny muted" style={{ textAlign: 'center' }}>
            {d}
          </div>
        ))}
      </div>
    </div>
  );
}

const CARDS = [
  {
    key: 'score',
    title: 'Security score',
    value: '86',
    sub: 'Low residual risk · +4 this week',
    bg: 'linear-gradient(135deg,#064e3b,#0b1220 55%,#022c22)',
    chart: <MiniRing value={86} />,
  },
  {
    key: 'threats',
    title: 'Threats detected',
    value: '128',
    sub: 'Phish + SMS leading this week',
    bg: 'linear-gradient(135deg,#0c4a6e,#0b1220 50%,#082f49)',
    chart: <Spark values={SERIES.Phishing} color="#7dd3fc" />,
  },
  {
    key: 'blocked',
    title: 'Scams blocked',
    value: '91',
    sub: '71% intercept rate',
    bg: 'linear-gradient(135deg,#7c2d12,#1c1917 45%,#431407)',
    chart: <MiniBars values={[5, 8, 6, 11, 9, 7, 10]} />,
  },
];

export default function Home() {
  const { user, unread } = useApp();
  const nav = useNavigate();
  const scroller = useRef(null);
  const [idx, setIdx] = useState(0);
  const pause = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      if (pause.current) return;
      setIdx((i) => {
        const next = (i + 1) % CARDS.length;
        const el = scroller.current;
        if (el) el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' });
        return next;
      });
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    setIdx(Math.round(el.scrollLeft / el.clientWidth));
  };

  const quick = [
    { l: 'Link', p: '/app/scan/link', ico: Ico.link, bg: 'rgba(0,200,255,.14)', fg: '#00c8ff' },
    { l: 'SMS', p: '/app/scan/sms', ico: Ico.sms, bg: 'rgba(0,255,136,.14)', fg: '#00ff88' },
    { l: 'Email', p: '/app/scan/email', ico: Ico.mail, bg: 'rgba(124,92,255,.16)', fg: '#a78bfa' },
    { l: 'QR', p: '/app/scan/qr', ico: Ico.qr, bg: 'rgba(255,176,32,.16)', fg: '#ffb020' },
  ];

  return (
    <>
      <StatusBar />
      <div className="scroll page-enter">
        <TopBar
          title={`Hi, ${user?.name?.split(' ')[0] || 'there'}`}
          subtitle="Nigeria threat desk · live"
          right={
            <button className="icon-btn" onClick={() => nav('/app/notifications')} aria-label="Notifications">
              {Ico.bell}
              {unread ? <b style={{ position: 'absolute', margin: '-18px 0 0 10px', fontSize: 10, color: '#ff4d6d' }}>{unread}</b> : null}
            </button>
          }
        />

        <div
          className="carousel"
          ref={scroller}
          onScroll={onScroll}
          onPointerDown={() => {
            pause.current = true;
          }}
          onPointerUp={() => {
            pause.current = false;
          }}
        >
          {CARDS.map((c) => (
            <article key={c.key} className="stat-card" style={{ background: c.bg }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div>
                  <h3>{c.title}</h3>
                  <div className="big">{c.value}</div>
                  <div className="sub">{c.sub}</div>
                </div>
                <div style={{ width: 120 }}>{c.chart}</div>
              </div>
            </article>
          ))}
        </div>
        <div className="dots">
          {CARDS.map((c, i) => (
            <i key={c.key} className={i === idx ? 'on' : ''} />
          ))}
        </div>

        <div className="desk-grid" style={{ marginTop: 8 }}>
          <div>
            <div className="section-title">
              Quick scan
              <button className="linkish" onClick={() => nav('/app/scan')}>
                View all
              </button>
            </div>
            <div className="quick-row">
              {quick.map((q) => (
                <button key={q.l} className="quick-sq" onClick={() => nav(q.p)}>
                  <div className="qi" style={{ background: q.bg, color: q.fg }}>
                    {q.ico}
                  </div>
                  <b>{q.l}</b>
                </button>
              ))}
            </div>

            <div className="section-title">Academy</div>
            <button className="academy" onClick={() => nav('/app/training')}>
              <div className="qi" style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(0,255,136,.18)', display: 'grid', placeItems: 'center', color: '#00ff88' }}>
                {Ico.academy}
              </div>
              <div className="grow">
                <h3>Cyber Academy</h3>
                <p>Learn how to stop phishing, SIM-swap and WhatsApp fraud in real Nigerian scenarios.</p>
              </div>
              {Ico.chevron}
            </button>
          </div>

          <div>
            <div className="section-title">Intercepted this week</div>
            <LineChart />
          </div>
        </div>

        <div className="desk-grid">
          <div>
            <div className="section-title">
              Latest threat news
              <button className="linkish" onClick={() => nav('/app/intel')}>
                Intel
              </button>
            </div>
            <div className="card">
              {NEWS.map((n) => (
                <div className="news" key={n.t}>
                  <div className="thumb" style={{ background: 'var(--surface-2)', color: 'var(--blue)' }}>
                    {n.tag}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{n.t}</div>
                    <div className="tiny muted">{n.time} ago</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
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
          </div>
        </div>
      </div>
      <BottomNav active="home" />
    </>
  );
}
