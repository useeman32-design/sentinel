import { StatusBar, TopBar, BottomNav } from '../components/Chrome';

const STATS = [
  { val: '17', label: 'Active Campaigns' },
  { val: '4', label: 'Critical Threats' },
  { val: '98.4%', label: 'Intercept Rate' },
];

const FEED = [
  {
    t: 'Fake CBN BVN Recertification SMS Surge',
    s: 'Critical',
    c: 'Phishing',
    r: 'Nigeria (Lagos / Abuja)',
    desc: 'Attackers spoofing CBN shortcodes claiming accounts will be locked within 24 hours unless an unverified KYC link is clicked.',
    time: '12m ago',
  },
  {
    t: 'WhatsApp “Family Emergency” Mule Ring',
    s: 'Critical',
    c: 'Social Engineering',
    r: 'West Africa',
    desc: 'Compromised WhatsApp accounts sending urgent audio clips to family contacts demanding urgent bank or Opay transfers.',
    time: '45m ago',
  },
  {
    t: 'Malicious APK Posing as Opay & PalmPay Updates',
    s: 'Critical',
    c: 'Android Banking Trojan',
    r: 'Telegram Channels',
    desc: 'Trojanized APKs requesting SMS reading and accessibility permissions to intercept OTP authentication tokens.',
    time: '2h ago',
  },
  {
    t: 'Pig-Butchering Crypto Romance Syndicates',
    s: 'High',
    c: 'Financial Fraud',
    r: 'Regional',
    desc: 'Targeted dating app lures redirecting victims to fraudulent synthetic trading portals with staged profits.',
    time: '4h ago',
  },
  {
    t: 'Microsoft 365 MFA Push Fatigue Attack',
    s: 'Medium',
    c: 'Account Takeover',
    r: 'Corporate / Global',
    desc: 'Repeated multi-factor authentication push prompts sent during late-night hours until victims accidentally approve.',
    time: '8h ago',
  },
];

export default function Intel() {
  return (
    <>
      <StatusBar />
      <div className="scroll page-enter">
        <TopBar title="Threat Intel" subtitle="Live Nigerian cyber defense feed" />

        <div className="card" style={{ marginBottom: 14 }}>
          <div className="tiny muted" style={{ fontWeight: 800, letterSpacing: '0.06em' }}>
            NATIONAL THREAT DESK · 24H MONITOR
          </div>
          <div className="grid-3" style={{ marginTop: 12, textAlign: 'center' }}>
            {STATS.map((s) => (
              <div key={s.label} style={{ background: 'var(--surface-2)', padding: '10px 6px', borderRadius: 14 }}>
                <b style={{ fontFamily: 'var(--display)', fontSize: 20, color: 'var(--green)' }}>{s.val}</b>
                <div className="tiny muted" style={{ marginTop: 2, fontSize: 10 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-title">Active Campaigns & IOCs</div>

        {FEED.map((f) => (
          <div className="card" key={f.t} style={{ marginBottom: 12 }}>
            <div className="row" style={{ paddingTop: 0, border: 0, marginBottom: 4 }}>
              <span className={`chip ${f.s === 'Critical' ? 'chip-bad' : f.s === 'High' ? 'chip-warn' : 'chip-info'}`}>
                {f.s}
              </span>
              <span className="tiny muted">{f.time}</span>
            </div>
            <b style={{ fontSize: 15, lineHeight: 1.35, display: 'block', margin: '4px 0 6px' }}>{f.t}</b>
            <p className="muted" style={{ fontSize: 13, lineHeight: 1.5, margin: 0 }}>
              {f.desc}
            </p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
              <span className="chip" style={{ background: 'var(--surface-2)', color: 'var(--muted)', fontSize: 10 }}>
                {f.c}
              </span>
              <span className="chip" style={{ background: 'var(--surface-2)', color: 'var(--muted)', fontSize: 10 }}>
                📍 {f.r}
              </span>
            </div>
          </div>
        ))}
      </div>
      <BottomNav active="intel" />
    </>
  );
}
