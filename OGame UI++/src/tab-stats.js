'use strict';
window._addTabStats = function _addTabStats() {
  var $statsEntry = $(
    '<li class="stats enhanced"><span class="menu_icon"><div class="menuImage empire"></div></span><a class="menubutton" href="#" accesskey="" target="_self"><span class="textlabel enhancement">' +
      window._translate('MENU_STATS') +
      '</span></a></li>'
  );
  $('#menuTable').append($statsEntry);
  $statsEntry.click(function () {
    var $wrapper = window._onMenuClick('stats');
    if (!$wrapper) return;

    var $wrapperStats = $('<div class="uipp-box"><h3>' + window._translate('STATS_PRODUCTION') + '</h3></div>');
    var $wrapperProgression = $('<div class="uipp-box"><h3>' + window._translate('STATS_PROGRESSION') + '</h3></div>');
    var $wrapperRentability = $(
      '<div class="uipp-box"><h3>' + window._translate('NEXT_MOST_RENTABLE_BUILDS') + '</h3></div>'
    );
    if (window.config.features.stats) {
      $wrapper.append($wrapperStats);
    }
    if (window.config.features.charts) {
      $wrapper.append($wrapperProgression);
    }
    if (window.config.features.nextbuilds) {
      $wrapper.append($wrapperRentability);
    }

    // clear decolonized planets from the list
    var planetOrder = $('#planetList .planet-koords').text();
    for (var key in window.config.my.planets) {
      if (planetOrder.indexOf(window.config.my.planets[key].coords.join(':')) === -1) {
        delete window.config.my.planets[key];
        window._saveConfig();
      }
    }

    var worth = window.uipp_getResourcesWorth();
    var globalStats = {
      prod: {
        metal: 0,
        crystal: 0,
        deuterium: 0
      },
      points: {
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
      if (window.config.my.planets[coords].resources && !window.config.my.planets[coords].isMoon) {
        myPlanets.push(window.config.my.planets[coords]);
      }
    }

    myPlanets = myPlanets.sort(function (a, b) {
      return planetOrder.indexOf(a.coords.join(':')) > planetOrder.indexOf(b.coords.join(':')) ? 1 : -1;
    });

    var planetStatsHtml = '';
    var rentabilityTimes = [];
    var fullIn = { metal: [], crystal: [], deuterium: [] };
    myPlanets.forEach(function (planet) {
      // add rentability times to array
      ['metal', 'crystal', 'deuterium'].forEach(function (resource) {
        rentabilityTimes.push({
          coords: planet.coords,
          resource: resource,
          time: window._getRentabilityTime(
            resource,
            // instead of planet.resources[resource].prod,
            // use theoretical production to not account for full storages
            // and other temporary modifiers like boosts
            window.uipp_getProduction(resource, planet.resources[resource].level, planet.averageTemp, planet.coords, {
              plasma: true
            }) / 3600,
            planet.resources[resource].level,
            planet.resources[resource].level + 1,
            planet.averageTemp,
            planet.coords
          ),
          level: planet.resources[resource].level + 1,
          inprog: window.config.inprog['[' + planet.coords.join(':') + ']-' + resource] || null
        });
      });

      var currentRealtimePlanetResources = {};
      ['metal', 'crystal', 'deuterium'].forEach(function (resource) {
        var actuatedAmount = Math.round(
          planet.resources[resource].now +
            planet.resources[resource].prod * ((Date.now() - planet.resources.lastUpdate) / 1000)
        );
        if (planet.resources[resource].now > planet.resources[resource].max) {
          currentRealtimePlanetResources[resource] = planet.resources[resource].now;
        } else if (actuatedAmount > planet.resources[resource].max) {
          currentRealtimePlanetResources[resource] = planet.resources[resource].max;
        } else {
          currentRealtimePlanetResources[resource] = actuatedAmount;
        }
      });

      // add storage time to array
      ['metal', 'crystal', 'deuterium'].forEach(function (resource) {
        var planetFullIn = 0;
        var planetRemainingStorage = planet.resources[resource].max - currentRealtimePlanetResources[resource];
        if (planetRemainingStorage > 0) {
          planetFullIn = planetRemainingStorage / planet.resources[resource].prod;
        }

        fullIn[resource].push({
          planet: planet,
          time: planetFullIn
        });
      });

      // add production to global stats
      globalStats.prod.metal += planet.resources.metal.prod;
      globalStats.prod.crystal += planet.resources.crystal.prod;
      globalStats.prod.deuterium += planet.resources.deuterium.prod;

      // add mines level to global stats
      globalStats.level.metal += planet.resources.metal.level || 0;
      globalStats.level.crystal += planet.resources.crystal.level || 0;
      globalStats.level.deuterium += planet.resources.deuterium.level || 0;

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
        '<span class="uipp-stats-planet-name">' + planet.name + '</span><br>',
        '<span style="vertical-align: -1px; opacity: .7;" class="uipp-stats-planet-coords" temp="' +
          planet.averageTemp +
          '">[' +
          planet.coords.join(':') +
          ']</span>',
        '</a>',
        '</td>',
        ['metal', 'crystal', 'deuterium']
          .map(function (resource) {
            var costs = window.uipp_getCost(resource, planet.resources[resource].level);
            var tooltip = [
              window._num(costs[0]),
              ' ' + window._translate('UNIT_METAL'),
              '<br>',
              window._num(costs[1]),
              ' ' + window._translate('UNIT_CRYSTAL')
            ].join('');

            var inprog = window.config.inprog['[' + planet.coords.join(':') + ']-' + resource];

            if (inprog) {
              tooltip += [
                '<br><br>',
                '⇧ ' + (Number(planet.resources[resource].level) + 1),
                ' : ' + window._time(Math.floor(inprog - Date.now()) / 1000)
              ].join('');
            }

            var outline = 'none';
            var shadow = 'none';
            var thresholds = [
              -1000, 0, 0.5,
              //5,
              //7.5,
              10,
              //15,
              20,
              //25,
              30,
              //35,
              40
              //50,
              //60
            ];
            var colors = [
              '#FF0000',
              '#000000',
              '#2a2929',
              //'#404040',
              //'#6c4223',
              '#a25419',
              //'#9b7c65',
              '#a9a7b0',
              //'#a98d4f',
              '#da9f1c',
              //'#bf8598',
              '#7e3d8e'
              //'#aa80b5',
              //'#ffffff'
            ];
            var estimatedProd = window.uipp_getProduction(
              resource,
              planet.resources[resource].level,
              planet.averageTemp,
              planet.coords,
              { plasma: false, class: false, geologist: false, officers: false }
            );
            var boost = Math.floor(1000 * ((planet.resources[resource].prod * 3600) / estimatedProd - 1)) / 10;
            var tooltipAppend = '';
            thresholds.forEach(function (threshold, i) {
              if (boost >= threshold) {
                tooltipAppend = ['<br><br>', boost >= 0 ? '⇧ +' : '⇓ ', boost, '%'].join('');
                outline = '2px solid ' + colors[i];
              }
            });
            if (boost >= 50) {
              // purple shining
              outline = '2px solid #7e3d8e';
              shadow = '0 0 10px #7e3d8e, 0 0 15px #7e3d8e';
            }
            if (boost >= 70) {
              // polychromatic shining
              outline = 'none';
              shadow =
                '#fff 0 0 2px, #fff 0 0 2px, #fff 0 0 2px, #fff 0 0 3px, #fff 0 0 2px, #e4ff00aa 3px 3px 4px, #ff0241aa 3px -3px 4px, #0066ffaa -3px -3px 6px, #00ff08aa -3px 3px 4px';
            }
            if (boost >= 90) {
              // epic polychromatic shining
              outline = 'none';
              shadow =
                '#fff 0 0 2px, #fff 0 0 2px, #fff 0 0 2px, #fff 0 0 4px, #fff 0 0 4px, #e4ff00 3px 3px 4px, #ff0241cc 3px -3px 4px, #0066ff -3px -3px 6px, #00ff08 -3px 3px 4px;';
            }
            tooltip += tooltipAppend;

            var moonResource = 0;
            if (planet.moon) {
              var moonResources = window.config.my.planets[planet.moon].resources;
              if (moonResources) {
                moonResource = moonResources[resource].now;
              }
            }
            globalStats.current[resource] += moonResource;

            var minePoints = 0;
            for (var i = 0; i < planet.resources[resource].level; i++) {
              var levelCost = window.uipp_getCost(resource, i);
              minePoints += levelCost[0];
              minePoints += levelCost[1];
            }
            globalStats.points[resource] += minePoints;
            minePoints = Math.floor(minePoints / 1000);

            return [
              '<td id="stat-' + planet.coords.join('-') + '-' + resource + '"',
              ' onclick="uipp_toggleSelect(this, \'' +
                resource +
                "', " +
                (currentRealtimePlanetResources[resource] + moonResource) +
                ', ' +
                planet.resources[resource].prod +
                ')"',
              ' style="cursor:pointer;user-select:none;">',
              '<div class="uipp-stat-resource tooltip shadowed" style="position: relative; font-size: 20px; line-height: 32px; float: left; width: 48px; height: 32px; background-image:url(' +
                window.uipp_images.resources[resource] +
                '); outline: ' +
                outline +
                '; box-shadow: ' +
                shadow +
                '" title="' +
                tooltip +
                '">',
              planet.resources[resource].level,
              inprog ? '<span class="icon12px icon_wrench" style="position:absolute;bottom:-3px;right:0;"></span>' : '',
              '</div>',
              '<div style="float:left; width: 95px; text-align: left; padding-left: 1em; font-size: 10px; line-height: 1em">',
              '<div style="white-space:nowrap" class="uipp-current-resources" points="' +
                window._num(minePoints) +
                '">' +
                window._num(
                  currentRealtimePlanetResources[resource],
                  planet.resources[resource].prod,
                  planet.resources[resource].max
                ) +
                (planet.moon ? ' + <span class="overmark">' + window._num(moonResource) + '</span>' : '') +
                '</div>',
              '<div><span class="undermark">+' +
                window._num(Math.floor(planet.resources[resource].prod * 3600)) +
                '</span> /' +
                window._translate('TIME_HOUR') +
                '</div>',
              '<div><span class="undermark">+' +
                window._num(Math.floor(planet.resources[resource].prod * 3600 * 24)) +
                '</span> /' +
                window._translate('TIME_DAY') +
                '</div>',
              '</div>',
              '</td>'
            ].join('');
          })
          .join(''),
        '</tr>'
      ].join('');
    });

    // add rentability times for mines until median level, not just next
    /*var medianMineLevels = _getMedianMineLevels();
    myPlanets.forEach(function (planet) {
      ['metal', 'crystal', 'deuterium'].forEach(function (resource) {
        for (var level = planet.resources[resource].level + 2; level <= medianMineLevels[resource]; level++) {
          rentabilityTimes.push({
            coords: planet.coords,
            resource: resource,
            time: window._getRentabilityTime(
              resource,
              planet.resources[resource].prod,
              planet.resources[resource].level,
              level
            ),
            level: level,
            inprog: null
          });
        }
      });
    });*/

    // selected
    var selected = {
      metal: { current: 0, production: 0 },
      crystal: { current: 0, production: 0 },
      deuterium: { current: 0, production: 0 }
    };
    window.uipp_toggleSelect = function (el, resource, current, production) {
      var $el = $(el);
      $el.toggleClass('uipp-selected');

      if ($el.hasClass('uipp-selected')) {
        selected[resource].current += current;
        selected[resource].production += production;
      } else {
        selected[resource].current -= current;
        selected[resource].production -= production;
      }

      window.uipp_refreshSelectedDisplay();
    };

    window.uipp_unselectAll = function () {
      selected = {
        metal: { current: 0, production: 0 },
        crystal: { current: 0, production: 0 },
        deuterium: { current: 0, production: 0 }
      };
      $('.uipp-table .uipp-selected').removeClass('uipp-selected');

      window.uipp_refreshSelectedDisplay();
    };

    window.uipp_refreshSelectedDisplay = function () {
      var $selectedWrapper = $('.uipp-selected-resources');
      if ($selectedWrapper) {
        $selectedWrapper.remove();
      }

      if (!selected.metal.current && !selected.crystal.current && !selected.deuterium.current) {
        return;
      }

      $('.uipp-table')
        .first()
        .append(
          [
            '<tr class="uipp-selected-resources uipp-selected"',
            ' onclick="uipp_unselectAll()"',
            ' style="cursor:pointer;user-select:none;">',
            '<td style="max-width: 80px; overflow: hidden; text-overflow: ellipsis;">∑</td>',
            ['metal', 'crystal', 'deuterium']
              .map(function (resource) {
                return [
                  '<td>',
                  '<div class="shadowed" style="float: left; width: 48px; height: 32px; background-image:url(' +
                    window.uipp_images.resources[resource] +
                    ')"></div>',
                  '<div style="float:left; width: 95px; text-align: left; padding-left: 1em; font-size: 10px; line-height: 1em">',
                  '<div style="padding-top: 11px;">' +
                    window._num(selected[resource].current, selected[resource].production) +
                    '</div>',
                  '</div>',
                  '</td>'
                ].join('');
              })
              .join(''),
            '</tr>'
          ].join('')
        );
    };

    // in flight
    var inflight = window.uipp_getResourcesInFlight();

    if (inflight.metal || inflight.crystal || inflight.deuterium) {
      globalStats.current.metal += inflight.metal;
      globalStats.current.crystal += inflight.crystal;
      globalStats.current.deuterium += inflight.deuterium;

      planetStatsHtml += [
        '<tr class="resources-in-flight-spacer"><td style="height:5px"></td></tr>',
        '<tr class="resources-in-flight">',
        '<td style="max-width: 80px; overflow: hidden; text-overflow: ellipsis;">',
        '<span class="icon_movement" style="display: inline-block;"></span>',
        '</td>',
        ['metal', 'crystal', 'deuterium']
          .map(function (resource) {
            return [
              '<td onclick="uipp_toggleSelect(this, \'' +
                resource +
                "', " +
                inflight[resource] +
                ', 0)" style="cursor:pointer;user-select:none;">',
              '<div class="shadowed" style="float: left; width: 48px; height: 32px; background-image:url(' +
                window.uipp_images.resources[resource] +
                ')"></div>',
              '<div style="float:left; width: 95px; text-align: left; padding-left: 1em; font-size: 10px; line-height: 1em">',
              '<div style="padding-top: 11px;">' + window._num(inflight[resource]) + '</div>',
              '</div>',
              '</td>'
            ].join('');
          })
          .join(''),
        '</tr>'
      ].join('');
    }

    // storage times
    planetStatsHtml += [
      '<tr class="storage-time-spacer"><td style="height:5px"></td></tr>',
      '<tr class="storage-time">',
      '<td style="max-width: 80px; overflow: hidden; text-overflow: ellipsis;">',
      '<div class="bar_container" style="width: 40px;display: inline-block;">',
      '<div class="filllevel_bar filllevel_undermark" style="width: 50%;"></div>',
      '</div>',
      '</td>',
      ['metal', 'crystal', 'deuterium']
        .map(function (resource) {
          var fullInTop3 = fullIn[resource]
            .sort(function (a, b) {
              return a.time > b.time ? 1 : -1;
            })
            .slice(0, 3);
          return [
            '<td>',
            '<div class="shadowed" style="float: left; width: 48px; height: 32px; background-image:url(' +
              window.uipp_images.resources[resource] +
              ')">',
            fullInTop3
              .map(function (fullInEntry) {
                return '<div style="font-size:9px;line-height:11px">' + window._time(fullInEntry.time, -1) + '</div>';
              })
              .join(''),
            '</div>',
            '<div style="float:left; width: 95px; text-align: left; padding-left: 1em; font-size: 10px; line-height: 1em">',

            fullInTop3
              .map(function (fullInEntry) {
                return '<div style="font-size:9px;line-height:11px">' + fullInEntry.planet.name + '</div>';
              })
              .join(''),

            '</div>',
            '</td>'
          ].join('');
        })
        .join(''),
      '</tr>'
    ].join('');

    // global stats
    globalStats.level.metal /= globalStats.planetCount;
    globalStats.level.crystal /= globalStats.planetCount;
    globalStats.level.deuterium /= globalStats.planetCount;

    var productionRatio = {
      metal:
        '1 / ' +
        Math.floor((100 * globalStats.prod.crystal) / globalStats.prod.metal) / 100 +
        ' / ' +
        Math.floor((100 * globalStats.prod.deuterium) / globalStats.prod.metal) / 100,
      crystal:
        Math.floor((100 * globalStats.prod.metal) / globalStats.prod.crystal) / 100 +
        ' / 1 / ' +
        Math.floor((100 * globalStats.prod.deuterium) / globalStats.prod.crystal) / 100,
      deuterium:
        Math.floor((100 * globalStats.prod.metal) / globalStats.prod.deuterium) / 100 +
        ' / ' +
        Math.floor((100 * globalStats.prod.crystal) / globalStats.prod.deuterium) / 100 +
        ' / 1'
    };

    planetStatsHtml =
      [
        '<tr>',
        '<td style="width: 80px"></td>',
        ['metal', 'crystal', 'deuterium']
          .map(function (resource) {
            return [
              '<td>',
              '<div class="shadowed" style="font-size: 20px; line-height: 32px; float: left; width: 48px; height: 32px; background-image:url(' +
                window.uipp_images.resources[resource] +
                ')">',
              Math.floor(10 * globalStats.level[resource]) / 10,
              '</div>',
              '<div style="float:left; width: 95px; text-align: left; padding-left: 1em; font-size: 10px; line-height: 1em; padding-bottom: 3px">',
              '<div class="uipp-current-global-resources" points="' +
                window._num(globalStats.points[resource] / 1000) +
                '">' +
                window._num(globalStats.current[resource], globalStats.prod[resource]) +
                '</div>',
              '<div><span class="undermark">+' +
                window._num(Math.floor(globalStats.prod[resource] * 3600)) +
                '</span> /' +
                window._translate('TIME_HOUR') +
                '</div>',
              '<div><span class="undermark">+' +
                window._num(Math.floor(globalStats.prod[resource] * 3600 * 24)) +
                '</span> /' +
                window._translate('TIME_DAY') +
                '</div>',
              '<div style="font-size: 8px; padding-top: 5px;">' + productionRatio[resource] + '</div>',
              '</div>',
              '</td>'
            ].join('');
          })
          .join(''),
        '</tr>',
        '<tr><td style="height:10px"></td></tr>'
      ].join('') + planetStatsHtml;

    planetStatsHtml += [
      '<tr>',
      '<td colspan="4" style="text-align:center;padding-top:15px" class="enhancement">',
      '<span class="icon_nf icon_share" style="cursor:pointer;" onclick="_shareStats(this)"></span>',
      '</td>',
      '</tr>'
    ].join('');

    window._shareStats = function _shareStats(el) {
      var $el = $(el);
      var $parent = $el.parent();
      var dateStr = new Date().toISOString().split('T')[0];
      var text = [
        window.config.universe.language + window.config.universe.number,
        $('meta[name="ogame-player-name"]').attr('content'),
        dateStr
      ].join(' - ');
      $parent.html(['<div>' + text + '</div>', '<div>Created with OGame UI++ (goo.gl/hXeoZn)</div>'].join(''));

      $('.uipp-stats-planet-name').each(function (i) {
        $(this).html('P' + (i + 1));
      });
      $('.uipp-stats-planet-coords').each(function () {
        $(this).html($(this).attr('temp') + ' °C');
      });

      $('.uipp-selected-resources-spacer').css('display', 'none');
      $('.uipp-selected-resources').css('display', 'none');
      $('.storage-time-spacer').css('display', 'none');
      $('.storage-time').css('display', 'none');
      $('.resources-in-flight-spacer').css('display', 'none');
      $('.resources-in-flight').css('display', 'none');
      $('.uipp-current-resources').each(function () {
        $(this).html($(this).attr('points') + ' points');
      });
      $('.uipp-current-global-resources').each(function () {
        $(this).html($(this).attr('points') + ' points');
      });
      $('.uipp-selected').removeClass('uipp-selected');

      $('.uiEnhancementWindow .uipp-table').css('background', 'black');
      window._getScreenshotLink($('.uiEnhancementWindow .uipp-table')[0], function (err, link) {
        $('.uiEnhancementWindow .uipp-table').css('background', 'inherit');
        if (err) {
          return window.fadeBox('Error while uploading screenshot', true);
        }

        window.fadeBox('Screenshot saved to imgur.com', false);
        $parent.html(link);
      });
    };

    $wrapperStats.append($('<table class="uipp-table">' + planetStatsHtml + '</table>'));

    // score charts
    var hasEnoughHistory = window._getPlayerScoreTrend(config.playerId, 'g', 2).hasEnoughHistory;
    if (!hasEnoughHistory) {
      $wrapperProgression.append('<div style="text-align:center">Come back tomorrow for historical charts !</div>');
    }
    if (hasEnoughHistory && window.config.features.charts) {
      $wrapperProgression.append('<div id="progression-content"></div>');
      var $wrapperProgressionContent = $wrapperProgression.find('#progression-content');

      var drawPlayerProgress = function (playerId) {
        var current = window.config.players[playerId];
        var history = window.config.history[playerId];

        // player selection
        var playerSelectHtml =
          '<select id="select-history-player" style="padding: 5px; margin: 10px 5px 0 0; border-radius: 5px; visibility:visible!important">';
        var players = [];
        for (var key in config.players) {
          players.push({
            gp: config.players[key].globalPosition,
            id: key,
            name: config.players[key].name
          });
        }
        players
          .sort(function (a, b) {
            return a.name > b.name ? 1 : -1;
          })
          .forEach(function (player) {
            playerSelectHtml +=
              '<option value="' +
              player.id +
              '" ' +
              (player.id == playerId ? 'selected' : '') +
              '/> ' +
              player.name +
              ' [' +
              player.gp +
              ']';
          });
        playerSelectHtml += '</select>';

        $wrapperProgressionContent.html(
          [
            '<div class="clearfix">',
            '<div id="chart-history" style="width:70%;height:200px;float:left;"></div>',
            '<div id="chart-pie" style="width:30%;height:170px;float:left;margin-top:5px;position:relative;">',
            '<span style="font-size:11px;">',
            '<img src="' +
              uipp_images.score.military +
              '" style="position:absolute;height:20px;top:42px;left:65px;"></span>',
            '<img src="' +
              uipp_images.score.research +
              '" style="position:absolute;height:20px;top:72px;left:65px;"></span>',
            '<img src="' +
              uipp_images.score.economy +
              '" style="position:absolute;height:20px;top:102px;left:65px;"></span>',
            '<span style="position:absolute;top:45px;left:90px;">',
            window._getPlayerScoreTrend(playerId, 'm', 2, 10).html,
            '</span>',
            '<span style="position:absolute;top:75px;left:90px;">',
            window._getPlayerScoreTrend(playerId, 'r', 2, 10).html,
            '</span>',
            '<span style="position:absolute;top:105px;left:90px;">',
            window._getPlayerScoreTrend(playerId, 'e', 2, 10).html,
            '</span>',
            '</span>',
            '</div>',
            '<div style="text-align: center">' + playerSelectHtml + '</div>',
            '</div>'
          ].join('')
        );
        setTimeout(function () {
          var labels = Object.keys(history);
          var series = [
            {
              name: 'military',
              data: []
            },
            {
              name: 'research',
              data: []
            },
            {
              name: 'economy',
              data: []
            }
          ];
          labels.forEach(function (day) {
            series[0].data.push({
              x: history[day].t,
              y: (history[day].e || 0) + (history[day].r || 0) + (history[day].m || 0)
            });
            series[1].data.push({ x: history[day].t, y: (history[day].r || 0) + (history[day].e || 0) });
            series[2].data.push({ x: history[day].t, y: history[day].e || 0 });
          });

          new window.Chartist.Line(
            '#chart-history',
            {
              labels: labels,
              series: series
            },
            {
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
                },
                low: 0
              },
              showArea: true,
              showLine: false,
              showPoint: false
            }
          );

          new window.Chartist.Pie(
            '#chart-pie',
            {
              series: [current.militaryScore, current.researchScore, current.economyScore]
            },
            {
              donut: true,
              donutWidth: 15,
              donutSolid: false,
              startAngle: 0,
              showLabel: false
            }
          );
        });

        // on select change, redraw area for the selected player
        setTimeout(function () {
          $('#select-history-player').change(function () {
            var playerId = $(this).val();
            drawPlayerProgress(playerId);
          });
          if (!window.firstStatsDraw) {
            $('#select-history-player').focus();
          } else {
            window.firstStatsDraw = false;
          }
        });
      }; // end function drawPlayerProgress

      var playerId = $('[name=ogame-player-id]').attr('content');
      window.firstStatsDraw = true;
      drawPlayerProgress(playerId);
    }

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

    // get max rentability time
    var maxRentability = 0;
    rentabilityTimes.forEach(function (e) {
      if (e.time > maxRentability) {
        maxRentability = e.time;
      }
    });

    // add astrophysics to rentability times
    var astroLevel = window.config.astroTech;
    if (isNaN(astroLevel) || !astroLevel) astroLevel = 0;
    var nextAstroLevelForPlanetUnlock = astroLevel + (astroLevel % 2 == 1 ? 2 : 1);
    var pushNextAstro = true;
    var dependenciesCost = [0, 0, 0];
    var dependenciesTime = 0;
    while (pushNextAstro) {
      var astroCost = window.uipp_getCummulativeCost('astrophysics', astroLevel, nextAstroLevelForPlanetUnlock - 1);
      if (astroLevel == 0) {
        var energyTech = config.energyTech || 0;
        var espionageTech = config.espionageTech || 0;
        var impulseDrive = config.impulseDrive || 0;
        if (energyTech < 1) {
          dependenciesCost[0] += 0;
          dependenciesCost[1] += 800;
          dependenciesCost[2] += 400;
        }
        if (espionageTech < 1) {
          dependenciesCost[0] += 200;
          dependenciesCost[1] += 1000;
          dependenciesCost[2] += 200;
        }
        if (espionageTech < 2) {
          dependenciesCost[0] += 400;
          dependenciesCost[1] += 2000;
          dependenciesCost[2] += 400;
        }
        if (espionageTech < 3) {
          dependenciesCost[0] += 800;
          dependenciesCost[1] += 4000;
          dependenciesCost[2] += 800;
        }
        if (espionageTech < 4) {
          dependenciesCost[0] += 1600;
          dependenciesCost[1] += 8000;
          dependenciesCost[2] += 1600;
        }
        if (impulseDrive < 1) {
          dependenciesCost[0] += 2000;
          dependenciesCost[1] += 4000;
          dependenciesCost[2] += 600;
        }
        if (impulseDrive < 2) {
          dependenciesCost[0] += 4000;
          dependenciesCost[1] += 8000;
          dependenciesCost[2] += 1200;
        }
        if (impulseDrive < 3) {
          dependenciesCost[0] += 8000;
          dependenciesCost[1] += 16000;
          dependenciesCost[2] += 2400;
        }
      }
      // ship cost
      dependenciesCost[0] += 10000;
      dependenciesCost[1] += 20000;
      dependenciesCost[2] += 10000;

      var dependenciesCostWorth = 0;
      dependenciesCostWorth += dependenciesCost[0] * worth.metal;
      dependenciesCostWorth += dependenciesCost[1] * worth.crystal;
      dependenciesCostWorth += dependenciesCost[2] * worth.deuterium;
      dependenciesTime = dependenciesCostWorth / globalProdWorth;

      var astroCostWorth = 0;
      astroCostWorth += astroCost[0] * worth.metal;
      astroCostWorth += astroCost[1] * worth.crystal;
      astroCostWorth += astroCost[2] * worth.deuterium;
      var astroTime = astroCostWorth / globalProdWorth;

      var medianMineLevels = _getMedianMineLevels();
      var cummulativeMineCosts = {
        metal: window.uipp_getCummulativeCost('metal', 0, medianMineLevels.metal - 1),
        crystal: window.uipp_getCummulativeCost('crystal', 0, medianMineLevels.crystal - 1),
        deuterium: window.uipp_getCummulativeCost('deuterium', 0, medianMineLevels.deuterium - 1)
      };

      var cummulativeMineCostsWorth = 0;
      cummulativeMineCostsWorth += cummulativeMineCosts.metal[0] * worth.metal;
      cummulativeMineCostsWorth += cummulativeMineCosts.metal[1] * worth.crystal;
      cummulativeMineCostsWorth += cummulativeMineCosts.crystal[0] * worth.metal;
      cummulativeMineCostsWorth += cummulativeMineCosts.crystal[1] * worth.crystal;
      cummulativeMineCostsWorth += cummulativeMineCosts.deuterium[0] * worth.metal;
      cummulativeMineCostsWorth += cummulativeMineCosts.deuterium[1] * worth.crystal;
      var mineEconomyTime = cummulativeMineCostsWorth / globalProdWorth;

      var newPlanetProductionWorth = 0;
      newPlanetProductionWorth += (window.uipp_getProduction('metal', medianMineLevels.metal) * worth.metal) / 3600;
      newPlanetProductionWorth +=
        (window.uipp_getProduction('crystal', medianMineLevels.crystal) * worth.crystal) / 3600;
      newPlanetProductionWorth +=
        (window.uipp_getProduction('deuterium', medianMineLevels.deuterium) * worth.deuterium) / 3600;
      var mineRentabilityTime = (cummulativeMineCostsWorth + astroCostWorth) / newPlanetProductionWorth;

      var totalTime = astroTime + mineEconomyTime + mineRentabilityTime + dependenciesTime;
      rentabilityTimes.push({
        coords: [],
        resource: 'astrophysics',
        level: nextAstroLevelForPlanetUnlock,
        time: totalTime,
        astroTime: astroTime,
        mineEconomyTime: mineEconomyTime,
        mineRentabilityTime: mineRentabilityTime,
        dependenciesTime: dependenciesTime,
        dependenciesCost: dependenciesCost,
        astroCost: astroCost,
        mineCost: [
          cummulativeMineCosts.metal[0] + cummulativeMineCosts.crystal[0] + cummulativeMineCosts.deuterium[0],
          cummulativeMineCosts.metal[1] + cummulativeMineCosts.crystal[1] + cummulativeMineCosts.deuterium[1],
          0
        ],
        metalLevel: medianMineLevels.metal,
        crystalLevel: medianMineLevels.crystal,
        deuteriumLevel: medianMineLevels.deuterium,
        inprog: (window.config.inprog.astro && nextAstroLevelForPlanetUnlock === window.config.astroTech + 1) || null
      });

      nextAstroLevelForPlanetUnlock += 2;
      astroLevel += 2;
      pushNextAstro = totalTime < maxRentability;
      if (astroLevel > 50) pushNextAstro = false; // safe exit condition
    }

    // add plasma to rentability array
    var pushNextPlasma = true;
    var plasmaLevel = window.config.plasmaTech || 0;
    if (isNaN(plasmaLevel) || !plasmaLevel) plasmaLevel = 0;
    while (pushNextPlasma) {
      // Plasma dependencies (10 laser, 8 energy, 5 ion)
      var laserCost = window.uipp_getCummulativeCost('laser', (config.laserTech || 0) + 1, 10);
      var energyCost = window.uipp_getCummulativeCost('energy', (config.energyTech || 0) + 1, 8);
      var ionCost = window.uipp_getCummulativeCost('ion', (config.ionTech || 0) + 1, 5);
      var dependenciesCost = [
        laserCost[0] + energyCost[0] + ionCost[0],
        laserCost[1] + energyCost[1] + ionCost[1],
        laserCost[2] + energyCost[2] + ionCost[2]
      ];
      var dependenciesCostWorth = 0;
      dependenciesCostWorth += dependenciesCost[0] * worth.metal;
      dependenciesCostWorth += dependenciesCost[1] * worth.crystal;
      dependenciesCostWorth += dependenciesCost[2] * worth.deuterium;
      var dependenciesTime = dependenciesCostWorth / globalProdWorth;

      var nextPlasmaRentabilityTime = window._getRentabilityTime('plasma', null, plasmaLevel);
      var totalTime = nextPlasmaRentabilityTime + dependenciesTime;

      rentabilityTimes.push({
        coords: [],
        resource: 'plasma',
        level: plasmaLevel + 1,
        time: totalTime,
        plasmaTime: nextPlasmaRentabilityTime,
        plasmaCost: window.uipp_getCost('plasma', plasmaLevel),
        dependenciesCost: dependenciesCost,
        dependenciesTime: dependenciesTime,
        inprog: (window.config.inprog.plasma && plasmaLevel === window.config.plasmaTech) || null
      });

      plasmaLevel++;
      if (totalTime >= maxRentability) {
        pushNextPlasma = false;
      }
      if (plasmaLevel > 50) pushNextPlasma = false; // safe exit condition
    }

    // rentability display
    rentabilityTimes = rentabilityTimes.sort(function (a, b) {
      return a.time - b.time;
    });

    var inprogPoints = 0;
    rentabilityTimes.forEach(function (rentability) {
      if (rentability.inprog) {
        try {
          inprogPoints += (rentability.totalCost || rentability.astroCost)[0];
          inprogPoints += (rentability.totalCost || rentability.astroCost)[1];
          inprogPoints += (rentability.totalCost || rentability.astroCost)[2];
        } catch (e) {
          console.log('OGame UI++: Error parsing in-progress');
        }
      }
    });
    inprogPoints = Math.floor(inprogPoints / 1000);
    var playerScores = [];
    for (var key in window.config.players) {
      var player = window.config.players[key];
      if (player && Number(player.globalScore)) {
        playerScores.push(Number(player.globalScore));
      }
    }
    playerScores = playerScores.sort(function (a, b) {
      return a < b ? 1 : -1;
    });

    if (window.config.features.nextbuilds) {
      var currentPlayer = window.config.players[$('[name=ogame-player-id]').attr('content')];
      if (currentPlayer) {
        var playerPositionAfterCompletion = playerScores.filter(function (score) {
          return score > Number(currentPlayer.globalScore) + inprogPoints;
        }).length;

        $wrapperRentability.append(
          $(
            [
              '<div style="text-align: center">',
              '<span class="icon12px icon_wrench"></span> ',
              '<span class="undermark">+' + inprogPoints + '</span> ',
              '<span>(' + currentPlayer.globalPosition + ' → ' + playerPositionAfterCompletion + ')</span>',
              '</div>'
            ].join('')
          )
        );
      }

      var $rentabilityWrapper = $('<div style="text-align:center" class="rentability"></div>');
      rentabilityTimes.forEach(function (rentability, i) {
        var tooltip = '';
        if (rentability.resource === 'plasma') {
          tooltip = window._translate('ROI', {
            time: window._time(rentability.time),
            tradeRate: window.config.tradeRate.join(' / ')
          });
          tooltip += '<br>';
          tooltip +=
            '<br>' +
            window._translate('RENTABILITY_PLASMA', {
              level: rentability.level,
              plasmaTime: window._time(rentability.plasmaTime),
              plasmaCost: window._num(rentability.plasmaCost).join(' / '),
              dependenciesTime: window._time(rentability.dependenciesTime),
              dependenciesCost: window._num(rentability.dependenciesCost).join(' / ')
            });
          tooltip = tooltip.replace(/<\/?span[^>]*>/g, '');
          $rentabilityWrapper.append(
            $(
              [
                '<span class="tooltip" title="' + tooltip + '"',
                ' style="display:inline-block;margin:5px;position:relative;height:50px;width:50px;"',
                ' onclick="uipp_toggleSimulateNextBuild(this, ' + i + ')">',
                '<img src="' + window.uipp_images[rentability.resource] + '" height="50"/>',
                '<span class="shadowed" style="position:absolute;width:100%;display:inline-block;line-height:50px;text-align:center;left:0;top: 0;font-size:26px;">' +
                  rentability.level +
                  '</span>',
                rentability.inprog
                  ? '<span class="icon12px icon_wrench" style="position:absolute;bottom:0;right:0;"></span>'
                  : '',
                '</span>'
              ].join('')
            )
          );
        } else if (rentability.resource === 'astrophysics') {
          tooltip = window._translate('ROI', {
            time: window._time(rentability.time),
            tradeRate: window.config.tradeRate.join(' / ')
          });
          tooltip += '<br>';
          tooltip +=
            '<br>' +
            window._translate('RENTABILITY_ASTRO', {
              level: rentability.level,
              mineLevel: rentability.metalLevel + ' / ' + rentability.crystalLevel + ' / ' + rentability.deuteriumLevel,
              dependenciesTime: window._time(rentability.dependenciesTime),
              astroTime: window._time(rentability.astroTime),
              mineEconomyTime: window._time(rentability.mineEconomyTime),
              mineTime: window._time(rentability.mineRentabilityTime),
              mineCost: window._num(rentability.mineCost).join(' / '),
              astroCost: window._num(rentability.astroCost).join(' / '),
              dependenciesCost: window._num(rentability.dependenciesCost).join(' / ')
            });
          tooltip = tooltip.replace(/<\/?span[^>]*>/g, '');
          $rentabilityWrapper.append(
            $(
              [
                '<span class="tooltip" title="' + tooltip + '"',
                ' style="display:inline-block;margin:5px;position:relative;height:50px;width:50px;"',
                ' onclick="uipp_toggleSimulateNextBuild(this, ' + i + ')">',
                '<img src="' + window.uipp_images[rentability.resource] + '" height="50"/>',
                '<span class="shadowed" style="position:absolute;width:100%;display:inline-block;line-height:50px;text-align:center;left:0;top: 0;font-size:26px;">' +
                  rentability.level +
                  '</span>',
                rentability.inprog
                  ? '<span class="icon12px icon_wrench" style="position:absolute;bottom:0;right:0;"></span>'
                  : '',
                '</span>'
              ].join('')
            )
          );
        } else {
          tooltip = window._translate('ROI', {
            time: window._time(rentability.time),
            tradeRate: window.config.tradeRate.join(' / ')
          });
          tooltip += '<br>';
          tooltip +=
            '<br>' +
            window._translate('RENTABILITY_MINE_' + rentability.resource.toUpperCase(), {
              level: rentability.level,
              economyTime: window._time(rentability.economyTime),
              coords: '[' + rentability.coords.join(':') + ']',
              totalCost: window._num(rentability.totalCost).join(' / ')
            });
          tooltip = tooltip.replace(/<\/?span[^>]*>/g, '');
          $rentabilityWrapper.append(
            $(
              [
                '<span class="tooltip" title="' + tooltip + '"',
                ' style="display:inline-block;margin:5px;position:relative;height:50px;width:50px;cursor:pointer;user-select:none"',
                ' onclick="uipp_toggleSimulateNextBuild(this, ' + i + ')">',
                '<img src="' + window.uipp_images[rentability.resource] + '" height="50"/>',
                '<span class="shadowed" style="position:absolute;width:100%;display:inline-block;line-height:35px;text-align:center;left:0;top: 0;font-size:19px;">' +
                  rentability.level +
                  '</span>',
                '<span class="shadowed" style="position:absolute;width:100%;display:inline-block;line-height:35px;text-align:center;left:0;top: 17px;font-size:9px;">[' +
                  rentability.coords.join(':') +
                  ']</span>',
                rentability.inprog
                  ? '<span class="icon12px icon_wrench" style="position:absolute;bottom:0;right:0;"></span>'
                  : '',
                '</span>'
              ].join('')
            )
          );
        }
      });

      $wrapperRentability.append($rentabilityWrapper);

      // allow to simulate next builds
      var simulatedNextBuilds = {};
      window.uipp_toggleSimulateNextBuild = function (el, i) {
        var rentability = rentabilityTimes[i];
        var $el = $(el);
        $el.toggleClass('uipp-selected');
        $el.css('outline-offset', '3px');

        var id = (rentability.coords || []).join('-') + rentability.resource;

        if ($el.hasClass('uipp-selected')) {
          simulatedNextBuilds[id] = rentability;
        } else {
          delete simulatedNextBuilds[id];
        }

        window.uipp_refreshSimulationDisplay();
      };

      window.uipp_resetSimulation = function () {
        simulatedNextBuilds = {};
        $('.rentability .uipp-selected').removeClass('uipp-selected');

        window.uipp_refreshSimulationDisplay();
      };

      window.uipp_refreshSimulationDisplay = function () {
        var $selectedWrapper = $('.uipp-simulation');
        if ($selectedWrapper) {
          $selectedWrapper.remove();
        }

        if (Object.keys(simulatedNextBuilds).length === 0) {
          return;
        }

        var totalCost = [0, 0, 0];
        var timeToAchieve = 0;
        for (var simKey in simulatedNextBuilds) {
          var cost = simulatedNextBuilds[simKey].astroCost || simulatedNextBuilds[simKey].totalCost;
          if (!simulatedNextBuilds[simKey].inprog) {
            totalCost[0] += cost[0];
            totalCost[1] += cost[1];
            totalCost[2] += cost[2];

            timeToAchieve += simulatedNextBuilds[simKey].time;
          }
        }

        var totalCostWorth = totalCost[0] * worth.metal + totalCost[1] * worth.crystal + totalCost[2] * worth.deuterium;

        var timeToAchieve = totalCostWorth / globalProdWorth;

        $rentabilityWrapper.append(
          [
            '<div class="uipp-simulation"',
            ' style="cursor:pointer;margin-top: 15px;font-size: 16px;"',
            ' onclick="uipp_resetSimulation()">',
            totalCost
              .map(function (n) {
                return window._num(n);
              })
              .join(' / '),
            ' ≈ ' + window._time(timeToAchieve, -1),
            '</div>'
          ].join('')
        );
      };
    }

    $wrapperRentability.append(
      ['<div style="padding: 2em; opacity: 0.5;">', window._translate('RENTABILITY_EXPLAINATION'), '</div>'].join('')
    );

    window._insertHtml($wrapper);
  });

  function _getMedianMineLevels() {
    var medianMineLevels = {
      metal: Infinity,
      crystal: Infinity,
      deuterium: Infinity
    };

    ['metal', 'crystal', 'deuterium'].forEach(function (res) {
      var levels = [];
      for (var key in window.config.my.planets) {
        var myPlanet = window.config.my.planets[key];
        if (myPlanet.resources && !myPlanet.isMoon) {
          levels.push(myPlanet.resources[res].level);
        }
      }
      levels = levels.sort();
      medianMineLevels[res] = levels[Math.floor(levels.length / 2)];
    });
    return medianMineLevels;
  }
};
