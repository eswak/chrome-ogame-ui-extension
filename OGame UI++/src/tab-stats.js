var fn = function () {
  'use strict';
  window._addTabStats = function _addTabStats() {
    var $statsEntry = $('<li class="stats enhanced"><span class="menu_icon"><div class="customMenuEntry2 menuImage empire"></div></span><a class="menubutton" href="#" accesskey="" target="_self"><span class="textlabel enhancement">' + _translate('MENU_STATS') + '</span></a></li>');
    $('#menuTable').append($statsEntry);
    $statsEntry.click(function () {
      // ui changes
      $('.menubutton.selected').removeClass('selected');
      $('.menuImage.highlighted').removeClass('highlighted');
      $('.stats .menubutton').addClass('selected');
      $('.customMenuEntry2').addClass('highlighted');

      var $wrapper = $('<div class="uiEnhancementWindow"></div>');

      var totalProd = {
        metal: 0,
        crystal: 0,
        deuterium: 0,
        metalLevel: 0,
        crystalLevel: 0,
        deuteriumLevel: 0,
        planetCount: 0
      };

      for (var coords in config.my.planets) {
        var planet = config.my.planets[coords];
        if (!planet.resources) {
          continue;
        }

        var $stats = $('<div class="planetstats"></div>');
        $stats.append('<h3>' + _translate('STATS_FOR') + ' ' + planet.name + ' ' + coords + '</h3>');
        $stats.append($('<div>' + _translate('STATS_DAILY') + ' (' + _translate('UNIT_METAL') + ') : <span class="undermark">+' + _num(Math.floor(planet.resources.metal.prod * 3600 * 24)) + '</span></div>'));
        $stats.append($('<div>' + _translate('STATS_DAILY') + ' (' + _translate('UNIT_CRYSTAL') + ') : <span class="undermark">+' + _num(Math.floor(planet.resources.crystal.prod * 3600 * 24)) + '</span></div>'));
        $stats.append($('<div>' + _translate('STATS_DAILY') + ' (' + _translate('UNIT_DEUTERIUM') + ') : <span class="undermark">+' + _num(Math.floor(planet.resources.deuterium.prod * 3600 * 24)) + '</span></div>'));
        $stats.append($('<div class="spacer"></div>'));

        //$stats.append($('<div>Niveau des mines : ' + planet.resources.metal.level + ' / ' + planet.resources.crystal.level + ' / ' + planet.resources.deuterium.level + '</div>'));

        totalProd.metal += planet.resources.metal.prod;
        totalProd.crystal += planet.resources.crystal.prod;
        totalProd.deuterium += planet.resources.deuterium.prod;
        totalProd.metalLevel += (planet.resources.metal.level || 0);
        totalProd.crystalLevel += (planet.resources.crystal.level || 0);
        totalProd.deuteriumLevel += (planet.resources.deuterium.level || 0);
        totalProd.planetCount++;

        $wrapper.append($stats);
      }

      totalProd.metalLevel /= Object.keys(config.my.planets).length;
      totalProd.crystalLevel /= Object.keys(config.my.planets).length;
      totalProd.deuteriumLevel /= Object.keys(config.my.planets).length;

      // global stats
      var $stats = $('<div class="planetstats"></div>');
      $stats.append('<h3>' + _translate('STATS_ALL') + '</h3>');
      $stats.append($('<div>' + _translate('STATS_DAILY') + ' (' + _translate('UNIT_METAL') + ') : <span class="undermark">+' + _num(Math.floor(totalProd.metal * 3600 * 24)) + '</span></div>'));
      $stats.append($('<div>' + _translate('STATS_DAILY') + ' (' + _translate('UNIT_CRYSTAL') + ') : <span class="undermark">+' + _num(Math.floor(totalProd.crystal * 3600 * 24)) + '</span></div>'));
      $stats.append($('<div>' + _translate('STATS_DAILY') + ' (' + _translate('UNIT_DEUTERIUM') + ') : <span class="undermark">+' + _num(Math.floor(totalProd.deuterium * 3600 * 24)) + '</span></div>'));
      $stats.append($('<div class="spacer"></div>'));
      $stats.append($('<div>' + _translate('STATS_RATIO') + _translate('UNIT_METAL') + ') : 1 / ' + Math.floor(100 * totalProd.crystal / totalProd.metal) / 100 + ' / ' + Math.floor(100 * totalProd.deuterium / totalProd.metal) / 100 + '</div>'));
      $stats.append($('<div>' + _translate('STATS_RATIO') + _translate('UNIT_CRYSTAL') + ') : ' + Math.floor(100 * totalProd.metal / totalProd.crystal) / 100 + ' / 1 / ' + Math.floor(100 * totalProd.deuterium / totalProd.crystal) / 100 + '</div>'));
      $stats.append($('<div>' + _translate('STATS_RATIO') + _translate('UNIT_DEUTERIUM') + ') : ' + Math.floor(100 * totalProd.metal / totalProd.deuterium) / 100 + ' / ' + Math.floor(100 * totalProd.crystal / totalProd.deuterium) / 100 + ' / 1</div>'));
      $stats.append($('<div class="spacer"></div>'));

      //$stats.append($('<div>Niveau moyen des mines : ' + Math.floor(10*totalProd.metalLevel)/10 + ' / ' + Math.floor(10*totalProd.crystalLevel)/10 + ' / ' + Math.floor(10*totalProd.deuteriumLevel)/10 + '</div>'));

      $wrapper.prepend($stats);

      // add reset button
      var $resetStatsButton = $('<div style="text-align: right;padding-right: .5em;"><a href="#" class="btn_blue">' + _translate('RESET_STATS') + '</a></div>');
      $wrapper.append($resetStatsButton);
      $resetStatsButton.click(function () {
        delete config.my.planets;
        _saveConfig(config);
        window.location.reload();
      });

      // insert html
      var $eventboxContent = $('#eventboxContent');
      $('#contentWrapper').html($eventboxContent);
      $('#contentWrapper').append($wrapper);
    });
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
