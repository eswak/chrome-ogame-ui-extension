var fn = function () {
  'use strict';
  window._addPlanetsNotes = function _addPlanetsNotes () {
    $('#contentWrapper').bind('DOMSubtreeModified', function () {
      $('span.msg_title').each(function (idx, element) {
        if ($(this).hasClass('uipp')) return;
        else $(this).addClass('uipp');

        var coordinates = getPlanetCoords($(element).text());
        if (coordinates === null) return;
        var note = window.config && window.config.planetNotes && window.config.planetNotes[coordinates] || '';
        $(this).append('<style scoped>::-webkit-input-placeholder{color:rgba(255, 255, 255, 0.1)}</style>');
        $(this).append($('<input value="' + note + '" onkeyup="_editNote(' + coordinates.split(':').join(',') + ', this.value); return false;" type="text" placeholder="Empty planet note"/>')
          .css({
            'margin-left': '6px',
            'box-sizing': 'border-box',
            'border': 'none',
            'border-bottom': '1px solid #3a3a3a',
            'background-color': 'transparent',
            'color': '#6f9fc8',
            'width': '30%',
            'font-size': 'inherit',
            'font-family': 'inherit',
            'box-shadow': '0 0 0 0',
            'height': '1.2em',
            'padding-left': '0.2em'
          })
        );
      });
    });

    function getPlanetCoords (text) {
      var start = text.indexOf('[');
      var end = text.indexOf(']');
      var trimmedCoords = text.substr(start + 1, end - start - 1).split(':');
      return trimmedCoords.length === 3 ? trimmedCoords.join(':') : null;
    }
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
