'use strict';
window._addInprogParser = function _addInprogParser() {
  var inprog = {
    metal: $('.metalMine .countdown').text(),
    crystal: $('.crystalMine .countdown').text(),
    deuterium: $('.deuteriumSynthesizer .countdown').text(),
    plasma: $('.plasmaTechnology .countdown').text(),
    astro: $('.astrophysicsTechnology .countdown').text()
  };

  var currentPlanetCoordinatesStr = '[' + window._getCurrentPlanetCoordinates().join(':') + ']';
  var currentPlanet = window.config.my.planets[currentPlanetCoordinatesStr];
  if (!currentPlanet) {
    return;
  }

  window.config.inprog = window.config.inprog || {};

  if (document.location.href.indexOf('supplies') !== -1) {
    ['metal', 'crystal', 'deuterium'].forEach(function (resource) {
      delete window.config.inprog[currentPlanetCoordinatesStr + '-' + resource];
      if (inprog[resource]) {
        window.config.inprog[currentPlanetCoordinatesStr + '-' + resource] = window._gfTimeToTimestamp(
          inprog[resource]
        );
      }
    });
  }

  if (document.location.href.indexOf('research') !== -1) {
    delete window.config.inprog.plasma;
    delete window.config.inprog.astro;

    if (inprog.plasma) {
      window.config.inprog.plasma = window._gfTimeToTimestamp(inprog.plasma);
    }

    if (inprog.astro) {
      window.config.inprog.astro = window._gfTimeToTimestamp(inprog.astro);
    }
  }

  for (var key in window.config.inprog) {
    if (window.config.inprog[key] < Date.now()) {
      delete window.config.inprog[key];
    }
  }

  window._saveConfig();
};
