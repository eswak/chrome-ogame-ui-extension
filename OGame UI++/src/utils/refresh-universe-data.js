'use strict';
window._refreshUniverseData = function _refreshUniverseData() {
  // refreshes the universe using the API once an hour
  if (window.config.lastPlayersUpdate && window.config.lastPlayersUpdate > Date.now() - 3600000) {
    return;
  }

  console.debug('Updating universe data...');
  window._loadUniverseApi(function (players, universe, labels) {
    console.debug('Universe data updated.');
    window.config.players = players;
    window.config.universe = universe;
    window.config.labels = labels;
    window.config.lastPlayersUpdate = Date.now();
    window._saveConfig();
    console.debug('OGame UI++ add-on window.config :', window.config);
  });
};
