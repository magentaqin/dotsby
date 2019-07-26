const path = require('path');
const webpack = require('webpack');
// const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CircularDependencyPlugin = require('circular-dependency-plugin');
// const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

const env = process.env.NODE_ENV;

// production config
const config = {
  mode: 'production',
  target: 'web',
  entry: {
    app: './src/index.jsx',
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
        test: /\.js[x]?$/,
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
  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: 'production',
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/template.html'),
      filename: '../index.html',
    }),
  ],
}

module.exports = config;