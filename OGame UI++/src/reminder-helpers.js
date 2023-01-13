'use strict';
window._addReminderHelpers = function _addReminderHelpers() {
  // cleanup past notifications
  var now = Date.now();
  for (var timestamp in config.notifications) {
    if (Number(timestamp) < now) {
      delete config.notifications[timestamp];
      _saveConfig();
    }
  }

  // add helpers
  setInterval(function () {
    // Add notification helpers to event list
    var $missions = $('#eventContent .arrivalTime:not(.enhanced-reminder)');
    if ($missions.length) {
      $missions.each(function () {
        var $mission = $(this);
        var timestamp = Number($mission.parent().attr('data-arrival-time') * 1000);
        var alreadySet = (window.config.notifications || {})[timestamp] != null;
        $mission.addClass('enhanced-reminder');
        $mission.prepend(
          '<span class="icon icon_chat tooltip tooltipLeft" style="user-select: none;filter: hue-rotate(45deg) saturate(2);cursor: pointer;' +
            (alreadySet ? 'opacity:1;' : 'opacity:0.5;') +
            '" title="Set a reminder at ' +
            $mission.text() +
            '">&nbsp;</span>&nbsp;'
        );

        $mission.find('.icon.icon_chat').click(function () {
          var img = $mission.parent().find('.missionFleet img').attr('src');
          //if ($mission.parent().attr('data-mission-type') == '15') img = uipp_images.expeditionMission;
          var ships = $mission.parent().find('.detailsFleet').text().trim();
          var returning = $mission.parent().find('.icon_movement_reserve').length ? true : false;
          var destinationName = (
            $mission.parent().find('.destFleet span').attr('title') || $mission.parent().find('.destFleet').text()
          ).trim();
          var destinationCoords = $mission.parent().find('.destCoords').text().trim();
          var sourceName = (
            $mission.parent().find('.originFleet span').attr('title') || $mission.parent().find('.originFleet').text()
          ).trim();
          var sourceCoords = $mission.parent().find('.coordsOrigin').text().trim();
          alreadySet = (window.config.notifications || {})[timestamp] != null;
          var opts = {
            when: timestamp,
            img: img,
            message: ships + ' ships'
          };
          opts.message += ' ' + (returning ? 'returned to' : 'arrived at');
          opts.message += ' ' + (returning ? sourceName : destinationName);
          opts.message += ' ' + (returning ? sourceCoords : destinationCoords);

          if (alreadySet) {
            window.uipp_deleteNotification(opts);
            $mission.find('span.icon.icon_chat').css('opacity', '0.5');
          } else {
            window.uipp_notify(opts);
            $mission.find('span.icon.icon_chat').css('opacity', '1');
          }
        });
      });
    }

    // Add building complete notification helper
    var $countdowns = $('.construction.active th:not(.enhanced-reminder)');
    if ($countdowns.length) {
      $countdowns.each(function () {
        var $countdown = $(this);
        $countdown.addClass('enhanced-reminder');

        //var timestamp = Number($countdown.attr('data-end') * 1000);
        var timestamp =
          Math.floor(_gfTimeToTimestamp($countdown.parent().parent().find('.timer').text().trim()) / 1000) * 1000;
        var alreadySet = (window.config.notifications || {})[timestamp] != null;

        $countdown.append(
          '&nbsp;<span class="icon icon_chat tooltip tooltipBottom" style="user-select: none;filter: hue-rotate(45deg) saturate(2);cursor: pointer;' +
            (alreadySet ? 'opacity:1;' : 'opacity:0.5;') +
            '" title="Set a reminder at ' +
            getFormatedDate(timestamp, '[Y]-[m]-[d] [H]:[i]:[s]') +
            '">&nbsp;</span>&nbsp;'
        );

        $countdown.find('.icon.icon_chat').click(async function () {
          alreadySet = (window.config.notifications || {})[timestamp] != null;
          var coords = '[' + _getCurrentPlanetCoordinates().join(':') + ']';
          var planetName = config.my.planets[coords].name;
          var imgElement = $countdown.parent().parent().find('.queuePic');
          var img = imgElement.attr('src');
          if (!img) {
            img = await window.domtoimage.toPng(imgElement[0]);
          }
          img = img || uipp_images.datetime;

          var opts = {
            when: timestamp,
            img: img,
            message: 'Construction over on ' + planetName + ' ' + coords + ' : ' + $countdown.text().trim()
          };

          if (alreadySet) {
            window.uipp_deleteNotification(opts);
            $countdown.find('span.icon.icon_chat').css('opacity', '0.5');
          } else {
            window.uipp_notify(opts);
            $countdown.find('span.icon.icon_chat').css('opacity', '1');
          }
        });
      });
    }
  }, 100);
};

// Example of options :
/*{
  when: Date.now() + 1000,
  title: 'Plasma is great',
  message: 'How great it is!',
  img: uipp_images.plasma
}*/
window.uipp_notify = function (opts) {
  var now = Date.now();
  var when = opts.when || now;
  if (when != now) {
    window.config.notifications = window.config.notifications || {};
    window.config.notifications[when] = opts;
    window._saveConfig();
  }
  var evt = document.createEvent('CustomEvent');
  evt.initCustomEvent('UIPPNotification', true, true, opts);
  document.dispatchEvent(evt);
};

window.uipp_deleteNotification = function (opts) {
  var now = Date.now();
  var when = opts.when || now;
  if ((window.config.notifications || {})[when] != null) {
    delete window.config.notifications[when];
    _saveConfig();
  }
  var evt = document.createEvent('CustomEvent');
  evt.initCustomEvent('UIPPNotificationDelete', true, true, opts);
  document.dispatchEvent(evt);
};
