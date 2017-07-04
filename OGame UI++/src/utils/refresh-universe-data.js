var fn = function () {
  'use strict';

  window._refreshUniverseData = function _refreshUniverseData () {
    // refreshes the universe using the API once an hour
    if (window.config.lastPlayersUpdate && window.config.lastPlayersUpdate > Date.now() - 3600000) {
      return;
    }

    console.debug('Updating universe data...');
    window._loadUniverseApi(function (players, universe) {
      console.debug('Universe data updated.');
      window.config.players = players;
      window.config.universe = universe;
      window.config.lastPlayersUpdate = Date.now();
      window._saveConfig();
      console.debug('OGame UI++ add-on window.config :', window.config);
    });
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
