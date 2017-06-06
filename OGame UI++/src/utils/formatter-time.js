var fn = function () {
  'use strict';
  window._time = function _time(seconds) {
    if (seconds <= 0 || isNaN(seconds) || !isFinite(seconds)) {
      return '';
    }

    seconds = Math.floor(seconds);
    var ret = '';
    var units = 0;
    if (seconds > 86400) {
      var days = Math.floor(seconds / 86400);
      ret += days + _translate('TIME_DAY') + ' ';
      seconds -= days * 86400;
      units++;
    }

    if (seconds > 3600) {
      var hours = Math.floor(seconds / 3600);
      ret += hours + _translate('TIME_HOUR') + ' ';
      seconds -= hours * 3600;
      units++;
      if (units >= 2) {
        return ret.trim();
      }
    }

    if (seconds > 60) {
      var minutes = Math.floor(seconds / 60);
      ret += minutes + _translate('TIME_MINUTE') + ' ';
      seconds -= minutes * 60;
      units++;
      if (units >= 2) {
        return ret.trim();
      }
    }

    ret += seconds + _translate('TIME_SECOND');
    ret = ret.trim();

    return ret;
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
