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
      '<div>',
        '<table class="uipp-table">',
          '<thead id="highscoreContent">',
            '<tr>',
              '<th>' + _translate('PLAYER') + '</th>',
              '<th><span class="navButton uipp-score" id="points"></span></th>',
              '<th><span class="navButton uipp-score" id="fleet"></span></th>',
              '<th><span class="navButton uipp-score" id="economy"></span></th>',
              '<th>' + _translate('PLANETS') + '</th>',
            '</tr>',
          '</thead>',
          '<tbody>',
            alliancePlayers.map(function (player, i) {
              return [
                '<tr>',
                  '<td class="' + ($('[name=ogame-player-id]').attr('content') === player.id ? 'enhancement' : '') + '">' + player.name + '</td>',
                  '<td>' + player.globalScore + ' ' + _getPlayerHistoryChart(player.id, 'g') + '</td>',
                  '<td class="tooltip js_hideTipOnMobile" title="' + _translate('MILITARY_SCORE_LONG', {
                    noBold: true,
                    scoreMilitary: player.militaryScore,
                    ships: (player.ships ? player.ships : '0')
                  }) + '">' + player.militaryScore + ' ' + _getPlayerHistoryChart(player.id, 'm') + '</td>',
                  '<td>' + player.economyScore + ' ' + _getPlayerHistoryChart(player.id, 'e') + '</td>',
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
      $('table.uipp-table').tablesorter({ cancelSelection: true, sortList: [[1, 1]] });
    }, 100);
  };

  window._getPlayerHistoryChart = function _getPlayerHistoryChart(playerId, type) {
    var playerScores = [];
    for (var day in config.history[playerId]) {
      playerScores.push({
        t: day,
        v: config.history[playerId][day][type]
      });
    }

    if (playerScores.length < 3) {
      return '';
    }

    var maxScore = playerScores.reduce(function (max, score) {
      return score.v > max ? score.v : max;
    }, 0);

    return [
      '<div class="uipp-score">',
        playerScores.map(function (score) {
          return '<div class="uipp-score-bar tooltip" style="width: calc(' + (100 / playerScores.length) + '% - 1px); height:' + (score.v / maxScore) * 100 + '%" title="' + score.t + ' : ' + score.v + '"></div>';
        }).join(''),
      '</div>'
    ].join('');
  }
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
