var fn = function () {
  'use strict';
  window._addCurrentPlanetStorageHelper = function _addCurrentPlanetStorageHelper () {
    var resources = window._getCurrentPlanetResources();

    if (resources) {
      // indicates storage left (in time) and total storage time
      $('#metal_box .value').append('<br><span class="enhancement storageleft">' + window._time((resources.metal.max - resources.metal.now) / resources.metal.prod, -1) + (window._time(resources.metal.max / resources.metal.prod).length > 0 ? ' (' + window._time(resources.metal.max / resources.metal.prod) + ')' : '') + '</span>');
      $('#crystal_box .value').append('<br><span class="enhancement storageleft">' + window._time((resources.crystal.max - resources.crystal.now) / resources.crystal.prod, -1) + (window._time(resources.crystal.max / resources.crystal.prod).length > 0 ? ' (' + window._time(resources.crystal.max / resources.crystal.prod) + ')' : '') + '</span>');
      $('#deuterium_box .value').append('<br><span class="enhancement storageleft">' + window._time((resources.deuterium.max - resources.deuterium.now) / resources.deuterium.prod, -1) + (window._time(resources.deuterium.max / resources.deuterium.prod).length > 0 ? ' (' + window._time(resources.deuterium.max / resources.deuterium.prod) + ')' : '') + '</span>');
    }
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
