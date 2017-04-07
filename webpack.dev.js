'use strict'
var path = require("path")
var webpack = require("webpack")

// hack for windows 10 ubuntu, ERROR in EINVAL: invalid argument, uv_interface_addresses
// remove when MS fixes their WSL (now on windows version 1607)
try {
    require('os').networkInterfaces()
} catch (e) {
    require('os').networkInterfaces = () => ({})
}

module.exports = {
    cache: true,
    devtool: "eval",
    entry: {
        app: path.join(__dirname, "src", "AppClient.js")
    },
    watchOptions: {
        poll: true
    },
    output: {
        path: path.join(__dirname, "public"),
        filename: "[name].js",
        chunkFilename: "[name].js"
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        //Typically you'd have plenty of other plugins here as well
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require("./vendor-manifest.json")
        })
    ],
    module: {
        loaders: [
            {
                test: /\.js?$/,
                loader: "babel",
                include: [
                    path.join(__dirname, "src") //important for performance!
                ],
                query: {
                    cacheDirectory: true, //important for performance
                    plugins: ["transform-regenerator"],
                    presets: ["react", "es2015", "stage-3", "stage-1"]
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
                    path.join(__dirname, "src") //important for performance!
                ],
            }
        ]
    },
    resolve: {
        extensions: ["", ".js"],
        root: path.resolve(__dirname, "src"),
        modulesDirectories: ["node_modules"]
    }
}