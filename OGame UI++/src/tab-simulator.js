var fn = function () {
  'use strict';
  window._addTabSimulator = function _addTabSimulator () {
    var $simEntry = $('<li class="sim enhanced"><span class="menu_icon"><div class="customMenuEntry3 menuImage fleet1"></div></span><a class="menubutton" href="https://trashsim.universeview.be/" accesskey="" target="_blank" onclick="uipp_analytics(\'uipp-tab-click\', \'simulator\');"><span class="textlabel enhancement">' + window._translate('MENU_FIGHTSIM') + '</span></a></li>');
    $('#menuTable').append($simEntry);
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
