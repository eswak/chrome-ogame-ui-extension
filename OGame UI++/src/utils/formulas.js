'use strict';

window.uipp_getDistance = function (c1, c2) {
  function distance(a, b, dim) {
    var d1 = a - b >= 1 ? a - b : a - b + dim;
    var d2 = b - a >= 1 ? b - a : b - a + dim;
    return Math.min(d1, d2);
  }

  /* Universe dimensions */
  var galaxies = parseInt(window.config.universe.galaxies);
  var systems = parseInt(window.config.universe.systems);

  if (c1[0] !== c2[0]) {
    return 20000 * distance(c1[0], c2[0], galaxies);
  } else if (c1[1] !== c2[1]) {
    return 2700 + 95 * distance(c1[1], c2[1], systems);
  } else {
    return 1000 + 5 * Math.abs(c1[2] - c2[2]);
  }
};

window.uipp_getFlightTime = function (speed, distance) {
  return (10 + 3500 * Math.sqrt((10 * distance) / speed)) / Number(window.config.universe.speedFleetWar);
};

window.uipp_getCost = uipp_getCost;
window.uipp_getCummulativeCost = uipp_getCummulativeCost;

var costsFunctions = {
  shipyard: function (level) {
    return [400 * Math.pow(2, level), 200 * Math.pow(2, level), 100 * Math.pow(2, level)];
  },
  researchlab: function (level) {
    return [200 * Math.pow(2, level), 400 * Math.pow(2, level), 200 * Math.pow(2, level)];
  },
  astrophysics: function (level) {
    return [4000 * Math.pow(1.75, level), 8000 * Math.pow(1.75, level), 4000 * Math.pow(1.75, level)];
  },
  energy: function (level) {
    return [0, 800 * Math.pow(2, level), 400 * Math.pow(2, level)];
  },
  laser: function (level) {
    return [200 * Math.pow(2, level), 100 * Math.pow(2, level), 0];
  },
  ion: function (level) {
    return [1000 * Math.pow(2, level), 300 * Math.pow(2, level), 100 * Math.pow(2, level)];
  },
  plasma: function (level) {
    return [2000 * Math.pow(2, level), 4000 * Math.pow(2, level), 1000 * Math.pow(2, level)];
  },
  metal: function (level) {
    return [60 * Math.pow(1.5, level), 15 * Math.pow(1.5, level), 0];
  },
  crystal: function (level) {
    return [48 * Math.pow(1.6, level), 24 * Math.pow(1.6, level), 0];
  },
  deuterium: function (level) {
    return [225 * Math.pow(1.5, level), 75 * Math.pow(1.5, level), 0];
  },
  solarplant: function (level) {
    return [75 * Math.pow(1.5, level), 30 * Math.pow(1.5, level), 0];
  },
  lfbuildrock6: function (level) {
    return [
      10000 * Math.pow(1.4, level) * (level + 1),
      8000 * Math.pow(1.4, level) * (level + 1),
      1000 * Math.pow(1.4, level) * (level + 1)
    ];
  },
  lfbuildrock9: function (level) {
    return [
      85000 * Math.pow(1.4, level) * (level + 1),
      44000 * Math.pow(1.4, level) * (level + 1),
      25000 * Math.pow(1.4, level) * (level + 1)
    ];
  },
  lfbuildrock10: function (level) {
    return [
      120000 * Math.pow(1.4, level) * (level + 1),
      50000 * Math.pow(1.4, level) * (level + 1),
      20000 * Math.pow(1.4, level) * (level + 1)
    ];
  },
  lfbuildhuma6: function (level) {
    return [
      9000 * Math.pow(1.5, level) * (level + 1),
      6000 * Math.pow(1.5, level) * (level + 1),
      3000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lfbuildhuma8: function (level) {
    return [
      50000 * Math.pow(1.5, level) * (level + 1),
      25000 * Math.pow(1.5, level) * (level + 1),
      15000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lfbuildmech10: function (level) {
    return [
      100000 * Math.pow(1.4, level) * (level + 1),
      40000 * Math.pow(1.4, level) * (level + 1),
      20000 * Math.pow(1.4, level) * (level + 1)
    ];
  },
  lftechmech1: function (level) {
    return [
      10000 * Math.pow(1.5, level) * (level + 1),
      6000 * Math.pow(1.5, level) * (level + 1),
      1000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechhuma2: function (level) {
    return [
      7000 * Math.pow(1.5, level) * (level + 1),
      10000 * Math.pow(1.5, level) * (level + 1),
      5000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechrock2: function (level) {
    return [
      7500 * Math.pow(1.5, level) * (level + 1),
      12500 * Math.pow(1.5, level) * (level + 1),
      5000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechkael2: function (level) {
    return [
      7500 * Math.pow(1.5, level) * (level + 1),
      12500 * Math.pow(1.5, level) * (level + 1),
      5000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechrock3: function (level) {
    return [
      15000 * Math.pow(1.5, level) * (level + 1),
      10000 * Math.pow(1.5, level) * (level + 1),
      5000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechrock5: function (level) {
    return [
      25000 * Math.pow(1.5, level) * (level + 1),
      20000 * Math.pow(1.5, level) * (level + 1),
      10000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechmech6: function (level) {
    return [
      50000 * Math.pow(1.5, level) * (level + 1),
      50000 * Math.pow(1.5, level) * (level + 1),
      20000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechrock7: function (level) {
    return [
      70000 * Math.pow(1.5, level) * (level + 1),
      40000 * Math.pow(1.5, level) * (level + 1),
      20000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechhuma8: function (level) {
    return [
      80000 * Math.pow(1.5, level) * (level + 1),
      50000 * Math.pow(1.5, level) * (level + 1),
      20000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechrock10: function (level) {
    return [
      85000 * Math.pow(1.5, level) * (level + 1),
      40000 * Math.pow(1.5, level) * (level + 1),
      35000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechrock11: function (level) {
    return [
      120000 * Math.pow(1.5, level) * (level + 1),
      30000 * Math.pow(1.5, level) * (level + 1),
      25000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechrock12: function (level) {
    return [
      100000 * Math.pow(1.5, level) * (level + 1),
      40000 * Math.pow(1.5, level) * (level + 1),
      30000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechkael12: function (level) {
    return [
      100000 * Math.pow(1.5, level) * (level + 1),
      40000 * Math.pow(1.5, level) * (level + 1),
      30000 * Math.pow(1.5, level) * (level + 1)
    ];
  },
  lftechmech13: function (level) {
    return [
      200000 * Math.pow(1.5, level) * (level + 1),
      100000 * Math.pow(1.5, level) * (level + 1),
      100000 * Math.pow(1.5, level) * (level + 1)
    ];
  }
};

function uipp_getCost(type, level) {
  if (!costsFunctions[type]) {
    return null;
  }

  return costsFunctions[type](level);
}

function uipp_getCummulativeCost(type, fromLevel, toLevel) {
  if (!costsFunctions[type]) {
    return null;
  }

  var totalCost = [0, 0, 0];
  for (var level = fromLevel; level <= toLevel; level++) {
    var levelCost = window.uipp_getCost(type, level);
    totalCost[0] += levelCost[0];
    totalCost[1] += levelCost[1];
    totalCost[2] += levelCost[2];
  }
  return totalCost;
}

window.uipp_getProduction = function uipp_getProduction(type, level, averageTemp, coords, opts) {
  opts = opts || {};
  if (opts.plasma == undefined) opts.plasma = true;
  if (opts.class == undefined) opts.class = true;
  if (opts.geologist == undefined) opts.geologist = true;
  if (opts.officers == undefined) opts.officers = true;
  if (opts.bonus == undefined) opts.bonus = 0;

  var speed = Number(window.config.universe.speed);

  var positionMultiplier = 1;
  if (coords) {
    if (type == 'crystal' && coords[2] == 1) positionMultiplier = 1.4;
    if (type == 'crystal' && coords[2] == 2) positionMultiplier = 1.3;
    if (type == 'crystal' && coords[2] == 3) positionMultiplier = 1.2;
    if (type == 'metal' && coords[2] == 6) positionMultiplier = 1.17;
    if (type == 'metal' && coords[2] == 7) positionMultiplier = 1.23;
    if (type == 'metal' && coords[2] == 8) positionMultiplier = 1.35;
    if (type == 'metal' && coords[2] == 9) positionMultiplier = 1.23;
    if (type == 'metal' && coords[2] == 10) positionMultiplier = 1.17;
  }

  // multiplier is for miner class, geologist, officer council
  var multiplier = 0;
  if ($('.characterclass.miner').length && opts.class) {
    multiplier += 0.25;
  }
  if ($('.geologist.on').length && opts.geologist) {
    multiplier += 0.1;
  }
  if ($('#officers.all').length && opts.officers) {
    multiplier += 0.02;
  }

  // for unspecified temperature, take an arbitrary temperature of 30° average
  if (averageTemp !== 0 && !averageTemp) {
    averageTemp = 30;
  }

  switch (type) {
    case 'metal':
      var baseProd = 30 * speed * positionMultiplier;
      var mineProd = Math.floor(30 * level * Math.pow(1.1, level) * speed * positionMultiplier);
      var bonusProd = multiplier * (baseProd + mineProd);
      var additionalProd = opts.bonus * mineProd;
      var plasmaProd = opts.plasma ? (window.config.plasmaTech || 0) * 0.01 * mineProd : 0;
      return baseProd + mineProd + bonusProd + additionalProd + plasmaProd;
    case 'crystal':
      var baseProd = 15 * speed * positionMultiplier;
      var mineProd = Math.floor(20 * level * Math.pow(1.1, level) * speed * positionMultiplier);
      var bonusProd = multiplier * (baseProd + mineProd);
      var additionalProd = opts.bonus * mineProd;
      var plasmaProd = opts.plasma ? (window.config.plasmaTech || 0) * 0.0066 * mineProd : 0;
      return baseProd + mineProd + bonusProd + additionalProd + plasmaProd;
    case 'deuterium':
      var baseProd = 0;
      var mineProd = Math.floor(10 * level * Math.pow(1.1, level) * speed * (1.36 - 0.004 * averageTemp));
      var bonusProd = multiplier * (baseProd + mineProd);
      var additionalProd = opts.bonus * mineProd;
      var plasmaProd = opts.plasma ? (window.config.plasmaTech || 0) * 0.0033 * mineProd : 0;
      return baseProd + mineProd + bonusProd + additionalProd + plasmaProd;
    default:
      return null;
  }
};
