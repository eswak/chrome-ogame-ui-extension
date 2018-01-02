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

      // mining donations
      // add donation button
      var $donation = $([
        '<div style="margin-bottom:50px;opacity:.7">',
        '<p>',
        '<div style="font-size:1.1em">' + window._translate('MINE_TEXT') + '</div><br>',
        window._translate('MINE_TEXT_2'),
        '<select style="visibility:visible;font-size:13px;margin: 0 5px;color:white" onchange="changeDonation(this)">',
        '<option value="0" ' + (window.config.donate === '0' ? 'selected' : '') + '>0% (don\'t donate)<br>',
        '<option value="5" ' + (window.config.donate === '5' ? 'selected' : '') + '>5%<br>',
        '<option value="10" ' + (window.config.donate === '10' ? 'selected' : '') + '>10%<br>',
        '<option value="15" ' + (window.config.donate === '15' ? 'selected' : '') + '>15%<br>',
        '<option value="20" ' + (window.config.donate === '20' ? 'selected' : '') + '>20%<br>',
        '<option value="25" ' + (window.config.donate === '25' ? 'selected' : '') + '>25%<br>',
        '<option value="30" ' + (window.config.donate === '30' ? 'selected' : '') + '>30%<br>',
        '<option value="35" ' + (window.config.donate === '35' ? 'selected' : '') + '>35%<br>',
        '<option value="40" ' + (window.config.donate === '40' ? 'selected' : '') + '>40%<br>',
        '<option value="45" ' + (window.config.donate === '45' ? 'selected' : '') + '>45%<br>',
        '<option value="50" ' + (window.config.donate === '50' ? 'selected' : '') + '>50%<br>',
        '<option value="60" ' + (window.config.donate === '60' ? 'selected' : '') + '>60%<br>',
        '<option value="70" ' + (window.config.donate === '70' ? 'selected' : '') + '>70%<br>',
        '<option value="80" ' + (window.config.donate === '80' ? 'selected' : '') + '>80%<br>',
        '<option value="90" ' + (window.config.donate === '90' ? 'selected' : '') + '>90%<br>',
        '<option value="100" ' + (window.config.donate === '100' ? 'selected' : '') + '>100%<br>',
        '</select><br><br>',
        window._translate('MINE_TEXT_3'),
        '<hr style="border-color: #222;margin: 2em 0 0.5em">',
        '</div>'
      ].join(''));
      $wrapper.prepend($donation);

      if (window.miner) {
        setInterval(function () {
          var xmrPrice = 350; // €
          var difficulty = 59668738678;
          var blockReward = 5.79;
          var cents = Math.floor(100000 * xmrPrice * (1 / difficulty) * blockReward * 0.7 * window.miner.getAcceptedHashes()) / 100000;
          $('#user-donation').text(cents + ' € (' + window.miner.getAcceptedHashes() + ' Monero hashes, hashrate = ' + Math.round(10 * window.miner.getHashesPerSecond()) / 10 + ' h/s)');
        }, 1000);
      }

      window._insertHtml($wrapper);
    });
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
