var fn = function () {
  'use strict';
  window._addPlanetsNotes = function _addPlanetsNotes () {
    // don't do anything if we're not on the messages page
    if (document.location.href.indexOf('page=messages') === -1) {
      return;
    }

    window._enhanceOnceOnDomChange ('span.msg_title', function (idx, element) {
      var $this = $(this);
      console.log('enhance span.msg_title');
      // don't enhance our-planets-activty
      if ($this.parent().parent().find('.espionageDefText').length !== 0) {
        return;
      }

      // only show for messages that have a spy icon (not for expeditions & transports)
      if ($this.parent().parent().find('.icon_espionage').length === 0) {
        return;
      }

      var coordinates = _getPlanetCoords($(element).text());
      if (coordinates === null) return;
      var note = window.config && window.config.planetNotes && window.config.planetNotes[coordinates] || '';

      // automatically add a note for planets that don't have any and for which we see
      // the mine levels
      var energy = $('.detail_msg .resourceIcon.energy').next().text().replace(/\./g, '');
      var metalLevel = $('.detail_msg .building1').parent().next().next().text();
      var crystalLevel = $('.detail_msg .building2').parent().next().next().text();
      var deuteriumLevel = $('.detail_msg .building3').parent().next().next().text();

      if (energy && metalLevel && crystalLevel && deuteriumLevel && !note) {
        note = energy + ' - ' + metalLevel + ' / ' + crystalLevel + ' / ' + deuteriumLevel;
        window._editNote(
          coordinates.split(':')[0],
          coordinates.split(':')[1],
          coordinates.split(':')[2],
          note
        );
      }

      // add note text field
      $this.append('<style scoped>::-webkit-input-placeholder{color:#AB7AFF; opacity:0.4;}</style>');
      $this.append($('<input class="enhancement uipp-spynote" value="' + note + '" onkeyup="_editNote(' + coordinates.split(':').join(',') + ', this.value); return false;" type="text" placeholder="Empty planet note"/>')
        .css({
          'width': '555px',
          'height': '19px',
          'margin': '5px 0',
          'padding': '0 5px',
          'font-weight': '400',
          'font-size': '12px',
          'color': '#AB7AFF',
          'background-color': 'transparent',
          'box-shadow': 'none',
          'border': '1px dashed #AB7AFF'
        })
      );
    });

    function _getPlanetCoords (text) {
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
