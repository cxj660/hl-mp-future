
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/mp-future',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') // 路径别名
    }
  },
  server: {
    port: 5188,
    host: '0.0.0.0',
    proxy: {
      '/dianzi': {
        target: 'http://192.168.7.153:9111'
      },
      '/weixing': {
        target: 'http://192.168.7.153:9111',
        changeOrigin: true
      },
      '/projectAssets': {
        target: 'http://192.168.7.153:9311',
        changeOrigin: true
      },
    }
  },
  build: {
    minify: 'terser',
    outDir: 'mp-future',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true
      }
    }
  }
})
