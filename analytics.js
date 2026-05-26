(function () {
  const config = window.RESCUE_ANALYTICS_CONFIG || {};
  const localKey = "rescue-rush-events-v1";
  const sessionKey = "rescue-rush-session-id";
  const sessionId = getSessionId();
  let posthogReady = false;
  let tiktokReady = false;
  const pendingEvents = [];

  function getSessionId() {
    try {
      const existing = sessionStorage.getItem(sessionKey);
      if (existing) {
        return existing;
      }
      const next = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      sessionStorage.setItem(sessionKey, next);
      return next;
    } catch {
      return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }
  }

  function loadScript(src, onload) {
    const script = document.createElement("script");
    script.async = true;
    script.src = src;
    script.onload = onload;
    document.head.appendChild(script);
  }

  function loadPostHog() {
    if (!config.posthogKey || !config.posthogHost) {
      return;
    }
    loadScript(`${config.posthogHost}/static/array.js`, () => {
      if (!window.posthog?.init) {
        return;
      }
      window.posthog.init(config.posthogKey, {
        api_host: config.posthogHost,
        person_profiles: "identified_only",
        capture_pageview: false
      });
      posthogReady = true;
      flushPendingEvents();
    });
  }

  function loadTikTokPixel() {
    if (!config.tiktokPixelId) {
      return;
    }
    /* eslint-disable */
    !function (w, d, t) {
      w.TiktokAnalyticsObject = t;
      const ttq = w[t] = w[t] || [];
      ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie", "holdConsent", "revokeConsent", "grantConsent"];
      ttq.setAndDefer = function (target, method) {
        target[method] = function () {
          target.push([method].concat(Array.prototype.slice.call(arguments, 0)));
        };
      };
      for (let i = 0; i < ttq.methods.length; i += 1) {
        ttq.setAndDefer(ttq, ttq.methods[i]);
      }
      ttq.load = function (id) {
        const script = d.createElement("script");
        script.async = true;
        script.src = "https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=" + id + "&lib=" + t;
        const first = d.getElementsByTagName("script")[0];
        first.parentNode.insertBefore(script, first);
      };
      ttq.load(config.tiktokPixelId);
      tiktokReady = true;
    }(window, document, "ttq");
    /* eslint-enable */
  }

  function saveLocalEvent(payload) {
    try {
      const events = JSON.parse(localStorage.getItem(localKey) || "[]");
      events.push(payload);
      localStorage.setItem(localKey, JSON.stringify(events.slice(-500)));
    } catch {
      // Local analytics is best effort only.
    }
  }

  function track(eventName, properties = {}) {
    const payload = {
      event: eventName,
      ts: new Date().toISOString(),
      session_id: sessionId,
      path: location.pathname,
      referrer: document.referrer || "",
      ...properties
    };

    saveLocalEvent(payload);

    if (posthogReady && window.posthog?.capture) {
      sendPostHog(eventName, payload);
    } else if (config.posthogKey) {
      pendingEvents.push([eventName, payload]);
    }
    if (tiktokReady && window.ttq?.track) {
      window.ttq.track(eventName, payload);
    }
    if (config.debug) {
      console.log("[RescueAnalytics]", eventName, payload);
    }
  }

  function sendPostHog(eventName, payload) {
    window.posthog.capture(eventName, payload);
  }

  function flushPendingEvents() {
    while (pendingEvents.length > 0) {
      const [eventName, payload] = pendingEvents.shift();
      sendPostHog(eventName, payload);
    }
  }

  window.RescueAnalytics = {
    track,
    getLocalEvents() {
      try {
        return JSON.parse(localStorage.getItem(localKey) || "[]");
      } catch {
        return [];
      }
    },
    clearLocalEvents() {
      localStorage.removeItem(localKey);
    }
  };

  loadPostHog();
  loadTikTokPixel();
  track("page_view", {
    title: document.title
  });
})();
