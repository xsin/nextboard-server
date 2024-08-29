// @ts-check
import antfu from '@antfu/eslint-config'
import globals from 'globals'

export default antfu(
  {
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    formatters: true,
  },
  {
    ignores: [
      '**/out/',
      '**/__tests__/',
      '**/prisma/migrations/',
    ],
  },
  {
    rules: {
      'eslint-comments/no-unlimited-disable': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': 'off',
    },
  },
)
