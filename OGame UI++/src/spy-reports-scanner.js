var fn = function () {
  'use strict';
  window._addSpyReportsScannerInterval = function _addSpyReportsScannerInterval() {
    if (document.location.href.indexOf('messages') === -1) {
      return;
    }

    setInterval(function () {
      var $message = $('.ui-dialog');

      // only parse french spy reports
      if ($message.find('.ui-dialog-title').text().indexOf('Rapport d`espionnage de') === -1) {
        return;
      }

      $message.addClass('enhanced');
      var isInactive = $message.find('.status_abbr_inactive');
      var isLongInactive = $message.find('.status_abbr_longinactive');
      if (isInactive.length === 0 && isLongInactive.length === 0) {
        return;
      }

      var $messageContent = $message.find('.showmessage:not(.enhanced)');
      if ($messageContent.length < 1) {
        return;
      }

      $messageContent.addClass('enhanced');

      var energy = $message.find('.material.spy').find('.areadetail').text().trim().replace('\n', '').replace(' ', '').replace('Métal', '').replace('Cristal', '').replace('Deutérium', '').replace('Energie', '').split(':')[4].trim();
      var index = 0;
      var nofleet = null;
      var nodef = null;
      var levels = null;
      $message.find('.fleetdefbuildings.spy').each(function () {
        index++;
        if (index === 1) {
          nofleet = $(this).text().length < 12;
        } else if (index === 2) {
          nodef = $(this).text().replace('Missile d`interception', '').length < 12;
        } else if (index === 3) {
          levels = $(this).text().replace('Bâtiment', '').replace(/Centrale.*/, '').replace('Mine de métal', ':').replace('Mine de cristal', ':').replace('Synthétiseur de deutérium', ':').split(':');
        }
      });

      var coords = $message.find('.material.spy').text().split('[')[1].split(']')[0].split(':');
      var strlevels = levels ? (levels[1] ? levels[1] : '0') + ' / ' + (levels[2] ? levels[2] : '0') + ' / ' + (levels[3] ? levels[3] : '0') : null;
      var note = '';
      if (nofleet === null || nodef === null) {
        note = 'Rapport d\'espionnage incomplet';
      } else if (nofleet === false || nodef === false) {
        note = 'Planète défendue';
      } else {
        note = energy;
        if (strlevels) {
          note += ' - ' + strlevels;
        }
      }

      window.editNote(coords[0], coords[1], coords[2], note);
    }, 100);
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
