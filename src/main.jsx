import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { SyncProvider } from './context/SyncContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SyncProvider>
        <ThemeProvider>
          <LanguageProvider>
            <ToastProvider>
              <AdminAuthProvider>
                <AuthProvider>
                  <CartProvider>
                    <WishlistProvider>
                      <App />
                    </WishlistProvider>
                  </CartProvider>
                </AuthProvider>
              </AdminAuthProvider>
            </ToastProvider>
          </LanguageProvider>
        </ThemeProvider>
      </SyncProvider>
    </BrowserRouter>
  </React.StrictMode>
);
