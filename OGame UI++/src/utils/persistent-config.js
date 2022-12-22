'use strict';
window._getConfigAsync = getConfigAsync;
window._saveConfig = saveConfigBuffer;

// e.g. s192-fr.ogame.gameforge.com:100123
var configKey = [
  $('meta[name="ogame-universe"]').attr('content'),
  ':',
  $('meta[name="ogame-player-id"]').attr('content')
].join('');

var saveConfigTimeout = null;
function saveConfigBuffer() {
  if (saveConfigTimeout) {
    clearTimeout(saveConfigTimeout);
  }

  saveConfigTimeout = setTimeout(saveConfig, 10);
}

function saveConfig() {
  var payload = JSON.stringify({
    key: configKey,
    value: window.config
  });
  var evt = document.createEvent('CustomEvent');
  evt.initCustomEvent("UIPPSaveConfig", true, true, payload);
  document.dispatchEvent(evt);
}

function getConfigAsync(cb) {
  var listener = function (evt) {
    var config = JSON.parse(evt.detail);
    document.removeEventListener('UIPPGetConfigResponse', listener);
    cb(config);
  };
  document.addEventListener('UIPPGetConfigResponse', listener);

  // get config
  var evt = document.createEvent('CustomEvent');
  evt.initCustomEvent("UIPPGetConfig", true, true, configKey);
  document.dispatchEvent(evt);
}
