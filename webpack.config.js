var webpack = require('webpack');
var path = require('path');
var TypedocWebpackPlugin = require('typedoc-webpack-plugin');

var createVariants = require('parallel-webpack').createVariants;

var clonedeep = require('lodash.clonedeep');

var argv = require('yargs').argv;
var isProduction = argv.env === 'production';
var justDocs = argv.env === 'docs';

var libraryName = 'opennms';

var variants = {
  target: [ 'web', 'node' ],
};

if (isProduction) {
  variants.production = [ true, false ];
}

if (justDocs) {
  variants = {
    target: ['node'],
    docs: [true],
  };
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
  plugins: [],
  node: {
    fs: 'empty',
    __dirname: true,
    child_process: false,
    global: true,
    process: false
  }
};

function createConfig(options) {
  var myconf = clonedeep(config);
  myconf.output.filename = '[name]';
  var defs = {
    'IS_WEB': options.target === 'web',
    'IS_PRODUCTION': options.production,
  };

  if (options.target === 'web') {
    myconf.target = 'web';
  } else {
    myconf.target = 'node';
    myconf.node = { process: false };
  }

  if (options.target === 'node') {
    myconf.output.filename += '.node';
    myconf.entry.cli = __dirname + '/src/CLI.ts';
    myconf.plugins.push(new webpack.BannerPlugin({
      banner: '#!/usr/bin/env node',
      raw: true,
      entryOnly: true,
      include: /cli/i,
    }));
  }

  if (options.production) {
    defs['global.GENTLY'] = false;
  
    myconf.plugins.push(new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }));
    myconf.plugins.push(new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      mangle: true,
      minimize: true,
      compress: true,
    }));
    myconf.output.filename += '.min';
  }

  myconf.plugins.push(new webpack.DefinePlugin(defs));
  myconf.plugins.push(new webpack.ProvidePlugin({X2JS: 'x2js'}));

  // build docs either on a dedicated doc build, or during production node.js build
  var buildDocs = !!(justDocs || (options.production && options.target === 'node'));
  if (buildDocs) {
    // generate documentation
    var tsconfig = require('./tsconfig.json');
    tsconfig.name = 'OpenNMS.js';
    tsconfig.mode = 'file';
    tsconfig.ignoreCompilerErrors = true;
    tsconfig.exclude = "/**/+(node_modules|test)/**/*";
    tsconfig.excludeExternals = false;
    myconf.plugins.push(new TypedocWebpackPlugin(tsconfig));
  }

  myconf.output.filename += '.js';

  console.log('Building variant: target=' + options.target + ', production=' + (!!options.production) + ', docs=' + buildDocs);

  return myconf;
}

module.exports = createVariants({}, variants, createConfig);
