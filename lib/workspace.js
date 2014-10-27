var fs = require('fs');
var plans = require('plans');
var io = require('./io');
var Project = require('./project');

var Workspace = module.exports = function (dir) {
  var self = this;
  self.dir = dir;
  self.projects = [];
  self.map = {};
  self.names = [];
  self.list = '[]';
  self.load();
};

Workspace.prototype.load = function () {
  var self = this;
  var dir = self.dir;
  var projects = self.projects;
  var names = self.names;
  io.ls(dir, function (files) {
    files.forEach(function (name, index) {
      if (name[0] != '.') {
        if (!self.map[name]) {
          var project = new Project(self, name, dir + '/' + name);
          self.map[name] = project;
          project.on('ready', function () {
            if (project.pkg) {
              projects.push(project);
              projects.sort(function (a, b) {
                return a.pkg.name < b.pkg.name ? -1 : 1;
              });
              self.names.push(project.pkg.name);
              self.names.sort();
              self.list = JSON.stringify(names);
            }
          });
        }
      }
    });
  });
};
