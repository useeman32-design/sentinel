import { useNavigate } from 'react-router-dom';
import { StatusBar, TopBar, BottomNav } from '../components/Chrome';
import { useApp } from '../state/AppState';
import logo from '../assets/logo.png';

const LINKS = [
  ['Profile', 'Identity & subscription', '/app/profile'],
  ['Notifications', 'Risk and product alerts', '/app/notifications'],
  ['Reports', 'Exportable briefings', '/app/reports'],
  ['Training', 'Beginner to advanced', '/app/training'],
  ['Settings', 'Theme, language, privacy', '/app/settings'],
];

export default function More() {
  const nav = useNavigate();
  const { user, logout } = useApp();
  return (
    <>
      <StatusBar />
      <div className="scroll page-enter">
        <TopBar title="More" subtitle="Account & operations" />
        <div className="card" style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
          <img src={logo} alt="" className="logo-mark" />
          <div>
            <b>{user?.name}</b>
            <div className="tiny muted">{user?.email}</div>
            <span className="chip chip-info" style={{ marginTop: 6 }}>
              {user?.subscription || 'Free'}
            </span>
          </div>
        </div>
        <div className="card">
          {LINKS.map(([t, d, p]) => (
            <button key={t} className="row" style={{ width: '100%', background: 'none', borderLeft: 0, borderRight: 0, borderTop: 0, textAlign: 'left' }} onClick={() => nav(p)}>
              <div>
                <b>{t}</b>
                <div className="tiny muted">{d}</div>
              </div>
              <span className="muted">›</span>
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
          Sign out
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
        <TopBar title="Profile" back />
        <div className="card" style={{ textAlign: 'center' }}>
          <img src={logo} alt="" className="logo-mark" style={{ width: 72, height: 72, margin: '0 auto 10px', borderRadius: 24 }} />
          <h2 style={{ margin: 0 }}>{user?.name}</h2>
          <p className="muted">{user?.role}</p>
        </div>
        <div className="card" style={{ marginTop: 12 }}>
          {[
            ['Email', user?.email],
            ['Company', user?.company],
            ['Role', user?.role],
            ['Status', user?.status],
            ['Subscription', user?.subscription],
          ].map(([k, v]) => (
            <div className="row" key={k}>
              <span className="muted">{k}</span>
              <b>{v || '—'}</b>
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
        <TopBar title="Settings" back />
        <div className="card">
          <div className="row">
            <div>
              <b>Dark mode</b>
              <div className="tiny muted">Neon command aesthetic</div>
            </div>
            <button className={`switch ${theme === 'dark' ? 'on' : ''}`} onClick={toggleTheme}>
              <i />
            </button>
          </div>
          <div className="row">
            <div>
              <b>Notifications</b>
              <div className="tiny muted">High risk & new threats</div>
            </div>
            <button className={`switch ${notifOn ? 'on' : ''}`} onClick={() => setNotifOn(!notifOn)}>
              <i />
            </button>
          </div>
          <div className="row">
            <b>Language</b>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 10, padding: '8px 10px' }}>
              <option>English</option>
              <option>Hausa</option>
              <option>Yoruba</option>
              <option>Igbo</option>
            </select>
          </div>
        </div>
        <div className="card" style={{ marginTop: 12 }}>
          {['Account', 'API keys', 'Privacy', 'Security'].map((x) => (
            <div className="row" key={x}>
              <b>{x}</b>
              <span className="muted">›</span>
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
          subtitle={`${unread} unread`}
          back
          right={
            <button className="linkish" onClick={markAllReceived}>
              Mark all
            </button>
          }
        />
        {notifs.map((n) => (
          <article key={n.id} className={`notif ${n.seen ? 'seen' : ''}`}>
            <div className="grow">
              <span className={`chip ${n.tone}`}>{n.kind}</span>
              <h3 style={{ margin: '8px 0 4px', fontSize: 16 }}>{n.title}</h3>
              <p className="muted" style={{ margin: 0, fontSize: 13, lineHeight: 1.45 }}>
                {n.body}
              </p>
              <div className="tiny muted" style={{ marginTop: 8 }}>
                {n.time} ago
              </div>
            </div>
            {!n.seen ? (
              <button className="mark" onClick={() => markReceived(n.id)}>
                Mark received
              </button>
            ) : (
              <span className="tiny muted">Received</span>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
