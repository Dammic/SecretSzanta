const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CompressionPlugin = require('compression-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HappyPack = require('happypack')
const happyThreadPool = HappyPack.ThreadPool({ size: 6 })
const getLatestGitCommitHash = require('./utils/webpackUtils').getLatestGitCommitHash

const productionPlugins = [
    new CompressionPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        regExp: /\.js$|\.css$|\.html$/,
        threshold: 1,
    }),
]

module.exports = (env, argv) => {
    console.log(`Using mode: [${argv.mode}]`)
    const isProduction = argv.mode === 'production'

    const imageLoaders = isProduction
        ? [
            { loader: 'file-loader' },
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
        ]
        : [{ loader: 'file-loader' }]

    return {
        cache: true,
        devtool: isProduction ? 'cheap-module-source-map' : 'source-map',
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000,
            ignored: /node_modules/,
        },
        entry: {
            app: path.join(__dirname, 'src', 'AppClient.js'),
        },
        output: {
            path: path.join(__dirname, '.dist'),
            filename: '[name].js',
            chunkFilename: '[name].[chunkhash].bundle.js',
            publicPath: '/',
        },
        optimization: {
            runtimeChunk: 'single',
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        chunks: 'all',
                        name: 'vendor',
                    },
                },
            },
        },
        plugins: [
            new HappyPack({
                id: 'js',
                threadPool: happyThreadPool,
                loaders: [
                    {
                        loader: 'babel-loader',
                        options: {
                            plugins: ['lodash', '@babel/plugin-proposal-class-properties'],
                            presets: [
                                ['@babel/preset-env', {
                                    targets: {
                                        browsers: ['last 2 versions'],
                                    },
                                }],
                                ['@babel/react'],
                            ],
                        },
                    },
                ],
            }),
            new HappyPack({
                id: 'css',
                threadPool: happyThreadPool,
                loaders: [
                    'style-loader',
                    {
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
                            // sourceMap: true,
                        },
                    },
                ],
            }),
            ...(isProduction ? productionPlugins : []),
            new HtmlWebpackPlugin({
                template: 'views/index.html',
                data: {
                    gitVersionHash: getLatestGitCommitHash(),
                },
            }),
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
                loader: 'happypack/loader?id=js',
            }, {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    'file-loader?limit=10000',
                ],
            }, {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: imageLoaders,
            }, {
                test: /\.css$/,
                loader: 'happypack/loader?id=css',
            }],
        },
        resolve: {
            extensions: ['.js', '.mjs'],
            alias: {
                packages: path.resolve('./src/packages'),
            },
        },
    }
}
