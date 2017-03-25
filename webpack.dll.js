'use strict'
const path = require('path')
const webpack = require('webpack')

module.exports = {
    entry: {
        vendor: ['vendors.js']
    },
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'dll.[name].js',
        library: '[name]'
    },
    plugins: [
        new webpack.DllPlugin({
            path: '[name]-manifest.json',
            name: '[name]',
            context: path.resolve(__dirname, './')
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false },
        })
    ],
    resolve: {
        root: path.resolve(__dirname, './'),
        modulesDirectories: ['node_modules']
    }
}