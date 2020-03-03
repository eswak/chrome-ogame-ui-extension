var fn = function () {
  'use strict';
  var offers = null;
  window.uipp_getCollectableOffers = function uipp_getCollectableOffers (cb) {
    if (offers !== null) {
      return cb && cb(offers, true);
    }

    $.get('/game/index.php?page=ingame&component=marketplace&tab=history_selling&action=fetchHistorySellingItems&ajax=1&sorting%5Bprice%5D=&sorting%5Bdate%5D=desc&pagination%5Bpage%5D=1', function(dataSell) {
      $.get('/game/index.php?page=ingame&component=marketplace&tab=history_buying&action=fetchHistoryBuyingItems&ajax=1&sorting%5Bprice%5D=&sorting%5Bdate%5D=desc&pagination%5Bpage%5D=1', function(dataBuy) {
        offers = [];

        $(JSON.parse(dataSell).content['marketplace/marketplace_items_history']).each(function() {
          if (($(this).html() || '').indexOf('<div') === -1) {
            return;
          }

          if ($(this).find('.collectPrice:not(.disabled)').length !== 1) {
            return;
          }

          var tid = $(this).find('a.collect-price').attr('data-transactionid');
          var text = $(this).find('.buttons.collectPrice').attr('title');
          var date = gfDateToTimestamp($(this).find('.info.date span').text());
          var coords = $(this).find('.info.details a').text().split('[')[1].split(']')[0];
          var resource = $(this).find('.col.price h3').text();
          if (resource === window.config.labels.metal) resource = 'metal';
          if (resource === window.config.labels.crystal) resource = 'crystal';
          if (resource === window.config.labels.deuterium) resource = 'deuterium';
          var amount = Number($(this).find('.col.price .text.quantity').text().replace(/\./g, ''));

          offers.push({
            tid: tid,
            type: 'sell',
            date: date,
            coords: coords,
            resource: resource,
            amount: amount,
            text: text,
          });
        });

        $(JSON.parse(dataBuy).content['marketplace/marketplace_items_history']).each(function() {
          if (($(this).html() || '').indexOf('<div') === -1) {
            return;
          }

          if ($(this).find('.collectItem:not(.disabled)').length !== 1) {
            return;
          }

          var tid = $(this).find('a.collect-item').attr('data-transactionid');
          var text = $(this).find('.buttons.collectItem').attr('title');
          var date = gfDateToTimestamp($(this).find('.info.date span').text());
          var coords = $(this).find('.info.details a').text().split('[')[1].split(']')[0];
          var resource = $(this).find('.info.details h3').text();
          if (resource === window.config.labels.metal) resource = 'metal';
          if (resource === window.config.labels.crystal) resource = 'crystal';
          if (resource === window.config.labels.deuterium) resource = 'deuterium';
          var amount = Number($(this).find('.info.details .text.quantity').text().replace(/\./g, ''));

          offers.push({
            tid: tid,
            type: 'buy',
            date: date,
            coords: coords,
            resource: resource,
            amount: amount,
            text: text,
          });
        });

        cb && cb(offers, false);
      });
    });
  };

  function gfDateToTimestamp(dateStr) {
    var year = dateStr.split(' - ')[0].split('.')[2];
    var month = dateStr.split(' - ')[0].split('.')[1];
    var day = dateStr.split(' - ')[0].split('.')[0];
    return new Date(year + '-' + month + '-' + day + ' ' + dateStr.split(' - ')[1]).getTime();
  }
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
