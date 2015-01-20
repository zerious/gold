App.modes = {
  cs: 'coffeescript',
  cson: 'coffeescript',
  htm: 'htmlmixed',
  html: 'htmlmixed',
  js: 'javascript',
  json: 'javascript',
  litcoffee: 'coffeescript',
  md: 'markdown'
};

App.chug('node_modules/codemirror/mode/*/*.js')
  .minify()
  .each(function (asset) {
    var url = asset.location.replace(/^.*(\/mode\/)[\w]+\//, '$1');
    if (!/test\.js$/.test(url)) {
      asset.route(url);
      url.replace(/^\/mode\/(.*)\.js$/, function (match, mode) {
        App.modes[mode] = mode;
      });
    }
  });
