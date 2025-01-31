import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { nodePolyfills } from 'vite-plugin-node-polyfills'; // Добавляем плагин для полифилов

export default defineConfig({
  plugins: [
    vue(),
    nodePolyfills(), // Подключаем плагин для полифилов
  ],
  resolve: {
    alias: {
      '@': '/src', // Упрощение импортов
    },
  },
  server: {
    host: '0.0.0.0', // Открывает сервер для локальной сети
    port: 5173, // Убедитесь, что этот порт свободен
    cors: true, // Включает CORS (если нужно)
    strictPort: true, // Гарантирует, что будет именно 5173
    hmr: true, // Автообновление через WebSockets
  },
  define: {
    'process.env': {}, // Добавляем пустой объект для process.env, если он используется
  },
});