var fs = require('fs');
var run = require('../common/process/run');
var options;
var projects;
var dir, remote, spec;

module.exports = {

  description: 'Run `git pull` in all project directories',

  extras: '',

  options: [
    '-d, --dir     Workspace directory',
    '-r, --remote  Remote repository name [origin]',
    '-s, --spec    Git destination reference [master]'
  ],

  run: function (input) {
    options = input;
    dir = input.dir || process.cwd();
    projects = input.projects;
    remote = input.remote;
    spec = input.spec;

    if (!projects.length) {
      try {
        projects = fs.readdirSync(dir);
      }
      catch (e) {
        console.log(('\nFailed to find projects in directory: "' + dir + '".\n') + e.stack.red);
      }
    }
    projects.forEach(pull);
  }

};

function pull(projectName) {
  if (fs.existsSync(dir + '/' + projectName + '/.git')) {
    run('git pull ' + remote + ' ' + spec, dir + '/' + projectName)
      .on('error', function (error) {
        console.log(projectName + ': '.gray + 'Failed.'.red);
      })
      .on('ok', function (data) {
        console.log(projectName + ': '.gray + data.trim().replace(/\n/g, '\n  ').green);
      });
  }
}
