var fn = function () {
  'use strict';
  window._editNote = function _editNote(galaxy, system, position, text) {
    config.planetNotes = config.planetNotes || {};
    var key = galaxy + ':' + system + ':' + position;
    config.planetNotes[key] = text;
    _saveConfig(config);
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
