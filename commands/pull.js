/**
 * Usage:
 *   gold pull [<project1>, <project2>, ... <project3>]
 *
 * Description:
 *   Run `git pull` in all project directories.
 *
 * Options:
 *   -d, --dir         Workspace directory.
 *   -r, --remote      Remote repository name. (default "origin")
 *   -s, --spec        Git destination reference. (default "master")
 */

var fs = require('fs');
var run = require('../common/process/run');
var options;
var projectNames;
var dir, remote, spec;

module.exports = function (input) {
  options = input;
  dir = input.dir || process.cwd();
  projectNames = input.$;
  remote = input.remote || 'origin';
  spec = input.spec || 'master';

  if (!projectNames.length) {
    try {
      projectNames = fs.readdirSync(dir);
    }
    catch (e) {
      console.log(('\nFailed to find projects in directory: "' + dir + '".\n') + e.stack.red);
    }
  }
  projectNames.forEach(pull);
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
