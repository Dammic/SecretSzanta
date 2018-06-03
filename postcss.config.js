module.exports = {
    plugins: {
        'postcss-import': {
            path: './src/styles',
        },
        'postcss-cssnext': {
            browsers: ['last 2 versions'],
        },
    },
}
