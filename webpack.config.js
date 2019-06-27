const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

const env = process.env.NODE_ENV;
const productionModeEnv = ['dev', 'uat', 'prod'];
let isProductionMode = false;
if (productionModeEnv.includes(env)) {
  isProductionMode = true;
}

const config = {
  mode: 'development',
  target: 'web',
  entry: {
    app: './src/index.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'build/assets'),
    filename: '[name].bundle.js',
    publicPath: '/assets/',
    globalObject: 'self',
  },
  module: {
    rules: [
      {
        test: /\.ts[x]?$/,
        use: ['babel-loader', 'ts-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
            }
          },
        ]
      },
    ],
  },
  devServer: {
    host: '0.0.0.0',
    hot: true,
    port: 8080,
    historyApiFallback: true,
    contentBase: './',
  },
  devtool: '#eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: 'development',
    }),
    new HtmlWebpackPlugin({
      alwaysWriteToDisk: true,
      template: path.resolve(__dirname, './src/template.html'),
      filename: 'index.html',
    }),
    new HtmlWebpackHarddiskPlugin({
      outputPath: path.resolve(__dirname)
    }),
    new CircularDependencyPlugin({
      exclude: /node_modules/, // exclude node_modules
      failOnError: false, // show a warning when there is a circular dependency
    }),
  ],
}

module.exports = config;