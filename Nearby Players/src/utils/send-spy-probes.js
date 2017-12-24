var fn = function () {
  'use strict';

  window._startTime = Date.now();
  window._spy = function (galaxy, system, position) {

    function msg (str) {
      window.fadeBox(str, false);
    }

    function Spy (coords) {
      var _this = this;
      _this.coords = coords;
      _this.coordsStr = coords.galaxy + '_' + coords.system + '_' + coords.position;

      _this.setStatus = function (status) {
        function setColor (color) {
          $('#planet_' + _this.coordsStr + ' .icon_eye').css('box-shadow', 'inset 0 0 0 20px rgba(' + color + ',0.3)');
        }

        if (status === 'new') {
          setColor('0,100,250');
        } else if (status === 'spy') {
          setColor('0,100,0');
        } else if (status === 'delay') {
          setColor('200,200,0');
        } else if (status === 'end') {
          setColor('0,200,0');
        } else if (status === 'error') {
          setColor('250,0,0');
        }
        _this.status = status;
      };

      _this.eq = function (coords1) {
        return coords1.galaxy === _this.coords.galaxy &&
                coords1.system === _this.coords.system &&
                coords1.position === _this.coords.position;
      };

      _this.elapsed = function () {
        return Date.now() - _this.spyTime;
      };

      _this.spy = function (delay) {
        if (delay && delay > 0) {
          _this.setStatus('delay');
          setTimeout(_this.spy, delay);
          return;
        }

        _this.spyTime = Date.now();
        _this.setStatus('spy');
        $.ajax('?page=minifleet&ajax=1', {
          data: {
            mission: 6,
            galaxy: galaxy,
            system: system,
            position: position,
            type: 1,
            shipCount: window.constants.espionage,
            token: window.miniFleetToken
          },
          dataType: 'json',
          type: 'POST',
          success: function (a) {
            if (a.response.success) {
              _this.setStatus('end');
              processSpyQueue();
              window.uipp_analytics('uipp-spy', 'success');
            } else {
              _this.setStatus('delay');
              window.uipp_analytics('uipp-spy', 'failed');
              if (a.response.coordinates) {
                // wait for free mission slot
                msg(a.response.message);
                enqueueOnFreeMissionSlot(_this.spy);
              } else {
                // general error, try again in 2 sec
                setTimeout(_this.spy, 2000);
              }
            }
            window.miniFleetToken = a.newToken;
          }
        });
      };

      _this.setStatus('new');
    }

    function enqueueOnFreeMissionSlot (func) {
      // get end time of next mission
      $.ajax('?page=eventList&ajax=1', {
        dataType: 'html',
        type: 'POST',
        success: function (res) {
          var timeTab = [];
          $(res).find('tr.eventFleet').each(function () {
            var t = $(this).attr('data-arrival-time');
            if (t && $(this).attr('data-return-flight') === 'true') {
              timeTab.push(t);
            }
          });
          if (timeTab.length > 0) {
            timeTab.sort(function (a, b) {return a - b;});
            var waitTime = Math.round(timeTab[0] - Date.now() / 1000) + 10 * Math.random();
            msg('Waitng ' + Math.floor(waitTime) + ' seconds for free mission slot...');
            setTimeout(func, waitTime * 1000);
          } else {
            // unknown situation. Retry in 30 secs
            setTimeout(func, 30 * 1000 + 10 * 1000 * Math.random());
          }
        }
      });
    }

    function enqueueSpy (coords) {
      window.spyQueue = window.spyQueue || [];
      if (!window.spyQueue.find(function (s) { return s.eq(coords); })) {
        window.spyQueue.push(new Spy(coords));
        processSpyQueue();
      }
    }

    function processSpyQueue () {
      if (window.spyQueueCurrent && window.spyQueueCurrent.status === 'end') {
        // remove from queue
        window.spyQueue = window.spyQueue.filter(function (s) { return s.spyTime !== window.spyQueueCurrent.spyTime; });
      }

      if (!window.spyQueueCurrent || window.spyQueueCurrent.status === 'end') {
        var spy = window.spyQueue.find(function (s) { return s.status === 'new'; });
        if (spy) {
          var delay = 500 * Math.random();
          if (window.spyQueueCurrent)
            delay += Math.max(0, 1500 - window.spyQueueCurrent.elapsed());
          spy.spy(delay);
          window.spyQueueCurrent = spy;
        }
      }
    }

    enqueueSpy({ galaxy: galaxy, system: system, position: position });
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
