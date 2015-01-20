var isDown = {};
bind(window, 'keydown keyup', function (element, event) {
  var code = event.keyCode;
  isDown[event.keyCode] = /d/.test(event.type);
  if (isDown[91] && (code == 83)) {
    log('SAVE!');
    preventDefault(event);
  }
});