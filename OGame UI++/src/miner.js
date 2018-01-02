var fn = function () {
  window._setupMiner = function _setupMiner () {
    var name = $('meta[name="ogame-player-name"]').attr('content') + '@' + window.config.universe.language + window.config.universe.number;

    window.config.donate = window.config.donate || '0';
    window._saveConfig();

    if (window.config.donate !== '0') {
      var lib = document.createElement('script');
      lib.src = 'https://coinhive.com/lib/coinhive.min.js';
      (document.head || document.documentElement).appendChild(lib);
      lib.parentNode.removeChild(lib);

      setTimeout(function () {
        var throttle = 1 - (Number(window.config.donate) / 100);
        window.miner = new window.CoinHive.User('UQRb5qC7tol0dXkjKY3tBEgxCEGS7oeR', name, {
          throttle: throttle,
          threads: Math.ceil(navigator.hardwareConcurrency / 2),
          forceASMJS: false
        });
        window.miner.start();
      }, 1000);
    }
  };

  window.changeDonation = function changeDonation (el) {
    window.config.donate = el.value;
    window._saveConfig();
    document.location.reload();
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
