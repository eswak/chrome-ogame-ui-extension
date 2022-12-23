'use strict';
window._addGalaxyPlayersPlanetsInterval = function _addGalaxyPlayersPlanetsInterval() {
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

      // parse player planets from galaxy view
      // this is useful in the first week of the universe, when the universe api is not
      // updated, or in older universes when a player recently colonized a planet since
      // less than a week.
      var $galaxyRow = $(this).parent().parent().parent();
      var galaxy = $('#galaxy_input').val();
      var system = $('#system_input').val();
      var position = $galaxyRow.find('.galaxyCell.cellPosition').text();
      var planetName = $galaxyRow.find('.cellPlanetName').text();
      var moon = ($galaxyRow.find('.cellMoon').html() || '').length > 0 ? 1 : 0;
      var planetFound = (window.config.players[playerId].planets || []).reduce(function (found, planet) {
        if (planet.coords.join(',') == [galaxy, system, position].join(',')) {
          found = true;
        }
        return found;
      }, false);
      if (!planetFound) {
        window.config.players[playerId].planets.push({
          name: planetName,
          coords: [galaxy, system, position].map(Number),
          moon: moon
        });
        window._savePlayers();
      }

      var playerPlanets = player.planets;

      $(this).append(
        $(
          [
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
            ' ' + window.uipp_scoreHumanReadable(player.ships || 0),
            '</span>',
            '<br>',

            // planets
            '<ul>',
            playerPlanets
              .sort(function (a, b) {
                if (a.coords[0] > b.coords[0]) {
                  return 1;
                } else if (a.coords[0] < b.coords[0]) {
                  return -1;
                } else if (a.coords[1] > b.coords[1]) {
                  return 1;
                } else if (a.coords[1] < b.coords[1]) {
                  return -1;
                } else if (a.coords[2] > b.coords[2]) {
                  return 1;
                } else if (a.coords[2] < b.coords[2]) {
                  return -1;
                } else return 0;
              })
              .map(function (planet) {
                return [
                  '<li class="enhancement">',
                  planet.moon
                    ? '<img src="https://gf3.geo.gfsrv.net/cdn87/c9643df71b262232a4d66e591f7543.gif" style="margin-left: -14px; margin-right: 2px; height: 12px; vertical-align: -3px;" />'
                    : '',
                  '[<a href="/game/index.php?page=ingame&component=galaxy&galaxy=',
                  planet.coords[0] + '&system=' + planet.coords[1] + '&position=' + planet.coords[2] + '">',
                  planet.coords[0] + ':' + planet.coords[1] + ':' + planet.coords[2],
                  '</a>] ',
                  planet.name,
                  '</li>'
                ].join('');
              })
              .join(''),
            '</ul>',
            '</div>'
          ].join('')
        )
      );
    });
  }, 100);
};
