var fn = function () {
  'use strict';
  window._getRentabilityTime = function _getRentabilityTime (type, currentProd, level) {
    var currentHourlyProd = currentProd * 3600;
    var rentabilityTime = 0;
    var worth = window.uipp_getResourcesWorth();

    switch(type) {
    case 'metal':
    case 'crystal':
    case 'deuterium':
      var calculatedProduction = window.uipp_getProduction(type, level);
      var ratio = currentHourlyProd / calculatedProduction; // used for boosts, deuterium temperature, etc
      var calculatedNextLevelproduction = window.uipp_getProduction(type, level + 1) * ratio;
      var productionDiff = calculatedNextLevelproduction - currentHourlyProd;
      var productionDiffWorth = productionDiff * worth[type];
      var costs = window.uipp_getCost(type, level);
      var productionCostWorth = costs[0] * worth.metal + costs[1] * worth.crystal;
      rentabilityTime = (productionCostWorth / productionDiffWorth) * 3600; // in seconds
      break;
    case 'plasma':
      var currentGlobalProdWorth = 0;
      var nextLevelGlobalProdWorth = 0;
      for (var coords in window.config.my.planets) {
        var planet = window.config.my.planets[coords];
        if (planet.resources) {
          currentGlobalProdWorth += planet.resources.metal.prod * worth.metal +
            planet.resources.crystal.prod * worth.crystal +
            planet.resources.deuterium.prod * worth.deuterium;
          nextLevelGlobalProdWorth += planet.resources.metal.prod * worth.metal * 1.01 +
            planet.resources.crystal.prod * worth.crystal * 1.0066 +
            planet.resources.deuterium.prod * worth.deuterium * 1.0033;
        }
      }

      var plasmaCosts = window.uipp_getCost('plasma', level);
      var plasmaCostsWorth = plasmaCosts[0] * worth.metal +
        plasmaCosts[1] * worth.crystal +
        plasmaCosts[2] * worth.deuterium;
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
