module.exports = {

  description: 'Run the Gold IDE Web Server in dev mode',

  options: [
    '-d, --dir   Workspace directory',
    '-p, --port  IDE Server HTTP port [11235]'
  ],

  run: function (options) {
    options.env = 'dev';
    require(__dirname + '/run').run(options);
  }

};
