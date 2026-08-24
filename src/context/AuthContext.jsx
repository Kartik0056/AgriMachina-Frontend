import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initUser = async () => {
      const storedToken = localStorage.getItem('user_token');
      if (storedToken) {
        try {
          const res = await api.get('/users/me', {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          if (res.data.success) {
            setUser(res.data.user);
          }
        } catch (err) {
          localStorage.removeItem('user_token');
          localStorage.removeItem('user_data');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/users/login', { email, password });
    if (res.data.success) {
      localStorage.setItem('user_token', res.data.token);
      localStorage.setItem('user_data', JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await api.post('/users/register', userData);
    if (res.data.success) {
      localStorage.setItem('user_token', res.data.token);
      localStorage.setItem('user_data', JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res.data;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const logout = async () => {
    try {
      await api.post('/users/logout');
    } catch (e) {}
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_data');
    setUser(null);
  };

  const updateUserData = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user_data', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateUserData,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
