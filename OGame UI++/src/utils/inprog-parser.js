var fn = function () {
  'use strict';
  window._addInprogParser = function _addInprogParser () {
    var inprog = {
      metal: $('.supply1 .time').text(),
      crystal: $('.supply2 .time').text(),
      deuterium: $('.supply3 .time').text(),
      plasma: $('.research122 .time').text(),
      astro: $('.research124 .time').text()
    };

    var currentPlanetCoordinatesStr = '[' + window._getCurrentPlanetCoordinates().join(':') + ']';
    var currentPlanet = window.config.my.planets[currentPlanetCoordinatesStr];
    if (!currentPlanet) {
      return;
    }

    window.config.inprog = window.config.inprog || {};

    if (document.location.href.indexOf('resources') !== -1) {
      ['metal', 'crystal', 'deuterium'].forEach(function (resource) {
        delete window.config.inprog[currentPlanetCoordinatesStr + '-' + resource];
        if (inprog[resource]) {
          window.config.inprog[currentPlanetCoordinatesStr + '-' + resource] = window._gfTimeToTimestamp(inprog[resource]);
        }
      });
    }

    if (document.location.href.indexOf('research') !== -1) {
      delete window.config.inprog.plasma;
      delete window.config.inprog.astro

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
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
