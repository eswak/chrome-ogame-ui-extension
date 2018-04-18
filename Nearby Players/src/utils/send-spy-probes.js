var fn = function () {
  'use strict';

  window._startTime = Date.now();
  window._spy = function (galaxy, system, position) {
    
    function debug() {
      if (window.uipp_debug)
        console.log('ui++:', ...arguments);
    }

    function Spy (coords) {
      var _this = this;
      _this.coords = coords;
      _this.coordsStr = coords.galaxy + '_' + coords.system + '_' + coords.position;
      _this.try = 0;
      _this.waitingStatus = '';
      _this.errorBackoffSec = 1;

      _this.setStatus = function (status, code) {
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
          if (code)
            _this.showStatus('Error ' + code)
        }
        debug('set status', status, code != undefined ? code : '')

        if (status !== 'error')
          _this.showStatus(null);

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

      _this.showStatus = function (status) {
        var $p = $('#planet_' + _this.coordsStr + ' .icon_eye').parent();
        var $el = $p.find('.status');
        if (status) {
          if ($el.length == 0)
            $el = $p.append('<div class="status" style="position: absolute; white-space: nowrap;">'
              ).find('.status');
          $el.text(status);  
          // $('#spyQueueStatus').text(status);
        } else
          $el.remove();
      }

      _this.spy = function (delay) {
        if (delay && delay > 0) {
          _this.spyInMs = delay;
          _this.setStatus('delay');
          setTimeout(_this.spy, delay);
          _this.statusInterval = setInterval(() => { 
              _this.spyInMs-= 1000;
              _this.showStatus(Math.round(Math.max(0, _this.spyInMs/1000)) + 'sec ' + _this.waitingStatus);
            }, 1000 )
          return;
        }

        if (_this.statusInterval) {
          clearInterval(_this.statusInterval)
          _this.statusInterval = null;
          // _this.showStatus(null);
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
            debug('?page=minifleet', a);
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
                  _this.showStatus(a.response.message);
                } else {
                  if (_this.try < 3) {
                    _this.try += 1;
                    getGalaxyAndTryAgain();
                  } else {
                    // unknown situation. Process next operation
                    _this.setStatus('error', 1);
                    processSpyQueue();
                  }
                }
              }
              localStorage.removeItem('uipp_miniFleetToken');
              window.miniFleetToken = a.newToken;
            } else {
              getGalaxyAndTryAgain ();
            }
            _this.errorBackoffSec = 1;
          },
          error: _this.errorBackoffCb
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
            debug('galaxy new token', newToken);
            if (newToken && newToken.length >= 2) {
              window.miniFleetToken = newToken[1];
              localStorage.removeItem('uipp_miniFleetToken');
            }
            _this.spy(2000);
          },
          error: _this.errorBackoffCb
        });
      }


      _this.waitForFreeMissionSlot = function () {
        // get end time of latest mission
        $.ajax('?page=eventList&ajax=1', {
          dataType: 'html',
          type: 'POST',
          success: function (res) {
            debug('?page=eventList', $(res)[0]);
            var timeTab = [];
            $(res).find('tr.eventFleet').each(function () {
              var t = $(this).attr('data-arrival-time');
              if (t && $(this).attr('data-return-flight') === 'true') {
                timeTab.push(t);
              }
            });
            var currentFleetCout = timeTab.length;
            var maxFleetCount = window.config.computerTech + 1;
            debug('currentFleetCout, maxFleetCount, tech', currentFleetCout, maxFleetCount, window.config.computerTech);
            if (currentFleetCout >= Math.max(1, maxFleetCount - 2)) { // if queue full or just released one or two slots(-2)
              timeTab.sort(function (a, b) {return a - b;});
              var waitTime = Math.round(timeTab[0] - Date.now() / 1000) + 10;
              debug('waitTime', waitTime);
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
              _this.setStatus('error', 2);
              processSpyQueue();
            }
          },
          error: _this.errorBackoffCb
        });
      };

      function msg (str) {
        window.fadeBox(str, false);
        _this.waitingStatus = str;
        debug(str);
      }

      _this.errorBackoffCb = function (jqXHR, textStatus) {
          msg('ERROR: ' + textStatus);
          _this.errorBackoffSec += Math.min(60, _this.errorBackoffSec * 2);
          _this.spy((_this.errorBackoffSec + 1) * 1000);
      }

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
