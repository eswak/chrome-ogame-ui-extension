var fn = function () {
  'use strict';

  window._addTabIdlePlayers = function _addTabIdlePlayers () {
    var $entry = $('<li class="idles enhanced"><span class="menu_icon"><div class="menuImage galaxy"></div></span><a class="menubutton" href="#" accesskey="" target="_self" ><span class="textlabel enhancement">' + window._translate('MENU_NEIGHBOURS_INACTIVE') + '</span></a></li>');
    $('#menuTable').append($entry);
    $entry.click(function () {
      var $wrapper = window._onMenuClick('idles');
      if (!$wrapper) return;

      window.uipp_analytics('uipp-tab-click', 'idle-players');

      var myCoords = window._getCurrentPlanetCoordinates();

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
      window.config.combustionDrive = window.config.combustionDrive || 0;
      var V = 7500 * (1 + 0.1 * window.config.combustionDrive);

      var idles = [];
      for (var playerId in window.config.players) {
        var player = window.config.players[playerId];
        if (player.status === 'i' || player.status === 'I') {
          for (var i in player.planets) {
            var planet = player.planets[i];
            var dist = window.uipp_getDistance(planet.coords, myCoords);
            var flightTime = window.uipp_getFlightTime(V, dist) * 2;
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

      var $table = $([
        '<table class="uipp-table">',
        '<thead>',
        '<tr>',
        '<th onclick="uipp_analytics(\'uipp-sort\', \'coordinates\');">' + window._translate('COORDINATES') + '</th>',
        '<th onclick="uipp_analytics(\'uipp-sort\', \'flight-time\');" class="tooltip" title="' + window._translate('RETURN_TRIP_DURATION') + '"><img src="https://gf2.geo.gfsrv.net/cdna2/89624964d4b06356842188dba05b1b.gif" style="transform:scale(1.6);margin-bottom:-4px;"/></th>',
        '<th onclick="uipp_analytics(\'uipp-sort\', \'economy-score\');"><span class="navButton uipp-score" id="economy"></span></th>',
        '<th onclick="uipp_analytics(\'uipp-sort\', \'military-score\');"><span class="navButton uipp-score" id="fleet"></span></th>',
        '<th onclick="uipp_analytics(\'uipp-sort\', \'player-name\');">' + window._translate('PLAYER') + '</th>',
        '<th onclick="uipp_analytics(\'uipp-sort\', \'note\');">' + window._translate('NOTE') + '</th>',
        '<th>' + window._translate('ACTIONS') + '</th>',
        '</tr>',
        '</thead>',
        '<tbody></tbody>',
        '</table>'
      ].join(''));
      var tbody = '';
      idles.forEach(function (idle) {
        var tr = '<tr id="planet_' + idle.coords[0] + '_' + idle.coords[1] + '_' + idle.coords[2] + '"  data-filter-flight-time="' + idle.flightTime + '" data-filter-economy-score="' + idle.economyScore + '" data-filter-military-score="' + idle.militaryScore + '">';

        var td = '';
        td += '<td><a href="/game/index.php?page=galaxy&galaxy=' + idle.coords[0] + '&system=' + idle.coords[1] + '&position=' + idle.coords[2] + '">[' + idle.coords[0] + ':' + idle.coords[1] + ':' + idle.coords[2] + ']</a></td>';
        td += '<td style="white-space:nowrap" data-value="' + idle.flightTime + '">' + window._time(idle.flightTime) + '</td>';
        td += '<td data-value="' + idle.economyScore + '"><a class="tooltip js_hideTipOnMobile" href="?page=highscore&searchRelId=' + idle.id + '&category=1&type=1" title="' + window._translate('ECONOMY_SCORE_LONG', {
          noBold: true,
          scoreEco: idle.economyScore
        }) + '">' + window.uipp_scoreHumanReadable(idle.economyScore) + '</a></td>';
        td += '<td class="tooltip js_hideTipOnMobile" data-value="' + idle.militaryScore + '" title="' + window._translate('MILITARY_SCORE_LONG', {
          noBold: true,
          scoreMilitary: idle.militaryScore,
          ships: (idle.ships ? idle.ships : '0')
        }) + '" style="white-space: nowrap"><a href="?page=highscore&searchRelId=' + idle.id + '&category=1&type=3">' + window.uipp_scoreHumanReadable(idle.militaryScore) + ' (' + window.uipp_scoreHumanReadable(idle.ships ? idle.ships : '0') + ')</a></td>';
        td += '<td class="tooltip js_hideTipOnMobile" title="' + idle.name + '">' + idle.name + '</td>';
        td += '<td style="width: 260px"><input value="' + (window.config && window.config.planetNotes && window.config.planetNotes[idle.coords[0] + ':' + idle.coords[1] + ':' + idle.coords[2]] ? window.config.planetNotes[idle.coords[0] + ':' + idle.coords[1] + ':' + idle.coords[2]] : '') + '" onkeyup="_editNote(' + idle.coords[0] + ',' + idle.coords[1] + ',' + idle.coords[2] + ',this.value);return false;" style="width:96.5%;" type="text"/></td>';
        td += '<td><a class="tooltip js_hideTipOnMobile espionage" title="" href="javascript:void(0);" onclick="_spy(' + idle.coords[0] + ',' + idle.coords[1] + ',' + idle.coords[2] + ');return false;"><span class="icon icon_eye"></span></a>&nbsp;<a href="javascript:void(0);" onclick="_toggleIgnorePlanet(' + idle.coords[0] + ',' + idle.coords[1] + ',' + idle.coords[2] + ')"><span class="icon icon_against"></span></a>&nbsp;<a href="?page=fleet1&galaxy=' + idle.coords[0] + '&system=' + idle.coords[1] + '&position=' + idle.coords[2] + '&type=1&mission=1" onclick="$(this).find(\'.icon\').removeClass(\'icon_fastforward\').addClass(\'icon_checkmark\');uipp_analytics(\'uipp-attack-idle\', 1);" target="_blank"><span class="icon icon_fastforward"></span></a></td>';
        tr += td + '</tr>';
        if (window.config && window.config.ignoredPlanets && window.config.ignoredPlanets[idle.coords[0] + ':' + idle.coords[1] + ':' + idle.coords[2]]) {
          tr = $(tr).addClass('ignore').wrapAll('<div>').parent().html();
        }
        tbody += tr;
      });
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

      $wrapper.append($([
        '<div style="border:1px dashed red;padding:5px;margin:5px;">',
        '<div style="font-size:16px;font-weight:bold;margin-bottom:5px;">Important notice (2017-08-22)</div>',
        'Hi ! I’m the creator of OGame UI++.<br>',
        'Next week, this extension will evolve to comply with GameForge’s rules about extension features.<br>',
        'After the next update, this extension’s content will be reviewed by the OGame staff, so you’ll be safe to use it as much as you want without risking to get your account banned :-)<br>',
        '<br>Sadly, this also means that some features need to disappear. Here’s what will change :<br>',
        '<ul>',
        '<li> - No more "maximum buildable" on ships & defenses : that feature is available if you subscribe to commander.</li>',
        '<li> - No more "time before being able to build" (the rectangle & time around resources cost of mines etc) : also a commander feature.</li>',
        '<li> - No listing of players in the whole universe</li>',
        '</ul>',
        '<br>Yes : that means that the 2 tabs with idle players & active neighbours will need to be removed :-(<br>',
        '<br>If you still want to use the 2 tabs of idle players & active neighbours, I will publish these in a separate extension on the chrome store named "OGame Nearby Players".',
        '<br>In this extension’s description text, it will be clearly said that the feature is not approved by Gameforge staff, and that you risk to get banned for using it.<br>',
        '<br>We still have ideas for new exciting features that will (we think) convince you to stay on the light side of the force, so stay in touch ^^<br>',
        '<br>Have a nice day,<br>',
        'OGame UI++ contributors',
        '<br><br><br>',
        'PS: Feel free to suggest new features, contribute code, or fork an old version on our <a style="color:#AB7AFF" target="_blank" href="https://github.com/eswak/chrome-ogame-ui-extension">Github</a>.',
        '</div>'
      ].join('')));

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
          is: function () { return false; },
          type: 'numeric',
          format: function (s, table, cell) {
            return Number($(cell).attr('data-value') || '0');
          }
        });

        $.tablesorter.addParser({
          id: 'coordinate',
          is: function () { return false; },
          type: 'numeric',
          format: function (s, table, cell) {
            var coordinates = $(cell).text().replace('[', '').replace(']', '').split(':').map(Number);
            return coordinates[0] * 1e6 + coordinates[1] * 1e3 + coordinates[2];
          }
        });

        $.tablesorter.addParser({
          id: 'input-value',
          is: function () { return false; },
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

      window._insertHtml($wrapper);
    });

    window.filterTable = function filterTable (attribute, minValue, maxValue, $table, $filterBar) {
      if (!$table || !$table.length) {
        $table = $('.uipp-table');
      }
      if (!$filterBar || !$filterBar.length) {
        $filterBar = $('.uipp-filterbar');
      }

      window.config.idleFilters[attribute] = [minValue, maxValue];
      window._saveConfig();

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
