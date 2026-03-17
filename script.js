const progressApiUrl = "https://script.google.com/macros/s/AKfycbxp_DEs5z3QgkdkxX4LkEUgsUk9iN2MIN1Wb7is6Wb9XhI_LlIG2-A7OPV7XPOoUQ/exec";

function formatNumber(num) {
  return new Intl.NumberFormat("zh-TW").format(num);
}

function renderProgress(data) {
  document.getElementById("current-amount").textContent = formatNumber(data.total);
  document.getElementById("goal-amount").textContent = formatNumber(data.goal);
  document.getElementById("progress-percent").textContent = data.percent;
  document.getElementById("supporter-count").textContent = formatNumber(data.supporterCount);
  document.getElementById("progress-fill").style.width = `${data.percent}%`;

  if (data.unlocks && Array.isArray(data.unlocks)) {
    data.unlocks.forEach((item) => {
      const card = document.getElementById(`unlock-${item.amount}`);
      if (!card) return;

      if (item.unlocked) {
        card.classList.add("unlocked");
      } else {
        card.classList.remove("unlocked");
      }
    });
  }
}

function loadProgress() {
  const callbackName = "handleFundingData";

  window[callbackName] = function (data) {
    renderProgress(data);
    delete window[callbackName];
  };

  const oldScript = document.getElementById("jsonp-script");
  if (oldScript) {
    oldScript.remove();
  }

  const script = document.createElement("script");
  script.id = "jsonp-script";
  script.src = `${progressApiUrl}?callback=${callbackName}&t=${Date.now()}`;
  script.onerror = function () {
    console.error("讀取募資進度失敗：JSONP 載入錯誤");
  };

  document.body.appendChild(script);
}

loadProgress();
setInterval(loadProgress, 30000);

function updateFMVPRemaining(support1000Count, support2000Count) {
  const totalQualified = support1000Count + support2000Count;
  const remaining = Math.max(0, 100 - totalQualified);
  document.getElementById("fmvpRemaining").textContent = remaining;
}