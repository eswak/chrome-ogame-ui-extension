var fn = function () {
  'use strict';
  window._getRentabilityTime = function _getRentabilityTime (type, currentProd, level) {
    var currentHourlyProd = currentProd * 3600;
    var resources = window._getCurrentPlanetResources();
    var rentabilityTime = 0;

    switch(type) {
    case 'metal':
    case 'crystal':
    case 'deuterium':
      var calculatedProduction = window.uipp_getProduction(type, level);
      var ratio = currentHourlyProd / calculatedProduction; // used for boosts, deuterium temperature, etc
      var calculatedNextLevelproduction = window.uipp_getProduction(type, level + 1) * ratio;
      var productionDiff = calculatedNextLevelproduction - currentHourlyProd;
      var productionDiffWorth = productionDiff * resources[type].worth;
      var costs = window.uipp_getCost(type, level);
      var productionCostWorth = costs[0] * resources.metal.worth + costs[1] * resources.crystal.worth;
      rentabilityTime = (productionCostWorth / productionDiffWorth) * 3600; // in seconds
      break;
    case 'plasma':
      var currentGlobalProdWorth = 0;
      var nextLevelGlobalProdWorth = 0;
      for (var coords in window.config.my.planets) {
        var planet = window.config.my.planets[coords];
        currentGlobalProdWorth += planet.resources.metal.prod * resources.metal.worth +
          planet.resources.crystal.prod * resources.crystal.worth +
          planet.resources.deuterium.prod * resources.deuterium.worth;
        nextLevelGlobalProdWorth += planet.resources.metal.prod * resources.metal.worth * 1.01 +
          planet.resources.crystal.prod * resources.crystal.worth * 1.0066 +
          planet.resources.deuterium.prod * resources.deuterium.worth * 1.0033;
      }

      var plasmaCosts = window.uipp_getCost('plasma', level);
      var plasmaCostsWorth = plasmaCosts[0] * resources.metal.worth +
        plasmaCosts[1] * resources.crystal.worth +
        plasmaCosts[2] * resources.deuterium.worth;
      rentabilityTime = plasmaCostsWorth / (nextLevelGlobalProdWorth - currentGlobalProdWorth);
      break;
    }

    return Math.floor(rentabilityTime);
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
