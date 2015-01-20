module.exports = {

  index: function GET(request, response) {
    response.view('workspace/index', {
      workspace: App.workspace
    });
  }

};
