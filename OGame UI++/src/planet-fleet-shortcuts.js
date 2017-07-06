var fn = function () {
  'use strict';
  window._addPlanetFleetShortcuts = function _addPlanetFleetShortcuts () {
    $('div#planetList > .smallplanet').each(function (_, planet) {
      var coordinates = getPlanetCoords($(planet));
      var url = '/game/index.php?page=fleet1';
      url += '&galaxy=' + coordinates[0];
      url += '&system=' + coordinates[1];
      url += '&position=' + coordinates[2];
      url += '&type=1'; // Don't know why it has to be type=1

      var transportLinkUrl = url + '&mission=3';
      var deploymentLinkUrl = url + '&mission=4';

      $(planet).css('position', 'relative');

      var transportLink = [
        '<a class="transDeployLink"',
        ' style="position:absolute;left:-17px;top:0px;width:15px;height:15px;padding:3px;display:inline-block;z-index:999;"',
        ' href="' + transportLinkUrl + '">',
        '<img src="' + window.uipp_images.ship + '" style="height:100%;width:100%;"/>',
        '</a>'
      ].join('');
      var deploymentLink = [
        '<a class="transDeployLink"',
        ' style="position:absolute;left:-17px;top:20px;width:15px;height:15px;padding:3px;display:inline-block;z-index:999;"',
        ' href="' + deploymentLinkUrl + '">',
        '<img src="' + window.uipp_images.stay + '" style="height:100%;width:100%;"/>',
        '</a>'
      ].join('');
      $(planet).append(deploymentLink);
      $(planet).append(transportLink);
    });

    function getPlanetCoords (planet) {
      var coordsAsText = $(planet).find('a.planetlink > span.planet-koords').text();
      var start = coordsAsText.indexOf('[');
      var end = coordsAsText.indexOf(']');
      var trimmedCoords = coordsAsText.substr(start + 1, end - start - 1);
      return trimmedCoords.split(':');
    }
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
