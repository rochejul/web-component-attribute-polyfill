import prettier from 'eslint-plugin-prettier';
import jest from 'eslint-plugin-jest';

export default [
  {
    files: ['**/*/*.js'],
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
    files: ['**/*/*.test.js'],
    plugins: {
      jest,
    },
    rules: {
      'jest/prefer-expect-assertions': 'off',
    },
  },
];
