function TabStrip(id) {
  var self = this;
  self._ELEMENT = getElement(id);
  self._TABS = [];
  self._TAB_WIDTH = 40;

  // TODO: Remove after debugging.
  var count = Math.floor(Math.random() * 10 + 4);
  for (var i = 0; i < count; i++) {
    self._ADD();
  }
  var activeIndex = Math.floor(Math.random() * count);
  log(self._TABS, activeIndex);
  self._TABS[activeIndex]._ACTIVATE();
  self._DRAW();
}

// TODO: Add arguments for text, etc.
TabStrip.prototype._ADD = function () {
  var self = this;
  var tab = new Tab(self);
  self._TABS.push(tab);
  return tab;
};

TabStrip.prototype._DRAW = function (index) {
  var self = this;
  var length = self._TABS.length;
  var left = 0;
  var width = self._TAB_WIDTH;
  for (index = index || 0; index < length; index++) {
    var tab = self._TABS[index];
    tab._MOVE(left, width);
    left += width;
  }
};

function Tab(strip) {
  var self = this;
  var element = self._ELEMENT = addElement(strip._ELEMENT, '._TAB');
  self._STRIP = strip;
}

Tab.prototype._MOVE = function (left, width) {
  var self = this;
  var element = self._ELEMENT;
  var index = self._INDEX;
  var style = element.style;
  style.zIndex = 998 - index;
  style.left = left + 'px';
  style.width = width + 'px';
  var path = 'M4,22.7v-1c15,0,5-18,20-18h' + (width - 24) + 'c15,0,5,18,20,18v1z'
  var html = '<svg viewBox="0,0,' + (width + 24) + ',22">' +
    '<filter id="_BLUR"><feGaussianBlur stdDeviation="1.2"></feGaussianBlur></filter>' +
    '<path class="_SHADE" d="' + path + '"></path>' +
    '<path class="_SHINE" d="' + path + '"></path>' +
    '</svg>';
  setHtml(element, html);
};

Tab.prototype._ACTIVATE = function () {
  var self = this;
  var element = self._ELEMENT;
  addClass(element, '_ON');
  element.style.zIndex = 1e3;
};

window._TABS = [new TabStrip('_PROJECTS'), new TabStrip('_PARTS')];

