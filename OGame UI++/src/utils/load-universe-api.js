var fn = function () {
  'use strict';

  window._loadUniverseApi = function _loadUniverseApi(cb) {
    console.log('OGame UI++ : loading universe data from OGame API...');
    $.ajax({
      url: '/api/players.xml',
      dataType: 'xml',
      success: function (data) {
        var players = {};
        var id;
        var status;
        var name;
        var alliance;
        var $el;
        $('player', data).each(function () {
          $el = $(this);
          id = $el.attr('id');
          status = $el.attr('status');
          name = $el.attr('name');
          alliance = $el.attr('alliance') || null;
          players[id] = {
            id: id,
            status: status,
            name: name,
            planets: [],
            alliance: alliance
          };
        });

        $.ajax({
          url: '/api/universe.xml',
          dataType: 'xml',
          success: function (data) {
            var player;
            var name;
            var coords;
            var $el;
            $('planet', data).each(function () {
              $el = $(this);
              player = $el.attr('player');
              name = $el.attr('name');
              coords = $el.attr('coords').split(':');
              coords[0] = parseInt(coords[0]);
              coords[1] = parseInt(coords[1]);
              coords[2] = parseInt(coords[2]);
              if (players[player]) {
                players[player].planets.push({
                  name: name,
                  coords: coords
                });
              }
            });

            $.ajax({
              url: '/api/highscore.xml?category=1&type=1',
              dataType: 'xml',
              success: function (data) {
                var position;
                var id;
                var score;
                var $el;
                $('player', data).each(function () {
                  $el = $(this);
                  position = $el.attr('position');
                  id = $el.attr('id');
                  score = $el.attr('score');
                  if (players[id]) {
                    players[id].economyPosition = position;
                    players[id].economyScore = score;
                  }
                });

                $.ajax({
                  url: '/api/highscore.xml?category=1&type=0',
                  dataType: 'xml',
                  success: function (data) {
                    var position;
                    var id;
                    var score;
                    var $el;
                    $('player', data).each(function () {
                      $el = $(this);
                      position = $el.attr('position');
                      id = $el.attr('id');
                      score = $el.attr('score');
                      if (players[id]) {
                        players[id].globalPosition = position;
                        players[id].globalScore = score;
                      }
                    });

                    $.ajax({
                      url: '/api/highscore.xml?category=1&type=3',
                      dataType: 'xml',
                      success: function (data) {
                        var position;
                        var id;
                        var score;
                        var ships;
                        var $el;
                        $('player', data).each(function () {
                          $el = $(this);
                          position = $el.attr('position');
                          id = $el.attr('id');
                          score = $el.attr('score');
                          ships = $el.attr('ships');
                          if (players[id]) {
                            players[id].militaryPosition = position;
                            players[id].militaryScore = score;
                            players[id].ships = ships;
                          }
                        });

                        $.ajax({
                          url: '/api/highscore.xml?category=1&type=2',
                          dataType: 'xml',
                          success: function (data) {
                            var position;
                            var id;
                            var score;
                            var $el;
                            $('player', data).each(function () {
                              $el = $(this);
                              position = $el.attr('position');
                              id = $el.attr('id');
                              score = $el.attr('score');
                              if (players[id]) {
                                players[id].researchPosition = position;
                                players[id].researchScore = score;
                              }
                            });

                            $.ajax({
                              url: '/api/serverData.xml',
                              dataType: 'xml',
                              success: function (data) {
                                var universe = xml2json(data).serverData;
                                console.log('OGame UI++ : loaded universe data.');
                                cb && cb(players, universe);
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
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
