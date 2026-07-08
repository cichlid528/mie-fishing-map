(() => {
  "use strict";

  const PATCH_VERSION = "v137-turi-nyan-motion-sheet";
  const PATCH_STATUS_LABEL = "v137・釣りニャン表情モーション採用版";
  const SOURCE_APP_URLS = [
    "https://cdn.jsdelivr.net/gh/cichlid528/mie-fishing-map@486490f1fda171ba9dfdf8ac9a431d4b3b09c530/app.js",
    "https://raw.githubusercontent.com/cichlid528/mie-fishing-map/486490f1fda171ba9dfdf8ac9a431d4b3b09c530/app.js"
  ];

  const oldOsugiLine = '    { id: "lake-osugi", name: "大杉湖", type: "ダム", area: "多気郡大台町", lat: 34.286385, lng: 136.19336, zoom: 14, source: "指定リスト", subtype: "レイク・ダム湖" },';
  const newOsugiLine = '    { id: "lake-osugi", name: "宮川ダム", type: "ダム", area: "多気郡大台町", lat: 34.286385, lng: 136.19336, zoom: 14, source: "指定リスト", subtype: "レイク・ダム湖" },';
  const oldNanairoLine = '    { id: "reservoir-nanairo", name: "七色貯水池", type: "ダム", area: "熊野市・紀和町周辺", lat: 33.991304, lng: 136.004799, zoom: 14, source: "指定リスト", subtype: "レイク・ダム湖" },';
  const newNanairoLine = '    { id: "reservoir-nanairo", name: "七色ダム", type: "ダム", area: "熊野市・紀和町周辺", lat: 33.991304, lng: 136.004799, zoom: 14, source: "指定リスト", subtype: "レイク・ダム湖" },';
  const ikeharaLine = '    { id: "dam-ikehara", name: "池原ダム", type: "ダム", area: "奈良県吉野郡下北山村", lat: 34.04694, lng: 135.97111, zoom: 14, source: "指定リスト", subtype: "レイク・ダム湖" },';

  function showLoadError(error) {
    console.error("Mie Fishing Map v137 loader failed", error);
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
    let lastError = null;
    for (const url of SOURCE_APP_URLS) {
      try {
        const response = await fetch(`${url}?v=${PATCH_VERSION}&t=${Date.now()}`, { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);
        const source = await response.text();
        if (!source.includes('const seedSpots = [')) throw new Error(`Unexpected app source: ${url}`);
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
      .replace('// v131: 中勢グリーンパーク池も除いた初期収録。', '// v137: 宮川ダム・七色ダム・池原ダム反映に加えて、釣りニャン表情モーションを追加。')
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
