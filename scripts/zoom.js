function zoom(z) {
  z = Math.round(z * 100) / 100;
  zoom._FACTOR = z;
  document.body.style.zoom = z;
  setCookie('z', z);
  trigger(window, 'resize');
}

zoom(getCookie('z') || 1);

bind(window, 'mousewheel', function (element, event, target) {
  while (target) {
    if (hasClass(target, '_SCROLLABLE')) {
      return;
    }
    target = getParent(target);
  }
  var delta = event.wheelDelta;
  var multiplier = (delta > 0 ? 1.05 : 0.95);
  zoom(zoom._FACTOR * multiplier);
});
