'use strict';
window._getConfigAsync = getConfigAsync;
window._saveConfig = saveConfigBuffer;

var saveConfigTimeout = null;
function saveConfigBuffer() {
  if (saveConfigTimeout) {
    clearTimeout(saveConfigTimeout);
  }

  saveConfigTimeout = setTimeout(saveConfig, 10);
}

function saveConfig() {
  var configStr = JSON.stringify(window.config);
  var evt = document.createEvent('CustomEvent');
  evt.initCustomEvent("UIPPSaveConfig", true, true, configStr);
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
  evt.initCustomEvent("UIPPGetConfig", true, true);
  document.dispatchEvent(evt);
}
