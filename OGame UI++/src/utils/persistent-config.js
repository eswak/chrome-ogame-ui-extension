var fn = function () {
  'use strict';
  window._getConfig = getConfig;
  window._saveConfig = saveConfig;
  window._resetConfig = resetConfig;
  var playerId = $('[name=ogame-player-id]').attr('content');

  // window.config used to be stored in 'og-enhancements',
  // now it is stored in 'og-enhancement-1003000' (playerId)
  var configKey = 'og-enhancements';
  var oldConfig = localStorage.getItem(configKey);
  if (oldConfig) {
    localStorage.removeItem(configKey);
    localStorage.setItem(configKey + '-' + playerId, oldConfig);
  }

  // remove backups and undefined configs for more free space
  var patt = new RegExp(configKey + '-' + '\\d+$');
  for (var key in localStorage) {
    if (key.indexOf(configKey) === 0 && !patt.test(key)) {
      window.console.log('OGame UI++ : removing \'' + key + '\' from localStorage');
      localStorage.removeItem(key);
    }
  }

  configKey += '-' + playerId;

  function saveConfig () {
    localStorage.setItem(configKey, JSON.stringify(window.config));
  }

  function getConfig () {
    return JSON.parse(localStorage.getItem(configKey) || '{}');
  }

  function resetConfig () {
    localStorage.setItem(configKey, '{}');
    window.config = {};
  }
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
