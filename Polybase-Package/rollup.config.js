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
            sourcemap: true
        },
        {
            file: pkg.module,
            format: 'esm',
            sourcemap: true
        },
        {
            file: pkg.browser,
            format: 'umd',
            name: 'PolybasePackage',
            sourcemap: true,
            globals: {
                lodash: '_',
            },
        },
    ],
    external: ['neo4j-driver', 'ioredis', 'mongodb', 'pg', '@influxdata/influxdb-client', 'lodash'],
    plugins: [
        resolve(),
        commonjs(),
        typescript({
            tsconfig: './tsconfig.json' // Ensure a valid tsconfig exists
        }),
        babel({
            exclude: 'node_modules/**',
            babelHelpers: 'bundled',
        }),
    ],
};