module.exports = {
  extends: ['expo', 'eslint:recommended', 'prettier', 'plugin:react-hooks/recommended'],
  plugins: ['prettier'],
  rules: { 'prettier/prettier': 'error' },
  env: { jest: true },
};
