var fs = require('fs');
var dir = __dirname.replace(/[\/\\]lib$/, '');
var lighter = require(dir + '/node_modules/lighter/lighter');

var base = '\u001b[39m';
var grey = '\u001b[90m';
var red = '\u001b[31m';
var yellow = '\u001b[33m';
var white = '\u001b[37m';

require(dir + '/lib/object');

var chug = require(dir + '/node_modules/lighter/node_modules/chug/chug');
chug.enableShrinking = function () {};

var configPath = process.env.WORKSPACE_DIR + '/.gold.json';
var Log = require(dir + '/node_modules/lighter/node_modules/cedar/cedar')();
try {
  config = require(configPath);
}
catch (e) {
  Log.error('[Gold] No configuration found in "' + configPath + '".');
}
if (!config) {
  Log.warn('[Gold] Writing empty configuration.');
  config = {};
  var json = JSON.stringify(config);
  try {
    fs.writeFileSync(configPath, json);
  }
  catch (e) {
    Log.error('[Gold] Could not write configuration to "' + configPath + '".', e);
  }
}

var App = lighter({

  dir: dir,

  logger: [{transport: 'console'}],

  configPath: configPath,

  httpPort: process.env.GOLD_PORT,

  processCount: 1,

  exposeGlobals: true,

  workspaceDir: process.env.WORKSPACE_DIR || process.cwd(),

  asciiArt: ['',
    white + '      ____________      ' + grey + '    ____       _     _',
    white + '     A' + yellow + '###########A' + red + 'A     ' + grey + '   / ___| ___ | | __| |',
    white + '    A' + yellow + '#############' + red + 'VA    ' + grey + '  | |  _ / _ \\| |/ _` |',
    white + '   A' + yellow + '###############' + red + 'VA   ' + grey + '  | |_| | (_) | | (_| |',
    white + '  A' + yellow + '#################' + red + 'VA  ' + grey + '   \\____|\\___/|_|\\__,_|',
    white + ' A' + yellow + '###################' + red + 'VA ' + base + '  ',
    white + 'A' + yellow + '#####################' + red + 'VA' + base + '  ',
    white + 'H' + yellow + '#####################' + red + '#H' + base + '  ',
    yellow + 'H' + red + '######################H' + base + '  ',
    ''],

  scripts: {
    '/a.js': [
      'node_modules/lighter/node_modules/jymin/plugins/md5.js',
      'scripts'
    ],
  },

  styles: {
    '/a.css': [
      'styles'
    ],
  },

  decorateContext: function (context, request) {

    // Allow far-future expires header on assets.
    context.cacheBust = App.server._cacheBust;

    // In dev mode, make it easier to debug individual files.
    if (App.isDev) {
      context.styleTags = App.styles['/a.css'].sourceLoad.getTags();
      context.scriptTags = App.scripts['/a.js'].sourceLoad.getTags();
    }

    var workspace = App.workspace || {};
    context.projectNames = workspace.projectNames || '[]';
  }

});

App.splode.listen(function (error) {
  if (/ENOTFOUND/.test(error.toString())) {
    App.splode.recover();
  }
});

var Workspace = require(dir + '/lib/workspace');
App.workspace = new Workspace(App.config.workspaceDir);

require(dir + '/lib/modes');
