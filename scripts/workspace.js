initProjects();
initFiles();

function saveWorkspace() {
  var active = projectTabs._ACTIVE_TAB;
  var workspace = {_ACTIVE_INDEX: active ? active._INDEX : -1};
  var projects = workspace._PROJECTS = [{_ID: '.'}];
  forEach(projectTabs._TABS, function (tab, index) {
    var project = {_ID: tab._ID};
    projects.push(project);
  });
  setCookie('w', stringify(workspace));
  return workspace;
}

function loadWorkspace() {
  var workspace = parse(getCookie('w'));
  var treeName = loadTree();
  var map = {};
  forEach(workspace._PROJECTS, function (project) {
    map[project._ID] = project;
  });
  forEach(projectNames, function (name) {
    var project = map[name];
    if (project) {
      var id = project._ID;
      var tab = (id == '.' ? project : projectTabs._ADD(id));
      if (tab._INDEX == workspace._ACTIVE_INDEX) {
        projectTabs._ACTIVATE(tab);
      }
    }
  });
}

function loadTree() {
  var data = getHiddenData('#_TREE');
  var name = data[0];
  var string = data[1];
  if (string) {
    new Tree('_TREE', name, string);
  }
  return name;
}

/**
 * If reloaded content includes the tree, reload the tree.
 */
onReady(function (readyElement) {
  all(readyElement, '._SCROLLABLE', function (element) {
    if (element.id == '_TREE') {
      loadTree();
    }
  });
});
