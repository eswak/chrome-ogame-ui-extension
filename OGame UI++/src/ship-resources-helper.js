var fn = function () {
  'use strict';

  window._addShipResourcesHelperInterval = function _addShipResourcesHelperInterval () {
    setInterval(function () {
      var $el = $('form#shipsChosen:not(.enhanced-shipresources)');

      if (!$el.length) return;

      $el.addClass('enhanced-shipresources');

  		$el.find('#technologies').append([
  			'<div style="position:absolute;bottom:71px;left:222px;text-align:right">',
  			'<img src="' + uipp_images.resources.metal + '" style="height:24px;margin-right:5px;vertical-align:-9px;"/>',
  			'<input type="text" id="helper-shipresource-metal" style="width:60px;height:17px;" onkeyup="uipp_updateShipResourcesHelper()">',
        '</div>',
        '<div style="position:absolute;bottom:43px;left:222px;text-align:right">',
  			'<img src="' + uipp_images.resources.crystal + '" style="height:24px;margin-right:5px;vertical-align:-9px;"/>',
  			'<input type="text" id="helper-shipresource-crystal" style="width:60px;height:17px;" onkeyup="uipp_updateShipResourcesHelper()">',
        '</div>',
        '<div style="position:absolute;bottom:15px;left:222px;text-align:right">',
  			'<img src="' + uipp_images.resources.deuterium + '" style="height:24px;margin-right:5px;vertical-align:-9px;"/>',
  			'<input type="text" id="helper-shipresource-deuterium" style="width:60px;height:17px;" onkeyup="uipp_updateShipResourcesHelper()">',
  			'</div>',
        '<div style="position:absolute;bottom:55px;left:345px;cursor:pointer;user-select:none;" onclick="uipp_setShipResourceHelper(\'gt\')">',
  			'<img src="' + uipp_images.ships[203] + '" style="height:40px;margin-right:10px;vertical-align:-16px;"/>',
  			'<span id="helper-shipresource-gt" class="enhancement" style="text-decoration:underline">0</span>',
  			'</div>',
        '<div style="position:absolute;bottom:16px;left:345px;cursor:pointer;user-select:none;" onclick="uipp_setShipResourceHelper(\'pt\')">',
  			'<img src="' + uipp_images.ships[202] + '" style="height:40px;margin-right:10px;vertical-align:-16px;"/>',
  			'<span id="helper-shipresource-pt" class="enhancement" style="text-decoration:underline">0</span>',
  			'</div>'
  		].join(''));
    }, 100);
  };

  function getSum() {
    var metal = $('#helper-shipresource-metal').val();
    var crystal = $('#helper-shipresource-crystal').val();
    var deuterium = $('#helper-shipresource-deuterium').val();
    var sum = 0;
    if (!isNaN(Number(metal))) sum += Number(metal);
    if (!isNaN(Number(crystal))) sum += Number(crystal);
    if (!isNaN(Number(deuterium))) sum += Number(deuterium);
    return sum;
  }

  window.uipp_updateShipResourcesHelper = function() {
    var sum = getSum();
    var cargo = {
      pt: 5000 * (1 + 0.05 * (window.config.hyperspaceTech || 0)) + (window.config.isMiner ? 1250 : 0),
      gt: 25000 * (1 + 0.05 * (window.config.hyperspaceTech || 0)) + (window.config.isMiner ? 6250 : 0)
    };
    $('#helper-shipresource-gt').text(Math.ceil(sum / cargo.gt));
    $('#helper-shipresource-pt').text(Math.ceil(sum / cargo.pt));
  };

  window.uipp_setShipResourceHelper = function(type) {
    var cargo = {
      pt: 5000 * (1 + 0.05 * (window.config.hyperspaceTech || 0)) + (window.config.isMiner ? 1250 : 0),
      gt: 25000 * (1 + 0.05 * (window.config.hyperspaceTech || 0)) + (window.config.isMiner ? 6250 : 0)
    };

    if (type === 'gt') {
      $('.transporterLarge input').val(Math.ceil(getSum() / cargo.gt)).keyup();
    } else {
      $('.transporterSmall input').val(Math.ceil(getSum() / cargo.pt)).keyup();
    }

    var metal = Number($('#helper-shipresource-metal').val());
    var crystal = Number($('#helper-shipresource-crystal').val());
    var deuterium = Number($('#helper-shipresource-deuterium').val());
    if (!isNaN(metal)) {
      fleetDispatcher.cargoMetal = metal;
    }
    if (!isNaN(crystal)) {
      fleetDispatcher.cargoCrystal = crystal;
    }
    if (!isNaN(deuterium)) {
      fleetDispatcher.cargoDeuterium = deuterium;
    }
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
