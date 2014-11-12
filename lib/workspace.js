var fs = require('fs');
var plans = require('plans');
var io = require('./io');
var Project = require('./project');

module.exports = Workspace;

function Workspace(path) {
  var self = this;
  self.path = path;
  self.projects = [];
  self.define('map', {});
  self.define('dirs', []);
  self.projectNames = '[]';
  self.load();

  // TODO: Poll individual data at more optimal intervals.
  setInterval(function () {
    self.load();
  }, 3e5); // 5 minutes.
}

Workspace.prototype.load = function () {
  var self = this;
  var path = self.path;
  io.ls(path, function (files) {
    files.forEach(function (dir, index) {
      if (!self.map[dir]) {
        var project = new Project(self, dir);
        self.map[dir] = project;
        project.on('ready', function () {
          if (project.pkg) {
            self.projects.push(project);
            self.projects.sort(function (a, b) {
              return a.dir < b.dir ? -1 : 1;
            });
            self.dirs.push(dir);
            self.dirs.sort();
            self.projectNames = JSON.stringify(self.dirs);
          }
        });
      }
    });
  });
};
