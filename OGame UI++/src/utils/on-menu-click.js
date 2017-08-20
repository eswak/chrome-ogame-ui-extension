var fn = function () {
  'use strict';

  var uippClassName = 'uiEnhancementWindow';

  window._onMenuClick = function (menuClass) {
    var $existingWrapper = $('#contentWrapper').find('.' + uippClassName);
    if ($existingWrapper.length === 0) {
      // uipp not visible
      $('.menubutton.selected').removeClass('selected').addClass('tempUnselected');
      $('.menuImage.highlighted').removeClass('highlighted').addClass('tempUnhighlighted');
      $('.' + menuClass)
        .find('.menubutton').addClass('selected').end()
        .find('.menuImage').addClass('highlighted');
    } else {
      // uipp visible
      $existingWrapper.remove();
      $('.enhanced .menubutton.selected').removeClass('selected');
      $('.enhanced .menuImage.highlighted').removeClass('highlighted');
      if (window.uippTab === menuClass) {
        // exit uipp
        $('.tempUnselected').addClass('selected');
        $('.tempUnhighlighted').addClass('highlighted');
        $('#contentWrapper > :not(#eventboxContent)').show();
        window.uippTab = null;
        return null;
      } else {
        $('.' + menuClass)
          .find('.menubutton').addClass('selected').end()
          .find('.menuImage').addClass('highlighted');
      }
    }
    window.uippTab = menuClass;
    return $('<div class="' + uippClassName + ' clearfix"></div>');
  };

  window._insertHtml = function ($wrapper) {
    $('#contentWrapper > :not(#eventboxContent)').hide();
    $('#contentWrapper').append($wrapper);
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
