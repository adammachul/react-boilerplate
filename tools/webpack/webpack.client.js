const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');

const nodeEnv = process.env.NODE_ENV || 'development';
const isDev = nodeEnv !== 'production';

const { vendor } = require('./config');

const WebpackIsomorphicTools = require('webpack-isomorphic-tools/plugin');
const webpackIsomorphicTools = new WebpackIsomorphicTools(require('./WIT.config')).development(isDev);

const getPlugins = () => {
    const plugins = [
        new ExtractTextPlugin({
            filename: '[name].[contenthash:8].css',
            allChunks: true,
            disable: isDev,
            ignoreOrder: true,
        }),
        new webpack.EnvironmentPlugin({ NODE_ENV: JSON.stringify(nodeEnv)}),
        new webpack.DefinePlugin({
            __CLIENT__: true,
            __SERVER__: false,
            __DEV__: isDev,
        }),
        webpackIsomorphicTools
    ];

    if (isDev) {
        plugins.push(
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin(),
            new webpack.NoEmitOnErrorsPlugin()
        )
    } else {
        plugins.push(
            new BabiliPlugin(),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                minChunks: Infinity
            })
        )
    }

    return plugins;
}

const getEntry = () => {
    let entry = [
        'babel-polyfill',
        'react-hot-loader/patch',
        'webpack-hot-middleware/client?reload=true',
        './src/client.js',
    ];

    if (!isDev) {
        entry = {
            main: './src/client.js',
            vendor,
        }
    }

    return entry;
}

module.exports = {
    name: 'client',
    target: 'web',
    cache: isDev,
    devtool: isDev ? 'cheap-module-eval-source-map' : 'hidden-source-map',
    context: path.join(process.cwd()),
    entry: getEntry(),
    output: {
        path: path.join(process.cwd(), './build/assets'),
        publicPath: '/assets/',
        filename: isDev ? '[name].js' : '[name].[chunkhash:8].js',
        chunkFilename: isDev ? '[name].chunk.js' : '[name].[chunkhash:8].chunk.js',
        pathinfo: isDev,
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    cacheDirectory: isDev,
                    babelrc: false,
                    presets: [['es2015', { modules: false }], 'react', 'stage-0'],
                    plugins: ['react-hot-loader/babel'],
                }
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                sourceMap: true,
                                modules: true,
                                context: path.join(process.cwd(), './src'),
                                localIdentName: isDev ? '[name]__[local].[hash:base64:5]' : '[hash:base64:5]',
                                minimize: !isDev,
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true,
                            }
                        }

                    ]
                })
            },
            {
                test: /\.(scss|sass)$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 2,
                                sourceMap: true,
                                modules: true,
                                context: path.join(process.cwd(), './src'),
                                localIdentName: isDev ? '[name]__[local].[hash:base64:5]' : '[hash:base64:5]',
                                minimize: !isDev,
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true,
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                outputStyle: 'expanded',
                                sourceMap: true,
                                sourceMapContents: !isDev,
                            }
                        }
                    ]
                })
            },
            {
                test: webpackIsomorphicTools.regularExpression('images'),
                use: [
                    {
                        loader: 'url-loader',
                        options: { limit: 10240 },
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: { bypassOnDebug: true },
                    }
                ]
            }
        ]
    },
    plugins: getPlugins(),
    resolve: {
        modules: ['src', 'node_modules'],
        extensions: ['.js', '.jsx', '.json']
    },
    resolveLoader: {
        modules: ['src', 'node_modules']
    },
    node: {
        fs: 'empty',
        vm: 'empty',
        net: 'empty',
        tls: 'empty',
    }
}
