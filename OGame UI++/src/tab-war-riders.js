var fn = function () {
  'use strict';
  window._addTabWarRiders = function _addTabWarRiders() {
    var universe = $('[name="ogame-universe"]').attr('content');
    var serverLang = universe.split('-')[1].split('.')[0];
    var serverNum = universe.split('-')[0].replace('s', '');
    var playerName = $('[name="ogame-player-name"]').attr('content');

    var $warRidersEntry = $('<li class="sim enhanced"><span class="menu_icon"><div class="customMenuEntry3 menuImage fleet1"></div></span><a class="menubutton" href="http://www.war-riders.de/' + serverLang + '/' + serverNum + '/search/player/' + playerName + '" accesskey="" target="_blank" onclick="uipp_analytics(\'uipp-tab-click\', \'war-riders\');"><span class="textlabel enhancement">WarRiders.de</span></a></li>');
    $('#menuTable').append($warRidersEntry);
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
