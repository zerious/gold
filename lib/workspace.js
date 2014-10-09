var fs = require('fs');
var plans = require('plans');
var io = require('./io');
var Project = require('./project');

var Workspace = module.exports = function (dir) {
  var self = this;
  var projects = [];
  self.dir = dir;
  self.projects = projects;
  self.load();
};

Workspace.prototype.load = function () {
  var self = this;
  var dir = self.dir;
  var projects = self.projects;
  io.ls(dir, function (files) {
    files.forEach(function (name, index) {
      if (name[0] != '.') {
        var found = false;
        projects.forEach(function (project) {
          if (project.pkg.name == name) {
            found = true;
            project.load();
          }
        });
        if (!found) {
          var project = new Project(self, name, dir + '/' + name);
          project.on('ready', function () {
            if (project.pkg) {
              projects.push(project);
              projects.sort(function (a, b) {
                return a.pkg.name < b.pkg.name ? -1 : 1;
              });
            }
          });
        }
      }
    });
  });
};
