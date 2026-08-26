import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEMES = [
  { id: 'light', name: 'Clean Enterprise (Light)', icon: '☀️', primaryColor: '#166534', bgPreview: '#ffffff' },
  { id: 'dark', name: 'Midnight Emerald (Dark)', icon: '🌙', primaryColor: '#10b981', bgPreview: '#070f1e' },
  { id: 'forest', name: 'Forest Agro (Deep Green)', icon: '🌲', primaryColor: '#34d399', bgPreview: '#03140a' },
  { id: 'amber', name: 'Harvest Gold (Sunset Amber)', icon: '🌅', primaryColor: '#f59e0b', bgPreview: '#141018' }
];

export const ADMIN_THEMES = THEMES;
export const STORE_THEMES = THEMES;

export const ThemeProvider = ({ children }) => {
  // Storefront theme (light / dark / forest / amber)
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('agri_theme');
      if (['light', 'dark', 'forest', 'amber'].includes(savedTheme)) {
        return savedTheme;
      }
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      return 'light';
    } catch (e) {
      return 'light';
    }
  });

  // Admin Portal Theme (light / dark / forest / amber)
  const [adminTheme, setAdminTheme] = useState(() => {
    try {
      const savedAdminTheme = localStorage.getItem('agri_admin_theme');
      if (['light', 'dark', 'forest', 'amber'].includes(savedAdminTheme)) {
        return savedAdminTheme;
      }
      return 'dark'; // Default pro dark theme for admin
    } catch (e) {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('agri_theme', theme);
    } catch (e) {}
  }, [theme]);

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-admin-theme', adminTheme);
      localStorage.setItem('agri_admin_theme', adminTheme);
    } catch (e) {}
  }, [adminTheme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const cycleTheme = () => {
    const order = ['light', 'dark', 'forest', 'amber'];
    const nextIdx = (order.indexOf(theme) + 1) % order.length;
    setTheme(order[nextIdx]);
  };

  const toggleAdminTheme = () => {
    setAdminTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      isDark: theme !== 'light',
      toggleTheme,
      cycleTheme,
      setTheme,
      adminTheme,
      setAdminTheme,
      toggleAdminTheme,
      THEMES,
      ADMIN_THEMES,
      STORE_THEMES
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
