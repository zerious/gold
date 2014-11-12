function Tab(strip, id) {
  var self = this;
  var isProject = (strip == projectTabs);
  var link = self._LINK = addElement(strip._ELEMENT, 'a._TAB');
  var element = self._ELEMENT = addElement(strip._ELEMENT, '._TAB');
  var close = self._CLOSE = addElement(link, 'i');
  close._TAB = self;
  self._STRIP = strip;
  self._ID = id;
  self._TEXT = id.replace(/^.*\//, '');
  self._WIDTH = getTextWidth(self._TEXT) + 32;
  self._Z_ORDER();
}

Tab.prototype._Z_ORDER = function () {
  var self = this;
  var element = self._ELEMENT;
  var strip = self._STRIP;
  var isActive = (self == strip._ACTIVE_TAB);
  element.style.zIndex = self._Z = (isActive ? 1e3 : ++strip._INACTIVE_Z);
};

Tab.prototype._MOVE = function (left, width) {
  var self = this;
  var strip = self._STRIP;
  var link = self._LINK;
  var element = self._ELEMENT;
  var close = self._CLOSE;
  link._TAB = self;
  width = Math.max(width, 28);
  forEach([link, element], function (element) {
    var style = element.style;
    style.left = left + 'px';
    style.width = width + 'px';
  });
  var html = '<svg viewBox="0,0,' + (width + 20) + ',31">' +
    '<filter id="_BLUR"><feGaussianBlur stdDeviation="1.5"></feGaussianBlur></filter>' +
    '<path class="_SHADE" d="M-1,36v-4h2c14,0,3-28,24-28h' + (width - 28) + 'c21,0,8,28,24,28h2v4z"></path>' +
    '<path class="_SHINE" d="M-1,34v-4h2c14,0,3-26,24-26h' + (width - 28) + 'c21,0,8,26,24,26h2v4z"></path>' +
    '</svg><i></i><b></b>';
  setHtml(element, html);
  var child = one(element, 'b');
  setText(child, self._TEXT);
};
