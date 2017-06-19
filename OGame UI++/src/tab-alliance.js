var fn = function () {
  'use strict';
  window._addTabAlliance = function _addTabAlliance() {
    if (document.location.href.indexOf('page=alliance') === -1) {
      return;
    }

    // add content only once
    var $el = $('body #alliance:not(.enhanced)');
    if ($el.length !== 1) {
      return;
    }

    $el.addClass('enhanced');

    var alliancePlayers = [];
    var myAllianceId = $('[name=ogame-alliance-id]').attr('content');
    for (var key in config.players) {
      var player = config.players[key];
      player.id = key;
      if (player.alliance && player.alliance === myAllianceId) {
        alliancePlayers.push(player);
      }
    }

    var tabhtml = [
      '<div style="float: left; margin-top: 2em;">',
        '<table class="uipp-table bordered">',
          '<thead id="highscoreContent">',
            '<tr>',
              '<th>' + _translate('PLAYER') + '</th>',
              '<th><span class="navButton uipp-score" id="points"></span></th>',
              '<th>⇵</th>',
              '<th><span class="navButton uipp-score" id="fleet"></span></th>',
              '<th>⇵</th>',
              '<th class="menu_icon"><span class="menuImage active fleet1" style="height: 27px; width: 27px; display: inline-block; margin-bottom: -5px;"></span></th>',
              '<th>⇵</th>',
              '<th><span class="navButton uipp-score" id="economy"></span></th>',
              '<th>⇵</th>',
              '<th>' + _translate('PLANETS') + '</th>',
            '</tr>',
          '</thead>',
          '<tbody>',
            alliancePlayers.map(function (player, i) {
              return [
                '<tr>',
                  '<td id="player-id-' + player.id + '" class="' + ($('[name=ogame-player-id]').attr('content') === player.id ? 'enhancement' : '') + '">' + player.name + '</td>',
                  '<td data-value="' + player.globalScore + '">' + player.globalScore + '</td>',
                  '<td data-value="' + _getPlayerScoreTrend(player.id, 'g').n + '">' + _getPlayerScoreTrend(player.id, 'g').html + '</td>',
                  '<td data-value="' + player.militaryScore + '">' + player.militaryScore + '</td>',
                  '<td data-value="' + _getPlayerScoreTrend(player.id, 'm').n + '">' + _getPlayerScoreTrend(player.id, 'm').html + '</td>',
                  '<td data-value="' + (player.ships || 0) + '">' + (player.ships || 0) + '</td>',
                  '<td data-value="' + _getPlayerScoreTrend(player.id, 's').n + '">' + _getPlayerScoreTrend(player.id, 's').html + '</td>',
                  '<td data-value="' + player.economyScore + '">' + player.economyScore + '</td>',
                  '<td data-value="' + _getPlayerScoreTrend(player.id, 'e').n + '">' + _getPlayerScoreTrend(player.id, 'e').html + '</td>',
                  '<td>',
                    player.planets.map(function (planet) {
                      return '<a href="/game/index.php?page=galaxy&galaxy=' + planet.coords[0] + '&system=' + planet.coords[1] + '&position=' + planet.coords[2] + '">[' + planet.coords.join(':') + ']</a>';
                    }).join(' '),

                  '</td>',
                '</tr>'
              ].join('');
            }).join(''),

          '</tbody>',
        '</table>',
      '</div>'
    ].join('');

    $el.append($(tabhtml));

    setTimeout(function () {
      $.tablesorter.addParser({
        id: 'attr-data-value',
        is: function (s) { return false; },
        type: 'numeric',
        format: function (s, table, cell) {
          return Number($(cell).attr('data-value') || '0');
        }
      });

      $('table.uipp-table').tablesorter({
        cancelSelection: true,
        sortList: [[1, 1]],
        headers: {
          1: { sorter: 'attr-data-value' },
          2: { sorter: 'attr-data-value' },
          3: { sorter: 'attr-data-value' },
          4: { sorter: 'attr-data-value' },
          5: { sorter: 'attr-data-value' },
          6: { sorter: 'attr-data-value' },
          7: { sorter: 'attr-data-value' },
          8: { sorter: 'attr-data-value' }
        }
      });
    });
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
