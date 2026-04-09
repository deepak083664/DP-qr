import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';

// Set axial defaults globally so all requests send the Secure cookies to the backend
axios.defaults.withCredentials = true;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Rely on the HTTP-Only cookie being automatically sent via withCredentials
    axios.get(`${BASE_URL}/api/auth/me`)
      .then(res => {
        setUser(res.data.user);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await axios.post(`${BASE_URL}/api/auth/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      // Optional: window.location.href = '/' to redirect completely state-clean
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
