var fn = function () {
  'use strict';

  window._addTabIdlePlayers = function _addTabIdlePlayers() {
    var $entry = $('<li class="idles enhanced"><span class="menu_icon"><div class="customMenuEntry menuImage galaxy"></div></span><a class="menubutton" href="#" accesskey="" target="_self" ><span class="textlabel enhancement">' + _translate('MENU_NEIGHBOURS_INACTIVE') + '</span></a></li>');
    $('#menuTable').append($entry);
    $entry.click(function () {
      uipp_analytics('uipp-tab-click', 'idle-players');
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
      var $table = $([
        '<table class="uipp-table">',
        '<thead>',
        '<tr>',
        '<th onclick="uipp_analytics(\'uipp-sort\', \'coordinates\');">' + _translate('COORDINATES') + '</th>',
        '<th onclick="uipp_analytics(\'uipp-sort\', \'flight-time\');" class="tooltip" title="' + _translate('RETURN_TRIP_DURATION') + '"><img src="https://gf2.geo.gfsrv.net/cdna2/89624964d4b06356842188dba05b1b.gif" style="transform:scale(1.6);margin-bottom:-4px;"/></th>',
        '<th onclick="uipp_analytics(\'uipp-sort\', \'economy-score\');"><span class="navButton uipp-score" id="economy"></span></th>',
        '<th onclick="uipp_analytics(\'uipp-sort\', \'military-score\');"><span class="navButton uipp-score" id="fleet"></span></th>',
        '<th onclick="uipp_analytics(\'uipp-sort\', \'player-name\');">' + _translate('PLAYER') + '</th>',
        '<th onclick="uipp_analytics(\'uipp-sort\', \'note\');">' + _translate('NOTE') + '</th>',
        '<th>' + _translate('ACTIONS') + '</th>',
        '</tr>',
        '</thead>',
        '<tbody></tbody>',
        '</table>'
      ].join(''));
      var tbody = '';
      for (var i = 0; i < idles.length; i++) {
        var tr = '<tr id="planet_' + idles[i].coords[0] + '_' + idles[i].coords[1] + '_' + idles[i].coords[2] + '"  data-filter-flight-time="' + idles[i].flightTime + '" data-filter-economy-score="' + idles[i].economyScore + '" data-filter-military-score="' + idles[i].militaryScore + '">';

        var td = '';
        td += '<td><a href="/game/index.php?page=galaxy&galaxy=' + idles[i].coords[0] + '&system=' + idles[i].coords[1] + '&position=' + idles[i].coords[2] + '">[' + idles[i].coords[0] + ':' + idles[i].coords[1] + ':' + idles[i].coords[2] + ']</a></td>';
        td += '<td style="white-space:nowrap" data-value="' + idles[i].flightTime + '">' + _time(idles[i].flightTime) + '</td>';
        td += '<td data-value="' + idles[i].economyScore + '"><a class="tooltip js_hideTipOnMobile" href="?page=highscore&searchRelId=' + idles[i].id + '&category=1&type=1" title="' + _translate('ECONOMY_SCORE_LONG', {
          noBold: true,
          scoreEco: idles[i].economyScore
        }) + '">' + uipp_scoreHumanReadable(idles[i].economyScore) + '</a></td>';
        td += '<td class="tooltip js_hideTipOnMobile" data-value="' + idles[i].militaryScore + '" title="' + _translate('MILITARY_SCORE_LONG', {
          noBold: true,
          scoreMilitary: idles[i].militaryScore,
          ships: (idles[i].ships ? idles[i].ships : '0')
        }) + '" style="white-space: nowrap"><a href="?page=highscore&searchRelId=' + idles[i].id + '&category=1&type=3">' + uipp_scoreHumanReadable(idles[i].militaryScore) + ' (' + uipp_scoreHumanReadable(idles[i].ships ? idles[i].ships : '0') + ')</a></td>';
        td += '<td class="tooltip js_hideTipOnMobile" title="' + idles[i].name + '">' + idles[i].name + '</td>';
        td += '<td style="width: 260px"><input value="' + (config && config.planetNotes && config.planetNotes[idles[i].coords[0] + ':' + idles[i].coords[1] + ':' + idles[i].coords[2]] ? config.planetNotes[idles[i].coords[0] + ':' + idles[i].coords[1] + ':' + idles[i].coords[2]] : '') + '" onkeyup="_editNote(' + idles[i].coords[0] + ',' + idles[i].coords[1] + ',' + idles[i].coords[2] + ',this.value);return false;" style="width:96.5%;" type="text"/></td>';
        td += '<td><a class="tooltip js_hideTipOnMobile espionage" title="" href="javascript:void(0);" onclick="_spy(' + idles[i].coords[0] + ',' + idles[i].coords[1] + ',' + idles[i].coords[2] + ');return false;"><span class="icon icon_eye"></span></a>&nbsp;<a href="javascript:void(0);" onclick="_toggleIgnorePlanet(' + idles[i].coords[0] + ',' + idles[i].coords[1] + ',' + idles[i].coords[2] + ')"><span class="icon icon_against"></span></a>&nbsp;<a href="?page=fleet1&galaxy=' + idles[i].coords[0] + '&system=' + idles[i].coords[1] + '&position=' + idles[i].coords[2] + '&type=1&mission=1" onclick="$(this).find(\'.icon\').removeClass(\'icon_fastforward\').addClass(\'icon_checkmark\');uipp_analytics(\'uipp-attack-idle\', 1);" target="_blank"><span class="icon icon_fastforward"></span></a></td>';
        tr += td + '</tr>';
        if (config && config.ignoredPlanets && config.ignoredPlanets[idles[i].coords[0] + ':' + idles[i].coords[1] + ':' + idles[i].coords[2]]) {
          tr = $(tr).addClass('ignore').wrapAll('<div>').parent().html();
        }
        tbody += tr;
      }
      $table.find('tbody').append(tbody);

      var $filterBar = $([
        '<div class="uipp-filterbar">',

        // flight duration filters
        '<span data-filter="flight-time">',
        '<img src="https://gf2.geo.gfsrv.net/cdna2/89624964d4b06356842188dba05b1b.gif"/>',
        [
          [null, 3600, '<1h'],
          [null, 2 * 3600, '<2h'],
          [null, 5 * 3600, '<5h'],
          [null, 8 * 3600, '<8h'],
          [8 * 3600, null, '>8h'],
        ].map(function (filter) {
          return [
            '<div class="uipp-filter" ',
            'onclick="filterTable(\'flight-time\', ' + filter[0] + ', ' + filter[1] + ');"',
            'data-attr="flight-time" data-min="' + filter[0] + '" data-max="' + filter[1] + '"',
            '>' + filter[2] + '</div>'
          ].join('');
        }).join(''),
        '</span>',

        // economy score filters
        '<span data-filter="economy-score">',
        '<span class="navButton uipp-score" id="economy" style="margin: -25px -18px -19px 40px; transform: scale(0.33);"></span>',
        [
          [0, 0, '0'],
          [1, null, '>0'],
          [1e2, null, '>100'],
          [1e3, null, '>1k'],
          [1e4, null, '>10k'],
          [1e5, null, '>100k'],
          [1e6, null, '>1M']
        ].map(function (filter) {
          return [
            '<div class="uipp-filter" ',
            'onclick="filterTable(\'economy-score\', ' + filter[0] + ', ' + filter[1] + ');"',
            'data-attr="economy-score" data-min="' + filter[0] + '" data-max="' + filter[1] + '"',
            '>' + filter[2] + '</div>'
          ].join('');
        }).join(''),
        '</span>',

        // military score filters
        '<span data-filter="military-score">',
        '<span class="navButton uipp-score" id="fleet" style="margin: -25px -18px -19px 40px; transform: scale(0.33);"></span>',
        [
          [0, 0, '0'],
          [1, null, '>0']
        ].map(function (filter) {
          return [
            '<div class="uipp-filter" ',
            'onclick="filterTable(\'military-score\', ' + filter[0] + ', ' + filter[1] + ');"',
            'data-attr="military-score" data-min="' + filter[0] + '" data-max="' + filter[1] + '"',
            '>' + filter[2] + '</div>'
          ].join('');
        }).join(''),
        '</span>',

        '</div>'
      ].join(''));

      $wrapper.append($filterBar);

      // persistent filters
      window.config.idleFilters = window.config.idleFilters || {
        'flight-time': [null, 5 * 3600],
        'economy-score': [1, null]
      };
      for (var key in window.config.idleFilters) {
        window.filterTable(key, window.config.idleFilters[key][0], window.config.idleFilters[key][1], $table, $filterBar);
      }

      $wrapper.append($table);


      if (idles.length === 0) {
        $wrapper.append($('<div style="text-align: center; font-size: 16px; padding-top: 1em;">No idles yet</div>'));
      } else {
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

        $.tablesorter.addParser({
          id: 'input-value',
          is: function (s) { return false; },
          type: 'text',
          format: function (s, table, cell) {
            var value = $(cell).find('input').attr('value');
            if (value) {
              return value;
            } else {
              return null;
            }
          }
        });

        $wrapper.find('table.uipp-table').tablesorter({
          cancelSelection: true,
          sortList: [[2, 1]],
          headers: {
            0: { sorter: 'coordinate' },
            1: { sorter: 'attr-data-value' },
            2: { sorter: 'attr-data-value' },
            3: { sorter: 'attr-data-value' },
            5: { sorter: 'input-value' }
          }
        });
      }

      // insert html
      var $eventboxContent = $('#eventboxContent');
      $('#contentWrapper').html($eventboxContent);
      $('#contentWrapper').append($wrapper);
    });

    window.filterTable = function filterTable(attribute, minValue, maxValue, $table, $filterBar) {
      if (!$table || !$table.length) {
        $table = $('.uipp-table');
      }
      if (!$filterBar || !$filterBar.length) {
        $filterBar = $('.uipp-filterbar');
      }

      window.config.idleFilters[attribute] = [minValue, maxValue];
      window._saveConfig(window.config);

      $filterBar.find('[data-filter="' + attribute + '"] .uipp-filter').removeClass('active');
      $filterBar.find(
        '.uipp-filter[data-attr="' + attribute + '"][data-min="' + minValue + '"][data-max="' + maxValue + '"]'
      ).addClass('active');

      minValue = minValue == null ? -Infinity : minValue;
      maxValue = maxValue == null ? Infinity : maxValue;

      $table.find('tr[data-filter-' + attribute + ']').each(function () {
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
