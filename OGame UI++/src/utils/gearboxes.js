var fn = function () {
  'use strict';

  window.uipp_setupConfigMode = function (name, description, $content) {
    var feature = 'feature-' + name;
    var enabled = window.config.features[feature];
    if (enabled === undefined) enabled = true;
    var $wrapper = $(['<div id="' + feature + '" class="uipp-gearbox clearfix">',
      // '<div class="uipp-gearbox-msg" style="z-index: 2;">', description, '</div>',
      '</div>'].join(''));
    $wrapper.append($('<div class="uipp-gearbox-fill tooltip shadowed" style="position: absolute; z-index: 1; cursor: pointer;"></div>')
      .attr('title', description)
    );
    $wrapper.append($content);
    !enabled && $wrapper.hide();
    return $wrapper;
  };

  window.uipp_gearIcon = function () {
    return $('<a class="planetMoveIcons settings planetMoveGiveUp icon" style="z-index:99;" href="javascript:void(0);"></a>')
      .css({
        'position': 'absolute',
        'z-index': '2',
        // 'height': '2vh',
        // 'width': '2vh',
        // 'background-size': 'cover',
        'margin': '0.5vh'
      })
      .click(function () {
        var show = $(this).attr('show') !== 'true';
        $(this).attr('show', show);
        // show border
        $('.uipp-gearbox').each(function () {
          var $this = $(this);
          var feature = $this.attr('id');
          var enabled = window.config.features[feature];
          if (enabled === undefined) enabled = true;
          show || enabled ? $this.show() : $this.hide();
          show && !enabled && window.dispatchEvent(new Event('resize')); // force redraw chartis
          $this.find('.uipp-gearbox-fill')
            .width($this.outerWidth())
            .height($this.outerHeight())
            .click(function () {
              enabled = !enabled;
              window.config.features[feature] = enabled;
              window._saveConfig();
              $(this).css('background-color', 'rgba(0,0,0,' + (enabled ? '0.3' : '0.8') + ')');
            })
            .css({
              'background-color': 'rgba(0,0,0,' + (enabled ? '0.3' : '0.8') + ')',
              'border': '2px dashed darkgrey',
              'border-radius': '3px',
              'margin': '-2px',
              'display': show ? 'block' : 'none' });
        });
      // move chackbox to the right
      // $('.uipp-gearbox input').each(function () {
      //   $(this).css({
      //     'opacity': '1',
      //     'left': $(this).parent().outerWidth() - $(this).outerWidth() });
      // });

      // show/hide message
      // $('.uipp-gearbox-msg').each(function () { show ? $(this).show() : $(this).hide(); });
      });
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
