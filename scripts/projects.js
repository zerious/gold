var projectTabs;
var projectNames;
var activeProject;

function initProjects() {

  projectTabs = new TabStrip('_PROJECTS');
  projectNames = window._PROJECT_NAMES;

  bind('_GOLD', 'click', function () {
    projectTabs._DEACTIVATE();
    addClass('_GOLD', '_ON');
    saveWorkspace();
  });

  on('tr._PROJECT', 'click', function (row, event) {
    var label = one(row, 'b');
    var name = getText(label);
    var id = row.id.split('|')[1];
    var tab = projectTabs._ADD(id);
    if (event.which == 1) {
      projectTabs._ACTIVATE(tab);
      trigger(tab._LINK, 'click');
    }
    saveWorkspace();
  });

  projectTabs._ON('_ADD', function (tab) {
    var link = tab._LINK;
    setAttribute(link, 'href', '/project?id=' + tab._ID);
    setData(link, '_D6_TARGET', '#_BODY');
    setData(link, '_D6_VIEW', 'project/body');
  });

  projectTabs._ON('_ACTIVATE', function (tab) {
    activeProject = tab._ID;
    removeClass('_GOLD', '_ON');
    saveWorkspace();
    reopenFiles();
  });

  projectTabs._ON('_DEACTIVATE', function (tab) {
    saveWorkspace();
  });

  loadWorkspace();

}
