import { useNavigate } from 'react-router-dom';
import { StatusBar, TopBar } from '../components/Chrome';
import { api } from '../services/api';

const REPORTS = [
  { id: 'r1', title: 'Weekly threat brief', risk: 'Low', date: '12 Aug 2026' },
  { id: 'r2', title: 'Phishing surge · Lagos', risk: 'High', date: '10 Aug 2026' },
  { id: 'r3', title: 'Staff mailbox hygiene', risk: 'Medium', date: '03 Aug 2026' },
];

export function Reports() {
  const nav = useNavigate();
  return (
    <>
      <StatusBar />
      <div className="scroll page-enter">
        <TopBar title="Reports" subtitle="Executive-ready" back />
        {REPORTS.map((r) => (
          <button key={r.id} className="card" style={{ width: '100%', textAlign: 'left', marginBottom: 10 }} onClick={() => nav(`/app/reports/${r.id}`)}>
            <div className="row" style={{ paddingTop: 0, border: 0 }}>
              <b>{r.title}</b>
              <span className={`chip ${r.risk === 'High' ? 'chip-bad' : r.risk === 'Medium' ? 'chip-warn' : 'chip-safe'}`}>{r.risk}</span>
            </div>
            <div className="tiny muted">{r.date}</div>
          </button>
        ))}
      </div>
    </>
  );
}

export function ReportDetail() {
  const printPdf = async () => {
    await api.createReport({ title: 'Weekly threat brief' });
    window.print();
  };
  return (
    <>
      <StatusBar />
      <div className="scroll page-enter">
        <TopBar title="Weekly threat brief" subtitle="12 Aug 2026" back />
        <div className="card">
          <span className="chip chip-safe">Risk · Low</span>
          <h3>Summary</h3>
          <p className="muted" style={{ lineHeight: 1.55 }}>
            91 scams blocked. Dominant vector: SMS lottery lures impersonating MTN and CBN. No confirmed account takeovers.
          </p>
          <h3>Recommendations</h3>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
            <li>Enable number masking on staff WhatsApp Business</li>
            <li>Force 2FA on all banking and admin mailboxes</li>
            <li>Run the beginner phishing module this week</li>
          </ul>
        </div>
        <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={printPdf}>
          Export PDF
        </button>
      </div>
    </>
  );
}
