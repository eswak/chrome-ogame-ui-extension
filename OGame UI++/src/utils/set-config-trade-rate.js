var fn = function () {
  'use strict';
  window._setConfigTradeRate = function _setConfigTradeRate () {
    window.config.tradeRate = window.config.tradeRate || [2.0, 1.5, 1.0];
    window._saveConfig();
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
