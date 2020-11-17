var webpack = require('webpack');
var path = require('path');
var TerserPlugin = require('terser-webpack-plugin');
var pkginfo = require('./package.json');

var createVariants = require('parallel-webpack').createVariants;

var cloneDeep = require('lodash').cloneDeep;

var argv = require('yargs').argv;
var isProduction = argv.env === 'production';

var libraryName = 'opennms';

var variants = {
  target: [ 'web', 'node' ],
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
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /(\.jsx?)$/,
        use: [
          'cache-loader',
          'babel-loader'
        ]
      },
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
    __dirname: true,
    global: true,
  }
};

function createConfig(options) {
  var myconf = cloneDeep(config);
  myconf.output.filename = '[name]';
  var defs = {
    'IS_WEB': options.target === 'web',
    'IS_PRODUCTION': options.production,
    'global.OPENNMS_JS_VERSION': JSON.stringify(pkginfo.version),
  };

  myconf.mode = options.production? 'production':'development';

  if (options.target === 'web') {
    myconf.target = 'web';
  } else {
    myconf.target = 'node';
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

  if (!myconf.optimization) {
    myconf.optimization = {};
  }

  if (!options.production) {
    myconf.module.rules.unshift({
      test: /(\.tsx?)$/,
      use: [
        'cache-loader',
        'babel-loader'
      ],
      exclude: [/node_modules/]
    });
  }

  if (options.production) {
    myconf.optimization.minimize = true;
    if (!myconf.optimization.minimizer) {
      myconf.optimization.minimizer = [];
    } else {
      console.log('minimizer exists:',myconf.optimization.minimizer);
    }
    myconf.optimization.minimizer.push(new TerserPlugin({
      extractComments: false,
      terserOptions: {
        mangle: {
          keep_classnames: true,
          keep_fnames: true,
          reserved: [ '$element', '$super', '$scope', '$uib', '$', 'jQuery', 'exports', 'require', 'angular', 'c3', 'd3' ],
        },
        compress: true,
      }
    }));

    myconf.module.rules.unshift({
      // run tslint on typescript files before rendering
      enforce: 'pre',
      test: /\.tsx?$/,
      use: [
        {
          loader: 'tslint-loader'
        }
      ],
      exclude: [/node_modules/]
    });

    myconf.module.rules.unshift({
      test: /(\.tsx?)$/,
      use: [
        'cache-loader',
        'babel-loader'
      ],
      exclude: [/node_modules/]
    });

    defs['global.GENTLY'] = false;

    myconf.plugins.push(new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }));
    myconf.output.filename += '.min';
  }

  myconf.plugins.push(new webpack.DefinePlugin(defs));
  myconf.plugins.push(new webpack.ProvidePlugin({X2JS: 'x2js'}));
  myconf.output.filename += '.js';

  console.log('Building variant: target=' + options.target + ', production=' + (!!options.production));

  return myconf;
}

module.exports = createVariants({}, variants, createConfig);
