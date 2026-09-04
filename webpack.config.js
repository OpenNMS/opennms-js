const webpack = require('webpack');
const path = require('path');
const LodashPlugin = require('lodash-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const pkginfo = require('./package.json');

const cloneDeep = require('lodash').cloneDeep;

const variants = {
  target: [ 'web', 'node' ],
};

/**
 * Build the cross product of the given variant axes and map each combination through
 * `configCallback`. This replaces `parallel-webpack`'s `createVariants`, which was the only
 * thing this build used that package for -- the builds themselves run through plain webpack.
 *
 * @param {Object} axes - variant name to array of values, e.g. `{ target: ['web', 'node'] }`
 * @param {Function} configCallback - maps one combination to a webpack configuration
 */
function createVariants(axes, configCallback) {
  const combinations = Object.keys(axes).reduce((acc, key) => {
    return acc.flatMap((combination) => axes[key].map((value) => ({ ...combination, [key]: value })));
  }, [{}]);
  return combinations.map(configCallback);
}

const config = {
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
        test: /(\.tsx?)$/,
        use: [
          'babel-loader'
        ],
        exclude: [/node_modules/]
      },
      {
        test: /(\.jsx?)$/,
        use: [
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

function createConfig(options, argv) {
  const myconf = cloneDeep(config);
  myconf.output.filename = '[name]';
  const defs = {
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

  // Webpack 5's built-in persistent cache, replacing cache-loader. The name has to pin down
  // every input that changes the output, or two different compilations share one entry:
  //
  //   - target and the production flag, which drive different optimization, plugins and
  //     DefinePlugin values;
  //   - the mode that actually takes effect, which is argv.mode. webpack-cli's --mode
  //     overrides whatever `mode` this config sets, so during `npm run build` even the
  //     non-minified variants compile in production mode while myconf.mode still reads
  //     'development'. Keying on myconf.mode put those production-compiled modules into the
  //     web-development/node-development entries `npm run dev` reads back, and dev then
  //     failed with "No template for dependency: PureExpressionDependency".
  //
  // These bundles are large and there are four of them; uncompressed the cache runs to
  // ~500MB. Gzip trades a little CPU to keep it to a fraction of that.
  myconf.cache = {
    type: 'filesystem',
    name: options.target + '-' + (argv.mode || myconf.mode) + '-' + (options.production ? 'min' : 'full'),
    compression: 'gzip',
    buildDependencies: {
      // package.json is a build input, not just a dependency manifest: the version string
      // below is compiled into the bundle by DefinePlugin.
      config: [__filename, path.resolve(__dirname, 'package.json')],
    },
  };

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

    defs['global.GENTLY'] = false;

    myconf.plugins.push(new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }));
    myconf.plugins.push(new LodashPlugin);
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
  const config = createVariants(variants, (options) => createConfig(options, argv));
  // console.debug('webpack config: ' + JSON.stringify(config, undefined, 2));
  return config;
};
