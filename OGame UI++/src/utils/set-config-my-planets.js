var fn = function () {
  'use strict';
  window._setConfigMyPlanets = function _setConfigMyPlanets () {
    if (!window.config.my) {
      window.config.my = {};
    }

    if (!window.config.my.planets) {
      window.config.my.planets = {};
    }

    if ($('#planetList').children().length === 1) {
      var onlyPlanetLink = $($('#planetList').children()[0]).find('.planetlink');
      var onlyPlanetName = onlyPlanetLink.find('.planet-name').text();
      var onlyPlanetCoords = onlyPlanetLink.find('.planet-koords').text();

      window.config.my.planets[onlyPlanetCoords] = window.config.my.planets[onlyPlanetCoords] || {};
      window.config.my.planets[onlyPlanetCoords].name = onlyPlanetName;
      window.config.my.planets[onlyPlanetCoords].coords = onlyPlanetCoords.replace(/[[\]]/g, '').split(':').map(Number);
      window.config.my.planets[onlyPlanetCoords].href = onlyPlanetLink.attr('href');
    } else {
      $('#planetList').children().each(function () {
        var link = $(this).find('.planetlink');
        var planetName = link.find('.planet-name').text();
        var planetCoords = link.find('.planet-koords').text();
        if (link.hasClass('active')) {
          window.config.my.planets[planetCoords] = window.config.my.planets[planetCoords] || {};
          window.config.my.planets[planetCoords].name = planetName;
          window.config.my.planets[planetCoords].coords = planetCoords.replace(/[[\]]/g, '').split(':').map(Number);
          window.config.my.planets[planetCoords].href = link.attr('href');
        }
      });
    }

    var planetOrder = $('#planetList .planet-koords').text();
    for (var key in window.config.my.planets) {
      if (!window.config.my.planets[key].coords || planetOrder.indexOf(window.config.my.planets[key].coords.join(':')) === -1) {
        delete window.config.my.planets[key];
      }
    }

    window._saveConfig();
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
