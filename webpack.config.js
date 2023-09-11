const webpack = require('webpack');
const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const LodashPlugin = require('lodash-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const pkginfo = require('./package.json');

var createVariants = require('parallel-webpack').createVariants;

var cloneDeep = require('lodash').cloneDeep;

var libraryName = 'opennms';

var variants = {
  target: [ 'web', 'node' ],
};

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
      path.resolve(__dirname, 'src'),
      'node_modules',
    ],
    extensions: ['.ts', '.js']
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

  myconf.optimization.chunkIds = 'named';
  myconf.optimization.minimize = false;
  myconf.optimization.moduleIds = 'named';
  myconf.optimization.removeAvailableModules = false;

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
    myconf.optimization.chunkIds = 'deterministic';
    myconf.optimization.concatenateModules = true;
    myconf.optimization.flagIncludedChunks = true;
    myconf.optimization.mangleExports = 'deterministic';
    myconf.optimization.moduleIds = 'deterministic';
    myconf.optimization.removeAvailableModules = true;

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
    myconf.plugins.push(new LodashPlugin);
    myconf.plugins.push(new ESLintPlugin());
    myconf.output.filename += '.min';
  }

  myconf.plugins.push(new webpack.DefinePlugin(defs));
  myconf.plugins.push(new webpack.ProvidePlugin({X2JS: 'x2js'}));

  myconf.output.filename += '.js';

  console.log('webpack config variant: target=' + options.target + ', production=' + (!!options.production));

  return myconf;
}

module.exports = (env, argv) => {
  if (argv.mode === 'production') {
    variants.production = [ true, false ];
  }
  const config = createVariants({}, variants, createConfig);
  // console.debug('webpack config: ' + JSON.stringify(config, undefined, 2));
  return config;
};
