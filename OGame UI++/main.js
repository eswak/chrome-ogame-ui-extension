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
