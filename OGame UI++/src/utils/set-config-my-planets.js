var fn = function () {
  'use strict';
  window._setConfigMyPlanets = function _setConfigMyPlanets() {
    if (!config.my) {
      config.my = {};
    }

    if (!config.my.planets) {
      config.my.planets = {};
    }

    if ($('#planetList').children().length === 1) {
      var link = $($('#planetList').children()[0]).find('.planetlink');
      var planetName = link.find('.planet-name').text();
      var planetCoords = link.find('.planet-koords').text();

      config.my.planets[planetCoords] = config.my.planets[planetCoords] || {
        name: planetName
      };
    } else {
      $('#planetList').children().each(function () {
        var link = $(this).find('.planetlink');
        var planetName = link.find('.planet-name').text();
        var planetCoords = link.find('.planet-koords').text();
        if (link.hasClass('active')) {
          config.my.planets[planetCoords] = config.my.planets[planetCoords] || {
            name: planetName
          };
        }
      });
    }

    _saveConfig(config);
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
