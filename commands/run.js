module.exports = function (options) {

  var env = process.env;
  env.LIGHTER_DIR = __dirname.replace(/[\/\\]commands$/, '');
  env.LIGHTER_APP = env.LIGHTER_DIR + '/lib/app';
  env.GOLD_PORT = options.port;
  env.WORKSPACE_DIR = (options.path || process.cwd()).replace(/[]\/\\]$/, '');
  require('../node_modules/lighter/commands/start')('dev');

};
