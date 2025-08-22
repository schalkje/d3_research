const path = require('path');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    const isAnalyze = env && env.analyze;
    
    const config = {
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

    // Add bundle analyzer plugin when analyzing
    if (isAnalyze) {
        config.plugins.push(
            new BundleAnalyzerPlugin({
                analyzerMode: 'server',
                analyzerHost: '127.0.0.1',
                analyzerPort: 8888,
                reportFilename: 'report.html',
                defaultSizes: 'parsed',
                openAnalyzer: true,
                generateStatsFile: false,
                statsFilename: 'stats.json',
                statsOptions: null,
                logLevel: 'info'
            })
        );
    }

    return config;
};