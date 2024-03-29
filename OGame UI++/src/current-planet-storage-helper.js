'use strict';
window._addCurrentPlanetStorageHelper = function _addCurrentPlanetStorageHelper() {
  var resources = window._getCurrentPlanetResources();
  var resourcesArr = ['metal', 'crystal', 'deuterium'];
  var tooltips = window.resourcesBar.resources;

  if (resources) {
    resourcesArr.forEach(function (resource) {
      // indicates storage left (in time)
      $('#' + resource + '_box .value').append(
        [
          '<br>',
          '<span class="enhancement storageleft">',
          window._time((resources[resource].max - resources[resource].now) / resources[resource].prod, -1),
          '</span>'
        ].join('')
      );

      // add indicators to tooltip
      if (!tooltips) {
        return;
      }

      var tempTooltip = tooltips[resource].tooltip.replace(
        '</table>',
        [
          '<tr class="enhancement">',
          '<th>' + window._translate('CURRENT_STORAGE_TIME') + ' :</th>',
          '<td>' +
            window._time((resources[resource].max - resources[resource].now) / resources[resource].prod, -1) +
            '</td>',
          '</tr>',
          '<tr class="enhancement">',
          '<th>' + window._translate('TOTAL_STORAGE_TIME') + ' :</th>',
          '<td>' +
            (window._time(resources[resource].max / resources[resource].prod).length > 0
              ? window._time(resources[resource].max / resources[resource].prod)
              : '∞') +
            '</td>',
          '</tr>',
          '</table>'
        ].join('')
      );

      window.changeTooltip($('#' + resource + '_box'), tempTooltip);
    });
  }
};
