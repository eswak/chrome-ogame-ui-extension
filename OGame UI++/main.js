// inject libs
var libs = [
  'lib/chartist.min.js'
];
libs.forEach(function (path) {
  var script = document.createElement('script');
  script.src = chrome.extension.getURL(path);
  (document.head || document.documentElement).appendChild(script);
  script.parentNode.removeChild(script);
});

// add image url object
var uipp_images = {
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

  // config default values
  window.config = _getConfig();
  _setConfigTradeRate();
  _setConfigMyPlanets();
  _parseResearchTab();

  // Add tabs in the left menu
  _addTabAlliance();
  _addTabIdlePlayers();
  _addTabStats();
  _addTabTopflop();
  _addTabNeighbors();
  _addTabSimulator();
  _addTabWarRiders();
  _addTabSettings();

  // Add static helpers
  _addCurrentPlanetStorageHelper();

  // Add interval checkers
  _addSpyReportsScannerInterval();
  _addGalaxyPlayersPlanetsInterval();
  _addCostsHelperInterval();

  // Refresh universe data (config.players)
  _refreshUniverseData();

  // Add historical point logger
  _logHistoryData();
};

// inject user script into the document
var script = document.createElement('script');
script.textContent = '(' + userscript + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
