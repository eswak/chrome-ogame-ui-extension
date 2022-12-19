'use strict';
window._addExpeditionHelperInterval = function _addExpeditionHelperInterval() {
  setInterval(function () {
    var $el = $('form#shipsChosen:not(.enhanced-expedition)');

    if ($el.length) {
      $el.addClass('enhanced-expedition');

      var topScore = 0;
      for (var playerId in config.players) {
        var player = config.players[playerId];
        if (player.globalPosition === '1') {
          topScore = Number(player.globalScore);
        }
      }

      var maxExpeditionPoints = 25000;
      if (topScore < 100000000) maxExpeditionPoints = 21000;
      if (topScore < 75000000) maxExpeditionPoints = 18000;
      if (topScore < 50000000) maxExpeditionPoints = 15000;
      if (topScore < 25000000) maxExpeditionPoints = 12000;
      if (topScore < 5000000) maxExpeditionPoints = 9000;
      if (topScore < 1000000) maxExpeditionPoints = 6000;
      if (topScore < 100000) maxExpeditionPoints = 2500;

      var shipPoints = {
        fighterLight: 20,
        fighterHeavy: 50,
        cruiser: 135,
        battleship: 300,
        interceptor: 350,
        bomber: 375,
        destroyer: 550,
        deathstar: 45000,
        reaper: 700,
        explorer: 115,

        transporterSmall: 20,
        transporterLarge: 60,
        colonyShip: 150,
        recycler: 80,
        espionageProbe: 5
      };

      $el
        .find('#technologies')
        .append(
          [
            '<div style="position: absolute;bottom: 3px;right: 17px; cursor:pointer" onclick="uipp_autoFillExpedition()">',
            '<span class="enhancement"><span id="uipp-current-expedition-points"></span> / ' +
              maxExpeditionPoints +
              '</span>',
            '&nbsp<span id="uipp-current-expedition-points-percent">(0%)</span>',
            '<img src="' + uipp_images.expedition + '" style="height:26px; vertical-align: -8px; margin-left: 5px;"/>',
            '</div>'
          ].join('')
        );

      setInterval(function () {
        var currentPoints = 0;
        var shipsSelected = {
          fighterLight: Number($('.fighterLight input[type=text]').val()),
          fighterHeavy: Number($('.fighterHeavy input[type=text]').val()),
          cruiser: Number($('.cruiser input[type=text]').val()),
          battleship: Number($('.battleship input[type=text]').val()),
          interceptor: Number($('.interceptor input[type=text]').val()),
          bomber: Number($('.bomber input[type=text]').val()),
          destroyer: Number($('.destroyer input[type=text]').val()),
          deathstar: Number($('.deathstar input[type=text]').val()),
          reaper: Number($('.reaper input[type=text]').val()),
          explorer: Number($('.explorer input[type=text]').val()),

          transporterSmall: Number($('.transporterSmall input[type=text]').val()),
          transporterLarge: Number($('.transporterLarge input[type=text]').val()),
          colonyShip: Number($('.colonyShip input[type=text]').val()),
          recycler: Number($('.recycler input[type=text]').val()),
          espionageProbe: Number($('.espionageProbe input[type=text]').val())
        };
        for (var key in shipsSelected) {
          currentPoints += shipsSelected[key] * shipPoints[key];
        }
        $('#uipp-current-expedition-points').text(currentPoints);

        var percent = Math.round((100 * currentPoints) / maxExpeditionPoints);
        var $percent = $('#uipp-current-expedition-points-percent');
        $percent.text('(' + percent + '%)');
        if (percent >= 100) {
          $percent.css('color', '#99CC00');
        } else if (percent >= 70) {
          $percent.css('color', '#d29d00');
        } else {
          $percent.css('color', '#d43635');
        }
      }, 100);

      window.uipp_autoFillExpedition = function () {
        var nExplorers = Number($('.explorer .amount').attr('data-value'));
        if (nExplorers > 0) {
          $('input[name=explorer]').val(1);
          $('input[name=explorer]').keyup();
        }
        var nReapers = Number($('.reaper .amount').attr('data-value'));
        if (nReapers > 0) {
          $('input[name=reaper]').val(1);
          $('input[name=reaper]').keyup();
        }
        var nProbe = Number($('.espionageProbe .amount').attr('data-value'));
        if (nProbe > 0) {
          $('input[name=espionageProbe]').val(1);
          $('input[name=espionageProbe]').keyup();
        }
        var maxBigTransport = Math.ceil(maxExpeditionPoints / shipPoints.transporterLarge);
        if (nExplorers > 0) {
          maxBigTransport -= 2; // remove 2 cargo because expedition points are given by explorer
        }
        if (nReapers > 0) {
          maxBigTransport -= 11; // remove 11 cargo because expedition points are given by reaper
        }

        var ownedBigTransport = Number($('.transporterLarge .amount').attr('data-value'));

        var nBigTransport = Math.min(maxBigTransport, ownedBigTransport);
        $('input[name=transporterLarge]').val(nBigTransport);
        $('input[name=transporterLarge]').keyup();
      };
    }
  }, 100);
};
