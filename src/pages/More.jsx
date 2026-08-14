import { useNavigate } from 'react-router-dom';
import { StatusBar, TopBar, BottomNav } from '../components/Chrome';
import { useApp } from '../state/AppState';
import logo from '../assets/logo.png';

const LINKS = [
  ['Profile', 'Identity, role & subscription tier', '/app/profile'],
  ['Notifications', 'Threat alerts and security warnings', '/app/notifications'],
  ['Reports', 'Exportable executive threat briefs', '/app/reports'],
  ['Training', 'Cyber Academy learning tracks', '/app/training'],
  ['Settings', 'Theme, language & system privacy', '/app/settings'],
];

export default function More() {
  const nav = useNavigate();
  const { user, logout } = useApp();

  return (
    <>
      <StatusBar />
      <div className="scroll page-enter">
        <TopBar title="More" subtitle="Account & Operations" />

        <div className="card" style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14 }}>
          <img src={logo} alt="Logo" className="logo-mark" style={{ width: 52, height: 52 }} />
          <div className="grow">
            <b style={{ fontSize: 16 }}>{user?.name || 'Amina Bello'}</b>
            <div className="tiny muted" style={{ marginTop: 2 }}>{user?.email || 'amina@sentinel.ng'}</div>
            <div style={{ marginTop: 6 }}>
              <span className="chip chip-safe" style={{ fontSize: 10 }}>
                {user?.subscription || 'Pro Enterprise'}
              </span>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '4px 16px' }}>
          {LINKS.map(([t, d, p]) => (
            <button
              key={t}
              className="row"
              style={{
                width: '100%',
                background: 'none',
                borderLeft: 0,
                borderRight: 0,
                borderTop: 0,
                textAlign: 'left',
                cursor: 'pointer',
              }}
              onClick={() => nav(p)}
            >
              <div>
                <b style={{ fontSize: 14 }}>{t}</b>
                <div className="tiny muted" style={{ marginTop: 2 }}>{d}</div>
              </div>
              <span className="muted" style={{ fontSize: 18 }}>›</span>
            </button>
          ))}
        </div>

        <button
          className="btn btn-danger"
          style={{ marginTop: 16 }}
          onClick={() => {
            logout();
            nav('/login');
          }}
        >
          Sign Out of Workspace
        </button>
      </div>
      <BottomNav active="more" />
    </>
  );
}

export function Profile() {
  const { user } = useApp();
  return (
    <>
      <StatusBar />
      <div className="scroll page-enter">
        <TopBar title="User Profile" subtitle="Account credentials" back />

        <div className="card" style={{ textAlign: 'center', padding: '24px 16px' }}>
          <img
            src={logo}
            alt=""
            className="logo-mark"
            style={{ width: 76, height: 76, margin: '0 auto 12px', borderRadius: 22 }}
          />
          <h2 style={{ margin: 0, fontSize: 20, fontFamily: 'var(--display)' }}>{user?.name || 'Amina Bello'}</h2>
          <p className="muted" style={{ fontSize: 13, marginTop: 4 }}>{user?.role || 'Security Analyst'}</p>
          <div style={{ marginTop: 10 }}>
            <span className="chip chip-info">{user?.subscription || 'Pro Tier'}</span>
          </div>
        </div>

        <div className="card" style={{ marginTop: 14 }}>
          {[
            ['Email', user?.email || 'amina@sentinel.ng'],
            ['Organization', user?.company || 'Lagos Fintech Hub'],
            ['Role', user?.role || 'Security Analyst'],
            ['Account Status', user?.status || 'Verified Active'],
            ['Subscription', user?.subscription || 'Pro Enterprise'],
          ].map(([k, v]) => (
            <div className="row" key={k}>
              <span className="muted" style={{ fontSize: 13 }}>{k}</span>
              <b style={{ fontSize: 13 }}>{v}</b>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export function Settings() {
  const { theme, toggleTheme, language, setLanguage, notifOn, setNotifOn } = useApp();

  return (
    <>
      <StatusBar />
      <div className="scroll page-enter">
        <TopBar title="Settings" subtitle="System preferences" back />

        <div className="card">
          <div className="row">
            <div>
              <b>Dark Mode</b>
              <div className="tiny muted">High-contrast cyber command aesthetic</div>
            </div>
            <button className={`switch ${theme === 'dark' ? 'on' : ''}`} onClick={toggleTheme} aria-label="Toggle theme">
              <i />
            </button>
          </div>

          <div className="row">
            <div>
              <b>Push Notifications</b>
              <div className="tiny muted">Real-time alerts for high-severity campaigns</div>
            </div>
            <button className={`switch ${notifOn ? 'on' : ''}`} onClick={() => setNotifOn(!notifOn)} aria-label="Toggle notifications">
              <i />
            </button>
          </div>

          <div className="row">
            <div>
              <b>Language</b>
              <div className="tiny muted">Localized threat briefings</div>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--line)',
                borderRadius: 10,
                padding: '8px 12px',
                color: 'var(--text)',
                outline: 'none',
              }}
            >
              <option>English</option>
              <option>Hausa</option>
              <option>Yoruba</option>
              <option>Igbo</option>
            </select>
          </div>
        </div>

        <div className="card" style={{ marginTop: 14 }}>
          {['API Keys & Integration', 'Telemetry & Privacy', 'Device Encryption', 'Security Logs'].map((x) => (
            <div className="row" key={x} style={{ cursor: 'pointer' }}>
              <b style={{ fontSize: 14 }}>{x}</b>
              <span className="muted" style={{ fontSize: 18 }}>›</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export function Notifications() {
  const { notifs, markReceived, markAllReceived, unread } = useApp();

  return (
    <>
      <StatusBar />
      <div className="scroll page-enter">
        <TopBar
          title="Notifications"
          subtitle={`${unread} unread threats`}
          back
          right={
            unread > 0 ? (
              <button className="linkish" onClick={markAllReceived}>
                Mark all read
              </button>
            ) : null
          }
        />

        {notifs.map((n) => (
          <article key={n.id} className={`notif ${n.seen ? 'seen' : ''}`}>
            <div className="grow">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`chip ${n.tone}`}>{n.kind}</span>
                <span className="tiny muted">{n.time} ago</span>
              </div>
              <h3 style={{ margin: '8px 0 4px', fontSize: 15, fontWeight: 700 }}>{n.title}</h3>
              <p className="muted" style={{ margin: 0, fontSize: 13, lineHeight: 1.45 }}>
                {n.body}
              </p>
            </div>
            {!n.seen && (
              <button className="mark" onClick={() => markReceived(n.id)}>
                Dismiss
              </button>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
