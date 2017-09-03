var fn = function () {
  'use strict';
  var _cachedResources = null;

  window._getCurrentPlanetResources = function _getCurrentPlanetResources () {
    if (_cachedResources) {
      return _cachedResources;
    }

    var currentPlanetCoordinatesStr = '[' + window._getCurrentPlanetCoordinates().join(':') + ']';
    if ($('meta[name=ogame-planet-type]').attr('content') === 'moon') {
      currentPlanetCoordinatesStr += 'L';
    }

    var currentPlanet = window.config.my.planets[currentPlanetCoordinatesStr];
    var tradeRate = window.config.tradeRate;

    var resources = {
      lastUpdate: Date.now(),
      metal: {
        now: 0,
        max: 0,
        prod: 0,
        worth: (
          (Math.min(tradeRate[0], tradeRate[1], tradeRate[2]) / tradeRate[0]) *
          Math.max(tradeRate[0], tradeRate[1], tradeRate[2]) * 100
        ) / 100,
        level: (currentPlanet && currentPlanet.resources) ? currentPlanet.resources.metal.level : 0
      },
      crystal: {
        now: 0,
        max: 0,
        prod: 0,
        worth: (
          (Math.min(tradeRate[0], tradeRate[1], tradeRate[2]) / tradeRate[1]) *
          Math.max(tradeRate[0], tradeRate[1], tradeRate[2]) * 100
        ) / 100,
        level: (currentPlanet && currentPlanet.resources) ? currentPlanet.resources.crystal.level : 0
      },
      deuterium: {
        now: 0,
        max: 0,
        prod: 0,
        worth: (
          (Math.min(tradeRate[0], tradeRate[1], tradeRate[2]) / tradeRate[2]) *
          Math.max(tradeRate[0], tradeRate[1], tradeRate[2]) * 100
        ) / 100,
        level: (currentPlanet && currentPlanet.resources) ? currentPlanet.resources.deuterium.level : 0
      }
    };

    // parse resources data from the DOM and sets the resources object
    var f = window.initAjaxResourcebox.toString();
    f = f.replace('function initAjaxResourcebox(){reloadResources(', '');
    f = f.substring(0, f.length - 3);
    var data = JSON.parse(f);
    resources.metal.now = data.metal.resources.actual;
    resources.metal.max = data.metal.resources.max;
    resources.metal.prod = data.metal.resources.production;
    resources.crystal.now = data.crystal.resources.actual;
    resources.crystal.max = data.crystal.resources.max;
    resources.crystal.prod = data.crystal.resources.production;
    resources.deuterium.now = data.deuterium.resources.actual;
    resources.deuterium.max = data.deuterium.resources.max;
    resources.deuterium.prod = data.deuterium.resources.production;

    // if on the resources page, update the planet's resource levels
    if (document.location.search.indexOf('resources') !== -1) {
      // get mines level
      resources.metal.level = parseInt($('.supply1 .level')
        .text().replace($('.supply1 .level').children().text(), '').trim());
      resources.crystal.level = parseInt($('.supply2 .level')
        .text().replace($('.supply2 .level').children().text(), '').trim());
      resources.deuterium.level = parseInt($('.supply3 .level')
        .text().replace($('.supply3 .level').children().text(), '').trim());
    }

    window.config.my.planets[currentPlanetCoordinatesStr].resources = resources;
    window._saveConfig();

    _cachedResources = resources;
    return resources;
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
