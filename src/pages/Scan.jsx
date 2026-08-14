import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBar, TopBar, BottomNav, Verdict } from '../components/Chrome';
import { Ico } from '../components/Icons';
import {
  liveUrlScan,
  liveSmsScan,
  liveEmailScan,
  livePasswordCheck,
  liveFileScan,
  liveQrScan,
  liveBreachCheck,
  readTextFile,
} from '../services/scanEngine';

const MODULES = [
  { t: 'Link Scanner', d: 'Live DNS + anti-phishing feeds', p: '/app/scan/link', c: '#00C8FF', ico: Ico.link },
  { t: 'Email Scanner', d: 'Header analysis & link extractor', p: '/app/scan/email', c: '#34d399', ico: Ico.mail },
  { t: 'SMS Scanner', d: 'Nigerian scam family detection', p: '/app/scan/sms', c: '#a78bfa', ico: Ico.sms },
  { t: 'QR Scanner', d: 'Visual decode & target check', p: '/app/scan/qr', c: '#38bdf8', ico: Ico.qr },
  { t: 'File Scanner', d: 'Magic-bytes header & SHA-256', p: '/app/scan/file', c: '#fbbf24', ico: Ico.file },
  { t: 'Password Check', d: 'Entropy meter & breach corpus', p: '/app/scan/password', c: '#00FF88', ico: Ico.lock },
  { t: 'Breach Monitor', d: 'Domain MX & mailbox hygiene', p: '/app/scan/breach', c: '#fb7185', ico: Ico.breach },
];

export function ScanHub() {
  const nav = useNavigate();
  return (
    <>
      <StatusBar />
      <div className="scroll page-enter">
        <TopBar title="Threat Scanner" subtitle="Real-time multi-vector inspection engines" />
        <div className="scan-grid">
          {MODULES.map((m) => (
            <button key={m.t} className="scan-tile" onClick={() => nav(m.p)}>
              <div className="ico" style={{ color: m.c, background: `${m.c}1c` }}>
                {m.ico}
              </div>
              <b>{m.t}</b>
              <span>{m.d}</span>
            </button>
          ))}
        </div>
      </div>
      <BottomNav active="scan" />
    </>
  );
}

function ScanFrame({ title, subtitle, children }) {
  return (
    <>
      <StatusBar />
      <div className="scroll page-enter">
        <TopBar title={title} subtitle={subtitle} back />
        <div style={{ maxWidth: 400, margin: '0 auto' }}>{children}</div>
      </div>
      <BottomNav active="scan" />
    </>
  );
}

export function LinkScanner() {
  const [url, setUrl] = useState('https://secure-gtbank-login.verify-ng.com/update');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState('');

  const run = async () => {
    if (!url.trim() || busy) return;
    setBusy(true);
    setResult(null);
    setErr('');
    try {
      setResult(await liveUrlScan(url));
    } catch (e) {
      setErr(String(e.message || e));
    }
    setBusy(false);
  };

  const samples = [
    { label: 'Phish Sample', url: 'https://secure-gtbank-login.verify-ng.com/update' },
    { label: 'Opay Phish', url: 'http://opay-claim-bonus.xyz/login' },
    { label: 'Safe Site', url: 'https://paystack.com' },
  ];

  return (
    <ScanFrame title="Link Scanner" subtitle="Google Public DNS + Phishing Feed">
      <div className="field">
        <label>Website or URL to inspect</label>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          onKeyDown={(e) => e.key === 'Enter' && run()}
        />
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
        {samples.map((s) => (
          <button
            key={s.label}
            className="chip chip-info"
            style={{ cursor: 'pointer', background: 'var(--surface-2)', border: '1px solid var(--line)' }}
            onClick={() => setUrl(s.url)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <button className="btn btn-primary" onClick={run} disabled={busy || !url.trim()}>
        {busy ? <span className="loader" /> : 'Analyse link'}
      </button>

      {busy && <div className="skeleton" style={{ height: 120, marginTop: 14 }} />}
      {err && <p className="tiny" style={{ color: 'var(--danger)', marginTop: 10, textAlign: 'center' }}>{err}</p>}
      <Verdict result={result} />
    </ScanFrame>
  );
}

export function EmailScanner() {
  const [from, setFrom] = useState('security@gtb-alerts.com');
  const [body, setBody] = useState('Dear customer, your BVN will be deactivated within 24 hours. Verify now: http://bit.ly/upd-bvn');
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    setResult(null);
    const fileText = await readTextFile(file);
    setResult(await liveEmailScan({ from, body, fileText }));
    setBusy(false);
  };

  return (
    <ScanFrame title="Email Scanner" subtitle="Domain spoofing & embedded lure detection">
      <div className="field">
        <label>Sender address</label>
        <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="sender@domain.com" />
      </div>

      <div className="field">
        <label>Email body or message</label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Paste the suspicious email text here..." />
      </div>

      <label className="drop-zone">
        <div className="drop-ico">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <div className="drop-title">{file ? file.name : 'Upload .EML / .TXT file'}</div>
        <div className="drop-sub">{file ? `${(file.size / 1024).toFixed(1)} KB selected` : 'Drop raw email file or click to browse'}</div>
        <input
          type="file"
          hidden
          accept=".eml,.txt,.msg"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </label>

      {file && (
        <div style={{ textAlign: 'center', marginBottom: 10 }}>
          <button className="linkish" style={{ color: 'var(--danger)' }} onClick={() => setFile(null)}>
            Remove attached file
          </button>
        </div>
      )}

      <button className="btn btn-primary" onClick={run} disabled={busy || (!body.trim() && !file)}>
        {busy ? <span className="loader" /> : 'Detect phishing'}
      </button>

      {busy && <div className="skeleton" style={{ height: 120, marginTop: 14 }} />}
      <Verdict result={result} />
    </ScanFrame>
  );
}

export function SmsScanner() {
  const [text, setText] = useState('Congratulations! You won ₦2,000,000 in the MTN Promo. Pay ₦2,000 processing fee to claim via this link http://bit.ly/claim-mtn');
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (!text.trim() || busy) return;
    setBusy(true);
    setResult(null);
    setResult(await liveSmsScan(text));
    setBusy(false);
  };

  const presets = [
    {
      label: 'MTN Promo',
      msg: 'Congratulations! You won ₦2,000,000 in the MTN Promo. Pay ₦2,000 processing fee to claim via this link http://bit.ly/claim-mtn',
    },
    {
      label: 'BVN Lockout',
      msg: 'CBN ALERT: Your BVN has been flagged for suspension. Click https://cbn-bvn-portal.top to update your KYC immediately.',
    },
    {
      label: 'Bank Credit',
      msg: 'Your Acct 012***789 has received N250,000.00 from FGN EMPOWERMENT. Call 08030000000 to authorize release.',
    },
  ];

  return (
    <ScanFrame title="SMS Scanner" subtitle="Nigerian scam heuristics + link analyzer">
      <div className="field">
        <label>SMS Content</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste SMS text message here..."
        />
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
        {presets.map((p) => (
          <button
            key={p.label}
            className="chip chip-info"
            style={{ cursor: 'pointer', background: 'var(--surface-2)', border: '1px solid var(--line)' }}
            onClick={() => setText(p.msg)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <button className="btn btn-primary" onClick={run} disabled={busy || !text.trim()}>
        {busy ? <span className="loader" /> : 'Scan SMS'}
      </button>

      {busy && <div className="skeleton" style={{ height: 120, marginTop: 14 }} />}
      <Verdict result={result} />
    </ScanFrame>
  );
}

export function QrScanner() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const run = async () => {
    if (!file || busy) return;
    setBusy(true);
    setResult(null);
    setErr('');
    try {
      setResult(await liveQrScan(file));
    } catch (e) {
      setErr('Could not process this QR image: ' + (e.message || e));
    }
    setBusy(false);
  };

  return (
    <ScanFrame title="QR Scanner" subtitle="Visual decoding + URL safety verification">
      <label className="drop-zone">
        <div className="drop-ico">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 20h3v-3M20 14v3" />
          </svg>
        </div>
        <div className="drop-title">{file ? file.name : 'Upload QR Image'}</div>
        <div className="drop-sub">{file ? 'Ready to analyze' : 'PNG, JPG or Screenshot'}</div>
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0];
            setFile(f || null);
            setPreview(f ? URL.createObjectURL(f) : '');
            setResult(null);
          }}
        />
      </label>

      {preview && (
        <div className="qr-preview-container">
          <img src={preview} alt="QR Preview" className="qr-preview-img" />
          <button
            className="linkish"
            style={{ color: 'var(--danger)', marginTop: 8 }}
            onClick={() => {
              setFile(null);
              setPreview('');
              setResult(null);
            }}
          >
            Clear image
          </button>
        </div>
      )}

      <button className="btn btn-primary" onClick={run} disabled={busy || !file}>
        {busy ? <span className="loader" /> : 'Decode & analyse'}
      </button>

      {busy && <div className="skeleton" style={{ height: 120, marginTop: 14 }} />}
      {err && <p className="tiny" style={{ color: 'var(--danger)', marginTop: 10, textAlign: 'center' }}>{err}</p>}
      <Verdict result={result} />
    </ScanFrame>
  );
}

export function FileScanner() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (!file || busy) return;
    setBusy(true);
    setResult(null);
    setResult(await liveFileScan(file));
    setBusy(false);
  };

  return (
    <ScanFrame title="File Scanner" subtitle="Magic header inspection & cryptographic hash">
      <label className="drop-zone">
        <div className="drop-ico" style={{ color: '#fbbf24', background: 'rgba(251, 191, 36, 0.12)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
        <div className="drop-title">{file ? file.name : 'Choose or Drop File'}</div>
        <div className="drop-sub">
          {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Supports APK, PDF, EXE, DOCX, ZIP'}
        </div>
        <input
          type="file"
          hidden
          onChange={(e) => {
            setFile(e.target.files?.[0] || null);
            setResult(null);
          }}
        />
      </label>

      {file && (
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <button
            className="linkish"
            style={{ color: 'var(--danger)' }}
            onClick={() => {
              setFile(null);
              setResult(null);
            }}
          >
            Remove file
          </button>
        </div>
      )}

      <button className="btn btn-primary" onClick={run} disabled={busy || !file}>
        {busy ? <span className="loader" /> : 'Scan file signature'}
      </button>

      {busy && <div className="skeleton" style={{ height: 120, marginTop: 14 }} />}

      {result?.sha256 && (
        <div className="card" style={{ marginTop: 14, background: 'var(--surface-2)' }}>
          <div className="tiny muted" style={{ fontWeight: 700, marginBottom: 4 }}>
            SHA-256 HASH
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, wordBreak: 'break-all', color: 'var(--text-dim)' }}>
            {result.sha256}
          </div>
        </div>
      )}

      <Verdict result={result} />
    </ScanFrame>
  );
}

export function PasswordChecker() {
  const [password, setPassword] = useState('P@ssw0rd2026');
  const [show, setShow] = useState(false);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (!password || busy) return;
    setBusy(true);
    setResult(null);
    setResult(await livePasswordCheck(password));
    setBusy(false);
  };

  return (
    <ScanFrame title="Password Checker" subtitle="Entropy evaluation + HIBP breach range API">
      <div className="field">
        <label>Password to test (never stored)</label>
        <div style={{ position: 'relative' }}>
          <input
            type={show ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ paddingRight: 44 }}
            placeholder="Enter password..."
          />
          <button
            type="button"
            className="icon-btn"
            style={{
              position: 'absolute',
              right: 4,
              top: 4,
              width: 36,
              height: 36,
              border: 0,
              background: 'transparent',
            }}
            onClick={() => setShow(!show)}
          >
            {show ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <button className="btn btn-primary" onClick={run} disabled={busy || !password}>
        {busy ? <span className="loader" /> : 'Check strength & breaches'}
      </button>

      {busy && <div className="skeleton" style={{ height: 140, marginTop: 14 }} />}

      {result && (
        <div className="card" style={{ marginTop: 14 }}>
          <div className="row" style={{ border: 0, paddingTop: 0 }}>
            <b>{result.strength}</b>
            <span className={`chip ${result.score > 60 ? 'chip-safe' : result.score > 40 ? 'chip-warn' : 'chip-bad'}`}>
              {result.score}/100 Score
            </span>
          </div>

          <div className="progress" style={{ margin: '8px 0 14px' }}>
            <span
              style={{
                width: `${result.score}%`,
                background:
                  result.score > 60
                    ? 'linear-gradient(90deg, #00ff88, #00c8ff)'
                    : result.score > 40
                      ? 'linear-gradient(90deg, #ffb020, #f59e0b)'
                      : 'linear-gradient(90deg, #ff4d6d, #dc2626)',
              }}
            />
          </div>

          <div className="grid-2">
            <div className="card" style={{ background: 'var(--surface-2)', padding: 12, borderRadius: 14 }}>
              <div className="tiny muted">LENGTH</div>
              <b style={{ fontSize: 16 }}>{result.length} chars</b>
            </div>
            <div className="card" style={{ background: 'var(--surface-2)', padding: 12, borderRadius: 14 }}>
              <div className="tiny muted">ENTROPY</div>
              <b style={{ fontSize: 16 }}>{result.entropy} bits</b>
            </div>
          </div>

          <div style={{ marginTop: 12, padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 14 }}>
            <div className="tiny muted">CRACK TIME ESTIMATION</div>
            <div style={{ fontWeight: 600, fontSize: 14, marginTop: 2 }}>{result.estimatedCrackTime}</div>
            {result.pwned > 0 ? (
              <div style={{ color: 'var(--danger)', fontSize: 12, marginTop: 4, fontWeight: 600 }}>
                ⚠️ Found in {result.pwned.toLocaleString()} data breaches
              </div>
            ) : result.pwned === 0 ? (
              <div style={{ color: 'var(--green)', fontSize: 12, marginTop: 4, fontWeight: 600 }}>
                ✓ No exposure found in known breach corpus
              </div>
            ) : null}
          </div>

          {result.suggestions?.length > 0 && (
            <ul style={{ margin: '14px 0 0', paddingLeft: 18, color: 'var(--muted)', fontSize: 13, lineHeight: 1.55 }}>
              {result.suggestions.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </ScanFrame>
  );
}

export function BreachMonitor() {
  const [email, setEmail] = useState('amina@sentinel.ng');
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (!email.trim() || busy) return;
    setBusy(true);
    setResult(null);
    setResult(await liveBreachCheck(email));
    setBusy(false);
  };

  return (
    <ScanFrame title="Breach Monitor" subtitle="Live MX lookup + Disposable mailbox detection">
      <div className="field">
        <label>Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="yourname@domain.com"
          onKeyDown={(e) => e.key === 'Enter' && run()}
        />
      </div>

      <button className="btn btn-primary" onClick={run} disabled={busy || !email.trim()}>
        {busy ? <span className="loader" /> : 'Check mailbox risk'}
      </button>

      {busy && <div className="skeleton" style={{ height: 120, marginTop: 14 }} />}

      {result && (
        <div className="card" style={{ marginTop: 14 }}>
          <div className="row" style={{ border: 0, paddingTop: 0 }}>
            <span className={`chip ${result.found || !result.mx?.length ? 'chip-warn' : 'chip-safe'}`}>
              {result.found ? 'Risky Mailbox' : 'Domain Active'}
            </span>
            <span className="tiny muted">{result.email}</span>
          </div>

          <p style={{ margin: '10px 0', fontSize: 14, lineHeight: 1.5 }}>{result.note}</p>

          <div style={{ marginTop: 10 }}>
            <div className="tiny muted" style={{ fontWeight: 700, marginBottom: 6 }}>
              SECURITY RECOMMENDATIONS
            </div>
            <ul style={{ paddingLeft: 18, margin: 0, fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
              {result.recommendations.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </ScanFrame>
  );
}
