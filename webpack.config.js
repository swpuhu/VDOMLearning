const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    mode: 'development',
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'webpack-bundle.js'
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        port: 9000
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'VDom'
        })
    ],
    module: {
        rules: [
            {
              test: /\.js$/,
              use: [
                  'babel-loader'
              ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /.\less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            }
        ]
    }

}