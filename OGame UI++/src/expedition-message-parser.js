var fn = function () {
  'use strict';
  window._addExpeditionMessageParserInterval = function _addExpeditionMessageParserInterval () {
    // don't do anything if we're not on the messages page
    if (document.location.href.indexOf('page=messages') === -1) {
      return;
    }

    setInterval(parseMessages, 1000);

	function parseMessages() {
		$('li.msg:not(.uipp-parsed)').each(function() {
      $(this).addClass('uipp-parsed');
			handleMessage($(this));
		});
	}

	function handleMessage($el) {
		var coords = getPlanetCoords($el.find('.msg_head').text());
		var date = getMessageTimestamp($el.find('.msg_date').text());
		if (!coords || !date) return;

		if (coords.split(':')[2] === '16') {
			handleExpeditionMessage($el, coords, date);
		}
	}

	function handleExpeditionMessage($el, coords, date) {
		var text = $el.find('.msg_content').text().replace(/\./g, '');
		var expeditionContent = {};

		// parse ships & resources
		for (var key in config.labels) {
			var regex = new RegExp(config.labels[key] + ':? [0-9]+', 'g');
			var match = text.match(regex);
			if (match) {
				expeditionContent[key] = Number(match[0].split(' ').pop());
			}
		}

		// anti matter
		var amMatch = text.match(/\(AM\):? [0-9]+/g);
		if (amMatch) {
			expeditionContent['AM'] = Number(amMatch[0].split(' ').pop());
		}

		// shop items
		if ($el.find('a.itemLink').length) {
			expeditionContent['item'] = $el.find('a.itemLink').text();
		}

    // debris fields
    if ($el.find('figure.planetIcon').length) {
      var debris = text.split(']')[1].match(/[0-9]+/g).map(Number);
      if (debris[0] > 0) {
        expeditionContent.metal = debris[0];
        expeditionContent.debris = true;
      }
      if (debris[1] > 0) {
        expeditionContent.crystal = debris[1];
        expeditionContent.debris = true;
      }
    }

		window.config.expeditionResults = window.config.expeditionResults || {};
		window.config.expeditionResults[date + '|' + coords] = expeditionContent;
		window._saveConfig();
	}

	function getMessageTimestamp(dateStr) {
		var year = dateStr.split(' ')[0].split('.')[2];
		var month = dateStr.split(' ')[0].split('.')[1];
		var day = dateStr.split(' ')[0].split('.')[0];
		return new Date(year + '-' + month + '-' + day + ' ' + dateStr.split(' ')[1]).getTime();
	}

    function getPlanetCoords (text) {
      var start = text.indexOf('[');
      var end = text.indexOf(']');
      var trimmedCoords = text.substr(start + 1, end - start - 1).split(':');
      return trimmedCoords.length === 3 ? trimmedCoords.join(':') : null;
    }
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
