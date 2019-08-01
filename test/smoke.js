const { spawnSync } = require('child_process');

function doExec(command, ...args) {
  const ret = spawnSync(command, args, {
    encoding: 'utf8',
  });
  if (ret.status !== null && ret.status > 0) {
    console.info(ret.stdout);
    console.error(ret.stderr);
    process.exit(ret.status);
  }
}

console.log('=== running with ts-node ===');
doExec('yarn', 'cli', '--debug', 'connect', '--username', 'demo', '--password', 'demo', 'https://demo.opennms.org/opennms/');
doExec('yarn', 'cli', '--debug', 'alarms');

console.log('=== running with minified js ===');
doExec('node', 'dist/cli.node.min.js', '--debug', 'connect', '--username', 'demo', '--password', 'demo', 'https://demo.opennms.org/opennms/');
doExec('node', 'dist/cli.node.min.js', '--debug', 'alarms');