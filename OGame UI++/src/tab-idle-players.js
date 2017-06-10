var fn = function () {
  'use strict';
  window._addTabIdlePlayers = function _addTabIdlePlayers() {
    var $entry = $('<li class="idles enhanced"><span class="menu_icon"><div class="customMenuEntry menuImage galaxy"></div></span><a class="menubutton" href="#" accesskey="" target="_self"><span class="textlabel enhancement">' + _translate('MENU_NEIGHBOURS_INACTIVE') + '</span></a></li>');
    $('#menuTable').append($entry);
    $entry.click(function () {
		_nearbyIdles(0,3);
	});

	
	$('#menuTable').append($('<div id="idles1"></div>').click(function () { _nearbyIdles(0,3); }));
	$('#menuTable').append($('<div id="idles2"></div>').click(function () { _nearbyIdles(0,4); }));
	$('#menuTable').append($('<div id="idles3"></div>').click(function () { _nearbyIdles(0,8); }));
	$('#menuTable').append($('<div id="idles4"></div>').click(function () { _nearbyIdles(4,8); }));
	$('#menuTable').append($('<div id="idles5"></div>').click(function () { _nearbyIdles(8,-1); }));
	$('#menuTable').append($('<div id="idlesAll"></div>').click(function () { _nearbyIdles(0,-1); }));
	
	function _nearbyIdles(timeMin, timeMax) {
	  if (timeMax==-1)
		  timeMax = 9e6;
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
			var distance = 0;
			if (planet.coords[0] != myCoords[0])
				distance = 28000;
			else if (planet.coords[1] != myCoords[1])
				distance = 2700 + 95*Math.abs(planet.coords[1] - myCoords[1]);
			else 
				distance = 1000 + 5*Math.abs(planet.coords[2] - myCoords[2]);
			var V = 7500;
			var flighTime = (10 + 3500*Math.sqrt(10*distance/V) ) / 3600;
			
            if (flighTime >= timeMin && flighTime <= timeMax /*hours*/) {
              idles.push({
                id: playerId,
                name: player.name,
                coords: planet.coords,
                economyScore: player.economyScore,
                militaryScore: player.militaryScore,
                ships: player.ships,
                flighTime: flighTime
              });
            }
          }
        }
      }

      idles.sort(function (a, b) {
        return b.economyScore - a.economyScore;
      });

      var $wrapper = $('<div class="uiEnhancementWindow"></div>');
      var $table = $('<table><tr><th>' + _translate('COORDINATES') + '+t[h]' + '</th><th>' + _translate('ECONOMY_SCORE') + '</th><th>' + _translate('MILITARY_SCORE') + '</th><th>' + _translate('PLAYER') + '</th><th>' + _translate('NOTE') + '</th><th>' + _translate('ACTIONS') + '</th></tr></table>');
      for (var i = 0; i < idles.length; i++) {
        var $el = $('<tr id="planet_' + idles[i].coords[0] + '_' + idles[i].coords[1] + '_' + idles[i].coords[2] + '"></tr>');
        $el.append($('<td><a href="/game/index.php?page=galaxy&galaxy=' + idles[i].coords[0] + '&system=' + idles[i].coords[1] + '&position=' + idles[i].coords[2] + '">[' + idles[i].coords[0] + ':' + idles[i].coords[1] + ':' + idles[i].coords[2] + ']</a>' + ' ' + Math.round(idles[i].flighTime*10)/10 + '</td>'));
        $el.append($('<td><a class="tooltip js_hideTipOnMobile" href="?page=highscore&searchRelId=' + idles[i].id + '&category=1&type=1" title="' + _translate('ECONOMY_SCORE_LONG', {
          noBold: true,
          scoreEco: idles[i].economyScore
        }) + '">' + uipp_scoreHumanReadable(idles[i].economyScore) + '</a></td>'));
        $el.append($('<td class="tooltip js_hideTipOnMobile" title="' + _translate('MILITARY_SCORE_LONG', {
          noBold: true,
          scoreMilitary: idles[i].militaryScore,
          ships: (idles[i].ships ? idles[i].ships : '0')
        }) + '"><a href="?page=highscore&searchRelId=' + idles[i].id + '&category=1&type=3">' + uipp_scoreHumanReadable(idles[i].militaryScore) + ' (' + _num(idles[i].ships ? idles[i].ships : '0') + ')</a></td>'));
        $el.append($('<td class="tooltip js_hideTipOnMobile" title="' + idles[i].name + '">' + idles[i].name + '</td>'));
        $el.append($('<td width="100%"><input value="' + (config && config.planetNotes && config.planetNotes[idles[i].coords[0] + ':' + idles[i].coords[1] + ':' + idles[i].coords[2]] ? config.planetNotes[idles[i].coords[0] + ':' + idles[i].coords[1] + ':' + idles[i].coords[2]] : '') + '" onkeyup="_editNote(' + idles[i].coords[0] + ',' + idles[i].coords[1] + ',' + idles[i].coords[2] + ',this.value);return false;" style="width:96.5%;" type="text"/></td>'));
        $el.append($('<td><a class="tooltip js_hideTipOnMobile espionage" title="" href="javascript:void(0);" onclick="_spy(' + idles[i].coords[0] + ',' + idles[i].coords[1] + ',' + idles[i].coords[2] + ');return false;"><span class="icon icon_eye"></span></a>&nbsp;<a href="javascript:void(0);" onclick="_toggleIgnorePlanet(' + idles[i].coords[0] + ',' + idles[i].coords[1] + ',' + idles[i].coords[2] + ')"><span class="icon icon_against"></span></a>&nbsp;<a href="?page=fleet1&galaxy=' + idles[i].coords[0] + '&system=' + idles[i].coords[1] + '&position=' + idles[i].coords[2] + '&type=1&mission=1" onclick="$(this).find(\'.icon\').removeClass(\'icon_fastforward\').addClass(\'icon_checkmark\');" target="_blank"><span class="icon icon_fastforward"></span></a></td>'));
        if (config && config.ignoredPlanets && config.ignoredPlanets[idles[i].coords[0] + ':' + idles[i].coords[1] + ':' + idles[i].coords[2]]) {
          $el.addClass('ignore');
        }

        $table.append($el);
      }

      $wrapper.append($('<div class="btn_blue" onclick="$(\'#idles1\').click()">\<3h</div>'));
      $wrapper.append($('<div class="btn_blue" onclick="$(\'#idles2\').click()">\<4h</div>'));
      $wrapper.append($('<div class="btn_blue" onclick="$(\'#idles3\').click()">\<8h</div>'));
      $wrapper.append($('<div class="btn_blue" onclick="$(\'#idles4\').click()">4h-8h</div>'));
      $wrapper.append($('<div class="btn_blue" onclick="$(\'#idles5\').click()">\>8h</div>'));
      $wrapper.append($('<div class="btn_blue" onclick="$(\'#idlesAll\').click()">All</div>'));
      $wrapper.append($table);

      if (idles.length === 0) {
        $wrapper.append($('<div style="text-align: center; font-size: 16px; padding-top: 1em;">No idles yet</div>'));
      }

      // insert html
      var $eventboxContent = $('#eventboxContent');
      $('#contentWrapper').html($eventboxContent);
      $('#contentWrapper').append($wrapper);
    };
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
