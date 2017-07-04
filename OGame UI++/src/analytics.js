var fn = function () {
  window._setupAnalytics = function _setupAnalytics () {
    /* eslint-disable */
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    /* eslint-enable */

    window.ga('create', 'UA-49724615-4', 'auto');
    window.ga('send', 'pageview');

    window.uipp_analytics = uipp_analytics;

    function uipp_analytics (eventKey, eventValue) {
      window.ga('send', 'event', eventKey, eventValue);
    }

    // push stats once a day
    var today = new Date().toISOString().substring(0, 10);
    if (!window.config.lastStatPush || window.config.lastStatPush !== today) {
      window.config.lastStatPush = today;
      window._saveConfig();

      var playerId = $('[name=ogame-player-id]').attr('content');
      var history = window.config.history[playerId];
      var planetNotes = 0;
      for (var coords in window.config.planetNotes) {
        if (window.config.planetNotes[coords]) {
          planetNotes++;
        }
      }

      // meta stats
      window.uipp_analytics('meta-ogame-universe', $('[name=ogame-universe]').attr('content').split('.')[0]);

      // extension usage stats
      if (history) {
        window.uipp_analytics('uipp-history-entries', Object.keys(history).length);
      }
      window.uipp_analytics('uipp-planet-notes', planetNotes);
      window.uipp_analytics('uipp-trade-rate', window.config.tradeRate.join(' / '));
    }
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
