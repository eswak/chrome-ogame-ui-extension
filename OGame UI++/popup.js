// Load configs
chrome.storage.local.get(null, function (items) {
  window.configs = {};
  Object.keys(items).forEach(function (key) {
    if (/.*\:[0-9]+$/.test(key)) {
      window.configs[key] = items[key];
      window.configs[key].history = items[key + ':history'];
      window.configs[key].players = items[key + ':players'];

      if (!window.config || (items[key].lastUpdate || 0) > (window.config.lastUpdate || 0)) {
        window.config = window.configs[key];
        window.selectedConfig = key;
      }
    }
  });

  document.querySelector('#content').innerHTML = `
    <select id="select-config">
      ${Object.keys(window.configs)
        .map((key) => {
          var config = window.configs[key];
          return (
            '<option value="' +
            key +
            '" ' +
            (key == window.selectedConfig ? 'selected' : '') +
            '>' +
            '[' +
            config.universe.language.toUpperCase() +
            '] ' +
            config.universe.name +
            ' : ' +
            config.players[config.playerId].name +
            '</option>'
          );
        })
        .join('')}
    </select>
    <div id="config-content"></div>
  `;

  handleConfigContent();
  document.querySelector('#select-config').onchange = function (ev) {
    handleConfigContent(ev.target.value);
  };
});

function handleConfigContent(configKey) {
  if (configKey && window.configs[configKey]) {
    window.selectedConfig = configKey;
    window.config = window.configs[configKey];
  }

  var wrapper = document.querySelector('#config-content');

  // Stats & delete content
  wrapper.innerHTML = '<h3>Saved data for this server :</h3>';
  wrapper.innerHTML +=
    '<div><span style="color: #fff">- Days of score history (player) :</span> ' +
    Object.keys((config.history || {})[config.playerId] || {}).length +
    '</div>';
  wrapper.innerHTML +=
    '<div><span style="color: #fff">- Days of score history (others) :</span> ' +
    Object.keys((config.history || {})['1'] || {}).length +
    '</div>';
  wrapper.innerHTML +=
    '<div><span style="color: #fff">- Expedition results :</span> ' +
    Object.keys(config.expeditionResults || {}).length +
    '</div>';

  // exchange rate
  var exchangeRateSectionHtml = '<h3>Exchange rate :</h3>';
  exchangeRateSectionHtml +=
    '<div style="color:#fff;margin:5px 0">Used to compute rentability times and "standard units".</div>';
  exchangeRateSectionHtml += '<div id="exchangerate">';
  ['metal', 'crystal', 'deuterium'].forEach(function (res, i) {
    var imgUrl = chrome.runtime.getURL('img/resources/' + res + '.png');
    exchangeRateSectionHtml += '<img src="' + imgUrl + '"/>';
    exchangeRateSectionHtml += '<input id="exchangerate-' + res + '" type="text" value="' + config.tradeRate[i] + '"/>';
    setTimeout(function () {
      document.querySelector('#exchangerate-' + res).onchange = function (ev) {
        var newValue = Number(ev.target.value);
        if (!isNaN(newValue)) {
          config.tradeRate[i] = newValue;
          window._saveConfig();
        }
      };
    });
  });
  exchangeRateSectionHtml += '</div>';
  wrapper.innerHTML += exchangeRateSectionHtml;

  // fleet warning threshold
  var militaryPoints = Number(((config.players || {})[config.playerId] || {}).militaryScore) || 0;
  var shipatdockThresholdHtml = '<h3>Threshold of idle fleet warning :</h3>';
  if (!config.features.shipatdock) {
    shipatdockThresholdHtml +=
      '<div style="color:##F44336;margin:5px 0">The "ship at dock" feature is turned off, setting this threshold will not change anything in the interface, because the warning is not displayed anyway.</div>';
  }
  shipatdockThresholdHtml += '<select id="select-shipatdock" style="margin: 5px 0;">';
  shipatdockThresholdHtml += [
    { v: '0', t: 'If there is at least 1 ship, show icon.' },
    {
      v: '0.001',
      t: '0.1% of military points (' + Math.round(0.001 * militaryPoints * 1000) + ' - automatically updates)'
    },
    {
      v: '0.002',
      t: '0.2% of military points (' + Math.round(0.002 * militaryPoints * 1000) + ' - automatically updates)'
    },
    {
      v: '0.003',
      t: '0.3% of military points (' + Math.round(0.003 * militaryPoints * 1000) + ' - automatically updates)'
    },
    {
      v: '0.005',
      t: '0.5% of military points (' + Math.round(0.005 * militaryPoints * 1000) + ' - automatically updates)'
    },
    {
      v: '0.01',
      t: '1% of military points (' + Math.round(0.01 * militaryPoints * 1000) + ' - automatically updates)'
    },
    {
      v: '0.015',
      t: '1.5% of military points (' + Math.round(0.015 * militaryPoints * 1000) + ' - automatically updates)'
    },
    {
      v: '0.02',
      t: '2% of military points (' + Math.round(0.02 * militaryPoints * 1000) + ' - automatically updates)'
    },
    {
      v: '0.03',
      t: '3% of military points (' + Math.round(0.03 * militaryPoints * 1000) + ' - automatically updates)'
    },
    {
      v: '0.04',
      t: '4% of military points (' + Math.round(0.04 * militaryPoints * 1000) + ' - automatically updates)'
    },
    {
      v: '0.05',
      t: '5% of military points (' + Math.round(0.05 * militaryPoints * 1000) + ' - automatically updates)'
    },
    {
      v: '0.1',
      t: '10% of military points (' + Math.round(0.1 * militaryPoints * 1000) + ' - automatically updates)'
    },
    {
      v: '0.05',
      t: '15% of military points (' + Math.round(0.15 * militaryPoints * 1000) + ' - automatically updates)'
    },
    {
      v: '0.25',
      t: '25% of military points (' + Math.round(0.25 * militaryPoints * 1000) + ' - automatically updates)'
    },
    {
      v: '0.5',
      t: '50% of military points (' + Math.round(0.5 * militaryPoints * 1000) + ' - automatically updates)'
    },
    {
      v: '0.75',
      t: '75% of military points (' + Math.round(0.75 * militaryPoints * 1000) + ' - automatically updates)'
    },
    { v: '25', t: 'Fixed threshold - 25.000' },
    { v: '100', t: 'Fixed threshold - 100.000' },
    { v: '1000', t: 'Fixed threshold - 1M' },
    { v: '5000', t: 'Fixed threshold - 5M' },
    { v: '25000', t: 'Fixed threshold - 25M' },
    { v: '50000', t: 'Fixed threshold - 50M' },
    { v: '75000', t: 'Fixed threshold - 75M' },
    { v: '100000', t: 'Fixed threshold - 100M' },
    { v: '500000', t: 'Fixed threshold - 500M' },
    { v: '1000000', t: 'Fixed threshold - 1B' }
  ]
    .map(function (o) {
      return (
        '<option value="' +
        o.v +
        '" ' +
        (String(window.config.shipsAtDockThreshold) === o.v ? 'selected' : '') +
        '>' +
        o.t +
        '</option>'
      );
    })
    .join('');
  shipatdockThresholdHtml += '</select>';
  wrapper.innerHTML += shipatdockThresholdHtml;
  setTimeout(function () {
    document.querySelector('#select-shipatdock').onchange = function (ev) {
      window.config.shipsAtDockThreshold = Number(ev.target.value);
      window._saveConfig();
    };
  });

  // Notifications
  var notifications = config.notifications || {};
  var notificationKeys = Object.keys(notifications);
  if (notificationKeys.length) {
    wrapper.innerHTML += '<h3>Upcoming reminders :</h3>';
    wrapper.innerHTML += '<p style="color:#fff;margin-top:5px;">Click on a reminder to dismiss it.</p>';
    notificationKeys.forEach(function (key, i) {
      var notification = notifications[key];
      wrapper.innerHTML += `
        <div class="pending-notification" id="pending-notification-${i}">
          <img style="pointer-events:none" src="${notification.img}"/>
          <span style="pointer-events:none" class="date">${getFormatedDate(
            notification.when,
            '[Y]-[m]-[d] [H]:[i]:[s]'
          )}</span>
          <span style="pointer-events:none" class="message">${notification.message}</span>
        </div>
      `;
      setTimeout(function () {
        document.querySelector('#pending-notification-' + i).onclick = function (ev) {
          var notificationIndex = Number(ev.target.id.replace('pending-notification-', ''));
          var notificationKey = notificationKeys[notificationIndex];
          delete config.notifications[notificationKey];
          window._saveConfig();
          handleConfigContent();
        };
      });
    });
  }

  // Features on/off
  var featureSectionHtml = '<h3>Toggle features ON/OFF :</h3>';
  featureSectionHtml += '<p style="color:#fff;margin-top:5px;">Click on a feature to toggle it on or off.</p>';
  // Feature: storagetime
  featureSectionHtml += '<div class="feature" id="feature-storagetime">';
  featureSectionHtml += '<img src="' + chrome.runtime.getURL('img/features/storagetime.png') + '" />';
  featureSectionHtml += '<span class="feature-status ' + (config.features.storagetime ? 'on' : 'off') + '"></span>';
  featureSectionHtml += '<span class="feature-name">Storage time</span>';
  featureSectionHtml +=
    '<span class="feature-description">Add a little text to know how much time you have before hitting full storage.</span>';
  featureSectionHtml += '</div>';
  // Feature: reminders
  featureSectionHtml += '<div class="feature" id="feature-reminders">';
  featureSectionHtml += '<img src="' + chrome.runtime.getURL('img/features/reminders.png') + '" />';
  featureSectionHtml += '<span class="feature-status ' + (config.features.reminders ? 'on' : 'off') + '"></span>';
  featureSectionHtml += '<span class="feature-name">Reminders</span>';
  featureSectionHtml +=
    '<span class="feature-description">Allow you to set reminders that will trigger a Google Chrome notification when missions arrive at destination or when a construction ends.</span>';
  featureSectionHtml += '</div>';
  // Feature: alliance tab
  featureSectionHtml += '<div class="feature" id="feature-alliance">';
  featureSectionHtml += '<img src="' + chrome.runtime.getURL('img/features/alliance.png') + '" />';
  featureSectionHtml += '<span class="feature-status ' + (config.features.alliance ? 'on' : 'off') + '"></span>';
  featureSectionHtml += '<span class="feature-name">Alliance tab</span>';
  featureSectionHtml +=
    '<span class="feature-description">Add a table on the alliance page where you can track the score and progress of your alliance members.</span>';
  featureSectionHtml += '</div>';
  // Feature: competitiontab
  featureSectionHtml += '<div class="feature" id="feature-competitiontab">';
  featureSectionHtml += '<img src="' + chrome.runtime.getURL('img/features/competitiontab.png') + '" />';
  featureSectionHtml += '<span class="feature-status ' + (config.features.competitiontab ? 'on' : 'off') + '"></span>';
  featureSectionHtml += '<span class="feature-name">Competition tab</span>';
  featureSectionHtml +=
    '<span class="feature-description">Add a tab that allows you to compare your score progression against players of a similar score, or selected players.</span>';
  featureSectionHtml += '</div>';
  // Feature: stats: stats
  featureSectionHtml += '<div class="feature" id="feature-stats">';
  featureSectionHtml += '<img src="' + chrome.runtime.getURL('img/features/stats.png') + '" />';
  featureSectionHtml += '<span class="feature-status ' + (config.features.stats ? 'on' : 'off') + '"></span>';
  featureSectionHtml += '<span class="feature-name">Stats page : overview</span>';
  featureSectionHtml +=
    '<span class="feature-description">On the stats page, display a list of resources on your planets, in flight, as well as your production and the time remaining before hitting full storage.</span>';
  featureSectionHtml += '</div>';
  // Feature: stats: charts
  featureSectionHtml += '<div class="feature" id="feature-charts">';
  featureSectionHtml += '<img src="' + chrome.runtime.getURL('img/features/charts.png') + '" />';
  featureSectionHtml += '<span class="feature-status ' + (config.features.charts ? 'on' : 'off') + '"></span>';
  featureSectionHtml += '<span class="feature-name">Stats page : charts</span>';
  featureSectionHtml +=
    '<span class="feature-description">On the stats page, display a chart of player scores progression over time.</span>';
  featureSectionHtml += '</div>';
  // Feature: stats: nextbuilds
  featureSectionHtml += '<div class="feature" id="feature-nextbuilds">';
  featureSectionHtml += '<img src="' + chrome.runtime.getURL('img/features/nextbuilds.png') + '" />';
  featureSectionHtml += '<span class="feature-status ' + (config.features.nextbuilds ? 'on' : 'off') + '"></span>';
  featureSectionHtml += '<span class="feature-name">Stats page : next builds</span>';
  featureSectionHtml +=
    '<span class="feature-description">On the stats page, display a list of suggested next builds, based on the ROI.</span>';
  featureSectionHtml += '</div>';
  // Feature: deploytransport
  featureSectionHtml += '<div class="feature" id="feature-deploytransport">';
  featureSectionHtml += '<img src="' + chrome.runtime.getURL('img/features/deploytransport.png') + '" />';
  featureSectionHtml += '<span class="feature-status ' + (config.features.deploytransport ? 'on' : 'off') + '"></span>';
  featureSectionHtml += '<span class="feature-name">Planet list: deploy & transport</span>';
  featureSectionHtml +=
    '<span class="feature-description">In the planet list, add little icon shortcuts on hover to transport resources or deploy fleet to a given planet.</span>';
  featureSectionHtml += '</div>';
  // Feature: shipatdock
  featureSectionHtml += '<div class="feature" id="feature-shipatdock">';
  featureSectionHtml += '<img src="' + chrome.runtime.getURL('img/features/shipatdock.png') + '" />';
  featureSectionHtml += '<span class="feature-status ' + (config.features.shipatdock ? 'on' : 'off') + '"></span>';
  featureSectionHtml += '<span class="feature-name">Planet list: ship at dock</span>';
  featureSectionHtml +=
    '<span class="feature-description">In the planet list, add little icon to warn you if you have a large number of ships that are staying idle.</span>';
  featureSectionHtml += '</div>';
  // Feature: ship
  featureSectionHtml += '<div class="feature" id="feature-ship">';
  featureSectionHtml += '<img src="' + chrome.runtime.getURL('img/features/ship.png') + '" />';
  featureSectionHtml += '<span class="feature-status ' + (config.features.ship ? 'on' : 'off') + '"></span>';
  featureSectionHtml += '<span class="feature-name">Fleet page: cargo (1)</span>';
  featureSectionHtml +=
    '<span class="feature-description">On the fleet page, add shortcuts to small and large cargo, to allow to transport all the planet\'s held metal, crystal, deuterium, or any combination of them.</span>';
  featureSectionHtml += '</div>';
  // Feature: shipresources
  featureSectionHtml += '<div class="feature" id="feature-shipresources">';
  featureSectionHtml += '<img src="' + chrome.runtime.getURL('img/features/shipresources.png') + '" />';
  featureSectionHtml += '<span class="feature-status ' + (config.features.shipresources ? 'on' : 'off') + '"></span>';
  featureSectionHtml += '<span class="feature-name">Fleet page: cargo (2)</span>';
  featureSectionHtml +=
    '<span class="feature-description">On the fleet page, add text boxes to transport a given amount of metal, crystal, and deuterium, and allow to prefill the right number of small or large cargo to transport these resources.</span>';
  featureSectionHtml += '</div>';
  // Feature: expeditionpoints
  featureSectionHtml += '<div class="feature" id="feature-expeditionpoints">';
  featureSectionHtml += '<img src="' + chrome.runtime.getURL('img/features/expeditionpoints.png') + '" />';
  featureSectionHtml +=
    '<span class="feature-status ' + (config.features.expeditionpoints ? 'on' : 'off') + '"></span>';
  featureSectionHtml += '<span class="feature-name">Fleet page: expedition shortcut</span>';
  featureSectionHtml +=
    '<span class="feature-description">On the fleet page, add a shortcut to send a fleet optimized for expedition based on the current server status (maximum resources available, player class, etc).</span>';
  featureSectionHtml += '</div>';
  // Feature: expeditiontab
  featureSectionHtml += '<div class="feature" id="feature-expeditiontab">';
  featureSectionHtml += '<img src="' + chrome.runtime.getURL('img/features/expeditiontab.png') + '" />';
  featureSectionHtml += '<span class="feature-status ' + (config.features.expeditiontab ? 'on' : 'off') + '"></span>';
  featureSectionHtml += '<span class="feature-name">New Tab: Expeditions</span>';
  featureSectionHtml +=
    '<span class="feature-description">Add a tab that recaps the results of all past expeditions. You must read the expedition result messages in order to add them to the list.</span>';
  featureSectionHtml += '</div>';
  // Feature: galaxy
  featureSectionHtml += '<div class="feature" id="feature-galaxy">';
  featureSectionHtml += '<img src="' + chrome.runtime.getURL('img/features/galaxy.png') + '" />';
  featureSectionHtml += '<span class="feature-status ' + (config.features.galaxy ? 'on' : 'off') + '"></span>';
  featureSectionHtml += '<span class="feature-name">Galaxy: improve tooltips</span>';
  featureSectionHtml +=
    '<span class="feature-description">Add the score of the player and a link to all their planets in the galaxy view.</span>';
  featureSectionHtml += '</div>';
  // Feature: galaxydebris
  featureSectionHtml += '<div class="feature" id="feature-galaxydebris">';
  featureSectionHtml += '<img src="' + chrome.runtime.getURL('img/features/galaxydebris.png') + '" />';
  featureSectionHtml += '<span class="feature-status ' + (config.features.galaxydebris ? 'on' : 'off') + '"></span>';
  featureSectionHtml += '<span class="feature-name">Galaxy: debris numbers</span>';
  featureSectionHtml +=
    '<span class="feature-description">In the galaxy view, add the number of resources contained in a debris field without having to hover it.</span>';
  featureSectionHtml += '</div>';
  // Feature: minetext
  featureSectionHtml += '<div class="feature" id="feature-minetext">';
  featureSectionHtml += '<img src="' + chrome.runtime.getURL('img/features/minetext.png') + '" />';
  featureSectionHtml += '<span class="feature-status ' + (config.features.minetext ? 'on' : 'off') + '"></span>';
  featureSectionHtml += '<span class="feature-name">Mines: rentability time</span>';
  featureSectionHtml +=
    '<span class="feature-description">Add additional information on production buildings, to know the time to hit your return on investment.</span>';
  featureSectionHtml += '</div>';
  // Feature: missingresources
  featureSectionHtml += '<div class="feature" id="feature-missingresources">';
  featureSectionHtml += '<img src="' + chrome.runtime.getURL('img/features/missingresources.png') + '" />';
  featureSectionHtml +=
    '<span class="feature-status ' + (config.features.missingresources ? 'on' : 'off') + '"></span>';
  featureSectionHtml += '<span class="feature-name">Missing resources</span>';
  featureSectionHtml +=
    '<span class="feature-description">Add the number of missing resources for constructions that are too expensive to start now.</span>';
  featureSectionHtml += '</div>';
  // Feature: solarsat
  featureSectionHtml += '<div class="feature" id="feature-solarsat">';
  featureSectionHtml += '<img src="' + chrome.runtime.getURL('img/features/solarsat.png') + '" />';
  featureSectionHtml += '<span class="feature-status ' + (config.features.solarsat ? 'on' : 'off') + '"></span>';
  featureSectionHtml += '<span class="feature-name">Solar sat build helper</span>';
  featureSectionHtml +=
    '<span class="feature-description">Pre-fill the number of solar satellite construction box with the number of satellites you need to build if your energy is negative.</span>';
  featureSectionHtml += '</div>';
  // Feature: topgeneral
  featureSectionHtml += '<div class="feature" id="feature-topgeneral">';
  featureSectionHtml += '<img src="' + chrome.runtime.getURL('img/features/topgeneral.png') + '" />';
  featureSectionHtml += '<span class="feature-status ' + (config.features.topeco ? 'on' : 'off') + '"></span>';
  featureSectionHtml += '<span class="feature-name">Top/Flop: General leaderboard</span>';
  featureSectionHtml +=
    '<span class="feature-description">In the top/flop tab, show the leaderboard of top gained/lost points.</span>';
  featureSectionHtml += '</div>';
  // Feature: topeco
  featureSectionHtml += '<div class="feature" id="feature-topeco">';
  featureSectionHtml += '<img src="' + chrome.runtime.getURL('img/features/topeco.png') + '" />';
  featureSectionHtml += '<span class="feature-status ' + (config.features.topeco ? 'on' : 'off') + '"></span>';
  featureSectionHtml += '<span class="feature-name">Top/Flop: Economy leaderboard</span>';
  featureSectionHtml +=
    '<span class="feature-description">In the top/flop tab, show the leaderboard of top gained/lost economy points.</span>';
  featureSectionHtml += '</div>';
  // Feature: topfleet
  featureSectionHtml += '<div class="feature" id="feature-topfleet">';
  featureSectionHtml += '<img src="' + chrome.runtime.getURL('img/features/topfleet.png') + '" />';
  featureSectionHtml += '<span class="feature-status ' + (config.features.topfleet ? 'on' : 'off') + '"></span>';
  featureSectionHtml += '<span class="feature-name">Top/Flop: Fleet leaderboard</span>';
  featureSectionHtml +=
    '<span class="feature-description">In the top/flop tab, show the leaderboard of top gained/lost fleet points.</span>';
  featureSectionHtml += '</div>';
  // Feature: topresearch
  featureSectionHtml += '<div class="feature" id="feature-topresearch">';
  featureSectionHtml += '<img src="' + chrome.runtime.getURL('img/features/topresearch.png') + '" />';
  featureSectionHtml += '<span class="feature-status ' + (config.features.topresearch ? 'on' : 'off') + '"></span>';
  featureSectionHtml += '<span class="feature-name">Top/Flop: Research leaderboard</span>';
  featureSectionHtml +=
    '<span class="feature-description">In the top/flop tab, show the leaderboard of top gained/lost research points.</span>';
  featureSectionHtml += '</div>';
  // append section to wrapper
  featureSectionHtml += '</div>';

  wrapper.innerHTML += featureSectionHtml;
  setTimeout(function () {
    Object.keys(config.features || {}).forEach(function (featureKey) {
      var selector = document.querySelector('#feature-' + featureKey);
      if (!selector) return;
      selector.onclick = function () {
        config.features[featureKey] = !config.features[featureKey];
        _saveConfig();
        handleConfigContent();
      };
    });
  });
}

window._saveConfig = function () {
  window.config.lastUpdate = Date.now();
  var toStore = {};
  toStore[window.selectedConfig] = window.config;
  chrome.storage.local.set(toStore).then(() => {
    console.log('OGame UI++: saved data', window.selectedConfig);
  });
};

function getFormatedDate(timestamp, format) {
  var currTime = new Date();
  currTime.setTime(timestamp);
  str = format;
  str = str.replace('[d]', dezInt(currTime.getDate(), 2));
  str = str.replace('[m]', dezInt(currTime.getMonth() + 1, 2));
  str = str.replace('[j]', parseInt(currTime.getDate()));
  str = str.replace('[Y]', currTime.getFullYear());
  str = str.replace('[y]', currTime.getFullYear().toString().substr(2, 4));
  str = str.replace('[G]', currTime.getHours());
  str = str.replace('[H]', dezInt(currTime.getHours(), 2));
  str = str.replace('[i]', dezInt(currTime.getMinutes(), 2));
  str = str.replace('[s]', dezInt(currTime.getSeconds(), 2));
  return str;
}
/**
 * adds prefix digits to a number ('2'->'02')
 *
 * @param int   number
 * @param int   digits
 * @param str   prefix, default is '0'
 */
function dezInt(num, size, prefix) {
  prefix = prefix ? prefix : '0';
  var minus = num < 0 ? '-' : '',
    result = prefix == '0' ? minus : '';
  num = Math.abs(parseInt(num, 10));
  size -= ('' + num).length;

  for (var i = 1; i <= size; i++) {
    result += '' + prefix;
  }

  result += (prefix != '0' ? minus : '') + num;
  return result;
}
