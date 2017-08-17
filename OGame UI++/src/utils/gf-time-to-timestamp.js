var fn = function () {
  'use strict';
  window._gfTimeToTimestamp = function _gfTimeToTimestamp (str) {
    var parts = str.split(' ').reverse();
    var timestamp = Date.now();
    var timeOffsets = {
      second: 1e3,
      minute: 6e4,
      hour: 36e5,
      day: 24 * 36e5,
      week: 7 * 24 * 36e5,
      month: 30 * 24 * 36e5,
      year: 365 * 24 * 36e5
    };
    var timeUnits = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'];
    var timeUnitsStr = timeUnits.map(function (unit) {
      return window.LocalizationStrings.timeunits.short[unit];
    });
    var timeUnit = 0;

    parts.forEach(function (part) {
      while(timeUnit < timeUnits.length && part.indexOf(timeUnitsStr[timeUnit]) === -1) {
        timeUnit++;
      }
      var count = Number(part.replace(timeUnitsStr[timeUnit], ''));

      if (timeUnits[timeUnit]) {
        timestamp += count * timeOffsets[timeUnits[timeUnit]];
      }

      timeUnit++; // required for same short time unit letters e.g. "1m 30m" (1 month + 30 minutes)
    });

    return timestamp;
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
