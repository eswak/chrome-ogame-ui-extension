'use strict';
window._time = function _time(seconds, increment) {
  if (!increment) {
    return _format(seconds);
  }

  var id = Math.random().toString(36).replace('.', '');
  var start = Date.now();
  var interval = setInterval(function () {
    var $el = $('#time-' + id);
    if (!$el) {
      clearInterval(interval);
      return;
    }

    var secondsSinceDisplay = Math.floor((Date.now() - start) / 1000);
    var actuatedSeconds = seconds + secondsSinceDisplay * increment;
    if (actuatedSeconds < 0) {
      actuatedSeconds = 0;
    }

    actuatedSeconds = _format(actuatedSeconds);
    if ($el.text() !== actuatedSeconds) $el.text(actuatedSeconds);
  }, 100);

  return '<span id="time-' + id + '"></span>';
};

function _format(seconds) {
  if (seconds < 0 || isNaN(seconds) || !isFinite(seconds)) {
    return '';
  }

  seconds = Math.floor(seconds);
  var ret = '';
  var units = 0;
  if (seconds > 86400) {
    var days = Math.floor(seconds / 86400);
    ret += days + window._translate('TIME_DAY') + ' ';
    seconds -= days * 86400;
    units++;
  }

  if (seconds > 3600) {
    var hours = Math.floor(seconds / 3600);
    ret += hours + window._translate('TIME_HOUR') + ' ';
    seconds -= hours * 3600;
    units++;
    if (units >= 2) {
      return ret.trim();
    }
  }

  if (seconds > 60) {
    var minutes = Math.floor(seconds / 60);
    ret += minutes + window._translate('TIME_MINUTE') + ' ';
    seconds -= minutes * 60;
    units++;
    if (units >= 2) {
      return ret.trim();
    }
  }

  ret += seconds + window._translate('TIME_SECOND');
  ret = ret.trim();

  return ret;
}
