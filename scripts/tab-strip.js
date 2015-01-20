function TabStrip(id) {
  var self = this;
  decorateObject(self, EmitterPrototype);
  var element = self._ELEMENT = getElement(id);
  var tabs = self._TABS = [];
  self._MAP = {};
  self._INACTIVE_Z = 1;
  self._TOTAL_WIDTH = 0;
  self._TAB_SCALE = 1;
  self._HOVERED_TAB = null;
  self._ACTIVE_TAB = null;
  tabStrips.push(self);
  self._RESIZE();

  function unhover(tab) {
    if (tab) {
      removeClass(tab._ELEMENT, '_HOVERED_TAB');
    }
    self._HOVERED_TAB = 0;
  }

  on(element, 'i', 'click', function (close, event) {
    var tab = close._TAB;
    if (tab) {
      tab._STRIP._REMOVE(tab);
    }
  });

  on(element, 'a', 'mousemove mouseout click', function (link, event) {
    var tab = link._TAB;
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
          preventDefault(event);
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

var proto = TabStrip.prototype;

proto._ADD = function (id) {
  var self = this;
  var tab = self._MAP[id];
  if (!tab) {
    tab = self._MAP[id] = new Tab(self, id);
    self._TABS.push(tab);
    self._TOTAL_WIDTH += tab._WIDTH;
    self._REINDEX(self._TABS.length - 1);
    self._RESIZE();
    self._EMIT('_ADD', tab);
  }
  return tab;
};

proto._REMOVE = function (id) {
  var self = this;
  var tab = self._MAP[id._ID || id];
  if (tab) {
    var index = tab._INDEX;
    self._TABS.splice(index, 1);
    delete self._MAP[tab._ID];
    self._TOTAL_WIDTH -= tab._WIDTH;
    removeElement(tab._LINK);
    removeElement(tab._ELEMENT);
    removeElement(tab._CLOSE);
    // TODO: Select the tab with the highest z-index?
    if (tab == self._ACTIVE_TAB) {
      self._DEACTIVATE(tab);
      var nextTab = self._TABS[0];
      if (nextTab) {
        self._ACTIVATE(nextTab);
        trigger(nextTab._LINK, 'click');
      }
      else if (self == projectTabs) {
        var menu = getElement('_GOLD');
        trigger(menu, 'click');
      }
    }
    self._REINDEX(index);
    self._RESIZE();
    self._EMIT('_REMOVE', tab);
  }
  return tab;
};

proto._CLEAR = function () {
  var self = this;
  self._TABS.length = 0;
  self._ACTIVE_TAB = 0;
};

proto._RESIZE = function () {
  var self = this;
  var width = self._ELEMENT.clientWidth - 60;
  self._TAB_SCALE = Math.min(1, width / self._TOTAL_WIDTH);
  self._DRAW();
};

proto._REINDEX = function (index) {
  var tabs = this._TABS;
  var length = tabs.length;
  for (index = index || 0; index < length; index++) {
    tabs[index]._INDEX = index;
  }
  saveWorkspace();
};

proto._DRAW = function (index) {
  var self = this;
  var length = self._TABS.length;
  var left = 10;
  for (index = index || 0; index < length; index++) {
    var tab = self._TABS[index];
    var width = Math.round(tab._WIDTH * self._TAB_SCALE);
    tab._MOVE(left, width);
    left += width;
  }
};

proto._ACTIVATE = function (tab) {
  var self = this;
  var active = self._ACTIVE_TAB;
  if (tab != active) {
    self._DEACTIVATE();
    var element = tab._ELEMENT;
    addClass(element, '_ACTIVE_TAB');
    self._ACTIVE_TAB = tab;
    tab._Z_ORDER();
    self._DRAW();
    self._EMIT('_ACTIVATE', tab);
  }
};

proto._DEACTIVATE = function () {
  var self = this;
  var tab = self._ACTIVE_TAB;
  self._ACTIVE_TAB = 0;
  if (tab) {
    var element = tab._ELEMENT;
    removeClass(element, '_ACTIVE_TAB');
    tab._Z_ORDER();
    self._EMIT('_DEACTIVATE', tab);
    self._DRAW();
  }
};

var tabStrips = [];
bind(window, 'resize', function () {
  forEach(tabStrips, function (strip) {
    strip._RESIZE();
  });
});
