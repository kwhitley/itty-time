import baseConfig from './node_modules/itty-packager/lib/configs/eslint.config.mjs'

export default [
  ...baseConfig,
  {
    rules: {
      'no-sparse-arrays': 'off',
    },
  }
]