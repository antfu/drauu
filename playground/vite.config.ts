import path from 'path'
import { defineConfig } from 'vite'
import WindiCSS from 'vite-plugin-windicss'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
      'drauu': path.resolve(__dirname, '../packages/core/src/index.ts'),
    },
  },
  plugins: [
    WindiCSS(),
  ],
  server: {
    fs: {
      strict: true,
    },
  },
  optimizeDeps: {
    exclude: [
      'drauu',
    ],
  },
})
