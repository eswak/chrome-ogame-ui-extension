var fn = function () {
  'use strict';
  window._getConfig = getConfig;
  window._saveConfig = saveConfig;
  window._resetConfig = resetConfig;

  function saveConfig(config) {
    if (typeof (Storage) !== 'undefined') {
      localStorage.setItem('og-enhancements', JSON.stringify(config));
    }
  }

  function getConfig() {
    if (typeof (Storage) !== 'undefined') {
      return JSON.parse(localStorage.getItem('og-enhancements') || '{}');
    } else {
      return null;
    }
  }

  function resetConfig() {
    if (typeof (Storage) !== 'undefined') {
      localStorage.setItem('og-enhancements', '{}');
      config = {};
    }
  }
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
