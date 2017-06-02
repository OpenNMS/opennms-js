import * as startCase from 'lodash.startcase';

import {API, Rest, Client} from './API';

import {log, catRoot, setLogLevel} from './api/Log';
import {
  Category,
  CategoryServiceFactory,
  CategoryDefaultConfiguration,
  LogLevel,
} from 'typescript-logging';

/** @hidden */
function CLI() {
  const catCLI = new Category('cli', catRoot);

  // tslint:disable
  const cliff = require('cliff');
  const colors = require('colors');
  const fs = require('fs');
  const path = require('path');
  const program = require('commander');
  // tslint:enable

  const homedir = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
  const defaultConfigFile = path.join(homedir, '.opennms-cli.config.json');

  function readConfig() {
    const configfile = program.config || defaultConfigFile;
    let config;
    if (fs.exists) {
      config = JSON.parse(fs.readFileSync(configfile));
    } else {
      config = {
        password: undefined,
        url: undefined,
        username: undefined,
      };
    }
    return config;
  }

  /* tslint:disable:no-console */

  // global options
  program
    .option('-d, --debug', 'Enable debug output', () => {
      setLogLevel(LogLevel.Debug);
    })
    .option('-c, --config <file>', 'Specify a configuration file (default: ~/.opennms-cli.config.json)');

  // connect (validate server and save config)
  program
    .command('connect [url]')
    .description('Connect to an OpenNMS Horizon or Meridian server')
    .option('-u, --username <username>', 'The username to authenticate as (default: admin)')
    .option('-p, --password <password>', 'The password to authenticate with (default: admin)')
    .action((url, options) => {
      const config = readConfig();
      if (url) {
        config.url = url;
      }
      if (options.username) {
        config.username = options.username;
      }
      if (options.password) {
        config.password = options.password;
      }
      const server = new API.OnmsServer('OpenNMS', config.url, new API.OnmsAuthConfig(config.username, config.password));
      const http = new Rest.AxiosHTTP(server);
      return Client.checkServer(server, http).then(() => {
        console.log(colors.green('Connection succeeded.'));
        if (!program.config) { // don't write the config if a config was passed in
          log.debug('Saving configuration to ' + defaultConfigFile, catCLI);
          fs.writeFileSync(defaultConfigFile, JSON.stringify(config, undefined, 2), { mode: 0o600 });
        }
        /*
        if (res.data.type === ServerType.MERIDIAN) {
          console.log(colors.blue('Connected to OpenNMS Meridian ' + res.data.version.displayVersion));
        } else {
          console.log(colors.green('Connected to OpenNMS Horizon ' + res.data.version.displayVersion));
        }
        */
        return true;
      }).catch((err) => {
        if (err.stack) {
          log.error(err.stack, err, catCLI);
        }
        return err;
      });
    });

  // test another option
  program
    .command('capabilities')
    .description('List the API capabilities of the OpenNMS server')
    .action(() => {
      const config = readConfig();
      const server = new API.OnmsServer('OpenNMS', config.url, new API.OnmsAuthConfig(config.username, config.password));
      const http = new Rest.AxiosHTTP(server);
      return Client.getMetadata(server, http).then((res) => {
        let c = colors.green;
        if (res.data.type === API.ServerType.MERIDIAN) {
          console.log(colors.blue('OpenNMS Meridian ' + res.data.version.displayVersion + ' Capabilities:'));
          c = colors.blue;
        } else {
          console.log(colors.green('OpenNMS Horizon ' + res.data.version.displayVersion + ' Capabilities:'));
        }
        console.log('');

        const caps = res.data.capabilities();
        const rows = [];
        for (const cap in caps) {
          if (cap === 'type') {
            continue;
          }
          rows.push([startCase(cap) + ':', caps[cap]]);
        }
        console.log(cliff.stringifyRows(rows));
        console.log('');

        return res;
      }).catch((err) => {
        if (err.stack) {
          log.error(err.stack, err, catCLI);
        }
        return err;
      });
    });

  program.parse(process.argv);

  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
}

CLI();

