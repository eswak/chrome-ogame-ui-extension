var fn = function () {
  'use strict';
  window._addCostsHelperInterval = function _addCostsHelperInterval () {
    var resources = window._getCurrentPlanetResources();

    if (!resources) {
      return;
    }

    var resNames = ['metal', 'crystal', 'deuterium'];
    var availableIn = {};

    window._enhanceOnceOnDomChange ('#contentWrapper #content', function (idx, element) {
      var costs = {};
      resNames.forEach(function (res) {
        costs[res] = window._gfNumberToJsNumber($('.' + res + '.tooltip .cost').first().text().trim()),
        availableIn[res] = (costs[res] - resources[res].now) / resources[res].prod;
      });

      if (isNaN(availableIn.deuterium)) { // we may not produce any deuterium...
        availableIn.deuterium = costs.deuterium > resources.deuterium.now ? 8553600 : 0;
      }

      if (costs.metal || costs.crystal || costs.deuterium) {
        _addRessourceCountTimeHelper();
        _addLimitingReagentHelper();

        // for non-commanders only
        if ($('.commander.on').length === 0) {
          _addProductionBuildableInTextHelper();
          _addProductionMaximumBuildableTextHelper(costs);
        }
      }
    });

    function _addRessourceCountTimeHelper () {
      resNames.forEach(function (res) {
        // remove first 'ressource count helper'
        $('.' + res + '.tooltip .enhancement').remove();
        var $element = $('.' + res + '.tooltip').first();
        if ($element.find('.' + res).length > 0) {
          if (availableIn[res] > 0) {
            $element.append('<div class="enhancement">' + window._time(availableIn[res], -1) + '</div>');
          }
        }
      });
    }

    function _addLimitingReagentHelper () {
      var limitingreagent = null;
      ['metal', 'crystal', 'deuterium'].forEach(function (res) {
        if (availableIn[res] && availableIn[res] > 0) {
          if (limitingreagent === null || availableIn[res] > availableIn[limitingreagent]) {
            limitingreagent = res;
          }
        }
      });

      if (limitingreagent) {
        $('.' + limitingreagent + '.tooltip.enhanced:not(.limitingreagent)').addClass('limitingreagent');
      }
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
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
