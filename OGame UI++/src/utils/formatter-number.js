var fn = function () {
  'use strict';
  window._num = function _num(n) {
    // ogame number formatter
    return window.gfNumberGetHumanReadable(n, true, 3);
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
