#!/usr/bin/env node
if (process.mainModule == module) {
  require(__dirname + '/common/process/cli')();
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
