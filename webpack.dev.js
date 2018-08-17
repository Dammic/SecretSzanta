const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CompressionPlugin = require('compression-webpack-plugin')
const BrotliPlugin = require('brotli-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const NODE_ENV = process.argv.indexOf('prod') !== -1 ? 'production' : 'development'
const manifest = './vendor-manifest.json'

console.log('Using NODE_ENV:', NODE_ENV)

const productionPlugins = [
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
    new BrotliPlugin({
        asset: '[path].br[query]',
        regExp: /\.js$|\.css$|\.html$/,
        threshold: 1,
    })
]

const developmentPlugins = [
    new webpack.DllReferencePlugin({
        context: path.join(__dirname, 'src'),
        manifest,
    }),
]

const commonPlugins = [
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties',
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
        rules: [{
            test: /\.js$|\.mjs$/,
            include: [
                path.join(__dirname, 'src'), // important for performance!
            ],
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    plugins: NODE_ENV === 'production' ? [...commonPlugins, 'lodash'] : commonPlugins,
                    presets: [
                        ['@babel/preset-env', {
                            targets: {
                                browsers: ['last 2 versions'],
                            },
                        }],
                    ],
                },
            },
        }, {
            test: /\.jsx$/,
            include: [
                path.join(__dirname, 'src'), // important for performance!
            ],
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    plugins: NODE_ENV === 'production' ? [...commonPlugins, 'lodash'] : commonPlugins,

                    presets: [
                        ['@babel/preset-env', {
                            targets: {
                                browsers: ['last 2 versions', 'ie >= 7'],
                            },
                        }],
                        ['@babel/react'],
                    ],
                },
            },
        }, {
            test: /\.(woff|woff2|eot|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'url-loader',
        }, {
            test: /\.(jpe?g|png|gif|svg)$/i,
            use: [
                {
                    loader: 'file-loader',
                }, {
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
            test: /\.css$/,
            include: [
                path.join(__dirname, 'src'), // important for performance!
                path.join(__dirname, 'node_modules/font-awesome/css'),
            ],
            use: [
                {
                    loader: 'style-loader',
                }, {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1,
                        modules: true,
                        localIdentName: '[name]__[local]___[hash:base64:5]',
                    },
                }, {
                    loader: 'postcss-loader',
                    options: {
                        ident: 'postcss',
                    },
                },
            ],
        }, {
            test: /\.scss$/,
            include: [
                path.join(__dirname, 'src'), // important for performance!
            ],
            use: [
                {
                    loader: 'style-loader',
                }, {
                    loader: 'css-loader',
                }, {
                    loader: 'sass-loader',
                },
            ],
        }],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.mjs'],
        alias: {
            packages: path.resolve('./src/packages')
        },
    },
}
