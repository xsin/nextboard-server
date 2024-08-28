import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: [
      'tests/**/*.test.ts',
    ],
    coverage: {
      provider: 'v8',
      include: [
        'src/**/*.ts',
      ],
      exclude: [
        'src/index.ts',
        'src/types/index.ts',
        'src/utils/index.ts',
        'src/permissions.ts',
        'src/types/prisma.ts',
      ],
      reporter: [
        'text',
        'json',
      ],
    },
  },

})
