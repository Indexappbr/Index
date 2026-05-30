/** Config de testes — preset jest-expo + alias @/ → src/. */
module.exports = {
  preset: 'jest-expo',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // Só rodamos testes de lógica pura por enquanto (services/utils), não de UI.
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
};
