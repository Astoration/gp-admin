const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const PRODUCTION = process.env.NODE_ENV === 'production';

module.exports = (env) => ({
  mode: PRODUCTION ? 'production' : 'development',
  context: __dirname,
  entry: ['./src/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: '',
      meta: { 'Content-Security-Policy': { 'http-equiv': 'X-UA-Compatible', content: 'IE=Edge' } },
    }),
    new ExtractTextPlugin({
      filename: 'bundle.css',
    }),
  ].concat(PRODUCTION ? [new webpack.EnvironmentPlugin(['NODE_ENV']), new webpack.optimize.UglifyJsPlugin({ comments: false })] : []),
  devServer: {
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['react']
            }
          }
        ],
      },
      {
        test: /\.xml/i,
        use: ['xml-loader'],
      },
      {
        test: /\.css$/i,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader',
        }),
      },
      {
        test: /\.s(c|a)ss$/i,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader'],
        }),
      },
      {
        test: /\.(png|jpe?g|gif|tiff)?$/,
        use: ['file-loader'],
      },
    ],
  },
});
