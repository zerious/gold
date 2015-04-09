var fs = require('fs');
var spawn = require('child_process').spawn;
var plans = require('plans');
var parseUrl = require('url').parse;

function ensureString(data) {
  return '' + data;
}

module.exports = {

  ls: function (dir, fn, onError) {
    plans.run(
      function (fn) {
        fs.readdir(dir, function (e, files) {
          fn(e, files || []);
        });
      },
      {
        ok: fn,
        error: onError || function (e) {
          Log.error('[Gold] Failed to read directory: "' + dir + '"', e);
        }
      }
    );
  },

  read: function (path, fn, onError) {
    plans(path).flow(
      [fs.readFile, ensureString],
      {
        ok: fn,
        error: onError || function (e) {
          Log.error('[Gold] Failed to read file: "' + path + '"', e);
        }
      }
    );
  },

  get: function (url, fn, onError) {
    plans.run(
      function (fn) {
        var data = '';
        var options = parseUrl(url);
        var protocol = options.protocol.replace(':', '');
        var lib = require(protocol);
        options.headers = {'user-agent': 'Node.js'};
        var request = lib.get(options, function (response) {
          response.on('data', function (chunk) {
            data += chunk;
          });
          response.on('end', function () {
            if (/json/i.test(response.headers['content-type'])) {
              data = JSON.parse(data);
            }
            fn(data);
          });
        });
        request.on('error', function (e) {
          // Ignore.
        });
      },
      {
        timeout: 1e4,
        retries: 9,
        backoff: 2,
        delay: 1e4,
        ok: fn,
        error: onError || function (e) {
          Log.error('[Gold] Failed to get URL: "' + url + '"', e);
        }
      }
    );
  },

  run: function (dir, cmd, fn, onError) {
    var args = cmd.split(' ');
    var bin = args.shift();
    plans.run(
      function (fn) {
        var child = spawn(bin, args, {cwd: dir});
        var data = '';
        child.stdout.on('data', function (chunk) {
          data += chunk;
        });
        child.stdout.on('end', function () {
          fn(data);
        });
        child.stderr.on('data', function (data) {
          fn(new Error('' + data));
        });
      },
      {
        timeout: 1e4,
        retries: 2,
        delay: 1e3,
        ok: fn,
        error: onError || function (e) {
          Log.error('[Gold] Failed to run "' + cmd + '" in "' + dir + '".', e);
        }
      }
    );
  },

  write: function (path, data, fn, onError) {
    plans.run(
      function (fn) {
        fs.writeFile(path, data, function (e) {
          if (e) throw e;
          fn();
        });
      },
      {
        ok: fn,
        error: onError || function (e) {
          Log.error('[Gold] Failed to write file: "' + path + '".', e);
        }
      }
    );
  },

  readJson: function (path, fn, onError) {
    plans(path).flow(
      [fs.readFile, JSON.parse],
      {
        ok: fn,
        error: onError || function (e) {
          Log.error('[Gold] Failed to parse JSON from: "' + path + '".', e);
        }
      }
    );
  }

};
