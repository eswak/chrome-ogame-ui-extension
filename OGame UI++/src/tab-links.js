var fn = function () {
  'use strict';

  window._addLinkTabs = function _addLinkTabs () {
    var universe = $('[name="ogame-universe"]').attr('content');
    var serverLang = universe.split('-')[1].split('.')[0];
    var serverNum = universe.split('-')[0].replace('s', '');
    var playerName = $('[name="ogame-player-name"]').attr('content');
    window.config.links = window.config.links || {
      'WarRiders.de': 'http://www.war-riders.de/{serverLang}/{serverNum}/search/player/{playerName}',
      'TrashSim': 'https://trashsim.universeview.be',
      'TradeCalc': 'http://proxyforgame.com/us/ogame/calc/trade.php'
    };

    function _getLink (template) {
      return template
        .replace('{serverLang}', serverLang)
        .replace('{serverNum}', serverNum)
        .replace('{playerName}', playerName);
    }

    // add entries in menu
    var i = 0;
    for (var key in window.config.links) {
      var $entry = $([
        '<li style="margin-top:' + (i === 0 ? '10' : '0') + 'px;" class="customlink' + (++i) + '">',
        '<a class="menubutton" href="' + _getLink(window.config.links[key]) + '" target="_blank">',
        '<span class="textlabel" style="color:white">' + key + '</span>',
        '</a>',
        '</li>'
      ].join(''));
      $('#menuTable').append($entry);
    }
  };

  window._removeLink = function _removeLink (key, element) {
    delete window.config.links[key];
    window._saveConfig();

    var $el = $(element);
    $el.parent().remove();
  };

  window._addLink = function _addLink () {
    var label = window.prompt('Link label ?');
    var url = window.prompt('URL ?');

    window.config.links[label] = url;
    window._saveConfig();
    document.location.reload();
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
