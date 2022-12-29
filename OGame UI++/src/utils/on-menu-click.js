'use strict';

var uippClassName = 'uiEnhancementWindow';
var uippActiveTab = null;
var $contentWrapper = _getContentWrapper();
if ($contentWrapper.length === 0) {
  $contentWrapper = $('#middle').first();
}

window._onMenuClick = function (menuClass) {
  $contentWrapper = _getContentWrapper();
  var $uippTab = $('.' + uippClassName);
  if ($uippTab.length && menuClass === uippActiveTab) {
    $uippTab.remove();
    $contentWrapper.show();
    $('#sideBar').show();
    $('#planet').show();

    // turn off custom tab
    $('.selected').removeClass('selected');
    $('.highlighted').removeClass('highlighted');
    // turn on regular tab
    $('.tempUnselected').addClass('selected');
    $('.tempUnhighlighted').addClass('highlighted');
    // reset tmp classes
    $('.tempUnselected').removeClass('tempUnselected');
    $('.tempUnhighlighted').removeClass('tempUnhighlighted');
    $('.customSelected').removeClass('selected');
    $('.customHighlighted').removeClass('highlighted');

    $('.injectedComponent').show();
  } else {
    $('.' + uippClassName).remove();
    uippActiveTab = menuClass;
    return $('<div class="' + uippClassName + '"></div>');
  }
  return;
};

window._insertHtml = function ($wrapper) {
  $contentWrapper.parent().append($wrapper);
  $contentWrapper.hide();
  $('.injectedComponent').hide();
  $('#sideBar').hide();
  $('#planet').hide();

  // menu
  // disable current
  $('.menubutton.selected').removeClass('selected').addClass('tempUnselected');
  $('.menuImage.highlighted').removeClass('highlighted').addClass('tempUnhighlighted');
  // highlight uipp
  $('.' + uippActiveTab)
    .find('.menubutton')
    .addClass('selected')
    .addClass('customSelected')
    .end()
    .find('.menuImage')
    .addClass('highlighted')
    .addClass('customHighlighted');
};

window._getContentWrapper = _getContentWrapper;

function _getContentWrapper() {
  return $(
    [
      '#overviewcomponent',
      '#suppliescomponent',
      '#lfbuildingscomponent', // lifeforms
      '#lfresearchcomponent', // lifeforms
      '#facilitiescomponent',
      '#inhalt', // merchant, officers, shop
      '#researchcomponent',
      '#shipyardcomponent',
      '#defensescomponent',
      '#fleetdispatchcomponent',
      '#galaxycomponent',
      '#netz',
      '#buttonz', // messages
      '#chatList', // instant chat
      '#chatContent' // instant chat
    ].join(', ')
  ).first();
}
