var fn = function () {
  'use strict';
  window._setTradeRate = function _setTradeRate (i, n) {
    if (isNaN(Number(n.replace(',', '.')))) {
      return;
    }

    window.config.tradeRate[i] = Number(n.replace(',', '.'));
    window._saveConfig();
  };

  window._addTabSettings = function _addTabSettings () {
    var $menuEntry = $('<li class="settings enhanced"><span class="menu_icon"><div class="menuImage alliance"></div></span><a class="menubutton" href="#" accesskey="" target="_self"><span class="textlabel enhancement">OGame UI++</span></a></li>');
    $('#menuTable').append($menuEntry);
    $menuEntry.click(function () {
      var $wrapper = window._onMenuClick('settings');
      if (!$wrapper) return;

      window.uipp_analytics('uipp-tab-click', 'settings');

      // trade rate window.config
      $wrapper.append($([
        '<div style="padding: 10px 0" class="clearfix">',
        '<div style="float: left; line-height: 32px;padding-right: 10px;">' + window._translate('TRADE_RATE') + ' : ' + '</div>',
        '<div>',
        '<div class="resourceIcon metal" style="margin-top: -3px"></div>',
        '<input type="text" value="' + window.config.tradeRate[0] + '" style="width:30px; float: left; margin-right: 10px" onchange="_setTradeRate(0, this.value)"/>',
        '<div class="resourceIcon crystal" style="margin-top: -3px"></div>',
        '<input type="text" value="' + window.config.tradeRate[1] + '" style="width:30px; float: left; margin-right: 10px" onchange="_setTradeRate(1, this.value)"/>',
        '<div class="resourceIcon deuterium" style="margin-top: -3px"></div>',
        '<input type="text" value="' + window.config.tradeRate[2] + '" style="width:30px; float: left;" onchange="_setTradeRate(2, this.value)"/>',
        '</div>',
        '</div>'
      ].join('')));

      // add donation button
      var $donateButton = $([
        '<div style="margin-top:50px;text-align:center">',
        '<p>' + window._translate('DONATE_TEXT') + '<br><br></p>',
        '<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">',
        '<input type="hidden" name="cmd" value="_s-xclick">',
        '<input type="hidden" name="hosted_button_id" value="BZ4XL4R9QRW3Y">',
        '<input type="image" src="https://www.paypalobjects.com/fr_FR/FR/i/btn/btn_donate_LG.gif" border="0" name="submit" alt="PayPal, le réflexe sécurité pour payer en ligne">',
        '<img alt="" border="0" src="https://www.paypalobjects.com/fr_FR/i/scr/pixel.gif" width="1" height="1">',
        '</form>',
        '</div>'
      ].join(''));
      $wrapper.append($donateButton);
      $donateButton.click(function () {
        window.uipp_analytics('uipp-donate', 1);
      });

      // add reset ALL button
      var $resetAllButton = $('<div style="margin-top: 50px; text-align: center;"><i>' + window._translate('RESET_ALL_TEXT') + '</i><br><br><a href="#" class="btn_blue" style="width:625px">' + window._translate('RESET_ALL') + '</a></div>');
      $wrapper.append($resetAllButton);
      $resetAllButton.click(function () {
        window.uipp_analytics('uipp-data-reset', 'all');
        window._resetConfig();
        window.location.reload();
      });

      // add reset history button
      var $resetHistory = $('<div style="text-align:center;margin-top:10px"><a href="#" class="btn_blue" style="width:625px">' + window._translate('RESET_HISTORY') + '</a></div>');
      $wrapper.append($resetHistory);
      $resetHistory.click(function () {
        window.uipp_analytics('uipp-data-reset', 'history');
        delete window.config.history;
        window._saveConfig();
        window.location.reload();
      });

      // add reset notes button
      var $resetPlanetNotes = $('<div style="text-align:center;margin-top:10px"><a href="#" class="btn_blue" style="width:625px">' + window._translate('RESET_NOTES') + '</a></div>');
      $wrapper.append($resetPlanetNotes);
      $resetPlanetNotes.click(function () {
        window.uipp_analytics('uipp-data-reset', 'notes');
        delete window.config.planetNotes;
        window._saveConfig();
        window.location.reload();
      });

      // add reset planet info button
      var $resetPlanetInfos = $('<div style="text-align:center;margin-top:10px"><a href="#" class="btn_blue" style="width:625px">' + window._translate('RESET_PLANETINFO') + '</a></div>');
      $wrapper.append($resetPlanetInfos);
      $resetPlanetInfos.click(function () {
        window.uipp_analytics('uipp-data-reset', 'planet-info');
        delete window.config.my.planets;
        window._saveConfig();
        window.location.reload();
      });

      // add reset universe button
      var $resetUniverse = $('<div style="text-align:center;margin-top:10px"><a href="#" class="btn_blue" style="width:625px">' + window._translate('RESET_UNIVERSE') + '</a></div>');
      $wrapper.append($resetUniverse);
      $resetUniverse.click(function () {
        window.uipp_analytics('uipp-data-reset', 'universe');
        delete window.config.players;
        window.config.lastPlayersUpdate = 0;
        window._saveConfig();
        window.location.reload();
      });

      window._insertHtml($wrapper);
    });
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
