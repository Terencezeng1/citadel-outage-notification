(function () {
  'use strict';

  var STATUS_URL = 'https://terencezeng1.github.io/citadel-outage-notification/emergency-status.txt';
  var POLL_INTERVAL_MS = 60 * 1000;
  var BANNER_ID = 'cc-citadel-outage-banner';

  function renderBanner(content) {
    try {
      var banner = document.getElementById(BANNER_ID);
      var text = (content || '').trim();
      if (!text) {
        if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
        return;
      }
      if (!banner) {
        banner = document.createElement('div');
        banner.id = BANNER_ID;
        banner.setAttribute('role', 'alert');
        banner.style.cssText =
          'position:fixed;top:0;left:0;right:0;z-index:2147483647;' +
          'background:#c8102e;color:#ffffff;padding:12px 16px;text-align:center;' +
          'font-family:inherit;font-size:14px;line-height:1.4;' +
          'box-shadow:0 2px 6px rgba(0,0,0,0.25);';
        document.body.appendChild(banner);
      }
      banner.textContent = text;
    } catch (e) { /* never break the app */ }
  }

  function checkStatus() {
    try {
      fetch(STATUS_URL + '?t=' + Date.now(), { method: 'GET', cache: 'no-store', credentials: 'omit' })
        .then(function (res) { return res.ok ? res.text() : ''; })
        .then(renderBanner)
        .catch(function () { renderBanner(''); });
    } catch (e) { /* never break the app */ }
  }

  checkStatus();
  setInterval(checkStatus, POLL_INTERVAL_MS);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') checkStatus();
  });
})();
