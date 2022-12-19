'use strict';

window._addLinkTabs = function _addLinkTabs() {
  var universe = $('[name="ogame-universe"]').attr('content');
  var serverLang = universe.split('-')[1].split('.')[0];
  var serverNum = universe.split('-')[0].replace('s', '');
  var playerName = $('[name="ogame-player-name"]').attr('content');
  window.config.links = window.config.links || {
    TrashSim: 'https://trashsim.universeview.be?utm_source=uipp&utm_medium=browser-extension&utm_campaign=default-link',
    TradeCalc: 'http://proxyforgame.com/us/ogame/calc/trade.php'
  };

  function _getLink(template) {
    return template
      .replace('{serverLang}', serverLang)
      .replace('{serverNum}', serverNum)
      .replace('{playerName}', playerName);
  }

  // add entries in menu
  var i = 0;
  for (var key in window.config.links) {
    var $entry = $(
      [
        '<li style="margin-top:' + (i === 0 ? '10' : '0') + 'px;" class="customlink' + ++i + '">',
        '<a class="menubutton" href="' +
          _getLink(window.config.links[key]) +
          '" ' +
          (window.config.links[key].indexOf('://') !== -1 ? 'target="_blank"' : '') +
          '>',
        '<span class="textlabel" style="color:white">' + key + '</span>',
        '</a>',
        '</li>'
      ].join('')
    );
    $('#menuTable').append($entry);
  }
};

window._removeLink = function _removeLink(key, element) {
  delete window.config.links[key];
  window._saveConfig();

  var $el = $(element);
  $el.parent().remove();
};

window._addLink = function _addLink() {
  var label = window.prompt('Link label ?');
  var url = window.prompt('URL ?');

  if (label && url) {
    window.config.links[label] = url;
    window._saveConfig();
    document.location.reload();
  }
};
