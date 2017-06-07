var fn = function () {
  'use strict';
  window._num = function _num(n, increment) {
    // ogame number formatter
    if (!increment) {
      return window.gfNumberGetHumanReadable(n, true, 3);
    }

    var id = Math.random().toString(36).replace('.', '');
    var start = Date.now();
    var interval = setInterval(function () {
      var $el = $('#number-' + id);
      if (!$el) {
        clearInterval(interval);
        return;
      }

      var secondsSinceDisplay = Math.floor((Date.now() - start) / 1000);
      $el.text(window.gfNumberGetHumanReadable(n + secondsSinceDisplay * increment, true, 3));
    }, 100);

    return '<span id="number-' + id + '"></span>';
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
