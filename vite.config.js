import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  devServer: {
    proxy: {
        '/api': {
            // 此处的写法，目的是为了 将 /api 替换成 https://www.baidu.com/
            target: 'http://localhost:7860/',
            // 允许跨域
            changeOrigin: true,
            ws: true,
            // pathRewrite: {
            //     '^/api': ''
            // }
        }
    },
    
  },
  server:{  
    open: 'index.html',
    host: '0.0.0.0'
  }
})
