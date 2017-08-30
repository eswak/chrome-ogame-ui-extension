var fn = function () {
  'use strict';
  window._addCurrentPlanetStorageHelper = function _addCurrentPlanetStorageHelper () {
    var resources = window._getCurrentPlanetResources();
    var resourcesArr = ['metal', 'crystal', 'deuterium'];
    var tooltips = JSON.parse(
      window.initAjaxResourcebox.toString()
        .replace('function initAjaxResourcebox(){reloadResources(', '')
        .replace(new RegExp('\\);}$'), '')
    );

    if (resources) {
      for (var i = 0; i < resourcesArr.length; i++) {
        // indicates storage left (in time)
        $('#' + resourcesArr[i] + '_box .value').append('<br><span class="enhancement storageleft">' + window._time((resources[resourcesArr[i]].max - resources[resourcesArr[i]].now) / resources[resourcesArr[i]].prod, -1) + '</span>');

        // add indicators to tooltip
        var tempTooltip = tooltips[resourcesArr[i]].tooltip.replace(
          '</table>',
          [
            '<tr class="enhancement"><th>Time untill full:</th><td>' + window._time((resources[resourcesArr[i]].max - resources[resourcesArr[i]].now) / resources[resourcesArr[i]].prod, -1) + '</td></tr>',
            '<tr class="enhancement"><th>Total storage time:</th><td>' + (window._time(resources[resourcesArr[i]].max / resources[resourcesArr[i]].prod).length > 0 ? window._time(resources[resourcesArr[i]].max / resources[resourcesArr[i]].prod) : '') + '</td></tr>',
            '</table>'
          ].join('')
        );

        changeTooltip($('#' + resourcesArr[i] + '_box'), tempTooltip);
      }
    }
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
