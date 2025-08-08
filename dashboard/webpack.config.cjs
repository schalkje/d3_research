const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './js/index.js', // Your main JavaScript file
    output: {
        filename: 'flowdash.min.js', // The bundled file name        
        path: path.resolve(__dirname, 'dist'), // The output directory
        library: 'flowdash',
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: 'flowdash.min.js | (c) schalken.net | Licensed under the MIT License. See https://opensource.org/licenses/MIT',
            entryOnly: true
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
};