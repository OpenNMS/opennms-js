var webpack = require('webpack');
var path = require('path');
var TypedocWebpackPlugin = require('typedoc-webpack-plugin');

var createVariants = require('parallel-webpack').createVariants;

var clonedeep = require('lodash.clonedeep');

var isProduction = require('yargs').argv.p;

var libraryName = 'opennms';

var variants = {
  web: [ true, false ],
};

if (isProduction) {
  variants.production = [ true, false ];
}

var config = {
  entry: {
    'opennms': __dirname + '/src/API.ts',
  },
  devtool: 'source-map',
  output: {
    path: __dirname + '/dist',
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
        exclude: [/node_modules/]
      }
    ],
  },
  resolve: {
    modules: [
      path.resolve('./src'),
      path.resolve('./node_modules')
    ],
    extensions: ['.webpack.js', '.web.js', '.ts', '.js']
  },
  plugins: [
/*
    new webpack.DefinePlugin({
      "global.GENTLY": false
    }),
*/
  ],
  node: {
    fs: 'empty',
    __dirname: true,
    child_process: false,
    global: false,
    process: false
  }
};

function createConfig(options) {
  var myconf = clonedeep(config);
  myconf.output.filename = '[name]';
  var defs = {
    'IS_WEB': options.web,
    'IS_PRODUCTION': options.production,
  };

  if (options.web) {
    myconf.target = 'web';
  } else {
    myconf.target = 'node';
    myconf.node = { process: false };
    myconf.output.filename += '.node';
  }

  if (options.production) {
    var tsconfig = require('./tsconfig.json');
    tsconfig.name = 'OpenNMS.js';
    tsconfig.mode = 'file';
    tsconfig.ignoreCompilerErrors = true;
    tsconfig.exclude = "/**/+(node_modules|test)/**/*";
    tsconfig.excludeExternals = false;
    defs['global.GENTLY'] = false;
  
    myconf.plugins.push(new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }));
    myconf.plugins.push(new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      minimize: true
    }));
    myconf.plugins.push(new TypedocWebpackPlugin(tsconfig));
    myconf.output.filename += '.min';
  } else {
    myconf.plugins.push(new webpack.LoaderOptionsPlugin({
      minimize: false,
      debug: true
    }));
  }

  myconf.plugins.push(new webpack.DefinePlugin(defs));
  myconf.output.filename += '.js';

  return myconf;
}

module.exports = createVariants({}, variants, createConfig);
console.log('exports: ' + JSON.stringify(module.exports, undefined, 2));
