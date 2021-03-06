var fn = function () {
  'use strict';
  var _cachedResources = null;

  window.uipp_getResourcesInFlight = function uipp_getResourcesInFlight () {
    if (_cachedResources) {
      return _cachedResources;
    }

	_cachedResources = { metal: 0, crystal: 0, deuterium: 0 };

	var missions = [];
	$('#eventContent .tooltip.tooltipClose').each(function () {
		var $tooltip = $($(this).attr('title'));
		var $tr = $(this).parent().parent();

		var trCount = $tooltip.find('tr').length;
		var entry = {
		  id: Number($tr.attr('id').replace('eventRow-', '')),
		  type: Number($tr.attr('data-mission-type')),
		  metal: window._gfNumberToJsNumber($tooltip.find('tr:nth-child(' + (trCount - 2) + ') td').last().text()) || 0,
		  crystal: window._gfNumberToJsNumber($tooltip.find('tr:nth-child(' + (trCount - 1) + ') td').last().text()) || 0,
		  deuterium: window._gfNumberToJsNumber($tooltip.find('tr:nth-child(' + trCount + ') td').last().text()) || 0,
		  from: $tr.find('.coordsOrigin a').text().trim(),
		  to: $tr.find('.destCoords a').text().trim(),
		  nShips: $tr.find('.detailsFleet').text().trim(),
		  returnMission: $tr.attr('data-return-flight') === 'true'
		};

		if (entry.returnMission) {
		  var to = entry.to;
		  entry.to = entry.from;
		  entry.from = to;
		}

		missions.push(entry);
	});


	// remove return missions
	missions = missions.filter(function (mission) {
		var isReturnMissionDuplicate = false;
		missions.forEach(function (otherMission) {
		  if (
			mission.returnMission &&
			otherMission.from === mission.to &&
			otherMission.to === mission.from &&
			otherMission.nShips === mission.nShips &&
			otherMission.metal === mission.metal &&
			otherMission.crystal === mission.crystal &&
			otherMission.deuterium === mission.deuterium
		  ) {
			isReturnMissionDuplicate = true;
		  }
		});
		return !isReturnMissionDuplicate;
	});

	// remove expedition's first entry missions (date of reaching expedition place)
	// they make the resources count twice if for some reason someone sends resources
	// aboard on expedition (another entry is present for the end of expedition)
	var missionIds = missions.map(function (e) { return e.id });
	missions = missions.filter(function (mission) {
		var isReturnMissionDuplicate = false;
		if (mission.type !== 15 || mission.returnMission) {
			return true;
		}

		var hasNextMission = missionIds.indexOf(mission.id + 1) !== -1;
		return !hasNextMission;
	});

	missions.forEach(function (mission) {
		_cachedResources.metal += mission.metal;
		_cachedResources.crystal += mission.crystal;
		_cachedResources.deuterium += mission.deuterium;
	});

	return _cachedResources;
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
