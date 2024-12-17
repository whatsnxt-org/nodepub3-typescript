import { defineConfig } from 'rollup'
import progress from 'rollup-plugin-progress2'
import { cleandir } from 'rollup-plugin-cleandir'
import nodeExternals from 'rollup-plugin-node-externals'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import bable from '@rollup/plugin-babel'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import dts from 'rollup-plugin-dts'
import del from 'rollup-plugin-delete'

// https://www.rollupjs.com/guide/big-list-of-options
const rollupConfig = defineConfig([
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.cjs',
        format: 'cjs',
        exports: 'auto'
      },
      {
        file: 'dist/index.mjs',
        format: 'esm'
      }
    ],
    plugins: [
      // https://gitee.com/taolt/rollup-plugin-progress2
      progress(),

      // https://github.com/mstssk/rollup-plugin-cleandir
      cleandir('dist'),

      // https://github.com/Septh/rollup-plugin-node-externals
      nodeExternals(),

      // https://github.com/rollup/plugins/tree/master/packages/commonjs/#readme
      commonjs(),

      // https://github.com/rollup/plugins/tree/master/packages/node-resolve/#readme
      nodeResolve(),

      // https://github.com/ezolenko/rollup-plugin-typescript2
      typescript({
        tsconfigOverride: {
          exclude: ['test/**/*']
        }
      }),

      // https://github.com/rollup/plugins/tree/master/packages/babel#readme
      bable({
        babelHelpers: 'runtime',
        exclude: 'node_modules/**',
        extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx']
      })
    ]
  },
  {
    input: './dist/index.d.ts',
    output: [
      {
        file: './dist/index.d.ts',
        format: 'es'
      }
    ],
    plugins: [
      // github.com/Swatinem/rollup-plugin-dts#readme
      dts(),

      // github.com/vladshcherbin/rollup-plugin-delete#readme
      del({
        hook: 'buildEnd',
        targets: ['**/*.d.ts', '!**/index.d.ts']
      })
    ]
  }
])

export default rollupConfig
