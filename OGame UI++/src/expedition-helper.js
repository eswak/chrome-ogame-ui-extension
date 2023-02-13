'use strict';
window._addExpeditionHelperInterval = function _addExpeditionHelperInterval() {
  setInterval(function () {
    var $el = $('form#shipsChosen:not(.enhanced-expedition)');

    if ($el.length) {
      $el.addClass('enhanced-expedition');

      var topScore = 0;
      if (config.universe.topScore) {
        topScore = Number(config.universe.topScore);
      } else if (config.players) {
        for (var playerId in config.players) {
          var player = config.players[playerId];
          if (player.globalPosition === '1') {
            topScore = Number(player.globalScore);
          }
        }
      }

      var maxExpeditionPoints = 25000;
      if (topScore < 100000000) maxExpeditionPoints = 21000;
      if (topScore < 75000000) maxExpeditionPoints = 18000;
      if (topScore < 50000000) maxExpeditionPoints = 15000;
      if (topScore < 25000000) maxExpeditionPoints = 12000;
      if (topScore < 5000000) maxExpeditionPoints = 9000;
      if (topScore < 1000000) maxExpeditionPoints = 6000;
      if (topScore < 100000) maxExpeditionPoints = 2500;

      var shipPoints = {
        fighterLight: 20,
        fighterHeavy: 50,
        cruiser: 135,
        battleship: 300,
        interceptor: 350,
        bomber: 375,
        destroyer: 550,
        deathstar: 45000,
        reaper: 700,
        explorer: 115,

        transporterSmall: 20,
        transporterLarge: 60,
        colonyShip: 150,
        recycler: 80,
        espionageProbe: 5
      };

      $(
        [
          '<div class="allornonewrap" style="margin-left:15px;user-select:none;padding:7px;position:relative;height: 0px;margin-bottom: 30px;height:20px">',
          [
            '<div style="position: absolute;bottom: 4px;right: 10px; cursor:pointer" onwheel="uipp_changeExpeditionSystemOffset(event)" onclick="uipp_autoFillExpedition()" onmousedown="uipp_sendExpedition(event)" oncontextmenu="uipp_autoFillMilitaryExpedition(event)" class="tooltip tooltipHTML" title="' +
              getTooltip() +
              '">',
            '<span style="display:inline-block;background: #333; padding: 5px; margin-right: 5px; border-radius: 5px; vertical-align: 1px;"><span id="system-offset" style="font-family: monospace;">' +
              ((config.expeditionSystemOffset || 0) >= 0 ? '+' : '') +
              (config.expeditionSystemOffset || 0) +
              '</span><span style="margin: 0px 3px 0 0" class="galaxy_icons solarsystem"></span></span>',
            '<span class="enhancement"><span id="uipp-current-expedition-points"></span> / ' +
              maxExpeditionPoints +
              '</span>',
            '&nbsp<span id="uipp-current-expedition-points-percent">(0%)</span>',
            '<img src="' +
              uipp_images.expeditionMission +
              '" style="height:26px; vertical-align: -8px; margin-left: 5px;"/>',
            '</div>'
          ].join(''),
          '</div>'
        ].join('')
      ).insertAfter($('#allornone'));

      function getTooltip() {
        var ret = 'Optimal expedition fleet :|';
        ret += '<div style=&quot;width:200px&quot;>';

        var nExplorers = Number($('.explorer .amount').attr('data-value'));
        var maxSmallMetalDiscovery =
          50 *
          maxExpeditionPoints *
          config.universe.speed *
          (nExplorers > 0 ? 2 : 1) *
          ($('.characterclass.small.explorer').length ? 1.5 : 1);
        ret +=
          'Left click to select ships with enough cargo to return the largest common metal find (' +
          uipp_scoreHumanReadable(maxSmallMetalDiscovery) +
          ') or to reach the maximum expedition points (' +
          maxExpeditionPoints +
          '), whichever is higher.';
        ret += '<hr style=&quot;border: none; border-top: 1px solid #394959; outline: none; margin: 10px 0;&quot;>';
        var expeSlotsUsed = $('#slots .fleft:nth-child(2)')
          .text()
          .match(/[0-9]+/g)[0];
        var expeSlotsTotal = $('#slots .fleft:nth-child(2)')
          .text()
          .match(/[0-9]+/g)[1];
        var fleetDivider = expeSlotsTotal - expeSlotsUsed || 1;
        ret +=
          'Right click to select ' +
          (fleetDivider == 1
            ? 'all'
            : fleetDivider == 2
            ? 'half of'
            : fleetDivider == 3
            ? 'a third of'
            : '1/' + fleetDivider + 'th of') +
          ' your military and transport fleet with 1 pathfinder and 1 spy probe, to be sent on a military expedition (excludes death stars, colony ships, and recyclers).';
        ret += '<hr style=&quot;border: none; border-top: 1px solid #394959; outline: none; margin: 10px 0;&quot;>';
        ret +=
          "Middle click to directly send selected ships to the system's 16th position for an expedition that lasts 1h.";
        ret += '<hr style=&quot;border: none; border-top: 1px solid #394959; outline: none; margin: 10px 0;&quot;>';
        ret += 'Scroll up or down on the box to change the system offset.';
        ret += '</div>';
        return ret;
      }

      setInterval(function () {
        var currentPoints = 0;
        var shipsSelected = {
          fighterLight: Number($('.fighterLight input[type=text]').val()),
          fighterHeavy: Number($('.fighterHeavy input[type=text]').val()),
          cruiser: Number($('.cruiser input[type=text]').val()),
          battleship: Number($('.battleship input[type=text]').val()),
          interceptor: Number($('.interceptor input[type=text]').val()),
          bomber: Number($('.bomber input[type=text]').val()),
          destroyer: Number($('.destroyer input[type=text]').val()),
          deathstar: Number($('.deathstar input[type=text]').val()),
          reaper: Number($('.reaper input[type=text]').val()),
          explorer: Number($('.explorer input[type=text]').val()),

          transporterSmall: Number($('.transporterSmall input[type=text]').val()),
          transporterLarge: Number($('.transporterLarge input[type=text]').val()),
          colonyShip: Number($('.colonyShip input[type=text]').val()),
          recycler: Number($('.recycler input[type=text]').val()),
          espionageProbe: Number($('.espionageProbe input[type=text]').val())
        };
        for (var key in shipsSelected) {
          currentPoints += shipsSelected[key] * shipPoints[key];
        }
        $('#uipp-current-expedition-points').text(currentPoints);

        var percent = Math.round((100 * currentPoints) / maxExpeditionPoints);
        var $percent = $('#uipp-current-expedition-points-percent');
        $percent.text('(' + percent + '%)');
        if (percent >= 100) {
          $percent.css('color', '#99CC00');
        } else if (percent >= 70) {
          $percent.css('color', '#d29d00');
        } else {
          $percent.css('color', '#d43635');
        }
      }, 100);

      window.uipp_changeExpeditionSystemOffset = function (event) {
        var diff = event.deltaY > 0 ? -1 : +1;
        config.expeditionSystemOffset = (config.expeditionSystemOffset || 0) + diff;

        document.getElementById('system-offset').innerHTML =
          ((config.expeditionSystemOffset || 0) >= 0 ? '+' : '') + (config.expeditionSystemOffset || 0);

        // select system with offset
        var system = window._getCurrentPlanetCoordinates()[1] + (config.expeditionSystemOffset || 0);
        if (system > Number(config.universe.systems)) system = config.universe.systems;
        if (system < 1) system = 1;
        $('input#system').val(String(system)).keyup();

        window._saveConfig();

        event.preventDefault();
        return false;
      };

      window.uipp_autoFillExpedition = function () {
        var nExplorers = Number($('.explorer .amount').attr('data-value'));
        if (nExplorers > 0) {
          $('input[name=explorer]').val(1).keyup();
        }
        var nReapers = Number($('.reaper .amount').attr('data-value'));
        var nDestroyers = Number($('.destroyer .amount').attr('data-value'));
        var nBattlecruisers = Number($('.interceptor .amount').attr('data-value'));
        var nBattleships = Number($('.battleship .amount').attr('data-value'));
        var nCruisers = Number($('.cruiser .amount').attr('data-value'));
        if (nReapers > 0) {
          $('input[name=reaper]').val(1).keyup();
        } else if (nDestroyers > 0) {
          $('input[name=destroyer]').val(1).keyup();
        } else if (nBattlecruisers > 0) {
          $('input[name=interceptor]').val(1).keyup();
        } else if (nBattleships > 0) {
          $('input[name=battleship]').val(1).keyup();
        } else if (nCruisers > 0) {
          $('input[name=cruiser]').val(1).keyup();
        }
        var nProbe = Number($('.espionageProbe .amount').attr('data-value'));
        if (nProbe > 0) {
          $('input[name=espionageProbe]').val(1).keyup();
        }
        var maxBigTransport = Math.ceil(maxExpeditionPoints / shipPoints.transporterLarge);
        var maxSmallMetalDiscovery =
          50 *
          maxExpeditionPoints *
          config.universe.speed *
          (nExplorers > 0 ? 2 : 1) *
          ($('.characterclass.small.explorer').length ? 1.5 : 1);
        var maxBigTransportForSmallMetalDiscovery = Math.ceil(
          maxSmallMetalDiscovery / ((1 + (config.hyperspaceTech || 0) * 0.05) * 25000)
        );
        if (maxBigTransportForSmallMetalDiscovery > maxBigTransport) {
          maxBigTransport = maxBigTransportForSmallMetalDiscovery;
        }

        var ownedBigTransport = Number($('.transporterLarge .amount').attr('data-value'));

        var nBigTransport = Math.min(maxBigTransport, ownedBigTransport);
        $('input[name=transporterLarge]').val(nBigTransport).keyup();

        // select position 16
        $('input#position').val('16').keyup();
        // select system with offset
        var system = window._getCurrentPlanetCoordinates()[1] + (config.expeditionSystemOffset || 0);
        if (system > Number(config.universe.systems)) system = config.universe.systems;
        if (system < 1) system = 1;
        $('input#system').val(String(system)).keyup();

        // select expedition mission
        $('#missionButton15').click();
      };

      window.uipp_sendExpedition = function (event) {
        if (event.which == 2) {
          // middle mouse click
          $('#continueToFleet2').click();
          var intervalStart = setInterval(function () {
            var $btn = $('#sendFleet.on');
            if ($btn.length) {
              $btn.click();
              clearInterval(intervalStart);
            }
          }, 50);
          event.preventDefault();
          return false;
        }
      };

      window.uipp_autoFillMilitaryExpedition = function (event) {
        var expeSlotsUsed = $('#slots .fleft:nth-child(2)')
          .text()
          .match(/[0-9]+/g)[0];
        var expeSlotsTotal = $('#slots .fleft:nth-child(2)')
          .text()
          .match(/[0-9]+/g)[1];
        var fleetDivider = expeSlotsTotal - expeSlotsUsed || 1;

        [
          'fighterLight',
          'fighterHeavy',
          'cruiser',
          'battleship',
          'interceptor',
          'bomber',
          'destroyer',
          'reaper',
          'explorer',
          'transporterSmall',
          'transporterLarge',
          'espionageProbe'
        ].forEach(function (shipName) {
          var nShips = Number($('.' + shipName + ' .amount').attr('data-value'));
          if (nShips > 0) {
            $('input[name=' + shipName + ']')
              .val(Math.ceil(nShips / fleetDivider))
              .keyup();
          }
          if (shipName == 'explorer' && nShips > 0) {
            $('input[name=' + shipName + ']')
              .val(1)
              .keyup();
          }
          if (shipName == 'espionageProbe' && nShips > 0) {
            $('input[name=' + shipName + ']')
              .val(1)
              .keyup();
          }
        });

        // select position 16
        $('input#position').val('16').keyup();
        // select system with offset
        var system = window._getCurrentPlanetCoordinates()[1] + (config.expeditionSystemOffset || 0);
        if (system > Number(config.universe.systems)) system = config.universe.systems;
        if (system < 1) system = 1;
        $('input#system').val(String(system)).keyup();

        // select expedition mission
        $('#missionButton15').click();

        event.preventDefault();
        return false;
      };
    }
  }, 100);
};
