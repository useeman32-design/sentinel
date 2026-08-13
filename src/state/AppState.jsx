import { createContext, useContext, useMemo, useState } from 'react';

const AppCtx = createContext(null);

const DEMO_USER = {
  name: 'Amina Bello',
  email: 'amina@sentinel.ng',
  company: 'Lagos Fintech Hub',
  role: 'Security Analyst',
  status: 'Active',
  subscription: 'Pro',
};

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

  const value = useMemo(
    () => ({ user, loginLocal, logout, theme, toggleTheme, language, setLanguage, notifOn, setNotifOn }),
    [user, theme, language, notifOn]
  );
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export const useApp = () => useContext(AppCtx);
