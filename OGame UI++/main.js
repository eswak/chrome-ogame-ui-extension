var userscript = function () {
  'use strict';

  // config default values
  window.config = _getConfig();
  _setConfigTradeRate();
  _setConfigMyPlanets();
  _parseResearchTab();

  // Add tabs in the left menu
  _addTabIdlePlayers();
  _addTabStats();
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
};

// inject user script into the document
var script = document.createElement('script');
script.textContent = '(' + userscript + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
