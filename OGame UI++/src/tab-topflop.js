var fn = function () {
  'use strict';

  window._addTabTopflop = function _addTabTopflop () {
    var $menuEntry = $('<li class="topflop enhanced"><span class="menu_icon"><div class="menuImage overview"></div></span><a class="menubutton" href="#" accesskey="" target="_self"><span class="textlabel enhancement">Top / Flop</span></a></li>');

    if (window._getPlayerScoreTrend($('[name=ogame-player-id]').attr('content'), 'g', 2).hasEnoughHistory) {
      $('#menuTable').append($menuEntry);
    }

    $menuEntry.click(function () {
      var $wrapper = window._onMenuClick('topflop');
      if (!$wrapper) return;

      window.uipp_analytics('uipp-tab-click', 'topflop');

      var N_ENTRIES = 15;
      var PLAYER_POOL = window.config.history;

      var sections = [];
      if (window.config.features.topgeneral) {
        sections.push('globalScore');
      }

      if (window.config.features.topeco) {
        sections.push('economyScore');
      }

      if (window.config.features.topfleet) {
        sections.push('militaryScore');
      }

      if (window.config.features.topresearch) {
        sections.push('researchScore');
      }

      sections.forEach(function (scoreType) {
        var entries = [];
        for (var playerId in PLAYER_POOL) {
          var current = Number((window.config.players[playerId] || {})[scoreType] || 0);
          var diff = window._getPlayerScoreTrend(playerId, scoreType[0], 2).abs || 0;
          var diffPercent = Math.round(100 * ((current / (current - diff)) - 1));

          if (current) {
            entries.push({
              playerId: playerId,
              rankScore: diff,
              current: current,
              diff: diff,
              diffPercent: diffPercent
            });
          }
        }

        var topflop = {
          top: entries.sort(function (a, b) {
            return b.rankScore - a.rankScore;
          }).slice(0, N_ENTRIES),
          flop: entries.sort(function (a, b) {
            return a.rankScore - b.rankScore;
          }).slice(0, N_ENTRIES)
        };

        if (scoreType === 'globalScore') {
          $wrapper.append($('<div id="highscoreContent" style="float: left;text-align:center;margin:0 0px 10px -12px"><span class="navButton uipp-score" id="points"></span></div>'));
        } else if (scoreType === 'economyScore') {
          $wrapper.append($('<div id="highscoreContent" style="float: left;text-align:center;margin:10px 0 10px -12px"><span class="navButton uipp-score" id="economy"></span></div>'));
        } else if (scoreType === 'militaryScore') {
          $wrapper.append($('<div id="highscoreContent" style="float: left;text-align:center;margin:10px 0 10px -12px"><span class="navButton uipp-score" id="fleet"></span></div>'));
        } else if (scoreType === 'researchScore') {
          $wrapper.append($('<div id="highscoreContent" style="float: left;text-align:center;margin:10px 0 10px -12px"><span class="navButton uipp-score" id="research"></span></div>'));
          delete topflop.flop;
        }

        for (var key in topflop) {
          $wrapper.append($([
            '<div class="halfsection">',
            '<table class="uipp-table">',
            topflop[key].map(function (entry) {
              return [
                '<tr>',
                '<td>',
                window.config.players[entry.playerId] ? ('(' + window.config.players[entry.playerId][scoreType.replace('Score', 'Position')] + ')') : '',
                '</td>',
                '<td>',
                ((window.config.players[entry.playerId] || {}).name || window._translate('DELETED_PLAYER')),
                '</td>',
                '<td>',
                window.uipp_scoreHumanReadable(entry.current),
                '</td>',
                '<td>',
                window.uipp_diff(window.uipp_scoreHumanReadable(entry.diff)),
                '</td>',
                '<td>',
                '(' + window.uipp_diff(entry.diffPercent, true, false) + ')',
                '</td>',
                '</tr>'
              ].join('');
            }).join(''),
            '</table>',
            '</div>'
          ].join('')));
        }

      });

      window._insertHtml($wrapper);
    });
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
