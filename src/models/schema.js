/**
 * MySQL model contracts — no ORM, no fake backend.
 * PHP API should persist these tables later.
 */

export const UserModel = {
  table: 'users',
  columns: {
    id: 'INT PK AI',
    name: 'VARCHAR(120)',
    email: 'VARCHAR(190) UNIQUE',
    password_hash: 'VARCHAR(255)',
    company: 'VARCHAR(160)',
    role: 'VARCHAR(80)',
    photo_url: 'VARCHAR(255)',
    email_verified_at: 'DATETIME NULL',
    subscription: 'ENUM(free,pro,enterprise)',
    status: 'ENUM(active,locked,pending)',
    created_at: 'DATETIME',
  },
};

export const ScanModel = {
  table: 'scans',
  columns: {
    id: 'INT PK AI',
    user_id: 'INT FK users.id',
    type: 'ENUM(link,email,sms,qr,file,password,breach)',
    input_hash: 'VARCHAR(64)',
    verdict: 'ENUM(Safe,Suspicious,Dangerous)',
    risk_score: 'TINYINT',
    threat_type: 'VARCHAR(80)',
    explanation: 'TEXT',
    created_at: 'DATETIME',
  },
};

export const ThreatModel = {
  table: 'threats',
  columns: {
    id: 'INT PK AI',
    title: 'VARCHAR(180)',
    category: 'VARCHAR(80)',
    severity: 'ENUM(low,medium,high,critical)',
    region: 'VARCHAR(80)',
    summary: 'TEXT',
    published_at: 'DATETIME',
  },
};

export const ReportModel = {
  table: 'reports',
  columns: {
    id: 'INT PK AI',
    user_id: 'INT FK users.id',
    title: 'VARCHAR(180)',
    risk_level: 'VARCHAR(40)',
    summary: 'TEXT',
    recommendations: 'JSON',
    created_at: 'DATETIME',
  },
};

export const CourseModel = {
  table: 'courses',
  columns: {
    id: 'INT PK AI',
    level: 'ENUM(beginner,intermediate,advanced)',
    title: 'VARCHAR(180)',
    lessons: 'INT',
    duration_min: 'INT',
  },
};

export const NotificationModel = {
  table: 'notifications',
  columns: {
    id: 'INT PK AI',
    user_id: 'INT FK users.id',
    kind: 'ENUM(high_risk,suspicious,password,threat)',
    title: 'VARCHAR(160)',
    body: 'VARCHAR(255)',
    read_at: 'DATETIME NULL',
    created_at: 'DATETIME',
  },
};
