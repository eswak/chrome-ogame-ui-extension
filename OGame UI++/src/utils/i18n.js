var fn = function () {
  'use strict';
  var lang = window.constants.language || 'en';

  var translations = {
    fr: {
      UNIT_METAL: 'Métal',
      UNIT_CRYSTAL: 'Cristal',
      UNIT_DEUTERIUM: 'Deutérium',
      UNIT_ENERGY: 'Energie',
      TIME_SECOND: 's',
      TIME_MINUTE: 'm',
      TIME_HOUR: 'h',
      TIME_DAY: 'j',
      ECONOMY_TIME: 'Nécéssite {time} d\'économies avec échange de ressources',
      BUILDABLE_IN: 'Construction possible dans : {time}',
      BUILDABLE_NOW: 'Construction possible dès maintenant',
      ROI: 'Investissement rentable en : {time} à taux {tradeRate}',
      ECONOMY_SCORE: 'Eco',
      ECONOMY_SCORE_LONG: 'Total des points gagnés par ce joueur grâce aux mines : {scoreEco}',
      MILITARY_SCORE: 'Militaire',
      MILITARY_SCORE_LONG: '{scoreMilitary} points militaires ({ships} vaisseaux)',
      COORDINATES: 'Position',
      PLAYER: 'Joueur',
      NOTE: 'Note',
      ACTIONS: 'Actions',
      PLANET_DEFENDED: 'Planète défendue',
      PLANET_NEEDSPY: 'Rapport d\'espionnage incomplet',
      MENU_NEIGHBOURS_ACTIVE: 'Voisins actifs',
      MENU_NEIGHBOURS_INACTIVE: 'Inactifs proches',
      MENU_STATS: 'Statistiques',
      MENU_FIGHTSIM: 'Sim. Combat',
      STATS_ALL: 'Statistiques pour toutes les planètes',
      STATS_FOR: 'Statistiques pour',
      STATS_DAILY: 'Production journalière',
      STATS_RATIO: 'Ratio de production (rapport au ',
      RESET_STATS: 'Réinitialiser les statistiques'
    },
    en: {
      UNIT_METAL: 'Metal',
      UNIT_CRYSTAL: 'Crystal',
      UNIT_DEUTERIUM: 'Deuterium',
      UNIT_ENERGY: 'Energy',
      TIME_SECOND: 's',
      TIME_MINUTE: 'm',
      TIME_HOUR: 'h',
      TIME_DAY: 'd',
      ECONOMY_TIME: 'Requires {time} of resource-gathering (with trade)',
      BUILDABLE_IN: 'Buildable in : {time}',
      BUILDABLE_NOW: 'Buildable now',
      ROI: 'Return on investment : {time} with trade rate {tradeRate}',
      ECONOMY_SCORE: 'Eco',
      ECONOMY_SCORE_LONG: 'Sum of points spent in mines : {scoreEco}',
      MILITARY_SCORE: 'Military',
      MILITARY_SCORE_LONG: '{scoreMilitary} military points ({ships} ships)',
      COORDINATES: 'Position',
      PLAYER: 'Player',
      NOTE: 'Note',
      ACTIONS: 'Actions',
      PLANET_DEFENDED: 'Planet defended',
      PLANET_NEEDSPY: 'Spy report incomplete',
      MENU_NEIGHBOURS_ACTIVE: 'Active neighbours',
      MENU_NEIGHBOURS_INACTIVE: 'Nearby idles',
      MENU_STATS: 'Statistics',
      MENU_FIGHTSIM: 'Fight simulator',
      STATS_ALL: 'Statistics for all planets',
      STATS_FOR: 'Statistics for',
      STATS_DAILY: 'Daily production',
      STATS_RATIO: 'Production ratio (relative to ',
      RESET_STATS: 'Reset stats'
    },
    es: {
      UNIT_METAL: 'Metal',
      UNIT_CRYSTAL: 'Cristal',
      UNIT_DEUTERIUM: 'Deuterio',
      UNIT_ENERGY: 'Energía',
      TIME_SECOND: 's',
      TIME_MINUTE: 'm',
      TIME_HOUR: 'h',
      TIME_DAY: 'd',
      ECONOMY_TIME: 'Requiere {time} con intercambio de recursos',
      BUILDABLE_IN: 'Construcción posible en {time}',
      BUILDABLE_NOW: 'Construcción lista para comenzar',
      ROI: 'Inversión rentable en {time} a tasa {tradeRate}',
      ECONOMY_SCORE: 'Eco',
      ECONOMY_SCORE_LONG: 'Sumatoria de puntos del jugador por economía {scoreEco}',
      MILITARY_SCORE: 'Militar',
      MILITARY_SCORE_LONG: '{scoreMilitary} puntos militares ({ships} naves)',
      COORDINATES: 'Posición',
      PLAYER: 'Jugador',
      NOTE: 'Nota',
      ACTIONS: ' Acciones',
      PLANET_DEFENDED: 'El Planeta defendió',
      PLANET_NEEDSPY: 'espionaje incompleto',
      MENU_NEIGHBOURS_ACTIVE: 'Vecinos Activos',
      MENU_NEIGHBOURS_INACTIVE: 'Inactivos cercanos',
      MENU_STATS: 'Estadísticas',
      MENU_FIGHTSIM: 'Sim. Combate ',
      'STATS_ALL ': 'Estadísticas para todos los planetas',
      STATS_FOR: 'Estadísticas para',
      STATS_DAILY: 'Producción diaria',
      STATS_RATIO: 'Relación de producción (en comparación con',
      RESET_STATS: 'Restaurar estadísticas'
    },
    tr: {
      UNIT_METAL: 'Metal',
      UNIT_CRYSTAL: 'Kristal',
      UNIT_DEUTERIUM: 'Deuterium',
      UNIT_ENERGY: 'Enerji',
      TIME_SECOND: 'sn',
      TIME_MINUTE: 'dk',
      TIME_HOUR: 's',
      TIME_DAY: 'g',
      ECONOMY_TIME: 'Gereken kaynak toplama zamanı (Tüccar ile): {time}',
      BUILDABLE_IN: 'Kurmak için gereken süre: {time}',
      BUILDABLE_NOW: 'Şu anda kurulabilir!',
      ROI: 'Yatırım dönüşü: {time} - Tüccar ile: {tradeRate}',
      ECONOMY_SCORE: 'Eko',
      ECONOMY_SCORE_LONG: 'Madene harcanan puan toplamı : {scoreEco}',
      MILITARY_SCORE: 'Askeri',
      MILITARY_SCORE_LONG: '{scoreMilitary} askeri puan ({ships} gemi)',
      COORDINATES: 'Pozisyon',
      PLAYER: 'Oyuncu',
      NOTE: 'Not',
      ACTIONS: 'Aksiyonlar',
      PLANET_DEFENDED: 'Gezegen korundu',
      PLANET_NEEDSPY: 'Casus raporu eksik',
      MENU_NEIGHBOURS_ACTIVE: 'Aktif Komşular',
      MENU_NEIGHBOURS_INACTIVE: 'İnaktif Komşular',
      MENU_STATS: 'İstatistik',
      MENU_FIGHTSIM: 'Savaş Simulatörü',
      STATS_ALL: 'İstatistik (Tümü)',
      STATS_FOR: 'İstatistik - ',
      STATS_DAILY: 'Günlük Üretim',
      STATS_RATIO: 'Üretim Oranı (İlişki: ',
      RESET_STATS: 'Sıfırlama istatistikler'
    },
    de: {
      UNIT_METAL: 'Metall',
      UNIT_CRYSTAL: 'Kristall',
      UNIT_DEUTERIUM: 'Deuterium',
      UNIT_ENERGY: 'Energie',
      TIME_SECOND: 's',
      TIME_MINUTE: 'm',
      TIME_HOUR: 'h',
      TIME_DAY: 'j',
      ECONOMY_TIME: 'Benötigt {time} Ressourcen-Sammeln (mit Handel)',
      BUILDABLE_IN: 'Baubar in : {time}',
      BUILDABLE_NOW: 'Jetzt baubar',
      ROI: 'Return on investment : {time} mit Handelskurs {tradeRate}',
      ECONOMY_SCORE: 'Eco',
      ECONOMY_SCORE_LONG: 'Summe der Punke in Minen : {scoreEco}',
      MILITARY_SCORE: 'Militär',
      MILITARY_SCORE_LONG: '{scoreMilitary} militärische Punkte ({ships} Schiffe)',
      COORDINATES: 'Position',
      PLAYER: 'Spieler',
      NOTE: 'Notiz',
      ACTIONS: 'Aktionen',
      PLANET_DEFENDED: 'Planet verteidigt',
      PLANET_NEEDSPY: 'Spionagebericht unvollständig',
      MENU_NEIGHBOURS_ACTIVE: 'Aktive Nachbarn',
      MENU_NEIGHBOURS_INACTIVE: 'Inaktive Nachbarn',
      MENU_STATS: 'Statistiken',
      MENU_FIGHTSIM: 'Kampfsimulator',
      STATS_ALL: 'Statistik über alle Planeten',
      STATS_FOR: 'Statistik für',
      STATS_DAILY: 'Tägliche Produktion',
      STATS_RATIO: 'Produktionsverhältnis (relativ zu ',
      RESET_STATS: 'Statistik zurücksetzen'
    }
  };
  if (!translations[lang]) {
    lang = 'en';
  }

  window._translate = function _translate(key, args) {
    var ret = translations[lang][key] || '';
    for (var k in args) {
      if (args.noBold) {
        ret = ret.replace('{' + k + '}', args[k]);
      } else {
        ret = ret.replace('{' + k + '}', '<span class="boldy">' + args[k] + '</span>');
      }
    }

    return ret;
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
