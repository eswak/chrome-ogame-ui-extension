var fn = function () {
  'use strict';
  var config = window._getConfig();

  // add tracking code
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  window.ga('create', 'UA-49724615-4', 'auto');
  window.ga('send', 'pageview');

  window.uipp_analytics = uipp_analytics;

  function uipp_analytics(eventKey, eventValue) {
    window.ga('send', 'event', eventKey, eventValue);
  }

  // push stats once a day
  var today = new Date().toISOString().substring(0, 10);
  if (!config.lastStatPush || config.lastStatPush !== today) {
    config.lastStatPush = today;
    window._saveConfig(config);

    var playerId = $('[name=ogame-player-id]').attr('content');
    var history = config.history[playerId];
    var planetNotes = 0;
    for (var coords in config.planetNotes) {
      if (config.planetNotes[coords]) {
        planetNotes++;
      }
    }

    // meta stats
    uipp_analytics('meta-ogame-universe', $('[name=ogame-universe]').attr('content').split('.')[0]);

    // extension usage stats
    uipp_analytics('uipp-history-entries', Object.keys(history).length);
    uipp_analytics('uipp-planet-notes', planetNotes);
    uipp_analytics('uipp-trade-rate', config.tradeRate.join(' / '));
  }
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
