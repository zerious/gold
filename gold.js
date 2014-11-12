#!/usr/bin/env node

// When running directly, start the CLI.
if (process.mainModule == module) {

  var shellify = require('shellify');
  shellify({
    commands: {
      run: {
        note: 'Run the Gold web server',
        options: {
          env: 'Environment|prod',
          dir: 'Workspace directory',
          port: 'Server port|11235',
        }
      },
      link: {
        note: 'Link dependencies to workspace projects where applicable',
        options: {
          dir: 'Workspace directory',
          save: '!Save new version references',
          undo: '!Replace symlinks with `npm install` results'
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
    return require(__dirname + '/package.json').version;
  }
});
