import path from 'node:path'
import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    root: './',
  },
  resolve: {
    alias: {
      '@/': path.resolve(__dirname, './src'),
      '~/': path.resolve(__dirname, './'),
    },
  },
  plugins: [
    swc.vite(),
  ],
})
