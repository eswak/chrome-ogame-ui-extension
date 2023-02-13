'use strict';
window.uipp_parseEmpireData = function uipp_parseEmpireData(force, cb) {
  var shipNeedUpdate = false;
  for (var key in config.my.planets) {
    if (config.my.planets[key].shipsNeedUpdate < Date.now()) shipNeedUpdate = true;
  }
  if (force || shipNeedUpdate) {
    $.get('?page=standalone&component=empire&planetType=0', function (str) {
      var planets = JSON.parse(
        str.substring(str.indexOf('createImperiumHtml') + 47, str.indexOf('initEmpire') - 16)
      ).planets;
      var hasMoon = false;
      planets.forEach(function (planet) {
        handlePlanet(planet.coordinates, planet);
        if (planet.moonID) hasMoon = true;
      });
      if (hasMoon) {
        $.get('?page=standalone&component=empire&planetType=1', function (str) {
          var moons = JSON.parse(
            str.substring(str.indexOf('createImperiumHtml') + 47, str.indexOf('initEmpire') - 16)
          ).planets;
          moons.forEach(function (moon) {
            handlePlanet(moon.coordinates + 'L', moon);
          });
          cb && cb();
        });
      } else {
        cb && cb();
      }
    });
  }

  function handlePlanet(key, data) {
    // Parse ships
    var ships = {};
    for (var labelKey in config.labels) {
      if (['212', '216', '217', '220'].indexOf(labelKey) !== -1) {
        // skip resbuggy, solarSatellite, and market ships
        continue;
      }
      if (Number(labelKey) > 200 && Number(labelKey) < 300) {
        var nShips = Number(data[labelKey] || '0');
        if (nShips) {
          ships[labelKey] = nShips;
        }
      }
    }

    config.my.planets[key].shipsLastUpdate = Date.now();
    config.my.planets[key].ships = ships;
    config.my.planets[key].shipResources = uipp_getShipResources(ships);
    config.my.planets[key].shipPoints = uipp_getShipPoints(ships);
    if (config.my.planets[key].shipsNeedUpdate < Date.now()) {
      config.my.planets[key].shipsNeedUpdate = Date.now() + 7 * 24 * 36e5;
    }

    // Parse current resources
    config.my.planets[key].resources = config.my.planets[key].resources || {};
    config.my.planets[key].resources.metal = config.my.planets[key].resources.metal || {};
    config.my.planets[key].resources.crystal = config.my.planets[key].resources.crystal || {};
    config.my.planets[key].resources.deuterium = config.my.planets[key].resources.deuterium || {};
    config.my.planets[key].resources.metal.prod =
      config.my.planets[key].resources.metal.prod || data.production.hourly[0] / 3600 || 0;
    config.my.planets[key].resources.crystal.prod =
      config.my.planets[key].resources.crystal.prod || data.production.hourly[1] / 3600 || 0;
    config.my.planets[key].resources.deuterium.prod =
      config.my.planets[key].resources.deuterium.prod || data.production.hourly[2] / 3600 || 0;
    config.my.planets[key].resources.metal.level = data[1];
    config.my.planets[key].resources.crystal.level = data[2];
    config.my.planets[key].resources.deuterium.level = data[3];
    config.my.planets[key].resources.metal.max = data.metalStorage;
    config.my.planets[key].resources.crystal.max = data.crystalStorage;
    config.my.planets[key].resources.deuterium.max = data.deuteriumStorage;
    config.my.planets[key].resources.metal.now = data.metal;
    config.my.planets[key].resources.crystal.now = data.crystal;
    config.my.planets[key].resources.deuterium.now = data.deuterium;
    config.my.planets[key].resources.metal.worth = uipp_getResourcesWorth().metal;
    config.my.planets[key].resources.crystal.worth = uipp_getResourcesWorth().crystal;
    config.my.planets[key].resources.deuterium.worth = uipp_getResourcesWorth().deuterium;
    config.my.planets[key].resources.lastUpdate = Date.now();

    // Parse tech
    config.astroTech = data[124];
    config.combustionDrive = data[115];
    config.computerTech = data[108];
    config.energyTech = data[113];
    config.espionageTech = data[106];
    config.hyperspaceDrive = data[118];
    config.hyperspaceTech = data[114];
    config.impulseDrive = data[117];
    config.ionTech = data[121];
    config.laserTech = data[120];
    config.plasmaTech = data[122];
  }
};
