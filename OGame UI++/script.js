// ==UserScript==
// @match http://*.ogame.gameforge.com/game/*
// @match https://*.ogame.gameforge.com/game/*
// @name OGame UI++
// @author Eswak
// @version 1.3.0
// @description Améliore l'interface utilisateur d'OGame en y ajoutant des éléments.
// @icon http://gf1.geo.gfsrv.net/cdn68/20da7e6c416e6cd5f8544a73f588e5.png
// DESCRIPTION :
//  This userscript enhances the ogame UI to add some informations into it
// HOW TO INSTALL (GOOGLE CHROME) :
//  Enable off-store extensions
//  Browse to chrome://extensions
//  Drop ogame.user.js file the webpage and click "accept"
//  for more informations, google "how to install a userscript on [your browser]"
// FEATURES :
//  - New tab : nearby inactive players
//  - New tab : active neighbours
//  - New tab : account-wise statistics (like the Empire view, but better)
//  - Adds a link to speedsim
//  - Remove ad banner on the right
//  - Adds the time remaining before each storage will be full
//  - Adds the total storage below resources on a planet in terms of production time
//  - Adds the points harvested each day above resources & the number of GT required to export 1 day of production
//  - Converts resources to time below the price of an unit
//  - Circles the limiting reagent in terms of time of production while viewing an unit price
//  - Adds the remaining time before being able to construct an unit when viewing it
//  - Adds maximum buildable units for an unit when viewing it
//  - Adds rentability time when viewing details of a mine and plasma technology
// ==/UserScript==

var userscript = function() {
    // var
    var universe = $('[name="ogame-universe"]').attr('content');
    var currentPlanet = $('[name="ogame-planet-coordinates"]').attr('content');
    var serverLang = universe.split('-')[1].split('.')[0];
    var serverNum = universe.split('-')[0].replace('s', '');
    var playerName = $('[name="ogame-player-name"]').attr('content');

    // trade rate
    var tradeRate = [2.0, 1.5, 1.0];
    var tradeRateStr = '2 / 1.5 / 1';

    // gets config from local storage
    var config = getConfig() || {};

    // translations
    var lang = (navigator.language || navigator.browserLanguage || 'en').substring(0, 2);
    var translations = {
        'fr': {
            'UNIT_METAL': 'Métal',
            'UNIT_CRYSTAL': 'Cristal',
            'UNIT_DEUTERIUM': 'Deutérium',
            'UNIT_ENERGY': 'Energie',
            'TIME_SECOND': 's',
            'TIME_MINUTE': 'm',
            'TIME_HOUR': 'h',
            'TIME_DAY': 'j',
            'ECONOMY_TIME': 'Nécéssite {time} d\'économies avec échange de ressources',
            'BUILDABLE_IN': 'Construction possible dans : {time}',
            'BUILDABLE_NOW': 'Construction possible dès maintenant',
            'ROI': 'Investissement rentable en : {time} à taux {tradeRate}',
            'ECONOMY_SCORE': 'Eco',
            'ECONOMY_SCORE_LONG': 'Total des points gagnés par ce joueur grâce aux mines : {scoreEco}',
            'MILITARY_SCORE': 'Militaire',
            'MILITARY_SCORE_LONG': '{scoreMilitary} points militaires ({ships} vaisseaux)',
            'COORDINATES': 'Position',
            'PLAYER': 'Joueur',
            'NOTE': 'Note',
            'ACTIONS': 'Actions',
            'PLANET_DEFENDED': 'Planète défendue',
            'PLANET_NEEDSPY': 'Rapport d\'espionnage incomplet',
            'MENU_NEIGHBOURS_ACTIVE': 'Voisins actifs',
            'MENU_NEIGHBOURS_INACTIVE': 'Inactifs proches',
            'MENU_STATS': 'Statistiques',
            'MENU_FIGHTSIM': 'Sim. Combat',
            'STATS_ALL': 'Statistiques pour toutes les planètes',
            'STATS_FOR': 'Statistiques pour',
            'STATS_DAILY': 'Production journalière',
            'STATS_RATIO': 'Ratio de production (rapport au ',
            'RESET_STATS': 'Réinitialiser les statistiques'
        },
        'en': {
            'UNIT_METAL': 'Metal',
            'UNIT_CRYSTAL': 'Crystal',
            'UNIT_DEUTERIUM': 'Deuterium',
            'UNIT_ENERGY': 'Energy',
            'TIME_SECOND': 's',
            'TIME_MINUTE': 'm',
            'TIME_HOUR': 'h',
            'TIME_DAY': 'd',
            'ECONOMY_TIME': 'Requires {time} of resource-gathering (with trade)',
            'BUILDABLE_IN': 'Buildable in : {time}',
            'BUILDABLE_NOW': 'Buildable now',
            'ROI': 'Return on investment : {time} with trade rate {tradeRate}',
            'ECONOMY_SCORE': 'Eco',
            'ECONOMY_SCORE_LONG': 'Sum of points spent in mines : {scoreEco}',
            'MILITARY_SCORE': 'Military',
            'MILITARY_SCORE_LONG': '{scoreMilitary} military points ({ships} ships)',
            'COORDINATES': 'Position',
            'PLAYER': 'Player',
            'NOTE': 'Note',
            'ACTIONS': 'Actions',
            'PLANET_DEFENDED': 'Planet defended',
            'PLANET_NEEDSPY': 'Spy report incomplete',
            'MENU_NEIGHBOURS_ACTIVE': 'Active neighbours',
            'MENU_NEIGHBOURS_INACTIVE': 'Nearby idles',
            'MENU_STATS': 'Statistics',
            'MENU_FIGHTSIM': 'Fight simulator',
            'STATS_ALL': 'Statistics for all planets',
            'STATS_FOR': 'Statistics for',
            'STATS_DAILY': 'Daily production',
            'STATS_RATIO': 'Production ratio (relative to ',
            'RESET_STATS': 'Reset stats'
        },
        'es': {
            'UNIT_METAL': 'Metal',
            'UNIT_CRYSTAL': 'Cristal',
            'UNIT_DEUTERIUM': 'Deuterio',
            'UNIT_ENERGY': 'Energía',
            'TIME_SECOND': 's',
            'TIME_MINUTE': 'm',
            'TIME_HOUR': 'h',
            'TIME_DAY': 'd',
            'ECONOMY_TIME': 'Requiere {time} con intercambio de recursos',
            'BUILDABLE_IN': 'Construcción posible en {time}',
            'BUILDABLE_NOW': 'Construcción lista para comenzar',
            'ROI': 'Inversión rentable en {time} a tasa {tradeRate}',
            'ECONOMY_SCORE': 'Eco',
            'ECONOMY_SCORE_LONG': 'Sumatoria de puntos del jugador por economía {scoreEco}',
            'MILITARY_SCORE': 'Militar',
            'MILITARY_SCORE_LONG': '{scoreMilitary} puntos militares ({ships} naves)',
            'COORDINATES': 'Posición',
            'PLAYER': 'Jugador',
            'NOTE': 'Nota',
            'ACTIONS': ' Acciones',
            'PLANET_DEFENDED': 'El Planeta defendió',
            'PLANET_NEEDSPY': 'espionaje incompleto',
            'MENU_NEIGHBOURS_ACTIVE': 'Vecinos Activos',
            'MENU_NEIGHBOURS_INACTIVE': 'Inactivos cercanos',
            'MENU_STATS': 'Estadísticas',
            'MENU_FIGHTSIM': 'Sim. Combate ',
            'STATS_ALL ': 'Estadísticas para todos los planetas',
            'STATS_FOR': 'Estadísticas para',
            'STATS_DAILY': 'Producción diaria',
            'STATS_RATIO': 'Relación de producción (en comparación con',
            'RESET_STATS': 'Restaurar estadísticas'
        },
        'tr': {
            'UNIT_METAL': 'Metal',
            'UNIT_CRYSTAL': 'Kristal',
            'UNIT_DEUTERIUM': 'Deuterium',
            'UNIT_ENERGY': 'Enerji',
            'TIME_SECOND': 'sn',
            'TIME_MINUTE': 'dk',
            'TIME_HOUR': 's',
            'TIME_DAY': 'g',
            'ECONOMY_TIME': 'Gereken kaynak toplama zamanı (Tüccar ile): {time}',
            'BUILDABLE_IN': 'Kurmak için gereken süre: {time}',
            'BUILDABLE_NOW': 'Şu anda kurulabilir!',
            'ROI': 'Yatırım dönüşü: {time} - Tüccar ile: {tradeRate}',
            'ECONOMY_SCORE': 'Eko',
            'ECONOMY_SCORE_LONG': 'Madene harcanan puan toplamı : {scoreEco}',
            'MILITARY_SCORE': 'Askeri',
            'MILITARY_SCORE_LONG': '{scoreMilitary} askeri puan ({ships} gemi)',
            'COORDINATES': 'Pozisyon',
            'PLAYER': 'Oyuncu',
            'NOTE': 'Not',
            'ACTIONS': 'Aksiyonlar',
            'PLANET_DEFENDED': 'Gezegen korundu',
            'PLANET_NEEDSPY': 'Casus raporu eksik',
            'MENU_NEIGHBOURS_ACTIVE': 'Aktif Komşular',
            'MENU_NEIGHBOURS_INACTIVE': 'İnaktif Komşular',
            'MENU_STATS': 'İstatistik',
            'MENU_FIGHTSIM': 'Savaş Simulatörü',
            'STATS_ALL': 'İstatistik (Tümü)',
            'STATS_FOR': 'İstatistik - ',
            'STATS_DAILY': 'Günlük Üretim',
            'STATS_RATIO': 'Üretim Oranı (İlişki: ',
            'RESET_STATS': 'Sıfırlama istatistikler'
        },
        'de': {
            'UNIT_METAL': 'Metall',
            'UNIT_CRYSTAL': 'Kristall',
            'UNIT_DEUTERIUM': 'Deuterium',
            'UNIT_ENERGY': 'Energie',
            'TIME_SECOND': 's',
            'TIME_MINUTE': 'm',
            'TIME_HOUR': 'h',
            'TIME_DAY': 'j',
            'ECONOMY_TIME': 'Benötigt {time} of resource-gathering (with trade)',
            'BUILDABLE_IN': 'Baubar in : {time}',
            'BUILDABLE_NOW': 'Jetzt baubar',
            'ROI': 'Return on investment : {time} mit Handelskurs {tradeRate}',
            'ECONOMY_SCORE': 'Eco',
            'ECONOMY_SCORE_LONG': 'Summe der Punke in Minen : {scoreEco}',
            'MILITARY_SCORE': 'Militär',
            'MILITARY_SCORE_LONG': '{scoreMilitary} militärische Punkte ({ships} Schiffe)',
            'COORDINATES': 'Position',
            'PLAYER': 'Spieler',
            'NOTE': 'Notiz',
            'ACTIONS': 'Aktionen',
            'PLANET_DEFENDED': 'Planet verteidigt',
            'PLANET_NEEDSPY': 'Spionagebericht unvollständig',
            'MENU_NEIGHBOURS_ACTIVE': 'Aktive Nachbarn',
            'MENU_NEIGHBOURS_INACTIVE': 'Nahe Inaktive',
            'MENU_STATS': 'Statistiken',
            'MENU_FIGHTSIM': 'Kampfsimulator',
            'STATS_ALL': 'Statistik über alle Planeten',
            'STATS_FOR': 'Statistik für',
            'STATS_DAILY': 'Tägliche Produktion',
            'STATS_RATIO': 'Produktionsverhältnis (relativ zu ',
            'RESET_STATS': 'Statistik zurücksetzen'
        }
    };
    if(!translations[lang]) {
        lang = 'en';
    }

    // sets an empty resources object
    var resources = {
        metal: {
            now: 0,
            max: 0,
            prod: 0,
            worth: ((Math.min(tradeRate[0], tradeRate[1], tradeRate[2]) / tradeRate[0]) * Math.max(tradeRate[0], tradeRate[1], tradeRate[2]) * 100) / 100
        },
        crystal: {
            now: 0,
            max: 0,
            prod: 0,
            worth: ((Math.min(tradeRate[0], tradeRate[1], tradeRate[2]) / tradeRate[1]) * Math.max(tradeRate[0], tradeRate[1], tradeRate[2]) * 100) / 100
        },
        deuterium: {
            now: 0,
            max: 0,
            prod: 0,
            worth: ((Math.min(tradeRate[0], tradeRate[1], tradeRate[2]) / tradeRate[2]) * Math.max(tradeRate[0], tradeRate[1], tradeRate[2]) * 100) / 100
        }
    };

    // parse resources data from the DOM and sets the resources object
    var f = initAjaxResourcebox.toString();
    f = f.replace('function initAjaxResourcebox(){reloadResources(', '');
    f = f.substring(0, f.length - 3);
    var data = JSON.parse(f);
    resources.metal.now = data.metal.resources.actual;
    resources.metal.max = data.metal.resources.max;
    resources.metal.prod = data.metal.resources.production;
    resources.crystal.now = data.crystal.resources.actual;
    resources.crystal.max = data.crystal.resources.max;
    resources.crystal.prod = data.crystal.resources.production;
    resources.deuterium.now = data.deuterium.resources.actual;
    resources.deuterium.max = data.deuterium.resources.max;
    resources.deuterium.prod = data.deuterium.resources.production;

    // if on the resources page
    if(document.location.search.indexOf('resources') !== -1) {
        // get mines level
        resources.metal.level = parseInt($('.supply1 .level').text().replace($('.supply1 .level').children().text(), '').trim());
        resources.crystal.level = parseInt($('.supply2 .level').text().replace($('.supply2 .level').children().text(), '').trim());
        resources.deuterium.level = parseInt($('.supply3 .level').text().replace($('.supply3 .level').children().text(), '').trim());
    }

    // indicates storage left (in time) and total storage time
    $('#metal_box .value').append('<br><span class="enhancement storageleft">' + prettyTime((resources.metal.max - resources.metal.now) / resources.metal.prod) + (prettyTime(resources.metal.max / resources.metal.prod).length > 0 ? ' (' + prettyTime(resources.metal.max / resources.metal.prod) + ')' : '') + '</span>');
    $('#crystal_box .value').append('<br><span class="enhancement storageleft">' + prettyTime((resources.crystal.max - resources.crystal.now) / resources.crystal.prod) + (prettyTime(resources.crystal.max / resources.crystal.prod).length > 0 ? ' (' + prettyTime(resources.crystal.max / resources.crystal.prod) + ')' : '') + '</span>');
    $('#deuterium_box .value').append('<br><span class="enhancement storageleft">' + prettyTime((resources.deuterium.max - resources.deuterium.now) / resources.deuterium.prod) + (prettyTime(resources.deuterium.max / resources.deuterium.prod).length > 0 ? ' (' + prettyTime(resources.deuterium.max / resources.deuterium.prod) + ')' : '') + '</span>');



    setInterval(function() {

        var times = {
            metal: 0,
            crystal: 0,
            deuterium: 0
        };
        var costs = {
            metal: 0,
            crystal: 0,
            deuterium: 0
        };
        // enhance metal tooltips
        $('.metal.tooltip:not(.enhanced)').each(function() {

            var cost = $(this).find('.cost').text().trim();
            if(cost.indexOf(',') === -1) {
                cost = cost.replace('.', '').replace('M', '000000');
            } else {
                cost = cost.replace(',', '.').replace('M', '');
                cost = cost * 1000000;
            }
            costs.metal = cost;
            var time = Math.ceil(cost / resources.metal.prod);
            $(this).append('<div class="enhancement">' + prettyTime(time) + '</div>');
            times.metal = time;
            $(this).addClass('enhanced');
        });
        // enhance crystal tooltips
        $('.crystal.tooltip:not(.enhanced)').each(function() {
            var cost = $(this).find('.cost').text().trim();
            if(cost.indexOf(',') === -1) {
                cost = cost.replace('.', '').replace('M', '000000');
            } else {
                cost = cost.replace(',', '.').replace('M', '');
                cost = cost * 1000000;
            }
            costs.crystal = cost;
            var time = Math.ceil(cost / resources.crystal.prod);
            $(this).append('<div class="enhancement">' + prettyTime(time) + '</div>');
            times.crystal = time;
            $(this).addClass('enhanced');
        });
        // enhance deuterium tooltips
        $('.deuterium.tooltip:not(.enhanced)').each(function() {
            var cost = $(this).find('.cost').text().trim();
            if(cost.indexOf(',') === -1) {
                cost = cost.replace('.', '').replace('M', '000000');
            } else {
                cost = cost.replace(',', '.').replace('M', '');
                cost = cost * 1000000;
            }
            costs.deuterium = cost;
            var time = Math.ceil(cost / resources.deuterium.prod);
            $(this).append('<div class="enhancement">' + prettyTime(time) + '</div>');
            times.deuterium = time;
            $(this).addClass('enhanced');
        });
        // enhance tooltips
        var limitingreagent = null;
        if(times.metal > 0 || times.crystal > 0 || times.deuterium > 0) {
            if(times.metal >= times.crystal && times.metal > times.deuterium) {
                $('.metal.tooltip.enhanced').addClass('limitingreagent');
                limitingreagent = 'metal';
            } else if(times.crystal >= times.metal && times.crystal > times.deuterium) {
                $('.crystal.tooltip.enhanced').addClass('limitingreagent');
                limitingreagent = 'crystal';
            } else if(times.deuterium >= times.metal && times.deuterium > times.crystal) {
                $('.deuterium.tooltip.enhanced').addClass('limitingreagent');
                limitingreagent = 'deuterium';
            }

            // enhance list above
            if(times[limitingreagent] > 0) {
                // add the time we have to keep gathering resources in order to build this unit
                var totalPrice = costs.metal * resources.metal.worth + costs.crystal * resources.crystal.worth + costs.deuterium * resources.deuterium.worth;
                var totalProd = resources.metal.prod * resources.metal.worth + resources.crystal.prod * resources.crystal.worth + resources.deuterium.prod * resources.deuterium.worth;
                $('#content .production_info').append('<li class="enhancement">' + trad('ECONOMY_TIME', { time: prettyTime(totalPrice / totalProd) }) + '</li>');

                // add the remaining time we have to gather resources in order to build this unit
                if($('#possibleInTime').length !== 0) {
                    $('#possibleInTime').parent().remove();
                }
                var availableIn = {
                    metal: -1,
                    crystal: -1,
                    deuterium: -1
                };
                availableIn.metal = Math.max(costs.metal - resources.metal.now, 0) / resources.metal.prod;
                availableIn.crystal = Math.max(costs.crystal - resources.crystal.now, 0) / resources.crystal.prod;
                availableIn.deuterium = Math.max(costs.deuterium - resources.deuterium.now, 0) / resources.deuterium.prod;
                if(isNaN(availableIn.deuterium)) {
                    availableIn.deuterium = costs.deuterium > resources.deuterium.now ? 8553600 : 0;
                }

                availableIn = Math.max(availableIn.metal, availableIn.crystal, availableIn.deuterium);

                if(availableIn === 0) {
                    $('#content .production_info').append('<li class="enhancement">' + trad('BUILDABLE_NOW') + '</li>');
                } else {
                    $('#content .production_info').append('<li class="enhancement">' + trad('BUILDABLE_IN', { time: prettyTime(availableIn) }) + '</li>');
                }
            }
        }

        // add maximum buildable
        var amount = $('#content').find('.amount:not(.enhanced)');
        if(amount.length > 0) {
            var maxMetal = resources.metal.now / costs.metal;
            var maxCrystal = resources.crystal.now / costs.crystal;
            var maxDeuterium = resources.deuterium.now / costs.deuterium;
            var max = Math.floor(Math.min(maxMetal, maxCrystal, maxDeuterium));
            if(isFinite(max)) {
                amount.append('<span class="enhancement"> (Max: ' + max + ')</span>');
            }
            amount.addClass('enhanced');
        }

        // if we are viewing a metal mine, computes rentability time
        if($('#resources_1_large:not(.enhanced)').length > 0) {
            var calculatedProduction = 30 * resources.metal.level * Math.pow(1.1, resources.metal.level) + 30;
            var ratio = resources.metal.prod * 3600 / calculatedProduction;
            var calculatedNextLevelproduction = ratio * 30 * (resources.metal.level + 1) * Math.pow(1.1, resources.metal.level + 1) + 30;
            var productionDiff = calculatedNextLevelproduction / 3600 - resources.metal.prod;
            var convertedProductionCost = costs.metal * 1.0 + costs.crystal * (resources.crystal.worth / resources.metal.worth);
            var rentabilityTime = convertedProductionCost / productionDiff;
            $('#content .production_info').append('<li class="enhancement">' + trad('ROI', { time: prettyTime(rentabilityTime), tradeRate: tradeRateStr }) + '</li>');
            $('#resources_1_large').addClass('enhanced');
        }
        // if we are viewing a crystal mine, computes rentability time
        else if($('#resources_2_large:not(.enhanced)').length > 0) {
            var calculatedProduction = 20 * resources.crystal.level * Math.pow(1.1, resources.crystal.level) + 15;
            var ratio = resources.crystal.prod * 3600 / calculatedProduction;
            var calculatedNextLevelproduction = ratio * 20 * (resources.crystal.level + 1) * Math.pow(1.1, resources.crystal.level + 1) + 15;
            var productionDiff = calculatedNextLevelproduction / 3600 - resources.crystal.prod;
            var convertedProductionCost = costs.metal * (resources.metal.worth / resources.crystal.worth) + costs.crystal * 1.0;
            var rentabilityTime = convertedProductionCost / productionDiff;
            $('#content .production_info').append('<li class="enhancement">' + trad('ROI', { time: prettyTime(rentabilityTime), tradeRate: tradeRateStr }) + '</li>');
            $('#resources_2_large').addClass('enhanced');
        }
        // if we are viewing a deuterium mine, computes rentability time
        else if($('#resources_3_large:not(.enhanced)').length > 0) {
            var calculatedProduction = 10 * resources.deuterium.level * Math.pow(1.1, resources.deuterium.level);
            var ratio = resources.deuterium.prod * 3600 / calculatedProduction;
            var calculatedNextLevelproduction = ratio * 10 * (resources.deuterium.level + 1) * Math.pow(1.1, resources.deuterium.level + 1);
            var productionDiff = calculatedNextLevelproduction / 3600 - resources.deuterium.prod;
            var convertedProductionCost = costs.metal * (resources.metal.worth / resources.deuterium.worth) + costs.crystal * (resources.crystal.worth / resources.deuterium.worth);
            var rentabilityTime = convertedProductionCost / productionDiff;
            $('#content .production_info').append('<li class="enhancement">' + trad('ROI', { time: prettyTime(rentabilityTime), tradeRate: tradeRateStr }) + '</li>');
            $('#resources_3_large').addClass('enhanced');
        }
        // if we are viewing a plasma technology, computes rentability time
        else if($('#research_122_large:not(.enhanced)').length > 0) {
            var currentProd = 0;
            var nextLevelProd = 0;
            for(var coords in config.my.planets) {
                var planet = config.my.planets[coords];
                currentProd += planet.resources.metal.prod * planet.resources.metal.worth + planet.resources.crystal.prod * planet.resources.crystal.worth + planet.resources.deuterium.prod * planet.resources.deuterium.worth;
                nextLevelProd += planet.resources.metal.prod * planet.resources.metal.worth * 1.01 + planet.resources.crystal.prod * planet.resources.crystal.worth * 1.0066 + planet.resources.deuterium.prod * planet.resources.deuterium.worth;
            }
            var prodDiff = nextLevelProd - currentProd;
            var totalPrice = costs.metal * resources.metal.worth + costs.crystal * resources.crystal.worth + costs.deuterium * resources.deuterium.worth;
            var rentabilityTime = totalPrice / prodDiff;
            $('#content .production_info').append('<li class="enhancement">' + trad('ROI', { time: prettyTime(rentabilityTime), tradeRate: tradeRateStr }) + '</li>');
            $('#research_122_large').addClass('enhanced');
        }

        // scan spy reports (only for french)
        var message = $('.ui-dialog');
        if(message.find('.ui-dialog-title').text().indexOf('Rapport d`espionnage de') !== -1) {
            message.addClass('enhanced');
            var isInactive = message.find('.status_abbr_inactive');
            var isLongInactive = message.find('.status_abbr_longinactive');
            if(isInactive.length === 0 && isLongInactive.length === 0) {
                return;
            }
            var messageContent = message.find('.showmessage:not(.enhanced)');
            if(messageContent.length > 0) {
                messageContent.addClass('enhanced');
                var energy = message.find('.material.spy').find('.areadetail').text().trim().replace('\n', '').replace(' ', '').replace('Métal', '').replace('Cristal', '').replace('Deutérium', '').replace('Energie', '').split(':')[4].trim();
                var index = 0;
                var nofleet = null;
                var nodef = null;
                var levels = null;
                message.find('.fleetdefbuildings.spy').each(function() {
                    index++;
                    if(index === 1) {
                        nofleet = $(this).text().length < 12;
                    } else if(index === 2) {
                        nodef = $(this).text().replace('Missile d`interception', '').length < 12;
                    } else if(index === 3) {
                        levels = $(this).text().replace('Bâtiment', '').replace(/Centrale.*/, '').replace('Mine de métal', ':').replace('Mine de cristal', ':').replace('Synthétiseur de deutérium', ':').split(':');
                    }
                });
                var coords = message.find('.material.spy').text().split('[')[1].split(']')[0].split(':');
                var strlevels = levels ? (levels[1] ? levels[1] : '0') + ' / ' + (levels[2] ? levels[2] : '0') + ' / ' + (levels[3] ? levels[3] : '0') : null;
                var note = '';
                if(nofleet === null || nodef === null) {
                    note = 'Rapport d\'espionnage incomplet';
                } else if(nofleet === false || nodef === false) {
                    note = 'Planète défendue';
                } else {
                    note = energy;
                    if(strlevels) {
                        note += ' - ' + strlevels;
                    }
                }
                window.editNote(coords[0], coords[1], coords[2], note);
            }
        }
    }, 100);

    // Add a menu entry for nearby inactive idle players
    var entry = $('<li class="idles enhanced"><span class="menu_icon"><div class="customMenuEntry menuImage galaxy"></div></span><a class="menubutton" href="#" accesskey="" target="_self"><span class="textlabel enhancement">' + trad('MENU_NEIGHBOURS_INACTIVE') + '</span></a></li>');
    $('#menuTable').append(entry);
    entry.click(function() {
        // ui changes
        $('.menubutton.selected').removeClass('selected');
        $('.menuImage.highlighted').removeClass('highlighted');
        $('.idles .menubutton').addClass('selected');
        $('.customMenuEntry').addClass('highlighted');

        // keeps player coordinates
        var myCoords = new Array(3);

        // finds nearby players by checking whether player is newbie or not
        if($('.planetlink.active').length > 0)
            myCoords = $('.planetlink.active').find('.planet-koords').text().replace('[', '').replace(']', '').split(':');
        else
            myCoords = $('.planetlink').find('.planet-koords').text().replace('[', '').replace(']', '').split(':');

        myCoords[0] = parseInt(myCoords[0]);
        myCoords[1] = parseInt(myCoords[1]);
        myCoords[2] = parseInt(myCoords[2]);

        var idles = [];
        for(var playerId in config.players) {
            var player = config.players[playerId];
            if(player.status === 'i' || player.status === 'I') {
                for(var i in player.planets) {
                    var planet = player.planets[i];
                    if(planet.coords[0] === myCoords[0] && Math.abs(planet.coords[1] - myCoords[1]) < 100) {
                        idles.push({
                            id: playerId,
                            name: player.name,
                            coords: planet.coords,
                            position: player.economyPosition
                        });
                    }
                }
            }
        }

        //idles.sort(function(a, b){return Math.abs(a.coords[1]-myCoords[1])-Math.abs(b.coords[1]-myCoords[1])});
        idles.sort(function(a, b) {
            return a.position - b.position;
        });

        var wrapper = $('<div class="uiEnhancementWindow"></div>');
        var table = $('<table><tr><th>' + trad('ECONOMY_SCORE') + '</th><th>' + trad('COORDINATES') + '</th><th>' + trad('PLAYER') + '</th><th>' + trad('NOTE') + '</th><th>' + trad('ACTIONS') + '</th></tr></table>');
        for(var i = 0; i < idles.length; i++) {
            var el = $('<tr id="planet_' + idles[i].coords[0] + '_' + idles[i].coords[1] + '_' + idles[i].coords[2] + '"></tr>');
            el.append($('<td><a href="?page=highscore&searchRelId=' + idles[i].id + '&category=1&type=1">' + idles[i].position + '</a></td>'));
            el.append($('<td><a href="/game/index.php?page=galaxy&galaxy=' + idles[i].coords[0] + '&system=' + idles[i].coords[1] + '&position=' + idles[i].coords[2] + '">[' + idles[i].coords[0] + ':' + idles[i].coords[1] + ':' + idles[i].coords[2] + ']</a></td>'));
            el.append($('<td>' + idles[i].name + '</td>'));
            el.append($('<td width="100%"><input value="' + (config && config.planetNotes && config.planetNotes[idles[i].coords[0] + ':' + idles[i].coords[1] + ':' + idles[i].coords[2]] ? config.planetNotes[idles[i].coords[0] + ':' + idles[i].coords[1] + ':' + idles[i].coords[2]] : '') + '" onkeyup="editNote(' + idles[i].coords[0] + ',' + idles[i].coords[1] + ',' + idles[i].coords[2] + ',this.value);return false;" style="width:96.5%;" type="text"/></td>'));
            // sendShips(mission, galaxy, system, position, type, shipCount)
            el.append($('<td><a class="tooltip js_hideTipOnMobile espionage" title="" href="javascript:void(0);" onclick="spy(' + idles[i].coords[0] + ',' + idles[i].coords[1] + ',' + idles[i].coords[2] + ');return false;"><span class="icon icon_eye"></span></a>&nbsp;<a href="javascript:void(0);" onclick="toggleIgnorePlanet(' + idles[i].coords[0] + ',' + idles[i].coords[1] + ',' + idles[i].coords[2] + ')"><span class="icon icon_against"></span></a>&nbsp;<a href="?page=fleet1&galaxy=' + idles[i].coords[0] + '&system=' + idles[i].coords[1] + '&position=' + idles[i].coords[2] + '&type=1&mission=1" onclick="$(this).find(\'.icon\').removeClass(\'icon_fastforward\').addClass(\'icon_checkmark\');" target="_blank"><span class="icon icon_fastforward"></span></a></td>'));
            if(config && config.ignoredPlanets && config.ignoredPlanets[idles[i].coords[0] + ':' + idles[i].coords[1] + ':' + idles[i].coords[2]]) {
                el.addClass('ignore');
            }
            table.append(el);
        }
        wrapper.append(table);

        // insert html
        var eventboxContent = $('#eventboxContent');
        $('#contentWrapper').html(eventboxContent);
        $('#contentWrapper').append(wrapper);
    });

    // Add a menu entry for statistics
    var statsSntry = $('<li class="stats enhanced"><span class="menu_icon"><div class="customMenuEntry2 menuImage empire"></div></span><a class="menubutton" href="#" accesskey="" target="_self"><span class="textlabel enhancement">' + trad('MENU_STATS') + '</span></a></li>');
    $('#menuTable').append(statsSntry);
    statsSntry.click(function() {
        // ui changes
        $('.menubutton.selected').removeClass('selected');
        $('.menuImage.highlighted').removeClass('highlighted');
        $('.stats .menubutton').addClass('selected');
        $('.customMenuEntry2').addClass('highlighted');

        var wrapper = $('<div class="uiEnhancementWindow"></div>');

        var totalProd = {
            metal: 0,
            crystal: 0,
            deuterium: 0,
            metalLevel: 0,
            crystalLevel: 0,
            deuteriumLevel: 0,
            planetCount: 0
        };
        for(var coords in config.my.planets) {
            var planet = config.my.planets[coords];
            var stats = $('<div class="planetstats"></div>');
            stats.append('<h3>' + trad('STATS_FOR') + ' ' + planet.name + ' ' + coords + '</h3>');
            stats.append($('<div>' + trad('STATS_DAILY') + ' (' + trad('UNIT_METAL') + ') : <span class="undermark">+' + prettyCount(Math.floor(planet.resources.metal.prod * 3600 * 24)) + '</span></div>'));
            stats.append($('<div>' + trad('STATS_DAILY') + ' (' + trad('UNIT_CRYSTAL') + ') : <span class="undermark">+' + prettyCount(Math.floor(planet.resources.crystal.prod * 3600 * 24)) + '</span></div>'));
            stats.append($('<div>' + trad('STATS_DAILY') + ' (' + trad('UNIT_DEUTERIUM') + ') : <span class="undermark">+' + prettyCount(Math.floor(planet.resources.deuterium.prod * 3600 * 24)) + '</span></div>'));
            stats.append($('<div class="spacer"></div>'));
            //stats.append($('<div>Niveau des mines : ' + planet.resources.metal.level + ' / ' + planet.resources.crystal.level + ' / ' + planet.resources.deuterium.level + '</div>'));

            totalProd.metal += planet.resources.metal.prod;
            totalProd.crystal += planet.resources.crystal.prod;
            totalProd.deuterium += planet.resources.deuterium.prod;
            totalProd.metalLevel += (planet.resources.metal.level || 0);
            totalProd.crystalLevel += (planet.resources.crystal.level || 0);
            totalProd.deuteriumLevel += (planet.resources.deuterium.level || 0);
            totalProd.planetCount++;

            wrapper.append(stats);
        }
        totalProd.metalLevel /= Object.keys(config.my.planets).length;
        totalProd.crystalLevel /= Object.keys(config.my.planets).length;
        totalProd.deuteriumLevel /= Object.keys(config.my.planets).length;

        // global stats
        var stats = $('<div class="planetstats"></div>');
        stats.append('<h3>' + trad('STATS_ALL') + '</h3>');
        stats.append($('<div>' + trad('STATS_DAILY') + ' (' + trad('UNIT_METAL') + ') : <span class="undermark">+' + prettyCount(Math.floor(totalProd.metal * 3600 * 24)) + '</span></div>'));
        stats.append($('<div>' + trad('STATS_DAILY') + ' (' + trad('UNIT_CRYSTAL') + ') : <span class="undermark">+' + prettyCount(Math.floor(totalProd.crystal * 3600 * 24)) + '</span></div>'));
        stats.append($('<div>' + trad('STATS_DAILY') + ' (' + trad('UNIT_DEUTERIUM') + ') : <span class="undermark">+' + prettyCount(Math.floor(totalProd.deuterium * 3600 * 24)) + '</span></div>'));
        stats.append($('<div class="spacer"></div>'));
        stats.append($('<div>' + trad('STATS_RATIO') + trad('UNIT_METAL') + ') : 1 / ' + Math.floor(100 * totalProd.crystal / totalProd.metal) / 100 + ' / ' + Math.floor(100 * totalProd.deuterium / totalProd.metal) / 100 + '</div>'));
        stats.append($('<div>' + trad('STATS_RATIO') + trad('UNIT_CRYSTAL') + ') : ' + Math.floor(100 * totalProd.metal / totalProd.crystal) / 100 + ' / 1 / ' + Math.floor(100 * totalProd.deuterium / totalProd.crystal) / 100 + '</div>'));
        stats.append($('<div>' + trad('STATS_RATIO') + trad('UNIT_DEUTERIUM') + ') : ' + Math.floor(100 * totalProd.metal / totalProd.deuterium) / 100 + ' / ' + Math.floor(100 * totalProd.crystal / totalProd.deuterium) / 100 + ' / 1</div>'));
        stats.append($('<div class="spacer"></div>'));
        //stats.append($('<div>Niveau moyen des mines : ' + Math.floor(10*totalProd.metalLevel)/10 + ' / ' + Math.floor(10*totalProd.crystalLevel)/10 + ' / ' + Math.floor(10*totalProd.deuteriumLevel)/10 + '</div>'));

        wrapper.prepend(stats);

        // add reset button
        var resetStatsButton = $('<div style="text-align: right;padding-right: .5em;"><a href="#" class="btn_blue">' + trad('RESET_STATS') + '</a></div>');
        wrapper.append(resetStatsButton);
        resetStatsButton.click(function() {
            delete config.my.planets;
            saveConfig(config);
            window.location.reload();
        });

        // insert html
        var eventboxContent = $('#eventboxContent');
        $('#contentWrapper').html(eventboxContent);
        $('#contentWrapper').append(wrapper);
    });

    // Add a menu entry for neighbours
    var neighboursEntry = $('<li class="neighbours enhanced"><span class="menu_icon"><div class="customMenuEntry4 menuImage defense"></div></span><a class="menubutton" href="#" accesskey="" target="_self"><span class="textlabel enhancement">' + trad('MENU_NEIGHBOURS_ACTIVE') + '</span></a></li>');
    $('#menuTable').append(neighboursEntry);
    neighboursEntry.click(function() {
        // ui changes
        $('.menubutton.selected').removeClass('selected');
        $('.menuImage.highlighted').removeClass('highlighted');
        $('.neighbours .menubutton').addClass('selected');
        $('.customMenuEntry4').addClass('highlighted');

        // keeps player coordinates
        var myCoords = new Array(3);

        // finds nearby players by checking whether player is newbie or not
        if($('.planetlink.active').length > 0)
            myCoords = $('.planetlink.active').find('.planet-koords').text().replace('[', '').replace(']', '').split(':');
        else
            myCoords = $('.planetlink').find('.planet-koords').text().replace('[', '').replace(']', '').split(':');

        myCoords[0] = parseInt(myCoords[0]);
        myCoords[1] = parseInt(myCoords[1]);
        myCoords[2] = parseInt(myCoords[2]);

        var neighbours = [];
        for(var playerId in config.players) {
            var player = config.players[playerId];
            if(!player.status || !/[iv]/i.test(player.status)) {
                for(var i in player.planets) {
                    var planet = player.planets[i];
                    if(planet.coords[0] === myCoords[0] && Math.abs(planet.coords[1] - myCoords[1]) < 50) {
                        console.debug('voisin', player);
                        neighbours.push({
                            id: playerId,
                            name: player.name,
                            coords: planet.coords,
                            militaryPosition: player.militaryPosition,
                            militaryScore: player.militaryScore,
                            economyScore: player.economyScore,
                            ships: player.ships
                        });
                    }
                }
            }
        }

        //neighbours.sort(function(a, b){return Math.abs(a.coords[1]-myCoords[1])-Math.abs(b.coords[1]-myCoords[1])});
        neighbours.sort(function(a, b) {
            return b.militaryScore - a.militaryScore;
        });

        var wrapper = $('<div class="uiEnhancementWindow"></div>');
        var table = $('<table><tr><th>' + trad('COORDINATES') + '</th><th>' + trad('ECONOMY_SCORE') + '</th><th>' + trad('MILITARY_SCORE') + '</th><th>' + trad('PLAYER') + '</th><th>' + trad('NOTE') + '</th><th>' + trad('ACTIONS') + '</th></tr></table>');
        var playerName = $('#playerName .textBeefy').text().trim();
        for(var i = 0; i < neighbours.length; i++) {
            var el = $('<tr class="' + (playerName === neighbours[i].name ? 'currentPlayer' : '') + '" id="planet_' + neighbours[i].coords[0] + '_' + neighbours[i].coords[1] + '_' + neighbours[i].coords[2] + '"></tr>');
            el.append($('<td><a href="/game/index.php?page=galaxy&galaxy=' + neighbours[i].coords[0] + '&system=' + neighbours[i].coords[1] + '&position=' + neighbours[i].coords[2] + '">[' + neighbours[i].coords[0] + ':' + neighbours[i].coords[1] + ':' + neighbours[i].coords[2] + ']</a></td>'));
            el.append($('<td class="tooltip js_hideTipOnMobile" title="' + trad('ECONOMY_SCORE_LONG', { noBold: true, scoreEco: neighbours[i].economyScore }) + '"><a href="?page=highscore&searchRelId=' + neighbours[i].id + '&category=1&type=1">' + prettyNumber(neighbours[i].economyScore) + '</a></td>'));
            el.append($('<td class="tooltip js_hideTipOnMobile" title="' + trad('MILITARY_SCORE_LONG', { noBold: true, scoreMilitary: neighbours[i].militaryScore, ships: (neighbours[i].ships ? neighbours[i].ships : '0') }) + '"><a href="?page=highscore&searchRelId=' + neighbours[i].id + '&category=1&type=3">' + prettyNumber(neighbours[i].militaryScore) + ' (' + prettyNumber(neighbours[i].ships ? neighbours[i].ships : '0') + ')</a></td>'));
            el.append($('<td class="tooltip js_hideTipOnMobile" title="' + neighbours[i].name + '">' + neighbours[i].name + '</td>'));
            el.append($('<td width="100%"><input value="' + (config && config.planetNotes && config.planetNotes[neighbours[i].coords[0] + ':' + neighbours[i].coords[1] + ':' + neighbours[i].coords[2]] ? config.planetNotes[neighbours[i].coords[0] + ':' + neighbours[i].coords[1] + ':' + neighbours[i].coords[2]] : '') + '" onkeyup="editNote(' + neighbours[i].coords[0] + ',' + neighbours[i].coords[1] + ',' + neighbours[i].coords[2] + ',this.value);return false;" style="width:96.5%;" type="text"/></td>'));
            // sendShips(mission, galaxy, system, position, type, shipCount)
            el.append($('<td> <a espionage" href="javascript:void(0);" onclick="spy(' + neighbours[i].coords[0] + ',' + neighbours[i].coords[1] + ',' + neighbours[i].coords[2] + ');return false;"><span class="icon icon_eye"></span></a>&nbsp;<a href="javascript:void(0);" onclick="toggleIgnorePlanet(' + neighbours[i].coords[0] + ',' + neighbours[i].coords[1] + ',' + neighbours[i].coords[2] + ')"><span class="icon icon_against"></span></a>&nbsp; <a href="?page=fleet1&galaxy=' + neighbours[i].coords[0] + '&system=' + neighbours[i].coords[1] + '&position=' + neighbours[i].coords[2] + '&type=1&mission=1" onclick="$(this).find(\'.icon\').removeClass(\'icon_fastforward\').addClass(\'icon_checkmark\');" target="_blank"><span class="icon icon_fastforward"></span></a> </td>'));
            if(config && config.ignoredPlanets && config.ignoredPlanets[neighbours[i].coords[0] + ':' + neighbours[i].coords[1] + ':' + neighbours[i].coords[2]]) {
                el.addClass('ignore');
            }
            table.append(el);
        }
        wrapper.append(table);

        // insert html
        var eventboxContent = $('#eventboxContent');
        $('#contentWrapper').html(eventboxContent);
        $('#contentWrapper').append(wrapper);
    });

    // Add a menu entry for fight simulator
    var statsSntry = $('<li class="sim enhanced"><span class="menu_icon"><div class="customMenuEntry3 menuImage fleet1"></div></span><a class="menubutton" href="https://trashsim.universeview.be/" accesskey="" target="_blank"><span class="textlabel enhancement">' + trad('MENU_FIGHTSIM') + '</span></a></li>');
    $('#menuTable').append(statsSntry);

    // Add a menu entry for war riders
    var warRidersEntry = $('<li class="sim enhanced"><span class="menu_icon"><div class="customMenuEntry3 menuImage fleet1"></div></span><a class="menubutton" href="http://www.war-riders.de/' + serverLang + '/' + serverNum + '/search/player/' + playerName + '" accesskey="" target="_blank"><span class="textlabel enhancement">WarRiders.de</span></a></li>');
    $('#menuTable').append(warRidersEntry);

    window.spy = function(galaxy, system, position) {
        $.ajax('?page=minifleet&ajax=1', {
            data: {
                mission: 6,
                galaxy: galaxy,
                system: system,
                position: position,
                type: 1,
                shipCount: config.spyProbeCount || 9,
                token: miniFleetToken
            },
            dataType: 'json',
            type: 'POST',
            success: function(a) {
                if(a.response.success) {
                    $('#planet_' + galaxy + '_' + system + '_' + position + ' .icon_eye').addClass('disabled');
                }
                miniFleetToken = a.newToken;
            }
        });
    };

    window.toggleIgnorePlanet = function(galaxy, system, position) {
        config.ignoredPlanets = config.ignoredPlanets || {};
        var key = galaxy + ':' + system + ':' + position;
        var el = $('#planet_' + galaxy + '_' + system + '_' + position);
        if(config.ignoredPlanets[key]) {
            config.ignoredPlanets[key] = false;
            el.removeClass('ignore');
        } else {
            config.ignoredPlanets[key] = true;
            el.addClass('ignore');
        }
        saveConfig(config);
    };

    window.editNote = function(galaxy, system, position, text) {
        config.planetNotes = config.planetNotes || {};
        var key = galaxy + ':' + system + ':' + position;
        config.planetNotes[key] = text;
        saveConfig(config);
    };

    if(!config.my) { config.my = {}; }
    if(!config.my.planets) { config.my.planets = {}; }

    if($('#planetList').children().length == 1) {
        var link = $($('#planetList').children()[0]).find('.planetlink');
        var planetName = link.find('.planet-name').text();
        var planetCoords = link.find('.planet-koords').text();

        config.my.planets[planetCoords] = {};
        config.my.planets[planetCoords].name = planetName;
        config.my.planets[planetCoords].resources = resources;
    } else {
        $('#planetList').children().each(function() {
            var link = $(this).find('.planetlink');
            var planetName = link.find('.planet-name').text();
            var planetCoords = link.find('.planet-koords').text();
            if(link.hasClass('active')) {
                config.my.planets[planetCoords] = {};
                config.my.planets[planetCoords].name = planetName;
                config.my.planets[planetCoords].resources = resources;
            }
        });
    }

    saveConfig(config);
    console.debug('config.my', config.my);

    // util functions
    function prettyTime(seconds) {
        if(seconds <= 0 || isNaN(seconds) || !isFinite(seconds)) {
            return '';
        }
        seconds = Math.floor(seconds);
        var ret = '';
        var units = 0;
        if(seconds > 86400) {
            var days = Math.floor(seconds / 86400);
            ret += days + trad('TIME_DAY') + ' ';
            seconds -= days * 86400;
            units++;
        }
        if(seconds > 3600) {
            var hours = Math.floor(seconds / 3600);
            ret += hours + trad('TIME_HOUR') + ' ';
            seconds -= hours * 3600;
            units++;
            if(units >= 2) return ret.trim();
        }
        if(seconds > 60) {
            var minutes = Math.floor(seconds / 60);
            ret += minutes + trad('TIME_MINUTE') + ' ';
            seconds -= minutes * 60;
            units++;
            if(units >= 2) return ret.trim();
        }
        ret += seconds + trad('TIME_SECOND') + ' ';
        return ret.trim();
    }

    function prettyCount(count) {
        return count.toString().dotify();
    }

    String.prototype.dotify = function dotify() {
        return this.replace(/(^|[^\w.])(\d{4,})/g, function($0, $1, $2) {
            return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, '$&\.');
        });
    };

    function getConfig() {
        if(typeof(Storage) !== 'undefined') {
            return JSON.parse(localStorage.getItem('og-enhancements')) || {};
        } else {
            return null;
        }
    }

    function saveConfig(config) {
        if(typeof(Storage) !== 'undefined') {
            localStorage.setItem('og-enhancements', JSON.stringify(config));
        }
    }

    function loadUniverseApi(cb) {
        $.ajax({
            url: '/api/players.xml',
            dataType: 'xml',
            success: function(data) {
                var players = {};
                var id, status, name, el;
                $('player', data).each(function() {
                    el = $(this);
                    id = el.attr('id');
                    status = el.attr('status');
                    name = el.attr('name');
                    players[id] = {
                        status: status,
                        name: name,
                        planets: []
                    };
                });
                $.ajax({
                    url: '/api/universe.xml',
                    dataType: 'xml',
                    success: function(data) {
                        var player, name, coords, el;
                        $('planet', data).each(function() {
                            el = $(this);
                            player = el.attr('player');
                            name = el.attr('name');
                            coords = el.attr('coords').split(':');
                            coords[0] = parseInt(coords[0]);
                            coords[1] = parseInt(coords[1]);
                            coords[2] = parseInt(coords[2]);
                            if(players[player]) {
                                players[player].planets.push({
                                    name: name,
                                    coords: coords
                                });
                            }
                        });
                        $.ajax({
                            url: '/api/highscore.xml?category=1&type=1',
                            dataType: 'xml',
                            success: function(data) {
                                var position, id, score, el;
                                $('player', data).each(function() {
                                    el = $(this);
                                    position = el.attr('position');
                                    id = el.attr('id');
                                    score = el.attr('score');
                                    if(players[id]) {
                                        players[id].economyPosition = position;
                                        players[id].economyScore = score;
                                    }
                                });
                                $.ajax({
                                    url: '/api/highscore.xml?category=1&type=3',
                                    dataType: 'xml',
                                    success: function(data) {
                                        var position, id, score, ships, el;
                                        $('player', data).each(function() {
                                            el = $(this);
                                            position = el.attr('position');
                                            id = el.attr('id');
                                            score = el.attr('score');
                                            ships = el.attr('ships');
                                            if(players[id]) {
                                                players[id].militaryPosition = position;
                                                players[id].militaryScore = score;
                                                players[id].ships = ships;
                                            }
                                        });
                                        cb && cb(players);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    };

    function trad(key, args) {
        var ret = translations[lang][key] || '';
        for(var k in args) {
            if(args['noBold']) ret = ret.replace('{' + k + '}', args[k]);
            else ret = ret.replace('{' + k + '}', '<span class="boldy">' + args[k] + '</span>');
        }
        return ret;
    }

    function prettyNumber(num) {
        if(num > 1000000) {
            return Math.round(num * 10 / 1000000) / 10 + 'M'
        } else if(num > 1000) {
            return Math.round(num / 1000) + 'k';
        } else return num;
    }

    // refreshes the universe using the API once an hour
    if(!config.lastPlayersUpdate || config.lastPlayersUpdate < Date.now() - 3600000) {
        console.debug('Mise à jour de la liste des joueurs...');
        loadUniverseApi(function(players) {
            console.debug('Liste des joueurs mise à jour.');
            config.players = players;
            config.lastPlayersUpdate = Date.now();
            saveConfig(config);
            console.debug('players', players);
        });
    }
};

// inject user script into the document
var script = document.createElement('script');
script.textContent = '(' + userscript + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);

// inject style into the document
var style = document.createElement('style');
style.textContent = '.enhancement { color: #AB7AFF; }';
style.textContent += 'ul.production_info { height: 66px; padding: .5em 1em; }';
style.textContent += 'ul.production_info li { line-height: 1.4em; }';
style.textContent += '.limitingreagent { outline: 1px dotted #; outline-offset: 2px; }';
style.textContent += '.costs_wrap #costs { margin: 5px 0 0 0; }';
style.textContent += '.storageleft { position: absolute; bottom: -11px; left: -35%; width: 170%; }';
style.textContent += '.boldy { font-weight: bold; }';
style.textContent += '.resourcesgt { border-bottom:1px dotted #AB7AFF; position: absolute; bottom: 50px; left: -150%; width: 400%; font-size: 1.1em; padding-bottom: 1px; }';
style.textContent += '.uiEnhancementWindow { padding: 1em; }';
style.textContent += '.uiEnhancementWindow table { border-spacing:15px 5px; text-align:center; width: 100%; }';
style.textContent += '.uiEnhancementWindow table th { padding: .5em; font-weight: bold; font-size:1.15em; }';
style.textContent += '.uiEnhancementWindow table td { background: black; border-radius: 3px; line-height:8px; max-width: 2em; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }';
style.textContent += '.uiEnhancementWindow a { color:white; text-decoration:none; }';
style.textContent += '.uiEnhancementWindow tr.ignore { opacity:.15; }';
style.textContent += '.icon.icon_eye.disabled:hover { background-position: 0 -48px; }';
style.textContent += '.planetstats { background: rgba(0,0,0,0.6); padding: 1em; line-height: 1.4em; border-radius: 5px; margin: .5em; }';
style.textContent += '.planetstats h3 { font-size: 1.2em; font-weight: bold; margin-bottom: .5em; }';
style.textContent += '.currentPlayer td { background: #444 !important; }';
style.textContent += '.spacer { height: .3em }';
(document.head || document.documentElement).appendChild(style);