'use strict';
window._addTabExpeditions = function _addTabExpeditions() {
  if (!window.config.expeditionResults) {
    return;
  }

  var displayedExpe = 100;

  var $tab = $(
    '<li class="expeditions enhanced"><span class="menu_icon"><div class="menuImage overview"></div></span><a style="position:relative" class="menubutton" href="#" accesskey="" target="_self"><span class="textlabel enhancement">' +
      window.config.labels[15] +
      '<img src="' +
      window.uipp_images.expeditionMission +
      '" style="height: 27px; position: absolute; right: -29px; top: 0; filter: grayscale(1) brightness(0.3);"/></span></a></li>'
  );
  $('#menuTable').append($tab);
  $tab.click(function () {
    var $wrapper = window._onMenuClick('expeditions');
    if (!$wrapper) return;

    var $headerwrapper = $(
      '<div class="uipp-box" style="height:260px;padding:0;background:url(' +
        uipp_images.wings +
        ');background-size:cover;text-align:center;"></div>'
    );
    $headerwrapper.append(
      [
        '<h3 style="margin:0">' + window.config.labels[15] + '</h3>',
        '<span class="expefilter" id="expefilter-1d" onclick="uipp_expefilter(\'1d\');" style="cursor: pointer; position: absolute; padding: 5px 10px; border-radius: 3px; font-size: 11px; left: 50%; margin-left: -150px; top: 63px; background: #333; color: white;">1' +
          window._translate('TIME_DAY') +
          '</span>',
        '<span class="expefilter" id="expefilter-7d" onclick="uipp_expefilter(\'7d\');" style="cursor:pointer;position:absolute;padding:5px 10px;border-radius:3px;font-size:11px;left:50%;margin-left:-150px;top:106px;background:#333;color:white;">7' +
          window._translate('TIME_DAY') +
          '</span>',
        '<span class="expefilter" id="expefilter-30d" onclick="uipp_expefilter(\'30d\');" style="cursor:pointer;position:absolute;padding:5px 10px;border-radius:3px;font-size:11px;left:50%;margin-left:-157px;top:149px;background:#333;color:white;">30' +
          window._translate('TIME_DAY') +
          '</span>',
        '<span class="expefilter" id="expefilter-res" onclick="uipp_expefilter(\'res\');" style="cursor:pointer;position:absolute;padding:2px 5px;border-radius:3px;font-size:9px;left:50%;margin-left:117px;top:64px;background:#333;color:white;">',
        '<img src="' + uipp_images.resources.mix + '" style="height:16px" />',
        '</span>',
        '<span class="expefilter" id="expefilter-ship" onclick="uipp_expefilter(\'ship\');" style="cursor:pointer;position:absolute;padding:2px 5px;border-radius:3px;font-size:9px;left:50%;margin-left:117px;top:108px;background:#333;color:white;">',
        '<img src="' + uipp_images.inflight + '" style="vertical-align:-2px" />',
        '</span>',
        '<span class="expefilter" id="expefilter-debris" onclick="uipp_expefilter(\'debris\');" style="cursor:pointer;position:absolute;padding:2px 5px;border-radius:3px;font-size:9px;left:50%;margin-left:117px;top:151px;background:#333;color:white;">',
        '<figure class="planetIcon tf"></figure>',
        '</span>',
        '<div style="position:absolute;bottom:0; width: 100%;">',
        ['am', 'metal', 'crystal', 'deuterium', 'item']
          .map(function (res) {
            return [
              '<div style="margin:10px; position: relative; display: inline-block;">',
              '<img src="' + uipp_images.resources[res + 'big'] + '" style="height:60px"/>',
              '<div id="expestat-' +
                res +
                '" style="position:absolute;top:50%;margin-top:-10px;font-size:9px;height:20px;line-height:20px;width:100%;background:rgba(0,0,0,.7);color:white;">?</div>',
              '</div>'
            ].join('');
          })
          .join(''),
        '</div>'
      ].join('')
    );
    $wrapper.append($headerwrapper);

    var $tablewrapper = $('<div class="uipp-box"></div>');
    $wrapper.append($tablewrapper);

    var pastExpe = [];
    for (var key in window.config.expeditionResults) {
      pastExpe.push({
        index: pastExpe.length,
        coords: key.split('|')[1],
        timestamp: key.split('|')[0],
        data: window.config.expeditionResults[key]
      });
    }
    pastExpe = pastExpe
      .filter(function (e) {
        return Object.keys(e.data).length > 0;
      })
      .sort(function (a, b) {
        return a.timestamp < b.timestamp ? 1 : -1;
      });

    var tbody = '';
    var $table = $(
      [
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
      ].join('')
    );

    pastExpe.forEach(function (expe, i) {
      var content = '';

      // old format to new format
      if (expe.data.AM) {
        expe.data.flags = { x: 1 };
        expe.data.result = { AM: expe.data.AM };
      }
      if (expe.data.item) {
        expe.data.flags = { i: 1 };
        expe.data.result = { item: expe.data.item };
      }
      ['metal', 'crystal', 'deuterium'].forEach(function (resource) {
        if (expe.data[resource]) {
          expe.data.flags = { r: 1 };
          expe.data.result = {};
          expe.data.result[resource] = expe.data[resource];
        }
      });
      for (var key in expe.data) {
        if (uipp_images.ships[key]) {
          expe.data.flags = { f: 1 };
          expe.data.result = {};
          expe.data.result[key] = expe.data[key];
        }
      }

      expe.resources = { metal: 0, crystal: 0, deuterium: 0 };
      // Display for each case
      // Debris field
      if (expe.data.debris) {
        ['metal', 'crystal'].forEach(function (res) {
          content += '<div style="display:inline-block; width: 120px; overflow: visible; white-space: nowrap;">';
          content +=
            '<img src="' +
            uipp_images.resources[res] +
            '" style="height:28px; margin-right: 8px; vertical-align: -9px" /> ';
          content +=
            '<span style="color:' +
            (expe.data.debris[res] ? 'white' : '#555') +
            '">' +
            window._num(expe.data.debris[res] || 0) +
            '</span>';
          content += '</div>';
          expe.resources[res] += expe.data.debris[res] || 0;
        });
        content +=
          '<figure class="planetIcon tf tooltip js_hideTipOnMobile tpd-hideOnClickOutside" style="float: right; margin-top: 6px; margin-right: 5px;"></figure>';
      }
      // Nothing
      else if (expe.data.flags && expe.data.flags.n) {
        content += '<span style="opacity:0.5">' + window._translate('EXPEDITION_FIND_NOTHING') + '</span>';
      }
      // Black Hole
      else if (expe.data.flags && expe.data.flags.l) {
        content +=
          '<img src="' +
          uipp_images.expedition.blackhole +
          '" style="height:28px; margin-right: 8px; vertical-align: -9px" />';
        content += '<span style="color:#F44336">' + window._translate('EXPEDITION_LOSE_FLEET') + '</span>';
      }
      // Pirates
      else if (expe.data.flags && expe.data.flags.p) {
        content +=
          '<img src="' +
          uipp_images.expedition.pirates +
          '" style="height:28px; margin-right: 8px; vertical-align: -9px" />';
        content += '<span style="color:#FFEB3B">' + window._translate('EXPEDITION_FIND_PIRATES') + '</span>';
      }
      // Aliens
      else if (expe.data.flags && expe.data.flags.a) {
        content +=
          '<img src="' +
          uipp_images.expedition.aliens +
          '" style="height:28px; margin-right: 8px; vertical-align: -9px" />';
        content += '<span style="color:#FBC02D">' + window._translate('EXPEDITION_FIND_ALIENS') + '</span>';
      }
      // Merchant
      else if (expe.data.flags && expe.data.flags.t) {
        content +=
          '<img src="' +
          uipp_images.expedition.merchant +
          '" style="height:28px; margin-right: 8px; vertical-align: -9px" />';
        content += '<span style="color:#00BCD4">' + window._translate('EXPEDITION_FIND_MERCHANT') + '</span>';
      }
      // Item
      else if (expe.data.flags && expe.data.flags.i) {
        content +=
          '<img src="' + uipp_images.item + '" style="height:28px; margin-right: 8px; vertical-align: -9px" />';
        content += expe.data.result.item;
      }
      // Early
      else if (expe.data.flags && expe.data.flags.e) {
        content += '<span style="opacity:0.5">' + window._translate('EXPEDITION_RETURN_EARLY') + '</span>';
      }
      // Late
      else if (expe.data.flags && expe.data.flags.d) {
        content += '<span style="opacity:0.5">' + window._translate('EXPEDITION_RETURN_LATE') + '</span>';
      }
      // Fleet
      else if (expe.data.flags && expe.data.flags.f) {
        var fleetResources = _getFleetResources(expe.data.result);
        ['metal', 'crystal', 'deuterium'].forEach(function (res) {
          content += '<div style="display:inline-block; width: 120px; overflow: visible; white-space: nowrap;">';
          content +=
            '<img src="' +
            uipp_images.resources[res] +
            '" style="height:28px; margin-right: 8px; vertical-align: -9px" /> ';
          content +=
            '<span style="color:' +
            (fleetResources[res] ? 'white' : '#555') +
            '">' +
            window._num(fleetResources[res] || 0) +
            '</span>';
          content += '</div>';
          expe.resources[res] += fleetResources[res] || 0;
        });
        var tooltip = '<div id="tooltip-expe-' + expe.index + '" style="display:none">';
        var nShips = 0;
        for (var key in expe.data.result) {
          if (uipp_images.ships[key]) {
            tooltip += '<div style="white-space: nowrap; min-width: 120px; line-height: 40px; font-size: 13px;">';
            tooltip +=
              '<img src="' + uipp_images.ships[key] + '" style="height: 40px; margin-right: 8px; float: left" />';
            tooltip += expe.data.result[key];
            nShips += expe.data.result[key];
            tooltip += '</div>';
          }
        }
        tooltip += '</div>';
        content +=
          '<div style="display:inline-block; float:right; margin-top: 6px;" class="tooltipRel tooltipClose tooltipRight js_hideTipOnMobile" rel="tooltip-expe-' +
          expe.index +
          '">';
        content += nShips;
        content +=
          '<img src="' +
          uipp_images.inflight +
          '" style="transform:rotate(180deg); margin-left: 8px; vertical-align: -4px"/>';
        content += '</div>';
        content += tooltip;
      }
      // Resources
      else if (expe.data.flags && expe.data.flags.r) {
        ['metal', 'crystal', 'deuterium'].forEach(function (res) {
          content += '<div style="display:inline-block; width: 120px; overflow: visible; white-space: nowrap;">';
          content +=
            '<img src="' +
            uipp_images.resources[res] +
            '" style="height:28px; margin-right: 8px; vertical-align: -9px" /> ';
          content +=
            '<span style="color:' +
            (expe.data.result[res] ? 'white' : '#555') +
            '">' +
            window._num(expe.data.result[res] || 0) +
            '</span>';
          content += '</div>';
          expe.resources[res] += expe.data.result[res] || 0;
        });
      }
      // Dark Matter
      else if (expe.data.flags && expe.data.flags.x) {
        content +=
          '<img src="' + uipp_images.resources.am + '" style="height:28px; margin-right: 8px; vertical-align: -9px" />';
        content += window._num(expe.data.result.AM);
      }
      // Else... display text
      else if (expe.data.text) {
        content += '<p>' + expe.data.text + '</p>';
      }
      // Should never happen
      else {
        content += 'Unknown expedition result (could not parse message)';
        console.log('Unknown expedition result', expe);
      }

      var worth = uipp_getResourcesWorth();
      var expeWorth =
        worth.metal * expe.resources.metal +
        worth.crystal * expe.resources.crystal +
        worth.deuterium * expe.resources.deuterium;

      // add a separator if >10min between 2 actions
      var separator = false;
      if (pastExpe[i - 1] && pastExpe[i - 1].timestamp - 36e5 / 6 > expe.timestamp) separator = true;

      tbody += [
        '<tr class="expe-row' +
          (separator ? ' separator' : '') +
          '" id="expe-' +
          i +
          '" style="cursor:pointer; ' +
          (i > displayedExpe ? 'display:none;' : '') +
          '" onclick="uipp_toggleExpeSelection(' +
          i +
          ')">',
        '<td data-value="' + expe.timestamp + '">',
        _date(expe.timestamp),
        '</td>',
        '<td>',
        '<span class="tooltip uipp-expe-overuse overuse-' +
          (expe.data.flags ? expe.data.flags.o || 'x' : 'x') +
          '" title="' +
          window._translate('EXPEDITION_OVERUSE_' + (expe.data.flags ? expe.data.flags.o || 'x' : 'x').toUpperCase()) +
          '">&nbsp;</span>',
        expe.coords,
        '<br>',
        '<span class="tooltip uipp-expe-size size-' +
          (expe.data.flags ? expe.data.flags.s || 'x' : 'x') +
          '" title="' +
          window._translate('EXPEDITION_SIZE_' + (expe.data.flags ? expe.data.flags.s || 'x' : 'x').toUpperCase()) +
          '">' +
          (expe.data.flags ? (expe.data.flags.s || '').toUpperCase() : '') +
          '</span>',
        '</td>',
        '<td style="text-align:left" data-value="' + expeWorth + '">',
        content,
        '</td>',
        '</tr>'
      ].join('');
    });

    window.uipp_showMoreExpe = function () {
      displayedExpe += 100;
      var i = 0;
      $('.expetable tr').each(function () {
        if (i++ > displayedExpe) {
          $(this).css('display', 'none');
        } else {
          $(this).css('display', 'table-row');
        }
      });
      if (displayedExpe >= pastExpe.length) {
        $('#show-more-expe').css('display', 'none');
      }
    };

    var selection = {};
    window.uipp_setExpeSelection = function (i, selected) {
      if (selected) {
        $('#expe-' + i).addClass('selected');
        selection[i] = pastExpe[i];
      } else {
        $('#expe-' + i).removeClass('selected');
        delete selection[i];
      }
    };

    window.uipp_toggleExpeSelection = function (i) {
      if (selection[i]) {
        uipp_setExpeSelection(i, false);
      } else {
        uipp_setExpeSelection(i, true);
      }
      updateSelection();
    };

    window.uipp_emptyExpeSelection = function () {
      $('.expe-row.selected').removeClass('selected');
      selection = {};
      updateSelection();
    };

    var filters = {};
    window.uipp_expefilter = function (f) {
      window.uipp_emptyExpeSelection();

      if (filters[f]) {
        delete filters[f];
        $('#expefilter-' + f).css('background', '#333');
      } else {
        if (['1d', '7d', '30d'].indexOf(f) !== -1) {
          delete filters['1d'];
          $('#expefilter-1d').css('background', '#333');
          delete filters['7d'];
          $('#expefilter-7d').css('background', '#333');
          delete filters['30d'];
          $('#expefilter-30d').css('background', '#333');
        }

        filters[f] = true;
        $('#expefilter-' + f).css('background', '#AB7AFF');
      }

      if (Object.keys(filters).length === 0) {
        uipp_emptyExpeSelection();
        return;
      }

      var dateMin = 0;
      if (filters['1d']) dateMin = Date.now() - 1 * 24 * 36e5;
      if (filters['7d']) dateMin = Date.now() - 7 * 24 * 36e5;
      if (filters['30d']) dateMin = Date.now() - 30 * 24 * 36e5;

      var categoryFilter = filters['debris'] || filters['res'] || filters['ship'];
      pastExpe.forEach(function (e, i) {
        var type = null;
        if (e.data.debris) {
          type = 'debris';
        } else if (e.data.flags.r) {
          type = 'res';
        } else if (e.data.flags.f) {
          type = 'ship';
        } else {
        }

        var keep = false;
        if (filters['debris'] && type === 'debris') {
          keep = true;
        }
        if (filters['res'] && type === 'res') {
          keep = true;
        }
        if (filters['ship'] && type === 'ship') {
          keep = true;
        }

        if (dateMin) {
          if (Number(e.timestamp) < dateMin) {
            keep = false;
          }
        }

        if (categoryFilter) {
          if (dateMin) {
            keep = keep && Number(e.timestamp) >= dateMin;
          }

          if (keep) {
            uipp_setExpeSelection(i, true);
          } else {
            uipp_setExpeSelection(i, false);
          }
        } else if (Number(e.timestamp) >= dateMin) {
          uipp_setExpeSelection(i, true);
        }
      });

      updateSelection();
    };

    function updateSelection() {
      var expeditions = Object.values(selection);
      if (Object.keys(selection).length === 0) {
        expeditions = pastExpe;
      }
      var sum = { metal: 0, crystal: 0, deuterium: 0, am: 0, item: 0 };
      expeditions.forEach(function (expe) {
        ['metal', 'crystal', 'deuterium'].forEach(function (res) {
          sum[res] += expe.resources[res];
        });
        if (expe.data.AM || (expe.data.result && expe.data.result.AM)) {
          sum.am += expe.data.AM || (expe.data.result ? expe.data.result.AM : 0);
        }
        if (expe.data.item || (expe.data.result && expe.data.result.item)) {
          sum.item++;
        }
      });

      for (var key in sum) {
        $('#expestat-' + key).text(_num(sum[key]));
      }
    }

    var style = document.createElement('style');
    style.textContent = 'table.expetable { user-select: none }';
    style.textContent = 'table.expetable td { border-top: 1px solid #333 }';
    style.textContent += 'table.expetable tr.selected td { background: #1f172d }';
    style.textContent += 'table.expetable tr.pending td { background: #222; color: #999; }';
    (document.head || document.documentElement).appendChild(style);

    $table.find('tbody').append(tbody);

    // Add list
    $tablewrapper.append($table);

    if (pastExpe.length >= displayedExpe) {
      $tablewrapper.append(
        [
          '<div id="show-more-expe" style="text-align:center;padding:10px 0 30px">',
          '<span style="cursor:pointer;" onclick="uipp_showMoreExpe()">',
          '--- + ---',
          '</span>',
          '</div>'
        ].join('')
      );
    }

    setTimeout(function () {
      updateSelection();
    });

    window._insertHtml($wrapper);
  });
};

function _date(timestamp) {
  // use gameforge-injected function
  return getFormatedDate(timestamp, '[Y]-[m]-[d] [H]:[i]:[s]');
  //return new Date(Number(timestamp)).toISOString().split('T').join(' ').replace('.000Z', '');
}

function _getFleetResources(data) {
  var resources = { metal: 0, crystal: 0, deuterium: 0 };
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
