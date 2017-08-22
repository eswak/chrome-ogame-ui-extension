var fn = function () {
  'use strict';

  window._addTabNeighbors = function _addTabNeighbors () {
    var $neighboursEntry = $('<li class="neighbours enhanced"><span class="menu_icon"><div class="menuImage defense"></div></span><a class="menubutton" href="#" accesskey="" target="_self"><span class="textlabel enhancement">' + window._translate('MENU_NEIGHBOURS_ACTIVE') + '</span></a></li>');
    $('#menuTable').append($neighboursEntry);
    $neighboursEntry.click(function () {
      var $wrapper = window._onMenuClick('neighbours');
      if (!$wrapper) return;

      window.uipp_analytics('uipp-tab-click', 'nearby-neighbors');

      // keeps player coordinates
      var myCoords = new Array(3);

      // finds nearby players by checking whether player is newbie or not
      if ($('.planetlink.active').length > 0) {
        myCoords = $('.planetlink.active').find('.planet-koords').text().replace('[', '').replace(']', '').split(':');
      } else {
        myCoords = $('.planetlink').find('.planet-koords').text().replace('[', '').replace(']', '').split(':');
      }

      myCoords[0] = parseInt(myCoords[0]);
      myCoords[1] = parseInt(myCoords[1]);
      myCoords[2] = parseInt(myCoords[2]);

      var neighbours = [];
      for (var playerId in window.config.players) {
        var player = window.config.players[playerId];
        if (!player.status || !/[iv]/i.test(player.status)) {
          for (var i in player.planets) {
            var planet = player.planets[i];
            if (planet.coords[0] === myCoords[0] && Math.abs(planet.coords[1] - myCoords[1]) < 50) {
              neighbours.push({
                id: playerId,
                name: player.name,
                coords: planet.coords,
                globalScore: player.militaryScore,
                militaryScore: player.militaryScore,
                militaryPosition: player.militaryPosition,
                economyScore: player.economyScore,
                ships: player.ships
              });
            }
          }
        }
      }

      var $table = $('<table class="uipp-table"><thead id="highscoreContent"><tr><th>' + window._translate('COORDINATES') + '</th><th><span class="navButton uipp-score" id="points"></th><th><span class="navButton uipp-score" id="economy"></th><th><span class="navButton uipp-score" id="fleet"></th><th>' + window._translate('PLAYER') + '</th><th>' + window._translate('NOTE') + '</th><th>' + window._translate('ACTIONS') + '</th></tr></thead><tbody></tbody></table>');
      var playerName = $('[name=ogame-player-name]').attr('content');

      var tbody = '';
      neighbours.forEach(function (neighbour) {
        var tr = '<tr id="planet_' + neighbour.coords[0] + '_' + neighbour.coords[1] + '_' + neighbour.coords[2] + '">';

        var td = '';
        td += '<td><a href="/game/index.php?page=galaxy&galaxy=' + neighbour.coords[0] + '&system=' + neighbour.coords[1] + '&position=' + neighbour.coords[2] + '">[' + neighbour.coords[0] + ':' + neighbour.coords[1] + ':' + neighbour.coords[2] + ']</a></td>';
        td += '<td data-value="' + window._getPlayerScoreTrend(neighbour.id, 'g').n + '">' + window._getPlayerScoreTrend(neighbour.id, 'g').html + '</td>';
        td += '<td class="tooltip js_hideTipOnMobile" title="' + window._translate('ECONOMY_SCORE_LONG', {
          noBold: true,
          scoreEco: neighbour.economyScore
        }) + '" data-value="' + neighbour.economyScore + '"><a href="?page=highscore&searchRelId=' + neighbour.id + '&category=1&type=1">' + window.uipp_scoreHumanReadable(neighbour.economyScore) + '</a></td>';
        td += '<td class="tooltip js_hideTipOnMobile" title="' + window._translate('MILITARY_SCORE_LONG', {
          noBold: true,
          scoreMilitary: neighbour.militaryScore,
          ships: (neighbour.ships ? neighbour.ships : '0')
        }) + '" style="white-space:nowrap" data-value="' + neighbour.militaryScore + '"><a href="?page=highscore&searchRelId=' + neighbour.id + '&category=1&type=3">' + window.uipp_scoreHumanReadable(neighbour.militaryScore) + ' (' + window.uipp_scoreHumanReadable(neighbour.ships ? neighbour.ships : '0') + ')</a></td>';
        td += '<td class="tooltip js_hideTipOnMobile" title="' + neighbour.name + '"><span class="' + (playerName === neighbour.name ? 'enhancement' : '') + '">' + neighbour.name + '</span></td>';
        td += '<td width="100%"><input value="' + (window.config && window.config.planetNotes && window.config.planetNotes[neighbour.coords[0] + ':' + neighbour.coords[1] + ':' + neighbour.coords[2]] ? window.config.planetNotes[neighbour.coords[0] + ':' + neighbour.coords[1] + ':' + neighbour.coords[2]] : '') + '" onkeyup="_editNote(' + neighbour.coords[0] + ',' + neighbour.coords[1] + ',' + neighbour.coords[2] + ',this.value);return false;" style="width:96.5%;" type="text"/></td>';
        td += '<td> <a espionage" href="javascript:void(0);" onclick="_spy(' + neighbour.coords[0] + ',' + neighbour.coords[1] + ',' + neighbour.coords[2] + ');return false;"><span class="icon icon_eye"></span></a>&nbsp;<a href="javascript:void(0);" onclick="_toggleIgnorePlanet(' + neighbour.coords[0] + ',' + neighbour.coords[1] + ',' + neighbour.coords[2] + ')"><span class="icon icon_against"></span></a>&nbsp; <a href="?page=fleet1&galaxy=' + neighbour.coords[0] + '&system=' + neighbour.coords[1] + '&position=' + neighbour.coords[2] + '&type=1&mission=1" onclick="$(this).find(\'.icon\').removeClass(\'icon_fastforward\').addClass(\'icon_checkmark\');" target="_blank"><span class="icon icon_fastforward"></span></a> </td>';

        tr += td + '</tr>';
        if (window.config && window.config.ignoredPlanets && window.config.ignoredPlanets[neighbour.coords[0] + ':' + neighbour.coords[1] + ':' + neighbour.coords[2]]) {
          tr = $(tr).addClass('ignore').wrapAll('<div>').parent().html();
        }

        // note : we could use sendShips(mission, galaxy, system, position, type, shipCount)

        tbody += tr;
      });

      $table.find('tbody').append(tbody);

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
        '<br><br><br><a style="color:#AB7AFF" target="_blank" href="https://chrome.google.com/webstore/detail/ogame-nearby-players/knaaglboaiokbmjlkgnngoaadfplkdgm">"OGame Nearby Players" on Google Store</a>',
        '</div>'
      ].join('')));
      $wrapper.append($table);

      setTimeout(function () {
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
        $('table.uipp-table').tablesorter({
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
      }, 10);

      window._insertHtml($wrapper);
    });
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
