var fn = function () {
  'use strict';
  window._addSolarSatHelperInterval = function _addSolarSatHelperInterval () {
    setInterval(function () {
      var $el = $('#resources_212_large:not(.enhanced)');

      if ($el.length) {
        $el.addClass('enhanced');
        var energy = Number($('#resources_energy').text().replace(/\./g, ''));

        if (energy < 0) {
          var $production = $('.production_info .time .undermark');
          if ($production.text().length === 0)
            $production = $('#ago_items_production > span');
          var production = Number($production.text().replace(/[()+]/g, ''));
          var n = Math.ceil(Math.abs(energy) / production);
          $('#number')[0].value = n;
        }
      }
    }, 100);
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
