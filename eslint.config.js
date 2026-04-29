// https://docs.expo.dev/guides/using-eslint/
const prettierConfig = require('eslint-config-prettier');
const expoConfig = require('eslint-config-expo/flat');
const { defineConfig } = require('eslint/config');

module.exports = defineConfig([
  expoConfig,
  prettierConfig,
  {
    ignores: ['dist/*', 'node_modules/*', '.expo/*'],
  },
]);
