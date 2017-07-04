var fn = function () {
  'use strict';
  window._gfNumberToJsNumber = function _gfNumberToJsNumber (num) {
    // note: this won't work over 1000 billions
    var millionChar = window.gfNumberGetHumanReadable(1e6, true).replace('1', '');
    var billionChar = window.gfNumberGetHumanReadable(1e9, true).replace('1', '');

    var flags = {
      thousand: num.indexOf('.') !== -1 || num.indexOf(',') !== -1,
      million: num.indexOf(millionChar) !== -1,
      billion: num.indexOf(billionChar) !== -1
    };
    num = num.replace(billionChar, '').replace(millionChar, '');
    var decimalRegex = /[.,]/g;
    num = num.replace(decimalRegex, '.');
    var decimalMatches = num.match(decimalRegex);

    if (decimalMatches && decimalMatches.length > 1) {
      num = num.replace(decimalRegex, '');
    }

    num = Number(num);
    if (flags.billion) {
      return num * 1e9;
    } else if (flags.million) {
      return num * 1e6;
    } else if (flags.thousand) {
      return num * 1e3;
    } else {
      return num;
    }
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
