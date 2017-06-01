import {Client} from './Client';

import {OnmsAuthConfig} from './api/OnmsAuthConfig';
import {OnmsServer} from './model/OnmsServer';

import {AxiosHTTP} from './rest/AxiosHTTP';
import {SuperAgentHTTP} from './rest/SuperAgentHTTP';

import {factory} from './api/Log';

let program = require('commander');

const log = factory.getLogger('CLI');

let cli = (url) => {
  let server = new OnmsServer('OpenNMS', url, new OnmsAuthConfig(program.username, program.password));
  let http = new AxiosHTTP(server);
  Client.checkServer(server, http).then((res) => {
    log.info(res.data);
    return res;
  }).catch((err) => {
  	return err;
    if (err.stack) {
      log.error(err.stack);
    }
  });
};

program
  .arguments('<url>')
  .option('-u, --username <username>', 'The user to authenticate as')
  .option('-p, --password <password>', 'The password to authenticate with')
  .action(cli)
  .parse(process.argv);
