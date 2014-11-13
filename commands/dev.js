/**
 * Usage:
 *   gold dev <options>
 *
 * Description:
 *   Run the Gold IDE Web Server in dev mode.
 *
 * Options:
 *   -d, --dir         Workspace directory.
 *   -p, --port        IDE Server HTTP port.
 */

module.exports = function (options) {
  options.env = 'dev';
  require(__dirname + '/run')(options);
};
