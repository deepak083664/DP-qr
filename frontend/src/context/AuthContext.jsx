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
    // 1. Check for token in URL parameters first (passed by backend redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    
    let token = tokenFromUrl || localStorage.getItem('token');
    
    if (tokenFromUrl) {
      // Clean up URL so the token isn't visible to the user
      localStorage.setItem('token', tokenFromUrl);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (token) {
      // Set default header for all future axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Call /me endpoint using cookie OR Authorization header to fetch user info
    axios.get(`${BASE_URL}/api/auth/me`)
      .then(res => {
        setUser(res.data.user);
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
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
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      // Optional: window.location.href = '/' to redirect completely state-clean
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
