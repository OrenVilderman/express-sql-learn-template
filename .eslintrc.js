module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'no-console': 'off',
    'class-methods-use-this': 'off',
    'max-len': 'off',
    'eqeqeq': 'off',
    'radix': 'off',
    'import/extensions': 'off',
    'no-plusplus': 'off',
    'no-await-in-loop': 'off',
    'no-return-await': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'guard-for-in': 'off',
    'no-restricted-syntax': 'off',
    'prefer-destructuring': 'off',
    'camelcase': 'off',
    'no-shadow': 'off',
    'import/no-mutable-exports': 'off',
    'consistent-return': 'off',
    'no-promise-executor-return': 'off',
    'no-unused-expressions': 'off',
    'no-async-promise-executor': 'off'
  },
};
