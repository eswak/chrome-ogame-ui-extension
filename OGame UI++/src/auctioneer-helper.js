var fn = function () {
  'use strict';
  window._addAuctioneerHelper = function _addAuctioneerHelper () {
    if (document.location.href.indexOf('traderOverview') !== -1) {
      return;
    }

    $.ajax({
      method: 'post',
      url: '/game/index.php?page=traderOverview#animation=false&page=traderImportExport',
      data: {
        show: 'auctioneer',
        ajax: 1
      },
      success: function (data) {
        var $boxcontainer = $('.left_box', data);
        var $link = $boxcontainer.find('.image_140px');
        var cost = $boxcontainer.find('.currentSum').text();
        var bids = $boxcontainer.find('.numberOfBids').text();
        $link.find('.amount').text(cost + ' (' + bids + ')');
        $link.find('a').attr('href', '/game/index.php?page=traderOverview#animation=false&page=traderAuctioneer');
        var time = $boxcontainer.find('.auction_info span').wrap('<p/>').parent().html();
        if (time.indexOf('</b>') === -1) {
          // don't display anything if auction is ended
          return;
        }

        var $el = $([
          '<div id="traderOverview" style="margin:-25px 0 0 -5px">',
          '<div class="div_trader">',
          '<div class="left_box">',
          '<div class="image_140px" style="margin:0;">',
          $link.html(),
          '</div>',
          '<div style="text-align:center;width:140px;">' + time + '</div>',
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
