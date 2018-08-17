const path = require('path')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const NODE_ENV = process.argv.indexOf('prod') !== -1 ? 'production' : 'development'
const vendor = './src/vendors'

console.log('Using NODE_ENV:', NODE_ENV)

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
        vendor,
    },
    output: {
        path: path.join(__dirname, '.dist'),
        filename: '[name].js',
        chunkFilename: '[name].chunkhash.bundle.js',
        publicPath: '/.dist',
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    chunks: 'initial',
                    name: 'vendor',
                    test: 'vendor',
                    enforce: true,
                },
            },
        },
        runtimeChunk: true,
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(NODE_ENV),
            },
        }),
        // turn on for bundle size analytics
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
        }),
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
            packages: path.resolve('./src/packages'),
        },
    },
}
