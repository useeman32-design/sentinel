import { useNavigate } from 'react-router-dom';
import { StatusBar, TopBar } from '../components/Chrome';
import { api } from '../services/api';

const REPORTS = [
  { id: 'r1', title: 'Weekly Threat Intelligence Brief', risk: 'Low', date: '14 Aug 2026', items: '91 threats blocked · 0 breaches' },
  { id: 'r2', title: 'Lagos Phishing Surge Assessment', risk: 'High', date: '10 Aug 2026', items: '128 lures intercepted · SMS vector' },
  { id: 'r3', title: 'Enterprise Mailbox Hygiene Audit', risk: 'Medium', date: '03 Aug 2026', items: '2 weak passphrases flagged' },
];

export function Reports() {
  const nav = useNavigate();
  return (
    <>
      <StatusBar />
      <div className="scroll page-enter">
        <TopBar title="Executive Reports" subtitle="Compliance & threat intelligence exports" back />

        <div className="section-title">Generated Briefings</div>

        {REPORTS.map((r) => (
          <button
            key={r.id}
            className="card"
            style={{ width: '100%', textAlign: 'left', marginBottom: 12, cursor: 'pointer' }}
            onClick={() => nav(`/app/reports/${r.id}`)}
          >
            <div className="row" style={{ paddingTop: 0, border: 0, marginBottom: 4 }}>
              <b style={{ fontSize: 15 }}>{r.title}</b>
              <span className={`chip ${r.risk === 'High' ? 'chip-bad' : r.risk === 'Medium' ? 'chip-warn' : 'chip-safe'}`}>
                {r.risk} Risk
              </span>
            </div>
            <p className="muted" style={{ margin: '0 0 6px', fontSize: 12 }}>
              {r.items}
            </p>
            <div className="tiny muted">{r.date}</div>
          </button>
        ))}
      </div>
    </>
  );
}

export function ReportDetail() {
  const printPdf = async () => {
    try {
      await api.createReport({ title: 'Weekly Threat Intelligence Brief' });
    } catch {
      // Continue to print
    }
    window.print();
  };

  return (
    <>
      <StatusBar />
      <div className="scroll page-enter">
        <TopBar title="Threat Briefing" subtitle="Executive Security Audit" back />

        <div className="card" style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span className="chip chip-safe">Status · Normal / Low Risk</span>
            <span className="tiny muted">14 Aug 2026</span>
          </div>

          <h3 style={{ fontSize: 18, margin: '0 0 6px' }}>Executive Summary</h3>
          <p className="muted" style={{ lineHeight: 1.6, fontSize: 13 }}>
            During the last 7-day reporting cycle, Sentinel intercepted 91 unauthorized authentication lures and phishing attempts targeting Nigerian corporate personnel. The primary attack vector was spoofed banking KYC messages via SMS and WhatsApp.
          </p>

          <h3 style={{ fontSize: 16, margin: '14px 0 8px' }}>Key Metrics</h3>
          <div className="grid-3" style={{ marginBottom: 14 }}>
            <div style={{ background: 'var(--surface-2)', padding: 10, borderRadius: 12, textAlign: 'center' }}>
              <b style={{ color: 'var(--blue)', fontSize: 18 }}>91</b>
              <div className="tiny muted">Scams Blocked</div>
            </div>
            <div style={{ background: 'var(--surface-2)', padding: 10, borderRadius: 12, textAlign: 'center' }}>
              <b style={{ color: 'var(--green)', fontSize: 18 }}>86%</b>
              <div className="tiny muted">Health Score</div>
            </div>
            <div style={{ background: 'var(--surface-2)', padding: 10, borderRadius: 12, textAlign: 'center' }}>
              <b style={{ color: 'var(--warn)', fontSize: 18 }}>0</b>
              <div className="tiny muted">Takeovers</div>
            </div>
          </div>

          <h3 style={{ fontSize: 16, margin: '14px 0 6px' }}>Actionable Recommendations</h3>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.65, fontSize: 13, color: 'var(--muted)' }}>
            <li>Enforce mandatory hardware or app-based 2FA across corporate email domains.</li>
            <li>Conduct quarterly SIM-swap response drills for authorized bank signatories.</li>
            <li>Distribute the Sentinel Cyber Academy Phishing module to all remote staff.</li>
          </ul>
        </div>

        <button className="btn btn-primary" onClick={printPdf}>
          Export / Print Executive PDF
        </button>
      </div>
    </>
  );
}
