var fn = function () {
  'use strict';
  window._setTradeRate = function _setTradeRate(i, n) {
    if (isNaN(Number(n.replace(',', '.')))) {
      return;
    }

    config.tradeRate[i] = Number(n.replace(',', '.'));
    _saveConfig(config);
  };

  window._addTabSettings = function _addTabSettings() {
    var $menuEntry = $('<li class="settings enhanced"><span class="menu_icon"><div class="customMenuEntrySettings menuImage alliance"></div></span><a class="menubutton" href="#" accesskey="" target="_self"><span class="textlabel enhancement">OGame UI++</span></a></li>');
    $('#menuTable').append($menuEntry);
    $menuEntry.click(function () {
      // ui changes
      $('.menubutton.selected').removeClass('selected');
      $('.menuImage.highlighted').removeClass('highlighted');
      $('.settings .menubutton').addClass('selected');
      $('.customMenuEntrySettings').addClass('highlighted');

      var $wrapper = $('<div class="uiEnhancementWindow"></div>');

      // trade rate config
      $wrapper.append($([
        '<div style="padding: 10px 0">',
          '<div style="float: left; line-height: 32px;padding-right: 10px;">' + _translate('TRADE_RATE') + ' : ' + '</div>',
          '<div>',
            '<div class="resourceIcon metal" style="margin-top: -3px"></div>',
            '<input type="text" value="' + config.tradeRate[0] + '" style="width:30px; float: left; margin-right: 10px" onchange="_setTradeRate(0, this.value)"/>',
            '<div class="resourceIcon crystal" style="margin-top: -3px"></div>',
            '<input type="text" value="' + config.tradeRate[1] + '" style="width:30px; float: left; margin-right: 10px" onchange="_setTradeRate(1, this.value)"/>',
            '<div class="resourceIcon deuterium" style="margin-top: -3px"></div>',
            '<input type="text" value="' + config.tradeRate[2] + '" style="width:30px; float: left;" onchange="_setTradeRate(2, this.value)"/>',
          '</div>',
        '</div>'
      ].join('')));

      // add reset ALL button
      var $resetAllButton = $('<div style="margin-top: 200px; text-align: center;"><i>' + _translate('RESET_ALL_TEXT') + '</i><br><br><a href="#" class="btn_blue">' + _translate('RESET_ALL') + '</a></div>');
      $wrapper.append($resetAllButton);
      $resetAllButton.click(function () {
        localStorage.removeItem('og-enhancements');
        window.location.reload();
      });

      // insert html
      var $eventboxContent = $('#eventboxContent');
      $('#contentWrapper').html($eventboxContent);
      $('#contentWrapper').append($wrapper);
    });
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
