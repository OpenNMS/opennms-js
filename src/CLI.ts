import {API, Rest, DAO, Client} from './API';

import {log} from './api/Log';

import chalk from 'chalk';
import {cloneDeep, startCase} from 'lodash';
import {table, getBorderCharacters} from 'table';
import { OrderBy, Order, Orders } from './api/OrderBy';

/** @hidden */
const CLI = () => {
  const version = global.OPENNMS_JS_VERSION || require('../package.json').version || 'unknown';

  // tslint:disable
  const fs = require('fs');
  const htmlToFormattedText = require("html-to-formatted-text");
  const path = require('path');
  const program = require('commander');
  // tslint:enable

  const homedir = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
  const defaultConfigFile = path.join(homedir, '.opennms-cli.config.json');

  const tableConfig = {
    border: getBorderCharacters(`void`),
    columnDefault: {
      paddingLeft: 0,
      paddingRight: 2,
    },
    drawHorizontalLine: () => {
      return false;
    },
  };

  const readConfig = () => {
    const configfile = program.config || defaultConfigFile;
    let config;
    if (fs.existsSync(configfile)) {
      config = JSON.parse(fs.readFileSync(configfile));
    } else {
      config = {
        password: 'admin',
        url: undefined,
        username: 'admin',
      };
    }
    return config;
  };

  const handleError = (message: string, err: any) => {
    let realError: any = new Error(message);
    if (err instanceof API.OnmsResult) {
      realError = new API.OnmsError(message + ': ' + err.message, err.code);
    } else if (err.message) {
      realError = new API.OnmsError(message + ': ' + err.message);
    } else if (Object.prototype.toString.call(err) === '[object String]') {
      realError = new API.OnmsError(message + ': ' + err);
    }
    if (program.debug) {
      log.error(realError.message, realError);
    } else {
      log.error(realError.message);
    }
    process.exit(1);
  };

  /* tslint:disable:no-console */

  // global options
  program
    .version(version)
    .option('-d, --debug', 'Enable debug output', () => {
      log.setDebug();
    })
    .option('-c, --config <file>', 'Specify a configuration file (default: ~/.opennms-cli.config.json)')
    ;

  // connect (validate server and save config)
  program
    .command('connect [url]')
    .description('Connect to an OpenNMS Horizon or Meridian server')
    .option('-u, --username <username>', 'The username to authenticate as (default: admin)')
    .option('-p, --password <password>', 'The password to authenticate with (default: admin)')
    .action((url: string, options: any) => {
      log.warn(chalk.red('WARNING: This command saves your login'
        + ' information to ~/.opennms-cli.config.json in clear text.'));
      const config = readConfig();
      if (url) {
        // the user is passing a URL, reset the config
        config.url = url;
        config.username = 'admin';
        config.password = 'admin';
      }

      if (options.username) {
        config.username = options.username;
      }
      if (options.password) {
        config.password = options.password;
      }
      const auth = new API.OnmsAuthConfig(config.username, config.password);
      const server = API.OnmsServer.newBuilder(config.url).setName('OpenNMS').setAuth(auth).build();
      const http = new Rest.AxiosHTTP(server);
      return Client.checkServer(server, http).then(() => {
        log.info(chalk.green('Connection succeeded.'));
        if (!program.config) { // don't write the config if a config was passed in
          log.debug('Saving configuration to ' + defaultConfigFile);
          fs.writeFileSync(defaultConfigFile, JSON.stringify(config, undefined, 2), { mode: 0o600 });
        }
        return true;
      }).catch((err) => {
        return handleError('Server check failed', err);
      });
    });

  // list server capabilities
  program
    .command('capabilities')
    .description('List the API capabilities of the OpenNMS server')
    .action(() => {
      const config = readConfig();
      const auth = new API.OnmsAuthConfig(config.username, config.password);
      const server = API.OnmsServer.newBuilder(config.url).setName('OpenNMS').setAuth(auth).build();
      const http = new Rest.AxiosHTTP();
      return Client.getMetadata(server, http).then((res) => {
        let c = chalk.green;
        if (res.type === API.ServerTypes.MERIDIAN) {
          log.log(chalk.blue('OpenNMS Meridian ' + res.version.displayVersion + ' Capabilities:'));
          c = chalk.blue;
        } else {
          log.log(chalk.green('OpenNMS Horizon ' + res.version.displayVersion + ' Capabilities:'));
        }
        log.log('');

        const data = [];
        const caps = res.capabilities();
        for (const cap in caps) {
          if (cap === 'type') {
            continue;
          }
          data.push([chalk.bold(startCase(cap) + ':'), caps[cap]]);
        }
        log.log(table(data, tableConfig));
        log.log('');

        return res;
      }).catch((err) => {
        return handleError('Capabilities check failed', err);
      });
    });

  const alarmHeaders = ['ID', 'Severity', 'Node', 'Count', 'Last', 'Log'];

  const colorify = (severity: string) => {
    switch (severity) {
      case 'INDETERMINATE': return chalk.grey(severity);
      case 'CLEARED': return chalk.white(severity);
      case 'NORMAL': return chalk.green(severity);
      case 'WARNING': return chalk.magenta(severity);
      case 'MINOR': return chalk.yellow(severity);
      case 'MAJOR': return chalk.bold.yellow(severity);
      case 'CRITICAL': return chalk.bold.red(severity);
      default: return severity;
    }
  };

  const getMaxWidth = (data: any[], prop: string, max: number) => {
    const filtered = data.map((d) => ('' + d[prop]).length);
    const m = Math.max(...filtered);
    return Math.min(m, max);
  };

  const formatAlarms = (alarms: any[]) => {
    return alarms.map((alarm) => {
      const severityLabel = ((alarm.severity && alarm.severity.label) ? alarm.severity.label : '');

      let logMessage = '';
      if (alarm.logMessage) {
        logMessage = alarm.logMessage
          .replace(new RegExp('[\r\n]+', 'gs'), ' ')
          .replace(new RegExp('\\s+', 'gs'), ' ')
          .trim();
        logMessage = htmlToFormattedText(logMessage);
      }

      return {
        count: alarm.count,
        id: alarm.id,
        log: logMessage,
        node: alarm.nodeLabel || '',
        severity: colorify(severityLabel),
        time: (alarm.lastEventTime ? alarm.lastEventTime.format('YYYY-MM-DD HH:ss') : ''),
      };
    });
  };

  // list current alarms
  program
    .command('alarms [filters...]')
    // tslint:disable-next-line:max-line-length
    .description('List current alarms with optional filters (eg: "severity eq MAJOR", "node.label like dns*", "orderBy=lastEventTime")')
    .action((filters: string[]) => {
      const config = readConfig();
      return new Client().connect('OpenNMS', config.url, config.username, config.password).then((client) => {
        const dao = new DAO.AlarmDAO(client);

        const filter = new API.Filter();
        let order: Order | undefined;

        for (const f of filters) {
          log.debug('filter=' + f);

          if (f.toLowerCase().startsWith('orderby')) {
            const orderBy = OrderBy.fromString(f);
            if (orderBy) {
              filter.withOrderBy(orderBy);
            }
          } else if (f.startsWith('order')) {
            if (!order) {
              order = Order.fromString(f);
            } else {
              log.warn('Only the first order= filter option will be used.');
            }
          } else {
            const parsed = API.Restriction.fromString(f);
            if (parsed) {
              filter.withOrRestriction(parsed);
            } else {
              log.warn('Unable to parse filter "' + f + '"');
            }
          }
        }

        // make sure all OrderBy options have the same order, defaulting to DESC
        filter.orderBy = filter.orderBy.map((o) => new OrderBy(o.attribute, order || Orders.DESC));

        return dao.find(filter).then((alarms) => {
          if (!alarms || alarms.length === 0) {
            log.log('No alarms found.');
            log.log('');
            return;
          }

          const formatted = formatAlarms(alarms);

          const alarmTableConfig = cloneDeep(tableConfig) as any;
          alarmTableConfig.columns = {};

          const data = [
            [ 'ID', 'Severity', 'Node', 'Count', 'Time', 'Log' ].map((header) => chalk.bold(header)),
          ];

          const colWidths = [
            /* id */
            getMaxWidth(formatted, 'id', 10),
            /* severity */
            8,
            /* node */
            getMaxWidth(formatted, 'node', 30),
            /* count */
            5,
            /* time */
            16,
          ];
          const existingWidths = colWidths.reduce((acc, val) => acc + val);
          const spacers = (colWidths.length + 1) * 2;
          const remainder = (process.stdout.columns || 80) - existingWidths - spacers;

          /* log */
          if (remainder < 0) {
            colWidths.push(20);
          } else {
            colWidths.push(remainder);
          }

          colWidths.forEach((width, index) => {
            alarmTableConfig.columns[index] = {
              width,
            };
          });

          alarmTableConfig.columns[5].wrapWord = true;
          for (const alarm of formatted) {
            data.push([alarm.id, alarm.severity, alarm.node, alarm.count, alarm.time, alarm.log]);
          }
          log.log(table(data, alarmTableConfig));
          log.log('');
        });
      }).catch((err) => {
        return handleError('Alarm list failed', err);
      });
    });

  const createAlarmAction = (name: string, description: string, ...aliases: string[]) => {
    const p = program.command(name + ' <id>');
    for (const alias of aliases) {
      p.alias(alias);
    }
    p.description(description);
    p.action((passedId: string) => {
      const id = parseInt(passedId, 10);
      const config = readConfig();
      return new Client().connect('OpenNMS', config.url, config.username, config.password).then((client) => {
        const dao = client.alarms();
        return (dao as any)[name](id).then(() => {
          log.log(chalk.green('Success!'));
          return true;
        });
      }).catch((err) => {
        return handleError(name + ' failed', err);
      });
    });
  };

  // ack an alarm
  program
    .command('acknowledge <id>')
    .alias('ack')
    .description('Acknowledge an alarm')
    .option('-u, --user <user>', 'Which user to acknowledge as (only administrators can do this)')
    .action((passedId: string, options: any) => {
      const id = parseInt(passedId, 10);
      const config = readConfig();
      return new Client().connect('OpenNMS', config.url, config.username, config.password).then((client) => {
        return client.alarms().acknowledge(id, options.user).then(() => {
          log.log(chalk.green('Success!'));
          return true;
        });
      }).catch((err) => {
        return handleError('Acknowledge failed', err);
      });
    });

  // save a sticky memo
  program
      .command('saveSticky <id>')
      .alias('sticky')
      .description('Create or update the sticky memo associated with the alarm')
      .option('-u, --user <user>', 'Which user to update the memo as (only administrators can do this)')
      .option('-b, --body <body>', 'Memo body')
      .action((passedId: string, options: any) => {
          const id = parseInt(passedId, 10);
          const config = readConfig();
          return new Client().connect('OpenNMS', config.url, config.username, config.password).then((client) => {
              return client.alarms().saveStickyMemo(id, options.body, options.user).then(() => {
                  log.log(chalk.green('Success!'));
                  return true;
              });
          }).catch((err) => {
              return handleError('Save failed', err);
          });
      });

  // save a journal memo
  program
      .command('saveJournal <id>')
      .alias('journal')
      .description('Create or update the journal memo associated with the alarm')
      .option('-u, --user <user>', 'Which user to update the memo as (only administrators can do this)')
      .option('-b, --body <body>', 'Memo body')
      .action((passedId: string, options: any) => {
          const id = parseInt(passedId, 10);
          const config = readConfig();
          return new Client().connect('OpenNMS', config.url, config.username, config.password).then((client) => {
              return client.alarms().saveJournalMemo(id, options.body, options.user).then(() => {
                  log.log(chalk.green('Success!'));
                  return true;
              });
          }).catch((err) => {
              return handleError('Save failed', err);
          });
      });

  createAlarmAction('unacknowledge', 'Unacknowledge an alarm', 'unack');
  createAlarmAction('escalate', 'Escalate an alarm');
  createAlarmAction('clear', 'Clear an alarm');

  createAlarmAction('createTicket', 'Create a trouble ticket for an alarm', 'create');
  createAlarmAction('triggerTicketUpdate', 'Trigger a trouble ticket update for an alarm', 'update');
  createAlarmAction('closeTicket', 'Close a trouble ticket for an alarm', 'close');

  createAlarmAction('deleteStickyMemo', 'Delete the sticky memo for an alarm', 'deleteSticky');
  createAlarmAction('deleteJournalMemo', 'Delete the journal memo for an alarm', 'deleteJournal');

  program.parse(process.argv);

  if (!process.argv.slice(2).length) {
    program.outputHelp();
    process.exit(0);
  }
};

process.on('unhandledRejection', (reason, p) => {
  log.warn('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

CLI();
