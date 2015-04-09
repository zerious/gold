var projectTabs;
var projectNames;
var activeProject;

function initProjects() {

  projectTabs = new TabStrip('_projects');
  projectNames = window._projectNames;

  bind('_gold', 'click', function () {
    projectTabs._deactivate();
    addClass('_gold', '_on');
    saveWorkspace();
  });

  on('tr._project', 'click', function (row, event) {
    var label = one(row, 'b');
    var name = getText(label);
    var id = row.id.split('|')[1];
    var tab = projectTabs._add(id);
    if (event.which == 1) {
      projectTabs._activate(tab);
      trigger(tab._link, 'click');
    }
    saveWorkspace();
  });

  projectTabs._on('_add', function (tab) {
    var link = tab._link;
    setAttribute(link, 'href', '/project?id=' + tab._id);
    setData(link, '_d6Target', '#_body');
    setData(link, '_d6View', 'project/body');
  });

  projectTabs._on('_activate', function (tab) {
    activeProject = tab._id;
    removeClass('_gold', '_on');
    saveWorkspace();
    reopenFiles();
  });

  projectTabs._on('_deactivate', function (tab) {
    saveWorkspace();
  });

  loadWorkspace();

}
