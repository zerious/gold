var fs = require('fs');
var lighter = require('../node_modules/lighter');
var dir = __dirname.replace(/[\/\\]lib$/, '');

var base = '\u001b[39m';
var grey = '\u001b[90m';
var red = '\u001b[31m';
var yellow = '\u001b[33m';
var white = '\u001b[37m';

var cedar = require('../node_modules/lighter/node_modules/cedar');
var log = cedar();
var configPath = process.env.WORKSPACE_DIR + '/.gold.json';
var config;

try {
  config = require(configPath);
}
catch (e) {
  log.error('[Gold] No configuration found in "' + configPath + '".');
}
if (!config) {
  log.warn('[Gold] Writing empty configuration.');
  config = {

  };
  var json = JSON.stringify(config);
  try {
    fs.writeFileSync(configPath, json);
  }
  catch (e) {
    log.error('[Gold] Could not write configuration to "' + configPath + '".', e);
  }
}

lighter({
  env: 'dev',
  dir: dir,
  logsDir: '/tmp',
  logger: log,
  overridesPath: configPath,
  enableCluster: false,
  httpPort: process.env.GOLD_PORT,
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
  decorateContext: function (context) {
    context.github = config.github;
  }
});

app.splode.listen(function (error) {
  if (/ENOTFOUND/.test(error.toString())) {
    app.splode.recover();
  }
});
