'use strict';
window._refreshUniverseData = function _refreshUniverseData(forceRefresh) {
  // refreshes the universe using the API once an hour
  if (window.config.lastPlayersUpdate && window.config.lastPlayersUpdate > Date.now() - 3600000 && !forceRefresh) {
    return;
  }

  console.debug('Updating universe data...');
  window._loadUniverseApi(function (players, universe, labels) {
    console.debug('Universe data updated.');
    window.config.players = players;
    window.config.universe = universe;
    window.config.labels = labels;
    window.config.lastPlayersUpdate = Date.now();
    console.debug('Fetch empire data...');
    window.uipp_parseEmpireData(true, function () {
      console.debug('Empire data fetched.');
      window._parseAndUpdateHistoryData();
      window._saveConfig();
      window._savePlayers();
      window._saveHistory();
    });
  });
};

window._parseAndUpdateHistoryData = function _parseAndUpdateHistoryData() {
  window.config.history = window.config.history || {};
  for (var playerId in window.config.players) {
    window.config.history[playerId] = window.config.history[playerId] || {};
    var dayString = new Date().toISOString().split('T')[0];
    window.config.history[playerId][dayString] = {
      t: Date.now(),
      e: Number(window.config.players[playerId].economyScore) || 0,
      ep: Number(window.config.players[playerId].economyPosition) || 0,
      m: Number(window.config.players[playerId].militaryScore) || 0,
      mp: Number(window.config.players[playerId].militaryPosition) || 0,
      h: Number(window.config.players[playerId].honorScore) || 0,
      hp: Number(window.config.players[playerId].honorPosition) || 0,
      r: Number(window.config.players[playerId].researchScore) || 0,
      rp: Number(window.config.players[playerId].researchPosition) || 0,
      g: Number(window.config.players[playerId].globalScore) || 0,
      gp: Number(window.config.players[playerId].globalPosition) || 0,
      s: Number(window.config.players[playerId].ships) || 0,
      p: window.config.players[playerId].planets.length
    };

    // keep max. MAX_ENTRIES days of stats
    // keep all for current player
    var MAX_ENTRIES = 30;
    if (playerId === $('[name=ogame-player-id]').attr('content')) {
      continue;
    }
    var historyEntryKeys = Object.keys(window.config.history[playerId]).sort();
    if (historyEntryKeys.length > MAX_ENTRIES) {
      for (var i = 0; i < historyEntryKeys.length - MAX_ENTRIES; i++) {
        delete window.config.history[playerId][historyEntryKeys[i]];
      }
    }
  }

  // purge deleted players from history
  for (var historyPlayerId in window.config.history) {
    if (!window.config.players[historyPlayerId]) {
      delete window.config.history[historyPlayerId];
    }
  }
};
