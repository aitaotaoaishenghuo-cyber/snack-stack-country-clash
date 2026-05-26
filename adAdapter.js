(function () {
  const config = window.RESCUE_AD_CONFIG || {};
  const providerName = config.provider || "mock";
  const providers = {};
  let activeAd = null;

  function track(eventName, properties = {}) {
    window.RescueAnalytics?.track(eventName, {
      ad_provider: providerName,
      ...properties
    });
  }

  function ensureModal() {
    let modal = document.querySelector("#adRewardModal");
    if (modal) {
      return modal;
    }

    modal = document.createElement("div");
    modal.id = "adRewardModal";
    modal.className = "modal hidden";
    modal.innerHTML = `
      <div class="modal-card ad-card" role="dialog" aria-modal="true" aria-labelledby="adRewardTitle">
        <p class="eyebrow">Rewarded Ad</p>
        <h2 id="adRewardTitle">Reward loading</h2>
        <p id="adRewardCopy">A short rewarded ad will play here after monetization approval.</p>
        <div class="ad-progress" aria-hidden="true"><span id="adProgressBar"></span></div>
        <div class="modal-actions">
          <button id="adCancelButton" type="button">Cancel</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    return modal;
  }

  function mockRewardedAd({ placement, rewardName }) {
    if (activeAd) {
      return Promise.resolve(false);
    }

    const modal = ensureModal();
    const title = modal.querySelector("#adRewardTitle");
    const copy = modal.querySelector("#adRewardCopy");
    const bar = modal.querySelector("#adProgressBar");
    const cancelButton = modal.querySelector("#adCancelButton");
    let timeoutId = null;
    let intervalId = null;
    let progress = 0;

    title.textContent = rewardName || "Reward ready";
    copy.textContent = "Mock ad is running. After approval, this same slot will show a real rewarded ad.";
    bar.style.width = "0%";
    modal.classList.remove("hidden");
    track("ad_start", { placement, reward_name: rewardName });

    activeAd = new Promise((resolve) => {
      function finish(granted) {
        clearTimeout(timeoutId);
        clearInterval(intervalId);
        modal.classList.add("hidden");
        activeAd = null;
        if (granted) {
          track("ad_complete", { placement, reward_name: rewardName });
        } else {
          track("ad_cancel", { placement, reward_name: rewardName });
        }
        resolve(granted);
      }

      cancelButton.onclick = () => finish(false);
      intervalId = setInterval(() => {
        progress = Math.min(100, progress + 8);
        bar.style.width = `${progress}%`;
      }, 120);
      timeoutId = setTimeout(() => finish(true), config.mockDurationMs || 1600);
    });

    return activeAd;
  }

  providers.mock = {
    showRewardedAd: mockRewardedAd
  };

  async function showRewardedAd(options = {}) {
    const placement = options.placement || "unknown";
    const rewardName = options.rewardName || "Reward";
    track("ad_offer", { placement, reward_name: rewardName });

    const provider = providers[providerName] || providers.mock;
    try {
      return await provider.showRewardedAd({ ...options, placement, rewardName });
    } catch (error) {
      track("ad_error", {
        placement,
        reward_name: rewardName,
        message: error?.message || "Unknown ad error"
      });
      return false;
    }
  }

  window.RescueAds = {
    showRewardedAd,
    registerProvider(name, provider) {
      providers[name] = provider;
    }
  };
})();
