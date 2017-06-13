var fn = function () {
  'use strict';
  window._parseResearchTab = function _parseResearchTab() {
    if (document.location.href.indexOf('research') === -1) {
      return;
    }

	var $d115 = $('#details115 span.level');
	if ($d115.length > 0) {
		var $combustionDrive = $d115[0].innerText.match(/\d+/g)
		if ($combustionDrive.length > 0) {
			var combustionDrive = $combustionDrive[0]
			if (!config.combustionDrive || config.combustionDrive !== combustionDrive) {
				config.combustionDrive = combustionDrive;
				_saveConfig(config);
				console.log('saving combustionDrive='+combustionDrive);
			};
		};
	};
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
