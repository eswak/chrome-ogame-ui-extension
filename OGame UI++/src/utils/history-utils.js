var fn = function () {
  'use strict';

  window._getPlayerScoreTrend = function _getPlayerScoreTrend(playerId, type, minEntries, maxEntries) {
    minEntries = minEntries || 3;
    maxEntries = maxEntries || minEntries;
    config.history = config.history || {};
    var playerScores = [];
    for (var day in config.history[playerId]) {
      playerScores.push({
        t: day,
        v: config.history[playerId][day][type] || -1
      });
    }

    playerScores = playerScores.filter(function (score) {
      return score.v !== -1;
    });

    if (playerScores.length < minEntries) {
      return { n: 0, abs: 0, html: '<span class="tooltip" title="Come back tommorow for more stats">?</span>' };
    }

    playerScores = playerScores.slice(Math.max(playerScores.length - maxEntries, 0), playerScores.length);

    var trend = playerScores.reduce(function (trend, score) {
      if (score.t < trend.firstDay || trend.firstDay === null) {
        trend.firstDay = score.t;
        trend.firstScore = score.v;
      }

      if (score.t > trend.lastDay || trend.lastDay === null) {
        trend.lastDay = score.t;
        trend.lastScore = score.v;
      }

      return trend;
    }, { firstDay: null, lastDay: null, firstScore: null, lastScore: null });

    var timespan = (new Date(trend.lastDay).getTime() - new Date(trend.firstDay).getTime()) / (24 * 36e5) + 1;
    var diff = (trend.lastScore / (trend.firstScore || 1)) - 1;
    var diffPerDay = Math.round(100 * (diff / timespan));

    var str;
    if (diffPerDay > 0) {
      str = '<span style="color:#9c0;">+' + diffPerDay + '%</span>';
    } else if (diffPerDay < 0) {
      str = '<span style="color:#d43635;">' + diffPerDay + '%</span>';
    } else {
      str = '<span style="color:#888;">' + '0%' + '</span>';
    }

    var title = Math.round(100 * diff) + '% / ' + timespan + ' ' + _translate('TIME_DAY') + '<br><br>';
    title += playerScores.map(function (score) {
      return score.t + ' : ' + score.v;
    }).join('<br>');

    str = [
      '<span class="tooltip js_hideTipOnMobile" title="' + title + '">',
      str,
      '</span>'
    ].join('');

    return {
      n: diffPerDay,
      abs: trend.lastScore - trend.firstScore,
      html: str
    };
  };

  window._getPlayerHistoryChart = function _getPlayerHistoryChart(playerId, type) {
    var playerScores = [];
    for (var day in config.history[playerId]) {
      playerScores.push({
        t: day,
        v: config.history[playerId][day][type]
      });
    }

    if (playerScores.length < 3) {
      return '';
    }

    var maxScore = playerScores.reduce(function (max, score) {
      return score.v > max ? score.v : max;
    }, 0);

    return [
      '<div class="uipp-score">',
        playerScores.map(function (score) {
          return '<div class="uipp-score-bar tooltip" style="width: calc(' + (100 / playerScores.length) + '% - 1px); height:' + (score.v / maxScore) * 100 + '%" title="' + score.t + ' : ' + score.v + '"></div>';
        }).join(''),
      '</div>'
    ].join('');
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
