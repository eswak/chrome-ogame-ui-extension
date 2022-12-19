'use strict';
var _cachedResources = null;

window._getCurrentPlanetResources = function _getCurrentPlanetResources() {
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
      worth:
        ((Math.min(tradeRate[0], tradeRate[1], tradeRate[2]) / tradeRate[0]) *
          Math.max(tradeRate[0], tradeRate[1], tradeRate[2]) *
          100) /
        100,
      level: currentPlanet && currentPlanet.resources ? currentPlanet.resources.metal.level : 0
    },
    crystal: {
      now: 0,
      max: 0,
      prod: 0,
      worth:
        ((Math.min(tradeRate[0], tradeRate[1], tradeRate[2]) / tradeRate[1]) *
          Math.max(tradeRate[0], tradeRate[1], tradeRate[2]) *
          100) /
        100,
      level: currentPlanet && currentPlanet.resources ? currentPlanet.resources.crystal.level : 0
    },
    deuterium: {
      now: 0,
      max: 0,
      prod: 0,
      worth:
        ((Math.min(tradeRate[0], tradeRate[1], tradeRate[2]) / tradeRate[2]) *
          Math.max(tradeRate[0], tradeRate[1], tradeRate[2]) *
          100) /
        100,
      level: currentPlanet && currentPlanet.resources ? currentPlanet.resources.deuterium.level : 0
    }
  };

  // parse resources data from the DOM and sets the resources object
  resources.metal.now = window.resourcesBar.resources.metal.amount;
  resources.metal.max = window.resourcesBar.resources.metal.storage;
  var metalProd =
    window._gfNumberToJsNumber(
      window.resourcesBar.resources.metal.tooltip.split('<td>')[3].split('>')[1].split('<')[0]
    ) / 3600;
  if (
    metalProd === 0 &&
    config.my.planets[currentPlanetCoordinatesStr].resources &&
    config.my.planets[currentPlanetCoordinatesStr].resources.metal.prod
  ) {
    // production may be 0 because of full storage, if so, keep old value
    metalProd = config.my.planets[currentPlanetCoordinatesStr].resources.metal.prod;
  }
  resources.metal.prod = metalProd;

  resources.crystal.now = window.resourcesBar.resources.crystal.amount;
  resources.crystal.max = window.resourcesBar.resources.crystal.storage;
  var crystalProd =
    window._gfNumberToJsNumber(
      window.resourcesBar.resources.crystal.tooltip.split('<td>')[3].split('>')[1].split('<')[0]
    ) / 3600;
  if (
    crystalProd === 0 &&
    config.my.planets[currentPlanetCoordinatesStr].resources &&
    config.my.planets[currentPlanetCoordinatesStr].resources.crystal.prod
  ) {
    // production may be 0 because of full storage, if so, keep old value
    crystalProd = config.my.planets[currentPlanetCoordinatesStr].resources.crystal.prod;
  }
  resources.crystal.prod = crystalProd;

  resources.deuterium.now = window.resourcesBar.resources.deuterium.amount;
  resources.deuterium.max = window.resourcesBar.resources.deuterium.storage;
  var deutProd =
    window._gfNumberToJsNumber(
      window.resourcesBar.resources.deuterium.tooltip.split('<td>')[3].split('>')[1].split('<')[0]
    ) / 3600;
  if (
    deutProd === 0 &&
    config.my.planets[currentPlanetCoordinatesStr].resources &&
    config.my.planets[currentPlanetCoordinatesStr].resources.deuterium.prod
  ) {
    // production may be 0 because of full storage, if so, keep old value
    deutProd = config.my.planets[currentPlanetCoordinatesStr].resources.deuterium.prod;
  }
  resources.deuterium.prod = deutProd;

  // if on the resources page, update the planet's resource levels
  if (document.location.search.indexOf('supplies') !== -1) {
    // get mines level
    resources.metal.level = parseInt($('.metalMine .level').text());
    resources.crystal.level = parseInt($('.crystalMine .level').text());
    resources.deuterium.level = parseInt($('.deuteriumSynthesizer .level').text());
  }

  window.config.my.planets[currentPlanetCoordinatesStr].resources = resources;
  window._saveConfig();

  _cachedResources = resources;
  return resources;
};
