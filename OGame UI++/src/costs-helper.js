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

    window._enhanceOnceOnDomChange ('#technologydetails .content', function () {
      var costs = {};
      resNames.forEach(function (res) {
        costs[res] = window._gfNumberToJsNumber($('.resource.' + res + '.tooltip').first().text().trim()),
        missingResources[res] = costs[res] - resources[res].now;
      });

      if (costs.metal || costs.crystal || costs.deuterium) {
        if (window.config.features.missingresources) {
          _addRessourceCountHelper();
        }

        if (window.config.features.minetext) {
          _addProductionRentabilityTimeTextHelper(costs);
        }

		// only for me >_> features not allowed by Gameforge staff
        if ($('meta[name="ogame-player-name"]').attr('content') === 'Eswak') {
		  _addProductionBuildableInTextHelper(_getAvailableIn(resources, missingResources));
		  _addProductionMaximumBuildableTextHelper(costs);
        }
      }
    });

    function _addRessourceCountHelper () {
      resNames.forEach(function (res) {
        var $element = $('.costs .' + res + ':not(.enhanced)').first();
        if ($element.length > 0) {
		  $('.costs').css('top', 'auto');
		  $('.costs').css('bottom', '0');
		  $element.css('height', 'auto');
          if (missingResources[res] > 0) {
			var $missingCount = $('<div class="enhancement"></div>');
			$missingCount.html('-' + window._num(missingResources[res], -1 * resources[res].prod));
            $element.append($missingCount);
			
			setTimeout(function() {
			  $missingCount.html('&nbsp;');
			  $missingCount.parent().removeClass('insufficient');
			}, 1000 * missingResources[res] / resources[res].prod);
          } else {
			$element.append('<div class="enhancement">&nbsp;</div>');
		  }

          $element.addClass('enhanced');
        }
      });
    }

    function _getAvailableIn(resources, missingResources) {
      var ret = {};
      ['metal', 'crystal', 'deuterium'].forEach(function (res) {
		var availableIn = 0;
		if (missingResources[res] > 0) {
			availableIn = missingResources[res] / resources[res].prod;
			if (isNaN(availableIn)) {
			  availableIn = Infinity;
			}
		}

        ret[res] = availableIn;
      });

      return ret;
    }

    function _addProductionBuildableInTextHelper(availableIn) {
      var $el = $('#technologydetails .content .build-it_wrap:not(.enhanced-buildable-in)');
      $el.addClass('enhanced-buildable-in');
	  $el.css('text-align', 'right');
	  
      var availableInMax = Math.max(availableIn.metal, availableIn.crystal, availableIn.deuterium);

      if (availableInMax > 0) {
        $el.html('<p class="enhancement" style="margin: 8px 0">' + window._translate('BUILDABLE_IN', {
          time: window._time(availableInMax, -1)
        }) + '</p>');
		var $btn = $('<button class="upgrade">Alert me</button>');
		var now = Date.now();
		$btn.on('click', function() {
			if ($btn.attr('disabled')) {
				return;
			}
			$btn.attr('disabled', 'disabled');
			var elapsed = (Date.now() - now) / 1000;
			setTimeout(function() {
				alert(window._translate('PRODUCTION_READY'));
				var techId = $el.parent().parent().parent().attr('data-technology-id');
				$el.html('<button class="upgrade" data-technology="' + techId + '"><span class="tooltip" title="">' + window._translate('UPGRADE') + '</span></button>');
			}, (availableInMax - elapsed) * 1000);
		});
		$el.append($btn);
      }
    }

    function _addProductionMaximumBuildableTextHelper (costs) {
      var $amount = $('.content .build_amount:not(.enhanced)');
	  $amount.find('label').css('margin-top', '-4px');
      if ($amount.length > 0) {
        var maxMetal = resources.metal.now / costs.metal;
        var maxCrystal = resources.crystal.now / costs.crystal;
        var maxDeuterium = resources.deuterium.now / costs.deuterium;
        var max = Math.floor(Math.min(maxMetal, maxCrystal, maxDeuterium));
        if (isFinite(max)) {
		  var $max = $('<div class="enhancement" style="font-size:9px;cursor:pointer;position:absolute;top:-10px"><u>Max:</u> ' + max +'</div>');
		  $max.on('click', function() {
			$('#build_amount')[0].value = max;
		  });
          $amount.append($max);
        }

        $amount.addClass('enhanced');
      }
    }

    function _addProductionRentabilityTimeTextHelper () {
      var tradeRateStr = window.config.tradeRate.map(String).join(' / ');

      // if we are viewing a metal mine, computes rentability time
      if ($('.building.metalMine:not(.enhanced)').length > 0) {
        $('.content .information .narrow').append('<li class="enhancement">' + window._translate('ROI', {
          time: window._time(window._getRentabilityTime('metal', resources.metal.prod, resources.metal.level)),
          tradeRate: tradeRateStr
        }) + '</li>');
        $('.building.metalMine').addClass('enhanced');
      }

      // if we are viewing a crystal mine, computes rentability time
      else if ($('.building.crystalMine:not(.enhanced)').length > 0) {
        $('.content .information .narrow').append('<li class="enhancement">' + window._translate('ROI', {
          time: window._time(window._getRentabilityTime('crystal', resources.crystal.prod, resources.crystal.level)),
          tradeRate: tradeRateStr
        }) + '</li>');
        $('.building.crystalMine').addClass('enhanced');
      }

      // if we are viewing a deuterium mine, computes rentability time
      else if ($('.building.deuteriumSynthesizer:not(.enhanced)').length > 0) {
        $('.content .information .narrow').append('<li class="enhancement">' + window._translate('ROI', {
          time: window._time(window._getRentabilityTime('deuterium', resources.deuterium.prod, resources.deuterium.level)),
          tradeRate: tradeRateStr
        }) + '</li>');
        $('.building.deuteriumSynthesizer').addClass('enhanced');
      }

      // if we are viewing a plasma technology, computes rentability time
      else if ($('.building.plasmaTechnology:not(.enhanced)').length > 0) {
        var technologyLevel = Number($('#content span.level').text().trim().split(' ').pop()) || 0;
        var rentabilityTime = window._getRentabilityTime('plasma', null, technologyLevel);
        $('.content .information > ul').append('<li class="enhancement">' + window._translate('ROI', {
          time: window._time(rentabilityTime),
          tradeRate: tradeRateStr
        }) + '</li>');
        $('.building.plasmaTechnology').addClass('enhanced');
      }
	  
	  // vanilla CSS fixes to allow display of additional info
	  $('.content .information > ul').css('width', 'auto');
	  $('.content .information .narrow li').css('margin-bottom', '6px');
    }
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
