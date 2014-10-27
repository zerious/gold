var fs = require('fs');
var Workspace = new require('../lib/workspace');

app.workspace = new Workspace(process.env.WORKSPACE_DIR);
setInterval(function () {
  app.workspace.load();
}, 1e6);

module.exports = {

  index: function GET(request, response) {
    response.view('index', app.workspace);
  }

};
