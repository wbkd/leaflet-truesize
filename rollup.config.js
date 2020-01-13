import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import html from 'rollup-plugin-html';

import pkg from './package.json';

const isProd = process.env.NODE_ENV === 'production';

export default [
  {
    input: 'src/index.js',
    output: {
      file: pkg.browser,
      format: 'umd',
      globals: {
        leaflet: 'L'
      },
      name: 'Leaflet.TrueSize',
      sourcemap: true
    },
    external: ['leaflet'],
    plugins: [
      resolve(),
      commonjs(),
      babel({
        presets: ['@babel/preset-env'],
        exclude: 'node_modules/**'
      }),
      !isProd &&
        livereload({
          watch: ['playground', 'dist']
        }),
      !isProd &&
        serve({
          port: 3000,
          contentBase: ['playground', 'dist']
        }),
      !isProd &&
        html({
          include: 'playground/index.html'
        })
    ]
  },
  {
    input: 'src/index.js',
    external: [
      'leaflet',
      '@turf/bearing',
      '@turf/distance',
      '@turf/destination',
      '@turf/meta'
    ],
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        globals: {
          leaflet: 'L'
        }
      },
      {
        file: pkg.module,
        format: 'es',
        globals: {
          leaflet: 'L'
        }
      }
    ]
  }
];
