var fn = function () {
  'use strict';
  window._toggleIgnorePlanet = function _toggleIgnorePlanet(galaxy, system, position) {
    config.ignoredPlanets = config.ignoredPlanets || {};
    var key = galaxy + ':' + system + ':' + position;
    var $el = $('#planet_' + galaxy + '_' + system + '_' + position);
    if (config.ignoredPlanets[key]) {
      config.ignoredPlanets[key] = false;
      $el.removeClass('ignore');
    } else {
      config.ignoredPlanets[key] = true;
      $el.addClass('ignore');
    }

    _saveConfig(config);
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
