var fn = function () {
  'use strict';
  window._addSolarSatHelperInterval = function _addSolarSatHelperInterval () {
    setInterval(function () {
      var $el = $('#technologydetails .solarSatellite:not(.enhanced)');

      if ($el.length) {
        $el.addClass('enhanced');
        var energy = Number($('#resources_energy').text().replace(/\./g, ''));

        if (energy < 0) {
          var production = Number($('.energy_production .bonus').attr('data-value'));
          if (isNaN(production)) {
			  return;
		  }
          var n = Math.ceil(Math.abs(energy) / production);
          $('#build_amount')[0].value = n;
        }
      }
    }, 100);
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
