var loadedModes = {};

onReady(function () {
  var code = getElement('_CODE');
  if (code) {
    var main = getElement('_MAIN');
    var mode = getClass(code);

    function show() {
      CodeMirror(main, {
        value: getValue(code),
        mode: mode,
        tabSize: 2,
        lineNumbers: true,
        indentWithTabs: false,
        lineWrapping: true,
        cursorBlinkRate: 400
      });
    }

    if (mode && !loadedModes[mode]) {
      loadedModes[mode] = true;
      insertScript('/mode/' + mode + '.js', function () {
        show();
      });
    }
    else {
      show();
    }
  }
});
