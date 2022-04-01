const webpack = require('webpack');
const HtmlWebpack = require('html-webpack-plugin');
const DotEnvWebpack = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const path = require('path');

const webpackConfig = (env,argv) => {
    const isDev = argv.mode === 'development';
    const devPlugins = [
        new MiniCssExtractPlugin({
            filename : '[name].[contenthash:4].css',
        }),
        new HtmlWebpack({
            filename : 'index.html',
            minify : true,
            inject : 'head',
            scriptLoading : 'defer',
            template : path.join(__dirname,'public/index.html')
        }),
        new DotEnvWebpack(),
        new webpack.DefinePlugin({
            'process.env.MODE' : isDev ? 'development' : 'production'
        }),
        new webpack.ProgressPlugin()
    ];
    const prodPlugins = [
        ...devPlugins,
        new CleanWebpackPlugin()
    ];
    return {
        entry : './src/index.tsx',
        output : {
            filename : '[name].[contenthash:4].bundle.js',
            path : path.join(__dirname,'build'),
            environment : {
                dynamicImport : false,
                const : false,
                forOf : false,
                arrowFunction : false,
                module : false,
                optionalChaining : false,
                templateLiteral : false,
                destructuring : false
            },
            publicPath : '/',
            chunkFilename : '[contenthash:4].chunks.js'
        },
        module : {
            rules : [
                {
                    test : /\.(ts|tsx)$/,
                    use : {
                        loader : 'babel-loader'
                    }
                },
                {
                    test : /\.css$/,
                    use : [
                        MiniCssExtractPlugin.loader,
                        {
                            loader : 'css-loader',
                            options : {
                                modules : {
                                    mode : (resource) => {
                                        if(String(resource).indexOf('node_modules') != -1){
                                            return "global"
                                        }
                                        return "local"
                                    },
                                }
                            }
                        }
                    ]
                }
            ]
        },
        devServer : {
            client : {
                logging : 'info',
                overlay : true,
                progress : true
            },
            port : 3000,
            static : [{
                directory : path.join(__dirname,'public'),
                watch : true,
                publicPath : '/'
            }],
            // open : true,
            host : '0.0.0.0',
            historyApiFallback : true
        },
        resolve : {
            extensions : ['.ts','.tsx','.js','.jsx'],
            alias : {

            }
        },
        plugins : isDev ? devPlugins : prodPlugins,
        optimization : {
            minimize : true,
            splitChunks : {
                chunks : 'all'
            },
            minimizer : [new CssMinimizerPlugin(),'...']
        }
    }
}

module.exports = webpackConfig;