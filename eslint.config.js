import js from '@eslint/js';
import globals from 'globals';

import prettier from 'eslint-plugin-prettier';
import jest from 'eslint-plugin-jest';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': 'warn',
    },
    ignores: [
      '**/.*',
      'node_modules/*',
      '--help/*',
      '.husky/*',
      '.vscode/*',
      'images/*',
    ],
  },
  {
    files: ['**/*.test.js'],
    plugins: {
      jest,
    },
    rules: {
      ...jest.configs['flat/all'].rules,
      'jest/prefer-expect-assertions': 'off',
      'jest/consistent-test-it': ['error', { fn: 'test' }],
      'jest/no-hooks': 'off',
    },
  },
];
