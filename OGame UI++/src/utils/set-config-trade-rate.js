'use strict';
window._setConfigTradeRate = function _setConfigTradeRate() {
  window.config.tradeRate = window.config.tradeRate || [2.0, 1.5, 1.0];
  window._saveConfig();
};
