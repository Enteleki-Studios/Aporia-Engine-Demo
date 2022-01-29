const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin').default
const ESLintPlugin = require('eslint-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const path = require('path')

module.exports = {
    entry: {
        dungeon: './src/games/dungeon/index.tsx',
    },
    target: 'web',
    stats: 'errors-warnings',
    resolve: {
        modules: [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'src/games/dungeon'),
        ],
        extensions: ['.ts', '.tsx', '.js', '.json'],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new ESLintPlugin({
            extensions: ['js', 'ts', 'tsx'],
        }),
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            title: 'dungeon',
            filename: 'dungeon.html',
            template: 'src/games/dungeon/index.html',
            chunks: ['dungeon'],
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
                exclude: /node_modules/
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
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
    },
};
