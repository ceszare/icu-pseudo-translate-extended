import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';

import pkg from './package.json';

export default {
  input: './src/index.ts',
  plugins: [
    resolve({
        preferBuiltins: true
    }),
    commonjs(),
    typescript(),
    json()
  ],
  output:[
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'es' }
  ]
}