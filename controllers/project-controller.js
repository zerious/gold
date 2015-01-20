var fs = require('fs');

module.exports = {

  index: function GET(request, response) {
    var query = request.query;
    var project = App.workspace.map[query.id];
    var file = query.file || '';
    if (project) {
      var code = '';
      function done () {
        response.view('project/index', {
          project: project,
          tree: project.tree,
          file: file,
          code: code,
          mode: App.modes[file.replace(/^.+\./, '')]
        });
      }
      if (file) {
        fs.readFile(project.path + '/' + file, function (err, content) {
          if (!err) {
            code += content;
          }
          done();
        });
      }
      else {
        done();
      }
    }
    else {
      response.redirect('/');
    }
  }

};
