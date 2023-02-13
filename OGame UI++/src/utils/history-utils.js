'use strict';

window._getPlayerScoreTrend = function _getPlayerScoreTrend(playerId, type, minEntries, maxEntries) {
  minEntries = minEntries || 3;
  maxEntries = maxEntries || minEntries;
  window.config.history = window.config.history || {};
  var playerScores = [];
  for (var day in window.config.history[playerId]) {
    playerScores.push({
      t: day,
      v: window.config.history[playerId][day][type] || -1
    });
  }

  playerScores = playerScores.filter(function (score) {
    return score.v !== -1;
  });

  if (playerScores.length < minEntries) {
    return {
      hasEnoughHistory: false,
      n: 0,
      abs: 0,
      html: '<span class="tooltip" title="Come back tommorow for more stats"></span>'
    };
  }

  playerScores = playerScores.slice(Math.max(playerScores.length - maxEntries, 0), playerScores.length);

  var trend = playerScores.reduce(
    function (trendAcc, score) {
      if (score.t < trendAcc.firstDay || trendAcc.firstDay === null) {
        trendAcc.firstDay = score.t;
        trendAcc.firstScore = score.v;
      }

      if (score.t > trendAcc.lastDay || trendAcc.lastDay === null) {
        trendAcc.lastDay = score.t;
        trendAcc.lastScore = score.v;
      }

      return trendAcc;
    },
    { firstDay: null, lastDay: null, firstScore: null, lastScore: null }
  );

  var timespan = (new Date(trend.lastDay).getTime() - new Date(trend.firstDay).getTime()) / (24 * 36e5) + 1;
  var diff = trend.lastScore / (trend.firstScore || 1) - 1;
  var diffPerDay = Math.round(1000 * (diff / (timespan - 1 || 1))) / 10;

  var str;
  if (diff > 0) {
    if (diffPerDay >= 500) {
      var multiplier = Math.floor(100 * (1 + diffPerDay / 100)) / 100;
      if (diffPerDay >= 5000) {
        multiplier = Math.floor(1 + diffPerDay / 100);
      }
      str = '<span style="color:#9c0;">x' + multiplier + '</span>';
    } else {
      str = '<span style="color:#9c0;">+' + diffPerDay + '%</span>';
    }
  } else if (diff < 0) {
    str = '<span style="color:#d43635;">' + diffPerDay + '%</span>';
  } else {
    str = '<span style="color:#888;">' + '0%' + '</span>';
  }

  var title = Math.round(100 * diff) + '% / ' + timespan + ' ' + window._translate('TIME_DAY') + '<br><br>';
  title += playerScores
    .map(function (score) {
      return score.t + ' : ' + score.v;
    })
    .join('<br>');

  str = ['<span class="tooltip js_hideTipOnMobile" title="' + title + '">', str, '</span>'].join('');

  return {
    hasEnoughHistory: true,
    n: diffPerDay,
    abs: trend.lastScore - trend.firstScore,
    html: str
  };
};
