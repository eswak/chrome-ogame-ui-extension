'use strict';
window._addShipHelperInterval = function _addShipHelperInterval() {
  setInterval(function () {
    var $el = $('form#shipsChosen:not(.enhanced)');

    if ($el.length) {
      $el.addClass('enhanced');

      $el
        .find('.technology.transporterSmall')
        .append(
          $(
            [
              '<div id="pt-metal" style="position:absolute;top:0;left:0;width:25.33px;height:17px;border:1px solid #AB7AFF;background-image: url(' +
                window.uipp_images.resources.metal +
                ");background-size:100% 100%;cursor:pointer\" onclick=\"uipp_toggleShipResources('pt', 'metal')\">",
              '</div>'
            ].join('')
          )
        );
      $el
        .find('.technology.transporterSmall')
        .append(
          $(
            [
              '<div id="pt-crystal" style="position:absolute;top:0;left:25.33px;width:26.33px;height:17px;border:1px solid #AB7AFF;background-image: url(' +
                window.uipp_images.resources.crystal +
                ");background-size:100% 100%;cursor:pointer\" onclick=\"uipp_toggleShipResources('pt', 'crystal')\">",
              '</div>'
            ].join('')
          )
        );
      $el
        .find('.technology.transporterSmall')
        .append(
          $(
            [
              '<div id="pt-deuterium" style="position:absolute;top:0;left:52.66px;width:25.33px;height:17px;border:1px solid #AB7AFF;background-image: url(' +
                window.uipp_images.resources.deuterium +
                ");background-size:100% 100%;cursor:pointer\" onclick=\"uipp_toggleShipResources('pt', 'deuterium')\">",
              '</div>'
            ].join('')
          )
        );

      $el
        .find('.technology.transporterLarge')
        .append(
          $(
            [
              '<div id="gt-metal" style="position:absolute;top:0;left:0;width:25.33px;height:17px;border:1px solid #AB7AFF;background-image: url(' +
                window.uipp_images.resources.metal +
                ");background-size:100% 100%;cursor:pointer\" onclick=\"uipp_toggleShipResources('gt', 'metal')\">",
              '</div>'
            ].join('')
          )
        );
      $el
        .find('.technology.transporterLarge')
        .append(
          $(
            [
              '<div id="gt-crystal" style="position:absolute;top:0;left:25.33px;width:26.33px;height:17px;border:1px solid #AB7AFF;background-image: url(' +
                window.uipp_images.resources.crystal +
                ");background-size:100% 100%;cursor:pointer\" onclick=\"uipp_toggleShipResources('gt', 'crystal')\">",
              '</div>'
            ].join('')
          )
        );
      $el
        .find('.technology.transporterLarge')
        .append(
          $(
            [
              '<div id="gt-deuterium" style="position:absolute;top:0;left:52.66px;width:25.33px;height:17px;border:1px solid #AB7AFF;background-image: url(' +
                window.uipp_images.resources.deuterium +
                ");background-size:100% 100%;cursor:pointer\" onclick=\"uipp_toggleShipResources('gt', 'deuterium')\">",
              '</div>'
            ].join('')
          )
        );

      var selected = {
        pt: { metal: false, crystal: false, deuterium: false },
        gt: { metal: false, crystal: false, deuterium: false }
      };
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
      var elements = { pt: $el.find('input[name=transporterSmall]'), gt: $el.find('input[name=transporterLarge]') };
      var resources = window._getCurrentPlanetResources();

      window.uipp_toggleShipResources = function (type, resource) {
        selected[type][resource] = !selected[type][resource];
        var totalResources = 0;
        for (var res in selected[type]) {
          if (selected[type][res]) {
            $('#' + type + '-' + res).css('opacity', 1);
            totalResources += resources[res].now;
          } else {
            $('#' + type + '-' + res).css('opacity', 0.5);
          }
        }
        if (totalResources === 0) {
          for (var res2 in selected[type]) {
            $('#' + type + '-' + res2).css('opacity', 1);
          }
        }
        elements[type]
          .val(Math.ceil(totalResources / cargo[type]))
          .keyup()
          .blur();

        var field = { metal: 'cargoMetal', crystal: 'cargoCrystal', deuterium: 'cargoDeuterium' };
        for (var res in selected[type]) {
          var resField = field[res];
          if (selected[type][res]) {
            window.fleetDispatcher[resField] = Math.min(
              Math.floor(resources[res].now),
              elements[type].val() * cargo[type]
            );
          } else {
            window.fleetDispatcher[resField] = 0;
          }
        }
      };
    }
  }, 100);
};
