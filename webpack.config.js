const path = require('path');
const webpack = require('webpack');

const env = process.env.NODE_ENV;

// production config
const config = {
  mode: 'production',
  target: 'node',
  entry: {
    app: './src/bootstrap/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/',
    globalObject: 'self',
  },
  module: {
    rules: [
      {
        test: /(\.ts[x]?$)|(\.js[x]?$)/,
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
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: 'production',
    }),
  ],
}

module.exports = config;