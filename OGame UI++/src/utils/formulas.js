var fn = function () {
  'use strict';

  window.uipp_getDistance = function (c1, c2) {
    function distance (a, b, dim) {
      var d1 = (a - b) >= 1 ? (a - b) : (a - b + dim);
      var d2 = (b - a) >= 1 ? (b - a) : (b - a + dim);
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
    return (10 + 3500 * Math.sqrt(10 * distance / speed)) / Number(window.config.universe.speedFleet);
  };

  window.uipp_getCost = uipp_getCost;
  window.uipp_getCummulativeCost = uipp_getCummulativeCost;

  var costsFunctions = {
    astrophysics: function (level) {
      return [4000 * Math.pow(1.75, level), 8000 * Math.pow(1.75, level), 4000 * Math.pow(1.75, level)];
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
    }
  };

  function uipp_getCost (type, level) {
    if (!costsFunctions[type]) {
      return null;
    }

    return costsFunctions[type](level);
  }

  function uipp_getCummulativeCost (type, fromLevel, toLevel) {
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

  window.uipp_getProduction = function uipp_getProduction (type, level, averageTemp, additionalMultiplier) {
    var speed = Number(window.config.universe.speed);

    var multiplier = 1 + (additionalMultiplier || 0);
    if ($('.geologist.on').length) {
      multiplier += 0.1;
    }
    if ($('#officers.all').length) {
      multiplier += 0.02;
    }

    averageTemp = averageTemp || 30;

    switch (type) {
    case 'metal':
      multiplier += (window.config.plasmaTech || 0) * 0.01;
      return Math.round(30 * level * Math.pow(1.1, level) * speed * multiplier + 30 * speed);
    case 'crystal':
      multiplier += (window.config.plasmaTech || 0) * 0.0066;
      return Math.round(20 * level * Math.pow(1.1, level) * speed * multiplier + 15 * speed);
    case 'deuterium':
      multiplier += (window.config.plasmaTech || 0) * 0.0033;
      return Math.round(10 * level * Math.pow(1.1, level) * speed * multiplier * (1.36 - 0.004 * averageTemp));
    default:
      return null;
    }
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
