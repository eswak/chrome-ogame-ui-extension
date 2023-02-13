'use strict';
window._addAllianceTable = function _addAllianceTable() {
  if (document.location.href.indexOf('component=alliance') === -1) {
    return;
  }

  // add content only once
  var $el = $('body #alliance:not(.enhanced)');
  if ($el.length !== 1) {
    return;
  }

  $el.addClass('enhanced');

  var alliancePlayers = [];
  var myPlayerId = $('[name=ogame-player-id]').attr('content');
  var myAllianceId = $('[name=ogame-alliance-id]').attr('content');
  var addedSelf = false;
  for (var key in window.config.players) {
    var player = window.config.players[key];
    player.id = key;
    if (player.alliance && player.alliance === myAllianceId) {
      if (key == myPlayerId) {
        addedSelf = true;
      }
      alliancePlayers.push(player);
    }
  }
  if (!addedSelf) {
    alliancePlayers.push(window.config.players[myPlayerId]);
  }

  if (!alliancePlayers.length) {
    return;
  }

  var tabhtml = [
    '<div class="uipp-box" style="margin-bottom: 3em">',
    '<h3>' + window._translate('ALLIANCE_PLAYER_SCORES') + '</h3>',
    '<table class="uipp-table bordered">',
    '<thead>',
    '<tr>',
    '<th>' + window._translate('PLAYER') + '</th>',
    '<th><img src="' + uipp_images.score.global + '" style="height:26px"/></th>',
    '<th>⇵</th>',
    '<th><img src="' + uipp_images.score.military + '" style="height:26px"/></th>',
    '<th>⇵</th>',
    '<th><img src="' + uipp_images.score.fleet + '" style="height:26px"/></th>',
    '<th>⇵</th>',
    '<th><img src="' + uipp_images.score.economy + '" style="height:26px"/></th>',
    '<th>⇵</th>',
    '<th>' + window._translate('PLANETS') + '</th>',
    '</tr>',
    '</thead>',
    '<tbody>',
    alliancePlayers
      .map(function (alliancePlayer) {
        return [
          '<tr>',
          '<td id="player-id-' +
            alliancePlayer.id +
            '" class="' +
            ($('[name=ogame-player-id]').attr('content') === alliancePlayer.id ? 'enhancement' : '') +
            '">' +
            alliancePlayer.name +
            '</td>',
          '<td data-value="' + alliancePlayer.globalScore + '">',
          window.uipp_scoreHumanReadable(alliancePlayer.globalScore) + '</td>',
          '<td data-value="' +
            window._getPlayerScoreTrend(alliancePlayer.id, 'g', 2, 3).n +
            '">' +
            window._getPlayerScoreTrend(alliancePlayer.id, 'g', 2, 3).html +
            '</td>',
          '<td data-value="' + alliancePlayer.militaryScore + '">',
          window.uipp_scoreHumanReadable(alliancePlayer.militaryScore) + '</td>',
          '<td data-value="' +
            window._getPlayerScoreTrend(alliancePlayer.id, 'm', 2, 3).n +
            '">' +
            window._getPlayerScoreTrend(alliancePlayer.id, 'm', 2, 3).html +
            '</td>',
          '<td data-value="' + (alliancePlayer.ships || 0) + '">',
          window.uipp_scoreHumanReadable(alliancePlayer.ships || 0) + '</td>',
          '<td data-value="' +
            window._getPlayerScoreTrend(alliancePlayer.id, 's', 2, 3).n +
            '">' +
            window._getPlayerScoreTrend(alliancePlayer.id, 's', 2, 3).html +
            '</td>',
          '<td data-value="' + alliancePlayer.economyScore + '">',
          window.uipp_scoreHumanReadable(alliancePlayer.economyScore) + '</td>',
          '<td data-value="' +
            window._getPlayerScoreTrend(alliancePlayer.id, 'e', 2, 3).n +
            '">' +
            window._getPlayerScoreTrend(alliancePlayer.id, 'e', 2, 3).html +
            '</td>',
          '<td data-value="' + alliancePlayer.planets.length + '">',
          '<span class="tooltip tooltipRel tooltipClose tooltipRight" rel="planets-' + alliancePlayer.id + '">',
          alliancePlayer.planets.length || '?',
          '</span>',
          '<div id="planets-' + alliancePlayer.id + '" style="display:none">',
          alliancePlayer.planets
            .map(function (planet) {
              return (
                "<a href='/game/index.php?page=ingame&component=galaxy&galaxy=" +
                planet.coords[0] +
                '&system=' +
                planet.coords[1] +
                '&position=' +
                planet.coords[2] +
                "'>[" +
                planet.coords.join(':') +
                ']</a>'
              );
            })
            .join('<br>'),
          '</div>',
          '</td>',
          '</tr>'
        ].join('');
      })
      .join(''),

    '</tbody>',
    '</table>',
    '</div>'
  ].join('');

  $el.append($(tabhtml));

  setTimeout(function () {
    $.tablesorter.addParser({
      id: 'attr-data-value',
      is: function () {
        return false;
      },
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
