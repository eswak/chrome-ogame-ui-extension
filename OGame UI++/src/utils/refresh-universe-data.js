var fn = function () {
  'use strict';
  window._refreshUniverseData = function _refreshUniverseData() {
    // refreshes the universe using the API once an hour
    if (config.lastPlayersUpdate && config.lastPlayersUpdate > Date.now() - 3600000) {
      return;
    }

    console.debug('Updating universe data...');
    _loadUniverseApi(function (players, universe) {
      console.debug('Universe data updated.');
      config.players = players;
	  config.universe = universe;
      config.lastPlayersUpdate = Date.now();
      _saveConfig(config);
      console.debug('OGame UI++ add-on config :', config);
    });
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
