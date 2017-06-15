var fn = function () {
  'use strict';

  window.uipp_getDistance = function (c1, c2) {
    function distance(a, b, dim) {
      var d1 = (a - b) >= 1 ? (a - b) : (a - b + dim);
      var d2 = (b - a) >= 1 ? (b - a) : (b - a + dim);
      return Math.min(d1, d2);
    }

    /* Universe dimensions */
    var galaxies = parseInt(config.universe.galaxies);
    var systems = parseInt(config.universe.systems);

    if (c1[0] !== c2[0]) {
      return 20000 * distance(c1[0], c2[0], galaxies);
    } else if (c1[1] !== c2[1]) {
      return 2700 + 95 * distance(c1[1], c2[1], systems);
    } else {
      return 1000 + 5 * Math.abs(c1[2] - c2[2]);
    }
  };

  window.uipp_getFlightTime = function (speed, distance) {
    return (10 + 3500 * Math.sqrt(10 * distance / speed)) / Number(config.universe.speedFleet);
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
