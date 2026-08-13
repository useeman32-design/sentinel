/**
 * Gemini integration point.
 * Do not hardcode model answers here.
 * Set VITE_GEMINI_API_KEY when the key is available.
 */

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function askGemini({ prompt, system }) {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) {
    return {
      ok: false,
      reason: 'missing_key',
      text: null,
    };
  }

  try {
    const res = await fetch(`${GEMINI_URL}?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: system ? { parts: [{ text: system }] } : undefined,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      }),
    });
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('\n') || null;
    return { ok: Boolean(text), text, raw: data };
  } catch (error) {
    return { ok: false, reason: 'network', text: null, error: String(error) };
  }
}

export const SENTINEL_SYSTEM = `You are Sentinel AI, a cybersecurity assistant protecting people in Nigeria and globally.
Be precise, calm, and practical. Never provide exploit instructions.
Focus on fraud, phishing, SMS scams, identity theft, and account safety.`;
