import { StatusBar, TopBar, BottomNav } from '../components/Chrome';

const FEED = [
  { t: 'Fake CBN BVN recertification SMS', s: 'High', c: 'Phishing', r: 'NG' },
  { t: 'WhatsApp “family emergency” airtime mule', s: 'Critical', c: 'Social', r: 'WA / NG' },
  { t: 'Pig-butchering crypto romance ring', s: 'High', c: 'Fraud', r: 'West Africa' },
  { t: 'Malicious APK posing as Opay update', s: 'Critical', c: 'Malware', r: 'Android' },
  { t: 'Office 365 MFA fatigue campaign', s: 'Medium', c: 'Account', r: 'Global' },
];

export default function Intel() {
  return (
    <>
      <StatusBar />
      <div className="scroll page-enter">
        <TopBar title="Threat Intel" subtitle="Active campaigns" />
        <div className="card" style={{ marginBottom: 12 }}>
          <div className="tiny muted">LAST 24H</div>
          <div className="grid-3" style={{ marginTop: 10 }}>
            <div>
              <b>17</b>
              <div className="tiny muted">Campaigns</div>
            </div>
            <div>
              <b>4</b>
              <div className="tiny muted">Critical</div>
            </div>
            <div>
              <b>NG</b>
              <div className="tiny muted">Focus</div>
            </div>
          </div>
        </div>
        {FEED.map((f) => (
          <div className="card" key={f.t} style={{ marginBottom: 10 }}>
            <div className="row" style={{ paddingTop: 0, border: 0 }}>
              <span className={`chip ${f.s === 'Critical' ? 'chip-bad' : f.s === 'High' ? 'chip-warn' : 'chip-info'}`}>{f.s}</span>
              <span className="tiny muted">{f.r}</span>
            </div>
            <b>{f.t}</b>
            <p className="tiny muted" style={{ margin: '6px 0 0' }}>
              {f.c} · updated just now
            </p>
          </div>
        ))}
      </div>
      <BottomNav active="intel" />
    </>
  );
}
