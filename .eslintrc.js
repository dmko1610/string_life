module.exports = {
  extends: ["expo", "eslint:recommended", "prettier"],
  plugins: ["prettier"],
  rules: { "prettier/prettier": "error" },
  env: { jest: true },
}
