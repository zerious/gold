function TabStrip(id) {
  var self = this;
  var element = self._ELEMENT = getElement(id);
  var tabs = self._TABS = [];
  self._MAP = {};
  self._INACTIVE_Z = 1;
  self._TAB_WIDTH = 0;
  self._HOVERED_TAB = null;
  self._ACTIVE_TAB = null;
  self._ACTIVATE_FN = doNothing;
  self._DEACTIVATE_FN = doNothing;
  tabStrips.push(self);
  self._RESIZE();

  function unhover(tab) {
    if (tab) {
      removeClass(tab._ELEMENT, '_HOVERED_TAB');
    }
    self._HOVERED_TAB = 0;
  }

  bind(element, 'mousemove mouseout click', function (element, event) {
    var left = element.offsetLeft + getParent(element).offsetLeft + 10;
    var index = Math.floor((event.x / zoom._FACTOR - left) / self._TAB_WIDTH);
    var tab = tabs[index];
    var type = event.type;
    if (type == 'mouseout') {
      unhover(self._HOVERED_TAB);
    }
    else if (tab) {
      if (type == 'click') {
        if (event.which == 1) {
          self._ACTIVATE(tab);
        }
        else if (event.which == 2) {
          self._REMOVE(tab);
        }
      }
      else if (tab != self._HOVERED_TAB) {
        unhover(self._HOVERED_TAB);
        self._HOVERED_TAB = tab;
        addClass(tab._ELEMENT, '_HOVERED_TAB');
      }
    }
  });

}

TabStrip.prototype._ADD = function (id) {
  var self = this;
  var tab = self._MAP[id];
  if (!tab) {
    tab = self._MAP[id] = new Tab(self, id);
    self._TABS.push(tab);
    self._REINDEX(self._TABS.length - 1);
    self._RESIZE();
  }
  return tab;
};

TabStrip.prototype._REMOVE = function (id) {
  var self = this;
  var tab = self._MAP[id._ID || id];
  if (tab) {
    var index = tab._INDEX;
    self._TABS.splice(index, 1);
    delete self._MAP[tab._ID];
    removeElement(tab._ELEMENT);
    // TODO: Select the tab with the highest z-index?
    if (tab == self._ACTIVE_TAB) {
      self._ACTIVE_TAB = self._TABS[0];
    }
    self._REINDEX(index);
    self._RESIZE();
  }
  return tab;
};

TabStrip.prototype._RESIZE = function () {
  var self = this;
  var width = self._ELEMENT.clientWidth - 60;
  self._TAB_WIDTH = Math.min(200, width / self._TABS.length);
  self._DRAW();
};

TabStrip.prototype._REINDEX = function (index) {
  var tabs = this._TABS;
  var length = tabs.length;
  for (index = index || 0; index < length; index++) {
    tabs[index]._INDEX = index;
  }
  saveWorkspace();
};

TabStrip.prototype._DRAW = function (index) {
  var self = this;
  var length = self._TABS.length;
  var left = 10;
  var width = self._TAB_WIDTH;
  for (index = index || 0; index < length; index++) {
    var tab = self._TABS[index];
    tab._MOVE(left, width);
    left += width;
  }
};

TabStrip.prototype._ON_ACTIVATE = function (fn) {
  this._ACTIVATE_FN = fn;
};

TabStrip.prototype._ON_DEACTIVATE = function (fn) {
  this._DEACTIVATE_FN = fn;
};

TabStrip.prototype._ACTIVATE = function (tab) {
  var self = this;
  var active = self._ACTIVE_TAB;
  if (tab != active) {
    self._DEACTIVATE();
    var element = tab._ELEMENT;
    addClass(element, '_ACTIVE_TAB');
    self._ACTIVE_TAB = tab;
    tab._Z_ORDER();
    self._DRAW();
    self._ACTIVATE_FN(tab);
  }
};

TabStrip.prototype._DEACTIVATE = function () {
  var self = this;
  var tab = self._ACTIVE_TAB;
  self._ACTIVE_TAB = 0;
  if (tab) {
    var element = tab._ELEMENT;
    removeClass(element, '_ACTIVE_TAB');
    tab._Z_ORDER();
    self._DEACTIVATE_FN(tab);
    self._DRAW();
  }
};

function Tab(strip, id) {
  var self = this;
  var element = self._ELEMENT = addElement(strip._ELEMENT, '._TAB');
  self._STRIP = strip;
  self._ID = id;
  self._TEXT = id.replace(/^.*\//);
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
  var element = self._ELEMENT;
  var style = element.style;
  style.left = left + 'px';
  style.width = width + 'px';
  width *= 1.03;
  var inside = Math.max(0, width - 28);
  var html = '<svg viewBox="0,0,' + (inside + 48) + ',31">' +
    '<filter id="_BLUR"><feGaussianBlur stdDeviation="1.5"></feGaussianBlur></filter>' +
    '<path class="_SHADE" d="M-1,36v-4h2c14,0,3-28,24-28h' + inside + 'c21,0,8,28,24,28h2v4z"></path>' +
    '<path class="_SHINE" d="M-1,34v-4h2c14,0,3-26,24-26h' + inside + 'c21,0,8,26,24,26h2v4z"></path>' +
    '</svg><i></i><b></b>';
  setHtml(element, html);
  var child = one(element, 'b');
  setText(child, self._TEXT);
};

var tabStrips = [];
bind(window, 'resize', function () {
  forEach(tabStrips, function (strip) {
    strip._RESIZE();
  });
});
