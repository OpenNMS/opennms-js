import {Client} from './Client';

import {OnmsAuthConfig} from './api/OnmsAuthConfig';
import {OnmsServer} from './model/OnmsServer';

import {AxiosHTTP} from './rest/AxiosHTTP';
import {SuperAgentHTTP} from './rest/SuperAgentHTTP';

import {factory} from './api/Log';

// tslint:disable-next-line
let program = require('commander');

const log = factory.getLogger('CLI');

const cli = (url) => {
  const server = new OnmsServer('OpenNMS', url, new OnmsAuthConfig(program.username, program.password));
  const http = new AxiosHTTP(server);
  Client.checkServer(server, http).then((res) => {
    log.info(res.data);
    return res;
  }).catch((err) => {
    if (err.stack) {
      log.error(err.stack);
    }
    return err;
  });
};

program
  .arguments('<url>')
  .option('-u, --username <username>', 'The user to authenticate as')
  .option('-p, --password <password>', 'The password to authenticate with')
  .action(cli)
  .parse(process.argv);
