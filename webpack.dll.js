const path = require('path')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
    entry: {
        vendor: [path.join(__dirname, 'src', 'vendors.js')]
    },
    output: {
        path: path.join(__dirname, 'public', 'dll'),
        filename: 'dll.[name].js',
        library: '[name]'
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, '[name]-manifest.json'),
            name: '[name]',
            context: path.resolve(__dirname, 'src')
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false },
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static'
        })
    ],
}
