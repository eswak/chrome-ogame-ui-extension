var fn = function () {
  'use strict';
  window._parseResearchTab = function _parseResearchTab() {
    if (document.location.href.indexOf('research') === -1) {
      return;
    }

	var $d115 = $('#details115 span.level');
	if ($d115.length > 0) {
		var $cumbustionDrive = $d115[0].innerText.match(/\d+/g)
		if ($cumbustionDrive.length > 0) {
			var cumbustionDrive = $cumbustionDrive[0]
			if (!config.cumbustionDrive || config.cumbustionDrive !== cumbustionDrive) {
				config.cumbustionDrive = cumbustionDrive;
				_saveConfig(config);
				console.log('saving cumbustionDrive='+cumbustionDrive);
			};
		};
	};
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
