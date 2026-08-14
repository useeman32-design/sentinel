import { useNavigate, useParams } from 'react-router-dom';
import { StatusBar, TopBar } from '../components/Chrome';

export const COURSES = [
  {
    id: 'beginner',
    title: 'Everyday Self-Defence',
    blurb: 'Master OTP protection, BVN security, WhatsApp locks and ATM safety.',
    lessons: 6,
    progress: 45,
    items: [
      { t: 'How Phishing Really Works', body: 'Attackers create high-urgency lookalike sites imitating your bank or payment apps. Always pause, verify the domain spelling, and open the official app directly.' },
      { t: 'OTP and PIN Hygiene', body: 'No bank, CBN official, or telecommunications support agent will ever ask for your 6-digit OTP or debit card PIN. Disconnect immediately.' },
      { t: 'Hardening WhatsApp & Social Accounts', body: 'Enable Two-Step Verification with a PIN, disable automatic group additions, and audit linked web sessions regularly.' },
      { t: 'Airtime & “Emergency” Impersonation Scams', body: 'Always phone the family member or friend on their known cellular line before transferring emergency funds or airtime requested via chat.' },
      { t: 'Public Wi-Fi & Shared Device Safety', body: 'Never perform financial transactions or login to sensitive portals on free public Wi-Fi without an encrypted VPN tunnel.' },
      { t: 'Practical Quiz · 8 Questions', body: 'Test your ability to spot deceptive SMS headers and domain typos.' },
    ],
  },
  {
    id: 'intermediate',
    title: 'Account Takeover Lab',
    blurb: 'SIM-swap prevention, BEC, spoofed invoices and QR tampering.',
    lessons: 5,
    progress: 20,
    items: [
      { t: 'SIM-Swap Playbook & Indicators', body: 'Set a custom SIM PIN with your telecom provider. If your phone suddenly loses network bars in a known good coverage zone, alert your bank immediately.' },
      { t: 'Business Email Compromise (BEC)', body: 'Attackers silently compromise vendor mailboxes and send altered bank settlement details. Always verbally verify account changes via known telephone numbers.' },
      { t: 'Malicious QR Codes & POS Tampering', body: 'Examine QR code stickers on physical counters for tampering. Always review the decoded URL before submitting credentials.' },
      { t: 'Password Managers & Unique Entropy', body: 'Use unique, high-entropy passphrases for every portal. Never reuse banking passwords on social media or e-commerce sites.' },
      { t: 'Live Incident Drill', body: 'Step-by-step walkthrough of isolating a compromised mobile device and reclaiming stolen credentials.' },
    ],
  },
  {
    id: 'advanced',
    title: 'Team & Enterprise Response',
    blurb: 'Triage playbooks, malware signature analysis, and board-ready reporting.',
    lessons: 4,
    progress: 10,
    items: [
      { t: 'Incident Triage in 15 Minutes', body: 'Immediate containment, session revocation, artifact preservation, regulatory notification, and disaster recovery execution.' },
      { t: 'Malware First Look & Header Analysis', body: 'Inspecting PE headers, magic bytes, ELF markers, and cryptographic hashes without executing untrusted binaries.' },
      { t: 'Executive Risk Communication', body: 'Translating technical indicators of compromise (IOCs) into measurable business risk, impact matrices, and preventive controls.' },
      { t: 'Capstone Defense Drill', body: 'Draft a comprehensive response protocol for a coordinated spear-phishing attack targeting finance staff.' },
    ],
  },
];

export function Training() {
  const nav = useNavigate();
  return (
    <>
      <StatusBar />
      <div className="scroll page-enter">
        <TopBar title="Cyber Academy" subtitle="Interactive defense training for Nigeria" back />

        <div className="academy" style={{ marginBottom: 14 }}>
          <div>
            <h3>Interactive Academy</h3>
            <p>Practical lessons modeled on real Nigerian fraud campaigns. Learn defense principles, then practice in the scanners.</p>
          </div>
        </div>

        <div className="section-title">Available Learning Tracks</div>

        {COURSES.map((c) => (
          <button
            key={c.id}
            className="card"
            style={{ width: '100%', textAlign: 'left', marginBottom: 12, cursor: 'pointer' }}
            onClick={() => nav(`/app/training/${c.id}`)}
          >
            <div className="row" style={{ paddingTop: 0, border: 0, marginBottom: 4 }}>
              <b style={{ fontSize: 16 }}>{c.title}</b>
              <span className="tiny muted">{c.lessons} lessons</span>
            </div>
            <p className="muted" style={{ margin: '0 0 12px', fontSize: 13, lineHeight: 1.45 }}>
              {c.blurb}
            </p>
            <div className="progress">
              <span style={{ width: `${c.progress}%` }} />
            </div>
            <div className="tiny muted" style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
              <span>{c.progress}% completed</span>
              <span style={{ color: 'var(--blue)', fontWeight: 600 }}>Start lesson →</span>
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
        <TopBar title={c.title} subtitle="Read & complete drills for certificate" back />

        {c.items.map((item, i) => (
          <div className="card" key={item.t} style={{ marginBottom: 12 }}>
            <div className="tiny muted" style={{ fontWeight: 800, letterSpacing: '0.06em', marginBottom: 4 }}>
              {i + 1 < c.items.length ? `MODULE 0${i + 1}` : 'EXAM / DRILL'}
            </div>
            <b style={{ fontSize: 15 }}>{item.t}</b>
            <p className="muted" style={{ margin: '8px 0 0', lineHeight: 1.55, fontSize: 13 }}>
              {item.body}
            </p>
          </div>
        ))}

        <button className="btn btn-primary" style={{ marginTop: 12, marginBottom: 20 }}>
          Mark Track Complete
        </button>
      </div>
    </>
  );
}
