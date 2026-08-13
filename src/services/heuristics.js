const SMS_SIGNALS = [
  { type: 'Lottery scam', rx: /congratulat|you have won|you['’]ve won|lottery|jackpot|claim your prize/i },
  { type: 'Bank scam', rx: /bvn|nin|otp|account.*(restrict|suspend)|gtbank|uba|zenith|first bank|access bank|kuda/i },
  { type: 'Investment scam', rx: /forex|double your money|roi|investment scheme|guaranteed profit/i },
  { type: 'WhatsApp scam', rx: /whatsapp|click this link|verify your whatsapp/i },
  { type: 'Crypto scam', rx: /bitcoin|usdt|crypto wallet|seed phrase|binance/i },
];

export function analyzeUrl(url) {
  const raw = (url || '').trim();
  const reasons = [];
  let score = 18;
  let threat = 'Clean destination';

  if (!/^https?:\/\//i.test(raw)) {
    reasons.push('Protocol missing or unusual');
    score += 12;
  }
  try {
    const u = new URL(raw.includes('://') ? raw : `https://${raw}`);
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(u.hostname)) {
      reasons.push('Raw IP address instead of a domain');
      score += 28;
      threat = 'Suspicious host';
    }
    if (u.hostname.split('.').length > 4) {
      reasons.push('Excessive subdomains');
      score += 14;
    }
    if (/(bit\.ly|tinyurl|t\.co|rb\.gy|cutt\.ly)/i.test(u.hostname)) {
      reasons.push('Public URL shortener');
      score += 16;
      threat = 'Obfuscated link';
    }
    if (u.username || raw.includes('@')) {
      reasons.push('Credential-style @ in URL');
      score += 30;
      threat = 'Phishing pattern';
    }
    if (/(login|verify|update|secure|account).*-.*(com|net)/i.test(u.hostname)) {
      reasons.push('Brand impersonation pattern');
      score += 26;
      threat = 'Likely phishing';
    }
    if (u.protocol !== 'https:') {
      reasons.push('Not using HTTPS');
      score += 10;
    }
  } catch {
    reasons.push('Malformed URL');
    score += 22;
  }

  score = Math.min(99, score);
  const verdict = score >= 70 ? 'Dangerous' : score >= 40 ? 'Suspicious' : 'Safe';
  return {
    source: 'on-device-precheck',
    verdict,
    riskScore: score,
    threatType: threat,
    explanation: reasons.length ? reasons.join('. ') + '.' : 'No high-risk patterns found in the URL structure.',
    recommendation:
      verdict === 'Safe'
        ? 'You can open this link, but still avoid entering OTPs on unexpected pages.'
        : 'Do not enter passwords, BVN, NIN or OTP on this page. Open the official app instead.',
  };
}

export function analyzeSms(text) {
  const hits = SMS_SIGNALS.filter((s) => s.rx.test(text || ''));
  const urgency = /(immediately|now|expire|last chance|act now|urgent)/i.test(text || '');
  const hasLink = /https?:\/\/|wa\.me|bit\.ly/i.test(text || '');
  let score = 12 + hits.length * 22 + (urgency ? 12 : 0) + (hasLink ? 14 : 0);
  score = Math.min(99, score);
  const verdict = score >= 70 ? 'Dangerous' : score >= 40 ? 'Suspicious' : 'Safe';
  return {
    source: 'on-device-precheck',
    verdict,
    riskScore: score,
    threatType: hits[0]?.type || (hasLink ? 'Unsolicited link' : 'No known scam family'),
    explanation:
      hits.length || urgency || hasLink
        ? `Signals: ${[...hits.map((h) => h.type), urgency ? 'urgency language' : '', hasLink ? 'embedded link' : ''].filter(Boolean).join(', ')}.`
        : 'Message does not match common Nigerian scam templates.',
    recommendation:
      verdict === 'Safe'
        ? 'Looks ordinary. If money is requested, confirm by calling the person on a known number.'
        : 'Do not tap links or send airtime/crypto. Call your bank using the number on your ATM card.',
  };
}

export function analyzeEmail({ body, from }) {
  const text = `${from || ''}\n${body || ''}`;
  const reasons = [];
  let score = 15;
  if (/(verify your account|suspended|unusual activity|confirm your identity)/i.test(text)) {
    reasons.push('Account-pressure language');
    score += 22;
  }
  if (/(password|otp|bvn|nin|credit card|ATM pin)/i.test(text)) {
    reasons.push('Requests sensitive credentials');
    score += 28;
  }
  if (/(won|prize|inheritance|unclaimed)/i.test(text)) {
    reasons.push('Unexpected prize / inheritance hook');
    score += 20;
  }
  if ((body || '').match(/https?:\/\//g)?.length > 2) {
    reasons.push('Multiple outbound links');
    score += 10;
  }
  if (from && !/@/.test(from)) {
    reasons.push('Sender address looks incomplete');
    score += 8;
  }
  score = Math.min(99, score);
  const verdict = score >= 70 ? 'Dangerous' : score >= 40 ? 'Suspicious' : 'Safe';
  return {
    source: 'on-device-precheck',
    verdict,
    riskScore: score,
    threatType: score >= 70 ? 'Phishing' : score >= 40 ? 'Social engineering' : 'Benign correspondence',
    explanation: reasons.length ? reasons.join('. ') + '.' : 'No classic phishing markers detected in the pasted content.',
    recommendation:
      verdict === 'Safe'
        ? 'Still open attachments only from people you expected to hear from.'
        : 'Treat as phishing. Do not click links. Report and delete.',
  };
}

export function analyzePassword(password) {
  const p = password || '';
  const length = p.length;
  const sets = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(p)).length;
  const entropy = Math.round(length * (sets === 4 ? 6.5 : sets === 3 ? 5.5 : sets === 2 ? 4.2 : 3.2));
  let score = Math.min(100, Math.round(entropy * 1.4 + sets * 6));
  if (['password', '123456', 'qwerty', 'nigeria', 'admin'].includes(p.toLowerCase())) score = 4;
  const crack =
    score > 85 ? 'centuries' : score > 70 ? 'several years' : score > 50 ? 'a few months' : score > 30 ? 'days' : 'minutes';
  const suggestions = [];
  if (length < 12) suggestions.push('Use at least 12–16 characters');
  if (sets < 3) suggestions.push('Mix upper, lower, numbers and a symbol');
  if (!/\s/.test(p) && length < 16) suggestions.push('A 4-word passphrase is stronger and easier to remember');
  return {
    source: 'on-device',
    strength: score > 80 ? 'Excellent' : score > 60 ? 'Strong' : score > 40 ? 'Fair' : 'Weak',
    length,
    entropy,
    estimatedCrackTime: crack,
    score,
    suggestions: suggestions.length ? suggestions : ['Unique password + a password manager is ideal'],
  };
}

export function analyzeBreach(email) {
  const domain = (email.split('@')[1] || '').toLowerCase();
  const common = ['gmail.com', 'yahoo.com', 'outlook.com', 'icloud.com', 'hotmail.com'];
  const watched = common.includes(domain);
  return {
    source: 'on-device-precheck',
    email,
    found: false,
    note: watched
      ? 'Full breach corpus requires the PHP API. No local confirmation of a leak.'
      : 'Custom domain — enable domain monitoring on the server for employee-wide alerts.',
    recommendations: [
      'Turn on 2FA for this mailbox',
      'Never reuse this password on banking apps',
      'Review active sessions in Google / Microsoft security',
    ],
  };
}

export function analyzeFile(file) {
  const name = file?.name || 'unknown';
  const ext = name.split('.').pop()?.toLowerCase();
  const risky = ['exe', 'scr', 'js', 'vbs', 'bat', 'apk', 'msi'];
  const archive = ['zip', 'rar', '7z'];
  let score = 20;
  let threat = 'Document';
  if (risky.includes(ext)) {
    score = 88;
    threat = 'Executable payload';
  } else if (archive.includes(ext)) {
    score = 54;
    threat = 'Archive — contents unknown';
  } else if (['pdf', 'doc', 'docx'].includes(ext)) {
    score = 34;
    threat = 'Office / PDF document';
  }
  const verdict = score >= 70 ? 'Dangerous' : score >= 40 ? 'Suspicious' : 'Safe';
  return {
    source: 'on-device-precheck',
    fileName: name,
    size: file?.size || 0,
    verdict,
    riskScore: score,
    threatType: threat,
    explanation: `Extension .${ext || '?'} classified using local policy. Deep sandboxing will run on the PHP API.`,
    recommendation:
      verdict === 'Dangerous'
        ? 'Do not open. Upload only inside an isolated scanner when the backend is live.'
        : 'Open only if you expected this file from a known person.',
  };
}
