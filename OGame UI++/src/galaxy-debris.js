'use strict';
window._addGalaxyDebrisInterval = function _addGalaxyDebrisInterval() {
  if (document.location.href.indexOf('galaxy') === -1) {
    return;
  }

  setInterval(function () {
    // Regular planets debris
    for (var i = 1; i <= 15; i++) {
      var $el = $('.cellDebris [rel=debris' + i + ']:not(.enhanced)');
      if ($el.length === 0) {
        continue;
      }

      $el.addClass('enhanced');
      var debrisAmount = 0;
      $('#debris' + i + ' .debris-content').each(function (i, e) {
        debrisAmount += window._gfNumberToJsNumber(e.innerHTML.split(': ')[1]);
      });

      var style =
        'position: absolute; top: -3px; font-size: 11px; left: 0; text-align: center; width: 30px; text-shadow: black 0 0 3px, black 0 0 3px, black 0 0 3px, black 0 0 3px, black 0 0 3px, black 0 0 3px, black 0 0 3px, black 0 0 3px, black 0 0 3px;';
      $el.append(
        $('<div class="enhancement" style="' + style + '">' + uipp_scoreHumanReadable(debrisAmount) + '</div>')
      );
    }

    // Expedition debris
    $('.expeditionDebrisSlotBox:not(.enhanced)').each(function () {
      $(this).addClass('enhanced');

      var debrisAmount = 0;
      $('#debris16 .debris-content').each(function (i, e) {
        debrisAmount += window._gfNumberToJsNumber(e.innerHTML.split(': ')[1]);
      });

      var $el = $(this).find('div.name');
      $el.append($('<span class="enhancement">' + window.gfNumberGetHumanReadable(debrisAmount) + '</span>'));
    });
  }, 100);
};
