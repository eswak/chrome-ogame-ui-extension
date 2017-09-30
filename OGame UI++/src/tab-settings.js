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

      // language config
      $wrapper.append($([
        '<div style="padding: 10px 0" class="clearfix">',
        '<div style="float: left; line-height: 32px;padding-right: 10px;">' + window._translate('LANGUAGE') + ' : ' + '</div>',
        '<div>',
        '<select id="uipp-language" onchange="uipp_setLanguage()" style="visibility:visible;font-size:13px;vertical-align:-8px;">',
        '<option value="">---</option>',
        '<option value="en" ' + (window.config.language === 'en' ? 'selected' : '') + '>English</option>',
        '<option value="fr" ' + (window.config.language === 'fr' ? 'selected' : '') + '>Français</option>',
        '<option value="de" ' + (window.config.language === 'de' ? 'selected' : '') + '>Deutsch</option>',
        '<option value="es" ' + (window.config.language === 'es' ? 'selected' : '') + '>Español</option>',
        '<option value="tr" ' + (window.config.language === 'tr' ? 'selected' : '') + '>Türk</option>',
        '<option value="pl" ' + (window.config.language === 'pl' ? 'selected' : '') + '>Polski</option>',
        '</select>',
        '</div>',
        '</div>'
      ].join('')));

      window.uipp_setLanguage = function () {
        var lang = $('#uipp-language')[0].value || null;
        window.config.language = lang;
        window._saveConfig();
        document.location.reload();
      };

      // Feedback
      var $feedback = $('<div><hr style="border-color: #222;margin: 2em 0 0.5em;">' +
                        '<span style="font-size: 1.3em;">' + window._translate('FEEDBACK') + '</span></div>');
      $feedback.append([
        '<form><p style="margin-top: 10px;">',
        '<input id="name" name="name" value="' + $('head meta[name=ogame-player-name]').attr('content') + '" type="text" style="width: 11%;">',
        '<input id="comment" name="comment" type="text" placeholder="' + window._translate('FEEDBACK_PLACEHOLDER') + '"',
        'style="width:84%; margin-left: 5px;"></p>',
        '<div style="text-align: center; margin-top: 15px">',
        '<input id="send" type="submit" value="' + window._translate('SEND') + '" class="btn_blue" style="width:100px" disabled="true">',
        '<p id="result"></p>',
        '</div>',
        '</form>'].join(''));

      // enable 'Send' button if any text input is not empty
      $feedback.find('input').keyup(function () {
        var characters = $feedback.find('#name').val() + $feedback.find('#comment').val();
        $feedback.find('#send').attr('disabled', characters.length === 0);
      });
      var request;
      // bind to the submit event of our form
      $feedback.find('form').submit(function (event) {
        // abort any pending request
        if (request) request.abort();
        var $this = $(this);
        // serialize the data in the form
        var $inputs = $this.find('input, select, button, textarea');
        var serializedData = $this.serialize();
        // let's disable the inputs for the duration of the ajax request
        $inputs.prop('disabled', true);
        $this.find('#result').text('Sending...');
        request = $.ajax({
          url: 'https://script.google.com/macros/s/AKfycbx7QRXajP7lEtsh9LDUPcuY2psYP9igjQSRBghW0nQGP-2U-dPX/exec',
          type: 'post',
          data: serializedData,
          success: function () {
            $this.find('#result').html('Success - thank you 👍');
          },
          error: function (jqXHR, textStatus, errorThrown) {
            window.console.error(textStatus, errorThrown);
          },
          complete: function () {
            $inputs.prop('disabled', false); // reenable the inputs
          }
        });
        // prevent default posting of form
        event.preventDefault();
      });
      $wrapper.append($feedback);

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

      // Feedback
      var $feedback = $('<div><hr style="border-color: #222;margin: 2em 0 0.5em;">' +
                        '<span style="font-size: 1.3em;">' + window._translate('Feedback') + '</span></div>');
      $feedback.append([
        '<form><p style="margin-top: 10px;">',
        '<input id="name"    name="name"    type="text" placeholder="nickname" style="width: 6em;">',
        '<input id="comment" name="comment" type="text" placeholder="comment, suggestion, idea or greetings"',
        'style="width:80%; margin-left: 5px;"></p>',
        '<div style="text-align: center; margin-top: 15px">',
        '<input id="send" type="submit" value="Send" class="btn_blue" style="width:100px" disabled="true">',
        '<p id="result"></p>',
        '</div>',
        '</form>'].join(''));

      // enable 'Send' button if any text input is not empty
      $feedback.find('input').keyup(function () {
        var characters = $feedback.find('#name').val() + $feedback.find('#comment').val();
        $feedback.find('#send').attr('disabled', characters.length === 0);
      });
      var request;
      // bind to the submit event of our form
      $feedback.find('form').submit(function (event) {
        // abort any pending request
        if (request) request.abort();
        var $this = $(this);
        // serialize the data in the form
        var $inputs = $this.find('input, select, button, textarea');
        var serializedData = $this.serialize();
        // let's disable the inputs for the duration of the ajax request
        $inputs.prop('disabled', true);
        $this.find('#result').text('Sending...');
        request = $.ajax({
          url: 'https://script.google.com/macros/s/AKfycbx7QRXajP7lEtsh9LDUPcuY2psYP9igjQSRBghW0nQGP-2U-dPX/exec',
          type: 'post',
          data: serializedData,
          success: function () {
            $this.find('#result').html('Success - thank you 👍');
          },
          error: function (jqXHR, textStatus, errorThrown) {
            window.console.error(textStatus, errorThrown);
          },
          complete: function () {
            $inputs.prop('disabled', false); // reenable the inputs
          }
        });
        // prevent default posting of form
        event.preventDefault();
      });
      $wrapper.append($feedback);

      // Troubleshooting
      var $resetWrapper = $('<div><hr style="border-color: #222;margin: 2em 0 0.5em">' +
                            '<span style="font-size: 1.3em;">' + window._translate('TROUBLESHOOTING') + '</span></div>');
      $resetWrapper.append('<div style="margin-top: 10px; color: gray; text-align: justify;">' + window._translate('RESET_ALL_TEXT') + '<br><br>');
      window._translate('RESET_ALL_TEXT');
      [
        ['all', window._translate('RESET_ALL')],
        ['history', window._translate('RESET_HISTORY')],
        ['notes', window._translate('RESET_NOTES')],
        ['planet-info', window._translate('RESET_PLANETINFO')]
      ].forEach(function (choice, i) {
        var $checkbox = $('<div style="margin-left: 18px;' + (i === 0 ? 'margin-bottom:2em' : '') + '"> </div>').data('name', choice[0])
          .append('<input type="checkbox" class="resetChoice" id="reset-' + choice[0] + '">')
          .append('<label style="position: relative; top: -3px" for="reset-' + choice[0] + '">' + choice[1] + '</label>')
          .find('input').css({
            'padding': '0.5em',
            'cursor': 'pointer',
            'margin-left': '-17px' }).end()
          .change(function () {
            if (i === 0) {
              var checkAll = $(this).find('.resetChoice:checked').length;
              if (checkAll) {
                $resetWrapper.find('.resetChoice').prop('checked', true);
              } else {
                $resetWrapper.find('.resetChoice').prop('checked', false);
              }
            }
            // enable 'Reset' button if any checkbox is selected
            $resetButton.find('a').attr('disabled', $('.resetChoice:checked').length === 0);
          });
        $resetWrapper.append($checkbox);
      });

      // add 'Reset' button
      var $resetButton = $('<div style="text-align: center; margin-top: 15px"><a href="#" class="btn_blue" style="width:100px" disabled="true">' + window._translate('RESET') + '</a></div>');
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
