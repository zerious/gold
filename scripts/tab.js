function Tab(strip, id) {
  var self = this;
  var isProject = (strip == projectTabs);
  var link = self._link = addElement(strip._element, 'a._tab');
  var element = self._element = addElement(strip._element, '._tab');
  var close = self._close = addElement(link, 'i');
  close._tab = self;
  self._strip = strip;
  self._id = id;
  self._text = id.replace(/^.*\//, '');
  self._width = getTextWidth(self._text) + 32;
  self._zOrder();
}

Tab.prototype._zOrder = function () {
  var self = this;
  var element = self._element;
  var strip = self._strip;
  var isActive = (self == strip._activeTab);
  element.style.zIndex = self._Z = (isActive ? 1e3 : ++strip._inactiveZ);
};

Tab.prototype._move = function (left, width) {
  var self = this;
  var strip = self._strip;
  var link = self._link;
  var element = self._element;
  var close = self._close;
  link._tab = self;
  width = Math.max(width, 28);
  forEach([link, element], function (element) {
    var style = element.style;
    style.left = left + 'px';
    style.width = width + 'px';
  });
  var html = '<svg viewBox="0,0,' + (width + 20) + ',31">' +
    '<filter id="_blur"><feGaussianBlur stdDeviation="1.5"></feGaussianBlur></filter>' +
    '<path class="_shade" d="M-1,36v-4h2c14,0,3-28,24-28h' + (width - 28) + 'c21,0,8,28,24,28h2v4z"></path>' +
    '<path class="_shine" d="M-1,34v-4h2c14,0,3-26,24-26h' + (width - 28) + 'c21,0,8,26,24,26h2v4z"></path>' +
    '</svg><i></i><b></b>';
  setHtml(element, html);
  var child = one(element, 'b');
  setText(child, self._text);
};
