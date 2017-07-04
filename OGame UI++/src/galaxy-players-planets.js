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

        $(this).append($('<div style="float:right;"><ul>' + playerPlanets.map(function (planet) {
          return '<li class="enhancement">[<a href="/game/index.php?page=galaxy&galaxy=' + planet.coords[0] + '&system=' + planet.coords[1] + '&position=' + planet.coords[2] + '">' +
            planet.coords[0] + ':' + planet.coords[1] + ':' + planet.coords[2] + '</a>] ' +
            planet.name +
            '</li>';
        }).join('') + '</ul></div>'));
      });
    }, 100);
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
