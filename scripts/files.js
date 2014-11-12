var fileTabs;
var openFiles;
var activeFile;
var expandedDirs;
var openKey;
var activeKey;
var expandedKey;

function initFiles() {
  createFileStrip();
  var hiddenFileData = getHiddenData('#_FILES');
  if (hiddenFileData.length) {
    showFile(hiddenFileData[0]);
  }
}

function createFileStrip() {
  fileTabs = new TabStrip('_FILES');

  openKey = activeProject + ':_OPEN';
  activeKey = activeProject + ':_ACTIVE';
  expandedKey = activeProject + ':_EXPANDED';
  openFiles = fetch(openKey);
  openFiles = isObject(openFiles) ? openFiles : {};
  activeFile = fetch(activeKey);
  expandedDirs = fetch(expandedKey);
  expandedDirs = isObject(expandedDirs) ? expandedDirs : {};

  fileTabs._ON('_ADD', function (tab) {
    var link = tab._LINK;
    var file = tab._ID;
    setAttribute(link, 'href', '/project?id=' + activeProject + '&file=' + file);
    setData(link, '_D6_TARGET', '#_MAIN');
    setData(link, '_D6_VIEW', 'file/code');
    openFiles[file] = 1;
    store(openKey, openFiles);
  });

  fileTabs._ON('_REMOVE', function (tab) {
    delete openFiles[tab._ID];
    store(openKey, openFiles);
  });

  fileTabs._ON('_ACTIVATE', function (tab) {
    store(activeKey, tab._ID);
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
  var tab = fileTabs._ADD(file);
  fileTabs._ACTIVATE(tab);
}

function reopenFiles() {
  createFileStrip();
  forIn(openFiles, function (id) {
    var tab = fileTabs._ADD(id);
    if (id == activeFile) {
      fileTabs._ACTIVATE(tab);
      trigger(tab._LINK, 'click');
    }
  });
}
