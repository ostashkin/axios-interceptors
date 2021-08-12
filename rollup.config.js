import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

export default {
  input: './src/index.ts',
  output: [
    {
      name: 'axios-interceptors',
      file: pkg.browser,
      format: 'umd',
      globals: { axios: 'axios' },
    },
    {
      file: pkg.main,
      format: 'cjs',
      globals: { axios: 'axios' },
    },
    {
      file: pkg.module,
      format: 'es',
      globals: { axios: 'axios' },
    },
  ],
  plugins: [typescript(), terser()],
  external: ['axios'],
};
