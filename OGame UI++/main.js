// inject libs
var libs = [
  'lib/chartist.min.js'
];
libs.forEach(function (path) {
  var lib = document.createElement('script');
  lib.src = chrome.extension.getURL(path);
  (document.head || document.documentElement).appendChild(lib);
  lib.parentNode.removeChild(lib);
});

// add image url object
var uipp_images = {
  stay: chrome.extension.getURL('img/mission-stay.jpg'),
  ship: chrome.extension.getURL('img/mission-ship.jpg'),
  metal: chrome.extension.getURL('img/mine-metal.png'),
  crystal: chrome.extension.getURL('img/mine-crystal.png'),
  deuterium: chrome.extension.getURL('img/mine-deuterium.png'),
  astrophysics: chrome.extension.getURL('img/tech-astro.png'),
  plasma: chrome.extension.getURL('img/tech-plasma.png')
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

  // Add tabs in the left menu
  window._addTabAlliance();
  window._addTabIdlePlayers();
  window._addTabStats();
  window._addTabTopflop();
  window._addTabNeighbors();
  window._addTabSimulator();
  window._addTabWarRiders();
  window._addTabSettings();

  // Add static helpers
  window._addCurrentPlanetStorageHelper();
  window._addPlanetFleetShortcuts();

  // Add interval checkers
  window._addSpyReportsScannerInterval();
  window._addGalaxyPlayersPlanetsInterval();
  window._addCostsHelperInterval();
  window._addSolarSatHelperInterval();

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
