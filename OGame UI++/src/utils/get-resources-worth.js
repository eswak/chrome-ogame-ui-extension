var fn = function () {
  'use strict';

  window.uipp_getResourcesWorth = function uipp_getResourcesWorth () {
    var tradeRate = window.config.tradeRate;

    return {
      metal: (
        (Math.min(tradeRate[0], tradeRate[1], tradeRate[2]) / tradeRate[0]) *
        Math.max(tradeRate[0], tradeRate[1], tradeRate[2]) * 100
      ) / 100,
      crystal: (
        (Math.min(tradeRate[0], tradeRate[1], tradeRate[2]) / tradeRate[1]) *
        Math.max(tradeRate[0], tradeRate[1], tradeRate[2]) * 100
      ) / 100,
      deuterium: (
        (Math.min(tradeRate[0], tradeRate[1], tradeRate[2]) / tradeRate[2]) *
        Math.max(tradeRate[0], tradeRate[1], tradeRate[2]) * 100
      ) / 100
    };
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
