import prettier from 'eslint-plugin-prettier';
import jest from 'eslint-plugin-jest';

export default [
  {
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': 'warn',
    },
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
