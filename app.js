(() => {
  "use strict";

  const PATCH_VERSION = "v153-pet-mobile-icon-double";
  const PATCH_STATUS_LABEL = "v153・釣りニャンスマホ表示ほぼ倍サイズ版";
  const SOURCE_APP_URLS = [
    "https://cdn.jsdelivr.net/gh/cichlid528/mie-fishing-map@486490f1fda171ba9dfdf8ac9a431d4b3b09c530/app.js",
    "https://raw.githubusercontent.com/cichlid528/mie-fishing-map/486490f1fda171ba9dfdf8ac9a431d4b3b09c530/app.js"
  ];
  const SOURCE_CACHE_KEY = "mie-fishing-map-source-cache-486490f1-v153";

  const oldOsugiLine = '    { id: "lake-osugi", name: "大杉湖", type: "ダム", area: "多気郡大台町", lat: 34.286385, lng: 136.19336, zoom: 14, source: "指定リスト", subtype: "レイク・ダム湖" },';
  const newOsugiLine = '    { id: "lake-osugi", name: "宮川ダム", type: "ダム", area: "多気郡大台町", lat: 34.286385, lng: 136.19336, zoom: 14, source: "指定リスト", subtype: "レイク・ダム湖" },';
  const oldNanairoLine = '    { id: "reservoir-nanairo", name: "七色貯水池", type: "ダム", area: "熊野市・紀和町周辺", lat: 33.991304, lng: 136.004799, zoom: 14, source: "指定リスト", subtype: "レイク・ダム湖" },';
  const newNanairoLine = '    { id: "reservoir-nanairo", name: "七色ダム", type: "ダム", area: "熊野市・紀和町周辺", lat: 33.991304, lng: 136.004799, zoom: 14, source: "指定リスト", subtype: "レイク・ダム湖" },';
  const ikeharaLine = '    { id: "dam-ikehara", name: "池原ダム", type: "ダム", area: "奈良県吉野郡下北山村", lat: 34.04694, lng: 135.97111, zoom: 14, source: "指定リスト", subtype: "レイク・ダム湖" },';

  function showLoadError(error) {
    console.error("Mie Fishing Map v153 loader failed", error);
    const message = "アプリ本体の読み込みに失敗しました。通信状況を確認して、reset-cache.html?auto=1 を開き直してください。";
    const target = document.querySelector("#dataStatus") || document.body;
    if (!target) return;
    if (target === document.body) {
      const notice = document.createElement("div");
      notice.textContent = message;
      notice.style.cssText = "position:fixed;left:12px;right:12px;bottom:12px;z-index:2147483647;padding:12px 14px;border-radius:14px;background:#fff3cd;color:#4d3b00;font-weight:800;box-shadow:0 12px 30px rgba(0,0,0,.25);line-height:1.5;";
      document.body.appendChild(notice);
    } else {
      target.textContent = message;
    }
  }

  async function fetchSourceApp() {
    try {
      const cached = localStorage.getItem(SOURCE_CACHE_KEY) || "";
      if (cached.includes('const seedSpots = [')) return cached;
    } catch (error) {}
    let lastError = null;
    for (const url of SOURCE_APP_URLS) {
      try {
        const response = await fetch(`${url}?v=${PATCH_VERSION}`, { cache: "force-cache" });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);
        const source = await response.text();
        if (!source.includes('const seedSpots = [')) throw new Error(`Unexpected app source: ${url}`);
        try { localStorage.setItem(SOURCE_CACHE_KEY, source); } catch (error) {}
        return source;
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError || new Error("Source app could not be loaded.");
  }

  function patchSource(source) {
    let patched = source
      .replace('const APP_VERSION = "v131-remove-chusei-green-park";', `const APP_VERSION = "${PATCH_VERSION}";`)
      .replace('const APP_STATUS_LABEL = "v131・中勢グリーンパーク削除版";', `const APP_STATUS_LABEL = "${PATCH_STATUS_LABEL}";`)
      .replace('// v131: 中勢グリーンパーク池も除いた初期収録。', '// v153: スマホの釣りニャン表示を見た目でほぼ倍サイズへ調整。')
      .replace(oldOsugiLine, newOsugiLine)
      .replace(oldNanairoLine, `${newNanairoLine}\n${ikeharaLine}`);

    patched = patched
      .replaceAll('"大杉湖"', '"宮川ダム"')
      .replaceAll('"七色貯水池"', '"七色ダム"')
      .replaceAll('>大杉湖<', '>宮川ダム<')
      .replaceAll('>七色貯水池<', '>七色ダム<')
      .replaceAll('v131-remove-chusei-green-park', PATCH_VERSION)
      .replaceAll('v131・中勢グリーンパーク削除版', PATCH_STATUS_LABEL);

    if (!patched.includes('id: "dam-ikehara"')) {
      patched = patched.replace(newNanairoLine, `${newNanairoLine}\n${ikeharaLine}`);
    }

    const petCatchBridge = `
  // v153: 釣りニャンの「釣果記録」ボタンから、アプリ本体の釣果記録画面をすぐ開くための橋渡し。
  window.__MIE_OPEN_CATCH_PANEL_FROM_PET__ = function openCatchPanelFromPet() {
    try {
      state.positionAdjustSpotId = null;
      updatePositionAdjustBanner();
      if (state.spotMode) setSpotMode(false);
      if (state.catchMode) setCatchMode(false);
      try { hideSpotCard(); } catch (error) {}
      try { map?.closePopup?.(); } catch (error) {}
      document.body.classList.remove("map-popup-open", "record-popup-open", "spot-card-open");

      let lat = MIE_CENTER[0];
      let lng = MIE_CENTER[1];
      const center = map?.getCenter?.();
      if (center && isInsideMieNavBounds(center.lat, center.lng)) {
        lat = Number(center.lat);
        lng = Number(center.lng);
      }
      const latlng = (typeof L !== "undefined" && L.latLng) ? L.latLng(lat, lng) : { lat, lng };
      openCatchPanel(null, latlng, { recordType: "catch", recordMode: "super" });
      setCatchLocationStatus(lat, lng, "地図中央");
      closeMobileMenu();
      if (els?.dataStatus) els.dataStatus.textContent = "釣果記録を開きました。位置は地図中央です。必要なら現在地を使ってください。";
      return true;
    } catch (error) {
      console.error("釣りニャンから釣果記録を開けませんでした", error);
      return false;
    }
  };
  window.__MIE_PET_CATCH_BRIDGE_READY__ = true;
  try { window.dispatchEvent(new CustomEvent("mie:pet-catch-bridge-ready")); } catch (error) {}
`;
    if (!patched.includes("__MIE_OPEN_CATCH_PANEL_FROM_PET__")) {
      patched = patched.replace("  function closeCatchPanel() {", `${petCatchBridge}\n  function closeCatchPanel() {`);
    }

    return patched;
  }

  fetchSourceApp()
    .then((source) => {
      const patchedSource = patchSource(source);
      const runPatchedApp = new Function(patchedSource);
      runPatchedApp();
    })
    .catch(showLoadError);
})();
