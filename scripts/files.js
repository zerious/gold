var fileTabs;
var openFiles;
var activeFile;
var expandedDirs;
var openKey;
var activeKey;
var expandedKey;

function initFiles() {
  createFileStrip();
  var hiddenFileData = getHiddenData('#_files');
  if (hiddenFileData.length) {
    showFile(hiddenFileData[0]);
  }
}

function createFileStrip() {
  fileTabs = new TabStrip('_files');

  openKey = activeProject + ':_open';
  activeKey = activeProject + ':_active';
  expandedKey = activeProject + ':_expanded';
  openFiles = fetch(openKey);
  openFiles = isObject(openFiles) ? openFiles : {};
  activeFile = fetch(activeKey);
  expandedDirs = fetch(expandedKey);
  expandedDirs = isObject(expandedDirs) ? expandedDirs : {};

  fileTabs._on('_add', function (tab) {
    var link = tab._link;
    var file = tab._id;
    setAttribute(link, 'href', '/project?id=' + activeProject + '&file=' + file);
    setData(link, '_d6Target', '#_main');
    setData(link, '_d6View', 'file/code');
    openFiles[file] = 1;
    store(openKey, openFiles);
  });

  fileTabs._on('_remove', function (tab) {
    delete openFiles[tab._id];
    store(openKey, openFiles);
  });

  fileTabs._on('_activate', function (tab) {
    store(activeKey, tab._id);
  });
}

function toggleTreeDir(dir, isOpen) {
  if (isOpen) {
    expandedDirs[dir] = 1;
  }
  else {
    delete expandedDirs[dir];
  }
  store(expandedKey, expandedDirs);
}

function showFile(file) {
  fileTabs = fileTabs || createFileStrip();
  var tab = fileTabs._add(file);
  fileTabs._activate(tab);
}

function reopenFiles() {
  createFileStrip();
  forIn(openFiles, function (id) {
    var tab = fileTabs._add(id);
    if (id == activeFile) {
      fileTabs._activate(tab);
      trigger(tab._link, 'click');
    }
  });
}
