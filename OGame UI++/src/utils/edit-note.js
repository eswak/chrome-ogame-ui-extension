var fn = function () {
  'use strict';
  window._editNote = function _editNote (galaxy, system, position, text) {
    window.config.planetNotes = window.config.planetNotes || {};
    var key = galaxy + ':' + system + ':' + position;
    window.config.planetNotes[key] = text;
    window._saveConfig();
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
