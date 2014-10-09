var https = require('https');
var qs = require('querystring');

function setGithubToken(token) {
  log.info('[Gold] GitHub Access Token: "' + token + '"');
  app.config.github.token = token;
  app.workspace.projects.forEach(function (project) {
    project.getGithubCounts();
  });
}

module.exports = {

  index: function GET(request, response) {

    response.redirect('/');

    var github = app.config.github || {};

    var postData = qs.stringify({
      client_id: github.clientId,
      client_secret: github.clientSecret,
      code: request.query.code
    });

    var options = {
      method: 'POST',
      hostname: 'github.com',
      path: '/login/oauth/access_token',
      headers: {
        accept: 'application/json',
        'content-type': 'application/x-www-form-urlencoded',
        'content-length': postData.length
      }
    };

    var data = '';

    request = https.request(options, function(response) {
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
        data += chunk;
      });
      response.on('end', function () {
        try {
          data = JSON.parse(data);
        }
        catch (e) {
          log.error('[Gold] Failed to parse GitHub access token JSON.', data);
          return;
        }
        setGithubToken(data.access_token);
      });
    });

    request.on('error', function(e) {
      log.error('[Gold] Failed to retrieve GitHub access token.', e);
    });

    request.write(postData);
    request.end();
  }

};
