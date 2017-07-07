var fn = function () {
  'use strict';
  window._num = function _num (n, increment) {
    // ogame number formatter
    if (!increment) {
      return window.gfNumberGetHumanReadable(n, true, 3);
    }

    var id = Math.random().toString(36).replace('.', '');
    var start = Date.now();
    var interval = setInterval(function () {
      var $el = $('#number-' + id);
      if (!$el) {
        clearInterval(interval);
        return;
      }

      var secondsSinceDisplay = Math.floor((Date.now() - start) / 1000);
      $el.text(window.gfNumberGetHumanReadable(n + secondsSinceDisplay * increment, true, 3));
    }, 100);

    return '<span id="number-' + id + '"></span>';
  };

  window.uipp_diff = function (diff, isPercent, colored) {
    if (colored !== false) {
      colored = true;
    }

    var str = diff.toString();
    if (str[0] === '-') {
      return '<span' + (colored ? ' style="color:#d43635"' : '') + '>' + str + (isPercent ? '%' : '') + '</span>';
    } else {
      return '<span' + (colored ? ' style="color:#9c0"' : '') + '>+' + str + (isPercent ? '%' : '') + '</span>';
    }
  };

  window.uipp_scoreHumanReadable = function (num) {
    var sign = 1;
    if (num < 0) {
      num = -num;
      sign = -1;
    } else if (num === 0)
      return 0;
    var n = Math.max(0, Math.ceil(Math.log10(num)) - 1);
    var prefixes = ['','k','M','G','T','P','E','Z','Y'];
    var dividers = [1,1e3,1e6,1e9,1e12,1e15,1e18,1e21,1e24];
    var idx = Math.floor(n / 3);
    var mul = ([100,10,1])[n % 3];
    if (n >= prefixes.length * 3) {
      mul = 1;
      idx = prefixes.length - 1;
    }
    var pref = prefixes[idx];
    return Math.round(num / dividers[idx] * mul) / mul * sign + pref;
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
