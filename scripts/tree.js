function Tree(id, project, string) {
  var list = string.split(/([\/\\\|])/);
  var base = '/project?id=' + project + '&file=';
  var element = getElement(id);
  var html = '';
  var ignore = '';
  var stack = [];
  for (var i = 0, l = list.length; i < l; i++) {
    var item = list[i];
    switch (item) {
      case '/':
        html += '<b class="_TREE' + ignore + '">';
        break;
      case '\\':
        stack.pop();
        html += '</b>';
        break;
      case '|':
        break;
      default:
        if (item) {
          ignore = '';
          var isDir = (list[i + 1] == '/');
          var classes = isDir ? '_DIR' : '_FILE';
          if (item[0] == '`') {
            item = item.substr(1);
            ignore = ' _IGNORE';
            classes += ignore;
          }
          stack.push(item);
          var path = stack.join('/');
          if (isDir) {
            html += '<b class="' + classes + '" id="_DIR:' + path + '"><i></i>' + item + '</b>';
          }
          else {
            var href = base + path;
            html += '<a class="' + classes + '" href="' + href + '" data-_D6_TARGET="#_MAIN" data-_D6_VIEW="file/code"><i></i>' + item + '</a>';
            stack.pop();
          }
        }
        break;
    }
  }
  setHtml(element, html);
}

on('b._DIR', 'click', function (element) {
  var tree = getNextSibling(element);
  var isOpen = toggleClass(element, '_OPEN');
  flipClass(tree, '_OPEN', isOpen);
  var dir = element.id.replace(/^_DIR:/, '');
  toggleTreeDir(dir, isOpen);
});

on('a._FILE', 'click', function (element, event) {
  var id = element.href.replace(/^.*file=/, '');
  showFile(id);
  preventDefault(event);
});
