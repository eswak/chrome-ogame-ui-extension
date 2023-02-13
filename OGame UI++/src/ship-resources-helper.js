'use strict';

window._addShipResourcesHelperInterval = function _addShipResourcesHelperInterval() {
  // allow prefill of metal/crystal/deuterium from url
  var transportMetal = (((document.location.search || '').match(/metal=[0-9]+/) || [])[0] || 'metal=0').replace(
    'metal=',
    ''
  );
  var transportCrystal = (((document.location.search || '').match(/crystal=[0-9]+/) || [])[0] || 'crystal=0').replace(
    'crystal=',
    ''
  );
  var transportDeuterium = (
    ((document.location.search || '').match(/deuterium=[0-9]+/) || [])[0] || 'deuterium=0'
  ).replace('deuterium=', '');
  setTimeout(function () {
    if (transportMetal) {
      $('#helper-shipresource-metal').val(transportMetal);
      uipp_updateShipResourcesHelper();
    }
    if (transportCrystal) {
      $('#helper-shipresource-crystal').val(transportCrystal);
      uipp_updateShipResourcesHelper();
    }
    if (transportDeuterium) {
      $('#helper-shipresource-deuterium').val(transportDeuterium);
      uipp_updateShipResourcesHelper();
    }
  }, 200);

  setInterval(function () {
    var $el = $('form#shipsChosen:not(.enhanced-shipresources)');

    if (!$el.length) return;

    $el.addClass('enhanced-shipresources');

    $(
      [
        '<div class="allornonewrap" style="margin-left:15px;user-select:none;padding:7px">',
        '<div style="display:inline-block">',
        '<img src="' + uipp_images.resources.metal + '" style="height:24px;margin-right:5px;vertical-align:-9px;"/>',
        '<input type="text" id="helper-shipresource-metal" style="width:70px;height:17px;" onkeyup="uipp_updateShipResourcesHelper()">',
        '</div>',
        '<div style="display:inline-block; margin: 0 10px">',
        '<img src="' + uipp_images.resources.crystal + '" style="height:24px;margin-right:5px;vertical-align:-9px;"/>',
        '<input type="text" id="helper-shipresource-crystal" style="width:70px;height:17px;" onkeyup="uipp_updateShipResourcesHelper()">',
        '</div>',
        '<div style="display:inline-block">',
        '<img src="' +
          uipp_images.resources.deuterium +
          '" style="height:24px;margin-right:5px;vertical-align:-9px;"/>',
        '<input type="text" id="helper-shipresource-deuterium" style="width:70px;height:17px;" onkeyup="uipp_updateShipResourcesHelper()">',
        '</div>',
        '<div style="display:inline-block;margin-left:10px;min-width:110px;cursor:pointer;" onclick="uipp_setShipResourceHelper(\'gt\')">',
        '<img src="' + uipp_images.ships[203] + '" style="height:40px;margin-right:10px;vertical-align:-16px;"/>',
        '<span id="helper-shipresource-gt" class="enhancement" style="text-decoration:underline">0</span>',
        '</div>',
        '<div style="display:inline-block;min-width:110px;cursor:pointer;" onclick="uipp_setShipResourceHelper(\'pt\')">',
        '<img src="' + uipp_images.ships[202] + '" style="height:40px;margin-right:10px;vertical-align:-16px;"/>',
        '<span id="helper-shipresource-pt" class="enhancement" style="text-decoration:underline">0</span>',
        '</div>',
        '</div>'
      ].join('')
    ).insertBefore($('#allornone'));
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

window.uipp_updateShipResourcesHelper = function () {
  var sum = getSum();
  var cargo = {
    pt: 5000 * (1 + 0.05 * (window.config.hyperspaceTech || 0)),
    gt: 25000 * (1 + 0.05 * (window.config.hyperspaceTech || 0))
  };
  $('#helper-shipresource-gt').text(Math.ceil(sum / cargo.gt));
  $('#helper-shipresource-pt').text(Math.ceil(sum / cargo.pt));
};

window.uipp_setShipResourceHelper = function (type) {
  var cargo = {
    pt: 5000 * (1 + 0.05 * (window.config.hyperspaceTech || 0)),
    gt: 25000 * (1 + 0.05 * (window.config.hyperspaceTech || 0))
  };

  // attempt parsing from fleetDispatcher
  cargo.pt =
    (fleetDispatcher.shipsOnPlanet || []).reduce(function (acc, cur) {
      if (cur.id == 202) {
        acc = cur.baseCargoCapacity;
      }
      return acc;
    }, 0) || cargo.pt;
  cargo.gt =
    (fleetDispatcher.shipsOnPlanet || []).reduce(function (acc, cur) {
      if (cur.id == 203) {
        acc = cur.baseCargoCapacity;
      }
      return acc;
    }, 0) || cargo.gt;

  if (type === 'gt') {
    var currentVal = $('.transporterLarge input').val();
    var valToSet = Math.ceil(getSum() / cargo.gt).toString();
    if (currentVal == valToSet) valToSet = '';
    $('.transporterLarge input').val(valToSet).keyup().blur();
    $('.transporterSmall input').val('').keyup().blur();
  } else {
    var currentVal = $('.transporterSmall input').val();
    var valToSet = Math.ceil(getSum() / cargo.pt).toString();
    if (currentVal == valToSet) valToSet = '';
    $('.transporterSmall input').val(valToSet).keyup().blur();
    $('.transporterLarge input').val('').keyup().blur();
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
