'use strict'
const webpack = require('webpack')
const path = require('path')

const BUILD_DIR = path.resolve(__dirname, 'public')
const APP_DIR = path.resolve(__dirname, 'src')

// hack for windows 10 ubuntu, ERROR in EINVAL: invalid argument, uv_interface_addresses
// remove when MS fixes their WSL (now on windows version 1607)
try {
    require('os').networkInterfaces()
} catch (e) {
    require('os').networkInterfaces = () => ({})
}

module.exports = {
    cache: true,
    devtool: 'source-map',
    entry: {
        app: APP_DIR + '/AppClient.js'
    },
    watchOptions: {
        poll: true
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
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false },
            mangle: true,
            beautify: false,
            dead_code: true
        }),
        new webpack.DllReferencePlugin({
            context: path.join(__dirname, './'),
            manifest: require('./vendor-manifest.json')
        })
    ],
    module: {
        loaders: [
            {
                test: /\.js?$/,
                loader: 'babel-loader',
                include: [
                    APP_DIR //important for performance!
                ],
                query: {
                    cacheDirectory: true, //important for performance
                    presets: ['react', 'es2015', 'stage-3', 'stage-1']
                }
            }, {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader?limit=10000&minetype=application/font-woff'
            }, {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader'
            }, {
                //IMAGE LOADER
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader:'file-loader'
            }, {
                test: /\.scss$/,
                loaders: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
                include: [
                    APP_DIR // important for performance!
                ],
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
        root: path.resolve(__dirname, './'),
        modulesDirectories: ['node_modules']
    }
}