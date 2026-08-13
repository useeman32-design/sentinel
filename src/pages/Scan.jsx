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
  { t: 'Link', d: 'Live DNS + phishing feed', p: '/app/scan/link', c: '#00C8FF', ico: Ico.link },
  { t: 'Email', d: 'Header + link inspection', p: '/app/scan/email', c: '#34d399', ico: Ico.mail },
  { t: 'SMS', d: 'Scam families + URLs', p: '/app/scan/sms', c: '#a78bfa', ico: Ico.sms },
  { t: 'QR', d: 'Decode then reputation', p: '/app/scan/qr', c: '#38bdf8', ico: Ico.qr },
  { t: 'File', d: 'Magic bytes + SHA-256', p: '/app/scan/file', c: '#fbbf24', ico: Ico.file },
  { t: 'Password', d: 'Entropy + HIBP', p: '/app/scan/password', c: '#00FF88', ico: Ico.lock },
  { t: 'Breach', d: 'MX + mailbox hygiene', p: '/app/scan/breach', c: '#fb7185', ico: Ico.breach },
];

export function ScanHub() {
  const nav = useNavigate();
  return (
    <>
      <StatusBar />
      <div className="scroll page-enter">
        <TopBar title="Threat Scanner" subtitle="Live engines · nothing is simulated" />
        <div className="scan-grid">
          {MODULES.map((m) => (
            <button key={m.t} className="scan-tile" onClick={() => nav(m.p)}>
              <div className="ico" style={{ color: m.c, background: `${m.c}22` }}>
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
        {children}
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
  return (
    <ScanFrame title="Link Scanner" subtitle="Google DNS + live phishing feed">
      <div className="field">
        <label>URL</label>
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://" />
      </div>
      <button className="btn btn-primary" onClick={run} disabled={busy || !url.trim()}>
        {busy ? <span className="loader" /> : 'Analyse link'}
      </button>
      {busy && <div className="skeleton" style={{ height: 120, marginTop: 14 }} />}
      {err && <p className="tiny" style={{ color: 'var(--danger)' }}>{err}</p>}
      <Verdict result={result} />
    </ScanFrame>
  );
}

export function EmailScanner() {
  const [from, setFrom] = useState('security@gtb-alerts.com');
  const [body, setBody] = useState('Dear customer, your BVN will be deactivated. Verify now: http://bit.ly/upd');
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const run = async () => {
    setBusy(true);
    const fileText = await readTextFile(file);
    setResult(await liveEmailScan({ from, body, fileText }));
    setBusy(false);
  };
  return (
    <ScanFrame title="Email Scanner" subtitle="Parses .eml and inspects every URL">
      <div className="field">
        <label>From</label>
        <input value={from} onChange={(e) => setFrom(e.target.value)} />
      </div>
      <div className="field">
        <label>Paste email</label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} />
      </div>
      <label className="drop">
        Upload .eml
        <input type="file" hidden accept=".eml,.txt" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <div className="tiny" style={{ marginTop: 6 }}>{file?.name || 'Optional raw email file'}</div>
      </label>
      <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={run} disabled={busy}>
        {busy ? <span className="loader" /> : 'Detect phishing'}
      </button>
      <Verdict result={result} />
    </ScanFrame>
  );
}

export function SmsScanner() {
  const [text, setText] = useState('Congratulations! You won ₦2,000,000 MTN promo. Pay ₦2,000 to claim via this link http://bit.ly/win');
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const run = async () => {
    setBusy(true);
    setResult(await liveSmsScan(text));
    setBusy(false);
  };
  return (
    <ScanFrame title="SMS Scanner" subtitle="Language engine + live URL check">
      <div className="field">
        <label>Message</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <button className="btn btn-primary" onClick={run} disabled={busy}>
        {busy ? <span className="loader" /> : 'Scan SMS'}
      </button>
      <Verdict result={result} />
    </ScanFrame>
  );
}

export function QrScanner() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const run = async () => {
    if (!file) return;
    setBusy(true);
    setResult(await liveQrScan(file));
    setBusy(false);
  };
  return (
    <ScanFrame title="QR Scanner" subtitle="Decodes the image, then scores the destination">
      <label className="drop">
        Upload QR image
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0];
            setFile(f || null);
            setPreview(f ? URL.createObjectURL(f) : '');
          }}
        />
      </label>
      {preview ? <img src={preview} alt="QR" style={{ margin: '12px auto', width: 160, borderRadius: 12 }} /> : null}
      <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={run} disabled={busy || !file}>
        {busy ? <span className="loader" /> : 'Decode & analyse'}
      </button>
      {result?.payload ? <p className="tiny muted">Payload: {result.payload}</p> : null}
      <Verdict result={result} />
    </ScanFrame>
  );
}

export function FileScanner() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const run = async () => {
    if (!file) return;
    setBusy(true);
    setResult(await liveFileScan(file));
    setBusy(false);
  };
  return (
    <ScanFrame title="File Scanner" subtitle="Reads magic bytes and hashes the file">
      <label className="drop">
        Drop or choose a file
        <input type="file" hidden onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <div className="tiny" style={{ marginTop: 8 }}>
          {file ? `${file.name} · ${(file.size / 1024).toFixed(1)} KB` : 'PDF, Word, ZIP, APK, EXE, images'}
        </div>
      </label>
      <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={run} disabled={busy || !file}>
        {busy ? <span className="loader" /> : 'Scan file'}
      </button>
      {result?.sha256 ? (
        <p className="tiny muted" style={{ wordBreak: 'break-all' }}>
          SHA-256 {result.sha256}
        </p>
      ) : null}
      <Verdict result={result} />
    </ScanFrame>
  );
}

export function PasswordChecker() {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const run = async () => {
    setBusy(true);
    setResult(await livePasswordCheck(password));
    setBusy(false);
  };
  return (
    <ScanFrame title="Password Checker" subtitle="Never stored · HIBP range API">
      <div className="field">
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button className="btn btn-primary" onClick={run} disabled={busy || !password}>
        {busy ? <span className="loader" /> : 'Check strength'}
      </button>
      {result && (
        <div className="card" style={{ marginTop: 14 }}>
          <div className="row" style={{ border: 0, paddingTop: 0 }}>
            <b>{result.strength}</b>
            <span className={`chip ${result.score > 60 ? 'chip-safe' : result.score > 40 ? 'chip-warn' : 'chip-bad'}`}>
              {result.score}/100
            </span>
          </div>
          <div className="progress" style={{ marginBottom: 12 }}>
            <span style={{ width: `${result.score}%` }} />
          </div>
          <div className="grid-2">
            <div className="card" style={{ background: 'var(--surface-2)' }}>
              <div className="tiny muted">Length</div>
              <b>{result.length}</b>
            </div>
            <div className="card" style={{ background: 'var(--surface-2)' }}>
              <div className="tiny muted">Entropy</div>
              <b>{result.entropy} bits</b>
            </div>
          </div>
          <p style={{ fontSize: 14 }}>
            Estimated crack time: {result.estimatedCrackTime}
            {result.pwned > 0 ? ` · seen in ${result.pwned.toLocaleString()} breaches` : result.pwned === 0 ? ' · not in HIBP corpus' : ''}
          </p>
          <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--muted)', fontSize: 13 }}>
            {result.suggestions.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
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
    setBusy(true);
    setResult(await liveBreachCheck(email));
    setBusy(false);
  };
  return (
    <ScanFrame title="Breach Monitor" subtitle="Live MX lookup + disposable detection">
      <div className="field">
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <button className="btn btn-primary" onClick={run} disabled={busy}>
        {busy ? <span className="loader" /> : 'Check exposure'}
      </button>
      {result && (
        <div className="card" style={{ marginTop: 14 }}>
          <span className={`chip ${result.found || !result.mx?.length ? 'chip-warn' : 'chip-safe'}`}>
            {result.found ? 'Risky mailbox' : 'Domain live'}
          </span>
          <p>{result.note}</p>
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            {result.recommendations.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </ScanFrame>
  );
}
