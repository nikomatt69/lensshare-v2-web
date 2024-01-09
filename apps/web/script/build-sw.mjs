import dotenv from 'dotenv';
import esbuild from 'esbuild';

dotenv.config();

const outfile = 'public/sw.js';

esbuild.build({
  target: 'es2020',
  platform: 'browser',
  entryPoints: ['./src/sw/index.ts'],
  outfile,
  allowOverwrite: true,
  format: 'esm',
  bundle: true,
  minify: true
});