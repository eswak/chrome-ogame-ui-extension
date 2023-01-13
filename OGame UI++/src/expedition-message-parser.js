'use strict';
window._addExpeditionMessageParserInterval = function _addExpeditionMessageParserInterval() {
  // don't do anything if we're not on the messages page
  if (document.location.href.indexOf('page=messages') === -1) {
    return;
  }

  setInterval(parseMessages, 1000);

  function parseMessages() {
    $('li.msg:not(.uipp-parsed)').each(function () {
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
    var expeditionContent = uipp_parseExpeditionMessage($el);

    window.config.expeditionResults = window.config.expeditionResults || {};
    window.config.expeditionResults[date + '|' + coords] = expeditionContent;

    /*for (var key in window.config.expeditionResults) {
      if (Object.keys(window.config.expeditionResults[key]).length === 0) {
        delete window.config.expeditionResults[key];
      }
    }*/

    window._saveConfig();
  }

  function getMessageTimestamp(dateStr) {
    var year = dateStr.split(' ')[0].split('.')[2];
    var month = dateStr.split(' ')[0].split('.')[1];
    var day = dateStr.split(' ')[0].split('.')[0];
    return new Date(year + '-' + month + '-' + day + ' ' + dateStr.split(' ')[1]).getTime();
  }

  function getPlanetCoords(text) {
    var start = text.indexOf('[');
    var end = text.indexOf(']');
    var trimmedCoords = text.substr(start + 1, end - start - 1).split(':');
    return trimmedCoords.length === 3 ? trimmedCoords.join(':') : null;
  }
};

window.uipp_parseExpeditionMessage = function ($el) {
  var text = $el.find('.msg_content').text().replace(/\./g, '');

  var ret = {
    flags: {
      o: null, // overused flag ['n', 'l', 'm', 'h']
      s: null, // size flag ['s', 'm', 'l']
      n: 0, // nothing flag 0/1
      l: 0, // loss flag 0/1
      p: 0, // pirate flag 0/1
      a: 0, // alien flag 0/1
      t: 0, // trader flag 0/1
      i: 0, // item flag 0/1
      e: 0, // early flag 0/1
      d: 0, // delay flag 0/1
      f: 0, // fleet flag 0/1
      r: 0, // resource flag 0/1
      x: 0 // dark matter flag 0/1
    },
    result: {
      // can contain keys: 'item', 'metal', 'crystal', 'deuterium', 'AM', and ship numbers e.g. '203'
      // where value is the amount of the resource/ship found.
    },
    text: $el.find('.msg_content').html()
  };

  // debris fields
  if ($el.find('figure.planetIcon').length) {
    var debris = text
      .split(']')[1]
      .match(/[0-9]+/g)
      .map(Number);
    if (debris[0] > 0) {
      ret.debris = ret.debris || {
        metal: 0,
        crystal: 0
      };
      ret.debris.metal += debris[0];
    }
    if (debris[1] > 0) {
      ret.debris = ret.debris || {
        metal: 0,
        crystal: 0
      };
      ret.debris.crystal += debris[1];
    }
  }

  // ogame tracker extension has an almost complete expedition message parser feature
  var strings = {
    fr: {
      darkMatterRegex: new RegExp(
        `L\`attaquant obtient (?<name>${_translate('UNIT_DM').replace(
          /(\(|\))/g,
          (_, p1) => `\\${p1}`
        )}) (?<amount>[^\\s]+)`,
        'i'
      ),
      darkMatterSize: {
        s: [
          /*'Votre expédition a */ 'réussi à collecter de l`antimatière' /* et à la conserver.'*/,
          /*'Nous avons */ 'trouvé l’épave d’un vaisseau extra-terrestre' /* avec à son bord un récipient contenant de l’antimatière !'*/,
          /*'Nous avons */ 'rencontré un alien assez bizarre' /* qui voyageait à bord d`un petit vaisseau. En échange de quelques simples calculs mathématiques, il nous a cédé un récipient contenant de l`antimatière.'*/,
          /*'Notre expédition a rencontré un */ 'vaisseau fantôme qui transportait un peu d`antimatière' /* . Nous ne savons pas ce qui est arrivé à l`équipage de ce vaisseau, mais nous avons réussi à récupérer l`antimatière qui se trouvait à bord.'*/,
          /*'L`expédition a été attirée par des */ 'signaux bizarres et a découvert un astéroïde' /* , dont le noyau contenait de l`antimatière. L`astéroïde se trouve désormais à bord de notre vaisseau et nos chercheurs sont en train d`essayer d`en extraire l`antimatière.'*/
        ],
        m: [
          /*'Notre */ 'expédition a réussi une expérience unique' /* . Les chercheurs ont réussi à gagner de l`antimatière à partir du matériel projeté par une supernova.'*/,
          /*'Notre expédition a */ 'découvert une vielle station orbitale qui apparemment' /* navigue dans l`espace abandonnée depuis longtemps. La station est inutilisable, mais il y avait encore de l`antimatière stockée dans ses réacteurs. Nos techniciens essayent de récupérer autant d`antimatière qu`ils peuvent.'*/,
          /*'Notre expédition nous signale un phénomène spectral assez surprenant. Il a */ 'provoqué la formation d`antimatière dans les réservoirs d`énergie' /* de la protection de nos vaisseaux. Nos techniciens essaient de conserver un maximum d`antimatière tant que le phénomène perdure.'*/
        ],
        l: [
          /*LOCA: fr 'Eine */ 'spontane Hyperraumverzerrung' /* hat es deiner Expedition ermöglicht, eine große Menge dunkler Materie sicherzustellen!'*/,
          /*'Notre expédition nous a signalé un contact quelque peu particulier. Apparemment des créatures énergétiques, qui se */ 'sont présentées sous le nom de légoriens' /* , ont traversé les vaisseaux de l`expédition et ont décidé d`aider l`espèce sous-développée que nous sommes - un récipient contenant de l`antimatière est apparu dans le poste de commande de nos vaisseaux.'*/
        ]
      },
      resourceSize: {
        s: [
          /*'Votre expédition a */ 'découvert un champ d`astéroides duquel' /* elle a pû extraire un certain nombre de ressources.'*/,
          /*'Sur cette planète complètement isolée, nos chercheurs */ 'ont découvert des champs de ressources facilement exploitables' /* et ont pû collecter un nombre non négligeable de matières premières.'*/
        ],
        m: [
          /*'Votre expédition a trouvé un vieux */ 'convoi de transporteurs abandonnés remplis de ressources' /* . Elle a pu en récupérer une partie.'*/,
          /*'Votre expédition a */ 'découvert des ressources en quantité importantes' /* sur une lune possédant sa propre atmosphère. Vos équipes au sol sont en train de récupérer ces trésors de la nature.'*/
        ],
        l: [
          /*'Une */ 'ceinture de minerai autour d`une planète' /* jusque là inconnue vous a procuré des tonnes de matières premiÈres. Vos soutes sont pleines à craquer !'*/,
          /*'Votre flotte d`expédition vous informe */ 'qu`elle a découvert l`épave d`un vaisseau alien' /* . Vos chercheurs n`ont pas su utiliser les technologies de ce vaisseau, par contre il a pû être démantelé, vous procurant un nombre important de ressources.'*/
        ]
      },
      resourceMetalRegex: new RegExp(`L\`attaquant obtient (?<name>${_translate('UNIT_METAL')}) (?<amount>.+)`, 'i'),
      resourceCrystalRegex: new RegExp(
        `L\`attaquant obtient (?<name>${_translate('UNIT_CRYSTAL')}) (?<amount>.+)`,
        'i'
      ),
      resourceDeuteriumRegex: new RegExp(
        `L\`attaquant obtient (?<name>${_translate('UNIT_DEUTERIUM')}) (?<amount>.+)`,
        'i'
      ),
      fleetSize: {
        s: [
          /*'Nous avons retrouvé les */ 'restes d`une expédition précédente' /* . Nos techniciens sont en train de vérifier si nous pouvons sauver quelques vaisseaux.'*/,
          /*'Votre expédition a */ 'découvert une forteresse stellaire' /* , qui doit être abandonnée depuis très longtemps. Les techniciens ont découvert quelques vaisseaux dans les hangars et essaient de les remettre en marche.'*/,
          /*'Notre expédition a */ 'découvert une planète que des guerres interminables' /* ont plus ou moins complètement détruite. Nous avons découvert beaucoup d`épaves de vaisseaux dans l`orbite de cette planète. Nos techniciens essaient d`en réparer quelques-unes. Peut-être saurons nous ainsi ce qui s`est passé ici.'*/,
          /*'Nous avons */ 'découvert une base de pirates abandonnée' /* . Il y a encore des vaisseaux dans les hangars. Nos techniciens sont en train de vérifier si nous pouvons en utiliser certains à nos fins.'*/
        ],
        m: [
          /*'Notre expédition a */ 'découvert un chantier spatial automatisé' /* . Il y a encore quelques vaisseaux en production, nos techniciens essaient de rétablir l`alimentation en énergie du chantier.'*/,
          /*'Nous avons */ 'retrouvé les restes d`une armada' /* . Les techniciens se sont immédiatement rendus sur les vaisseaux les mieux conservés et essaient de les remettre en état.'*/
        ],
        l: [
          /*'Nous avons */ 'découvert un immense cimetière de vaisseaux' /* . Nos techniciens ont réussi à remettre quelques vaisseaux en état.'*/,
          /*'Nous avons */ 'découvert une planète avec les restes d`une civilisation' /* . Depuis l`orbite, nous avons pu découvrir une aire intacte de stationnement de vaisseaux. Nos techniciens et des pilotes se sont rendus à la surface de cette planète pour vérifier ce que valent les vaisseaux stationnés.'*/
        ]
      },
      nothing: [
        /*'Malgré un scan du secteur assez prometteur, */ 'l`expédition revient les mains et les soutes vides' /* .'*/,
        /*'Mis à part quelques */ 'petits animaux provenant d`une planète marécageuse' /* jusque là inconnue, votre expédition ne ramène rien de spécial'*/,
        /*'Votre expédition a découvert... le vide. Pas de météorite, */ 'aucune radiation, aucune particule' /*, il n`y avait rien qui aurait pu être utile pour votre expédition.'*/,
        /*'Une */ 'forme de vie composée d`énergie pure' /* a plongé pendant des jours tous les membres de votre expédition dans une hypnose profonde en diffusant un motif hypnotique sur les écrans des ordinateurs de bord. Lorsque la plupart d`entre eux sont enfin sortis de cet état second, les réserves de deutérium étaient si basses que l`expédition a dû être interrompue.'*/,
        /*'Un */ 'problème de réacteur a failli détruire toute l`expédition' /*. Heureusement que les techniciens ont fait du bon travail et ont pu éviter le pire. La réparation a cependant pris beaucoup de temps et l`expédition revient donc sans résultat aucun.'*/,
        /*'Votre expédition a */ 'fait de superbes images d`une supernova' /* . Mis à part, aucune information vraiment passionnante, mais votre photographe a de bonnes chances de remporter le Prix Meilleur Image de l`univers de l`année.'*/,
        /*'Votre expédition a */ 'suivi la trace de signaux bizarres' /* . Apparemment, ces signaux provenaient d`une très vielle sonde lancée dans l`espace il y a plusieurs générations pour envoyer un message à des espèces inconnues. La sonde a été récupérée, plusieurs musées de la planète-mère sont déjà intéressés pour l`exposer.'*/,
        /*'Bien, nous savons désormais que les */ 'anomalies de classe 5 ne causent pas seulement' /* un chaos total dans les systèmes de vos vaisseaux, mais qu`elles ont aussi un effet hallucinogène sur l`équipage. En dehors de cette constatation, cette expédition ne nous a pas apporté grand chose.'*/,
        /*'Votre flotte d`expédition a eu chaud, elle s`est en effet */ 'retrouvée dans le champ de gravité d`une étoile à neutrons' /* et a mis beaucoup de temps à s`en libérer. Ceci a coûté énormément de deutérium et la flotte d`expédition revient donc sans aucun résultat.'*/,
        /*'Un */ 'virus informatique a fait planter votre système de navigation' /* peu après que vous ayez quitté votre système solaire. Du coup, votre flotte a tourné en rond, inutile de préciser que cette expédition n`a donc fourni aucun résultat intéressant.'*/,
        /*'Nous n`aurions peut-être pas dû */ 'fêter l`anniversaire du capitaine sur cette planète isolée' /* . L`équipage a contracté une espèce de paludisme qui a envoyé une bonne partie de l`équipage à l`infirmerie. Ce manque de personnel inattendu à fait échouer la mission.'*/,
        /*'Quelqu`un a installé un */ 'jeu de stratégie sur les ordinateurs de bord' /* de votre expédition. Du coup, la flotte a fait un long voyage, mais sans résultat aucun.'*/
      ],
      loss: [
        /*'L`expédition nous a envoyé des clichés extrêmement précis et */ 'détaillés d`un trou noir en cours de formation' /* . Malheureusement, peu après, nous avons perdu le contact avec notre flotte'*/,
        /*'Voici le */ 'dernier signe de vie de l`expédition' /* : ZZZrrt Oh mon dieu ! krrzrzzzt Cela zrrrtrzt ressemble krgzzz à un krzzzzzzzzz....'*/,
        /*'Un incident dans le noyau atomique d`un des vaisseaux a provoqué une réaction en chaîne, détruisant */ 'toute l`expédition dans une explosion immense et spectaculaire' /* .'*/,
        /*'Notre flotte d`expédition a */ 'disparu après être passé en mode hyperespace' /* et n`est jamais réapparue. Nos scientifiques n`ont aucune idée de ce qui a pu se passer, mais la flotte semble perdue.'*/
      ],
      trader: [
        /*'Votre expédition a eu un */ 'bref contact avec une espèce alien visiblement très timide' /* . Ils vous ont annoncé qu`ils enverraient dans votre empire un représentant chargé de ressources à échanger.'*/,
        /*'Votre flotte d`expédition a */ 'recueilli un signal d`urgence' /* . Il s`agissait d`un supertransporteur pris dans le fort champ de gravité d`une planète hostile. Après que vous l`ayez aidé à libérer son vaisseau du champ, le capitaine du supertransporteur vous annonce qu`il vous ajoute dans sa liste de clients privilégiés.'*/
      ],
      early: [
        /*'Un petit */ 'défaut dans les réacteurs de votre flotte l`a fait voyager' /* à une vitesse supérieure à la vitesse normale, ce qui fait que votre flotte rentre avec un peu d`avance sur ce qui était initialement prévu. A part cela, vos chercheurs n`ont rien découvert de spécial.'*/,
        /*'Votre expédition ne signale aucune particularité dans le secteur exploré. Au retour, votre */ 'flotte a été poussée par un vent solaire' /* , lui permettant ainsi de rentrer à bon port avec un peu d`avance.'*/,
        /*'Votre nouveau */ 'commandant de bord étant assez courageux' /* , il a utilisé une irrégularité dans l`espace pour accélérer son retour. Il a réussi, mais pour le reste, l`expédition rentre bredouille.'*/
      ],
      delay: [
        /*'Une erreur de calcul de votre officier de navigation vous a */ 'fait faire un saut vers une destination complètement erronée' /* , retardant ainsi le retour de votre flotte.'*/,
        /*'Votre expédition a dû */ 'faire face à plusieurs vents de particule' /* . Du coup, les systèmes d`énergie ont surchauffé, causant des pannes importantes sur les systèmes principaux de vos vaisseaux. Les mécaniciens ont pu éviter le pire, cependant votre flotte reviendra avec un retard assez conséquent.'*/,
        /*'Pour une raison inconnue, le saut spatial a complètement raté, */ 'l`expédition a failli se retrouver au centre d`un soleil' /*, ce qui aurait entraîné sa perte. Heureusement, elle s`est retrouvée dans un système solaire connu, mais le voyage du retour dure plus longtemps qu`initialement prévu.'*/,
        /*'Le */ 'vent solaire causé par une supernova' /* a complètement faussé le saut spatial de votre expédition, il a donc fallu plus de temps pour effectuer les calculs nécessaires au saut pour rentrer à domicile. Cette fausse route est d`ailleurs le seul résultat notable de votre expédition.'*/,
        /*'Votre */ 'module de navigation semble avoir quelques soucis' /* , malgré une phase de test approfondie, il reste un certain nombre de bugs inexplicables et inexpliqués. Non seulement le saut spatial a eu lieu dans la mauvaise direction, mais tout le deutérium a été consommé, et votre flotte n`est arrivée que peu derrière la lune de la planète de départ. Les réservoirs étant vides, la flotte va devoir rentrer avec l`aide des générateurs de secours, causant ainsi un retard important par rapport à la date de retour initialement prévue.'*/,
        /*'Un de vos */ 'vaisseaux est entré en collision avec un vaisseau inconnu' /* qui a foncé dans votre convoi sans aucune raison apparente. Le vaisseau inconnu a explosé, causant de sérieux dommages à vos vaisseaux. Dès les réparations d`urgence achevées, votre flotte fera demi-tour, l`expédition ne pouvant être continuée avec des vaisseaux dans cet état.'*/
      ],
      pirateSize: {
        s: [
          /*'Quelques */ 'pirates, apparemment complètement désespérés' /* , ont tenté d`attaquer notre flotte d`expédition.'*/,
          /*'Des */ 'barbares primitifs nous attaquent avec des vaisseaux' /* qui n`ont même pas mérité le nom "vaisseau", tellement ils sont ridicules. Si ces attaques continuent, nous nous verrons obligés de riposter.'*/,
          /*'Nous avons capté des */ 'messages provenant de pirates fortement alcoolisés' /* . Apparemment, ils veulent nous détrousser.'*/,
          /*'Nous */ 'avons dû nous défendre contre des pirates' /* , heureusement qu`ils n`étaient pas trop nombreux.'*/,
          /*LOCA: fr 'Unsere Expeditionsflotte meldet, dass ein gewisser */ 'Moa Tikarr und seine wilde Meute' /* die bedingungslose Kapitulation unserer Flotte verlangen. Sollten sie Ernst machen, werden sie feststellen müssen, dass sich unsere Schiffe durchaus zu wehren wissen.'*/
        ],
        m: [
          /*'Votre flotte d`expédition a fait */ 'une rencontre fort peu agréable avec des pirates' /* de l`espace.'*/,
          /*'Nous sommes tombés */ 'dans un piège tendu par des pirates de l`espace' /* ! Le combat n`a pû être évité.'*/,
          /*'Le message de */ 'secours était en fait un guet-apens' /* , le combat avec les pirates était inévitable.'*/
        ],
        l: [
          /*'Les signaux que nous ne pouvions identifier ne provenaient pas d`une espèce */ 'inconnue mais d`une base de pirates secrète' /* ! Ils n`ont apparemment pas vraiment été ravis de découvrir que nous étions dans leur secteur.'*/,
          /*'Votre flotte d`expédition nous */ 'signale de lourds combats avec une flotte de pirates' /* non identifiés.'*/
        ]
      },
      alienSize: {
        s: [
          /*'Des vaisseaux */ 'inconnus ont attaqué la flotte d`expédition' /* , sans avertissement et sans raison !'*/,
          /*'La flotte d`expédition a */ 'eu une rencontre peu amicale avec une espèce' /* inconnue'*/,
          /*'Notre expédition a été */ 'attaquée par un petit groupe de vaisseaux' /* inconnus !'*/,
          /*LOCA: fr 'Die Expeditionsflotte meldet */ 'Kontakt mit unbekannten Schiffen' /*. Die Funksprüche sind nicht entschlüsselbar, jedoch scheinen die fremden Schiffe ihre Waffen zu aktivieren.'*/
        ],
        m: [
          /*'Une */ 'espèce inconnue attaque notre expédition' /* !'*/,
          /*'Votre */ 'flotte d`expédition a manifestement enfreint les espaces territoriaux' /* d`une espèce inconnue jusqu`à présent mais qui semble extrêmement agressive.'*/,
          /*'Nous avons */ 'perdu temporairement le contact avec notre flotte d`expédition' /* . Si nous avons déchiffré correctement le dernier message, la flotte est en train d`être attaquée - les agresseurs n`ont pas pu être identifiés.'*/
        ],
        l: [
          /*'Votre mission d`expédition a */ 'rencontré une flotte d`invasion alien' /* et vous annonce qu`elle est engagée dans un combat féroce.'*/,
          /*'Nous avons rencontré */ 'quelques difficultés à prononcer correctement ce dialecte' /* extraterrestre et notre diplomate a crié "faisons feu !" au lieu de "faisons la paix !"'*/,
          /*'Une flotte de */ 'vaisseaux cristallins va entrer en collision' /* avec notre flotte d`expédition d`ici peu. Nous devons nous préparer au pire.'*/
        ]
      },
      overUseSize: {
        n: [
          /*'Cette */ 'partie de l`univers n`a apparemment encore' /* jamais été explorée.'*/,
          /*'C`est un sentiment assez */ 'unique de se savoir le premier à explorer' /* ce coin perdu de la galaxie. '*/
        ],
        l: [
          /*'Il semblerait que personne */ 'ne soit jamais venu jusqu`à ce coin reculé' /* de la galaxie.'*/,
          /*'Nous avons */ 'découvert de très vieilles traces d`autres vaisseaux' /* , nous ne sommes donc pas les premiers à venir ici. '*/,
          /*'Nous avons failli entrer en */ 'collision avec une autre flotte d`expédition' /* . Je ne pensais pas qu`il y avait d`autres expéditions qui traînaient par ici.'*/
        ],
        m: [
          /*'Nous avons fêté la fin de notre expédition avec l`équipage d`une autre flotte d`expédition qui se trouvait dans le même secteur que nous. Eux */ 'non plus n`avaient rien découvert d`extraordinaire',
          /*'Nous avons */ 'découvert des signes indiquant la présence d`autres flottes' /* d`expédition dans ce secteur.'*/,
          /*'Nous avons établi un */ 'contact radio amical avec d`autres flottes d`expédition' /* dans ce secteur.'*/
        ],
        h: [
          /*LOCA: fr 'Wenn wir uns zu unsicher fühlen, können wir uns ja */ 'mit all den anderen Expeditionen' /*, die hier herum fliegen, zusammen tun.'*/,
          /*'Si cela continue comme ca, vu le trafic qu`il y a ici, */ 'il va falloir songer à installer des feux de signalisation',
          /*'Il serait peut être plus */ 'judicieux d`installer une stèle du souvenir' /* à cet endroit plutôt que de continuer d`y envoyer des expéditions.'*/
        ]
      }
    },
    en: {
      darkMatterRegex: new RegExp(
        `(?<name>${_translate('UNIT_DM').replace(
          /(\(|\))/g,
          (_, p1) => `\\${p1}`
        )}) (?<amount>[^\\s]+) have been captured`,
        'i'
      ),
      darkMatterSize: {
        s: [
          /*'The expedition was able to */ 'capture and store some Dark Matter',
          /*'We found the */ 'remains of an alien ship' /*. We found a little container with some Dark Matter on a shelf in the cargo hold!'*/,
          /*'We met an */ 'odd alien on the shelf of a small ship' /* who gave us a case with Dark Matter in exchange for some simple mathematical calculations.'*/,
          /*'Our expedition took over a */ 'ghost ship which was transporting a small amount of Dark Matter' /*. We didn`t find any hints of what happened to the original crew of the ship, but our technicians where able to rescue the Dark Matter.'*/,
          /*'The expedition followed some */ 'odd signals to an asteroid' /*. In the asteroids core a small amount of Dark Matter was found. The asteroid was taken and the explorers are attempting to extract the Dark Matter.'*/
        ],
        m: [
          /*'Our expedition */ 'accomplished a unique experiment' /*. They were able to harvest Dark Matter from a dying star.'*/,
          /*'Our Expedition */ 'located a rusty space station' /*, which seemed to have been floating uncontrolled through outer space for a long time. The station itself was totally useless, however, it was discovered that some Dark Matter is stored in the reactor. Our technicians are trying to save as much as they can.'*/,
          /*'Our expedition reports a */ 'spectacular phenomenon' /*. The accumulation of Dark Matter in the energy storages of the ship shields. Our technicians try to store as much Dark Matter as they can while the phenomenon lasts.*/
        ],
        l: [
          /*'A */ 'spontaneous hyper space deformation' /* allowed your expedition to harvest large amount of Dark Matter'*/,
          /*'Our expedition made first contact with a special race. It looks as though a creature made of pure energy, who */ 'named himself Legorian' /*, flew through the expedition ships and then decided to help our underdeveloped species. A case containing Dark Matter materialized at the bridge of the ship'*/
        ]
      },
      resourceSize: {
        s: [
          /*'Your expedition */ 'discovered a small asteroid' /* from which some resources could be harvested.'*/,
          /*'On an isolated planetoid we found */ 'some easily accessible resources fields' /* and harvested some successfully.'*/
        ],
        m: [
          /*'Your expedition found an ancient, */ 'fully loaded but deserted freighter convoy' /*. Some of the resources could be rescued.'*/,
          /*'On a */ 'tiny moon with its own atmosphere' /* your expedition found some huge raw resources storage. The crew on the ground is trying to lift and load that natural treasure.'*/
        ],
        l: [
          /*'Mineral */ 'belts around an unknown planet contained countless resources' /*. The expedition ships are coming back and their storages are full'*/,
          /*'Your expedition fleet reports the */ 'discovery of a giant alien ship wreck' /*. They were not able to learn from their technologies but they were able to divide the ship into its main components and made some useful resources out of it'*/
        ]
      },
      resourceMetalRegex: new RegExp(`(?<name>${_translate('UNIT_METAL')}) (?<amount>.+) have been captured`, 'i'),
      resourceCrystalRegex: new RegExp(`(?<name>${_translate('UNIT_CRYSTAL')}) (?<amount>.+) have been captured`, 'i'),
      resourceDeuteriumRegex: new RegExp(
        `(?<name>${_translate('UNIT_DEUTERIUM')}) (?<amount>.+) have been captured`,
        'i'
      ),
      fleetSize: {
        s: [
          /*'We came across the */ 'remains of a previous expedition' /* ! Our technicians will try to get some of the ships to work again.'*/,
          /*'Your expedition ran into the */ 'shipyards of a colony that was deserted eons ago' /*. In the shipyards hangar they discover some ships that could be salvaged. The technicians are trying to get some of them to fly again.'*/,
          /*'Our expedition found a planet which was */ 'almost destroyed during a certain chain of wars' /*. There are different ships floating around in the orbit. The technicians are trying to repair some of them. Maybe we will also get information about what happened here.'*/,
          /*'We */ 'found a deserted pirate station' /*. There are some old ships lying in the hangar. Our technicians are figuring out whether some of them are still useful or not.'*/
        ],
        m: [
          /*'Our expedition ran into an */ 'old automatic shipyard' /*. Some of the ships are still in the production phase and our technicians are currently trying to reactivate the yards energy generators.'*/,
          /*'We found */ 'the remains of an armada' /*. The technicians directly went to the almost intact ships to try to get them to work again.'*/
        ],
        l: [
          /*'We */ 'found an enormous spaceship graveyard' /*. Some of the technicians from the expedition fleet were able to get some of the ships to work again.'*/,
          /*'We found the */ 'planet of an extinct civilization' /*. We are able to see a giant intact space station, orbiting. Some of your technicians and pilots went to the surface looking for some ships which could still be used.'*/
        ]
      },
      nothing: [
        /*'Despite the first, */ 'very promising scans of this sector' /*, we unfortunately returned empty handed.'*/,
        /*'Besides some quaint, */ 'small pets from a unknown marsh planet' /*, this expedition brings nothing thrilling back from the trip.'*/,
        /*'Your expedition has learnt about */ 'the extensive emptiness' /* of space. There was not even one small asteroid or radiation or particle that could have made this expedition interesting.'*/,
        /*'A failure in the */ 'flagships reactor core nearly destroys' /* the entire expedition fleet. Fortunately the technicians were more than competent and could avoid the worst. The repairs took quite some time and forced the expedition to return without having accomplished its goal. */,
        /*'Your expedition took */ 'gorgeous pictures of a super nova' /*. Nothing new could be obtained from the expedition, but at least there is good chance to win that "Best Picture Of The Universe" competition in next months issue of OGame magazine.'*/,
        /*'Your expedition fleet */ 'followed odd signals for some time' /*. At the end they noticed that those signals where being sent from an old probe which was sent out generations ago to greet foreign species. The probe was saved and some museums of your home planet already voiced their interest.'*/,
        /*'Well, now we know that those red, */ 'class 5 anomalies' /* do not only have chaotic effects on the ships navigation systems but also generate massive hallucination on the crew. The expedition didn`t bring anything back.'*/,
        /*'Your expedition nearly */ 'ran into a neutron stars gravitation field' /* and needed some time to free itself. Because of that a lot of Deuterium was consumed and the expedition fleet had to come back without any results.'*/,
        /*'A */ 'strange computer virus attacked the navigation system' /* shortly after parting our home system. This caused the expedition fleet to fly in circles. Needless to say that the expedition wasn`t really successful.'*/,
        /*'Our expedition team came across a strange colony that had been abandoned eons ago. After landing, */ 'our crew started to suffer from a high fever' /* caused by an alien virus. It has been learned that this virus wiped out the entire civilization on the planet. Our expedition team is heading home to treat the sickened crew members. Unfortunately we had to abort the mission and we come home empty handed.'*/,
        /*'Due to a */ 'failure in the central computers of the flagship' /*, the expedition mission had to be aborted. Unfortunately as a result of the computer malfunction, the fleet returns home empty handed.'*/,
        /*'A */ 'living being made out of pure energy' /* came aboard and induced all the expedition members into some strange trance, causing them to only gazed at the hypnotizing patterns on the computer screens. When most of them finally snapped out of the hypnotic-like state, the expedition mission needed to be aborted as they had way too little Deuterium.'*/
      ],
      loss: [
        /*'The last transmission we received from the expedition fleet was this */ 'magnificent picture of the opening of a black hole' /*.'*/,
        /*'The */ 'only thing left from the expedition was the following radio transmission' /*: Zzzrrt Oh no! Krrrzzzzt That zrrrtrzt looks krgzzzz like .. AHH! Krzzzzzzzztzzzz...'*/,
        /*'A */ 'core meltdown of the lead ship' /* leads to a chain reaction, which destroys the entire expedition fleet in a spectacular explosion.'*/,
        /*'Contact with the */ 'expedition fleet was suddenly lost' /*. Our scientists are still trying to establish contact, but it seems the fleet is lost forever.'*/
      ],
      trader: [
        /*'Your expedition fleet made */ 'contact with a friendly alien race' /*. They announced that they would send a representative with goods to trade to your worlds.'*/,
        /*'Your expedition */ 'picked up an emergency signal' /* during the mission. A mega cargo vessel was caught by a powerful gravitation field generated by a planetoid. After the vessel and cargo was successfully freed, the captain announced that the person who saved them would be their favorite and exclusive client.'*/
      ],
      early: [
        /*'An */ 'unexpected back coupling in the energy spools' /* of the engines hastened the expeditions return, it returns home earlier than expected. First reports tell they do not have anything thrilling to account for.'*/,
        /*'Your expeditions doesn`t report any anomalies in the explored sector. But the fleet */ 'ran into some solar wind while returning' /*. This resulted in the return trip being expedited. Your expedition returns home a bit earlier.'*/,
        /*'The new and daring commander successfully */ 'traveled through an unstable wormhole' /* to shorten the flight back! However, the expedition itself didn`t bring anything new.'*/
      ],
      delay: [
        /*'Your */ 'navigator made a grave error in his computations' /* that caused the expeditions jump to be miscalculated. Not only did the fleet miss the target completely, but the return trip will take a lot more time than originally planned.'*/,
        /*'Your expedition went into a */ 'sector full of particle storms' /*. This set the energy stores to overload and most of the ships main systems crashed. Your mechanics where able to avoid the worst, but the expedition is going to return with a big delay.'*/,
        /*'For */ 'unknown reasons the expeditions jump went totally wrong' /*. It nearly landed in the heart of a sun. Fortunately it landed in a known system, but the jump back is going to take longer than thought.'*/,
        /*'The */ 'solar wind of a red giant' /* ruined the expeditions jump and it will take quite some time to calculate the return jump. There was nothing besides the emptiness of space between the stars in that sector. The fleet will return later than expected.'*/,
        /*'The */ 'new navigation module is still buggy' /*. The expeditions jump not only lead them in the wrong direction, but it used all the Deuterium fuel. Fortunately the fleets jump got them close to the departure planets moon. A bit disappointed the expedition now returns without impulse power. The return trip will take longer than expected.'*/,
        /*'The expedition`s */ 'flagship collided with a foreign ship' /* when it jumped into the fleet without any warning. The foreign ship exploded and the damage to the flagship was substantial. The expedition cannot continue in these conditions, and so the fleet will begin to make its way back once the needed repairs have been carried out.'*/
      ],
      pirateSize: {
        s: [
          /*'Some */ 'really desperate space pirates' /* tried to capture our expedition fleet.'*/,
          /*'Some */ 'primitive barbarians are attacking us with spaceships' /* that can`t even be named as such. If the fire gets serious we will be forced to fire back.'*/,
          /*'We caught some */ 'radio transmissions from some drunk pirates' /*. Seems like we will be under attack soon.'*/,
          /*'We needed to */ 'fight some pirates which' /* were, fortunately, only a few.'*/,
          /*'Our expedition reports that a */ 'Moa Tikarr' /* and his wild troops request our unconditional capitulation. If they are going to get serious they will have to learn that our ships are able to defend themselves.'*/
        ],
        m: [
          /*'Your expedition had */ 'an unpleasant rendezvous with some space pirates' /*.'*/,
          /*'We ran straight into an */ 'ambush set by some Star Buccaneers' /* ! A fight couldn`t be avoided.'*/,
          /*'That emergency signal that the expedition team followed was */ 'in reality an ambush set up by some Star Buccaneers' /*. A fight could not be avoided.'*/
        ],
        l: [
          /*'The recorded signals didn`t come from a */ 'foreign being but from a secret pirate base' /* ! They were not really surprised by our presence in their sector.'*/,
          /*'The expedition */ 'reports tough battles against unidentified pirate' /* ships.'*/
        ]
      },
      alienSize: {
        s: [
          /*'Some */ 'exotic looking ships attacked the expedition' /* fleet without warning!'*/,
          /*'Your expedition fleet made some */ 'unfriendly first contact' /* with an unknown species.'*/,
          /*'Our expedition was */ 'attacked by a small group of unknown ships' /* !'*/,
          /*'The expeditions fleet reports contact with unknown ships. The */ 'sensor readings are not decipherable' /*, but it seems that the alien ships are activating their weapon system.'*/
        ],
        m: [
          /*'An */ 'unknown species is attacking' /* our expedition!'*/,
          /*'Your expedition fleet seems to have */ 'flown into territory that belongs to' /* an unknown but really aggressive and warlike alien race.'*/,
          /*'The */ 'connection to our expedition fleet was interrupted' /* for a short time. We could decrypt their last message. They are under heavy attack, the aggressors could not be identified.'*/
        ],
        l: [
          /*'Your expedition */ 'ran into an alien invasion fleet' /* and reports heavy fighting!'*/,
          /*'We had a bit of difficulty */ 'pronouncing the dialect of the alien race' /* correctly. Our diplomat accidentally called `Fire!` instead of `Peace!`'*/,
          /*'A large Armada of */ 'crystalline ships of unknown origin' /* take a direct collision course with our expedition-fleet. We should assume the worst.'*/
        ]
      },
      overUseSize: {
        n: [
          /*'It seems that */ 'this part of the universe has not been explored' /* yet'*/,
          /*'It feels */ 'great to be the first ones traveling' /* through an unexplored sector'*/
        ],
        l: [
          /*'It seems that */ 'no human has been in this part of the galaxy' /* before'*/,
          /*'We found */ 'debris of ancient space ships' /*. We are not the first ones here.'*/,
          /*'We */ 'nearly had a collision with another expedition fleet' /*. I did not believe that there would be others around here'*/
        ],
        m: [
          /*'We */ 'celebrated the expeditions fulfillment with the crew members' /* of another expedition fleet which where on their way in the same sector. They have nothing new to report.'*/,
          /*'We found */ 'proof indicating the presence of multiple expedition fleets' /* in the area. We are returning home.'*/,
          /*'We */ 'established friendly radio contact with some other expeditions' /* in this sector.'*/
        ],
        h: [
          /*'If we felt in danger */ 'we could return with all the other expeditions flying around' /* here.'*/,
          /*LOCA: en 'Vielleicht wäre es sinnvoller, hier */ 'eine Souvenir-Station zu errichten' /* , anstatt noch eine Expedition loszuschicken.'*/,
          /*LOCA: en 'Wenn das so weitergeht, sollte man */ 'bei all dem Verkehr hier Navigationsbojen' /* aussetzen.'*/
        ]
      }
    }
  };

  strings = strings[config.universe.language];
  if (!strings) {
    return ret;
  }
  text = text.toLowerCase();

  // parse dark matter
  for (var size in strings.darkMatterSize) {
    strings.darkMatterSize[size].forEach(function (subtext) {
      if (text.includes(subtext)) {
        var matches = text.match(strings.darkMatterRegex);
        var amount = Number(matches.groups.amount.replace(/[^\d]/g, ''));
        ret.result['AM'] = amount;
        ret.flags.s = size;
        ret.flags.x = 1;
      }
    });
  }

  // parse resources
  for (var size in strings.resourceSize) {
    strings.resourceSize[size].forEach(function (subtext) {
      if (text.includes(subtext)) {
        var metalMatches = text.match(strings.resourceMetalRegex);
        if (metalMatches) {
          ret.result['metal'] = Number(metalMatches.groups.amount.replace(/[^\d]/g, ''));
        }
        var crystalMatches = text.match(strings.resourceCrystalRegex);
        if (crystalMatches) {
          ret.result['crystal'] = Number(crystalMatches.groups.amount.replace(/[^\d]/g, ''));
        }
        var deuteriumMatches = text.match(strings.resourceDeuteriumRegex);
        if (deuteriumMatches) {
          ret.result['deuterium'] = Number(deuteriumMatches.groups.amount.replace(/[^\d]/g, ''));
        }
        ret.flags.s = size;
        ret.flags.r = 1;
      }
    });
  }

  // parse fleet
  for (var size in strings.fleetSize) {
    strings.fleetSize[size].forEach(function (subtext) {
      if (text.includes(subtext)) {
        ret.flags.s = size;
        ret.flags.f = 1;

        for (var key in config.labels) {
          if (Number(key) >= 200 && Number(key) < 300) {
            const shipRegex = new RegExp(`(\\b|\\d|^)${config.labels[key]}: (?<amount>\\d+)`, 'i');
            var matches = text.match(shipRegex);
            if (matches) {
              ret.result[key] = Number(matches.groups.amount.replace(/[^\d]/g, ''));
            }
          }
        }
      }
    });
  }

  // parse "nothing" event
  strings.nothing.forEach(function (subtext) {
    if (text.includes(subtext)) {
      ret.flags.n = 1;
    }
  });

  // parse "loss" event
  strings.loss.forEach(function (subtext) {
    if (text.includes(subtext)) {
      ret.flags.l = 1;
    }
  });

  // parse trader
  strings.trader.forEach(function (subtext) {
    if (text.includes(subtext)) {
      ret.flags.t = 1;
    }
  });

  // parse early
  strings.early.forEach(function (subtext) {
    if (text.includes(subtext)) {
      ret.flags.e = 1;
    }
  });

  // parse delay
  strings.delay.forEach(function (subtext) {
    if (text.includes(subtext)) {
      ret.flags.d = 1;
    }
  });

  // parse items
  if ($el.find('a.itemLink').length) {
    ret.flags.i = 1;
    ret.result.item = $el.find('a.itemLink').text();
  }

  // parse pirateSize
  for (var size in strings.pirateSize) {
    strings.pirateSize[size].forEach(function (subtext) {
      if (text.includes(subtext)) {
        ret.flags.s = size;
        ret.flags.p = 1;
      }
    });
  }

  // parse alienSize
  for (var size in strings.alienSize) {
    strings.alienSize[size].forEach(function (subtext) {
      if (text.includes(subtext)) {
        ret.flags.a = 1;
        ret.flags.s = size;
      }
    });
  }

  // parse overUseSize
  for (var size in strings.overUseSize) {
    strings.overUseSize[size].forEach(function (subtext) {
      if (text.includes(subtext)) {
        ret.flags.o = size;
      }
    });
  }

  return ret;
};
