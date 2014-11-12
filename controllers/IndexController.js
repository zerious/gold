var fs = require('fs');

module.exports = {

  index: function GET(request, response) {
    response.view('workspace/index', {
      workspace: app.workspace
    });
  }

};
