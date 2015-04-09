initProjects();
initFiles();

function saveWorkspace() {
  var active = projectTabs._activeTab;
  var workspace = {_activeIndex: active ? active._index : -1};
  var projects = workspace._projects = [{_id: '.'}];
  forEach(projectTabs._tabs, function (tab, index) {
    var project = {_id: tab._id};
    projects.push(project);
  });
  setCookie('w', stringify(workspace));
  return workspace;
}

function loadWorkspace() {
  var workspace = parse(getCookie('w'));
  var treeName = loadTree();
  var map = {};
  forEach(workspace._projects, function (project) {
    map[project._id] = project;
  });
  forEach(projectNames, function (name) {
    var project = map[name];
    if (project) {
      var id = project._id;
      var tab = (id == '.' ? project : projectTabs._add(id));
      if (tab._index == workspace._activeIndex) {
        projectTabs._activate(tab);
      }
    }
  });
}

function loadTree() {
  var data = getHiddenData('#_tree');
  var name = data[0];
  var string = data[1];
  if (string) {
    new Tree('_tree', name, string);
  }
  return name;
}

/**
 * If reloaded content includes the tree, reload the tree.
 */
onReady(function (readyElement) {
  all(readyElement, '._scrollable', function (element) {
    if (element.id == '_tree') {
      loadTree();
    }
  });
});
