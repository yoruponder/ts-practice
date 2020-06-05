const config = require('./webpack.config.js');
const path = require('path');

module.exports = {
    ...config,
    mode: "development",
    module: {
        rules: [
            ...config.module.rules,
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader',
                ]
            },
        ]
    },
    devServer: {
        contentBase: path.resolve(__dirname, './dist'),
        host: 'localhost',
        port: 5000,
        quiet: false,
        inline: true,
        progress: true,
        compress: true
    }
}