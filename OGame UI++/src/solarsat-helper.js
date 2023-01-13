'use strict';
window._addSolarSatHelperInterval = function _addSolarSatHelperInterval() {
  setInterval(function () {
    // ==========================================================================
    // Auto-fill number of solar satellites
    // ==========================================================================
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

    // ==========================================================================
    // Solar satellite counter near energy consumption
    // ==========================================================================
    var energyProducedPerSat = Math.floor(
      (((((config.my || {}).planets || {})['[' + _getCurrentPlanetCoordinates().join(':') + ']'] || {}).averageTemp ||
        0) +
        160) /
        6
    );
    $('li.additional_energy_consumption:not(.enhanced)').each(function () {
      $(this).addClass('enhanced');

      var additionalEnergyNeeded = Number($(this).find('.value').attr('data-value'));
      var nSats = Math.ceil(additionalEnergyNeeded / energyProducedPerSat);
      $(this).append(
        [
          '<span class="enhancement tooltip" style="font-weight:bold;margin-left:5px" title="' +
            $('.technology.solarSatellite').attr('aria-label') +
            ': ' +
            nSats +
            '">(',
          '<img src="' + uipp_images.ships[212] + '" style="height:16px;vertical-align:-4px"/> ',
          nSats,
          ')</span>'
        ].join('')
      );
    });
  }, 100);
};
