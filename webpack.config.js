var webpack = require('webpack');
var path = require('path');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var TypedocWebpackPlugin = require('typedoc-webpack-plugin');

var isProduction = require('yargs').argv.p;

var libraryName = 'opennms';

var config = {
  entry: __dirname + '/src/Client.ts',
  devtool: 'source-map',
  output: {
    path: __dirname + '/dist',
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        use: [
          {
            loader: 'tslint-loader',
            options: {
              typeCheck: true
            }
          }
        ],
        exclude: [/node_modules/],
      },
      {
        test: /(\.jsx?)$/,
        use: [ 'babel-loader' ]
      },
      {
        test: /(\.tsx?)$/,
        use: [
          'babel-loader',
          'ts-loader'
        ],
        exclude: [/node_modules/, nodeModulesPath]
      }
    ],
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
  plugins: [],
  node: {
    global: false,
    process: false
  }
};

if (isProduction) {
  var tsconfig = require('./tsconfig.json');
  tsconfig.mode = 'modules';
  tsconfig.ignoreCompilerErrors = true;

  config.plugins.push(new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false
  }));
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    minimize: true
  }));
  config.plugins.push(new TypedocWebpackPlugin(tsconfig));
  config.output.filename = libraryName + '.min.js';
} else {
  config.plugins.push(new webpack.LoaderOptionsPlugin({
    minimize: false,
    debug: true
  }));
  config.output.filename = libraryName + '.js';
}

module.exports = config;
