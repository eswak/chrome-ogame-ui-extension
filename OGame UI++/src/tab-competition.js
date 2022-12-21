'use strict';
window._addCompetitionTab = function _addCompetitionTab() {
  var $competitionsEntry = $(
    '<li class="competition enhanced"><span class="menu_icon"><div class="menuImage rewarding"></div></span><a class="menubutton" href="#" accesskey="" target="_self"><span class="textlabel enhancement">' +
      window._translate('MENU_COMPETITION') +
      '</span></a></li>'
  );

  if (window._getPlayerScoreTrend(config.playerId, 'g', 2).hasEnoughHistory) {
    $('#menuTable').append($competitionsEntry);
  }

  $competitionsEntry.click(function () {
    var $wrapper = window._onMenuClick('competition');
    if (!$wrapper) return;

    // create series of score of all players
    var series = {};
    var threshold = 1.3; // 30% near scores
    // use player id 1 because it's present in all universes
    var historyDates = Object.keys((config.history || {})['1'] || {});
    // series of players that had a similar score at player's start date
    // series of players that have a similar score to player today
    for (var playerId in config.players) {
      var playerFirstDayHistory = config.history[config.playerId][historyDates[0]];
      var playerLastDayHistory = config.history[config.playerId][historyDates[historyDates.length - 1]];
      var otherFirstDayHistory = config.history[playerId][historyDates[0]];
      var otherLastDayHistory = config.history[playerId][historyDates[historyDates.length - 1]];
      var addPlayerHistory = false;
      if (
        otherFirstDayHistory &&
        otherFirstDayHistory.g < playerFirstDayHistory.g * threshold &&
        otherFirstDayHistory.g > playerFirstDayHistory.g / threshold
      ) {
        addPlayerHistory = true;
      }
      if (
        otherLastDayHistory &&
        otherLastDayHistory.g != 0 && // no players that deleted account
        otherLastDayHistory.g < playerLastDayHistory.g * threshold &&
        otherLastDayHistory.g > playerLastDayHistory.g / threshold
      ) {
        addPlayerHistory = true;
      }

      if (addPlayerHistory) {
        series[playerId] = {
          name: playerId,
          data: []
        };
        historyDates.forEach(function(date) {
          series[playerId].data.push({
            x: config.history[playerId][date].t,
            y: config.history[playerId][date].g
          });
        });
      }
    }

    // serie of current player
    var playerSerie = {
      name: config.playerId,
      data: []
    };
    historyDates.forEach(function(date) {
      playerSerie.data.push({
        x: config.history[config.playerId][date].t,
        y: config.history[config.playerId][date].g
      });
    });

    var seriesArray = Object.values(series);
    // filter out players that are stagnant
    seriesArray = seriesArray.filter(function(serie) {
      /*var progress = serie.data[0].y / serie.data[serie.data.length - 1].y;
      if (progress > 0.99 && progress < 1.01) return false;
      return true;*/
      return [
        'i',
        'I',
        'v',
        'b',
        'vi',
        'vI',
        'vib',
        'vIb',
        'vb',
        'ib',
        'Ib'
      ].indexOf(config.players[serie.name].status) == -1;
    });
    // add player serie as the last entry
    seriesArray.push(playerSerie);

    // draw chart
    $wrapper.append(
      '<div id="chart-all-players" style="width:100%;height:400px;user-select:none;"></div>'
    );
    $wrapper.append(
      '<div id="chart-all-players-text"></div>'
    );
    $wrapper.append(
      [
        '<style>',
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
          showArea: false,
          showLine: true,
          showPoint: false,
          borderWidth: 2,
          plugins: []
        }
      );
    });

    setTimeout(function() {
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

      var getTooltip = function(playerId, color) {
        color = color || '#fff';
        var player = config.players[playerId];
        var history = config.history[playerId];
        var historyDates = Object.keys(history).reverse();
        return [
          '<div style="text-align:center;background:#0a141d;border-radius:10px;padding:10px;">',
          '<div style="font-weight:bold;font-size:14px;padding-bottom:10px;color:' + color + '">' + player.name + '</div>',
          player.planets.length ? (
            [
              '<div style="padding-bottom:10px;">',
              player.planets.map(function(planet) {
                return '<a href="?page=ingame&component=galaxy&galaxy=' + planet.coords[0] + '&system=' + planet.coords[1] + '&position=' + planet.coords[2] + '">[' + planet.coords.join(':') + ']</a>';
              }).join(' '),
              '</div>'
            ].join('')
          ) : '',
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
          historyDates.map(function(date, i) {
            return [
              '<tr>',
              '<td style="padding:5px">' + date + '</td>',
              '<td style="padding:5px">' + window.uipp_scoreHumanReadable(history[date].g) + '</td>',
              '<td style="padding:5px">' + getProgress((history[historyDates[i + 1]] || {}).g, history[date].g) + '</td>',
              '<td style="padding:5px">' + window.uipp_scoreHumanReadable(history[date].e) + '</td>',
              '<td style="padding:5px">' + getProgress((history[historyDates[i + 1]] || {}).e, history[date].e) + '</td>',
              '<td style="padding:5px">' + window.uipp_scoreHumanReadable(history[date].r) + '</td>',
              '<td style="padding:5px">' + getProgress((history[historyDates[i + 1]] || {}).r, history[date].r) + '</td>',
              '<td style="padding:5px">' + window.uipp_scoreHumanReadable(history[date].m) + '</td>',
              '<td style="padding:5px">' + getProgress((history[historyDates[i + 1]] || {}).m, history[date].m) + '</td>',
              '<td style="padding:5px">' + window.uipp_scoreHumanReadable(history[date].s) + '</td>',
              '<td style="padding:5px">' + getProgress((history[historyDates[i + 1]] || {}).s, history[date].s) + '</td>',
              '</tr>',
            ].join('');
          }).join(''),
          '</tbody>',
          '</table>',
          '</div>'
        ].join('');
      };

      $detail.html(getTooltip(config.playerId));
      $('#chart-all-players .ct-line').each(function() {
        $(this).mouseenter(function() {
          var color = $(this).css('stroke');
          var playerId = $(this).parent().attr('ct:series-name');
          $detail.html(getTooltip(playerId, color));
        });
      });

      // growth color code (green/gray/red)
      seriesArray.forEach(function(serie, i) {
        if (i == seriesArray.length - 1) return;
        var firstPoint = serie.data[0].y;
        var lastPoint = serie.data[serie.data.length - 1].y;
        var growth = lastPoint / firstPoint;
        if (growth > 1) {
          //$('#chart-all-players .ct-series:nth-child(' + (i + 1) + ') .ct-line').css('stroke', '#9c0');
        }
        else if (growth < 1) {
          //$('#chart-all-players .ct-series:nth-child(' + (i + 1) + ') .ct-line').css('stroke', '#d43635');
        } else {
          
        }
        if (growth == 1) {
          $('#chart-all-players .ct-series:nth-child(' + (i + 1) + ') .ct-line')
            .css('stroke', '#888888')
            .css('stroke-width', '1px')
            .css('opacity', '0.5');
        } else {
          $('#chart-all-players .ct-series:nth-child(' + (i + 1) + ') .ct-line')
            .css('stroke-width', '2px');
        }
      });
    }, 100);

    $wrapper.append(
      ['<div style="padding: 2em; opacity: 0.5;text-align:justify">', window._translate('COMPETITION_EXPLAINATION'), '</div>'].join('')
    );

    window._insertHtml($wrapper);
  });
};
