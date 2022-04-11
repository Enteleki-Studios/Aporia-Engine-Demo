const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const path = require('path')

const games = [
    'dungeon',
    // 'zombieHorde',
]

const entries = {}
const modules = []
const htmlPlugins = []

games.forEach((name) => {
    entries[name] = `./src/games/${name}/index.tsx`
    modules.push(path.resolve(__dirname, `src/games/${name}`))
    htmlPlugins.push(
        new HtmlWebpackPlugin({
            title: name,
            filename: `${name}/index.html`,
            template: `src/gengine/html/standardHTMLTemplate.html`,
            chunks: [name],
            minify: false,
        }),
    )
})

module.exports = {
    entry: entries,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]/[name].bundle.js',
    },
    target: 'web',
    stats: 'errors-warnings',
    devtool: 'inline-source-map',
    resolve: {
        modules: [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'src/games'),
            ...modules,
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
        ...htmlPlugins,
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
};
