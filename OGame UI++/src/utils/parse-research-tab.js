var fn = function () {
  'use strict';

  window._parseResearchTab = function _parseResearchTab () {
    if (document.location.href.indexOf('research') === -1) {
      return;
    }

    window.config.combustionDrive = Number($('[ref=115] .level').text().match(/\d+/g)[0]);
    window.config.plasmaTech = Number($('[ref=122] .level').text().match(/\d+/g)[0]);
    window.config.astroTech = Number($('[ref=124] .level').text().match(/\d+/g)[0]);
    window.config.computerTech = Number($('[ref=108] .level').text().match(/\d+/g)[0]);

    window._saveConfig();
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
