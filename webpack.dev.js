const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const NODE_ENV = JSON.stringify(process.env.NODE_ENV || 'production')
const JS_ENV = JSON.stringify(process.env.NODE_ENV || 'production')

console.log('Using NODE_ENV:', NODE_ENV)
console.log('Using JS_ENV:', JS_ENV)

module.exports = {
    cache: true,
    devtool: 'eval',
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000,
        ignored: /node_modules/
    },
    entry: {
        app: path.join(__dirname, 'src', 'AppClient.jsx')
    },
    output: {
        path: path.join(__dirname, 'public'),
        filename: '[name].js',
        chunkFilename: '[name].js'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        new webpack.DllReferencePlugin({
            context: path.join(__dirname, "src"),
            manifest: require('./vendor-manifest.json')
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static'
        }),
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [
                    path.join(__dirname, 'src') //important for performance!
                ],
                query: {
                    cacheDirectory: true, //important for performance
                    presets: ['es2015', 'stage-3', 'stage-1'],
                }
            }, {
                test: /\.jsx$/,
                loader: 'babel-loader',
                include: [
                    path.join(__dirname, 'src'), //important for performance!
                ],
                query: {
                    cacheDirectory: true,
                    presets: ['react', 'es2015', 'stage-3', 'stage-1'],
                },
            }, {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader?limit=10000&minetype=application/font-woff'
            }, {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader'
            }, {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: [
                    'file-loader',
                    {
                        loader: 'image-webpack-loader',
                        query: {
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
                    path.join(__dirname, 'src') //important for performance!
                ],
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    }
}

//module.exports = NODE_ENV === JSON.stringify('production') ?  xxx : {};
