'use strict';

window._loadUniverseApi = function _loadUniverseApi(cb) {
  console.log('OGame UI++ : loading universe data from OGame API...');
  $.ajax({
    url: '/api/players.xml',
    dataType: 'xml',
    success: function (playerData) {
      var players = {};
      $('player', playerData).each(function () {
        players[$(this).attr('id')] = {
          id: $(this).attr('id'),
          status: $(this).attr('status'),
          name: $(this).attr('name'),
          planets: [],
          alliance: $(this).attr('alliance') || null
        };
      });

      $.ajax({
        url: '/api/universe.xml',
        dataType: 'xml',
        success: function (universeData) {
          $('planet', universeData).each(function () {
            if (players[$(this).attr('player')]) {
              players[$(this).attr('player')].planets.push({
                name: $(this).attr('name'),
                coords: $(this).attr('coords').split(':').map(Number),
                moon: $(this).find('moon').length
              });
            }
          });

          $.ajax({
            url: '/api/highscore.xml?category=1&type=1',
            dataType: 'xml',
            success: function (economyScores) {
              $('player', economyScores).each(function () {
                if (players[$(this).attr('id')]) {
                  players[$(this).attr('id')].economyPosition = $(this).attr('position');
                  players[$(this).attr('id')].economyScore = $(this).attr('score');
                }
              });

              $.ajax({
                url: '/api/highscore.xml?category=1&type=0',
                dataType: 'xml',
                success: function (globalScores) {
                  $('player', globalScores).each(function () {
                    if (players[$(this).attr('id')]) {
                      players[$(this).attr('id')].globalPosition = $(this).attr('position');
                      players[$(this).attr('id')].globalScore = $(this).attr('score');
                    }
                  });

                  $.ajax({
                    url: '/api/highscore.xml?category=1&type=3',
                    dataType: 'xml',
                    success: function (militaryScores) {
                      $('player', militaryScores).each(function () {
                        if (players[$(this).attr('id')]) {
                          players[$(this).attr('id')].militaryPosition = $(this).attr('position');
                          players[$(this).attr('id')].militaryScore = $(this).attr('score');
                          players[$(this).attr('id')].ships = $(this).attr('ships') || '0';
                        }
                      });

                      $.ajax({
                        url: '/api/highscore.xml?category=1&type=2',
                        dataType: 'xml',
                        success: function (researchScores) {
                          $('player', researchScores).each(function () {
                            if (players[$(this).attr('id')]) {
                              players[$(this).attr('id')].researchPosition = $(this).attr('position');
                              players[$(this).attr('id')].researchScore = $(this).attr('score');
                            }
                          });

                          $.ajax({
                            url: '/api/highscore.xml?category=1&type=7',
                            dataType: 'xml',
                            success: function (honorScores) {
                              $('player', honorScores).each(function () {
                                if (players[$(this).attr('id')]) {
                                  players[$(this).attr('id')].honorPosition = $(this).attr('position');
                                  players[$(this).attr('id')].honorScore = $(this).attr('score');
                                }
                              });

                              $.ajax({
                                url: '/api/alliances.xml',
                                dataType: 'xml',
                                success: function (alliancesData) {
                                  $('player', alliancesData).each(function () {
                                    var playerId = $(this).attr('id');
                                    var allianceId = $(this).parent().attr('id');
                                    if (players[playerId]) {
                                      players[playerId].alliance = allianceId;
                                    }
                                  });

                                  $.ajax({
                                    url: '/api/localization.xml',
                                    dataType: 'xml',
                                    success: function (localizationData) {
                                      var labels = {
                                        metal: resourcesBar.resources.metal.tooltip.split('|')[0],
                                        crystal: resourcesBar.resources.crystal.tooltip.split('|')[0],
                                        deuterium: resourcesBar.resources.deuterium.tooltip.split('|')[0]
                                      };
                                      $('name', localizationData).each(function () {
                                        labels[$(this).attr('id')] = $(this).text();
                                      });

                                      $.ajax({
                                        url: '/api/serverData.xml',
                                        dataType: 'xml',
                                        success: function (data) {
                                          var universe = window.xml2json(data).serverData;
                                          console.log('OGame UI++ : loaded universe data.');
                                          cb && cb(players, universe, labels);
                                        }
                                      });
                                    }
                                  });
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
};
