var fn = function () {
  'use strict';
  window._addTabNeighbors = function _addTabNeighbors() {
    var $neighboursEntry = $('<li class="neighbours enhanced"><span class="menu_icon"><div class="customMenuEntry4 menuImage defense"></div></span><a class="menubutton" href="#" accesskey="" target="_self"><span class="textlabel enhancement">' + _translate('MENU_NEIGHBOURS_ACTIVE') + '</span></a></li>');
    $('#menuTable').append($neighboursEntry);
    $neighboursEntry.click(function () {
      // ui changes
      $('.menubutton.selected').removeClass('selected');
      $('.menuImage.highlighted').removeClass('highlighted');
      $('.neighbours .menubutton').addClass('selected');
      $('.customMenuEntry4').addClass('highlighted');

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
      for (var playerId in config.players) {
        var player = config.players[playerId];
        if (!player.status || !/[iv]/i.test(player.status)) {
          for (var i in player.planets) {
            var planet = player.planets[i];
            if (planet.coords[0] === myCoords[0] && Math.abs(planet.coords[1] - myCoords[1]) < 50) {
              neighbours.push({
                id: playerId,
                name: player.name,
                coords: planet.coords,
                militaryScore: player.militaryScore,
                economyScore: player.economyScore,
                ships: player.ships
              });
            }
          }
        }
      }

      //neighbours.sort(function(a, b){return Math.abs(a.coords[1]-myCoords[1])-Math.abs(b.coords[1]-myCoords[1])});
      neighbours.sort(function (a, b) {
        return b.militaryScore - a.militaryScore;
      });

      var $wrapper = $('<div class="uiEnhancementWindow"></div>');
      var $table = $('<table><tr><th>' + _translate('COORDINATES') + '</th><th>' + _translate('ECONOMY_SCORE') + '</th><th>' + _translate('MILITARY_SCORE') + '</th><th>' + _translate('PLAYER') + '</th><th>' + _translate('NOTE') + '</th><th>' + _translate('ACTIONS') + '</th></tr></table>');
      var playerName = $('#playerName .textBeefy').text().trim();
      for (var i = 0; i < neighbours.length; i++) {
        var $el = $('<tr class="' + (playerName === neighbours[i].name ? 'currentPlayer' : '') + '" id="planet_' + neighbours[i].coords[0] + '_' + neighbours[i].coords[1] + '_' + neighbours[i].coords[2] + '"></tr>');
        $el.append($('<td><a href="/game/index.php?page=galaxy&galaxy=' + neighbours[i].coords[0] + '&system=' + neighbours[i].coords[1] + '&position=' + neighbours[i].coords[2] + '">[' + neighbours[i].coords[0] + ':' + neighbours[i].coords[1] + ':' + neighbours[i].coords[2] + ']</a></td>'));
        $el.append($('<td class="tooltip js_hideTipOnMobile" title="' + _translate('ECONOMY_SCORE_LONG', {
          noBold: true,
          scoreEco: neighbours[i].economyScore
        }) + '"><a href="?page=highscore&searchRelId=' + neighbours[i].id + '&category=1&type=1">' + uipp_scoreHumanReadable(neighbours[i].economyScore) + '</a></td>'));
        $el.append($('<td class="tooltip js_hideTipOnMobile" title="' + _translate('MILITARY_SCORE_LONG', {
          noBold: true,
          scoreMilitary: neighbours[i].militaryScore,
          ships: (neighbours[i].ships ? neighbours[i].ships : '0')
        }) + '"><a href="?page=highscore&searchRelId=' + neighbours[i].id + '&category=1&type=3">' + uipp_scoreHumanReadable(neighbours[i].militaryScore) + ' (' + _num(neighbours[i].ships ? neighbours[i].ships : '0') + ')</a></td>'));
        $el.append($('<td class="tooltip js_hideTipOnMobile" title="' + neighbours[i].name + '">' + neighbours[i].name + '</td>'));
        $el.append($('<td width="100%"><input value="' + (config && config.planetNotes && config.planetNotes[neighbours[i].coords[0] + ':' + neighbours[i].coords[1] + ':' + neighbours[i].coords[2]] ? config.planetNotes[neighbours[i].coords[0] + ':' + neighbours[i].coords[1] + ':' + neighbours[i].coords[2]] : '') + '" onkeyup="_editNote(' + neighbours[i].coords[0] + ',' + neighbours[i].coords[1] + ',' + neighbours[i].coords[2] + ',this.value);return false;" style="width:96.5%;" type="text"/></td>'));
        $el.append($('<td> <a espionage" href="javascript:void(0);" onclick="_spy(' + neighbours[i].coords[0] + ',' + neighbours[i].coords[1] + ',' + neighbours[i].coords[2] + ');return false;"><span class="icon icon_eye"></span></a>&nbsp;<a href="javascript:void(0);" onclick="_toggleIgnorePlanet(' + neighbours[i].coords[0] + ',' + neighbours[i].coords[1] + ',' + neighbours[i].coords[2] + ')"><span class="icon icon_against"></span></a>&nbsp; <a href="?page=fleet1&galaxy=' + neighbours[i].coords[0] + '&system=' + neighbours[i].coords[1] + '&position=' + neighbours[i].coords[2] + '&type=1&mission=1" onclick="$(this).find(\'.icon\').removeClass(\'icon_fastforward\').addClass(\'icon_checkmark\');" target="_blank"><span class="icon icon_fastforward"></span></a> </td>'));
        if (config && config.ignoredPlanets && config.ignoredPlanets[neighbours[i].coords[0] + ':' + neighbours[i].coords[1] + ':' + neighbours[i].coords[2]]) {
          $el.addClass('ignore');
        }

        // note : we could use sendShips(mission, galaxy, system, position, type, shipCount)

        $table.append($el);
      }

      $wrapper.append($table);

      // insert html
      var $eventboxContent = $('#eventboxContent');
      $('#contentWrapper').html($eventboxContent);
      $('#contentWrapper').append($wrapper);
    });
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
