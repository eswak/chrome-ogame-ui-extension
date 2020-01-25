// inject libs
var libs = [
  'lib/chartist.min.js',
  'lib/dom-to-image.min.js'
];
libs.forEach(function (path) {
  var lib = document.createElement('script');
  lib.src = chrome.extension.getURL(path);
  (document.head || document.documentElement).appendChild(lib);
  lib.parentNode.removeChild(lib);
});

// add image url object
var uipp_images = {
  inflight: chrome.extension.getURL('img/fleet-inflight.gif'),
  stay: chrome.extension.getURL('img/mission-stay.jpg'),
  ship: chrome.extension.getURL('img/mission-ship.jpg'),
  datetime: chrome.extension.getURL('img/datetime.png'),
  expedition: chrome.extension.getURL('img/expedition.png'),
  yield: chrome.extension.getURL('img/yield.png'),
  item: chrome.extension.getURL('img/item.png'),
  metal: chrome.extension.getURL('img/mine-metal.png'),
  crystal: chrome.extension.getURL('img/mine-crystal.png'),
  deuterium: chrome.extension.getURL('img/mine-deuterium.png'),
  astrophysics: chrome.extension.getURL('img/tech-astro.png'),
  plasma: chrome.extension.getURL('img/tech-plasma.png'),
  features: {
    alliance: chrome.extension.getURL('img/features/alliance.png'),
    charts: chrome.extension.getURL('img/features/charts.png'),
    deploytransport: chrome.extension.getURL('img/features/deploytransport.png'),
    expeditionpoints: chrome.extension.getURL('img/features/expeditionpoints.png'),
    expeditiontab: chrome.extension.getURL('img/features/expeditiontab.png'),
    galaxy: chrome.extension.getURL('img/features/galaxy.png'),
    galaxydebris: chrome.extension.getURL('img/features/galaxydebris.png'),
    minetext: chrome.extension.getURL('img/features/minetext.png'),
    missingresources: chrome.extension.getURL('img/features/missingresources.png'),
    nextbuilds: chrome.extension.getURL('img/features/nextbuilds.png'),
    solarsat: chrome.extension.getURL('img/features/solarsat.png'),
    ship: chrome.extension.getURL('img/features/ship.png'),
    stats: chrome.extension.getURL('img/features/stats.png'),
    storagetime: chrome.extension.getURL('img/features/storagetime.png'),
    topeco: chrome.extension.getURL('img/features/topeco.png'),
    topfleet: chrome.extension.getURL('img/features/topfleet.png'),
    topgeneral: chrome.extension.getURL('img/features/topgeneral.png'),
    topresearch: chrome.extension.getURL('img/features/topresearch.png')
  },
  resources: {
    am: chrome.extension.getURL('img/resources/am.png'),
    metal: chrome.extension.getURL('img/resources/metal.png'),
    crystal: chrome.extension.getURL('img/resources/crystal.png'),
    deuterium: chrome.extension.getURL('img/resources/deuterium.png')
  },
  ships: {
    202: chrome.extension.getURL('img/ships/202.jpg'),
    203: chrome.extension.getURL('img/ships/203.jpg'),
    204: chrome.extension.getURL('img/ships/204.jpg'),
    205: chrome.extension.getURL('img/ships/205.jpg'),
    206: chrome.extension.getURL('img/ships/206.jpg'),
    207: chrome.extension.getURL('img/ships/207.jpg'),
    208: chrome.extension.getURL('img/ships/208.jpg'),
    209: chrome.extension.getURL('img/ships/209.jpg'),
    210: chrome.extension.getURL('img/ships/210.jpg'),
    211: chrome.extension.getURL('img/ships/211.jpg'),
    212: chrome.extension.getURL('img/ships/212.jpg'),
    213: chrome.extension.getURL('img/ships/213.jpg'),
    214: chrome.extension.getURL('img/ships/214.jpg'),
    215: chrome.extension.getURL('img/ships/215.jpg'),
    217: chrome.extension.getURL('img/ships/217.jpg'),
    218: chrome.extension.getURL('img/ships/218.jpg'),
    219: chrome.extension.getURL('img/ships/219.jpg')
  },
  score: {
  	global: chrome.extension.getURL('img/score-global.png'),
  	economy: chrome.extension.getURL('img/score-economy.png'),
  	research: chrome.extension.getURL('img/score-research.png'),
  	military: chrome.extension.getURL('img/score-military.png'),
  	fleet: chrome.extension.getURL('img/score-fleet.png')
  }
};
var imgScript = document.createElement('script');
imgScript.innerHTML = 'var uipp_images = ' + JSON.stringify(uipp_images) + ';';
(document.head || document.documentElement).appendChild(imgScript);
imgScript.parentNode.removeChild(imgScript);

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

  if (features.expeditionpoints) {
    window._addExpeditionHelperInterval();
  }

  if (features.solarsat) {
    window._addSolarSatHelperInterval();
  }

  // Refresh universe data (config.players)
  window._refreshUniverseData();

  // Add historical point logger
  window._logHistoryData();

  // Tracking code
  window._setupAnalytics();
};

// inject user script into the document
var script = document.createElement('script');
script.textContent = '(' + userscript + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
