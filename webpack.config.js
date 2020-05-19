'use strict'
const path = require('path');
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const resolve = dir => path.join(__dirname, '.', dir)

const isProd = process.env.NODE_ENV === 'production'
module.exports = {
    entry: './src/Container.js',
    output: {
        path: path.resolve(__dirname, 'lib'),
        filename: '[name].js',
        libraryTarget: 'umd',
        library: 'pure-container',
        libraryExport: 'default',
        globalObject: 'this'
    },
    devtool: '#source-map',
    module: {
        rules: [{
                test: /\.(js)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                include: [resolve('src'), resolve('test')],
                options: {
                    formatter: require('eslint-friendly-formatter')
                }
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /(\\.jsx|\\.js)$/,
                loader: 'babel',
                exclude: /(node_modules|bower_components)/
            }
        ]
    },
    plugins: isProd ? [
        new UglifyJsPlugin({
            parallel: true,
            uglifyOptions: {
                compress: {
                    warnings: false
                },
                mangle: true
            },
            sourceMap: true
        })
    ] : [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
}
