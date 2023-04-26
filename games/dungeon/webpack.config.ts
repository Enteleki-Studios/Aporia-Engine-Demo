import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import ESLintPlugin from 'eslint-webpack-plugin'
import * as path from 'path'
import { Configuration, ProvidePlugin } from 'webpack'
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server'

const devServer: DevServerConfiguration = {
    port: 2080,
    hot: false,
    client: {
        overlay: {
            errors: true,
            warnings: false,
        },
    },
}

const config: Configuration = {
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        clean: true,
    },
    target: 'web',
    stats: 'errors-warnings',
    devtool: 'inline-source-map',
    resolve: {
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
        extensions: ['.ts', '.tsx', '.js', '.json'],
        alias: {
            postprocessing: path.resolve(__dirname, "../../node_modules/postprocessing/build/postprocessing.esm.js"),
        },
    },
    plugins: [
        new ESLintPlugin({
            extensions: ['js', 'ts', 'tsx'],
            threads: true,
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        new HtmlWebpackPlugin({
            title: 'Dungeon',
            filename: 'index.html',
            chunks: 'all',
            minify: false,
        }),
        new CopyPlugin({
            patterns: [
                { from: 'resources', to: 'resources' },
                { from: 'favicon.ico', to: 'favicon.ico' },
            ],
        }),
        new ProvidePlugin({
            three: 'node_modules/three',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    devServer,
}

export default config
