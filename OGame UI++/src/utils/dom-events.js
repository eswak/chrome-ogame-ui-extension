'use strict';

var handlers = []; // [{selector, callback}]
function mutationHandler() {
  // console.info ('mutationHandler');
  handlers.forEach(function (handler) {
    $(handler.selector + ':not(.enhanced)').each(function (idx, element) {
      $(this).addClass('enhanced');
      handler.callback.call(this, idx, element);
    });
  });
}

window._enhanceOnceOnDomChange = function (selector, callback) {
  handlers.push({ selector: selector, callback: callback });
  mutationHandler();
};

var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var myObserver = new MutationObserver(mutationHandler);
var obsConfig = {
  childList: true,
  characterData: true,
  attributes: true,
  subtree: true,
  attributeOldValue: false,
  characterDataOldValue: false
};
setTimeout(function () {
  myObserver.observe(document.body, obsConfig);
});
