'use strict';
window._getRentabilityTime = function _getRentabilityTime(type, currentProd, level, targetLevel, averageTemp, coords) {
  var currentHourlyProd = currentProd * 3600;
  var rentabilityTime = 0;
  var worth = window.uipp_getResourcesWorth();
  targetLevel = targetLevel || level + 1;

  switch (type) {
    // mines
    case 'metal':
    case 'crystal':
    case 'deuterium':
      var calculatedProduction = window.uipp_getProduction(type, level, averageTemp, coords);
      var ratio = currentHourlyProd / calculatedProduction; // used for boosts, deuterium temperature, etc
      var calculatedNextLevelproduction = window.uipp_getProduction(type, targetLevel, averageTemp, coords) * ratio;
      var calculatedCurrentLevelproduction =
        window.uipp_getProduction(type, targetLevel - 1, averageTemp, coords) * ratio;
      var productionDiff = calculatedNextLevelproduction - calculatedCurrentLevelproduction;
      var productionDiffWorth = productionDiff * worth[type];
      var costs = window.uipp_getCost(type, targetLevel - 1);
      var productionCostWorth = costs[0] * worth.metal + costs[1] * worth.crystal;
      rentabilityTime = (productionCostWorth / productionDiffWorth) * 3600; // in seconds
      break;
    // local production booster buildings
    case 'lfbuildrock6':
    case 'lfbuildrock9':
    case 'lfbuildrock10':
    case 'lfbuildhuma6':
    case 'lfbuildhuma8':
    case 'lfbuildmech10':
      var multipliers = {
        lfbuildrock6: [1.02, 1.0, 1.0],
        lfbuildrock9: [1.0, 1.02, 1.0],
        lfbuildrock10: [1.0, 1.0, 1.02],
        lfbuildhuma6: [1.015, 1.0, 1.0],
        lfbuildhuma8: [1.0, 1.015, 1.01],
        lfbuildmech10: [1.0, 1.0, 1.02]
      };
      var resources = window._getCurrentPlanetResources();
      var currentProdWorth = 0;
      currentProdWorth += resources.metal.prod * worth.metal;
      currentProdWorth += resources.crystal.prod * worth.crystal;
      currentProdWorth += resources.deuterium.prod * worth.deuterium;
      var nextLevelProdWorth = 0;
      nextLevelProdWorth += resources.metal.prod * worth.metal * multipliers[type][0];
      nextLevelProdWorth += resources.crystal.prod * worth.crystal * multipliers[type][1];
      nextLevelProdWorth += resources.deuterium.prod * worth.deuterium * multipliers[type][2];

      var techCosts = window.uipp_getCost(type, targetLevel - 1);
      var techCostsWorth = techCosts[0] * worth.metal + techCosts[1] * worth.crystal + techCosts[2] * worth.deuterium;
      rentabilityTime = techCostsWorth / (nextLevelProdWorth - currentProdWorth);
      break;
    // global production booster researches
    case 'plasma':
    case 'lftechmech1':
    case 'lftechhuma2':
    case 'lftechrock2':
    case 'lftechkael2':
    case 'lftechrock3':
    case 'lftechrock5':
    case 'lftechmech6':
    case 'lftechrock7':
    case 'lftechhuma8':
    case 'lftechrock10':
    case 'lftechrock11':
    case 'lftechrock12':
    case 'lftechkael12':
    case 'lftechmech13':
      var multipliers = {
        plasma: [1.01, 1.0066, 1.0033],
        lftechmech1: [1.0, 1.0, 1.0008],
        lftechhuma2: [1.0006, 1.0006, 1.0006],
        lftechrock2: [1.0, 1.0008, 1.0],
        lftechkael2: [1.0, 1.0, 1.0008],
        lftechrock3: [1.0, 1.0, 1.0008],
        lftechrock5: [1.0008, 1.0008, 1.0008],
        lftechmech6: [1.0006, 1.0006, 1.0006],
        lftechrock7: [1.0008, 1.0, 1.0],
        lftechhuma8: [1.0006, 1.0006, 1.0006],
        lftechrock10: [1.0008, 1.0, 1.0],
        lftechrock11: [1.0, 1.0008, 1.0],
        lftechrock12: [1.0, 1.0, 1.0008],
        lftechkael12: [1.0006, 1.0006, 1.0006],
        lftechmech13: [1.0006, 1.0006, 1.0006]
      };
      var currentGlobalProdWorth = 0;
      var nextLevelGlobalProdWorth = 0;
      for (var coords in window.config.my.planets) {
        var planet = window.config.my.planets[coords];
        if (planet.resources) {
          currentGlobalProdWorth +=
            planet.resources.metal.prod * worth.metal +
            planet.resources.crystal.prod * worth.crystal +
            planet.resources.deuterium.prod * worth.deuterium;
          nextLevelGlobalProdWorth +=
            planet.resources.metal.prod * worth.metal * multipliers[type][0] +
            planet.resources.crystal.prod * worth.crystal * multipliers[type][1] +
            planet.resources.deuterium.prod * worth.deuterium * multipliers[type][2];
        }
      }

      var techCosts = window.uipp_getCost(type, targetLevel - 1);
      var techCostsWorth = techCosts[0] * worth.metal + techCosts[1] * worth.crystal + techCosts[2] * worth.deuterium;
      rentabilityTime = techCostsWorth / (nextLevelGlobalProdWorth - currentGlobalProdWorth);
      break;

    // todo:
    // lifeformTech12213 (rock tech 13): crawler boost
    // lifeformTech12218 (rock tech 18): collector class boost
    // for these, add formula for cost in src/utils/formulas.js, and
    // add DOM insertion in src/costs-helper.js
  }
  return Math.floor(rentabilityTime);
};
