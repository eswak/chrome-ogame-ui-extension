'use strict';
window._addMarketHelper = function _addMarketHelper() {
  if (document.location.href.indexOf('component=supplies') === -1) {
    return;
  }

  var $wrapper = $(
    '<div class="enhancement" style="background: rgba(0, 0, 0, 0.8); position: absolute; top: 35px; left: 10px; padding: 10px; border-radius: 3px;"></div>'
  );
  var nOffers = 0;
  window.uipp_getCollectableOffers(function (offers) {
    offers.forEach(function (offer) {
      if (_getCurrentPlanetCoordinates().join(':') === offer.coords) {
        nOffers++;
        $wrapper.append(
          [
            '<div id="market-tid-' + offer.tid + '">',
            '<img src="' +
              uipp_images.marketcollect +
              '" style="vertical-align:-7px; height: 26px; cursor:pointer;" onclick="uipp_collectMarketOffer(\'' +
              offer.type +
              "', " +
              offer.tid +
              ", '" +
              offer.resource +
              "', " +
              offer.amount +
              ')" class="tooltip" title="' +
              offer.text +
              '"/>',
            '<img src="' +
              uipp_images.resources[offer.resource] +
              '" style="vertical-align: -7px; height: 26px; margin: 0 5px; filter: brightness(1.5);"/>',
            _num(offer.amount),
            '</div>'
          ].join('')
        );
      }
    });

    if (nOffers) $('#supplies header').append($wrapper);
  });

  window.uipp_collectMarketOffer = function (type, tid, res, amount) {
    $.get(
      '/game/index.php?page=componentOnly&component=marketplace&action=' +
        (type === 'buy' ? 'collectItem' : 'collectPrice') +
        '&marketTransactionId=' +
        tid +
        '&asJson=1',
      function (data) {
        data = JSON.parse(data);
        window.fadeBox(data.message || data.errors[0].message, data.status === 'failure');
        if (data.status === 'success') {
          resourcesBar.resources[res].amount += amount;
        }
        $('#market-tid-' + tid).remove();
      }
    );
  };
};
