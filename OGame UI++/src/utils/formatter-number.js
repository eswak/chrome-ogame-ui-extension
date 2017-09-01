var fn = function () {
  'use strict';
  window._num = function _num (n, increment, max) {
    if (n && n.map) {
      return n.map(function (num) {
        return window._num(num);
      });
    }

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
      var updatedNumber = n + secondsSinceDisplay * increment;
      if (max && updatedNumber > max) { // if full
        setTextIfChanged($el, window.gfNumberGetHumanReadable(n, true, 3));
        $el.css('color', '#d43635');
      } else if (max && updatedNumber > (max - increment * 3 * 3600)) { // if less than 3h to full
        setTextIfChanged($el, window.gfNumberGetHumanReadable(updatedNumber, true, 3));
        $el.css('color', '#d29d00');
      } else {
        setTextIfChanged($el, window.gfNumberGetHumanReadable(updatedNumber, true, 3));
      }
    }, 100);

    return '<span id="number-' + id + '"></span>';
  };

  function setTextIfChanged ($el, text) {
    if ($el.text() !== text)
      $el.text(text);
  }

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
    var prefixes = ['','k','M','B','T','P','E','Z','Y'];
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
