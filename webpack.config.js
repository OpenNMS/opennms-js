var webpack = require('webpack');
var path = require('path');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');

var isProduction = require('yargs').argv.p;

var libraryName = 'opennms';

var plugins = [], outputFile;

if (isProduction) {
  plugins.push(new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false
  }));
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    minimize: true
  }));
  outputFile = libraryName + '.min.js';
} else {
  plugins.push(new webpack.LoaderOptionsPlugin({
    minimize: false,
    debug: true
  }));
  outputFile = libraryName + '.js';
}

var config = {
  entry: __dirname + '/src/index.js',
  devtool: 'source-map',
  output: {
    path: __dirname + '/dist',
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    loaders: [
      {
        test: /(\.jsx?)$/,
        loader: 'babel-loader'
      },
      {
        test: /(\.tsx?)$/,
        loader: ['babel-loader', 'ts-loader'],
        exclude: [/node_modules/, nodeModulesPath]
      },
      {
        test: /(\.jsx?)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    modules: [
      path.resolve('./src'),
      path.resolve('./build'),
      path.resolve('./'),
      nodeModulesPath
    ],
    extensions: ['.webpack.js', '.web.js', '.ts', '.js']
  },
  plugins: plugins,
  node: {
    global: false,
    process: false
  }
};

module.exports = config;
