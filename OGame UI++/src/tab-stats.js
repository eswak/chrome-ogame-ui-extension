var fn = function () {
  'use strict';

  window._addTabStats = function _addTabStats() {
    var $entry = $('<li class="stats enhanced"><span class="menu_icon"><div class="customMenuEntry2 menuImage empire"></div></span><a class="menubutton" href="#" accesskey="" target="_self"><span class="textlabel enhancement">' + _translate('MENU_STATS') + '</span></a></li>');
    $('#menuTable').append($entry);
    $entry.click(function () {
      // ui changes
      $('.menubutton.selected').removeClass('selected');
      $('.menuImage.highlighted').removeClass('highlighted');
      $('.stats .menubutton').addClass('selected');
      $('.customMenuEntry2').addClass('highlighted');

      var $wrapper = $('<div class="uiEnhancementWindow"></div>');

      var globalStats = {
        prod: {
          metal: 0,
          crystal: 0,
          deuterium: 0
        },
        level: {
          metal: 0,
          crystal: 0,
          deuterium: 0
        },
        current: {
          metal: 0,
          crystal: 0,
          deuterium: 0
        },
        planetCount: 0
      };


      // calculate statistics
      for (var coords in config.my.planets) {
        var planet = config.my.planets[coords];
        if (!planet.resources || !planet.coords) {
          continue;
        }
        /*var currentPlanetResources = {
          metal: Math.round(planet.resources.metal.now + planet.resources.metal.prod * ((Date.now() - planet.resources.lastUpdate) / 1000)),
          crystal: Math.round(planet.resources.crystal.now + planet.resources.crystal.prod * ((Date.now() - planet.resources.lastUpdate) / 1000)),
          deuterium: Math.round(planet.resources.deuterium.now + planet.resources.deuterium.prod * ((Date.now() - planet.resources.lastUpdate) / 1000))
        };*/
        // add production to global stats
        globalStats.prod.metal += planet.resources.metal.prod;
        globalStats.prod.crystal += planet.resources.crystal.prod;
        globalStats.prod.deuterium += planet.resources.deuterium.prod;

        // add mines level to global stats
        globalStats.level.metal += (planet.resources.metal.level || 0);
        globalStats.level.crystal += (planet.resources.crystal.level || 0);
        globalStats.level.deuterium += (planet.resources.deuterium.level || 0);

        // add current resources to global stats
        globalStats.current.metal += planet.resources.metal.now;
        globalStats.current.crystal += planet.resources.crystal.now;
        globalStats.current.deuterium += planet.resources.deuterium.now;

        globalStats.planetCount++;
      };

      // glogal stats
      globalStats.level.metal /= globalStats.planetCount;
      globalStats.level.crystal /= globalStats.planetCount;
      globalStats.level.deuterium /= globalStats.planetCount;

      function numTotal(n) {
        return uipp_scoreHumanReadable(n);
      }

      function num(n, total) {
        var ret = uipp_scoreHumanReadable(n);
        if (total) {
            ret += '<snap style="opacity:' + Math.min(1, 0.2 + n/total*2) + '; float:right">';
            ret += Math.round(n/total*100) + '%';
            ret += '</span>';
        }
        return ret;
      }

      function alpha(a, text) {
        return '<snap style="opacity:' + a + '">' + text + '</span>';
      }

      // add planet stats html
      var textShadow = [
        '0 0 2px black',
        '0 0 2px black',
        '0 0 2px black',
        '0 0 2px black',
        '0 0 2px black',
        '0 0 2px black',
        '0 0 2px black'
      ].join(',');

      var productionRatio = {
        metal: '1 / ' + Math.floor(100 * globalStats.prod.crystal / globalStats.prod.metal) / 100 + ' / ' + Math.floor(100 * globalStats.prod.deuterium / globalStats.prod.metal) / 100,
        crystal: Math.floor(100 * globalStats.prod.metal / globalStats.prod.crystal) / 100 + ' / 1 / ' + Math.floor(100 * globalStats.prod.deuterium / globalStats.prod.crystal) / 100,
        deuterium: Math.floor(100 * globalStats.prod.metal / globalStats.prod.deuterium) / 100 + ' / ' + Math.floor(100 * globalStats.prod.crystal / globalStats.prod.deuterium) / 100 + ' / 1'
      };

      // total production
      var planetStatsHtml = [
        '<tr>',
          '<td style="width: 80px; text-align: left; font-weight: bold;">Total</td>',
          ['metal', 'crystal', 'deuterium'].map(function (resource) {
            return [
              '<td>',
                '<div class="resourceIcon ' + resource + '" style="font-size: 20px; line-height: 32px; text-shadow: ' + textShadow + '">' + Math.floor(10 * globalStats.level[resource]) / 10 + '</div>',
                '<div style="float:left; width: 95px; text-align: left; padding-left: 1em; font-size: 10px; line-height: 1em; padding-bottom: 3px">',
                  '<div style="font-weight: bold; padding-bottom: 1px;">' + numTotal(globalStats.current[resource]) + '</div>',
                  '<div><span class="undermark">+' + numTotal(Math.floor(globalStats.prod[resource] * 3600)) + '</span>' + alpha(0.3,' /' + _translate('TIME_HOUR')) + '</div>',
                  '<div><span class="undermark">+' + numTotal(Math.floor(globalStats.prod[resource] * 3600 * 24)) + '</span>' + alpha(0.3,' /' + _translate('TIME_DAY')) + '</div>',
                  '<div style="font-size: 8px; padding-top: 5px;">' + productionRatio[resource] + '</div>',
                '</div>',
              '</td>'
            ].join('');
          }).join(''),
        '</tr>',
        '<tr><td style="height:10px"></td></tr>'
      ].join('');


      var rentabilityTimes = [];
      for (var coords in config.my.planets) {
        var planet = config.my.planets[coords];
        if (!planet.resources || !planet.coords) {
          continue;
        }

        // add rentability times to array
        ['metal', 'crystal', 'deuterium'].forEach(function (resource) {
          rentabilityTimes.push({
            coords: planet.coords,
            resource: resource,
            time: _getRentabilityTime(resource, planet.resources[resource].prod, planet.resources[resource].level)
          });
        });

        planetStatsHtml += [
          '<tr>',
            '<td>',
              '<div style="float:left; text-align: left;">',
                '<div  style="padding-bottom: 5px">' + planet.name + '</div>',
                '<div style="font-size: 10px"><a href="' + planet.href + '">' + coords + '</a></div>',
              '</div>',
            '</td>',
            ['metal', 'crystal', 'deuterium'].map(function (resource) {
              return [
                '<td id="stat-' + planet.coords.join('-') + '-' + resource + '">',
                  '<div class="resourceIcon ' + resource + '" style="font-size: 20px; text-shadow: ' + textShadow + ';padding-top:10px">' + planet.resources[resource].level + '</div>',
                  '<div style="float:left; width: 95px; text-align: left; padding-left: 1em; font-size: 10px; line-height: 1em">',
                    '<div style="font-weight: bold; padding-bottom: 1px;">' + num(planet.resources[resource].now, globalStats.current[resource]) + '</div>',
                    '<div><span class="undermark">+' + num(Math.floor(planet.resources[resource].prod * 3600), Math.floor(globalStats.prod[resource] * 3600)) + '</span>' + alpha(0.3,' /' + _translate('TIME_HOUR')) + '</div>',
                    '<div><span class="undermark">+' + num(Math.floor(planet.resources[resource].prod * 3600 * 24), Math.floor(globalStats.prod[resource] * 3600 * 24)) + '</span>' + alpha(0.3,' /' + _translate('TIME_DAY')) + '</div>',
                  '</div>',
                '</td>'
              ].join('');
            }).join(''),
          '</tr>'
        ].join('');
      }

      $wrapper.append($('<table class="uipp-table">' + planetStatsHtml + '</table>'));

      // outline most rentable upgrades
      setTimeout(function () {
        rentabilityTimes = rentabilityTimes.sort(function (a, b) {
          return a.time - b.time;
        });

        var colors = ['#fff', '#c5c5c5', '#aaa', '#757575', '#555'];
        colors.forEach(function (color, i) {
          if (rentabilityTimes[i]) {
            $('#stat-' + rentabilityTimes[i].coords.join('-') + '-' + rentabilityTimes[i].resource).css('border', '1px dotted ' + color);
          }
        });
      });

      // add reset button
      var $resetStatsButton = $('<div style="margin-top: 10px; text-align: right;padding-right: .5em;"><a href="#" class="btn_blue">' + _translate('RESET_STATS') + '</a></div>');
      $wrapper.append($resetStatsButton);
      $resetStatsButton.click(function () {
        delete config.my.planets;
        _saveConfig(config);
        window.location.reload();
      });

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
