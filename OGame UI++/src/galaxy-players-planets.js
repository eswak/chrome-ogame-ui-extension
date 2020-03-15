var fn = function () {
  'use strict';
  window._addGalaxyPlayersPlanetsInterval = function _addGalaxyPlayersPlanetsInterval () {
    if (document.location.href.indexOf('galaxy') === -1) {
      return;
    }

    setInterval(function () {
      $('.htmlTooltip.galaxyTooltip:not(.enhanced)').each(function () {
        $(this).addClass('enhanced');

        var id = $(this).attr('id');
        if (id.indexOf('player') === -1) {
          return;
        }

        var playerId = id.replace('player', '');
        var player = window.config.players[playerId];
        if (!player) {
          return;
        }

        var playerPlanets = player.planets;
        if (!playerPlanets.length) {
          return;
        }

        $(this).append($([
          '<div style="float:right;padding-left:10px;">',

          // global score
          '<img src="' + uipp_images.score.global + '" style="height:20px"/>',
          '<span style="vertical-align:7px">',
          ' ' + window._getPlayerScoreTrend(playerId, 'g').html,
          ' ' + window.uipp_scoreHumanReadable(player.globalScore),
          '</span>',
          '<br>',

          // military score
          '<img src="' + uipp_images.score.military + '" style="height:20px"/>',
          '<span style="vertical-align:7px">',
          ' ' + window._getPlayerScoreTrend(playerId, 'm').html,
          ' ' + window.uipp_scoreHumanReadable(player.militaryScore),
          '</span>',
          '<br>',

          // economy score
          '<img src="' + uipp_images.score.economy + '" style="height:20px"/>',
          '<span style="vertical-align:7px">',
          ' ' + window._getPlayerScoreTrend(playerId, 'e').html,
          ' ' + window.uipp_scoreHumanReadable(player.economyScore),
          '</span>',
          '<br>',

          // research score
          '<img src="' + uipp_images.score.research + '" style="height:20px"/>',
          '<span style="vertical-align:7px">',
          ' ' + window._getPlayerScoreTrend(playerId, 'r').html,
          ' ' + window.uipp_scoreHumanReadable(player.researchScore),
          '</span>',
          '<br>',

          // ships score
          '<img src="' + uipp_images.score.fleet + '" style="height:20px"/>',
          '<span style="vertical-align:7px">',
          ' ' + window._getPlayerScoreTrend(playerId, 's').html,
          ' ' + window.uipp_scoreHumanReadable(player.ships),
          '</span>',
          '<br>',

          // planets
          '<ul>',
          playerPlanets.map(function (planet) {
            return [
              '<li class="enhancement">',
              '[<a href="/game/index.php?page=ingame&component=galaxy&galaxy=',
              planet.coords[0] + '&system=' + planet.coords[1] + '&position=' + planet.coords[2] + '">',
              planet.coords[0] + ':' + planet.coords[1] + ':' + planet.coords[2],
              '</a>] ',
              planet.name,
              '</li>'
            ].join('');
          }).join(''),
          '</ul>',
          '</div>'
        ].join('')));
      });
    }, 100);
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
