import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src', // Алиас для удобства импортов
    },
  },
  server: {
    host: '0.0.0.0', // Разрешает доступ с внешних IP
    port: 5173, // Убедитесь, что этот порт открыт
    cors: true, // Включает CORS
    hmr: {
      clientPort: 443, // Для работы через ngrok
    },
    allowedHosts: [
      'f57a-116-105-175-119.ngrok-free.app', // Разрешить доступ для ngrok-хоста
    ],
  },
});