var proto = Object.prototype;

Object.defineProperty(proto, 'define', {
  writable: true,
  enumerable: false,
  value: function (name, value, options) {
    options = options || {enumerable: false};
    options.value = value;
    Object.defineProperty(this, name, options);
  }
});
