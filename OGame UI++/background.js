console.log('OGame UI++ background started.');

chrome.runtime.onMessage.addListener((data) => {
  console.log('OGame UI++ background message received', data);
  if (data.type === 'notification') {
    chrome.alarms.create(JSON.stringify(data.options), {
      when: data.when || Date.now()
    });
  }
  if (data.type === 'notification-delete') {
    chrome.alarms.clear(JSON.stringify(data.options));
  }
});

chrome.alarms.onAlarm.addListener((data) => {
  var args = JSON.parse(data.name);
  console.log('OGame UI++ notification', args);
  chrome.notifications.create('UIPPNotification', args);
});
