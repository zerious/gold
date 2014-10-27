var projectList = window._PROJECTS;
var projectMap = {};
var projectTabs;

on('tr._PROJECT', 'click', function (element) {
  var name = one(element, 'b');
  name = getText(name);
  var tab = projectMap[name] || (projectMap[name] = projectTabs._ADD(name));
  projectTabs._RESIZE();
  projectTabs._ACTIVATE(tab);
});

bind('_GOLD', 'click', function () {
  projectTabs._DEACTIVATE();
  flipMain(1);
});

setTimeout(function () {
  projectTabs = new TabStrip('_PROJECTS');
  projectTabs._ON_ACTIVATE(function (tab) {
    flipMain(0);
  });
});

function flipMain(on) {
  flipClass('_GOLD', '_ON', on);
  flipClass('_MAIN', '_HIDDEN', !on);
}