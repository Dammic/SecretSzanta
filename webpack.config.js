const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CompressionPlugin = require('compression-webpack-plugin')
const BrotliPlugin = require('brotli-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const productionPlugins = [
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
]

module.exports = (env, argv) => {
    console.log(`Using mode: [${argv.mode}]`)
    return {
        cache: true,
        // devtool: NODE_ENV === 'production' ? 'cheap-module-source-map' : 'source-map',
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000,
            ignored: /node_modules/,
        },
        entry: {
            app: path.join(__dirname, 'src', 'AppClient.jsx'),
        },
        output: {
            path: path.join(__dirname, '.dist'),
            filename: '[name].js',
            chunkFilename: '[name].[chunkhash].bundle.js',
            publicPath: '/'
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
            ...(argv.mode === 'production' ? productionPlugins : []),
            new HtmlWebpackPlugin({
                template: 'views/index.html',
            }),
            // turn on for bundle size analytics
            // new BundleAnalyzerPlugin({
            //     analyzerMode: 'static',
            // }),
        ],
        module: {
            rules: [{
                test: /\.js$|\.mjs|\.jsx$/,
                include: [
                    path.join(__dirname, 'src'), // important for performance!
                ],
                exclude: /node_modules/,
                use: {
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
            }],
        },
        resolve: {
            extensions: ['.js', '.jsx', '.mjs'],
            alias: {
                packages: path.resolve('./src/packages'),
            },
        },
    }
}
