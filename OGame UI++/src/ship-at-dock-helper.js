'use strict';
window.uipp_getShipResources = function (ships) {
  var shipResources = {
    204: [3000, 1000, 0], // lf
    205: [6000, 4000, 0], // hf
    206: [20000, 7000, 2000], // c
    207: [45000, 15000, 0], // bs
    215: [30000, 40000, 15000], // bc
    211: [50000, 25000, 15000], // bo
    213: [60000, 50000, 15000], // des
    214: [5000000, 4000000, 1000000], // ds
    218: [85000, 55000, 20000], // reaper
    219: [8000, 15000, 8000], // pf

    202: [2000, 2000, 0], // small cargo
    203: [6000, 6000, 0], // large cargo
    208: [10000, 20000, 10000], // colony ship
    209: [10000, 6000, 2000], // recycler
    210: [0, 1000, 0] // spy sat
  };

  var currentShipResources = [0, 0, 0];

  for (var key in ships) {
    if (ships[key] === 0) {
      delete ships[key];
    } else {
      currentShipResources[0] += ships[key] * shipResources[key][0];
      currentShipResources[1] += ships[key] * shipResources[key][1];
      currentShipResources[2] += ships[key] * shipResources[key][2];
    }
  }

  return currentShipResources;
};

window.uipp_getShipPoints = function (ships) {
  var shipPoints = {
    204: 4,
    205: 10,
    206: 29,
    207: 60,
    215: 70,
    211: 90,
    213: 125,
    214: 10000,
    218: 160,
    219: 31,

    202: 4,
    203: 12,
    208: 40,
    209: 18,
    210: 1
  };

  var currentPoints = 0;

  for (var key in ships) {
    if (ships[key] === 0) {
      delete ships[key];
    } else {
      currentPoints += ships[key] * shipPoints[key];
    }
  }

  return currentPoints;
};

window._addShipAtDockHelper = function _addShipAtDockHelper() {
  for (var key in config.my.planets) {
    if (!config.my.planets[key].shipsLastUpdate) {
      config.my.planets[key].shipsNeedUpdate = 1;
      _saveConfig();
    }
  }

  _parseCurrentPlanetShips();
  _addPlanetListHelpers();
  _handleMissionsInProg();
};

function _parseCurrentPlanetShips() {
  if (document.location.href.indexOf('fleetdispatch') === -1 && document.location.href.indexOf('shipyard') === -1) {
    return;
  }

  var shipsAtDock = {
    204: Number($('.fighterLight .amount').attr('data-value')) || 0,
    205: Number($('.fighterHeavy .amount').attr('data-value')) || 0,
    206: Number($('.cruiser .amount').attr('data-value')) || 0,
    207: Number($('.battleship .amount').attr('data-value')) || 0,
    215: Number($('.interceptor .amount').attr('data-value')) || 0,
    211: Number($('.bomber .amount').attr('data-value')) || 0,
    213: Number($('.destroyer .amount').attr('data-value')) || 0,
    214: Number($('.deathstar .amount').attr('data-value')) || 0,
    218: Number($('.reaper .amount').attr('data-value')) || 0,
    219: Number($('.explorer .amount').attr('data-value')) || 0,

    202: Number($('.transporterSmall .amount').attr('data-value')) || 0,
    203: Number($('.transporterLarge .amount').attr('data-value')) || 0,
    208: Number($('.colonyShip .amount').attr('data-value')) || 0,
    209: Number($('.recycler .amount').attr('data-value')) || 0,
    210: Number($('.espionageProbe .amount').attr('data-value')) || 0
  };

  var currentPlanetCoordinatesStr = '[' + window._getCurrentPlanetCoordinates().join(':') + ']';
  if ($('meta[name=ogame-planet-type]').attr('content') === 'moon') {
    currentPlanetCoordinatesStr += 'L';
  }

  if (window.config.my.planets[currentPlanetCoordinatesStr]) {
    window.config.my.planets[currentPlanetCoordinatesStr].shipPoints = uipp_getShipPoints(shipsAtDock);
    window.config.my.planets[currentPlanetCoordinatesStr].shipResources = uipp_getShipResources(shipsAtDock);
    window.config.my.planets[currentPlanetCoordinatesStr].ships = shipsAtDock;
    window.config.my.planets[currentPlanetCoordinatesStr].shipsLastUpdate = Date.now();
    window.config.my.planets[currentPlanetCoordinatesStr].shipsNeedUpdate = Date.now() + 7 * 24 * 36e5;
    window._saveConfig();
  }
}

function _addPlanetListHelpers() {
  var threshold = window.config.shipsAtDockThreshold;
  if (threshold <= 1) {
    threshold *= Number(
      ((window.config.players || {})[$('[name=ogame-player-id]').attr('content')] || {}).militaryScore || '0'
    );
  }

  $('.shipsatdockhelper').remove();
  $('#planetList > div').each(function () {
    var planet = window.config.my.planets[$(this).find('.planet-koords').text()] || {};
    var shipPoints = planet.shipPoints || 0;
    var cp = $(this).find('.planetlink').attr('href').split('cp=')[1];
    var shipsNeedUpdate = planet.shipsNeedUpdate <= Date.now();

    if (shipPoints > threshold || shipsNeedUpdate) {
      var img = uipp_images.atk;
      var tooltip = window._translate('SHIP_AT_DOCK') + ' : ' + _num(shipPoints * 1000) + '|';
      tooltip +=
        window._translate('LAST_UPDATE') + ' : ' + _time((Date.now() - planet.shipsLastUpdate) / 1000) + '<br><br>';
      tooltip += '<table class=&quot;marketitem_price_tooltip&quot;>';
      for (var key in planet.ships) {
        tooltip += [
          '<tr>',
          '<th>' + window.config.labels[key] + '</th>',
          '<td>' + planet.ships[key] + '</td>',
          '</tr>'
        ].join('');
      }
      tooltip += '</table>';

      if (shipsNeedUpdate) {
        tooltip = window._translate('SHIP_AT_DOCK') + ' : ???|';
        tooltip +=
          window._translate('LAST_UPDATE') + ' : ' + _time((Date.now() - planet.shipsLastUpdate) / 1000) + '<br><br>';
        tooltip += window._translate('SHIP_AT_DOCK_THRESHOLD_NEED_UPDATE');
        img = uipp_images.atkunk;
      }

      $(this).append(
        [
          '<a class="shipsatdockhelper" href="?page=ingame&component=fleetdispatch&cp=' + cp + '">',
          '<img src="' +
            img +
            '" class="tooltipHTML" title="' +
            tooltip +
            '" style="position: absolute; top: 3px; left: 22px; height: 18px; width: 18px;"/>',
          '</a>'
        ].join('')
      );
    }

    if ($(this).find('.moonlink').length) {
      var myPlanet = window.config.my.planets[$(this).find('.planet-koords').text() + 'L'];
      var shipPointsMoon = myPlanet.shipPoints || 0;
      var cpMoon = $(this).find('.moonlink').attr('href').split('cp=')[1];
      var shipsNeedUpdateMoon = myPlanet.shipsNeedUpdate <= Date.now();

      if (shipPointsMoon > threshold || shipsNeedUpdateMoon) {
        var tooltip = window._translate('SHIP_AT_DOCK') + ' : ' + _num(shipPointsMoon * 1000) + '|';
        var img = uipp_images.atk;
        if (myPlanet.shipResources) {
          tooltip += "<figure class='tf planetIcon'></figure> ";
          tooltip += window.uipp_scoreHumanReadable(config.universe.debrisFactor * myPlanet.shipResources[0]);
          tooltip += ' / ';
          tooltip += window.uipp_scoreHumanReadable(config.universe.debrisFactor * myPlanet.shipResources[1]);
          tooltip += ' / 0<br><br>';
        }
        tooltip +=
          window._translate('LAST_UPDATE') +
          ' : ' +
          _time(
            (Date.now() - window.config.my.planets[$(this).find('.planet-koords').text() + 'L'].shipsLastUpdate) / 1000
          ) +
          '<br><br>';
        tooltip += '<table class=&quot;marketitem_price_tooltip&quot;>';
        for (var key in window.config.my.planets[$(this).find('.planet-koords').text() + 'L'].ships) {
          tooltip += [
            '<tr>',
            '<th>' + window.config.labels[key] + '</th>',
            '<td>' + window.config.my.planets[$(this).find('.planet-koords').text() + 'L'].ships[key] + '</td>',
            '</tr>'
          ].join('');
        }
        tooltip += '</table>';

        if (shipsNeedUpdateMoon) {
          tooltip = window._translate('SHIP_AT_DOCK') + ' : ???|';
          tooltip +=
            window._translate('LAST_UPDATE') +
            ' : ' +
            _time(
              (Date.now() - window.config.my.planets[$(this).find('.planet-koords').text() + 'L'].shipsLastUpdate) /
                1000
            ) +
            '<br><br>';
          tooltip += window._translate('SHIP_AT_DOCK_THRESHOLD_NEED_UPDATE');
          img = uipp_images.atkunk;
        }

        $(this).append(
          [
            '<a class="shipsatdockhelper" href="?page=ingame&component=fleetdispatch&cp=' + cpMoon + '">',
            '<img src="' +
              img +
              '" class="tooltipHTML" title="' +
              tooltip +
              '" style="position: absolute; bottom: 5px; left: 19px; height: 15px; width: 15px;"/>',
            '</a>'
          ].join('')
        );
      }
    }
  });
}

function _handleMissionsInProg() {
  var missions = [];
  $('#eventContent .tooltip.tooltipClose').each(function () {
    var $tooltip = $($(this).attr('title'));
    var $tr = $(this).parent().parent();

    var trCount = $tooltip.find('tr').length;
    var entry = {
      id: Number($tr.attr('id').replace('eventRow-', '')),
      type: Number($tr.attr('data-mission-type')),
      from: $tr.find('.coordsOrigin a').text().trim(),
      fromMoon: $tr.find('.originFleet .moon').length > 0,
      to: $tr.find('.destCoords a').text().trim(),
      toMoon: $tr.find('.destFleet .moon').length > 0,
      returnMission: $tr.attr('data-return-flight') === 'true',
      t: Number($tr.attr('data-arrival-time')) * 1000
    };

    if (entry.returnMission) {
      var to = entry.to;
      entry.to = entry.from;
      entry.from = to;
      var toMoon = entry.toMoon;
      entry.toMoon = entry.fromMoon;
      entry.fromMoon = toMoon;
    }

    missions.push(entry);
  });

  missions.forEach(function (m) {
    if (m.returnMission || m.type === 4) {
      var toCoords = m.to + (m.toMoon ? 'L' : '');
      if (m.type === 4 && m.returnMission) {
        toCoords = m.from + (m.fromMoon ? 'L' : '');
      }

      // don't put the need for update at a later date
      if (config.my.planets[toCoords] && m.t > config.my.planets[toCoords].shipsNeedUpdate) return;

      // update values
      if (config.my.planets[toCoords] && config.my.planets[toCoords].shipsNeedUpdate != m.t) {
        config.my.planets[toCoords].shipsNeedUpdate = m.t;
        setTimeout(_addPlanetListHelpers, m.t - Date.now() + 1000);
        _saveConfig();
      }
    }
  });
}
