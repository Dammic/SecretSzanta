module.exports = {
    plugins: {
        'postcss-import': {
            path: './src/styles',
        },
        'postcss-preset-env': {
            features: {
                'nesting-rules': true,
                'custom-media-queries': true,
            },
            stage: 2,
            browsers: 'last 2 versions',
        },
    },
}
