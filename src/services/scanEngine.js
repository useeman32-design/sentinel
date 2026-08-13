import jsQR from 'jsqr';
import { analyzeUrl as localUrl, analyzeSms as localSms, analyzeEmail as localEmail, analyzePassword as localPassword } from './heuristics';

function verdictFrom(score) {
  return score >= 70 ? 'Dangerous' : score >= 40 ? 'Suspicious' : 'Safe';
}

async function sha1Hex(text) {
  const buf = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

async function sha256Hex(buffer) {
  const buf = await crypto.subtle.digest('SHA-256', buffer);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function liveUrlScan(rawUrl) {
  const base = localUrl(rawUrl);
  const sources = ['on-device heuristics'];
  const extra = [];
  let score = base.riskScore;
  let host = '';
  try {
    host = new URL(rawUrl.includes('://') ? rawUrl : `https://${rawUrl}`).hostname;
  } catch {
    return { ...base, sources, live: true };
  }

  try {
    const dns = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(host)}&type=A`).then((r) => r.json());
    sources.push('Google Public DNS');
    if (dns.Status !== 0 || !dns.Answer?.length) {
      extra.push('Domain has no public A record');
      score += 18;
    } else {
      extra.push(`Resolves to ${dns.Answer.map((a) => a.data).slice(0, 2).join(', ')}`);
    }
  } catch {
    extra.push('DNS lookup blocked in this network');
  }

  try {
    const phish = await fetch(`https://phish.sinking.yachts/v2/check/${encodeURIComponent(host)}`, {
      headers: { Accept: 'application/json' },
    });
    if (phish.ok) {
      const flagged = await phish.json();
      sources.push('Sinking Yachts phishing feed');
      if (flagged === true) {
        extra.push('Domain is on a live phishing blocklist');
        score = Math.max(score, 92);
      } else {
        extra.push('Domain not listed on the live phishing feed');
      }
    }
  } catch {
    extra.push('Phishing feed unreachable — used local engine only');
  }

  score = Math.min(99, score);
  const verdict = verdictFrom(score);
  return {
    ...base,
    verdict,
    riskScore: score,
    explanation: [base.explanation, ...extra].filter(Boolean).join(' '),
    sources,
    live: true,
    host,
  };
}

export async function liveSmsScan(text) {
  const base = localSms(text);
  const urls = [...(text || '').matchAll(/https?:\/\/[^\s]+/gi)].map((m) => m[0]);
  let score = base.riskScore;
  const extra = [];
  const sources = ['SMS language engine'];
  if (urls.length) {
    const first = await liveUrlScan(urls[0]);
    sources.push(...first.sources);
    extra.push(`Embedded link ${urls[0]} → ${first.verdict} (${first.riskScore}).`);
    score = Math.max(score, first.riskScore);
  }
  score = Math.min(99, score);
  return {
    ...base,
    riskScore: score,
    verdict: verdictFrom(score),
    explanation: [base.explanation, ...extra].join(' '),
    sources,
    live: true,
  };
}

export async function liveEmailScan({ from, body, fileText }) {
  const content = fileText || body || '';
  const base = localEmail({ from, body: content });
  const urls = [...content.matchAll(/https?:\/\/[^\s>"']+/gi)].map((m) => m[0]);
  const extra = [];
  const sources = ['email language engine'];
  let score = base.riskScore;
  if (from && /@/.test(from)) {
    const domain = from.split('@').pop();
    const lookalike = /(gtbank|uba|zenith|opay|palmpay|accessbank|firstbank|cbn|nimc).+\.(xyz|top|click|info|tk)/i.test(domain);
    if (lookalike) {
      extra.push(`Sender domain ${domain} impersonates a Nigerian brand.`);
      score += 24;
    }
  }
  if (urls[0]) {
    const link = await liveUrlScan(urls[0]);
    sources.push(...link.sources);
    extra.push(`First link ${link.verdict} (${link.riskScore}).`);
    score = Math.max(score, link.riskScore);
  }
  score = Math.min(99, score);
  return {
    ...base,
    riskScore: score,
    verdict: verdictFrom(score),
    explanation: [base.explanation, ...extra].join(' '),
    sources,
    live: true,
  };
}

export async function livePasswordCheck(password) {
  const base = localPassword(password);
  const sources = ['entropy engine'];
  let pwned = null;
  try {
    const hash = await sha1Hex(password);
    const prefix = hash.slice(0, 5);
    const suffix = hash.slice(5);
    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: { 'Add-Padding': 'true' },
    });
    const text = await res.text();
    const hit = text.split('\n').find((line) => line.startsWith(suffix));
    sources.push('Have I Been Pwned (k-anonymity)');
    if (hit) {
      pwned = parseInt(hit.split(':')[1], 10) || 1;
      base.score = Math.min(base.score, 12);
      base.strength = 'Compromised';
      base.suggestions = [`Seen in ${pwned.toLocaleString()} breaches — never use this password again`, ...base.suggestions];
    } else {
      pwned = 0;
    }
  } catch {
    sources.push('HIBP unreachable');
  }
  return { ...base, pwned, sources, live: true };
}

export async function liveFileScan(file) {
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf.slice(0, 16));
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join(' ');
  const hash = await sha256Hex(buf);
  const sigs = [
    { m: '4d 5a', t: 'Windows executable (MZ)', score: 90 },
    { m: '7f 45 4c 46', t: 'Linux ELF binary', score: 88 },
    { m: '50 4b 03 04', t: 'ZIP / Office / APK archive', score: 52 },
    { m: '25 50 44 46', t: 'PDF document', score: 28 },
    { m: '89 50 4e 47', t: 'PNG image', score: 12 },
    { m: 'ff d8 ff', t: 'JPEG image', score: 12 },
    { m: 'd0 cf 11 e0', t: 'Legacy Office document', score: 40 },
  ];
  const hit = sigs.find((s) => hex.startsWith(s.m));
  const score = hit?.score ?? 30;
  const verdict = verdictFrom(score);
  return {
    fileName: file.name,
    size: file.size,
    sha256: hash,
    magic: hex,
    threatType: hit?.t || 'Unknown binary',
    riskScore: score,
    verdict,
    explanation: `Read ${file.size.toLocaleString()} bytes. Magic header ${hex}. SHA-256 ${hash.slice(0, 16)}…`,
    recommendation:
      verdict === 'Dangerous'
        ? 'Do not run this file. Scan it on a separate device or discard it.'
        : verdict === 'Suspicious'
          ? 'Archives can hide malware. Open only if you requested this file.'
          : 'Looks like a normal document or image. Still avoid macros you did not expect.',
    sources: ['magic-byte inspection', 'SHA-256'],
    live: true,
  };
}

export async function liveQrScan(file) {
  const img = await blobToImageData(file);
  const code = jsQR(img.data, img.width, img.height, { inversionAttempts: 'attemptBoth' });
  if (!code?.data) {
    return {
      verdict: 'Suspicious',
      riskScore: 35,
      threatType: 'Unreadable QR',
      explanation: 'No QR payload could be decoded from this image. Try a sharper, well-lit photo.',
      recommendation: 'Retake the photo or do not scan the code with your camera app.',
      sources: ['jsQR decoder'],
      live: true,
      payload: null,
    };
  }
  const payload = code.data;
  if (/^https?:\/\//i.test(payload) || payload.includes('.')) {
    const url = await liveUrlScan(payload);
    return { ...url, payload, threatType: `QR → ${url.threatType}`, sources: ['jsQR decoder', ...url.sources] };
  }
  return {
    verdict: 'Suspicious',
    riskScore: 48,
    threatType: 'Non-URL QR payload',
    explanation: `Decoded payload: ${payload.slice(0, 180)}`,
    recommendation: 'Do not enter this text into a wallet or bank app unless you created the code.',
    sources: ['jsQR decoder'],
    live: true,
    payload,
  };
}

export async function liveBreachCheck(email) {
  const domain = (email.split('@')[1] || '').toLowerCase();
  const sources = ['MX lookup'];
  let mx = [];
  try {
    const dns = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=MX`).then((r) => r.json());
    mx = (dns.Answer || []).map((a) => a.data);
  } catch {
    /* ignore */
  }
  const disposable = /(mailinator|tempmail|guerrillamail|10minutemail|yopmail)/i.test(domain);
  return {
    email,
    found: disposable,
    mx: mx.slice(0, 3),
    note: disposable
      ? 'This looks like a disposable mailbox — high fraud risk.'
      : mx.length
        ? `Mailbox domain is live (MX: ${mx[0]}). Full leak corpus needs HIBP key on the PHP API.`
        : 'No MX record — this address may not receive mail.',
    recommendations: [
      'Enable 2FA on this mailbox',
      'Use a unique password (check it in Password tool)',
      'Review recovery phone number',
    ],
    sources,
    live: true,
    verdict: disposable || !mx.length ? 'Suspicious' : 'Safe',
    riskScore: disposable ? 72 : mx.length ? 28 : 55,
    threatType: 'Exposure check',
    explanation: disposable || !mx.length ? 'Domain hygiene failed.' : 'Domain accepts mail. Breach dump search requires server API key.',
    recommendation: 'Turn on 2FA and rotate the password if you reuse it anywhere.',
  };
}

function blobToImageData(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const max = 900;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(ctx.getImageData(0, 0, canvas.width, canvas.height));
      URL.revokeObjectURL(img.src);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export async function readTextFile(file) {
  if (!file) return '';
  if (file.type.startsWith('image/')) return '';
  return file.text();
}
