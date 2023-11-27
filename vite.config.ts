import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: '/src'
      }
    ]
  },
  server: {
    open: true,
    proxy: {
      '/dragon': {
        target: 'http://47.95.209.71/', // 实际请求地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dragon/, "/dragon"),
      },
    },
  }
})
