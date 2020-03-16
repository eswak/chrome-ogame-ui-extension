var fn = function () {
  'use strict';
  window._addTabExpeditions = function _addTabExpeditions () {
  	if (!window.config.expeditionResults) {
  		return;
    }

    var $tab = $('<li class="expeditions enhanced"><span class="menu_icon"><div class="menuImage overview"></div></span><a style="position:relative" class="menubutton" href="#" accesskey="" target="_self"><span class="textlabel enhancement">' + window.config.labels[15] + '<img src="' + window.uipp_images.expedition + '" style="height: 27px; position: absolute; right: -29px; top: 0; filter: grayscale(1) brightness(0.3);"/></span></a></li>');
    $('#menuTable').append($tab);
    $tab.click(function () {
  		var $wrapper = window._onMenuClick('expeditions');
  		if (!$wrapper) return;

  		window.uipp_analytics('uipp-tab-click', 'expeditions-tab');

  		var pastExpe = [];
  		for (var key in window.config.expeditionResults) {
  			pastExpe.push({
          index: pastExpe.length,
  				coords: key.split('|')[1],
  				timestamp: key.split('|')[0],
  				data: window.config.expeditionResults[key],
          resources: _getExpeditionResources(window.config.expeditionResults[key])
  			});
  		}
      pastExpe = pastExpe.filter(function (e) {
        return Object.keys(e.data).length > 0;
      }).sort(function (a, b) {
        return a.timestamp < b.timestamp ? 1 : -1;
      });

      var $table = $([
        '<table class="uipp-table expetable" style="user-select:none">',
        '<thead>',
        '<tr>',
        '<th style="width:70px">' + '<img src="' + uipp_images.datetime + '" style="height:32px" />' + '</th>',
        '<th style="width:1px">' + window._translate('COORDINATES') + '</th>',
        '<th style="text-align:left">' + '<img src="' + uipp_images.yield + '" style="height:32px" />' + '</th>',
        '</tr>',
        '</thead>',
        '<tbody></tbody>',
        '</table>'
      ].join(''));
      var tbody = '';
      _getExpeditionsPending().forEach(function (pendingExpe) {
        tbody += [
          '<tr class="pending">',
          '<td data-value="' + pendingExpe.timestamp + '">', _date(pendingExpe.timestamp), '</td>',
          '<td>', pendingExpe.from, '</td>',
          '<td data-value="0" style="text-align:left" data-value="0">', '<img src="' + uipp_images.inflight + '" style="vertical-align: -4px; margin-right: 10px;"/>', pendingExpe.nShips, '</td>',
          '</tr>'
        ].join('');
      });

      var sum = [
        '<tr id="expe-sum" style="cursor:pointer" onclick="uipp_emptyExpeSelection()">',
        '<td data-value="' + Date.now() + '">-</td>',
        '<td>∑</td>',
        '<td style="text-align:left" data-value="0">',
        ['metal', 'crystal', 'deuterium'].map(function(res) {
          return [
            '<div style="display:inline-block; width: 120px; overflow: visible; white-space: nowrap;">',
            '<img src="' + uipp_images.resources[res] + '" style="height:28px; margin-right: 8px; vertical-align: -9px" /> ',
            '<span id="res-sum-' + res + '">0</span>',
            '</div>'
          ].join('');
        }).join(''),
        '</td>',
        '</tr>'
      ].join('');
      tbody += sum;

      pastExpe.forEach(function(expe, i) {
        var value = 0;
        var content = '';
        if (Object.keys(expe.data).length === 0) {
          content += '-';
        } else if (expe.data['AM']) {
          content += '<img src="' + uipp_images.resources.am + '" style="height:28px; margin-right: 8px; vertical-align: -9px" />';
          content += window._num(expe.data.AM);
        } else if (expe.data['item']) {
          content += '<img src="' + uipp_images.item + '" style="height:28px; margin-right: 8px; vertical-align: -9px" />';
          content += expe.data['item'];
        } else {
          ['metal', 'crystal', 'deuterium'].forEach(function(res) {
            content += '<div style="display:inline-block; width: 120px; overflow: visible; white-space: nowrap;">';
            content += '<img src="' + uipp_images.resources[res] + '" style="height:28px; margin-right: 8px; vertical-align: -9px" /> ';
            content += '<span style="color:' + (expe.resources[res] ? 'white' : '#555') + '">' + window._num(expe.resources[res]) + '</span>';
            content += '</div>';
          });

          // ships
          if (!expe.data.metal && !expe.data.crystal && !expe.data.deuterium) {
            var tooltip = '<div id="tooltip-expe-' + expe.index + '" style="display:none">';
            var nShips = 0;
            for (var key in expe.data) {
              if (uipp_images.ships[key]) {
                tooltip += '<div style="white-space: nowrap; min-width: 120px; line-height: 40px; font-size: 13px;">';
                tooltip += '<img src="' + uipp_images.ships[key] + '" style="height: 40px; margin-right: 8px; float: left" />';
                tooltip += expe.data[key];
                nShips += expe.data[key];
                tooltip += '</div>';
              }
            }
            tooltip += '</div>';
            content += '<div style="display:inline-block; float:right; margin-top: 6px;" class="tooltipRel tooltipClose tooltipRight js_hideTipOnMobile" rel="tooltip-expe-' + expe.index + '">';
            content += nShips;
            content += '<img src="' + uipp_images.inflight + '" style="transform:rotate(180deg); margin-left: 8px; vertical-align: -4px"/>';
            content += '</div>';
            content += tooltip;
          }

          if (expe.data.debris) {
            content += '<figure class="planetIcon tf tooltip js_hideTipOnMobile tpd-hideOnClickOutside" style="float: right; margin-top: 6px; margin-right: 5px;"></figure>';
          }
        }

        var worth = uipp_getResourcesWorth();
        var expeWorth = worth.metal * expe.resources.metal + worth.crystal * expe.resources.crystal + worth.deuterium * expe.resources.deuterium;

        tbody += [
          '<tr class="expe-row" id="expe-' + i + '" style="cursor:pointer" onclick="uipp_toggleExpeSelection(' + i + ')">',
          '<td data-value="' + expe.timestamp + '">', _date(expe.timestamp), '</td>',
          '<td>', expe.coords, '</td>',
          '<td style="text-align:left" data-value="' + expeWorth + '">', content, '</td>',
          '</tr>'
        ].join('');
      });

      var selection = {};
      window.uipp_toggleExpeSelection = function (i) {
        if (selection[i]) {
          $('#expe-' + i).removeClass('selected');
          delete selection[i];
          updateSelection();
        } else {
          $('#expe-' + i).addClass('selected');
          selection[i] = pastExpe[i];
          updateSelection();
        }
      };

      window.uipp_emptyExpeSelection = function() {
        $('.expe-row.selected').removeClass('selected');
        selection = {};
        updateSelection();
      }

      function updateSelection() {
        var expeditions = Object.values(selection);
        if (Object.keys(selection).length === 0) {
          expeditions = pastExpe;
        }
        var sum = { metal: 0, crystal: 0, deuterium: 0 };
        expeditions.forEach(function (expe) {
          ['metal', 'crystal', 'deuterium'].forEach(function (res) {
            sum[res] += expe.resources[res];
          });
        });
        $('#res-sum-metal').text(_num(sum.metal));
        $('#res-sum-crystal').text(_num(sum.crystal));
        $('#res-sum-deuterium').text(_num(sum.deuterium));
      }

      var style = document.createElement('style');
      style.textContent = 'table.expetable { user-select: none }';
      style.textContent = 'table.expetable td { border-top: 1px solid #333 }';
      style.textContent += 'table.expetable tr.selected td { background: #1f172d }';
      style.textContent += 'table.expetable tr.pending td { background: #222; color: #999; }';
      (document.head || document.documentElement).appendChild(style);

      $table.find('tbody').append(tbody);
      $wrapper.append($table);
      $wrapper.append('<br><br><br>');

      setTimeout(function () {
        updateSelection();

        $.tablesorter.addParser({
          id: 'attr-data-value',
          is: function () { return false; },
          type: 'numeric',
          format: function (s, table, cell) {
            return Number($(cell).attr('data-value') || '0');
          }
        });

        $.tablesorter.addParser({
          id: 'coordinate',
          is: function () { return false; },
          type: 'numeric',
          format: function (s, table, cell) {
            var coordinates = $(cell).text().replace('[', '').replace(']', '').split(':').map(Number);
            return coordinates[0] * 1e6 + coordinates[1] * 1e3 + coordinates[2];
          }
        });

        $('table.uipp-table').tablesorter({
          cancelSelection: true,
          sortList: [[0]],
          headers: {
            0: { sorter: 'attr-data-value' },
            1: { sorter: 'coordinate' },
            2: { sorter: 'attr-data-value' },
          }
        });
      });

  		window._insertHtml($wrapper);
  	});
  };

  function _date(timestamp) {
    return new Date(Number(timestamp)).toISOString().split('T').join(' ').replace('.000Z', '');
  }

  function _getExpeditionsPending() {
    var missions = [];
    $('#eventContent .tooltip.tooltipClose').each(function () {
      var $tooltip = $($(this).attr('title'));
      var $tr = $(this).parent().parent();

      var trCount = $tooltip.find('tr').length;
      var entry = {
        type: Number($tr.attr('data-mission-type')),
        timestamp: Number($tr.attr('data-arrival-time')) * 1000,
        from: $tr.find('.coordsOrigin a').text().trim(),
        to: $tr.find('.destCoords a').text().trim(),
        nShips: $tr.find('.detailsFleet').text().trim(),
        returnMission: $tr.attr('data-return-flight') === 'true'
      };

      if (entry.returnMission) {
        var to = entry.to;
        entry.to = entry.from;
        entry.from = to;
      }

      missions.push(entry);
    });

    return missions.filter(function (m) {
      return m.returnMission && m.type === 15;
    });
  }

  function _getExpeditionResources(data) {
    var resources = { metal: 0, crystal: 0, deuterium: 0 };
    if (data.metal) resources.metal += data.metal;
    if (data.crystal) resources.crystal += data.crystal;
    if (data.deuterium) resources.deuterium += data.deuterium;
    var shipValues = {
      202: { metal: 2000, crystal: 2000, deuterium: 0 },
      203: { metal: 6000, crystal: 6000, deuterium: 0 },
      204: { metal: 3000, crystal: 1000, deuterium: 0 },
      205: { metal: 6000, crystal: 4000, deuterium: 0 },
      206: { metal: 20000, crystal: 7000, deuterium: 2000 },
      207: { metal: 45000, crystal: 15000, deuterium: 0 },
      208: { metal: 10000, crystal: 20000, deuterium: 10000 },
      209: { metal: 10000, crystal: 6000, deuterium: 2000 },
      210: { metal: 0, crystal: 1000, deuterium: 0 },
      211: { metal: 50000, crystal: 25000, deuterium: 15000 },
      212: { metal: 0, crystal: 2000, deuterium: 500 },
      213: { metal: 60000, crystal: 50000, deuterium: 15000 },
      214: { metal: 5000000, crystal: 4000000, deuterium: 1000000 },
      215: { metal: 30000, crystal: 40000, deuterium: 15000 },
      217: { metal: 2000, crystal: 2000, deuterium: 1000 },
      218: { metal: 85000, crystal: 55000, deuterium: 20000 },
      219: { metal: 8000, crystal: 15000, deuterium: 8000 }
    };

    for (var key in data) {
      if (shipValues[key]) {
        resources.metal += shipValues[key].metal * data[key];
        resources.crystal += shipValues[key].crystal * data[key];
        resources.deuterium += shipValues[key].deuterium * data[key];
      }
    }

    return resources;
  }
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
