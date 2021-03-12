const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    entry: './src/app/index.js',
    output: {
        path: __dirname + '/src/public/js',
        publicPath: '/public/js',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$/,
                loader: 'css-loader'
            },
            {
                test: /\.(png|jpg|svg)$/i,
                type: 'asset/resource',
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                        },
                    },
                ],
            },
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ]
};