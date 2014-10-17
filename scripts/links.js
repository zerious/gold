onReady(function () {

  all('a', function (a) {
    if (!startsWith(a.href, location.protocol + '//' + location.host + '/')) {
      setAttribute(a, 'target', '_blank');
    }
  });

});