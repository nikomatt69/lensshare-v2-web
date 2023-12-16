import esbuild from 'esbuild';
import dotenv from 'dotenv';
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
