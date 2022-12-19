'use strict';
window._getScreenshotLink = function (element, cb) {
  window.domtoimage
    .toPng(element)
    .then(function (dataUrl) {
      $.ajax({
        method: 'POST',
        url: 'https://api.imgur.com/3/image',
        headers: {
          Authorization: 'Client-ID 33b30fca5707040'
        },
        data: {
          image: dataUrl.split('image/png;base64,')[1],
          type: 'base64'
        },
        success: function (response) {
          cb && cb(null, response.data.link);
        },
        error: function (err) {
          cb && cb(err);
        }
      });
    })
    .catch(function (err) {
      cb && cb(err);
    });
};
