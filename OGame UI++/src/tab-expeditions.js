var fn = function () {
  'use strict';
  window._addTabExpeditions = function _addTabExpeditions () {
  	if (!window.config.expeditionResults) {
  		return;
    }

    var displayedExpe = 100;

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

      var tbody = '';
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
          '<tr class="expe-row" id="expe-' + i + '" style="cursor:pointer; ' + (i > displayedExpe ? 'display:none' : '') + '" onclick="uipp_toggleExpeSelection(' + i + ')">',
          '<td data-value="' + expe.timestamp + '">', _date(expe.timestamp), '</td>',
          '<td>', expe.coords, '</td>',
          '<td style="text-align:left" data-value="' + expeWorth + '">', content, '</td>',
          '</tr>'
        ].join('');
      });

      window.uipp_showMoreExpe = function() {
        displayedExpe += 100;
        var i = 0;
        $('.expetable tr').each(function() {
          if (i++ > displayedExpe) {
            $(this).css('display', 'none');
          } else {
            $(this).css('display', 'table-row');
          }
        });
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

      window.uipp_emptyExpeSelection = function() {
        $('.expe-row.selected').removeClass('selected');
        selection = {};
        updateSelection();
      };

      var filters = {};
      window.uipp_expefilter = function(f) {
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
          } else if (e.data.metal || e.data.crystal || e.data.deuterium) {
            type = 'res';
          } else if (e.data.item || e.data.AM) {

          } else {
            type = 'ship';
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
          if (expe.data.AM) {
            sum.am += expe.data.AM;
          }
          if (expe.data.item) {
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

      $wrapper.append([
        '<div style="text-align:center; position: relative; user-select: none;">',
        '<img src="' + uipp_images.wings + '" style=""/>',
        '<span class="expefilter" id="expefilter-1d" onclick="uipp_expefilter(\'1d\');" style="cursor:pointer;position:absolute;padding:2px 5px;border-radius:3px;font-size:9px;left:50%;margin-left:-132px;top:57px;background:#333;color:white;">1' + window._translate('TIME_DAY') + '</span>',
        '<span class="expefilter" id="expefilter-7d" onclick="uipp_expefilter(\'7d\');" style="cursor:pointer;position:absolute;padding:2px 5px;border-radius:3px;font-size:9px;left:50%;margin-left:-132px;top:95px;background:#333;color:white;">7' + window._translate('TIME_DAY') + '</span>',
        '<span class="expefilter" id="expefilter-30d" onclick="uipp_expefilter(\'30d\');" style="cursor:pointer;position:absolute;padding:2px 5px;border-radius:3px;font-size:9px;left:50%;margin-left:-134px;top:133px;background:#333;color:white;">30' + window._translate('TIME_DAY') + '</span>',
        '<span class="expefilter" id="expefilter-res" onclick="uipp_expefilter(\'res\');" style="cursor:pointer;position:absolute;padding:2px 5px;border-radius:3px;font-size:9px;left:50%;margin-left:106px;top:57px;background:#333;color:white;">',
        '<img src="' + uipp_images.resources.mix + '" style="height:16px" />',
        '</span>',
        '<span class="expefilter" id="expefilter-ship" onclick="uipp_expefilter(\'ship\');" style="cursor:pointer;position:absolute;padding:2px 5px;border-radius:3px;font-size:9px;left:50%;margin-left:106px;top:95px;background:#333;color:white;">',
        '<img src="' + uipp_images.inflight + '" style="vertical-align:-2px" />',
        '</span>',
        '<span class="expefilter" id="expefilter-debris" onclick="uipp_expefilter(\'debris\');" style="cursor:pointer;position:absolute;padding:2px 5px;border-radius:3px;font-size:9px;left:50%;margin-left:106px;top:130px;background:#333;color:white;">',
        '<figure class="planetIcon tf"></figure>',
        '</span>',
        '<div style="position:absolute;bottom:0; width: 100%;">',
        ['am', 'metal', 'crystal', 'deuterium', 'item'].map(function(res) {
          return [
            '<div style="margin:10px; position: relative; display: inline-block;">',
            '<img src="' + uipp_images.resources[res + 'big'] + '" style="height:60px"/>',
            '<div id="expestat-' + res + '" style="position:absolute;top:50%;margin-top:-10px;font-size:9px;height:20px;line-height:20px;width:100%;background:rgba(0,0,0,.7);color:white;">?</div>',
            '</div>',
          ].join('');
        }).join(''),
        '</div>',
        '</div>'
      ].join(''));

      // Add list
      $wrapper.append($table);
      $wrapper.append([
        '<div style="text-align:center;padding:10px 0 30px">',
        '<span style="cursor:pointer;" onclick="uipp_showMoreExpe()">',
        '... +100 ...',
        '</span>',
        '</div>'
      ].join(''));

      setTimeout(function () {
        updateSelection();
      });

  		window._insertHtml($wrapper);
  	});
  };

  function _date(timestamp) {
    return new Date(Number(timestamp)).toISOString().split('T').join(' ').replace('.000Z', '');
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
