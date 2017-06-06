var fn = function () {
  'use strict';
  window._setConfigTradeRate = function _setConfigTradeRate() {
    config.tradeRate = config.tradeRate || [2.0, 1.5, 1.0];
    _saveConfig(config);
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
