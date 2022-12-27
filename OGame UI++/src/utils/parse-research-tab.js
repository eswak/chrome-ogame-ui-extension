'use strict';

window._parseResearchTab = function _parseResearchTab() {
  if (document.location.href.indexOf('research') === -1) {
    return;
  }
  if (document.location.href.indexOf('lfresearch') !== -1) {
    return;
  }

  window.config.combustionDrive = Number($('.combustionDriveTechnology.small .level').text().match(/\d+/g)[0]);
  window.config.impulseDrive = Number($('.impulseDriveTechnology.small .level').text().match(/\d+/g)[0]);
  window.config.hyperspaceDrive = Number($('.hyperspaceDriveTechnology.small .level').text().match(/\d+/g)[0]);
  window.config.plasmaTech = Number($('.plasmaTechnology.small .level').text().match(/\d+/g)[0]);
  window.config.astroTech = Number($('.astrophysicsTechnology.small .level').text().match(/\d+/g)[0]);
  window.config.computerTech = Number($('.computerTechnology.small .level').text().match(/\d+/g)[0]);
  window.config.hyperspaceTech = Number($('.hyperspaceTechnology.small .level').text().match(/\d+/g)[0]);
  window.config.energyTech = Number($('.energyTechnology.small .level').text().match(/\d+/g)[0]);
  window.config.espionageTech = Number($('.espionageTechnology.small .level').text().match(/\d+/g)[0]);
  window.config.laserTech = Number($('.laserTechnology.small .level').text().match(/\d+/g)[0]);
  window.config.ionTech = Number($('.ionTechnology.small .level').text().match(/\d+/g)[0]);

  window._saveConfig();
};
