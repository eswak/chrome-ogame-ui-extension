var fn = function () {
  'use strict';
  window._addCostsHelperInterval = function _addCostsHelperInterval () {
    var worth = window.uipp_getResourcesWorth();
    var resources = window._getCurrentPlanetResources();

    if (!resources) {
      return;
    }

    var resNames = ['metal', 'crystal', 'deuterium'];
    var missingResources = {};

    window._enhanceOnceOnDomChange ('#contentWrapper #content', function () {
      var costs = {};
      resNames.forEach(function (res) {
        costs[res] = window._gfNumberToJsNumber($('.' + res + '.tooltip .cost').first().text().trim()),
        missingResources[res] = costs[res] - resources[res].now;
      });

      if (costs.metal || costs.crystal || costs.deuterium) {
        if (window.config.features.missingresources) {
          _addRessourceCountHelper();
          // _addLimitingReagentHelper();
        }

        if (window.config.features.minetext) {
          // _addProductionEconomyTimeTextHelper(costs);
          _addProductionRentabilityTimeTextHelper(costs);
        }

        // for non-commanders only
        // if ($('.commander.on').length === 0) {
        //   _addProductionBuildableInTextHelper();
        //   _addProductionMaximumBuildableTextHelper(costs);
        // }
      }
    });

    function _addRessourceCountHelper () {
      resNames.forEach(function (res) {
        var $element = $('.' + res + '.tooltip:not(.enhanced)').first();
        if ($element.find('.' + res).length > 0) {
          if (missingResources[res] > 0) {
            $element.append('<div class="enhancement">-' + window._num(missingResources[res], -1 * resources[res].prod) + '</div>');
          }

          $element.addClass('enhanced');
        }
      });
    }

    function _addLimitingReagentHelper () {
      var limitingreagent = null;
      var availableInLimitingReagent = null;
      ['metal', 'crystal', 'deuterium'].forEach(function (res) {
        var availableIn = missingResources[res] / resources[res].prod;
        if (isNaN(availableIn)) {
          availableIn = Infinity;
        }

        if (availableIn && availableIn > 0) {
          if (limitingreagent === null || availableIn > availableInLimitingReagent) {
            limitingreagent = res;
            availableInLimitingReagent = availableIn;
          }
        }
      });

      if (limitingreagent) {
        $('.' + limitingreagent + '.tooltip.enhanced:not(.limitingreagent)').addClass('limitingreagent');
      }
    }

    function _addProductionEconomyTimeTextHelper (costs) {
      var $el = $('#content .production_info:not(.enhanced-economy-time)');
      $el.addClass('enhanced-economy-time');

      var totalPrice = costs.metal * worth.metal
        + costs.crystal * worth.crystal
        + costs.deuterium * worth.deuterium;
      var totalProd = resources.metal.prod * worth.metal
        + resources.crystal.prod * worth.crystal
        + resources.deuterium.prod * worth.deuterium;

      $el.append('<li class="enhancement">' + window._translate('ECONOMY_TIME', {
        time: window._time(totalPrice / totalProd)
      }) + '</li>');
    }

    function _addProductionBuildableInTextHelper () {
      var $el = $('#content .production_info:not(.enhanced-buildable-in)');
      $el.addClass('enhanced-buildable-in');

      var availableInMax = Math.max(availableIn.metal, availableIn.crystal, availableIn.deuterium);

      if (availableInMax > 0) {
        $el.append('<li class="enhancement">' + window._translate('BUILDABLE_IN', {
          time: window._time(availableInMax, -1)
        }) + '</li>');
      }
    }

    function _addProductionMaximumBuildableTextHelper (costs) {
      var $amount = $('#content .amount:not(.enhanced)');
      if ($amount.length > 0) {
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

    function _addProductionRentabilityTimeTextHelper () {
      var tradeRateStr = window.config.tradeRate.map(String).join(' / ');

      // if we are viewing a metal mine, computes rentability time
      if ($('#resources_1_large:not(.enhanced)').length > 0) {
        $('#content .production_info').append('<li class="enhancement">' + window._translate('ROI', {
          time: window._time(window._getRentabilityTime('metal', resources.metal.prod, resources.metal.level)),
          tradeRate: tradeRateStr
        }) + '</li>');
        $('#resources_1_large').addClass('enhanced');
      }

      // if we are viewing a crystal mine, computes rentability time
      else if ($('#resources_2_large:not(.enhanced)').length > 0) {
        $('#content .production_info').append('<li class="enhancement">' + window._translate('ROI', {
          time: window._time(window._getRentabilityTime('crystal', resources.crystal.prod, resources.crystal.level)),
          tradeRate: tradeRateStr
        }) + '</li>');
        $('#resources_2_large').addClass('enhanced');
      }

      // if we are viewing a deuterium mine, computes rentability time
      else if ($('#resources_3_large:not(.enhanced)').length > 0) {
        $('#content .production_info').append('<li class="enhancement">' + window._translate('ROI', {
          time: window._time(window._getRentabilityTime('deuterium', resources.deuterium.prod, resources.deuterium.level)),
          tradeRate: tradeRateStr
        }) + '</li>');
        $('#resources_3_large').addClass('enhanced');
      }

      // if we are viewing a plasma technology, computes rentability time
      else if ($('#research_122_large:not(.enhanced)').length > 0) {
        var technologyLevel = Number($('#content span.level').text().trim().split(' ').pop()) || 0;
        var rentabilityTime = window._getRentabilityTime('plasma', null, technologyLevel);
        $('#content .production_info').append('<li class="enhancement">' + window._translate('ROI', {
          time: window._time(rentabilityTime),
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
