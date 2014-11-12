function getHiddenData(selector) {
  var data = [];
  all(selector + ' s', function (element, index) {
    data[index] = getText(element);
  });
  return data;
}
