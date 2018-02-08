// inject main script
var userscript = function () {
  setTimeout(function () {
    'use strict';

    localStorage.setItem('uipp_miniFleetToken', window.miniFleetToken);
    if (!window.config) {
      $('#links').append([
        '<div style="background: black;padding: 10px;margin: 10px 8px 0 0;border: 1px solid #ff6000;border-radius: 3px;color:#ff6000;text-align: center">',
        'OGame Nearby Players requires <a href="https://chrome.google.com/webstore/detail/ogame-ui%2B%2B/nhbgpipnadhelnecpcjcikbnedilhddf" target="_blank">OGame UI++</a> to work properly.',
        '</div>'
      ].join(''));
      return;
    }

    window._addTabIdlePlayers();
    window._addTabNeighbors();
    window._addPlanetsNotes();
    window._addCostsHelperInterval();
  }, 10);
};

// inject user script into the document
var script = document.createElement('script');
script.textContent = '(' + userscript + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
