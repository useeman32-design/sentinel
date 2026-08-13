const BASE = import.meta.env.VITE_API_URL || '';

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data, offline: false };
  } catch {
    return { ok: false, status: 0, data: null, offline: true };
  }
}

export const api = {
  login: (payload) => request('/api/login', { method: 'POST', body: payload }),
  register: (payload) => request('/api/register', { method: 'POST', body: payload }),
  forgotPassword: (payload) => request('/api/forgot-password', { method: 'POST', body: payload }),
  verifyEmail: (payload) => request('/api/verify-email', { method: 'POST', body: payload }),
  resetPassword: (payload) => request('/api/reset-password', { method: 'POST', body: payload }),
  googleLogin: (payload) => request('/api/auth/google', { method: 'POST', body: payload }),
  linkScan: (payload, token) => request('/api/link-scan', { method: 'POST', body: payload, token }),
  emailScan: (payload, token) => request('/api/email-scan', { method: 'POST', body: payload, token }),
  smsScan: (payload, token) => request('/api/sms-scan', { method: 'POST', body: payload, token }),
  qrScan: (payload, token) => request('/api/qr-scan', { method: 'POST', body: payload, token }),
  fileScan: (payload, token) => request('/api/file-scan', { method: 'POST', body: payload, token }),
  passwordCheck: (payload, token) => request('/api/password-check', { method: 'POST', body: payload, token }),
  breachCheck: (payload, token) => request('/api/breach-check', { method: 'POST', body: payload, token }),
  chat: (payload, token) => request('/api/chat', { method: 'POST', body: payload, token }),
  reports: (token) => request('/api/reports', { token }),
  createReport: (payload, token) => request('/api/reports', { method: 'POST', body: payload, token }),
};

export default api;
