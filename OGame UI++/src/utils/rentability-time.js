var fn = function () {
  'use strict';
  window._getRentabilityTime = function _getRentabilityTime(type, currentProd, level) {
    var resources = _getCurrentPlanetResources();
    var rentabilityTime = 0;

    if (type === 'metal') {
      var calculatedProduction = 30 * level * Math.pow(1.1, level) + 30;
      var ratio = currentProd * 3600 / calculatedProduction;
      var calculatedNextLevelproduction = ratio * 30 * (level + 1) * Math.pow(1.1, level + 1) + 30;
      var productionDiff = calculatedNextLevelproduction / 3600 - currentProd;
      var metalCost = 60 * Math.pow(1.5, level);
      var crystalCost = 15 * Math.pow(1.5, level);
      var convertedProductionCost = metalCost * 1.0 + crystalCost * (resources.crystal.worth / resources.metal.worth);
      rentabilityTime = convertedProductionCost / productionDiff;
    } else if (type === 'crystal') {
      var calculatedProduction = 20 * level * Math.pow(1.1, level) + 15;
      var ratio = currentProd * 3600 / calculatedProduction;
      var calculatedNextLevelproduction = ratio * 20 * (level + 1) * Math.pow(1.1, level + 1) + 15;
      var productionDiff = calculatedNextLevelproduction / 3600 - currentProd;
      var metalCost = 48 * Math.pow(1.6, level);
      var crystalCost = 24 * Math.pow(1.6, level);
      var convertedProductionCost = metalCost * (resources.metal.worth / resources.crystal.worth) + crystalCost * 1.0;
      rentabilityTime = convertedProductionCost / productionDiff;
    } else if (type === 'deuterium') {
      var calculatedProduction = 10 * level * Math.pow(1.1, level);
      var ratio = currentProd * 3600 / calculatedProduction;
      var calculatedNextLevelproduction = ratio * 10 * (level + 1) * Math.pow(1.1, level + 1);
      var productionDiff = calculatedNextLevelproduction / 3600 - currentProd;
      var metalCost = 225 * Math.pow(1.5, level);
      var crystalCost = 75 * Math.pow(1.5, level);
      var convertedProductionCost = metalCost * (resources.metal.worth / resources.deuterium.worth) + crystalCost * (resources.crystal.worth / resources.deuterium.worth);
      rentabilityTime = convertedProductionCost / productionDiff;
    } else if (type === 'plasma') {
      var currentProd = 0;
      var nextLevelProd = 0;
      for (var coords in config.my.planets) {
        var planet = config.my.planets[coords];
        currentProd += planet.resources.metal.prod * planet.resources.metal.worth + planet.resources.crystal.prod * planet.resources.crystal.worth + planet.resources.deuterium.prod * planet.resources.deuterium.worth;
        nextLevelProd += planet.resources.metal.prod * planet.resources.metal.worth * 1.01 + planet.resources.crystal.prod * planet.resources.crystal.worth * 1.0066 + planet.resources.deuterium.prod * planet.resources.deuterium.worth * 1.0033;
      }

      var prodDiff = nextLevelProd - currentProd;
      var metalCost = 2000 * Math.pow(2, level);
      var crystalCost = 4000 * Math.pow(2, level);
      var deuteriumCost = 1000 * Math.pow(2, level);
      var totalPrice = metalCost * resources.metal.worth + crystalCost * resources.crystal.worth + deuteriumCost * resources.deuterium.worth;
      rentabilityTime = totalPrice / prodDiff;
    }

    return Math.floor(rentabilityTime);
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
