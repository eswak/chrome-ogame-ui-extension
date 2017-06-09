var fn = function () {
  'use strict';
  window._addCostsHelperInterval = function _addCostsHelperInterval() {
    setInterval(function () {
      var costs = {
        metal: _gfNumberToJsNumber($('.metal.tooltip .cost').text().trim()),
        crystal: _gfNumberToJsNumber($('.crystal.tooltip .cost').text().trim()),
        deuterium: _gfNumberToJsNumber($('.deuterium.tooltip .cost').text().trim())
      };
      if (costs.metal || costs.crystal || costs.deuterium) {
        _addRessourceCountTimeHelper(costs);
        _addLimitingReagentHelper(costs);
        _addProductionEconomyTimeTextHelper(costs);
        _addProductionBuildableInTextHelper(costs);
        _addProductionMaximumBuildableTextHelper(costs);
        _addProductionRentabilityTimeTextHelper(costs);
      }
    }, 100);

    function _getCostTimes(costs) {
      var resources = _getCurrentPlanetResources();
      return {
        metal: Math.ceil(costs.metal / resources.metal.prod) || 0,
        crystal: Math.ceil(costs.crystal / resources.crystal.prod) || 0,
        deuterium: Math.ceil(costs.deuterium / resources.deuterium.prod) || 0
      };
    }

    function _addRessourceCountTimeHelper(costs) {
      var times = _getCostTimes(costs);

      var $metalElement = $('.metal.tooltip:not(.enhanced)');
      $metalElement.append('<div class="enhancement">' + _time(times.metal) + '</div>');
      $metalElement.addClass('enhanced');

      var $crystalElement = $('.crystal.tooltip:not(.enhanced)');
      $crystalElement.append('<div class="enhancement">' + _time(times.crystal) + '</div>');
      $crystalElement.addClass('enhanced');

      var $deuteriumElement = $('.deuterium.tooltip:not(.enhanced)');
      $deuteriumElement.append('<div class="enhancement">' + _time(times.deuterium) + '</div>');
      $deuteriumElement.addClass('enhanced');
    }

    function _getLimitingReagent(costs) {
      var times = _getCostTimes(costs);
      var limitingreagent = null;
      if (times.metal > 0 || times.crystal > 0 || times.deuterium > 0) {
        if (times.metal >= times.crystal && times.metal > times.deuterium) {
          limitingreagent = 'metal';
        } else if (times.crystal >= times.metal && times.crystal > times.deuterium) {
          limitingreagent = 'crystal';
        } else if (times.deuterium >= times.metal && times.deuterium > times.crystal) {
          limitingreagent = 'deuterium';
        }
      }

      return limitingreagent;
    }

    function _addLimitingReagentHelper(costs) {
      var limitingreagent = _getLimitingReagent(costs);

      if (limitingreagent) {
        $('.' + limitingreagent + '.tooltip.enhanced:not(.limitingreagent)').addClass('limitingreagent');
      }
    }

    function _addProductionEconomyTimeTextHelper(costs) {
      var $el = $('#content .production_info:not(.enhanced-economy-time)');
      $el.addClass('enhanced-economy-time');

      var resources = _getCurrentPlanetResources();
      var totalPrice = costs.metal * resources.metal.worth + costs.crystal * resources.crystal.worth + costs.deuterium * resources.deuterium.worth;
      var totalProd = resources.metal.prod * resources.metal.worth + resources.crystal.prod * resources.crystal.worth + resources.deuterium.prod * resources.deuterium.worth;

      $el.append('<li class="enhancement">' + _translate('ECONOMY_TIME', {
        time: _time(totalPrice / totalProd)
      }) + '</li>');
    }

    function _addProductionBuildableInTextHelper(costs) {
      var $el = $('#content .production_info:not(.enhanced-buildable-in)');
      $el.addClass('enhanced-buildable-in');

      var resources = _getCurrentPlanetResources();
      var availableIn = {
        metal: Math.max(costs.metal - resources.metal.now, 0) / resources.metal.prod,
        crystal: Math.max(costs.crystal - resources.crystal.now, 0) / resources.crystal.prod,
        deuterium: Math.max(costs.deuterium - resources.deuterium.now, 0) / resources.deuterium.prod
      };
      if (isNaN(availableIn.deuterium)) { // we may not produce any deuterium...
        availableIn.deuterium = costs.deuterium > resources.deuterium.now ? 8553600 : 0;
      }

      availableIn = Math.max(availableIn.metal, availableIn.crystal, availableIn.deuterium);

      if (availableIn === 0) {
        $el.append('<li class="enhancement">' + _translate('BUILDABLE_NOW') + '</li>');
      } else {
        $el.append('<li class="enhancement">' + _translate('BUILDABLE_IN', {
          time: _time(availableIn, -1)
        }) + '</li>');
      }
    }

    function _addProductionMaximumBuildableTextHelper(costs) {
      var $amount = $('#content .amount:not(.enhanced)');
      if ($amount.length > 0) {
        var resources = _getCurrentPlanetResources();

        var maxMetal = resources.metal.now / costs.metal;
        var maxCrystal = resources.crystal.now / costs.crystal;
        var maxDeuterium = resources.deuterium.now / costs.deuterium;
        var max = Math.floor(Math.min(maxMetal, maxCrystal, maxDeuterium));
        if (isFinite(max)) {
          $amount.append('<span class="enhancement"> (Max: ' + max + ')</span>');
        }

        $amount.addClass('enhanced');
      }
    }

    function _addProductionRentabilityTimeTextHelper(costs) {
      var resources = _getCurrentPlanetResources();
      var tradeRateStr = config.tradeRate.map(String).join(' / ');

      // if we are viewing a metal mine, computes rentability time
      if ($('#resources_1_large:not(.enhanced)').length > 0) {
        var rentabilityTime = _getRentabilityTime('metal', resources.metal.prod, resources.metal.level);
        $('#content .production_info').append('<li class="enhancement">' + _translate('ROI', {
          time: _time(rentabilityTime),
          tradeRate: tradeRateStr
        }) + '</li>');
        $('#resources_1_large').addClass('enhanced');
      }

      // if we are viewing a crystal mine, computes rentability time
      else if ($('#resources_2_large:not(.enhanced)').length > 0) {
        var rentabilityTime = _getRentabilityTime('crystal', resources.crystal.prod, resources.crystal.level);
        $('#content .production_info').append('<li class="enhancement">' + _translate('ROI', {
          time: _time(rentabilityTime),
          tradeRate: tradeRateStr
        }) + '</li>');
        $('#resources_2_large').addClass('enhanced');
      }

      // if we are viewing a deuterium mine, computes rentability time
      else if ($('#resources_3_large:not(.enhanced)').length > 0) {
        var rentabilityTime = _getRentabilityTime('deuterium', resources.deuterium.prod, resources.deuterium.level);
        $('#content .production_info').append('<li class="enhancement">' + _translate('ROI', {
          time: _time(rentabilityTime),
          tradeRate: tradeRateStr
        }) + '</li>');
        $('#resources_3_large').addClass('enhanced');
      }

      // if we are viewing a plasma technology, computes rentability time
      else if ($('#research_122_large:not(.enhanced)').length > 0) {
        var technologyLevel = Number($('#content span.level').text().trim().split(' ').pop()) || 0;
        var rentabilityTime = _getRentabilityTime('plasma', null, technologyLevel);
        $('#content .production_info').append('<li class="enhancement">' + _translate('ROI', {
          time: _time(rentabilityTime),
          tradeRate: tradeRateStr
        }) + '</li>');
        $('#research_122_large').addClass('enhanced');
      }
    }
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
