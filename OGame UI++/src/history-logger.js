var fn = function () {
  'use strict';
  window._logHistoryData = function _logHistoryData() {
    config.history = config.history || {};
    for (var playerId in config.players) {
      config.history[playerId] = config.history[playerId] || {};
      var dayString = new Date().toISOString().split('T')[0];
      config.history[playerId][dayString] = {
        t: Date.now(),
        e: Number(config.players[playerId].economyScore) || 0,
        m: Number(config.players[playerId].militaryScore) || 0,
        g: Number(config.players[playerId].globalScore) || 0,
        s: Number(config.players[playerId].ships) || 0,
        p: config.players[playerId].planets.length
      };

      // keep max. MAX_ENTRIES days of stats
      var historyEntryKeys = Object.keys(config.history[playerId]).sort();
      var MAX_ENTRIES = 7;
      if (historyEntryKeys.length > MAX_ENTRIES) {
        for (var i = 0; i < historyEntryKeys.length - MAX_ENTRIES; i++) {
          delete config.history[playerId][historyEntryKeys[i]];
        }
      }
    }

    _saveConfig(config);
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
