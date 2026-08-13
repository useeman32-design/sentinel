import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AppCtx = createContext(null);

const DEMO_USER = {
  name: 'Amina Bello',
  email: 'amina@sentinel.ng',
  company: 'Lagos Fintech Hub',
  role: 'Security Analyst',
  status: 'Active',
  subscription: 'Pro',
};

const SEED_NOTIFS = [
  { id: 'n1', kind: 'High Risk', title: 'Dangerous SMS lure blocked', body: 'Lottery claim asking for ₦2,000 “processing fee”.', time: '2m', tone: 'chip-bad', seen: false },
  { id: 'n2', kind: 'Suspicious', title: 'New sign-in from Abuja', body: 'Chrome on Windows · 102.89.x.x', time: '18m', tone: 'chip-warn', seen: false },
  { id: 'n3', kind: 'Password', title: 'Work mailbox below policy', body: 'Entropy under the 70-point floor.', time: '1h', tone: 'chip-warn', seen: false },
  { id: 'n4', kind: 'New Threat', title: 'Fake Opay APK circulating', body: 'Sideloaded update impersonating Opay 4.12.', time: '3h', tone: 'chip-info', seen: false },
];

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sentinel_user')) || null;
    } catch {
      return null;
    }
  });
  const [theme, setTheme] = useState(() => localStorage.getItem('sentinel_theme') || 'dark');
  const [language, setLanguage] = useState('English');
  const [notifOn, setNotifOn] = useState(true);
  const [notifs, setNotifs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sentinel_notifs')) || SEED_NOTIFS;
    } catch {
      return SEED_NOTIFS;
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f4f7fb' : '#0B1220');
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('sentinel_notifs', JSON.stringify(notifs));
  }, [notifs]);

  const loginLocal = (partial) => {
    const next = { ...DEMO_USER, ...partial };
    setUser(next);
    localStorage.setItem('sentinel_user', JSON.stringify(next));
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('sentinel_user');
  };
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('sentinel_theme', next);
  };
  const markReceived = (id) => setNotifs((list) => list.map((n) => (n.id === id ? { ...n, seen: true } : n)));
  const markAllReceived = () => setNotifs((list) => list.map((n) => ({ ...n, seen: true })));

  const unread = notifs.filter((n) => !n.seen).length;

  const value = useMemo(
    () => ({
      user,
      loginLocal,
      logout,
      theme,
      toggleTheme,
      language,
      setLanguage,
      notifOn,
      setNotifOn,
      notifs,
      markReceived,
      markAllReceived,
      unread,
    }),
    [user, theme, language, notifOn, notifs, unread]
  );
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export const useApp = () => useContext(AppCtx);
