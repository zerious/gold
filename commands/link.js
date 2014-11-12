/**
 * Usage:
 *   gold link [<project1>, <project2>, ... <project3>]
 *
 * Description:
 *   Link dependencies to workspace projects where applicable.
 *
 * Options:
 *   -d, --dir         Workspace directory.
 *   -s, --save        Save new version references.
 *   -u, --undo        Replace symlinks with `npm install` results.
 */

var fs = require('fs');
var spawn = require('child_process').spawn;
var options;
var projectNames;
var projectPkgs = {}; // Map projectName names to packages.
var dir;
var groups = ['dependencies', 'devDependencies'];

module.exports = function (input) {
  options = input;
  projectNames = input.$;
  dir = input.dir || process.cwd();
  if (!projectNames.length) {
    try {
      projectNames = fs.readdirSync(dir);
    }
    catch (e) {
      console.log(('\nFailed to find projectNames in directory: "' + dir + '".\n') + e.stack.red);
    }
  }
  projectNames.forEach(discover);
  for (var projectName in projectPkgs) {
    resolve(projectName);
  }
};

function discover(projectName) {
  var path = dir + '/' + projectName + '/package.json';
  var json;
  try {
    json = '' + fs.readFileSync(path);
  }
  catch (e) {
    // If there's no package.json, it's not a projectName.
    return;
  }
  try {
    projectPkgs[projectName] = JSON.parse(json);
  }
  catch (e) {
    console.log(('\nFailed to parse JSON from: "' + path + '".\n') + e.stack.red + '\n' + json.yellow);
    return;
  }
}

function resolve(projectName) {
  var pkg = projectPkgs[projectName];
  var changes = [];
  groups.forEach(function (group) {
    var deps = pkg[group];
    for (var depName in deps) {
      var actual = deps[depName];
      var depPkg = projectPkgs[depName];
      if (depPkg) {
        var expected = '^' + depPkg.version;
        if (actual != expected) {
          changes.push(projectName + ' ' + depName.cyan + ' ('.gray + ('"' + actual + '"').yellow + ' -> '.gray + ('"' + expected + '"').green + ')'.gray);
          deps[depName] = expected;
        }
        if (options.undo) {
          install(projectName, depName);
        }
        else {
          link(projectName, depName);
        }
      }
    }
  });
  if (changes.length) {
    changes.forEach(function (change) {
      console.log('  Update: '.green + change);
    });
    if (options.save) {
      var json = JSON.stringify(pkg, null, '  ') + '\n';
      var path = dir + '/' + projectName + '/package.json';
      try {
        fs.writeFileSync(path, json);
      }
      catch (e) {
        console.log(('\nFailed to write file: "' + path + '".\n') + e.stack.red);
      }
    }
  }
}

function link(projectName, depName) {
  run('rm -rf ' + dir + '/' + projectName + '/node_modules/' + depName, dir, function () {
    run('ln -s ' + dir + '/' + depName + ' ' + dir + '/' + projectName + '/node_modules/' + depName, dir, function () {
      // OK.
    });
  });
}

function install(projectName, depName) {
  run('rm -rf ' + dir + '/' + projectName + '/node_modules/' + depName, dir, function () {
    run('npm install ' + depName + '@latest', dir + '/' + projectName, function () {
      // OK.
    });
  });
}

function run(cmd, cwd, fn) {
  var args = cmd.split(' ');
  var exec = args.shift();
  var child = spawn(exec, args, {cwd: cwd, env: process.env});
  child.on('exit', fn);
}

function shorten(path) {
  var dirs = [[process.cwd(), '.'], [process.env.HOME, '~']];
  for (var i = 0; i < 2; i++) {
    var dir = dirs[i];
    if (dir[0] && (path.indexOf(dir[0] + '/') === 0)) {
      return dir[1] + path.substr(dir[0].length);
    }
  }
}
