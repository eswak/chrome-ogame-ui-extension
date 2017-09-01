var fn = function () {
  'use strict';

  var handlers = []; // [{selector, callback}]
  function mutationHandler () {
    // console.info ('mutationHandler');
    handlers.forEach (function (handler) {
      $(handler.selector + ':not(.enhanced2)').each(function (idx, element) {
        $(this).addClass('enhanced2');
        handler.callback.call(this, idx, element);
      });
    });
  }

  window._enhanceOnceOnDomChange = function (selector, callback) {
    handlers.push({ selector: selector, callback: callback });
    mutationHandler();
  };

  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  var myObserver = new MutationObserver (mutationHandler);
  var obsConfig = { childList: true, characterData: true, attributes: true, subtree: true, attributeOldValue: false, characterDataOldValue: false };
  myObserver.observe (document.body, obsConfig);
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
