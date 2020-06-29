const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader');
const CopyPlugin = require('copy-webpack-plugin');
const PACKAGE = require('./package.json');

var FILE_NAME = "game";
var LIBRARY_NAME = PACKAGE.name;

var PATHS = {
  entryPoint: path.resolve(__dirname, 'src/index.ts'),
  dist: path.resolve(__dirname, 'dist/lib')
}

module.exports = {
  devtool: 'inline-source-map',
  mode: "production",
  entry: {
    [FILE_NAME]: [PATHS.entryPoint],
    [FILE_NAME + '.min']: [PATHS.entryPoint]
  },
  output: {
    path: PATHS.dist,
    filename: '[name].js',
    libraryTarget: 'umd',
    library: LIBRARY_NAME,
    umdNamedDefine: true
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: 'awesome-typescript-loader',
      exclude: /node_modules/,
      query: {
        declaration: false,
      }
    }]
  },
  optimization: {
    minimize: true,
    minimizer: [new UglifyJsPlugin({
      include: /\.min\.js$/
    })]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  plugins: [
    new CheckerPlugin(),
    new CopyPlugin({
      patterns: [
        { from: 'node_modules/pixi.js/dist/pixi.min.js', to: PATHS.dist },
      ]
    }),
  ],
  externals: [
    {"pixi.js": "PIXI"},
  ]
};
