import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'tire-shop-auth-user';

function readUserFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.email === 'string' && parsed.email.trim()) {
      return { email: parsed.email.trim() };
    }
    return null;
  } catch {
    return null;
  }
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setUser(readUserFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      /* ignore quota / private mode */
    }
  }, [user, hydrated]);

  const login = useCallback(async (email, password) => {
    await delay(450);
    const e = String(email ?? '').trim();
    const p = String(password ?? '').trim();
    if (!e || !p) {
      throw new Error('Укажите email и пароль');
    }
    setUser({ email: e });
  }, []);

  const register = useCallback(async (email, password) => {
    await delay(450);
    const e = String(email ?? '').trim();
    const p = String(password ?? '').trim();
    if (!e || !p) {
      throw new Error('Укажите email и пароль');
    }
    setUser({ email: e });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      register,
    }),
    [user, login, logout, register],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
