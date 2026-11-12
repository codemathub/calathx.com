import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('calathx_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api.auth
      .me()
      .then((res) => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem('calathx_token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const res = await api.auth.login(credentials);
    localStorage.setItem('calathx_token', res.data.accessToken);
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch {
      // ignore
    }
    localStorage.removeItem('calathx_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

