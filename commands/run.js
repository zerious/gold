/**
 * Usage:
 *   gold run <options>
 *
 * Description:
 *   Run the Gold IDE Web Server.
 *
 * Options:
 *   -d, --dir         Workspace directory.
 *   -e, --env         IDE Server environment ("debug", "dev", "test", "stage" or "prod").
 *   -p, --port        IDE Server HTTP port.
 */

module.exports = function (options) {
  var env = process.env;
  env.LIGHTER_DIR = __dirname.replace(/[\/\\]commands$/, '');
  env.LIGHTER_APP = env.LIGHTER_DIR + '/app';
  env.GOLD_PORT = options.port;
  env.WORKSPACE_DIR = (options.dir || process.cwd()).replace(/[]\/\\]$/, '');
  require('../node_modules/lighter/commands/start')(options.env || 'prod');
};
