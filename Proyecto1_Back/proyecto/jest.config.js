module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js', 'json'],
    rootDir: '.',
    testRegex: '.*\\.spec\\.ts$', // Ejecutar solo archivos .spec.ts
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
    collectCoverageFrom: ['src/**/*.(t|j)s'],
    collectCoverage: false, // Usar npm run test:cov cuando se desee cobertura
    coverageDirectory: './coverage',
    moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  };
  