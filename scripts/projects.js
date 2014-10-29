var projectList = window._PROJECTS;
var projectTabs;

on('tr._PROJECT', 'click', function (row, event) {
  var label = one(row, 'b');
  var name = getText(label);
  var id = row.id.split('|')[1];
  var tab = projectTabs._ADD(id);
  if (event.which == 1) {
    projectTabs._ACTIVATE(tab);
  }
  saveWorkspace();
});
