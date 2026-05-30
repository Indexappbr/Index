// Flat config do ESLint usando o preset do Expo.
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', '.expo/*', 'node_modules/*', 'android/*', 'ios/*'],
  },
  {
    rules: {
      // Regra de performance (não de correção). Sincronizar estado a partir de
      // dados async/props é um padrão legítimo aqui — mantemos como aviso.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
]);
