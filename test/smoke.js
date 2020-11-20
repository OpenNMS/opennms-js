const { spawnSync } = require('child_process');
const { existsSync, unlinkSync } = require('fs');
const { homedir } = require('os');
const { resolve } = require('path');

function doExec(command, ...args) {
  const ret = spawnSync(command, args, {
    encoding: 'utf8',
  });
  console.info(ret.stdout);
  console.error(ret.stderr);
  if (ret.status !== null && ret.status > 0) {
    process.exit(ret.status);
  }
}

const configFile = resolve(homedir(), '.opennms-cli.config.json');
const rmConfig = () => {
  if (existsSync(configFile)) {
    unlinkSync(configFile);
  }
};

console.debug('Smoke tests used Demo, which no longer exists.  Exiting for now.');

console.info('=== running with ts-node ===');
rmConfig();
doExec('npm', 'run', 'cli', '--', '--debug', 'connect', '--username', 'demo', '--password', 'demo', 'https://demo.opennms.org/opennms/');
doExec('npm', 'run', 'cli', '--', '--debug', 'alarms');

console.info('=== running with minified js ===');
rmConfig();
doExec('node', 'dist/cli.node.min.js', '--debug', 'connect', '--username', 'demo', '--password', 'demo', 'https://demo.opennms.org/opennms/');
doExec('node', 'dist/cli.node.min.js', '--debug', 'alarms');
