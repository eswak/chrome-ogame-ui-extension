'use strict';
// e.g. s192-fr.ogame.gameforge.com:100123
var configKey = [
  $('meta[name="ogame-universe"]').attr('content'),
  ':',
  $('meta[name="ogame-player-id"]').attr('content')
].join('');

// Save config : add a buffer timeout to prevent multiple writes
// at a few milliseconds of interval (this is because multiple
// scripts will try to call _saveConfig() after they parsed the
// information they are responsible for).
var saveConfigTimeout = null;
window._saveConfig = function saveConfigBuffered() {
  if (saveConfigTimeout) {
    clearTimeout(saveConfigTimeout);
  }

  saveConfigTimeout = setTimeout(actuallyDoSaveConfig, 100);
};
function actuallyDoSaveConfig() {
  window.config.lastUpdate = Date.now();
  var configToSave = JSON.parse(JSON.stringify(window.config));
  delete configToSave['players'];
  delete configToSave['history'];
  saveData(configKey, configToSave);
}

// Save players data (contains all planets)
window._savePlayers = function _savePlayers() {
  saveData(configKey + ':players', window.config.players);
};

// Save players score history (large dataset, grows over time)
window._saveHistory = function _savePlayers() {
  saveData(configKey + ':history', window.config.history);
};

// Get config as a consolidated object containing players & history
window._getConfigAsync = function getConfigAsync(cbConfig, cbPlayers, cbHistory) {
  getDataAsync([configKey], function (data) {
    var config = data[configKey] || {};
    config.universe = config.universe || {};
    config.labels = config.labels || {};
    config.lastPlayersUpdate = config.lastPlayersUpdate || 0;
    config.lastUpdate = config.lastUpdate || 0;
    config.inprog = config.inprog || 0;
    config.playerId = $('[name=ogame-player-id]').attr('content');
    cbConfig && cbConfig(config);

    // get players
    getDataAsync([configKey + ':players'], function (data) {
      var players = data[configKey + ':players'] || {};
      cbPlayers && cbPlayers(players);

      // get history
      getDataAsync([configKey + ':history'], function (data) {
        var history = data[configKey + ':history'] || {};
        cbHistory && cbHistory(history);
      });
    });
  });
};

// Generic functions : save & load data from local storage
function saveData(key, value) {
  var payload = JSON.stringify({ key, value });
  var evt = document.createEvent('CustomEvent');
  evt.initCustomEvent('UIPPSaveData', true, true, payload);
  document.dispatchEvent(evt);
}

function getDataAsync(keys, cb) {
  var listener = function (evt) {
    var data = JSON.parse(evt.detail);
    document.removeEventListener('UIPPGetDataResponse:' + keys.join(','), listener);
    cb(data);
  };
  document.addEventListener('UIPPGetDataResponse:' + keys.join(','), listener);

  var evt = document.createEvent('CustomEvent');
  evt.initCustomEvent('UIPPGetData', true, true, keys.join(','));
  document.dispatchEvent(evt);
}
