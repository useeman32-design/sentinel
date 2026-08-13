import { useNavigate, useParams } from 'react-router-dom';
import { StatusBar, TopBar } from '../components/Chrome';

export const COURSES = [
  {
    id: 'beginner',
    title: 'Everyday self-defence',
    blurb: 'OTP, BVN, WhatsApp and ATM basics.',
    lessons: 6,
    progress: 45,
    items: [
      { t: 'How phishing actually works', body: 'Attackers copy a brand you trust, then rush you. Pause. Open the official app yourself.' },
      { t: 'OTP and PIN hygiene', body: 'No bank, CBN or NIMC agent needs your OTP. Hang up and call the number on your card.' },
      { t: 'WhatsApp privacy that matters', body: 'Lock the app, hide last seen, and never approve a new device you did not start.' },
      { t: 'Airtime and “family emergency” scams', body: 'Call the relative on a known number. Do not send airtime to a stranger “holding” them.' },
      { t: 'Safe public Wi-Fi', body: 'Avoid banking on free café Wi-Fi. Use your mobile data or a trusted VPN.' },
      { t: 'Quiz · 8 questions', body: 'Prove you can spot a fake GTBank SMS.' },
    ],
  },
  {
    id: 'intermediate',
    title: 'Account takeover lab',
    blurb: 'SIM-swap, BEC and QR fraud.',
    lessons: 7,
    progress: 20,
    items: [
      { t: 'SIM-swap playbook', body: 'PIN-lock your SIM. If signal dies suddenly, call the operator from another phone.' },
      { t: 'Business email compromise', body: 'Verify new bank details by voice. Attackers sit in inboxes for weeks.' },
      { t: 'QR and invoice swaps', body: 'Check the domain after the scan. A sticker on a POS can point to a thief.' },
      { t: 'Password managers', body: 'One long unique secret per site. Sentinel can test strength without storing it.' },
      { t: 'Quiz · incident drill', body: 'Walk a compromised Opay account to safety.' },
    ],
  },
  {
    id: 'advanced',
    title: 'Team response',
    blurb: 'For analysts and founders.',
    lessons: 8,
    progress: 8,
    items: [
      { t: 'Triage in 15 minutes', body: 'Contain, preserve evidence, notify, then recover.' },
      { t: 'Malware first look', body: 'Never run an unknown EXE. Hash it in the File scanner first.' },
      { t: 'Board-ready reporting', body: 'Risk, impact, residual exposure, next control.' },
      { t: 'Capstone', body: 'Write a one-page brief for a phishing surge.' },
    ],
  },
];

export function Training() {
  const nav = useNavigate();
  return (
    <>
      <StatusBar />
      <div className="scroll page-enter">
        <TopBar title="Cyber Academy" subtitle="Protect yourself in today’s Nigeria" back />
        <div className="academy" style={{ marginBottom: 14 }}>
          <div>
            <h3>Learn. Then scan.</h3>
            <p>Short lessons built around real scams — then jump back into the scanners and practise.</p>
          </div>
        </div>
        {COURSES.map((c) => (
          <button key={c.id} className="card" style={{ width: '100%', textAlign: 'left', marginBottom: 10 }} onClick={() => nav(`/app/training/${c.id}`)}>
            <div className="row" style={{ paddingTop: 0, border: 0 }}>
              <b>{c.title}</b>
              <span className="tiny muted">{c.lessons} lessons</span>
            </div>
            <p className="muted" style={{ margin: '0 0 10px', fontSize: 13 }}>
              {c.blurb}
            </p>
            <div className="progress">
              <span style={{ width: `${c.progress}%` }} />
            </div>
            <div className="tiny muted" style={{ marginTop: 8 }}>
              {c.progress}% complete
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

export function Course() {
  const { id } = useParams();
  const c = COURSES.find((x) => x.id === id) || COURSES[0];
  return (
    <>
      <StatusBar />
      <div className="scroll page-enter">
        <TopBar title={c.title} subtitle="Read · practise · certificate at 100%" back />
        {c.items.map((item, i) => (
          <div className="card" key={item.t} style={{ marginBottom: 10 }}>
            <div className="tiny muted">
              {i + 1 < c.items.length ? `LESSON ${i + 1}` : 'QUIZ'}
            </div>
            <b>{item.t}</b>
            <p className="muted" style={{ margin: '8px 0 0', lineHeight: 1.5 }}>
              {item.body}
            </p>
          </div>
        ))}
        <button className="btn btn-primary" style={{ marginTop: 8 }}>
          Mark lesson complete
        </button>
      </div>
    </>
  );
}
