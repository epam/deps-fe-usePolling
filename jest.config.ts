import path from 'path'
import paths from './paths.config'

export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  rootDir: paths.root,
  roots: [
    paths.app.src
  ],
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 42,
      lines: 64,
      statements: 60
    }
  },
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx}'
  ],
  setupFilesAfterEnv: [
    path.resolve(paths.config.jest, 'enzyme.setup.ts'),
    path.resolve(paths.config.jest, 'jest.overrides.ts')
  ],
  moduleDirectories: [
    'node_modules',
    'src'
  ]
}
