module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  ignorePatterns: ['dist', 'build', 'node_modules', 'coverage', '*.min.js'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    // No telemetry, analytics, or external calls
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    // Minimal deps: prefer built-ins, no polyfills
    'prefer-const': 'error',
    'no-var': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
    // Code clarity
    'no-empty': ['error', { allowEmptyCatch: true }],
    'no-unreachable': 'error',
    'no-fallthrough': 'error',
  },
};
