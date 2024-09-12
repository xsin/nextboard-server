import path from 'node:path'
import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'
// https://docs.nestjs.com/recipes/swc#vitest
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: [
      '**/*.test.ts',
      '**/*.spec.ts',
    ],
    coverage: {
      provider: 'v8',
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/*.dto.ts',
        '**/*.module.ts',
        'src/main.ts',
        'src/types/',
        '**/*/consts.ts',
        'src/modules/prisma/prisma.service.ts',
        'src/modules/auth/guards/index.ts',
        'vitest.config.ts',
        'vitest.config.e2e.ts',
        'prisma/',
        'scripts/',
        'tests/',
      ],
      reporter: [
        'text',
        'json',
      ],
    },
    server: {
      deps: {
        inline: [
          'reflect-metadata',
        ],
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~': path.resolve(__dirname, './'),
    },
  },
  plugins: [
    // This is required to build the test files with SWC
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
})
