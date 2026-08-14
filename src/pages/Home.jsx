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
  const r = 32;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" style={{ display: 'block', margin: '0 auto' }}>
      <circle cx="40" cy="40" r={r} stroke="rgba(255,255,255,0.15)" strokeWidth="7" fill="none" />
      <circle
        cx="40"
        cy="40"
        r={r}
        stroke="#00ff88"
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={off}
        transform="rotate(-90 40 40)"
      />
      <text x="40" y="45" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="800" fontFamily="var(--display)">
        {value}%
      </text>
    </svg>
  );
}

function Spark({ values, color }) {
  const max = Math.max(...values, 1);
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * 110},${55 - (v / max) * 45}`).join(' ');
  return (
    <svg width="110" height="60" viewBox="0 0 110 60" style={{ display: 'block', overflow: 'visible' }}>
      <polyline fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={pts} />
    </svg>
  );
}

function MiniBars({ values }) {
  const max = Math.max(...values, 1);
  return (
    <svg width="110" height="60" viewBox="0 0 110 60" style={{ display: 'block' }}>
      {values.map((v, i) => (
        <rect
          key={i}
          x={6 + i * 15}
          y={55 - (v / max) * 45}
          width="9"
          height={(v / max) * 45}
          rx="3"
          fill="rgba(255,255,255,0.85)"
        />
      ))}
    </svg>
  );
}

function LineChart() {
  const w = 320;
  const h = 150;
  const max = 16;
  const path = (arr) =>
    arr.map((v, i) => `${i === 0 ? 'M' : 'L'} ${20 + i * 46} ${h - 25 - (v / max) * 95}`).join(' ');
  return (
    <div className="card">
      <div className="row" style={{ paddingTop: 0, border: 0, marginBottom: 8 }}>
        <b>Threats intercepted / day</b>
        <span className="tiny muted">7-day view</span>
      </div>
      <svg width="100%" height="150" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        {[0, 1, 2, 3].map((g) => (
          <line key={g} x1="15" x2="305" y1={25 + g * 25} y2={25 + g * 25} stroke="var(--chart-grid)" strokeDasharray="3 3" />
        ))}
        {Object.entries(SERIES).map(([name, arr]) => (
          <path key={name} d={path(arr)} fill="none" stroke={COLORS[name]} strokeWidth="2.8" strokeLinejoin="round" strokeLinecap="round" />
        ))}
      </svg>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 10 }}>
        {Object.entries(COLORS).map(([n, c]) => (
          <span key={n} className="tiny" style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
            <i style={{ width: 8, height: 8, borderRadius: 99, background: c, display: 'inline-block' }} />
            {n}
          </span>
        ))}
      </div>
      <div className="grid-3" style={{ gridTemplateColumns: 'repeat(7,1fr)', marginTop: 10, borderTop: '1px solid var(--line)', paddingTop: 8 }}>
        {DAYS.map((d) => (
          <div key={d} className="tiny muted" style={{ textAlign: 'center', fontWeight: 600 }}>
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
    sub: 'Low residual risk · +4 pts this week',
    bg: 'linear-gradient(135deg, #064e3b 0%, #0b1220 60%, #022c22 100%)',
    chart: <MiniRing value={86} />,
  },
  {
    key: 'threats',
    title: 'Threats detected',
    value: '128',
    sub: 'Phish & SMS leading this week',
    bg: 'linear-gradient(135deg, #0c4a6e 0%, #0b1220 60%, #082f49 100%)',
    chart: <Spark values={SERIES.Phishing} color="#00c8ff" />,
  },
  {
    key: 'blocked',
    title: 'Scams blocked',
    value: '91',
    sub: '71% autonomous intercept rate',
    bg: 'linear-gradient(135deg, #7c2d12 0%, #1c1917 55%, #431407 100%)',
    chart: <MiniBars values={[5, 8, 6, 11, 9, 7, 10]} />,
  },
];

export default function Home() {
  const { user, unread } = useApp();
  const nav = useNavigate();
  const scroller = useRef(null);
  const [idx, setIdx] = useState(0);
  const isInteracting = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isInteracting.current || !scroller.current) return;
      const next = (idx + 1) % CARDS.length;
      scrollToCard(next);
    }, 4500);
    return () => clearInterval(timer);
  }, [idx]);

  const scrollToCard = (index) => {
    const el = scroller.current;
    if (!el) return;
    const cardWidth = el.clientWidth;
    el.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
    setIdx(index);
  };

  const handleScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const cardWidth = el.clientWidth;
    if (cardWidth > 0) {
      const newIdx = Math.round(el.scrollLeft / cardWidth);
      if (newIdx !== idx && newIdx >= 0 && newIdx < CARDS.length) {
        setIdx(newIdx);
      }
    }
  };

  const quick = [
    { l: 'Link', p: '/app/scan/link', ico: Ico.link, bg: 'rgba(0,200,255,.14)', fg: '#00c8ff' },
    { l: 'SMS', p: '/app/scan/sms', ico: Ico.sms, bg: 'rgba(0,255,136,.14)', fg: '#00ff88' },
    { l: 'Email', p: '/app/scan/email', ico: Ico.mail, bg: 'rgba(167,139,250,.16)', fg: '#a78bfa' },
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
              {unread > 0 ? (
                <span
                  style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: 'var(--danger)',
                    boxShadow: '0 0 8px var(--danger)',
                  }}
                />
              ) : null}
            </button>
          }
        />

        {/* Swipeable Threat Cards Carousel */}
        <div className="carousel-wrapper">
          <div
            className="carousel"
            ref={scroller}
            onScroll={handleScroll}
            onTouchStart={() => {
              isInteracting.current = true;
            }}
            onTouchEnd={() => {
              setTimeout(() => {
                isInteracting.current = false;
              }, 1000);
            }}
            onMouseEnter={() => {
              isInteracting.current = true;
            }}
            onMouseLeave={() => {
              isInteracting.current = false;
            }}
          >
            {CARDS.map((c) => (
              <article key={c.key} className="stat-card" style={{ background: c.bg }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <div>
                    <h3>{c.title}</h3>
                    <div className="big">{c.value}</div>
                    <div className="sub">{c.sub}</div>
                  </div>
                  <div style={{ display: 'grid', placeItems: 'center', flexShrink: 0 }}>{c.chart}</div>
                </div>
              </article>
            ))}
          </div>

          <div className="dots">
            {CARDS.map((c, i) => (
              <i key={c.key} className={i === idx ? 'on' : ''} onClick={() => scrollToCard(i)} />
            ))}
          </div>
        </div>

        {/* Quick Scanner Access */}
        <div className="section-title">
          Quick scan
          <button className="linkish" onClick={() => nav('/app/scan')}>
            View all (7)
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

        {/* Academy Callout */}
        <div className="section-title">Academy</div>
        <button className="academy" onClick={() => nav('/app/training')}>
          <div
            className="qi"
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              background: 'rgba(0,255,136,.15)',
              display: 'grid',
              placeItems: 'center',
              color: '#00ff88',
              flexShrink: 0,
            }}
          >
            {Ico.academy}
          </div>
          <div className="grow">
            <h3>Cyber Academy</h3>
            <p>Learn how to stop phishing, SIM-swap and WhatsApp fraud in real Nigerian scenarios.</p>
          </div>
          <span style={{ color: 'var(--muted)', fontSize: 18 }}>›</span>
        </button>

        {/* 7-Day Chart */}
        <div className="section-title">Intercepted this week</div>
        <LineChart />

        {/* News & Activity */}
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
                  <div className="grow">
                    <div style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.4 }}>{n.t}</div>
                    <div className="tiny muted" style={{ marginTop: 2 }}>{n.time} ago</div>
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
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{t}</div>
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
