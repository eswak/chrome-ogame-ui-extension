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
      _this.try = 0;

      _this.setStatus = function (status) {
        function setColor (color) {
          $('#planet_' + _this.coordsStr + ' .icon_eye').css('box-shadow', 'inset 0 0 0 20px rgba(' + color + ',0.5)');
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
            token: getNewToken()
          },
          dataType: 'json',
          type: 'POST',
          success: function (a) {
            if (a && a.response) {
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
                  _this.waitForFreeMissionSlot();
                } else {
                  if (_this.try < 3) {
                    _this.try += 1;
                    getGalaxyAndTryAgain();
                  } else {
                    // unknown situation. Process next operation
                    _this.setStatus('error');
                    processSpyQueue();
                  }
                }
              }
              localStorage.removeItem('uipp_miniFleetToken');
              window.miniFleetToken = a.newToken;
            } else {
              getGalaxyAndTryAgain ();
            }
          }
        });
      };

      function getNewToken () {
        var newToken = localStorage.getItem('uipp_miniFleetToken');
        if (newToken) {
          localStorage.removeItem('uipp_miniFleetToken');
          if (newToken !== window.miniFleetToken)
            _this.try = 0;
          return newToken;
        } else
          return window.miniFleetToken;
      }

      function getGalaxyAndTryAgain () {
        $.ajax('?page=galaxy', {
          success: function (text) {
            var newToken = text.match(/var miniFleetToken="(.*?)";/);
            if (newToken && newToken.length >= 2) {
              window.miniFleetToken = newToken[1];
              localStorage.removeItem('uipp_miniFleetToken');
            }
            _this.spy(2000);
          }
        });
      }


      _this.waitForFreeMissionSlot = function () {
        // get end time of latest mission
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
            var currentFleetCout = timeTab.length;
            var maxFleetCount = window.config.computerTech + 1;
            if (currentFleetCout >= (maxFleetCount - 2)) { // if queue full or just released one or two slots(-2)
              timeTab.sort(function (a, b) {return a - b;});
              var waitTime = Math.round(timeTab[0] - Date.now() / 1000) + 10;
              if (currentFleetCout >= maxFleetCount)
                msg('Waiting ' + Math.floor(waitTime) + ' seconds for free mission slot...');
              else
                waitTime = 2; // just released one slot
              _this.spy(waitTime * 1000);
            } else if (_this.try < 3) {
              _this.try += 1;
              getGalaxyAndTryAgain();
            } else {
              // unknown situation. Process next operation
              _this.setStatus('error');
              processSpyQueue();
            }
          }
        });
      };

      _this.setStatus('new');
    }



    function enqueueSpy (coords) {
      window.spyQueue = window.spyQueue || [];
      if (!window.spyQueue.find(function (s) { return s.eq(coords); })) {
        window.spyQueue.push(new Spy(coords));
        processSpyQueue();
      }
    }

    function removeFromQueue (spy) {
      window.spyQueue = window.spyQueue.filter(function (s) { return s.spyTime !== spy.spyTime; });
    }

    function processSpyQueue () {
      if (window.spyQueueCurrent && (window.spyQueueCurrent.status === 'end' || window.spyQueueCurrent.status === 'error')) {
        removeFromQueue(window.spyQueueCurrent);
      }

      if (!window.spyQueueCurrent || (window.spyQueueCurrent.status === 'end' || window.spyQueueCurrent.status === 'error')) {
        var spy = window.spyQueue.find(function (s) { return s.status === 'new'; });
        if (spy) {
          var delay = 500;
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
