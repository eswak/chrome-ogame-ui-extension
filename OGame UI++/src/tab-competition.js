'use strict';

var allianceId = $('[name=ogame-alliance-id]').attr('content');

window._addCompetitionTab = function _addCompetitionTab() {
  var $competitionsEntry = $(
    '<li class="competition enhanced"><span class="menu_icon"><div class="menuImage rewarding"></div></span><a class="menubutton" href="#" accesskey="" target="_self"><span class="textlabel enhancement">' +
      window._translate('MENU_COMPETITION') +
      '</span></a></li>'
  );

  if (window._getPlayerScoreTrend(config.playerId, 'g', 2).hasEnoughHistory) {
    $('#menuTable').append($competitionsEntry);
  }

  config.competition = config.competition || {};
  config.competition.watchList = config.competition.watchList || [];
  config.competition.excludeList = config.competition.excludeList || [];
  if (config.competition.watchSimilarStart === undefined) {
    config.competition.watchSimilarStart = true;
  } else {
    config.competition.watchSimilarStart = config.competition.watchSimilarStart || false;
  }
  if (config.competition.watchSimilarNow === undefined) {
    config.competition.watchSimilarNow = true;
  } else {
    config.competition.watchSimilarNow = config.competition.watchSimilarNow || false;
  }
  if (allianceId) {
    if (config.competition.watchAlliance === undefined) {
      config.competition.watchAlliance = true;
    } else {
      config.competition.watchAlliance = config.competition.watchAlliance || false;
    }
  }

  $competitionsEntry.click(function () {
    var $wrapper = window._onMenuClick('competition');
    if (!$wrapper) return;
    $wrapper.append('<div id="competition-tab" class="uipp-box"></div>');
    window._insertHtml($wrapper);
    window.uipp_displayCompetition();
  });
};

window.uipp_displayCompetition = function () {
  var $tabContent = $('#competition-tab');
  $tabContent.html('<h3>' + window._translate('MENU_COMPETITION') + '</h3>');

  // create series of score of all players
  var series = {};

  // watch list
  config.competition.watchList.forEach(function (playerId) {
    series[playerId] = {
      name: playerId,
      data: []
    };
    console.log('[ADD] WatchList   ', playerId, config.players[playerId].name);
  });

  // series of players that had a similar score at player's start date
  // series of players that have a similar score to player today
  var threshold = 1.3; // 30% near scores
  // use player id 1 because it's present in all universes
  var historyDates = Object.keys((config.history || {})['1'] || {});
  for (var playerId in config.players) {
    var playerFirstDayHistory = config.history[config.playerId][historyDates[0]];
    var playerLastDayHistory = config.history[config.playerId][historyDates[historyDates.length - 1]];
    var otherFirstDayHistory = config.history[playerId][historyDates[0]];
    var otherLastDayHistory = config.history[playerId][historyDates[historyDates.length - 1]];
    var addPlayerHistory = false;
    if (
      config.competition.watchSimilarStart &&
      otherFirstDayHistory &&
      playerFirstDayHistory &&
      otherFirstDayHistory.g < playerFirstDayHistory.g * threshold &&
      otherFirstDayHistory.g > playerFirstDayHistory.g / threshold
    ) {
      console.log('[ADD] SimilarStart', playerId, config.players[playerId].name);
      addPlayerHistory = true;
    }
    if (
      config.competition.watchSimilarNow &&
      otherLastDayHistory &&
      playerLastDayHistory &&
      otherLastDayHistory.g != 0 && // no players that deleted account
      otherLastDayHistory.g < playerLastDayHistory.g * threshold &&
      otherLastDayHistory.g > playerLastDayHistory.g / threshold
    ) {
      console.log('[ADD] SimilarNow  ', playerId, config.players[playerId].name);
      addPlayerHistory = true;
    }
    if (config.competition.watchAlliance && config.players[playerId].alliance == allianceId) {
      console.log('[ADD] Alliance    ', playerId, config.players[playerId].name);
      addPlayerHistory = true;
    }

    if (addPlayerHistory) {
      series[playerId] = {
        name: playerId,
        data: []
      };
    }
  }

  // filter out players with inactive, banned, or vacation mode
  for (var playerId in series) {
    var exclude =
      ['i', 'I', 'v', 'b', 'vi', 'vI', 'vib', 'vIb', 'vb', 'ib', 'Ib'].indexOf(config.players[playerId].status) !== -1;
    if (exclude && config.competition.watchList.indexOf(playerId) == -1) {
      delete series[playerId];
      console.log('[DEL] Status      ', playerId, config.players[playerId].name, '->', config.players[playerId].status);
    }
  }

  // exclude list
  config.competition.excludeList.forEach(function (playerId) {
    delete series[playerId];
    console.log('[DEL] BlackList   ', playerId, config.players[playerId].name);
  });

  // build timeseries for all series
  var seriesArray = Object.values(series);
  seriesArray.forEach(function (serie, i) {
    var playerId = serie.name;
    if (config.history[playerId]) {
      historyDates.forEach(function (date) {
        if (config.history[playerId][date]) {
          series[playerId].data.push({
            x: config.history[playerId][date].t || new Date(date).getTime(),
            y: config.history[playerId][date].g || 0
          });
        }
      });
    } else {
      // handle deleted players
      seriesArray.splice(i, 1);
      console.log('[DEL] Unknown     ', playerId, config.players[playerId].name);
    }
  });

  // add player serie as the last entry
  seriesArray.push({
    name: config.playerId,
    data: []
  });
  historyDates.forEach(function (date) {
    if (config.history[config.playerId][date]) {
      seriesArray[seriesArray.length - 1].data.push({
        x: config.history[config.playerId][date].t,
        y: config.history[config.playerId][date].g
      });
    }
  });

  // draw chart
  $tabContent.append('<div id="chart-all-players" style="width:100%;height:400px;user-select:none;"></div>');
  $tabContent.append('<div id="chart-all-players-text"></div>');
  $tabContent.append(
    [
      '<style>',
      '#chart-all-players .ct-line { stroke-width: 2px; }',
      '#chart-all-players .ct-line:hover { stroke-width: 10px !important; }',
      '#chart-all-players .ct-series:last-child .ct-line { stroke-width: 5px; stroke: white }',
      '</style>'
    ].join('')
  );
  setTimeout(function () {
    new window.Chartist.Line(
      '#chart-all-players',
      {
        series: seriesArray
      },
      {
        axisX: {
          type: window.Chartist.FixedScaleAxis,
          divisor: 5,
          labelInterpolationFnc: function (value) {
            // use gameforge-injected function
            return getFormatedDate(value, '[d]/[m]-[H]' + window._translate('TIME_HOUR') + '[i]');
            /*var dayOfMonthStr = new Date(value).toISOString().split('T')[0].split('-')[2];
            var monthStr = new Date(value).toISOString().split('T')[0].split('-')[1];
            return dayOfMonthStr + '/' + monthStr;*/
          }
        },
        axisY: {
          type: window.Chartist.FixedScaleAxis,
          divisor: 5,
          labelInterpolationFnc: function (value) {
            return window.uipp_scoreHumanReadable(value);
          }
        },
        showArea: false,
        showLine: true,
        showPoint: false,
        borderWidth: 2,
        plugins: []
      }
    );
  });

  setTimeout(function () {
    var $detail = $('#chart-all-players-text');

    var getProgress = function (oldValue, newValue) {
      if (oldValue == undefined) return '';
      var diff = Math.round(100 * (newValue / oldValue - 1));
      var str = '';
      if (diff > 0) {
        str = '<span style="color:#9c0;">+' + diff + '%</span>';
      } else if (diff < 0) {
        str = '<span style="color:#d43635;">' + diff + '%</span>';
      } else {
        str = '<span style="color:#888;">' + '0%' + '</span>';
      }
      return str.replace('Infinity', '∞');
    };

    var getTooltip = function (playerId, color) {
      color = color || '#fff';
      var player = config.players[playerId];
      var history = config.history[playerId];
      var historyDates = Object.keys(history).reverse();
      return [
        '<div style="text-align:center;background:#0a141d;border-radius:10px;padding:10px;">',
        '<div style="font-weight:bold;font-size:14px;padding-bottom:10px;color:' +
          color +
          '">' +
          player.name +
          '</div>',
        player.planets.length
          ? [
              '<div style="padding-bottom:10px;">',
              player.planets
                .map(function (planet) {
                  return (
                    '<a href="?page=ingame&component=galaxy&galaxy=' +
                    planet.coords[0] +
                    '&system=' +
                    planet.coords[1] +
                    '&position=' +
                    planet.coords[2] +
                    '">[' +
                    planet.coords.join(':') +
                    ']</a>'
                  );
                })
                .join(' '),
              '</div>'
            ].join('')
          : '',
        '<table style="width:100%;">',
        '<thead>',
        '<tr>',
        '<th><img src="' + uipp_images.datetime + '" style="height:32px"/></th>',
        '<th colspan="2"><img src="' + uipp_images.score.global + '" style="height:32px"/></th>',
        '<th colspan="2"><img src="' + uipp_images.score.economy + '" style="height:32px"/></th>',
        '<th colspan="2"><img src="' + uipp_images.score.research + '" style="height:32px"/></th>',
        '<th colspan="2"><img src="' + uipp_images.score.military + '" style="height:32px"/></th>',
        '<th colspan="2"><img src="' + uipp_images.score.fleet + '" style="height:32px"/></th>',
        '</tr>',
        '</thead>',
        '<tbody>',
        historyDates
          .map(function (date, i) {
            return [
              '<tr>',
              '<td style="padding:5px;border-right:1px solid #25394c;white-space:nowrap">' + date + '</td>',
              '<td style="padding:5px">' + window.uipp_scoreHumanReadable(history[date].g) + '</td>',
              '<td style="padding:5px;border-right:1px solid #25394c">' +
                getProgress((history[historyDates[i + 1]] || {}).g, history[date].g) +
                '</td>',
              '<td style="padding:5px">' + window.uipp_scoreHumanReadable(history[date].e) + '</td>',
              '<td style="padding:5px;border-right:1px solid #25394c">' +
                getProgress((history[historyDates[i + 1]] || {}).e, history[date].e) +
                '</td>',
              '<td style="padding:5px">' + window.uipp_scoreHumanReadable(history[date].r) + '</td>',
              '<td style="padding:5px;border-right:1px solid #25394c">' +
                getProgress((history[historyDates[i + 1]] || {}).r, history[date].r) +
                '</td>',
              '<td style="padding:5px">' + window.uipp_scoreHumanReadable(history[date].m) + '</td>',
              '<td style="padding:5px;border-right:1px solid #25394c">' +
                getProgress((history[historyDates[i + 1]] || {}).m, history[date].m) +
                '</td>',
              '<td style="padding:5px">' + window.uipp_scoreHumanReadable(history[date].s) + '</td>',
              '<td style="padding:5px">' +
                getProgress((history[historyDates[i + 1]] || {}).s, history[date].s) +
                '</td>',
              '</tr>'
            ].join('');
          })
          .join(''),
        '</tbody>',
        '</table>',
        '</div>'
      ].join('');
    };

    // gray out stagnant players
    seriesArray.forEach(function (serie, i) {
      if (i == seriesArray.length - 1) return;
      if (!serie.data.length) return; // handle deleted players
      var firstPoint = serie.data[0].y;
      var lastPoint = serie.data[serie.data.length - 1].y;
      var growth = lastPoint / firstPoint - 1;
      if (growth == 0) {
        $('#chart-all-players .ct-series:nth-child(' + (i + 1) + ') .ct-line')
          .css('stroke', '#888888')
          .css('stroke-width', '1px')
          .css('opacity', '0.5');
      }
    });

    $detail.html(getTooltip(config.playerId));
    $('#chart-all-players .ct-line').each(function () {
      $(this).mouseenter(function () {
        var color = $(this).css('stroke');
        var playerId = $(this).parent().attr('ct:series-name');
        $detail.html(getTooltip(playerId, color));
      });
    });
  }, 100);

  $tabContent.append(
    '<div id="competition-settings" style="padding: 2em 2em 0; text-align:justify; user-select: none"></div>'
  );
  setTimeout(window.uipp_competitionSettings, 100);

  $tabContent.append(
    [
      '<div style="padding: 2em; opacity: 0.5;text-align:justify">',
      window._translate('COMPETITION_EXPLAINATION'),
      '</div>'
    ].join('')
  );
};

window.onUippSettingsChanged = function (el) {
  if (el.id == 'cb-watchsimilarstart') window.config.competition.watchSimilarStart = el.checked || false;
  if (el.id == 'cb-watchsimilarnow') window.config.competition.watchSimilarNow = el.checked || false;
  if (el.id == 'cb-watchalliance') window.config.competition.watchAlliance = el.checked || false;
  if (el.id.indexOf('untrack-player-') == 0) {
    var playerId = el.id.replace('untrack-player-', '');
    var index = config.competition.watchList.indexOf(playerId);
    if (playerId && index != -1) {
      config.competition.watchList.splice(index, 1);
    } else {
      return;
    }
  }
  if (el.id == 'track-player') {
    var playerId = $('#select-track-player').val();
    if (playerId && config.competition.watchList.indexOf(playerId) == -1) {
      config.competition.watchList.push(playerId);
    } else {
      return;
    }
  }
  window._saveConfig();
  window.uipp_displayCompetition();
};

window.uipp_competitionSettings = function () {
  var $settingsContent = $('#competition-settings');
  var html = '';

  // Checkbox: alliance players
  if (allianceId) {
    html += '<div style="margin-top:10px">';
    html +=
      '<input id="cb-watchalliance" type="checkbox" ' +
      (config.competition.watchAlliance ? 'checked' : '') +
      ' onchange="onUippSettingsChanged(this)"/>';
    html += '<label for="cb-watchalliance">' + window._translate('COMPETITION_SETTING_ALLIANCE') + '</div>';
    html += '</div>';
  }
  // Checkbox: players with similar start
  html += '<div style="margin-top:10px">';
  html +=
    '<input id="cb-watchsimilarstart" type="checkbox" ' +
    (config.competition.watchSimilarStart ? 'checked' : '') +
    ' onchange="onUippSettingsChanged(this)"/>';
  html += '<label for="cb-watchsimilarstart">' + window._translate('COMPETITION_SETTING_SIMILAR_START') + '</div>';
  html += '</div>';
  // Checkbox: players similar today
  html += '<div style="margin-top:10px">';
  html +=
    '<input id="cb-watchsimilarnow" type="checkbox" ' +
    (config.competition.watchSimilarNow ? 'checked' : '') +
    ' onchange="onUippSettingsChanged(this)"/>';
  html += '<label for="cb-watchsimilarnow">' + window._translate('COMPETITION_SETTING_SIMILAR_NOW') + '</div>';
  html += '</div>';
  // List of tracked players
  var watchList = config.competition.watchList || [];
  html += '<div style="margin-top:10px">';
  html += window._translate('COMPETITION_SETTING_WATCHLIST') + ':';
  html += '<ul>';
  // current player
  html += '<li style="margin-left:20px;padding-top:10px;">';
  html += '<span class="icon icon_user" style="vertical-align:-3px;filter: saturate(0);"></span> ';
  html += config.players[config.playerId].name;
  html += ' [' + config.players[config.playerId].globalPosition + ']';
  html += '</li>';
  // other players
  watchList.forEach(function (playerId) {
    html += '<li style="margin-left:20px;padding-top:10px;">';
    html +=
      '<span class="icon icon_trash" style="cursor:pointer;vertical-align:-3px" id="untrack-player-' +
      playerId +
      '" onClick="onUippSettingsChanged(this)"></span> ';
    html += (config.players[playerId] || {}).name || 'Deleted Player';
    if (config.players[playerId]) {
      html += ' [' + config.players[playerId].globalPosition + ']';
    }
    html += '</li>';
  });
  // add tracked player
  html += '<li>';
  html +=
    '<select id="select-track-player" style="padding: 5px; margin: 10px 5px 0 0; border-radius: 5px; visibility:visible!important">';
  html += '<option value=""/> --- Select a player ---';
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
      html += '<option value="' + player.id + '"/> ' + player.name + ' [' + player.gp + ']';
    });
  html += '</select>';
  html +=
    '<button style="4px 7px" class="btn_blue" id="track-player" onClick="onUippSettingsChanged(this)">' +
    window._translate('COMPETITION_SETTING_WATCHLIST_ADD') +
    '</button>';
  html += '</li>';
  html += '</ul>';
  html += '</div>';

  $settingsContent.html(html);
};
