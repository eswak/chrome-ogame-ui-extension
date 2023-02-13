document.addEventListener('UIPPImages', function (evt, a, b, c) {
  window.uipp_images = evt.detail;

  // uipp-box style
  var style = document.createElement('style');
  style.textContent = `
    .uipp-box {
      color: #f1f1f1;
      background: #0d1014;
      position: relative;
      width: calc(100% - 14px);
      box-sizing: border-box;
      border: 2px solid #000;
      margin: 5px auto 10px auto;
      padding: 15px;
    }
    .uipp-box::before {
      pointer-events: none;
      content: "";
      position: absolute; left: -9px; top: -3px; width: calc(100% + 18px); height: 28px;
      background: url(${uipp_images.box.boxTopLeft}) bottom left no-repeat, url(${uipp_images.box.boxTopRight}) bottom right no-repeat;
    }
    .uipp-box::after {
      pointer-events: none;
      content: "";
      position: absolute; left: -9px; bottom: -4px; width: calc(100% + 18px); height: 50px;
      background: url(${uipp_images.box.boxBottomLeft}) bottom left no-repeat, url(${uipp_images.box.boxBottomRight}) bottom right no-repeat;
    }
    .uipp-box h3 {
      position: relative;
      margin: -17px -15px 10px;
      background: url(${uipp_images.box.boxTitleBg});
      color: #AB7AFF;
      font: bold 12px/27px Verdana,Arial,Helvetica,sans-serif;
      text-align: center;
    }
    .uipp-box h3::before {
      color: #AB7AFF;
      position: absolute;
      top: 0;
      width: 26px;
      height: 27px;
      content: "";
      left: -5px;
      background: url(${uipp_images.box.boxTitleLeft});
    }
    .uipp-box h3::after {
      position: absolute;
      top: 0;
      width: 26px;
      height: 27px;
      content: "";
      right: -5px;
      background: url(${uipp_images.box.boxTitleRight});
    }
  `;
  (document.head || document.documentElement).appendChild(style);
});

document.addEventListener('UIPPStart', function (evt) {
  userscript();
});

// inject main script
var userscript = function () {
  'use strict';

  // window.config default values
  window._getConfigAsync(
    function (config) {
      window.config = config;
      window.config.tradeRate = window.config.tradeRate || [2.0, 1.5, 1.0];
      window._setConfigMyPlanets();
      window._parseResearchTab();
      window.uipp_parseEmpireData(false, function() {
        window._saveConfig();
      });

      window.config.features = window.config.features || {};
      var defaultFeatures = {
        alliance: true,
        charts: true,
        deploytransport: true,
        reminders: true,
        expeditionpoints: true,
        expeditiontab: true,
        competitiontab: true,
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

      if (features.expeditiontab) {
        window._addExpeditionMessageParserInterval();
        window._addTabExpeditions();
      }

      // Add static helpers
      window._addInprogParser();

      if (features.storagetime) {
        window._addCurrentPlanetStorageHelper();
      }

      if (features.deploytransport) {
        window._addPlanetFleetShortcuts();
      }

      // Add interval checkers
      if (features.galaxydebris) {
        window._addGalaxyDebrisInterval();
      }

      if (features.minetext || features.missingresources) {
        window._addCostsHelperInterval();
      }

      if (features.ship) {
        window._addShipHelperInterval();
      }

      if (features.shipresources) {
        window._addShipResourcesHelperInterval();
      }

      if (features.reminders) {
        window._addReminderHelpers();
      }

      if (features.solarsat) {
        window._addSolarSatHelperInterval();
      }

      if (config.features.expeditionpoints && config.universe.topScore) {
        window._addExpeditionHelperInterval();
      }
    },
    function (players) {
      config.players = players;

      if (config.features.expeditionpoints && !config.universe.topScore) {
        window._addExpeditionHelperInterval();
      }

      if (config.features.shipatdock) {
        if (window.config.shipsAtDockThreshold == null) {
          window.config.shipsAtDockThreshold = 0.1 / 100;
        }
        window._addShipAtDockHelper();
      }
    },
    function (history) {
      config.history = history;

      if (config.features.stats || config.features.charts || config.features.nextbuilds) {
        window._addTabStats();
      }

      if (
        config.features.topeco ||
        config.features.topfleet ||
        config.features.topgeneral ||
        config.features.topresearch
      ) {
        window._addTabTopflop();
      }

      if (config.features.competitiontab) {
        window._addCompetitionTab();
      }

      if (config.features.galaxy) {
        window._addGalaxyPlayersPlanetsInterval();
      }

      if (config.features.alliance) {
        window._addAllianceTable();
      }

      // Refresh universe data (config.players)
      window._refreshUniverseData();
    }
  );
};
