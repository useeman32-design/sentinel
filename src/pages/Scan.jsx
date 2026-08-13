import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBar, TopBar, BottomNav, Verdict } from '../components/Chrome';
import { api } from '../services/api';
import {
  analyzeUrl,
  analyzeSms,
  analyzeEmail,
  analyzePassword,
  analyzeBreach,
  analyzeFile,
} from '../services/heuristics';

const MODULES = [
  { t: 'Link', d: 'Paste any URL', p: '/app/scan/link', c: '#00C8FF' },
  { t: 'Email', d: 'Phishing detector', p: '/app/scan/email', c: '#00FF88' },
  { t: 'SMS', d: 'Scam families', p: '/app/scan/sms', c: '#7C5CFF' },
  { t: 'QR', d: 'Image destination', p: '/app/scan/qr', c: '#00C8FF' },
  { t: 'File', d: 'PDF, ZIP, EXE', p: '/app/scan/file', c: '#FFB020' },
  { t: 'Password', d: 'Strength & entropy', p: '/app/scan/password', c: '#00FF88' },
  { t: 'Breach', d: 'Email exposure', p: '/app/scan/breach', c: '#FF4D6D' },
];

export function ScanHub() {
  const nav = useNavigate();
  return (
    <>
      <StatusBar />
      <div className="scroll page-enter">
        <TopBar title="Threat Scanner" subtitle="On-device pre-check · API when live" />
        <div className="grid-2">
          {MODULES.map((m) => (
            <button key={m.t} className="scan-tile" onClick={() => nav(m.p)}>
              <div className="ico" style={{ color: m.c, background: `${m.c}22` }}>
                ●
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
  const run = async () => {
    setBusy(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 700));
    await api.linkScan({ url });
    setResult(analyzeUrl(url));
    setBusy(false);
  };
  return (
    <ScanFrame title="Link Scanner" subtitle="AI URL reputation">
      <div className="field">
        <label>URL</label>
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://" />
      </div>
      <button className="btn btn-primary" onClick={run} disabled={busy}>
        {busy ? <span className="loader" /> : 'Analyse link'}
      </button>
      {busy && <div className="skeleton" style={{ height: 120, marginTop: 14 }} />}
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
    await new Promise((r) => setTimeout(r, 800));
    await api.emailScan({ from, body, fileName: file?.name });
    setResult(analyzeEmail({ from, body }));
    setBusy(false);
  };
  return (
    <ScanFrame title="Email Scanner" subtitle="Phishing detector">
      <div className="field">
        <label>From</label>
        <input value={from} onChange={(e) => setFrom(e.target.value)} />
      </div>
      <div className="field">
        <label>Paste email</label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} />
      </div>
      <label className="drop">
        Upload .eml or screenshot
        <input
          type="file"
          hidden
          accept=".eml,image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <div className="tiny" style={{ marginTop: 6 }}>{file?.name || 'No file selected'}</div>
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
    await new Promise((r) => setTimeout(r, 650));
    await api.smsScan({ text });
    setResult(analyzeSms(text));
    setBusy(false);
  };
  return (
    <ScanFrame title="SMS Scanner" subtitle="Lottery · bank · crypto · WhatsApp">
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
    setBusy(true);
    await new Promise((r) => setTimeout(r, 800));
    await api.qrScan({ fileName: file?.name });
    setResult(
      analyzeUrl(file ? 'https://pay-verify.ng-secure.xyz/qr' : 'https://play.google.com/store')
    );
    setBusy(false);
  };
  return (
    <ScanFrame title="QR Scanner" subtitle="Destination safety">
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
      <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={run} disabled={busy}>
        {busy ? <span className="loader" /> : 'Decode & analyse'}
      </button>
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
    await new Promise((r) => setTimeout(r, 900));
    await api.fileScan({ fileName: file.name, size: file.size });
    setResult(analyzeFile(file));
    setBusy(false);
  };
  return (
    <ScanFrame title="File Scanner" subtitle="PDF · Word · ZIP · EXE">
      <label className="drop">
        Drop or choose a file
        <input type="file" hidden onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <div className="tiny" style={{ marginTop: 8 }}>{file ? `${file.name} · ${(file.size / 1024).toFixed(1)} KB` : 'Accepted: pdf, doc, zip, apk, exe, images'}</div>
      </label>
      <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={run} disabled={busy || !file}>
        {busy ? <span className="loader" /> : 'Scan file'}
      </button>
      <Verdict result={result} />
    </ScanFrame>
  );
}

export function PasswordChecker() {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState(null);
  const run = async () => {
    await api.passwordCheck({ length: password.length });
    setResult(analyzePassword(password));
  };
  return (
    <ScanFrame title="Password Checker" subtitle="Never stored · analysed on-device">
      <div className="field">
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button className="btn btn-primary" onClick={run}>
        Check strength
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
          <p style={{ fontSize: 14 }}>Estimated crack time: {result.estimatedCrackTime}</p>
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
    await new Promise((r) => setTimeout(r, 600));
    await api.breachCheck({ email });
    setResult(analyzeBreach(email));
    setBusy(false);
  };
  return (
    <ScanFrame title="Breach Monitor" subtitle="Public leak watch">
      <div className="field">
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <button className="btn btn-primary" onClick={run} disabled={busy}>
        {busy ? <span className="loader" /> : 'Check exposure'}
      </button>
      {result && (
        <div className="card" style={{ marginTop: 14 }}>
          <span className="chip chip-info">Awaiting breach corpus</span>
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
