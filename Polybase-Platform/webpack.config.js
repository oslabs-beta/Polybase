const path = require('path');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    entry: isProduction
        ? './client/index.js'
        : [
            'webpack-hot-middleware/client?reload=true',
            './client/index.js',
        ],
    output: {
        filename: isProduction ? 'prodBundle.js' : 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    plugins: [
        new Dotenv(),
        new HtmlWebpackPlugin({
            template: './client/index.html',
            minify: isProduction ? true : false,
        }),
        ...(isProduction
            ? [
                new GenerateSW({
                    clientsClaim: true,
                    skipWaiting: true,
                }),
            ]
            : [
                new webpack.HotModuleReplacementPlugin(),
            ]
        ),
    ],
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        historyApiFallback: true,
        compress: true,
        port: 9000,
        open: true,
        hot: true,
    },
    mode: isProduction ? 'production' : 'development',
};