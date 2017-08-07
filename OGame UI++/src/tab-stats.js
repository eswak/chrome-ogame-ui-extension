var fn = function () {
  'use strict';
  window._addTabStats = function _addTabStats () {
    var $statsEntry = $('<li class="stats enhanced"><span class="menu_icon"><div class="customMenuEntry2 menuImage empire"></div></span><a class="menubutton" href="#" accesskey="" target="_self"><span class="textlabel enhancement">' + window._translate('MENU_STATS') + '</span></a></li>');
    $('#menuTable').append($statsEntry);
    $statsEntry.click(function () {
      window.uipp_analytics('uipp-tab-click', 'statistics');
      // ui changes
      $('.menubutton.selected').removeClass('selected');
      $('.menuImage.highlighted').removeClass('highlighted');
      $('.stats .menubutton').addClass('selected');
      $('.customMenuEntry2').addClass('highlighted');

      var worth = window.uipp_getResourcesWorth();

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

      var myPlanets = [];
      for (var coords in window.config.my.planets) {
        if (window.config.my.planets[coords].resources) {
          myPlanets.push(window.config.my.planets[coords]);
        }
      }

      var planetOrder = $('#planetList .planet-koords').text();
      myPlanets = myPlanets.sort(function (a, b) {
        return planetOrder.indexOf(a.coords.join(':')) > planetOrder.indexOf(b.coords.join(':')) ? 1 : -1;
      });

      var planetStatsHtml = '';
      var rentabilityTimes = [];
      myPlanets.forEach(function (planet) {
        // add rentability times to array
        ['metal', 'crystal', 'deuterium'].forEach(function (resource) {
          rentabilityTimes.push({
            coords: planet.coords,
            resource: resource,
            time: window._getRentabilityTime(resource, planet.resources[resource].prod, planet.resources[resource].level),
            level: planet.resources[resource].level + 1
          });
        });

        var currentRealtimePlanetResources = {
          metal: Math.round(planet.resources.metal.now + planet.resources.metal.prod * ((Date.now() - planet.resources.lastUpdate) / 1000)),
          crystal: Math.round(planet.resources.crystal.now + planet.resources.crystal.prod * ((Date.now() - planet.resources.lastUpdate) / 1000)),
          deuterium: Math.round(planet.resources.deuterium.now + planet.resources.deuterium.prod * ((Date.now() - planet.resources.lastUpdate) / 1000))
        };

        // add production to global stats
        globalStats.prod.metal += planet.resources.metal.prod;
        globalStats.prod.crystal += planet.resources.crystal.prod;
        globalStats.prod.deuterium += planet.resources.deuterium.prod;

        // add mines level to global stats
        globalStats.level.metal += (planet.resources.metal.level || 0);
        globalStats.level.crystal += (planet.resources.crystal.level || 0);
        globalStats.level.deuterium += (planet.resources.deuterium.level || 0);

        // add current resources to global stats
        globalStats.current.metal += currentRealtimePlanetResources.metal;
        globalStats.current.crystal += currentRealtimePlanetResources.crystal;
        globalStats.current.deuterium += currentRealtimePlanetResources.deuterium;

        globalStats.planetCount++;

        // add planet stats html
        planetStatsHtml += [
          '<tr>',
          '<td style="max-width: 80px; overflow: hidden; text-overflow: ellipsis;">',
          '<a href="' + planet.href + '">',
          planet.name + '<br>',
          '<span style="vertical-align: -1px; opacity: .7;">[' + planet.coords.join(':') + ']</span>',
          '</a>',
          '</td>',
          ['metal', 'crystal', 'deuterium'].map(function (resource) {
            return [
              '<td id="stat-' + planet.coords.join('-') + '-' + resource + '">',
              '<div class="shadowed resourceIcon ' + resource + '" style="font-size: 20px; line-height: 32px;">' + planet.resources[resource].level + '</div>',
              '<div style="float:left; width: 95px; text-align: left; padding-left: 1em; font-size: 10px; line-height: 1em">',
              '<div>' + window._num(currentRealtimePlanetResources[resource], planet.resources[resource].prod, planet.resources[resource].max) + '</div>',
              '<div><span class="undermark">+' + window._num(Math.floor(planet.resources[resource].prod * 3600)) + '</span> /' + window._translate('TIME_HOUR') + '</div>',
              '<div><span class="undermark">+' + window._num(Math.floor(planet.resources[resource].prod * 3600 * 24)) + '</span> /' + window._translate('TIME_DAY') + '</div>',
              '</div>',
              '</td>'
            ].join('');
          }).join(''),
          '</tr>'
        ].join('');
      });

      // in flight
      var missions = [];
      $('#eventContent .tooltip.tooltipClose').each(function () {
        var $tooltip = $($(this).attr('title'));
        var $tr = $(this).parent().parent();

        var reverse = $tr.find('.icon_movement_reserve').length ? true : false;

        var trCount = $tooltip.find('tr').length;
        var entry = {
          metal: window._gfNumberToJsNumber($tooltip.find('tr:nth-child(' + (trCount - 2) + ') td').last().text()),
          crystal: window._gfNumberToJsNumber($tooltip.find('tr:nth-child(' + (trCount - 1) + ') td').last().text()),
          deuterium: window._gfNumberToJsNumber($tooltip.find('tr:nth-child(' + trCount + ') td').last().text()),
          from: $tr.find('.coordsOrigin a').text().trim(),
          to: $tr.find('.destCoords a').text().trim(),
          nShips: $tr.find('.detailsFleet').text().trim(),
          reverse: reverse
        };

        if (reverse) {
          var to = entry.to;
          entry.to = entry.from;
          entry.from = to;
        }

        missions.push(entry);
      });

      missions = missions.filter(function (mission) {
        var isReturnMissionDuplicate = false;
        missions.forEach(function (otherMission) {
          if (
            mission.reverse &&
            otherMission.from === mission.to &&
            otherMission.to === mission.from &&
            otherMission.nShips === mission.nShips &&
            otherMission.metal === mission.metal &&
            otherMission.crystal === mission.crystal &&
            otherMission.deuterium === mission.deuterium
          ) {
            isReturnMissionDuplicate = true;
          }
        });
        return !isReturnMissionDuplicate;
      });

      var inflight = { metal: 0, crystal: 0, deuterium: 0 };
      missions.forEach(function (mission) {
        inflight.metal += mission.metal;
        inflight.crystal += mission.crystal;
        inflight.deuterium += mission.deuterium;
      });

      if (inflight.metal || inflight.crystal || inflight.deuterium) {
        globalStats.current.metal += inflight.metal;
        globalStats.current.crystal += inflight.crystal;
        globalStats.current.deuterium += inflight.deuterium;

        planetStatsHtml += [
          '<tr><td style="height:5px"></td></tr>',
          '<tr>',
          '<td style="max-width: 80px; overflow: hidden; text-overflow: ellipsis;">',
          '<span class="icon_movement" style="display: inline-block;"></span>',
          '</td>',
          ['metal', 'crystal', 'deuterium'].map(function (resource) {
            return [
              '<td id="stat-flight">',
              '<div class="shadowed resourceIcon ' + resource + '" style="font-size: 20px; line-height: 32px;"></div>',
              '<div style="float:left; width: 95px; text-align: left; padding-left: 1em; font-size: 10px; line-height: 1em">',
              '<div style="padding-top: 11px;">' + window._num(inflight[resource]) + '</div>',
              '</div>',
              '</td>'
            ].join('');
          }).join(''),
          '</tr>'
        ].join('');
      }

      // global stats
      globalStats.level.metal /= globalStats.planetCount;
      globalStats.level.crystal /= globalStats.planetCount;
      globalStats.level.deuterium /= globalStats.planetCount;

      var productionRatio = {
        metal: '1 / ' + Math.floor(100 * globalStats.prod.crystal / globalStats.prod.metal) / 100 + ' / ' + Math.floor(100 * globalStats.prod.deuterium / globalStats.prod.metal) / 100,
        crystal: Math.floor(100 * globalStats.prod.metal / globalStats.prod.crystal) / 100 + ' / 1 / ' + Math.floor(100 * globalStats.prod.deuterium / globalStats.prod.crystal) / 100,
        deuterium: Math.floor(100 * globalStats.prod.metal / globalStats.prod.deuterium) / 100 + ' / ' + Math.floor(100 * globalStats.prod.crystal / globalStats.prod.deuterium) / 100 + ' / 1'
      };

      planetStatsHtml = [
        '<tr>',
        '<td style="width: 80px"></td>',
        ['metal', 'crystal', 'deuterium'].map(function (resource) {
          return [
            '<td>',
            '<div class="shadowed resourceIcon ' + resource + '" style="font-size: 20px; line-height: 32px;">' + Math.floor(10 * globalStats.level[resource]) / 10 + '</div>',
            '<div style="float:left; width: 95px; text-align: left; padding-left: 1em; font-size: 10px; line-height: 1em; padding-bottom: 3px">',
            '<div class="font-weight: bold; padding-bottom: 1px;">' + window._num(globalStats.current[resource], globalStats.prod[resource]) + '</div>',
            '<div><span class="undermark">+' + window._num(Math.floor(globalStats.prod[resource] * 3600)) + '</span> /' + window._translate('TIME_HOUR') + '</div>',
            '<div><span class="undermark">+' + window._num(Math.floor(globalStats.prod[resource] * 3600 * 24)) + '</span> /' + window._translate('TIME_DAY') + '</div>',
            '<div style="font-size: 8px; padding-top: 5px;">' + productionRatio[resource] + '</div>',
            '</div>',
            '</td>'
          ].join('');
        }).join(''),
        '</tr>',
        '<tr><td style="height:10px"></td></tr>'
      ].join('') + planetStatsHtml;

      $wrapper.append($('<table class="uipp-table">' + planetStatsHtml + '</table>'));

      var hasEnoughHistory = window._getPlayerScoreTrend($('[name=ogame-player-id]').attr('content'), 'g', 2).abs;
      if (hasEnoughHistory) {
        var playerId = $('[name=ogame-player-id]').attr('content');
        var current = window.config.players[playerId];
        var history = window.config.history[playerId];

        $wrapper.append($([
          '<div class="clearfix" style="margin-top:50px;">',
          '<div id="chart-history" style="width:70%;height:200px;float:left;"></div>',
          '<div id="chart-pie" style="width:30%;height:170px;float:left;margin-top:5px;position:relative;">',
          '<span id="highscoreContent" style="font-size:11px;">',
          '<span id="economy" class="navButton" style="position:absolute;transform:scale(0.35);top:25px;left:50px;"></span>',
          '<span id="research" class="navButton" style="position:absolute;transform:scale(0.35);top:55px;left:50px;"></span>',
          '<span id="fleet" class="navButton" style="position:absolute;transform:scale(0.35);top:85px;left:50px;"></span>',
          '<span style="position:absolute;top:45px;left:90px;">',
          window._getPlayerScoreTrend(playerId, 'e', 2, 10).html,
          '</span>',
          '<span style="position:absolute;top:75px;left:90px;">',
          window._getPlayerScoreTrend(playerId, 'r', 2, 10).html,
          '</span>',
          '<span style="position:absolute;top:105px;left:90px;">',
          window._getPlayerScoreTrend(playerId, 'm', 2, 10).html,
          '</span>',
          '</span>',
          '</div>',
          '</div>'
        ].join('')));
        setTimeout(function () {
          var labels = Object.keys(history);
          var series = [
            {
              name: 'economy',
              data: []
            },
            {
              name: 'research',
              data: []
            },
            {
              name: 'military',
              data: []
            },
            {
              name: 'general',
              data: []
            }
          ];
          labels.forEach(function (day) {
            series[0].data.push({ x: history[day].t, y: (history[day].e || 0) + (history[day].r || 0) + (history[day].m || 0) });
            series[1].data.push({ x: history[day].t, y: (history[day].r || 0) + (history[day].m || 0) });
            series[2].data.push({ x: history[day].t, y: (history[day].m || 0) });
          });

          new window.Chartist.Line('#chart-history', {
            labels: labels,
            series: series
          }, {
            axisX: {
              type: window.Chartist.FixedScaleAxis,
              divisor: 5,
              labelInterpolationFnc: function (value) {
                var dayOfMonthStr = new Date(value).toISOString().split('T')[0].split('-')[2];
                var monthStr = new Date(value).toISOString().split('T')[0].split('-')[1];
                return dayOfMonthStr + '/' + monthStr;
              }
            },
            axisY: {
              type: window.Chartist.FixedScaleAxis,
              divisor: 5,
              labelInterpolationFnc: function (value) {
                return window.uipp_scoreHumanReadable(value);
              }
            },
            showArea: true,
            showLine: false,
            showPoint: false,
            low: 0
          });

          new window.Chartist.Pie('#chart-pie', {
            series: [current.economyScore, current.researchScore, current.militaryScore]
          }, {
            donut: true,
            donutWidth: 15,
            donutSolid: false,
            startAngle: 0,
            showLabel: false
          });
        });
      }

      var currentPlanetResources = window._getCurrentPlanetResources();
      var globalProdWorth = 0;
      globalProdWorth += globalStats.prod.metal * worth.metal;
      globalProdWorth += globalStats.prod.crystal * worth.crystal;
      globalProdWorth += globalStats.prod.deuterium * worth.deuterium;

      rentabilityTimes = rentabilityTimes.map(function (rentability) {
        var costs = window.uipp_getCost(rentability.resource, rentability.level - 1);
        var costsWorth = 0;
        costsWorth += costs[0] * worth.metal;
        costsWorth += costs[1] * worth.crystal;
        var economyTime = costsWorth / globalProdWorth;

        rentability.economyTime = economyTime;
        rentability.time += economyTime;
        rentability.totalCost = costs;

        return rentability;
      });

      // add astrophysics to rentability times
      var astroLevel = window.config.astroTech;
      if (astroLevel) {
        var nextAstroLevelForPlanetUnlock = astroLevel;
        var astroCost;
        if (astroLevel % 2 === 1) {
          astroCost = window.uipp_getCummulativeCost('astrophysics', astroLevel, astroLevel + 1);
          nextAstroLevelForPlanetUnlock += 2;
        } else {
          astroCost = window.uipp_getCost('astrophysics', astroLevel);
          nextAstroLevelForPlanetUnlock++;
        }

        var astroCostWorth = 0;
        astroCostWorth += astroCost[0] * worth.metal;
        astroCostWorth += astroCost[1] * worth.crystal;
        astroCostWorth += astroCost[2] * worth.deuterium;

        var astroTime = astroCostWorth / globalProdWorth;

        var lowestMineLevels = _getMyLowestMineLevels();
        var cummulativeLowestMineCosts = {
          metal: window.uipp_getCummulativeCost('metal', 0, lowestMineLevels.metal),
          crystal: window.uipp_getCummulativeCost('crystal', 0, lowestMineLevels.crystal),
          deuterium: window.uipp_getCummulativeCost('deuterium', 0, lowestMineLevels.deuterium)
        };

        var cummulativeLowestMineCostsWorth = 0;
        cummulativeLowestMineCostsWorth += cummulativeLowestMineCosts.metal[0] * worth.metal;
        cummulativeLowestMineCostsWorth += cummulativeLowestMineCosts.metal[1] * worth.crystal;
        cummulativeLowestMineCostsWorth += cummulativeLowestMineCosts.crystal[0] * worth.metal;
        cummulativeLowestMineCostsWorth += cummulativeLowestMineCosts.crystal[1] * worth.crystal;
        cummulativeLowestMineCostsWorth += cummulativeLowestMineCosts.deuterium[0] * worth.metal;
        cummulativeLowestMineCostsWorth += cummulativeLowestMineCosts.deuterium[1] * worth.crystal;

        var newPlanetProductionWorth = 0;
        newPlanetProductionWorth += window.uipp_getProduction('metal', lowestMineLevels.metal) / 3600;
        newPlanetProductionWorth += window.uipp_getProduction('crystal', lowestMineLevels.crystal) / 3600;
        newPlanetProductionWorth += window.uipp_getProduction('deuterium', lowestMineLevels.deuterium) / 3600;

        var mineRentabilityTime = (cummulativeLowestMineCostsWorth + astroCostWorth) / newPlanetProductionWorth;
        var mineEconomyTime = cummulativeLowestMineCostsWorth / globalProdWorth;
        rentabilityTimes.push({
          coords: [],
          resource: 'astrophysics',
          level: nextAstroLevelForPlanetUnlock,
          time: astroTime + mineEconomyTime + mineRentabilityTime,
          astroTime: astroTime,
          mineEconomyTime: mineEconomyTime,
          mineRentabilityTime: mineRentabilityTime,
          astroCost: astroCost,
          mineCost: [
            cummulativeLowestMineCosts.metal[0] + cummulativeLowestMineCosts.crystal[0] + cummulativeLowestMineCosts.deuterium[0],
            cummulativeLowestMineCosts.metal[1] + cummulativeLowestMineCosts.crystal[1] + cummulativeLowestMineCosts.deuterium[1],
            0
          ],
          metalLevel: lowestMineLevels.metal,
          crystalLevel: lowestMineLevels.crystal,
          deuteriumLevel: lowestMineLevels.deuterium
        });
      }

      // add plasma to rentability array
      if (window.config.plasmaTech) {
        var plasmaRentabilityTime = window._getRentabilityTime('plasma', null, window.config.plasmaTech);
        rentabilityTimes.push({
          coords: [],
          resource: 'plasma',
          level: (window.config.plasmaTech || 0) + 1,
          time: plasmaRentabilityTime,
          totalCost: window.uipp_getCost('plasma', window.config.plasmaTech)
        });
      }

      // rentability display
      rentabilityTimes = rentabilityTimes.sort(function (a, b) {
        return a.time - b.time;
      });

      $wrapper.append($([
        '<div style="margin-top:50px;text-align: center;;font-size: 15px;padding-bottom: 10px;">',
        window._translate('NEXT_MOST_RENTABLE_BUILDS'),
        '</div>'
      ].join('')));
      var $rentabilityWrapper = $('<div style="text-align:center"></div>');
      rentabilityTimes.forEach(function (rentability) {
        var tooltip = '';
        if (rentability.resource === 'plasma') {
          tooltip = window._translate('ROI', {
            time: window._time(rentability.time),
            tradeRate: window.config.tradeRate.join(' / ')
          });
          tooltip += '<br>';
          tooltip += '<br>' + window._translate('RENTABILITY_PLASMA', {
            level: rentability.level,
            totalCost: window._num(rentability.totalCost).join(' / ')
          });
          tooltip = tooltip.replace(/<\/?span[^>]*>/g, '');
          $rentabilityWrapper.append($([
            '<span class="tooltip" title="' + tooltip + '" style="display:inline-block;margin:5px;position:relative">',
            '<img src="' + window.uipp_images[rentability.resource] + '" height="50"/>',
            '<span class="shadowed" style="position:absolute;width:100%;display:inline-block;line-height:50px;text-align:center;left:0;top: 0;font-size:26px;">' + rentability.level + '</span>',
            '</span>',
          ].join('')));
        } else if (rentability.resource === 'astrophysics') {
          tooltip = window._translate('ROI', {
            time: window._time(rentability.time),
            tradeRate: window.config.tradeRate.join(' / ')
          });
          tooltip += '<br>';
          tooltip += '<br>' + window._translate('RENTABILITY_ASTRO', {
            level: rentability.level,
            mineLevel: rentability.metalLevel + ' / ' + rentability.crystalLevel + ' / ' + rentability.deuteriumLevel,
            astroTime: window._time(rentability.astroTime),
            mineEconomyTime: window._time(rentability.mineEconomyTime),
            mineTime: window._time(rentability.mineRentabilityTime),
            mineCost: window._num(rentability.mineCost).join(' / '),
            astroCost: window._num(rentability.astroCost).join(' / ')
          });
          tooltip = tooltip.replace(/<\/?span[^>]*>/g, '');
          $rentabilityWrapper.append($([
            '<span class="tooltip" title="' + tooltip + '" style="display:inline-block;margin:5px;position:relative">',
            '<img src="' + window.uipp_images[rentability.resource] + '" height="50"/>',
            '<span class="shadowed" style="position:absolute;width:100%;display:inline-block;line-height:50px;text-align:center;left:0;top: 0;font-size:26px;">' + rentability.level + '</span>',
            '</span>',
          ].join('')));
        } else {
          tooltip = window._translate('ROI', {
            time: window._time(rentability.time),
            tradeRate: window.config.tradeRate.join(' / ')
          });
          tooltip += '<br>';
          tooltip += '<br>' + window._translate('RENTABILITY_MINE_' + rentability.resource.toUpperCase(), {
            level: rentability.level,
            economyTime: window._time(rentability.economyTime),
            coords: '[' + rentability.coords.join(':') + ']',
            totalCost: window._num(rentability.totalCost).join(' / ')
          });
          tooltip = tooltip.replace(/<\/?span[^>]*>/g, '');
          $rentabilityWrapper.append($([
            '<span class="tooltip" title="' + tooltip + '" style="display:inline-block;margin:5px;position:relative;">',
            '<img src="' + window.uipp_images[rentability.resource] + '" height="50"/>',
            '<span class="shadowed" style="position:absolute;width:100%;display:inline-block;line-height:35px;text-align:center;left:0;top: 0;font-size:19px;">' + rentability.level + '</span>',
            '<span class="shadowed" style="position:absolute;width:100%;display:inline-block;line-height:35px;text-align:center;left:0;top: 17px;font-size:9px;">[' + rentability.coords.join(':') + ']</span>',
            '</span>',
          ].join('')));
        }
      });

      $wrapper.append($rentabilityWrapper);

      // insert html
      var $eventboxContent = $('#eventboxContent');
      $('#contentWrapper').html($eventboxContent);
      $('#contentWrapper').append($wrapper);
    });

    function _getMyLowestMineLevels () {
      var lowestMineLevels = {
        metal: Infinity,
        crystal: Infinity,
        deuterium: Infinity
      };
      for (var key in window.config.my.planets) {
        var myPlanet = window.config.my.planets[key];
        ['metal', 'crystal', 'deuterium'].forEach(function (res) {
          if (myPlanet.resources[res].level < lowestMineLevels[res]) {
            lowestMineLevels[res] = myPlanet.resources[res].level;
          }
        });
      }
      return lowestMineLevels;
    }
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
