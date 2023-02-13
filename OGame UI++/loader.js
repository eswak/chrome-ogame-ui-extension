// add image url object
var uipp_images = {
  atk: chrome.runtime.getURL('img/atk.png'),
  atkunk: chrome.runtime.getURL('img/atk-unk.png'),
  wings: chrome.runtime.getURL('img/wings.png'),
  inflight: chrome.runtime.getURL('img/fleet-inflight.gif'),
  stay: chrome.runtime.getURL('img/mission-stay.jpg'),
  ship: chrome.runtime.getURL('img/mission-ship.jpg'),
  datetime: chrome.runtime.getURL('img/datetime.png'),
  expeditionMission: chrome.runtime.getURL('img/expedition.png'),
  yield: chrome.runtime.getURL('img/yield.png'),
  item: chrome.runtime.getURL('img/item.png'),
  metal: chrome.runtime.getURL('img/mine-metal.png'),
  crystal: chrome.runtime.getURL('img/mine-crystal.png'),
  deuterium: chrome.runtime.getURL('img/mine-deuterium.png'),
  astrophysics: chrome.runtime.getURL('img/tech-astro.png'),
  plasma: chrome.runtime.getURL('img/tech-plasma.png'),
  expedition: {
    aliens: chrome.runtime.getURL('img/expedition/aliens.png'),
    pirates: chrome.runtime.getURL('img/expedition/pirates.png'),
    merchant: chrome.runtime.getURL('img/expedition/merchant.png'),
    blackhole: chrome.runtime.getURL('img/expedition/blackhole.png')
  },
  box: {
    boxTopLeft: chrome.runtime.getURL('img/box/box-top-left.png'),
    boxTopRight: chrome.runtime.getURL('img/box/box-top-right.png'),
    boxBottomLeft: chrome.runtime.getURL('img/box/box-bottom-left.png'),
    boxBottomRight: chrome.runtime.getURL('img/box/box-bottom-right.png'),
    boxTitleBg: chrome.runtime.getURL('img/box/box-title-bg.png'),
    boxTitleLeft: chrome.runtime.getURL('img/box/box-title-left.png'),
    boxTitleRight: chrome.runtime.getURL('img/box/box-title-right.png')
  },
  features: {
    alliance: chrome.runtime.getURL('img/features/alliance.png'),
    charts: chrome.runtime.getURL('img/features/charts.png'),
    deploytransport: chrome.runtime.getURL('img/features/deploytransport.png'),
    expeditionpoints: chrome.runtime.getURL('img/features/expeditionpoints.png'),
    expeditiontab: chrome.runtime.getURL('img/features/expeditiontab.png'),
    galaxy: chrome.runtime.getURL('img/features/galaxy.png'),
    galaxydebris: chrome.runtime.getURL('img/features/galaxydebris.png'),
    minetext: chrome.runtime.getURL('img/features/minetext.png'),
    missingresources: chrome.runtime.getURL('img/features/missingresources.png'),
    nextbuilds: chrome.runtime.getURL('img/features/nextbuilds.png'),
    solarsat: chrome.runtime.getURL('img/features/solarsat.png'),
    ship: chrome.runtime.getURL('img/features/ship.png'),
    shipatdock: chrome.runtime.getURL('img/features/shipatdock.png'),
    shipresources: chrome.runtime.getURL('img/features/shipresources.png'),
    stats: chrome.runtime.getURL('img/features/stats.png'),
    storagetime: chrome.runtime.getURL('img/features/storagetime.png'),
    topeco: chrome.runtime.getURL('img/features/topeco.png'),
    topfleet: chrome.runtime.getURL('img/features/topfleet.png'),
    topgeneral: chrome.runtime.getURL('img/features/topgeneral.png'),
    topresearch: chrome.runtime.getURL('img/features/topresearch.png')
  },
  resources: {
    mix: chrome.runtime.getURL('img/resources/mix.png'),
    am: chrome.runtime.getURL('img/resources/am.png'),
    metal: chrome.runtime.getURL('img/resources/metal.png'),
    crystal: chrome.runtime.getURL('img/resources/crystal.png'),
    deuterium: chrome.runtime.getURL('img/resources/deuterium.png'),
    ambig: chrome.runtime.getURL('img/resources/am-big.png'),
    metalbig: chrome.runtime.getURL('img/resources/metal-big.png'),
    crystalbig: chrome.runtime.getURL('img/resources/crystal-big.png'),
    deuteriumbig: chrome.runtime.getURL('img/resources/deuterium-big.png'),
    itembig: chrome.runtime.getURL('img/resources/item-big.png')
  },
  ships: {
    202: chrome.runtime.getURL('img/ships/202.jpg'),
    203: chrome.runtime.getURL('img/ships/203.jpg'),
    204: chrome.runtime.getURL('img/ships/204.jpg'),
    205: chrome.runtime.getURL('img/ships/205.jpg'),
    206: chrome.runtime.getURL('img/ships/206.jpg'),
    207: chrome.runtime.getURL('img/ships/207.jpg'),
    208: chrome.runtime.getURL('img/ships/208.jpg'),
    209: chrome.runtime.getURL('img/ships/209.jpg'),
    210: chrome.runtime.getURL('img/ships/210.jpg'),
    211: chrome.runtime.getURL('img/ships/211.jpg'),
    212: chrome.runtime.getURL('img/ships/212.jpg'),
    213: chrome.runtime.getURL('img/ships/213.jpg'),
    214: chrome.runtime.getURL('img/ships/214.jpg'),
    215: chrome.runtime.getURL('img/ships/215.jpg'),
    217: chrome.runtime.getURL('img/ships/217.jpg'),
    218: chrome.runtime.getURL('img/ships/218.jpg'),
    219: chrome.runtime.getURL('img/ships/219.jpg')
  },
  score: {
    global: chrome.runtime.getURL('img/score-global.png'),
    economy: chrome.runtime.getURL('img/score-economy.png'),
    research: chrome.runtime.getURL('img/score-research.png'),
    military: chrome.runtime.getURL('img/score-military.png'),
    fleet: chrome.runtime.getURL('img/score-fleet.png')
  }
};

var scripts = [
  'lib/chartist.min.js',
  'lib/dom-to-image.min.js',
  'src/utils/formatter-number.js',
  'src/utils/formatter-time.js',
  'src/utils/get-current-planet-coordinates.js',
  'src/utils/get-current-planet-resources.js',
  'src/utils/get-resources-in-flight.js',
  'src/utils/get-resources-worth.js',
  'src/utils/gf-number-to-js-number.js',
  'src/utils/gf-time-to-timestamp.js',
  'src/utils/history-utils.js',
  'src/utils/i18n.js',
  'src/utils/inprog-parser.js',
  'src/utils/load-universe-api.js',
  'src/utils/persistent-config.js',
  'src/utils/refresh-universe-data.js',
  'src/utils/rentability-time.js',
  'src/utils/set-config-my-planets.js',
  'src/utils/parse-empire-data.js',
  'src/utils/parse-research-tab.js',
  'src/utils/upload-image.js',
  'src/utils/xml2json.js',
  'src/utils/formulas.js',
  'src/utils/on-menu-click.js',
  'src/utils/dom-events.js',
  'src/costs-helper.js',
  'src/current-planet-storage-helper.js',
  'src/reminder-helpers.js',
  'src/expedition-helper.js',
  'src/expedition-message-parser.js',
  'src/galaxy-players-planets.js',
  'src/galaxy-debris.js',
  'src/planet-fleet-shortcuts.js',
  'src/ship-at-dock-helper.js',
  'src/ship-helper.js',
  'src/ship-resources-helper.js',
  'src/solarsat-helper.js',
  'src/alliance-table.js',
  'src/tab-competition.js',
  'src/tab-expeditions.js',
  'src/tab-links.js',
  'src/tab-stats.js',
  'src/tab-topflop.js',
  'main.js'
];
var start = Date.now();
Promise.all(
  scripts.map(function (scriptPath) {
    return new Promise(function (resolve) {
      var s = document.createElement('script');
      s.src = chrome.runtime.getURL(scriptPath);
      s.onload = function () {
        //console.log('Loaded', scriptPath);
        this.remove();
        resolve();
      };
      (document.head || document.documentElement).appendChild(s);
    });
  })
).then(function () {
  console.log('OGame UI++: loaded all files in', Date.now() - start, 'ms.');

  var imagesEvent = document.createEvent('CustomEvent');
  imagesEvent.initCustomEvent('UIPPImages', true, true, uipp_images);
  document.dispatchEvent(imagesEvent);

  var startEvent = document.createEvent('Event');
  startEvent.initEvent('UIPPStart', true, true);
  document.dispatchEvent(startEvent);
});

/*
// Send an event:
var evt = document.createEvent('CustomEvent');
evt.initCustomEvent('UIPPNotification', true, true, {
    title: 'Plasma is great',
    message: 'How great it is!',
    img: uipp_images.plasma
});
document.dispatchEvent(evt);
*/
document.addEventListener('UIPPNotification', function (evt) {
  var when = evt.detail.when || Date.now() + 1;
  var title = evt.detail.title || 'OGame UI++';
  var message = evt.detail.message || 'Reminder to check OGame.';
  var img = evt.detail.img || 'metalmine.48.jpeg';

  chrome.runtime.sendMessage(chrome.runtime.id, {
    type: 'notification',
    when: when,
    options: {
      type: 'basic',
      silent: false,
      requireInteraction: true,
      priority: 2,
      title: title,
      message: message,
      iconUrl: img
    }
  });
});

document.addEventListener('UIPPNotificationDelete', function (evt) {
  var when = evt.detail.when || Date.now() + 1;
  var title = evt.detail.title || 'OGame UI++';
  var message = evt.detail.message || 'Reminder to check OGame.';
  var img = evt.detail.img || 'metalmine.48.jpeg';

  chrome.runtime.sendMessage(chrome.runtime.id, {
    type: 'notification-delete',
    when: when,
    options: {
      type: 'basic',
      silent: false,
      requireInteraction: true,
      priority: 2,
      title: title,
      message: message,
      iconUrl: img
    }
  });
});

document.addEventListener('UIPPSaveData', function (evt) {
  var parsedDetail = JSON.parse(evt.detail);
  var toStore = {};
  toStore[parsedDetail.key] = parsedDetail.value;
  chrome.storage.local.set(toStore).then(() => {
    console.log('OGame UI++: saved data', parsedDetail.key);
  });
});

document.addEventListener('UIPPGetData', function (evt) {
  var keys = (evt.detail || '').split(',');
  var start = Date.now();
  chrome.storage.local.get(keys).then((result) => {
    console.log('OGame UI++: loaded data in', Date.now() - start, 'ms.\n  - ' + keys.join('\n  - '));
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent('UIPPGetDataResponse:' + keys.join(','), true, true, JSON.stringify(result));
    document.dispatchEvent(evt);
  });
});

/*chrome.storage.local.get(null, function(items) {
  var allKeys = Object.keys(items);
  console.log('OGame UI++ storage keys\n' + allKeys.map(function(key) {
    return '  ' + key + ' : ' + JSON.stringify(items[key]).length
  }).join('\n'));
});*/
