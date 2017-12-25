const path = require('path')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    entry: {
        vendor: [path.join(__dirname, 'src', 'vendors.js')],
    },
    output: {
        path: path.join(__dirname, 'public', 'dll'),
        filename: 'dll.[name].js',
        library: '[name]',
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, '[name]-manifest.json'),
            name: '[name]',
            context: path.resolve(__dirname, 'src'),
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({ // <-- key to reducing React's size
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
            },
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false },
        }),
        new webpack.optimize.AggressiveMergingPlugin(),
        new CompressionPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            regExp: /\.js$|\.css$|\.html$/,
            threshold: 1,
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
        }),
    ],
}
