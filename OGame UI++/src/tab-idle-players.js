var fn = function () {
  'use strict';
  window._addTabIdlePlayers = function _addTabIdlePlayers() {
    var $entry = $('<li class="idles enhanced"><span class="menu_icon"><div class="customMenuEntry menuImage galaxy"></div></span><a class="menubutton" href="#" accesskey="" target="_self"><span class="textlabel enhancement">' + _translate('MENU_NEIGHBOURS_INACTIVE') + '</span></a></li>');
    $('#menuTable').append($entry);
    $entry.click(function () {
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

      var idles = [];
      for (var playerId in config.players) {
        var player = config.players[playerId];
        if (player.status === 'i' || player.status === 'I') {
          for (var i in player.planets) {
            var planet = player.planets[i];
            if (planet.coords[0] === myCoords[0] && Math.abs(planet.coords[1] - myCoords[1]) < 100) {
              idles.push({
                id: playerId,
                name: player.name,
                coords: planet.coords,
                position: player.economyPosition
              });
            }
          }
        }
      }

      idles.sort(function (a, b) {
        return a.position - b.position;
      });

      var $wrapper = $('<div class="uiEnhancementWindow"></div>');
      var $table = $('<table><tr><th>' + _translate('ECONOMY_SCORE') + '</th><th>' + _translate('COORDINATES') + '</th><th>' + _translate('PLAYER') + '</th><th>' + _translate('NOTE') + '</th><th>' + _translate('ACTIONS') + '</th></tr></table>');
      for (var i = 0; i < idles.length; i++) {
        var $el = $('<tr id="planet_' + idles[i].coords[0] + '_' + idles[i].coords[1] + '_' + idles[i].coords[2] + '"></tr>');
        $el.append($('<td><a href="?page=highscore&searchRelId=' + idles[i].id + '&category=1&type=1">' + idles[i].position + '</a></td>'));
        $el.append($('<td><a href="/game/index.php?page=galaxy&galaxy=' + idles[i].coords[0] + '&system=' + idles[i].coords[1] + '&position=' + idles[i].coords[2] + '">[' + idles[i].coords[0] + ':' + idles[i].coords[1] + ':' + idles[i].coords[2] + ']</a></td>'));
        $el.append($('<td>' + idles[i].name + '</td>'));
        $el.append($('<td width="100%"><input value="' + (config && config.planetNotes && config.planetNotes[idles[i].coords[0] + ':' + idles[i].coords[1] + ':' + idles[i].coords[2]] ? config.planetNotes[idles[i].coords[0] + ':' + idles[i].coords[1] + ':' + idles[i].coords[2]] : '') + '" onkeyup="_editNote(' + idles[i].coords[0] + ',' + idles[i].coords[1] + ',' + idles[i].coords[2] + ',this.value);return false;" style="width:96.5%;" type="text"/></td>'));
        $el.append($('<td><a class="tooltip js_hideTipOnMobile espionage" title="" href="javascript:void(0);" onclick="_spy(' + idles[i].coords[0] + ',' + idles[i].coords[1] + ',' + idles[i].coords[2] + ');return false;"><span class="icon icon_eye"></span></a>&nbsp;<a href="javascript:void(0);" onclick="_toggleIgnorePlanet(' + idles[i].coords[0] + ',' + idles[i].coords[1] + ',' + idles[i].coords[2] + ')"><span class="icon icon_against"></span></a>&nbsp;<a href="?page=fleet1&galaxy=' + idles[i].coords[0] + '&system=' + idles[i].coords[1] + '&position=' + idles[i].coords[2] + '&type=1&mission=1" onclick="$(this).find(\'.icon\').removeClass(\'icon_fastforward\').addClass(\'icon_checkmark\');" target="_blank"><span class="icon icon_fastforward"></span></a></td>'));
        if (config && config.ignoredPlanets && config.ignoredPlanets[idles[i].coords[0] + ':' + idles[i].coords[1] + ':' + idles[i].coords[2]]) {
          $el.addClass('ignore');
        }

        $table.append($el);
      }

      $wrapper.append($table);

      if (idles.length === 0) {
        $wrapper.append($('<div style="text-align: center; font-size: 16px; padding-top: 1em;">No idles yet</div>'));
      }

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
