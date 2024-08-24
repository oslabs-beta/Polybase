const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
    entry: './client/index.js', // Entry point of application
    output: {
        filename: 'bundle.js', // Output bundle file
        path: path.resolve(__dirname, 'dist'), // Output directory
        publicPath: '/', // Public URL of the output directory when referenced in a browser
    },
    module: {
        rules: [
            {
                test: /\.js$/, // Transpile .js and .jsx files using Babel
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/, // Process CSS files
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'], // Resolve .js and .jsx files
    },
    plugins: [
        new Dotenv(), // Load environment variables from .env file
    ],
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'), // Directory to serve files from
        historyApiFallback: true, // Serve index.html in place of 404 responses, useful for React Router
        compress: true, // Enable gzip compression for everything served
        port: 9000, // Development server port
        open: true, // Open the browser automatically
    },
    mode: 'development', // Default mode for Webpack
};