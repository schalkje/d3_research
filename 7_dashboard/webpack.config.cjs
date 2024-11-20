const path = require('path');

module.exports = {
    entry: './js/index.js', // Your main JavaScript file
    output: {
        filename: 'flowdash.min.js', // The bundled file name        
        path: path.resolve(__dirname, 'dist'), // The output directory
        library: 'flowdash',
    },
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