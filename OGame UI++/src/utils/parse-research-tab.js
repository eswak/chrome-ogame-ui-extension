var fn = function () {
  'use strict';

  window._parseResearchTab = function _parseResearchTab () {
    window.config.isMiner = $('#characterclass .miner').length ? true : false;

    if (document.location.href.indexOf('research') === -1) {
      return;
    }

    window.config.combustionDrive = Number($('.combustionDriveTechnology.small .level').text().match(/\d+/g)[0]);
    window.config.impulseDrive = Number($('.impulseDriveTechnology.small .level').text().match(/\d+/g)[0]);
    window.config.hyperspaceDrive = Number($('.hyperspaceDriveTechnology.small .level').text().match(/\d+/g)[0]);
    window.config.plasmaTech = Number($('.plasmaTechnology.small .level').text().match(/\d+/g)[0]);
    window.config.astroTech = Number($('.astrophysicsTechnology.small .level').text().match(/\d+/g)[0]);
    window.config.computerTech = Number($('.computerTechnology.small .level').text().match(/\d+/g)[0]);
    window.config.hyperspaceTech = Number($('.hyperspaceTechnology.small .level').text().match(/\d+/g)[0]);

    window._saveConfig();
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
