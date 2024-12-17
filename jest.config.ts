import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1'
  },
  preset: 'rollup-jest',
  transform: {
    '\\.[jt]sx?$': 'babel-jest'
  },
  setupFilesAfterEnv: ['jest-extended/all']
}
export default config
