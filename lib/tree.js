var fs = require('fs');

var tree = module.exports = function (dir, file, maxDepth, ignore, fn) {
  var path = dir + '/' + file;
  if (ignore === true) {
    file = '`' + file;
  }
  fs.lstat(path, function (err, stat) {
    if (err) {
      fn(file);
    }
    else if (stat.isSymbolicLink()) {
      fn(file + '/~\\');
    }
    else if (stat.isDirectory()) {
      if (maxDepth) {
        fs.readdir(path, function (err, files) {
          if (err) {
            fn(file + '/\\');
          }
          else {
            var wait = files.length;
            if (wait) {
              var children = new Array(wait);
              files.forEach(function (child, index) {
                pass = (ignore instanceof RegExp) && ignore.test(child);
                tree(path, child, maxDepth - 1, pass, function (string) {
                  children[index] = string;
                  if (!--wait) {
                    fn(file + '/' + children.join('|') + '\\');
                  }
                });
              });
            }
            else {
              fn(file + '/\\');
            }
          }
        });
      }
      else {
        fn(file + '/?\\')
      }
    }
    else {
      fn(file);
    }
  });
};
