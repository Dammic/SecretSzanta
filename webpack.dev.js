const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CompressionPlugin = require('compression-webpack-plugin');

const NODE_ENV = process.argv.indexOf('-p') !== -1 ? 'production' : 'development'
const manifest = './vendor-manifest.json'

console.log('Using NODE_ENV:', NODE_ENV)

const productionPlugins = [
    new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {
            warnings: false,
            screw_ie8: true,
            conditionals: true,
            unused: true,
            comparisons: true,
            sequences: true,
            dead_code: true,
            evaluate: true,
            if_return: true,
            join_vars: true,
        },
        output: {
          comments: false,
        },
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'dll.vendor',
        filename: 'dll/dll.vendor.js',
        minChunks(module) {
            const context = module.context
            return context && context.indexOf('node_modules') >= 0
        },
    }),
    new CompressionPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        regExp: /\.js$|\.css$|\.html$/,
        threshold: 1,
    }),
]

const developmentPlugins = [
    new webpack.DllReferencePlugin({
        context: path.join(__dirname, 'src'),
        manifest,
    }),
]

module.exports = {
    cache: true,
    devtool: NODE_ENV === 'production' ? 'cheap-module-source-map' : 'source-map',
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000,
        ignored: /node_modules/,
    },
    entry: {
        app: path.join(__dirname, 'src', 'AppClient.jsx'),
    },
    output: {
        path: path.join(__dirname, 'public'),
        filename: '[name].js',
        chunkFilename: '[name].js',
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(NODE_ENV),
            },
        }),
        ...(NODE_ENV === 'production' ? productionPlugins : developmentPlugins),
        // turn on for bundle size analytics
        // new BundleAnalyzerPlugin({
        //     analyzerMode: 'static',
        // }),
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [
                    path.join(__dirname, 'src'), // important for performance!
                ],
                options: {
                    cacheDirectory: true, // important for performance
                    plugins: NODE_ENV === 'production' ? ['lodash'] : [],
                    presets: ['es2015', 'stage-3', 'stage-1'],
                },
            }, {
                test: /\.jsx$/,
                loader: 'babel-loader',
                include: [
                    path.join(__dirname, 'src'), // important for performance!
                ],
                options: {
                    cacheDirectory: true,
                    plugins: NODE_ENV === 'production' ? ['lodash'] : [],
                    presets: ['react', 'es2015', 'stage-3', 'stage-1'],
                },
            }, {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader?limit=10000&minetype=application/font-woff',
            }, {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader',
            }, {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: [
                    'file-loader',
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            bypassOnDebug: true,
                            mozjpeg: {
                                progressive: true,
                            },
                            gifsicle: {
                                interlaced: false,
                            },
                            optipng: {
                                optimizationLevel: 4,
                            },
                            pngquant: {
                                quality: '75-90',
                                speed: 3,
                            },
                        },
                    },
                ],
            }, {
                test: /\.scss$/,
                loaders: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
                include: [
                    path.join(__dirname, 'src'), // important for performance!
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
}
