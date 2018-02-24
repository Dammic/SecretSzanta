// THIS FILE IS USED ONLY FOR DEVELOPMENT

const path = require('path')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CompressionPlugin = require('compression-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const NODE_ENV = process.argv.indexOf('-p') !== -1 ? 'production' : 'development'

console.log('Using NODE_ENV:', NODE_ENV)

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
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(NODE_ENV),
            },
        }),
        new UglifyJsPlugin({
            uglifyOptions: {
                ecma: 6,
                warnings: false,
                output: {
                    comments: false,
                },
                toplevel: false,
                nameCache: null,
                ie8: false,
                keep_classnames: undefined,
                keep_fnames: false,
                safari10: false,
            },
            sourceMap: true,
        }),
        new webpack.optimize.AggressiveMergingPlugin(),
        new CompressionPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            regExp: /\.js$|\.css$|\.html$/,
            threshold: 1,
        }),
        new BrotliPlugin({
            asset: '[path].br[query]',
            regExp: /\.js$|\.css$|\.html$/,
            threshold: 1,
        }),
        // turn on for bundle size analytics
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
        }),
    ],
}
