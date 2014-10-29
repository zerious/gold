function flipMain(on) {
  flipClass('_GOLD', '_ON', on);
  flipClass('_MAIN', '_HIDDEN', !on);
}

bind('_GOLD', 'click', function () {
  projectTabs._DEACTIVATE();
  flipMain(1);
  saveWorkspace();
});

function saveWorkspace() {
  var active = projectTabs._ACTIVE_TAB;
  var workspace = {_ACTIVE_INDEX: active ? active._INDEX : -1};
  var projects = workspace._PROJECTS = [];
  forEach(projectTabs._TABS, function (tab, index) {
    var project = {_ID: tab._ID, _FILES: []};
    projects.push(project);
  });
  setCookie('w', stringify(workspace));
}

setTimeout(function () {
  projectTabs = new TabStrip('_PROJECTS');
  projectTabs._ON_ACTIVATE(function (tab) {
    flipMain(0);
    saveWorkspace();
  });
  var workspace = parse(getCookie('w') || '');
  forEach(workspace._PROJECTS, function (project, index) {
    var id = project._ID;
    var tab = projectTabs._ADD(id);
    if (tab._INDEX == workspace._ACTIVE_INDEX) {
      projectTabs._ACTIVATE(tab);
    }
  });
});
