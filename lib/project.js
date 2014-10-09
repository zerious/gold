var fs = require('fs');
var io = require('./io');
var plans = require('plans');
var depKeys = ['dependencies', 'devDependencies'];

var Project = module.exports = function (workspace, name, dir) {
  var self = this;
  self.name = name;
  self.workspace = workspace;
  self.dir = dir;
  self.pkgJson = '';
  self.pkg = {};
  self.git = {};
  self.npm = {};
  self.diff = {};
  self.issues = null;
  self.pulls = null;
  self.results = {};
  self.load();
};

Project.prototype.load = function () {
  var self = this;
  var dir = self.dir;
  var path = dir + '/package.json';
  try {
    fs.unlinkSync(path + 2);
  }
  catch (e) {}
  io.readJson(path, function (pkg) {
    if (!pkg) {
      log.error('[Gold] Failed to read: "' + path + '"');
      return;
    }
    self.pkgJson = JSON.stringify(pkg, null, '  ');
    pkg.repository = (pkg.repository.url || pkg.repository).replace(/^(http|git):/, 'https:');
    pkg.bugs = (pkg.bugs.url || pkg.bugs).replace(/^http:/, 'https:');
    if (typeof pkg.license != 'string') {
      pkg.license = 'MIT';
    }
    if (JSON.stringify(pkg.author) == '{"name":"Sam Eubank","email":"sameubank@gmail.com"}') {
      pkg.author = "Sam Eubank <sameubank@gmail.com>";
    }
    if (pkg.contributors) {
      if (!(pkg.contributors instanceof Array)) {
        pkg.contributors = [pkg.author];
      }
      pkg.contributors.forEach(function (c, i) {
        if (typeof c != 'string') {
          pkg.contributors[i] = c.name + ' <' + c.email + '>';
        }
      });
    }
    if (pkg.scripts) {
      delete pkg.scripts.retest;
    }
    delete pkg.licenses;
    pkg.engines = {node: '>=0.2.6'};
    pkg.dependencies = pkg.dependencies || {};
    pkg.devDependencies = pkg.devDependencies || {};

    var keys = ['name', 'version', 'description', 'dependencies', 'devDependencies', 'keywords', 'main', 'bin', 'engines', 'scripts', 'repository', 'bugs', 'homepage', 'author', 'contributors', 'license', 'dependencies', 'devDependencies'];
    keys.forEach(function (key) {
      self.pkg[key] = pkg[key];
    });
    for (var key in pkg) {
      if (!self.pkg[key]) {
        log.error('[Gold] Unrecognized key in ' + pkg.name + ' ' + key);
        self.pkg[key] = pkg[key];
      }
    }

    depKeys.forEach(function (key) {
      var deps = self.pkg[key];
      if (deps) {
        self[key] = 0;
        for (var dep in deps) {
          self[key]++;
        }
      }
    });

    self.emit('ready');
    self.remotify();
    self.npmify();
    self.gitify();
    self.testify();

    setTimeout(function () {
      self.updateDeps();
    }, 1e4);

  }, plans.ignore);
};

Project.prototype.updateDeps = function () {
  var self = this;
  self.workspace.projects.forEach(function (other) {
    var otherPkg = other.pkg || {};
    var otherName = otherPkg.name;
    var otherNpm = otherPkg.npm || {};
    var otherVersion = otherNpm.version || otherPkg.version;
    if (otherVersion) {
      var newSemver = '^' + otherVersion;
      depKeys.forEach(function (key) {
        var deps = self.pkg[key];
        var semver = deps[otherName];
        if (semver && (semver != newSemver)) {
          log(self.pkg.name + ' ' + otherName + ': ' + semver + ' => ' + newSemver);
          deps[otherName] = newSemver;
        }
      });
    }
  });
  self.write();
};

Project.prototype.write = function () {
  var self = this;
  var path = self.dir + '/package.json';
  var pkg = self.pkg;
  var json = JSON.stringify(self.pkg, null, '  ');
  if (json != self.pkgJson) {
    io.write(path, json + '\n');
  }
};

Project.prototype.remotify = function () {
  var self = this;
  var dir = self.dir;
  var pkg = self.pkg;
  var git = self.git;
  if (git.remotes) {
    getRemotes();
  }
  else {
    git.remotes = {};
    io.run(dir, 'git remote add main ' + pkg.repository + '|echo', getRemotes, plans.ignore);
  }
  function getRemotes() {
    io.run(dir,  'git remote -v', function (out) {
      if (out) {
        out.replace(/(\S+)\s+(\S+)\s+\(fetch\)/g, function (match, name, url) {
          git.remotes[name] = url;
        });
      }
      else {
        git.remotes.origin = pkg.repository;
      }
    });
  }
};

Project.prototype.npmify = function () {
  var self = this;
  var dir = self.dir;
  var pkg = self.pkg;
  var npm = self.npm;
  io.get('https://www.npmjs.org/package/' + pkg.name, function (data) {
    var hasHomepage = (data.indexOf(pkg.homepage) > -1);
    var hasRepository = (data.indexOf(pkg.repository) > -1);
    var hasBugs = (data.indexOf(pkg.bugs) > -1);
    if (hasHomepage || hasRepository || hasBugs) {
      data.replace(/<b>\s*([\S]+)\s*<\/b>/, function (match, version) {
        npm.version = version;
      });
    }
  });
};

// TODO: Extend compatibility to BitBucket, etc.
Project.prototype.gitify = function () {
  var self = this;
  var dir = self.dir;
  var diff = {};
  diff.additions = 0;
  diff.deletions = 0;
  diff.files = {};
  io.run(dir, 'git diff --numstat', function (out) {
    if (out) {
      out.replace(/(\d+)\t(\d+)\t([^\n]+)/g, function (match, additions, deletions, file) {
        diff.additions += +additions;
        diff.deletions += +deletions;
        diff.files[file] = [+additions, +deletions];
      });
      self.diff = diff;
    }
  });
  io.run(dir, 'git ls-files', function (out) {
    // TODO: Increment in a temporary location.
    if (out) {
      self.lines = 0;
      var files = out.split(/\s/);
      files.forEach(function (file) {
        if (file) {
          io.run(dir, 'wc -l ' + file, function (out) {
            if (out) {
              out.replace(/(\d+)/, function (match, lines) {
                self.lines += +lines;
              });
            }
          });
        }
      });
    }
  });
  self.getGithubCounts();
};

Project.prototype.getGithubCounts = function () {
  var self = this;
  var pkg = self.pkg;
  var url = (pkg.repository || '');
  var github = app.config.github || {};
  if (github.clientId && github.clientSecret) {
    var types = ['issues', 'pulls'];
    types.forEach(function (type) {
      url.replace(/github\.com\/([^\/]+\/[^\/\.]+)/, function (match, repo) {
        io.get(
          'https://api.github.com/repos/' + repo + '/' + type +
            '?client_id=' + github.clientId +
            '&client_secret=' + github.clientSecret +
            '&state=open',
          function (data) {
            if (data) {
              self[type] = {
                url: 'https://github.com/' + repo + '/' + type,
                count: data.length
              };
            }
          }
        );
      });
    });
  }
};

Project.prototype.testify = function () {
  var self = this;
  var dir = self.dir;
  var pkg = self.pkg || {};
  var scripts = pkg.scripts || {};
  var test = scripts.test || '';
  var results = self.results || {};
  if (/exam/.test(test)) {
    test += ' -o -R tap';
  }
  if (test) {
    io.run(
      dir,
      test,
      function (data) {
        if (data) {
          data.replace(/[\r\n]#\s+([a-z]+)\s+(\d+)/g, function (match, key, count) {
            results[key] = +count;
          });
        }
      },
      plans.ignore
    );
  }
};

Project.prototype.on = function (event, fn) {
  var self = this;
  var handlers = self.handlers || (self.handlers = {});
  var list = handlers[event] || (handlers[event] = []);
  list.push(fn);
};

Project.prototype.emit = function (event, data) {
  var self = this;
  var handlers = self.handlers || {};
  var list = handlers[event] || [];
  list.forEach(function (fn) {
    fn.call(self, data);
  });
};
