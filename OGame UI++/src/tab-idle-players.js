var fn = function () {
  'use strict';
  window._addTabIdlePlayers = function _addTabIdlePlayers() {
    var $entry = $('<li class="idles enhanced"><span class="menu_icon"><div class="customMenuEntry menuImage galaxy"></div></span><a class="menubutton" href="#" accesskey="" target="_self"><span class="textlabel enhancement">' + _translate('MENU_NEIGHBOURS_INACTIVE') + '</span></a></li>');
    $('#menuTable').append($entry);
    $entry.click(function () {
      // ui changes
      $('.menubutton.selected').removeClass('selected');
      $('.menuImage.highlighted').removeClass('highlighted');
      $('.idles .menubutton').addClass('selected');
      $('.customMenuEntry').addClass('highlighted');

      var myCoords = _getCurrentPlanetCoordinates();

      // finds nearby players by checking whether player is newbie or not
      if ($('.planetlink.active').length > 0) {
        myCoords = $('.planetlink.active').find('.planet-koords').text().replace('[', '').replace(']', '').split(':');
      } else {
        myCoords = $('.planetlink').find('.planet-koords').text().replace('[', '').replace(']', '').split(':');
      }

      myCoords[0] = parseInt(myCoords[0]);
      myCoords[1] = parseInt(myCoords[1]);
      myCoords[2] = parseInt(myCoords[2]);

      /* Speed of large transporter */
      config.combustionDrive = config.combustionDrive || 0;
      var V = 7500 * (1 + 0.1 * config.combustionDrive);

      var idles = [];
      for (var playerId in config.players) {
        var player = config.players[playerId];
        if (player.status === 'i' || player.status === 'I') {
          for (var i in player.planets) {
            var planet = player.planets[i];
            var dist = uipp_getDistance(planet.coords, myCoords);
            var flightTime = uipp_getFlightTime(V, dist) * 2;
            idles.push({
              id: playerId,
              name: player.name,
              coords: planet.coords,
              economyScore: player.economyScore,
              militaryScore: player.militaryScore,
              ships: player.ships,
              flightTime: flightTime
            });
          }
        }
      }

      var $wrapper = $('<div id="highscoreContent"></div>');
      var $table = $('<table class="uipp-table"><thead><tr><th>' + _translate('COORDINATES') + '</th><th class="tooltip" title="' + _translate('RETURN_TRIP_DURATION') + '"><img src="https://gf2.geo.gfsrv.net/cdna2/89624964d4b06356842188dba05b1b.gif" style="transform:scale(1.6);margin-bottom:-4px;"/></th><th><span class="navButton uipp-score" id="economy"></span></th><th><span class="navButton uipp-score" id="fleet"></span></th><th>' + _translate('PLAYER') + '</th><th>' + _translate('NOTE') + '</th><th>' + _translate('ACTIONS') + '</th></tr></thead><tbody></tbody></table>');
      for (var i = 0; i < idles.length; i++) {
        var $el = $('<tr id="planet_' + idles[i].coords[0] + '_' + idles[i].coords[1] + '_' + idles[i].coords[2] + '"  data-filter-flight-time="' + idles[i].flightTime + '" data-filter-economy-score="' + idles[i].economyScore + '" data-filter-military-score="' + idles[i].militaryScore + '"></tr>');
        $el.append($('<td><a href="/game/index.php?page=galaxy&galaxy=' + idles[i].coords[0] + '&system=' + idles[i].coords[1] + '&position=' + idles[i].coords[2] + '">[' + idles[i].coords[0] + ':' + idles[i].coords[1] + ':' + idles[i].coords[2] + ']</a></td>'));
        $el.append($('<td style="white-space:nowrap" data-value="' + idles[i].flightTime + '">' + _time(idles[i].flightTime) + '</td>'));
        $el.append($('<td data-value="' + idles[i].economyScore + '"><a class="tooltip js_hideTipOnMobile" href="?page=highscore&searchRelId=' + idles[i].id + '&category=1&type=1" title="' + _translate('ECONOMY_SCORE_LONG', {
          noBold: true,
          scoreEco: idles[i].economyScore
        }) + '">' + uipp_scoreHumanReadable(idles[i].economyScore) + '</a></td>'));
        $el.append($('<td class="tooltip js_hideTipOnMobile" data-value="' + idles[i].militaryScore + '" title="' + _translate('MILITARY_SCORE_LONG', {
          noBold: true,
          scoreMilitary: idles[i].militaryScore,
          ships: (idles[i].ships ? idles[i].ships : '0')
        }) + '" style="white-space: nowrap"><a href="?page=highscore&searchRelId=' + idles[i].id + '&category=1&type=3">' + uipp_scoreHumanReadable(idles[i].militaryScore) + ' (' + uipp_scoreHumanReadable(idles[i].ships ? idles[i].ships : '0') + ')</a></td>'));
        $el.append($('<td class="tooltip js_hideTipOnMobile" title="' + idles[i].name + '">' + idles[i].name + '</td>'));
        $el.append($('<td style="width: 260px"><input value="' + (config && config.planetNotes && config.planetNotes[idles[i].coords[0] + ':' + idles[i].coords[1] + ':' + idles[i].coords[2]] ? config.planetNotes[idles[i].coords[0] + ':' + idles[i].coords[1] + ':' + idles[i].coords[2]] : '') + '" onkeyup="_editNote(' + idles[i].coords[0] + ',' + idles[i].coords[1] + ',' + idles[i].coords[2] + ',this.value);return false;" style="width:96.5%;" type="text"/></td>'));
        $el.append($('<td><a class="tooltip js_hideTipOnMobile espionage" title="" href="javascript:void(0);" onclick="_spy(' + idles[i].coords[0] + ',' + idles[i].coords[1] + ',' + idles[i].coords[2] + ');return false;"><span class="icon icon_eye"></span></a>&nbsp;<a href="javascript:void(0);" onclick="_toggleIgnorePlanet(' + idles[i].coords[0] + ',' + idles[i].coords[1] + ',' + idles[i].coords[2] + ')"><span class="icon icon_against"></span></a>&nbsp;<a href="?page=fleet1&galaxy=' + idles[i].coords[0] + '&system=' + idles[i].coords[1] + '&position=' + idles[i].coords[2] + '&type=1&mission=1" onclick="$(this).find(\'.icon\').removeClass(\'icon_fastforward\').addClass(\'icon_checkmark\');" target="_blank"><span class="icon icon_fastforward"></span></a></td>'));
        if (config && config.ignoredPlanets && config.ignoredPlanets[idles[i].coords[0] + ':' + idles[i].coords[1] + ':' + idles[i].coords[2]]) {
          $el.addClass('ignore');
        }

        $table.find('tbody').append($el);
      }

      $wrapper.append($([
        '<div class="uipp-filterbar">',

          // flight duration filters
          '<span>',
          '<img src="https://gf2.geo.gfsrv.net/cdna2/89624964d4b06356842188dba05b1b.gif"/>',
            '<div class="uipp-filter" onclick="filterTable(this, \'flight-time\', null, 3600)">\<1h</div>',
            '<div class="uipp-filter" onclick="filterTable(this, \'flight-time\', null, 2 * 3600)">\<2h</div>',
            '<div class="uipp-filter" onclick="filterTable(this, \'flight-time\', null, 5 * 3600)">\<5h</div>',
            '<div class="uipp-filter" onclick="filterTable(this, \'flight-time\', null, 8 * 3600)">\<8h</div>',
            '<div class="uipp-filter" onclick="filterTable(this, \'flight-time\', 8 * 3600, null)">\>8h</div>',
          '</span>',

          // economy score filters
          '<span>',
            '<span class="navButton uipp-score" id="economy" style="margin: -25px -18px -19px 100px; transform: scale(0.33);"></span>',
            '<div class="uipp-filter" onclick="filterTable(this, \'economy-score\', 0, 0)">=0</div>',
            '<div class="uipp-filter" onclick="filterTable(this, \'economy-score\', 1, null)">\>0</div>',
            '<div class="uipp-filter" onclick="filterTable(this, \'economy-score\', 100, null)">\>100</div>',
            '<div class="uipp-filter" onclick="filterTable(this, \'economy-score\', 1000, null)">\>1000</div>',
          '</span>',

          // military score filters
          '<span>',
            '<span class="navButton uipp-score" id="fleet" style="margin: -25px -18px -19px 104px; transform: scale(0.33);"></span>',
            '<div class="uipp-filter" onclick="filterTable(this, \'military-score\', 0, 0)">=0</div>',
            '<div class="uipp-filter" onclick="filterTable(this, \'military-score\', 1, null)">\>0</div>',
          '</span>',
        '</div>'
      ].join('')));
      /*$wrapper.append($('<div class="btn_blue" onclick="$(\'#idles2\').click()">\<7h</div>'));
      $wrapper.append($('<div class="btn_blue" onclick="$(\'#idles3\').click()">\<8h</div>'));
      $wrapper.append($('<div class="btn_blue" onclick="$(\'#idles4\').click()">5h-8h</div>'));
      $wrapper.append($('<div class="btn_blue" onclick="$(\'#idles5\').click()">\>8h</div>'));
      $wrapper.append($('<div class="btn_blue" onclick="$(\'#idlesAll\').click()">All</div>'));*/
      $wrapper.append($table);

      if (idles.length === 0) {
        $wrapper.append($('<div style="text-align: center; font-size: 16px; padding-top: 1em;">No idles yet</div>'));
      } else {
        setTimeout(function () {
          $.tablesorter.addParser({
            id: 'attr-data-value',
            is: function (s) { return false; },
            type: 'numeric',
            format: function (s, table, cell) {
              return Number($(cell).attr('data-value') || '0');
            }
          });
          $.tablesorter.addParser({
            id: 'coordinate',
            is: function (s) { return false; },
            type: 'numeric',
            format: function (s, table, cell) {
              var coordinates = $(cell).text().replace('[', '').replace(']', '').split(':').map(Number);
              return coordinates[0] * 1e6 + coordinates[1] * 1e3 + coordinates[2];
            }
          });
          $('table.uipp-table').tablesorter({
            cancelSelection: true,
            sortList: [[2, 1]],
            headers: {
              0: { sorter: 'coordinate' },
              1: { sorter: 'attr-data-value' },
              2: { sorter: 'attr-data-value' },
              3: { sorter: 'attr-data-value' }
            }
          });
        }, 10);
      }

      // insert html
      var $eventboxContent = $('#eventboxContent');
      $('#contentWrapper').html($eventboxContent);
      $('#contentWrapper').append($wrapper);
    });

    window.filterTable = function filterTable(button, attribute, minValue, maxValue) {
      $(button).parent().find('.uipp-filter').removeClass('active');
      $(button).addClass('active');

      minValue = minValue == null ? -Infinity : minValue;
      maxValue = maxValue == null ? Infinity : maxValue;

      $('.uipp-table tr[data-filter-' + attribute + ']').each(function () {
        var $row = $(this);
        var attributes = '';
        for (var i in this.attributes) {
          attributes += this.attributes[i].name || '';
        }

        var value = Number($row.attr('data-filter-' + attribute));
        if (value < minValue || value > maxValue) {
          $row.css('display', 'none');
          $row.attr('data-active-filter-' + attribute, 'yes');
        } else {
          $row.attr('data-active-filter-' + attribute, null);
          attributes = attributes.replace('data-active-filter-' + attribute, '');
          if (attributes.indexOf('data-active-filter') === -1) {
            $row.css('display', 'table-row');
          }
        }
      });
    };
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
