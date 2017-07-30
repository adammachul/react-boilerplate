const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const BabiliPlugin = require('babili-webpack-plugin');

module.exports = {
    name: 'server',
    target: 'node',
    externals: [nodeExternals({
        whitelist: [/\.(?!(?:jsx?|json)$).{1,5}$/i],
    })],
    devtool: 'hidden-source-map',
    context: path.join(process.cwd()),
    entry: {
        server: ['./src/server.js']
    },
    output: {
        path: path.join(process.cwd(), './build'),
        filename: '[name].js',
        chunkFilename: '[name].[chunkhash:8].chunk.js',
        libraryTarget: 'commonjs2',
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    babelrc: false,
                    presets: [['es2015', { modules: false }], 'react', 'stage-0']
                }
            },
            {
                test: /\.(css|scss|sass)$/,
                use: [
                    {
                        loader: 'css-loader/locals',
                        options: {
                            modules: true,
                            context: path.join(process.cwd(), './src'),
                            localIdentName: '[hash:base64:5]',
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new BabiliPlugin(),
        new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
        new webpack.optimize.ModuleConcatenationPlugin(),
    ],
    resolve: {
        modules: ['src', 'node_modules'],
        extensions: ['.js', '.jsx', '.json'],
    },
    resolveLoader: {
        modules: ['src', 'node_modules'],
    },
    node: {
        console: false,
        global: false,
        process: false,
        Buffer: false,
        __filename: true,
        __dirname: true,
    }
}
