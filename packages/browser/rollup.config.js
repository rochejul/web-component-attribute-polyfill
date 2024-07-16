import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.js',
  output: [
    {
      format: 'cjs',
      file: 'build/bundle.cjs',
    },
    {
      format: 'es',
      file: 'build/bundle.js',
    },
    {
      format: 'iife',
      file: 'build/bundle.iife.js',
    },
    {
      format: 'umd',
      file: 'build/bundle.umd.js',
    },
    {
      format: 'amd',
      file: 'build/bundle.amd.js',
    },
  ],
  plugins: [nodeResolve()],
};
