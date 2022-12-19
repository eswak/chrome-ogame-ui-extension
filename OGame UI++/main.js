document.addEventListener('UIPPImages', function (evt, a, b, c) {
  window.uipp_images = evt.detail;
});

document.addEventListener('UIPPStart', function (evt) {
  userscript();
});

// inject main script
var userscript = function () {
  'use strict';

  // window.config default values
  window.config = window._getConfig();
  window._setConfigTradeRate();
  window._setConfigMyPlanets();
  window._parseResearchTab();

  window.config.features = window.config.features || {};
  var defaultFeatures = {
    alliance: true,
    charts: true,
    deploytransport: true,
    expeditionpoints: true,
    expeditiontab: true,
    galaxy: true,
    galaxydebris: true,
    minetext: true,
    missingresources: true,
    nextbuilds: true,
    ship: true,
    shipatdock: true,
    shipresources: true,
    solarsat: true,
    stats: true,
    storagetime: true,
    markethelper: true,
    topeco: true,
    topfleet: true,
    topgeneral: true,
    topresearch: true
  };
  for (var featureKey in defaultFeatures) {
    if (typeof window.config.features[featureKey] !== 'boolean') {
      window.config.features[featureKey] = defaultFeatures[featureKey];
    }
  }

  var features = window.config.features;

  // Add tabs in the left menu
  if (features.alliance) {
    window._addTabAlliance();
  }

  if (features.stats || features.charts || features.nextbuilds) {
    window._addTabStats();
  }

  if (features.topeco || features.topfleet || features.topgeneral || features.topresearch) {
    window._addTabTopflop();
  }

  if (features.expeditiontab) {
    window._addExpeditionMessageParserInterval();
    window._addTabExpeditions();
  }

  window._addTabSettings();
  window._addLinkTabs();

  // Add static helpers
  window._addInprogParser();

  if (features.storagetime) {
    window._addCurrentPlanetStorageHelper();
  }

  if (features.deploytransport) {
    window._addPlanetFleetShortcuts();
  }

  // Add interval checkers
  if (features.galaxy) {
    window._addGalaxyPlayersPlanetsInterval();
  }

  if (features.galaxydebris) {
    window._addGalaxyDebrisInterval();
  }

  if (features.minetext || features.missingresources) {
    window._addCostsHelperInterval();
  }

  if (features.ship) {
    window._addShipHelperInterval();
  }

  if (features.shipatdock) {
    if (window.config.shipsAtDockThreshold == null) {
      window.config.shipsAtDockThreshold = 0.1 / 100;
    }
    window._addShipAtDockHelper();
  }

  if (features.shipresources) {
    window._addShipResourcesHelperInterval();
  }

  if (features.expeditionpoints) {
    window._addExpeditionHelperInterval();
  }

  if (features.solarsat) {
    window._addSolarSatHelperInterval();
  }

  if (features.markethelper) {
    window._addMarketHelper();
  }

  // Refresh universe data (config.players)
  window._refreshUniverseData();

  // Add historical point logger
  window._logHistoryData();

  if (document.location.href.indexOf('fleetdispatch') !== -1 && window.config.autoProbes) {
    // check if fleets have returned
    setInterval(function () {
      var current = Number(
        $('.event_list .undermark')
          .text()
          .replace(/[^0-9]*/g, '')
      );
      var atPageLoad = Number($('#slots .advice').first().text().split(':')[1].split('/')[0]);
      if (current !== atPageLoad) {
        console.log('reload');
        document.location.href = document.location.href;
      } else {
        console.log('same');
      }
    }, 5000);

    // if not enough probes, return
    var fleets = config.fleetProbes || 5;
    var probes = config.nProbes || 20000;
    var nProbesPerFleet = Math.floor(probes / fleets);
    var nProbes = Number($('.espionageProbe .amount').text().replace(/\./g, '').trim());
    if (nProbes < nProbesPerFleet) {
      return;
    }

    // if at max fleet, return
    if (maxFleetCount === fleetCount) {
      return;
    }

    var targets = [];
    for (var key in config.players) {
      var player = config.players[key];
      if (
        player.status &&
        player.status.toLowerCase().indexOf('i') !== -1 &&
        player.status.indexOf('v') === -1 &&
        player.militaryScore === '0' &&
        Number(player.economyScore) > 10000
      ) {
        player.planets.forEach(function (p) {
          targets.push({ score: Number(player.economyScore), coords: p.coords });
        });
      }
    }
    targets = targets.sort(function (a, b) {
      return a.score > b.score ? -1 : 1;
    });
    var index = Math.floor(Math.random() * Math.random() * targets.length);
    var target = targets[index].coords;

    $('input[name=espionageProbe]').val(nProbesPerFleet).keyup();
    fleetDispatcher.mission = 1;
    fleetDispatcher.targetPlanet.galaxy = target[0];
    fleetDispatcher.targetPlanet.system = target[1];
    fleetDispatcher.targetPlanet.position = target[2];
    setTimeout(function () {
      $('#continueToFleet2').click();
    }, 10);
    setTimeout(function () {
      $('a#pbutton.planet').click();
    }, 20);
    setTimeout(function () {
      $('#continueToFleet3').click();
    }, 30);
    setTimeout(function () {
      if (fleetDispatcher.targetPlayerColorClass === 'inactive') {
        $('#sendFleet').click();
      }
    }, 1000);
    setTimeout(function () {
      document.location.href = document.location.href;
    }, 2000);
  }
};
