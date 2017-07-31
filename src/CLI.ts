import * as startCase from 'lodash.startcase';

import {API, Model, Rest, DAO, Client} from './API';

import {log, catRoot, setLogLevel} from './api/Log';
import {
  Category,
  CategoryServiceFactory,
  CategoryDefaultConfiguration,
  LogLevel,
} from 'typescript-logging';

/** @hidden */
const CLI = () => {
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

  const handleError = (message, err) => {
    let realError: any = new Error(message);
    if (err instanceof API.OnmsResult) {
      realError = new API.OnmsError(message + ': ' + err.message, err.code);
    } else if (err.message) {
      realError = new API.OnmsError(message + ': ' + err.message);
    } else if (Object.prototype.toString.call(err) === '[object String]') {
      realError = new API.OnmsError(message + ': ' + err);
    }
    if (program.debug) {
      log.error(realError.message, realError, catCLI);
    } else {
      log.error(realError.message, undefined, catCLI);
    }
    return realError;
  };

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
      const server = new API.OnmsServer('OpenNMS', config.url, auth);
      const http = new Rest.AxiosHTTP(server);
      return Client.checkServer(server, http).then(() => {
        console.log(colors.green('Connection succeeded.'));
        if (!program.config) { // don't write the config if a config was passed in
          log.debug('Saving configuration to ' + defaultConfigFile, catCLI);
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
      const server = new API.OnmsServer('OpenNMS', config.url, auth);
      const http = new Rest.AxiosHTTP(server);
      return Client.getMetadata(server, http).then((res) => {
        let c = colors.green;
        if (res.type === API.ServerTypes.MERIDIAN) {
          console.log(colors.blue('OpenNMS Meridian ' + res.version.displayVersion + ' Capabilities:'));
          c = colors.blue;
        } else {
          console.log(colors.green('OpenNMS Horizon ' + res.version.displayVersion + ' Capabilities:'));
        }
        console.log('');

        const caps = res.capabilities();
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
        return handleError('Capabilities check failed', err);
      });
    });

  const alarmHeaders = ['ID', 'Severity', 'Node', 'Count', 'Last', 'Log'];

  const colorify = (severity: string) => {
    switch (severity) {
      case 'INDETERMINATE': return colors.grey(severity);
      case 'CLEARED': return colors.white(severity);
      case 'NORMAL': return colors.green(severity);
      case 'WARNING': return colors.magenta(severity);
      case 'MINOR': return colors.yellow(severity);
      case 'MAJOR': return colors.bold.yellow(severity);
      case 'CRITICAL': return colors.bold.red(severity);
      default: return severity;
    }
  };

  const logMessageLength = 50;
  const formatAlarms = (alarms) => {
    return alarms.map((alarm) => {
      const severityLabel = ((alarm.severity && alarm.severity.label) ? alarm.severity.label : '');

      let logMessage = '';
      if (alarm.logMessage) {
        logMessage = alarm.logMessage.trim();
        if (logMessage.length > logMessageLength) {
          logMessage = logMessage.slice(0, logMessageLength) + '…';
        }
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
    .description('List current alarms')
    .action((filters) => {
      const config = readConfig();
      return new Client().connect('OpenNMS', config.url, config.username, config.password).then((client) => {
        const dao = new DAO.AlarmDAO(client);

        const namePattern = /^(.*?)\s+(eq|ne|ilike|like|gt|lt|ge|le|null|notnull)\s+(.*?)$/i;
        const symbolPattern = /^(.*?)\s*(=|==|!=|>|<|>=|<=)\s*(.*?)$/i;
        const filter = new API.Filter();

        for (const f of filters) {
          let match = f.match(namePattern);
          let attribute;
          let comparator;
          let value;
          if (match) {
            attribute = match[1];
            comparator = match[2];
            value = match[3];
          } else {
            match = f.match(symbolPattern);
            if (match) {
              attribute = match[1];
              comparator = match[2];
              value = match[3];
            } else {
              log.warn('Unable to parse filter "' + f + '"', catCLI);
            }
          }

          if (attribute && comparator) {
            for (const type in API.Comparators) {
              if (API.Comparators.hasOwnProperty(type)) {
                const comp = API.Comparators[type];
                if (comp.matches(comparator)) {
                  filter.withOrRestriction(new API.Restriction(attribute, comp, value));
                }
              }
            }
          }
        }

        return dao.find(filter).then((alarms) => {
          const headers = ['id', 'severity', 'node', 'count', 'time', 'log'];
          console.log(cliff.stringifyObjectRows(formatAlarms(alarms), headers, ['red']));
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
    p.action((id) => {
      id = parseInt(id, 10);
      const config = readConfig();
      return new Client().connect('OpenNMS', config.url, config.username, config.password).then((client) => {
        return client.alarms()[name](id).then(() => {
          console.log('Success!');
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
    .action((id, options) => {
      id = parseInt(id, 10);
      const config = readConfig();
      return new Client().connect('OpenNMS', config.url, config.username, config.password).then((client) => {
        return client.alarms().acknowledge(id, options.user).then(() => {
          console.log('Success!');
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
      .action((id, options) => {
          id = parseInt(id, 10);
          const config = readConfig();
          return new Client().connect('OpenNMS', config.url, config.username, config.password).then((client) => {
              return client.alarms().saveStickyMemo(id, options.body, options.user).then(() => {
                  console.log('Success!');
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
      .action((id, options) => {
          id = parseInt(id, 10);
          const config = readConfig();
          return new Client().connect('OpenNMS', config.url, config.username, config.password).then((client) => {
              return client.alarms().saveJournalMemo(id, options.body, options.user).then(() => {
                  console.log('Success!');
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
  }
};

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

CLI();
