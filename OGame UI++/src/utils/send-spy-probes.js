var fn = function () {
  'use strict';
  window._spy = function (galaxy, system, position) {
    $.ajax('?page=minifleet&ajax=1', {
      data: {
        mission: 6,
        galaxy: galaxy,
        system: system,
        position: position,
        type: 1,
        shipCount: window.constants.espionage,
        token: window.miniFleetToken
      },
      dataType: 'json',
      type: 'POST',
      success: function (a) {
        if (a.response.success) {
          $('#planet_' + galaxy + '_' + system + '_' + position + ' .icon_eye').addClass('disabled');
          window.uipp_analytics('uipp-spy', 'success');
        } else {
          window.fadeBox(a.response.message, true);
          window.uipp_analytics('uipp-spy', 'failed');
        }

        window.miniFleetToken = a.newToken;
      }
    });
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
