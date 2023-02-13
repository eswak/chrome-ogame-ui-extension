'use strict';
var _cachedInflightResources = null;

window.uipp_getResourcesInFlight = function uipp_getResourcesInFlight() {
  if (_cachedInflightResources) {
    return _cachedInflightResources;
  }

  _cachedInflightResources = { metal: 0, crystal: 0, deuterium: 0 };

  var missions = [];
  $('#eventContent .tooltip.tooltipClose').each(function () {
    var $tooltip = $($(this).attr('title'));
    var $tr = $(this).parent().parent();

    var trCount = $tooltip.find('tr').length;
    var offset = window.config.universe.lifeformSettings ? 0 : 1; // some universes have no food
    var entry = {
      id: Number($tr.attr('id').replace('eventRow-', '')),
      type: Number($tr.attr('data-mission-type')),
      metal:
        window._gfNumberToJsNumber(
          $tooltip
            .find('tr:nth-child(' + (trCount - 3 + offset) + ') td')
            .last()
            .text()
        ) || 0,
      crystal:
        window._gfNumberToJsNumber(
          $tooltip
            .find('tr:nth-child(' + (trCount - 2 + offset) + ') td')
            .last()
            .text()
        ) || 0,
      deuterium:
        window._gfNumberToJsNumber(
          $tooltip
            .find('tr:nth-child(' + (trCount - 1 + offset) + ') td')
            .last()
            .text()
        ) || 0,
      food:
        window._gfNumberToJsNumber(
          $tooltip
            .find('tr:nth-child(' + trCount + ') td')
            .last()
            .text()
        ) || 0,
      from: $tr.find('.coordsOrigin a').text().trim(),
      to: $tr.find('.destCoords a').text().trim(),
      nShips: $tr.find('.detailsFleet').text().trim(),
      returnMission: $tr.attr('data-return-flight') === 'true'
    };
    console.log('entry', trCount, entry);

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
  var missionIds = missions.map(function (e) {
    return e.id;
  });
  missions = missions.filter(function (mission) {
    var isReturnMissionDuplicate = false;
    if (mission.type !== 15 || mission.returnMission) {
      return true;
    }

    var hasNextMission = missionIds.indexOf(mission.id + 1) !== -1;
    return !hasNextMission;
  });

  missions.forEach(function (mission) {
    _cachedInflightResources.metal += mission.metal;
    _cachedInflightResources.crystal += mission.crystal;
    _cachedInflightResources.deuterium += mission.deuterium;
  });

  return _cachedInflightResources;
};
