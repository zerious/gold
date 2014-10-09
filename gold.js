#!/usr/bin/env node

// When running directly, start the CLI.
if (process.mainModule == module) {

  var shellify = require('shellify');
  shellify({
    commands: {
      run: {
        note: 'Runs the Gold web server',
        options: {
          dir: 'Workspace directory',
          port: 'Server port|11235',
        }
      }
    }
  });

}

var gold = module.exports;

/**
 * Expose the Gold version via package.json lazy loading.
 */
Object.defineProperty(gold, 'version', {
  get: function () {
    return require('./package.json').version;
  }
});
