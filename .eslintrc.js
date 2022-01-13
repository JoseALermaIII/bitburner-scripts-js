module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: false,
  },
  extends: ["eslint:recommended"],
  parser: "@babel/eslint-parser",
  parserOptions: {
    requireConfigFile: false,
  },
  ignorePatterns: ["conf.js",],
  rules: {
    'no-constant-condition': ['off'],
  }
};