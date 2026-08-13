import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { StatusBar } from '../../components/Chrome';
import { useApp } from '../../state/AppState';
import { api } from '../../services/api';

function Shell({ children }) {
  return (
    <>
      <StatusBar />
      <div className="scroll no-nav page-enter">{children}</div>
    </>
  );
}

export function Splash() {
  const nav = useNavigate();
  const { user } = useApp();
  return (
    <Shell>
      <div className="auth-hero" style={{ paddingTop: 72 }}>
        <img src={logo} alt="Sentinel AI" className="logo-mark" style={{ width: 84, height: 84, margin: '0 auto', borderRadius: 24 }} />
        <h1>Sentinel AI</h1>
        <div className="tag">Detect. Protect. Prevent.</div>
        <p className="muted" style={{ marginTop: 14, lineHeight: 1.55 }}>
          Intelligent defence for Nigeria’s digital economy — fraud, phishing, scams and identity theft.
        </p>
      </div>
      <button className="btn btn-primary" onClick={() => nav(user ? '/app/home' : '/login')}>
        Enter the app
      </button>
      <button className="btn btn-ghost" style={{ marginTop: 10 }} onClick={() => nav('/register')}>
        Create an account
      </button>
    </Shell>
  );
}

export function Login() {
  const nav = useNavigate();
  const { loginLocal } = useApp();
  const [email, setEmail] = useState('amina@sentinel.ng');
  const [password, setPassword] = useState('••••••••');
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    await api.login({ email, password, remember });
    loginLocal({ email, name: email.split('@')[0] });
    setBusy(false);
    nav('/app/home');
  };

  return (
    <Shell>
      <div className="auth-hero">
        <img src={logo} alt="" className="logo-mark" style={{ margin: '0 auto' }} />
        <h1>Welcome back</h1>
        <p className="muted">Sign in to your Sentinel workspace</p>
      </div>
      <form onSubmit={submit}>
        <div className="field">
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </div>
        <div className="field">
          <label>Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </div>
        <div className="row" style={{ border: 0, paddingTop: 0 }}>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            Remember me
          </label>
          <Link to="/forgot-password" className="tiny" style={{ color: 'var(--blue)' }}>
            Forgot password
          </Link>
        </div>
        <button className="btn btn-primary" disabled={busy}>
          {busy ? <span className="loader" /> : 'Continue'}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          style={{ marginTop: 10 }}
          onClick={async () => {
            await api.googleLogin({});
            loginLocal({ email: 'google.user@gmail.com', name: 'Google User' });
            nav('/app/home');
          }}
        >
          Continue with Google
        </button>
      </form>
      <p className="muted" style={{ textAlign: 'center', marginTop: 18, fontSize: 13 }}>
        New here? <Link to="/register" style={{ color: 'var(--green)' }}>Create account</Link>
      </p>
    </Shell>
  );
}

export function Register() {
  const nav = useNavigate();
  const { loginLocal } = useApp();
  const [form, setForm] = useState({ name: '', email: '', password: '', company: '' });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <Shell>
      <div className="auth-hero">
        <h1>Create account</h1>
        <p className="muted">Protect your team in under a minute</p>
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await api.register(form);
          loginLocal(form);
          nav('/verify-email');
        }}
      >
        <div className="field">
          <label>Full name</label>
          <input value={form.name} onChange={set('name')} required />
        </div>
        <div className="field">
          <label>Work email</label>
          <input type="email" value={form.email} onChange={set('email')} required />
        </div>
        <div className="field">
          <label>Company</label>
          <input value={form.company} onChange={set('company')} />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={form.password} onChange={set('password')} required />
        </div>
        <button className="btn btn-primary">Register</button>
      </form>
    </Shell>
  );
}

export function ForgotPassword() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  return (
    <Shell>
      <div className="auth-hero">
        <h1>Reset access</h1>
        <p className="muted">We’ll email a verification code</p>
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await api.forgotPassword({ email });
          nav('/verify-email');
        }}
      >
        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <button className="btn btn-primary">Send code</button>
      </form>
    </Shell>
  );
}

export function VerifyEmail() {
  const nav = useNavigate();
  const [code, setCode] = useState('');
  return (
    <Shell>
      <div className="auth-hero">
        <h1>Verify email</h1>
        <p className="muted">Enter the 6-digit code sent to your inbox</p>
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await api.verifyEmail({ code });
          nav('/reset-password');
        }}
      >
        <div className="field">
          <label>Code</label>
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="000000" maxLength={6} />
        </div>
        <button className="btn btn-primary">Verify</button>
      </form>
    </Shell>
  );
}

export function ResetPassword() {
  const nav = useNavigate();
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  return (
    <Shell>
      <div className="auth-hero">
        <h1>New password</h1>
        <p className="muted">Choose a long passphrase</p>
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (p1 !== p2) return;
          await api.resetPassword({ password: p1 });
          nav('/login');
        }}
      >
        <div className="field">
          <label>Password</label>
          <input type="password" value={p1} onChange={(e) => setP1(e.target.value)} />
        </div>
        <div className="field">
          <label>Confirm</label>
          <input type="password" value={p2} onChange={(e) => setP2(e.target.value)} />
        </div>
        <button className="btn btn-primary">Save password</button>
      </form>
    </Shell>
  );
}
