import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Backend URL
        changeOrigin: true, // Thay đổi nguồn nếu cần
        secure: false, // Bỏ qua SSL nếu dùng HTTPS trong phát triển
        rewrite: (path) => path.replace(/^\/api/, '') // Tùy chỉnh URL nếu cần
      }
    }
  }
})
