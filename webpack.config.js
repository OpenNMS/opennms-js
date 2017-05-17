var webpack = require('webpack');
var path = require('path');
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
  /*
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    minimize: false
  }));
  */
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
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader'
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    modules: [
      path.resolve('./src'),
      path.resolve('./'),
      path.resolve('./node_modules')
    ],
    extensions: ['.webpack.js', '.web.js', '.js']
  },
  plugins: plugins,
  node: {
    global: false,
    process: false
  }
};

module.exports = config;
