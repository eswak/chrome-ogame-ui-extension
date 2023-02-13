'use strict';
window._getCurrentPlanetCoordinates = function _getCurrentPlanetCoordinates() {
  var coordinates = new Array(3);

  if ($('.planetlink.active').length > 0) {
    coordinates = $('.planetlink.active').find('.planet-koords').text().replace('[', '').replace(']', '').split(':');
  } else if ($('.moonlink.active').length > 0) {
    coordinates = $('.moonlink.active')
      .parent()
      .find('.planet-koords')
      .text()
      .replace('[', '')
      .replace(']', '')
      .split(':');
    coordinates.isMoon = true;
  } else {
    coordinates = $('.planetlink').find('.planet-koords').text().replace('[', '').replace(']', '').split(':');
  }

  coordinates[0] = parseInt(coordinates[0]);
  coordinates[1] = parseInt(coordinates[1]);
  coordinates[2] = parseInt(coordinates[2]);

  return coordinates;
};
