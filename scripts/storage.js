// TODO: Move to Jymin.var storage = window.localStorage;var fetch = function (key) {  return parse(storage.getItem(key) || '');};var store = function (key, value) {  storage.setItem(key, stringify(value));};