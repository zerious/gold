module.exports = {

  description: 'Run the Gold IDE Web Server',

  options: [
    '-d, --dir   Workspace directory',
    '-e, --env   IDE Server environment ("debug", "dev", "test", "stage" or "prod") [prod]',
    '-p, --port  IDE Server HTTP port [11235]'
  ],

  run: function (options) {
    var env = process.env;
    var dir = options.dir || process.cwd();
    env.LIGHTER_DIR = __dirname.replace(/[\/\\]commands$/, '');
    env.LIGHTER_APP = env.LIGHTER_DIR + '/app';
    env.GOLD_PORT = options.port;
    env.WORKSPACE_DIR = dir.replace(/[]\/\\]$/, '');
    require('../node_modules/lighter/commands/_spawn')(options.env);
  }

};
