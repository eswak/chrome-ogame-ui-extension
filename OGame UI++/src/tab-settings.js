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
        '<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" alt="PayPal, le réflexe sécurité pour payer en ligne">',
        '<img alt="" border="0" src="https://www.paypalobjects.com/fr_FR/i/scr/pixel.gif" width="1" height="1">',
        '</form>',
        '</div>'
      ].join(''));
      $wrapper.append($donateButton);
      $donateButton.click(function () {
        window.uipp_analytics('uipp-donate', 1);
      });

      // links config
      $wrapper.append('<div style="margin-top:50px"></div>');
      for (var key in window.config.links) {
        var $entry = $([
          '<div>',
          '<input type="text" value="' + key + '" style="width:100px;"/>',
          '<input type="text" value="' + window.config.links[key] + '" style="margin-left: 5px;width:495px"/>',
          '<span class="icon icon_close" onclick="_removeLink(\'' + key + '\', this)" style="margin-left:3px;margin-bottom:-3px;cursor:pointer;"></span>',
          '</div>'
        ].join(''));
        $wrapper.append($entry);
      }
      $wrapper.append([
        '<div style="text-align:center;margin-top:5px" onclick="_addLink()">',
        '<a class="btn_blue" style="width:200px">Add link</a>',
        '</div>'
      ].join(''));

      // features config
      window._toggleFeature = function _toggleFeature (key, element) {
        if (window.config.features[key]) {
          $(element).css('opacity', '0.4');
          window.config.features[key] = false;
        } else {
          $(element).css('opacity', '1');
          window.config.features[key] = true;
        }

        window._saveConfig();
      };

      var $featurewrapper = $('<div style="margin-top:50px;text-align:center;"></div>');
      for (var featureKey in window.config.features) {
        $featurewrapper.append($([
          '<img src="' + window.uipp_images.features[featureKey] + '"',
          'style="width:100px;height:100px;margin:10px;cursor:pointer;',
          'opacity:' + (window.config.features[featureKey] ? '1' : '0.4') + ';"',
          'onclick="_toggleFeature(\'' + featureKey + '\', this)"/>'
        ].join('')));
      }
      $wrapper.append($featurewrapper);

      // Troubleshooting
      var $resetWrapper = $('<div><hr style="border-color:gray"><span>Troubleshooting</span></div>');
      $resetWrapper.append('<div style="margin-top: 10px; color: gray; text-align: justify;">' + window._translate('RESET_ALL_TEXT') + '<br><br>');
      window._translate('RESET_ALL_TEXT');
      [
        ['all', window._translate('RESET_ALL')],
        ['history', window._translate('RESET_HISTORY')],
        ['notes', window._translate('RESET_NOTES')],
        ['planet-info', window._translate('RESET_PLANETINFO')]
      ].forEach (function (choice) {
        var $checkbox = $('<div style="margin-left: 18px;"> </div>').data('name', choice[0])
          .append('<input type="checkbox" class="resetChoice">')
          .append('<span style="position: relative; top: -3px">' + choice[1] + '</span>')
          .find('input').css({
            'padding': '0.5em',
            'cursor': 'pointer',
            'margin-left': '-17px' }).end()
          .change(function () {
            // enable 'Reset' button if any checkbox is selected
            $resetButton.find('a').attr('disabled', $('.resetChoice:checked').length === 0);
          });
        $resetWrapper.append($checkbox);
      });

      // add 'Reset' button
      var $resetButton = $('<div style="text-align: center; margin-top: 15px"><a href="#" class="btn_blue" style="width:100px" disabled="true">Reset</a></div>');
      $resetButton.click(function () {
        $('.resetChoice:checked').each(function () {
          var $this = $(this);
          window.uipp_analytics('uipp-data-reset', $this.data('name'));
          switch ($this.data('name')) {
          case 'all': window._resetConfig(); break;
          case 'history': delete window.config.history; break;
          case 'notes': delete window.config.planetNotes; break;
          case 'planet-info': delete window.config.players; window.config.lastPlayersUpdate = 0; break;
          }
          window._saveConfig();
          window.location.reload();
        });
      });

      $resetWrapper.append($resetButton);
      $wrapper.append($resetWrapper);
      window._insertHtml($wrapper);
    });
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
