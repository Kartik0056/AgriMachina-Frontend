import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendTarget = env.VITE_BACKEND_URL || 'https://agrimachina-backend.onrender.com';

  return {
    plugins: [react()],
    define: {
      'process.env': {}
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true,
          secure: false
        },
        '/uploads': {
          target: backendTarget,
          changeOrigin: true,
          secure: false
        }
      }
    }
  };
});
