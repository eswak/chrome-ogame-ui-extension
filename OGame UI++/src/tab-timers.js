var fn = function () {
  'use strict';

  window._addTimerTab = function _addTimerTab () {
    var $timerEntry =
      $('<li class="stats enhanced"><span class="menu_icon">' +
        '<div class="menuImage empire"></div>' +
        '</span><a class="menubutton" href="#" accesskey="" target="_self"  ondragstart="return false">' +
        '</a></li>');
    $('#menuTable').append($timerEntry);

    var $input = $(
      '<input id="timer" class="textlabel enhancement tooltipHTML"' +
      'placeholder = "timer / note"' +
      'style="' +
      'width: 84%;' +
      'height: 38%;' +
      'position: relative;' +
      'top: 1px;' +
      'background: #000;' +
      'text-align: center;' +
      'padding-left: 2px;' +
      'font-weight: inherit;' +
      'font-family: inherit;' +
      'font-size: inherit;' +
      '">');
    $input.attr('title', '5 = 5m<br>.5h = 30m<br>1h2m3s = 67m 3s<br>0.5 note = 30s note<br>ENTER = start');
    $input.append('<style>#timer::-webkit-input-placeholder { color: #624790; } </style>');

    var timer;
    function stopTimer (finished) {
      // console.log('timer stop');
      if (timer) {
        clearInterval(timer);
        timer = undefined;
      }
      config.run = false;
      saveConfig();
      if (!finished)
        $input.css('background', '#000');
    }

    $input.on('keyup', function (event) {
      if (timer)
        return;
      var $this = $(this);
      var hours = 0;
      var minutes = 0;
      var seconds = 0;
      var comment = '';

      var s = $this.val().replace(',', '.');
      var match;
      if ((match = s.match(/(\d*)?([,.])?(\d+)h/i))) {
        hours = Number(match[0].replace('h',''));
        s = s.slice(match[0].length).trim();
      }
      if ((match = s.match(/(\d*)?([,.])?(\d+)(m|\s|$)/i))) {
        minutes = Number(match[0].replace('m',''));
        s = s.slice(match[0].length).trim();
      }
      if ((match = s.match(/(\d*)?([,.])?(\d+)s/i))) {
        seconds = Number(match[0].replace('s',''));
        s = s.slice(match[0].length).trim();
      }
      comment = s.trim();
      // window.console.log('code:' + event.keyCode + ' h: ' + hours + '  m: ' + minutes + ' s: ' + seconds + ' comment: ' + comment);

      var leftSeconds = 0;
      leftSeconds = parseInt(hours * 3600 + minutes * 60 + seconds);
      if (event.keyCode === 13 && leftSeconds > 0) { // ENTER
        // window.console.log('fire timer leftSeconds: ' + leftSeconds);
        window.uipp_analytics && window.uipp_analytics('uipp-timers', 'set-timer');

        var intervalFunc = function () {
          leftSeconds -= 1;
          if (leftSeconds >= 0) {
            var leftHours = parseInt((leftSeconds + 30) / 3600);
            var leftMinutes = parseInt(((leftSeconds + 30) - leftHours * 3600) / 60);
            var text = (leftHours > 0 ? leftHours + 'h ' : '') +
                        (leftSeconds >= 60 ? leftMinutes + 'm' : '') + ' ' +
                        (leftSeconds < 60 ? (leftSeconds % 60) + 's' : '') + ' ' +
                        comment;
            $this.val(text.trim());
            // window.console.log('leftSeconds: ' + leftSeconds);
          } else {
            stopTimer(true);
            playTone(4000, 0.1);
            setTimeout(function () {
              playTone(4000, 0.1);
              window.alert('UI++ alert: ' + comment);
            }, 200);
          }
        };
        timer = setInterval(intervalFunc, 1000);
        $this.css('background', 'rgb(78, 0, 67)').blur();
        intervalFunc();
        config.run = true;
        config.endTime = new Date().getTime() + leftSeconds * 1000;
      } else {
        comment = $this.val();
        config.endTime = null;
      }
      config.comment = comment;
      saveConfig();
    });

    $input.on('focus', function () {
      config.endTime = null;
      config.comment = this.value;
      stopTimer();
    });

    var config = localStorage.getItem('uipp_timers');
    config = JSON.parse(config) || {};
    var leftSeconds1 = config.endTime && parseInt((new Date(config.endTime).getTime() - new Date().getTime()) / 1000) || 0;
    var comment1 = config.comment || '';
    $input.val((leftSeconds1 > 0 ? leftSeconds1 + 's ' : '') + comment1);
    if (config.run)
      $input.trigger($.Event('keyup', { keyCode: 13 }));

    function saveConfig () {
      localStorage.setItem('uipp_timers', JSON.stringify(config));
    }

    var context;
    function playTone (frequency, time) {
      context = context || new (window.AudioContext || window.webkitAudioContext)();
      var osc = context.createOscillator(); // instantiate an oscillator
      osc.type = 'sine'; // this is the default - also square, sawtooth, triangle
      osc.frequency.value = frequency; // Hz
      var vol = context.createGain();
      vol.gain.value = 0.03; // from 0 to 1, 1 full volume, 0 is muted
      osc.connect(vol); // connect osc to vol
      vol.connect(context.destination);
      osc.start(); // start the oscillator
      osc.stop(context.currentTime + time); // stop 'time' seconds after the current time
    }

    var $button = $timerEntry.find('.menubutton');
    $button.append($input);
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
