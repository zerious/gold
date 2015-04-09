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
        html += '<b class="_tree' + ignore + '">';
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
          var classes = isDir ? '_dir' : '_file';
          if (item[0] == '`') {
            item = item.substr(1);
            ignore = ' _ignore';
            classes += ignore;
          }
          stack.push(item);
          var path = stack.join('/');
          if (isDir) {
            html += '<b class="' + classes + '" id="_dir:' + path + '"><i></i>' + item + '</b>';
          }
          else {
            var href = base + path;
            html += '<a class="' + classes + '" href="' + href + '" data-_d6Target="#_main" data-_d6View="file/code"><i></i>' + item + '</a>';
            stack.pop();
          }
        }
        break;
    }
  }
  setHtml(element, html);
}

on('b._dir', 'click', function (element) {
  var tree = getNextSibling(element);
  var isOpen = toggleClass(element, '_open');
  flipClass(tree, '_open', isOpen);
  var dir = element.id.replace(/^_dir:/, '');
  toggleTreeDir(dir, isOpen);
});

on('a._file', 'click', function (element, event) {
  var id = element.href.replace(/^.*file=/, '');
  showFile(id);
  preventDefault(event);
});
