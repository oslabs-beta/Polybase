import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';

export default {
    input: 'source/index.ts',
    output: [
        {
            file: pkg.main,
            format: 'cjs',
        },
        {
            file: pkg.module,
            format: 'esm',
        },
        {
            file: 'dist/index.umd.js',
            format: 'umd',
            name: 'PolybasePackage',
            globals: {
                lodash: '_',
            },
        },
    ],
    plugins: [
        resolve(),
        commonjs(),
        typescript(),
        babel({
            exclude: 'node_modules/**',
            babelHelpers: 'bundled',
        }),
    ],
    external: ['lodash'],
};