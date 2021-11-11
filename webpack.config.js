const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const path = require('path')

module.exports = {
    entry: './src/index.tsx',
    target: 'web',
    stats: 'errors-warnings',
    resolve: {
        modules: [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'src/Dungeon'),
        ],
        extensions: ['.ts', '.tsx', '.js', '.json'],
    },
    plugins: [
        new ESLintPlugin({
            extensions: ['js', 'ts'],
        }),
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            title: 'index',
            template: 'src/index.html',
        }),
        new CopyPlugin({
            patterns: [
                { from: 'resources', to: 'resources' },
                { from: 'favicon.ico', to: 'favicon.ico' },
            ],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    devServer: {
        port: 2080,
        host: '0.0.0.0',
    },
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
};
