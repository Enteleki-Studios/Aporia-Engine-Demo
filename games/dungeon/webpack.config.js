const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const path = require('path')

const commitHash = require('child_process')
    .execSync('git rev-parse --short HEAD')
    .toString().trim()

module.exports = {
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]/[name].bundle.js',
    },
    target: 'web',
    stats: 'errors-warnings',
    devtool: 'inline-source-map',
    resolve: {
        modules: [
            path.resolve(__dirname, 'src'),
            'node_modules',
        ],
        extensions: ['.ts', '.tsx', '.js', '.json'],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new ESLintPlugin({
            extensions: ['js', 'ts', 'tsx'],
            threads: true,
        }),
        new MiniCssExtractPlugin({
            filename: '[name]/[name].css',
        }),
        new HtmlWebpackPlugin({
            title: 'Dungeon',
            filename: 'dungeon/index.html',
            chunks: 'all',
            minify: false,
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
        hot: false,
        client: {
            overlay: {
                errors: true,
                warnings: false,
            },
        },
    },
}
