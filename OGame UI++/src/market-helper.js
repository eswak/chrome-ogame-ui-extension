var fn = function () {
  'use strict';
  window._addMarketHelper = function _addMarketHelper () {
    if (document.location.href.indexOf('component=supplies') === -1) {
      return;
    }

    var $wrapper = $('<div class="enhancement" style="background: rgba(0, 0, 0, 0.8); position: absolute; top: 35px; left: 10px; padding: 10px; border-radius: 3px;"></div>');
    var nOffers = 0;
    $.get('/game/index.php?page=ingame&component=marketplace&tab=history_selling&action=fetchHistorySellingItems&ajax=1&sorting%5Bprice%5D=&sorting%5Bdate%5D=desc&pagination%5Bpage%5D=1', function(data) {
      var $html = $(JSON.parse(data).content['marketplace/marketplace_items_history']);
      $html.each(function() {
        if (($(this).html() || '').indexOf('<div') === -1) {
          return;
        }

        if ($(this).find('.collectPrice:not(.disabled)').length !== 1) {
          return;
        }

        var tid = $(this).find('a.collect-price').attr('data-transactionid');
        var date = gfDateToTimestamp($(this).find('.info.date span').text());
        var coords = $(this).find('.info.details a').text().split('[')[1].split(']')[0];
        var resource = $(this).find('.col.price h3').text();
        if (resource === window.config.labels.metal) resource = 'metal';
        if (resource === window.config.labels.crystal) resource = 'crystal';
        if (resource === window.config.labels.deuterium) resource = 'deuterium';
        var amount = Number($(this).find('.col.price .text.quantity').text().replace(/\./g, ''));

        if (_getCurrentPlanetCoordinates().join(':') === coords) {
          nOffers++;
          $wrapper.append([
            '<div id="market-tid-' + tid + '">',
            '<img src="' + uipp_images.marketcollect + '" style="vertical-align:-7px; height: 26px; cursor:pointer;" onclick="uipp_collectMarketOffer(' + tid + ', \'' + resource + '\', ' + amount + ')"/>',
            '<img src="' + uipp_images.resources[resource] + '" style="vertical-align: -7px; height: 26px; margin: 0 5px; filter: brightness(1.5);"/>',
            _num(amount),
            '</div>'
          ].join(''));
        }
      });

      if (nOffers) $('#supplies header').append($wrapper);
    });

    window.uipp_collectMarketOffer = function(tid, res, amount) {
      $.get('https://s166-fr.ogame.gameforge.com/game/index.php?page=componentOnly&component=marketplace&action=collectPrice&marketTransactionId=' + tid + '&asJson=1', function(data) {
        data = JSON.parse(data);
        window.fadeBox(data.message || data.errors[0].message, data.status === 'failure');
        if (data.status === 'success') {
          resourcesBar.resources[res].amount += amount;
        }
        $('#market-tid-' + tid).remove();
      });
    };

    function gfDateToTimestamp(dateStr) {
  		var year = dateStr.split(' - ')[0].split('.')[2];
  		var month = dateStr.split(' - ')[0].split('.')[1];
  		var day = dateStr.split(' - ')[0].split('.')[0];
  		return new Date(year + '-' + month + '-' + day + ' ' + dateStr.split(' - ')[1]).getTime();
  	}
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
