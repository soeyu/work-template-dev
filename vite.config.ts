import { defineConfig } from 'vite'
import transformHtml from './config/template-transformer.js'

export default defineConfig({
  base: './',
  plugins: [transformHtml('lg')],
  build: {
    rollupOptions: {
      external: ['jquery'],
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
  server: {
    proxy: {
      '^/(res_pub|imagelzb|css|imagelzb|res_main|res_dept|postmeta)/': {
        target: 'http://www.lg.gov.cn',
        changeOrigin: true,
      },
    },
  },
})
