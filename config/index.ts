import { UserConfigExport } from 'vite'
import transformHtml from '@soeyu/dev-template-parser'

const lgConfig: UserConfigExport = {
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
}
export type configPreset = 'lg'
export type configRetrun = configPreset | UserConfigExport
export default function (config: configRetrun): UserConfigExport {
  if (config === 'lg') {
    return lgConfig
  } else return config
}
