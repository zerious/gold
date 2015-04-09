function TabStrip(id) {
  var self = this;
  decorateObject(self, EmitterPrototype);
  var element = self._element = getElement(id);
  var tabs = self._tabs = [];
  self._map = {};
  self._inactiveZ = 1;
  self._totalWidth = 0;
  self._tabScale = 1;
  self._hoveredTab = null;
  self._activeTab = null;
  tabStrips.push(self);
  self._resize();

  function unhover(tab) {
    if (tab) {
      removeClass(tab._element, '_hoveredTab');
    }
    self._hoveredTab = 0;
  }

  on(element, 'i', 'click', function (close, event) {
    var tab = close._tab;
    if (tab) {
      tab._strip._remove(tab);
    }
  });

  on(element, 'a', 'mousemove mouseout click', function (link, event) {
    var tab = link._tab;
    var type = event.type;
    if (type == 'mouseout') {
      unhover(self._hoveredTab);
    }
    else if (tab) {
      if (type == 'click') {
        if (event.which == 1) {
          self._activate(tab);
        }
        else if (event.which == 2) {
          self._remove(tab);
          preventDefault(event);
        }
      }
      else if (tab != self._hoveredTab) {
        unhover(self._hoveredTab);
        self._hoveredTab = tab;
        addClass(tab._element, '_hoveredTab');
      }
    }
  });

}

var proto = TabStrip.prototype;

proto._add = function (id) {
  var self = this;
  var tab = self._map[id];
  if (!tab) {
    tab = self._map[id] = new Tab(self, id);
    self._tabs.push(tab);
    self._totalWidth += tab._width;
    self._reindex(self._tabs.length - 1);
    self._resize();
    self._emit('_add', tab);
  }
  return tab;
};

proto._remove = function (id) {
  var self = this;
  var tab = self._map[id._id || id];
  if (tab) {
    var index = tab._index;
    self._tabs.splice(index, 1);
    delete self._map[tab._id];
    self._totalWidth -= tab._width;
    removeElement(tab._link);
    removeElement(tab._element);
    removeElement(tab._close);
    // TODO: Select the tab with the highest z-index?
    if (tab == self._activeTab) {
      self._deactivate(tab);
      var nextTab = self._tabs[0];
      if (nextTab) {
        self._activate(nextTab);
        trigger(nextTab._link, 'click');
      }
      else if (self == projectTabs) {
        var menu = getElement('_gold');
        trigger(menu, 'click');
      }
    }
    self._reindex(index);
    self._resize();
    self._emit('_remove', tab);
  }
  return tab;
};

proto._clear = function () {
  var self = this;
  self._tabs.length = 0;
  self._activeTab = 0;
};

proto._resize = function () {
  var self = this;
  var width = self._element.clientWidth - 60;
  self._tabScale = Math.min(1, width / self._totalWidth);
  self._draw();
};

proto._reindex = function (index) {
  var tabs = this._tabs;
  var length = tabs.length;
  for (index = index || 0; index < length; index++) {
    tabs[index]._index = index;
  }
  saveWorkspace();
};

proto._draw = function (index) {
  var self = this;
  var length = self._tabs.length;
  var left = 10;
  for (index = index || 0; index < length; index++) {
    var tab = self._tabs[index];
    var width = Math.round(tab._width * self._tabScale);
    tab._move(left, width);
    left += width;
  }
};

proto._activate = function (tab) {
  var self = this;
  var active = self._activeTab;
  if (tab != active) {
    self._deactivate();
    var element = tab._element;
    addClass(element, '_activeTab');
    self._activeTab = tab;
    tab._zOrder();
    self._draw();
    self._emit('_activate', tab);
  }
};

proto._deactivate = function () {
  var self = this;
  var tab = self._activeTab;
  self._activeTab = 0;
  if (tab) {
    var element = tab._element;
    removeClass(element, '_activeTab');
    tab._zOrder();
    self._emit('_deactivate', tab);
    self._draw();
  }
};

var tabStrips = [];
bind(window, 'resize', function () {
  forEach(tabStrips, function (strip) {
    strip._resize();
  });
});
