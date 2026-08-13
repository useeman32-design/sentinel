import { useNavigate, useParams } from 'react-router-dom';
import { StatusBar, TopBar } from '../components/Chrome';

const COURSES = [
  {
    id: 'beginner',
    title: 'Beginner defence',
    lessons: 8,
    progress: 45,
    items: ['What is phishing', 'OTP hygiene', 'WhatsApp privacy', 'Quiz 1'],
  },
  {
    id: 'intermediate',
    title: 'Intermediate ops',
    lessons: 10,
    progress: 20,
    items: ['Business email compromise', 'QR fraud', 'SIM swap', 'Quiz 2'],
  },
  {
    id: 'advanced',
    title: 'Advanced response',
    lessons: 12,
    progress: 8,
    items: ['Incident playbooks', 'Malware triage', 'Board reporting', 'Capstone'],
  },
];

export function Training() {
  const nav = useNavigate();
  return (
    <>
      <StatusBar />
      <div className="scroll page-enter">
        <TopBar title="Training" subtitle="Academy" back />
        {COURSES.map((c) => (
          <button key={c.id} className="card" style={{ width: '100%', textAlign: 'left', marginBottom: 10 }} onClick={() => nav(`/app/training/${c.id}`)}>
            <div className="row" style={{ paddingTop: 0, border: 0 }}>
              <b>{c.title}</b>
              <span className="tiny muted">{c.lessons} lessons</span>
            </div>
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
        <TopBar title={c.title} subtitle="Lessons · video · quiz · certificate" back />
        <div className="card" style={{ marginBottom: 12 }}>
          <div className="drop" style={{ marginBottom: 10 }}>
            Video lesson placeholder
          </div>
          <div className="progress">
            <span style={{ width: `${c.progress}%` }} />
          </div>
        </div>
        {c.items.map((item, i) => (
          <div className="card" key={item} style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
            <span>
              {i + 1}. {item}
            </span>
            <span className="tiny muted">{i === c.items.length - 1 ? 'Quiz' : 'Lesson'}</span>
          </div>
        ))}
        <button className="btn btn-primary" style={{ marginTop: 8 }}>
          Continue · certificate at 100%
        </button>
      </div>
    </>
  );
}
