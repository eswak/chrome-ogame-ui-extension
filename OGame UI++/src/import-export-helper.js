var fn = function () {
  'use strict';
  window._addImportExportHelper = function _addImportExportHelper () {
    if (document.location.href.indexOf('traderOverview') !== -1) {
      return;
    }

    var today = new Date().toISOString().split('T')[0];
    if (window.config.lastTraderImportDate === today) {
      return;
    }

    $.ajax({
      method: 'post',
      url: '/game/index.php?page=traderOverview#animation=false&page=traderImportExport',
      data: {
        show: 'importexport',
        ajax: 1
      },
      success: function (data) {
        var $boxcontainer = $('.left_box', data);
        var $link = $boxcontainer.find('.image_140px');
        var cost = $boxcontainer.find('.js_import_price').text();
        $link.find('.amount').text(cost);
        $link.find('a').attr('href', '/game/index.php?page=traderOverview#animation=false&page=traderImportExport');

        var imageSrc = $link.find('img').attr('src');
        if (imageSrc.indexOf('container') === -1) {
          window.config.lastTraderImportDate = today;
          window._saveConfig();
          return;
        }

        var $el = $([
          '<div id="traderOverview" style="margin:-25px 0 0 -5px">',
          '<div class="div_trader">',
          '<div class="left_box">',
          '<div class="image_140px" style="margin:0;">',
          $link.html(),
          '</div>',
          '</div>',
          '</div>',
          '</div>'
        ].join(''));

        $('#links').append($el);
      }
    });
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
