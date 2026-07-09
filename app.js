(() => {
  "use strict";

  const PATCH_VERSION = "v158-bubble-size-menu-bg-fix";
  const PATCH_STATUS_LABEL = "v158・吹き出しサイズとメニュー背景修正版";
  const MENU_BACKGROUND_URL = `assets/menu-bg-bakucho-nyanko-sensei-v158.png?v=${PATCH_VERSION}`;
  const BACKGROUND_STORAGE_KEY = "mie-fishing-map-sidebar-background-v1";
  const MENU_BACKGROUND_FORCE_KEY = "mie-fishing-map-v158-bubble-size-menu-bg-fix-installed";
  const SOURCE_APP_URLS = [
    "https://cdn.jsdelivr.net/gh/cichlid528/mie-fishing-map@486490f1fda171ba9dfdf8ac9a431d4b3b09c530/app.js",
    "https://raw.githubusercontent.com/cichlid528/mie-fishing-map/486490f1fda171ba9dfdf8ac9a431d4b3b09c530/app.js"
  ];
  const SOURCE_CACHE_KEY = "mie-fishing-map-source-cache-486490f1-v158-bubble-size-menu-bg-fix";

  const oldOsugiLine = '    { id: "lake-osugi", name: "大杉湖", type: "ダム", area: "多気郡大台町", lat: 34.286385, lng: 136.19336, zoom: 14, source: "指定リスト", subtype: "レイク・ダム湖" },';
  const newOsugiLine = '    { id: "lake-osugi", name: "宮川ダム", type: "ダム", area: "多気郡大台町", lat: 34.286385, lng: 136.19336, zoom: 14, source: "指定リスト", subtype: "レイク・ダム湖" },';
  const oldNanairoLine = '    { id: "reservoir-nanairo", name: "七色貯水池", type: "ダム", area: "熊野市・紀和町周辺", lat: 33.991304, lng: 136.004799, zoom: 14, source: "指定リスト", subtype: "レイク・ダム湖" },';
  const newNanairoLine = '    { id: "reservoir-nanairo", name: "七色ダム", type: "ダム", area: "熊野市・紀和町周辺", lat: 33.991304, lng: 136.004799, zoom: 14, source: "指定リスト", subtype: "レイク・ダム湖" },';
  const ikeharaLine = '    { id: "dam-ikehara", name: "池原ダム", type: "ダム", area: "奈良県吉野郡下北山村", lat: 34.04694, lng: 135.97111, zoom: 14, source: "指定リスト", subtype: "レイク・ダム湖" },';

  function patchVisibleText(value) {
    return String(value || "")
      .replaceAll("爆調ニャンコ視聴", "爆釣ツインニャンコ")
      .replaceAll("爆調ツインニャンコ", "爆釣ツインニャンコ")
      .replaceAll("爆釣ニャンコ師匠", "爆釣にゃん師匠")
      .replaceAll("v131・中勢グリーンパーク削除版", PATCH_STATUS_LABEL)
      .replaceAll("v133・宮川ダム・七色ダム・池原ダム追加版", PATCH_STATUS_LABEL)
      .replaceAll("v134・宮川ダム・七色ダム・池原ダム反映版", PATCH_STATUS_LABEL)
      .replaceAll("v135・釣りニャン追加版", PATCH_STATUS_LABEL)
      .replaceAll("v136・釣りニャン後ろ姿モーション追加版", PATCH_STATUS_LABEL)
      .replaceAll("v137・釣りニャン表情モーション採用版", PATCH_STATUS_LABEL)
      .replaceAll("v138・釣りニャン丸アイコン撤去・漫画吹き出し版", PATCH_STATUS_LABEL)
      .replaceAll("v139・釣りニャン口元透過修正版", PATCH_STATUS_LABEL)
      .replaceAll("v140・釣りニャン指差し吹き出し採用版", PATCH_STATUS_LABEL)
      .replaceAll("v141・釣りニャン吹き出し文字調整版", PATCH_STATUS_LABEL)
      .replaceAll("v142・釣りニャン吹き出し右下しっぽ版", PATCH_STATUS_LABEL)
      .replaceAll("v143・釣りニャン吹き出し文字内側調整版", PATCH_STATUS_LABEL)
      .replaceAll("v144・釣りニャン吹き出し文字右寄せ調整版", PATCH_STATUS_LABEL)
      .replaceAll("v145・釣りニャン吹き出し文字下げ調整版", PATCH_STATUS_LABEL)
      .replaceAll("v146・釣りニャン反応モード追加版", PATCH_STATUS_LABEL)
      .replaceAll("v147・釣りニャン釣果記録ボタン連動版", PATCH_STATUS_LABEL)
      .replaceAll("v148・釣りニャン釣果記録高速化版", PATCH_STATUS_LABEL)
      .replaceAll("v149・釣りニャン高速化・軽量化版", PATCH_STATUS_LABEL)
      .replaceAll("v150・釣りニャン軽量ふわふわ復活版", PATCH_STATUS_LABEL)
      .replaceAll("v151・釣りニャンスマホ表示少し大きめ版", PATCH_STATUS_LABEL)
      .replaceAll("v152・釣りニャンスマホ表示さらに大きめ版", PATCH_STATUS_LABEL)
      .replaceAll("v153・釣りニャンスマホ表示ほぼ倍サイズ版", PATCH_STATUS_LABEL)
      .replaceAll("v154・釣りニャン初期背景採用版", PATCH_STATUS_LABEL)
      .replaceAll("v155・釣りニャン初期背景強制反映版", PATCH_STATUS_LABEL)
      .replaceAll("v156・メニュー背景と地図反映修正版", PATCH_STATUS_LABEL)
      .replaceAll("v157・漫画風吹き出しとメニュー背景修正版", PATCH_STATUS_LABEL)
      .replaceAll("v131-remove-chusei-green-park", PATCH_VERSION)
      .replaceAll("v155-default-background-force", PATCH_VERSION)
      .replaceAll("v156-menu-bg-map-fix", PATCH_VERSION)
      .replaceAll("v157-comic-bubble-menu-bg", PATCH_VERSION);
  }

  function installImmediateFixes() {
    const menuCssValue = `url("${MENU_BACKGROUND_URL}")`;
    try {
      if (localStorage.getItem(MENU_BACKGROUND_FORCE_KEY) !== "1") {
        localStorage.removeItem(BACKGROUND_STORAGE_KEY);
        localStorage.setItem(MENU_BACKGROUND_FORCE_KEY, "1");
      }
    } catch (error) {}

    const applyMenuBackground = () => {
      try {
        document.documentElement.style.setProperty("--menu-bg-image", menuCssValue);
        document.documentElement.style.setProperty("--sidebar-bg-image", menuCssValue);
      } catch (error) {}
      document.querySelectorAll(".sidebar, #mobileMenu.sidebar").forEach((sidebar) => {
        sidebar.style.setProperty("--menu-bg-image", menuCssValue);
        sidebar.style.setProperty("--sidebar-bg-image", menuCssValue);
      });
    };

    if (!document.getElementById("v158ComicBubbleMenuBgFix")) {
      const style = document.createElement("style");
      style.id = "v158ComicBubbleMenuBgFix";
      style.textContent = `
        :root { --menu-bg-image: ${menuCssValue}; --sidebar-bg-image: ${menuCssValue}; }
        .sidebar, #mobileMenu.sidebar {
          background-image: linear-gradient(180deg, rgba(5,30,25,.22), rgba(5,44,36,.10)), var(--menu-bg-image) !important;
          background-size: cover !important;
          background-position: center !important;
          background-repeat: no-repeat !important;
          color: #fff !important;
        }
        .map-pane, #map, #map.leaflet-container, .leaflet-container { background: #cfded8 !important; }
        .leaflet-tile-pane, .leaflet-layer, .leaflet-tile-container, .leaflet-tile { background: transparent !important; }
        /* v158: comic bubble size override */
        #turiNyanPet .pet-bubble {
          width: min(304px, calc(100vw - 18px)) !important;
          padding: 78px 68px 88px 62px !important;
          font-size: .60rem !important;
          line-height: 1.10 !important;
        }
        #turiNyanPet .pet-bubble strong { font-size: .62rem !important; line-height: 1.04 !important; margin-bottom: 2px !important; }
        #turiNyanPet #turiNyanMessage { font-size: .52rem !important; line-height: 1.08 !important; max-height: 2.5em !important; overflow: hidden !important; }
        #turiNyanPet .pet-actions { gap: 3px !important; margin-top: 4px !important; }
        #turiNyanPet .pet-actions button { min-height: 21px !important; padding: 3px 5px !important; font-size: .50rem !important; }
        @media (max-width: 920px) {
          #turiNyanPet {
            right: calc(6px + env(safe-area-inset-right)) !important;
            bottom: calc(76px + env(safe-area-inset-bottom)) !important;
            max-width: calc(100vw - 12px) !important;
          }
          #turiNyanPet .pet-button { width: 118px !important; height: 118px !important; }
          #turiNyanPet .pet-button img { transform: scale(1.12) !important; transform-origin: center bottom !important; }
          #turiNyanPet.is-lookout .pet-button img { transform: scale(1.16) !important; }
          #turiNyanPet .pet-bubble { width: min(284px, calc(100vw - 14px)) !important; padding: 72px 64px 82px 56px !important; }
          body.menu-open #turiNyanPet,
          body.panel-open #turiNyanPet,
          body.position-adjusting #turiNyanPet,
          body.map-popup-open #turiNyanPet,
          body.record-popup-open #turiNyanPet,
          body.spot-card-open #turiNyanPet { display: none !important; }
          #turiNyanPet .pet-bubble strong { font-size: .56rem !important; }
          #turiNyanPet #turiNyanMessage { font-size: .48rem !important; line-height: 1.08 !important; max-height: 2.25em !important; }
          #turiNyanPet .pet-actions button { min-height: 19px !important; padding: 2px 4px !important; font-size: .46rem !important; }
        }
      `;
      document.head.appendChild(style);
    }

    const patchNodeText = (root = document.body) => {
      if (!root) return;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
      let node = walker.currentNode;
      while (node) {
        if (node.nodeType === Node.TEXT_NODE) {
          const next = patchVisibleText(node.nodeValue);
          if (next !== node.nodeValue) node.nodeValue = next;
        } else if (node.nodeType === Node.ELEMENT_NODE && node.attributes) {
          for (const attr of Array.from(node.attributes)) {
            const next = patchVisibleText(attr.value);
            if (next !== attr.value) node.setAttribute(attr.name, next);
          }
        }
        node = walker.nextNode();
      }
    };

    const refreshMapLayout = () => {
      try { window.dispatchEvent(new Event("resize")); } catch (error) {}
    };
    const run = () => {
      applyMenuBackground();
      patchNodeText(document.body);
      [80, 250, 600, 1200].forEach((ms) => window.setTimeout(refreshMapLayout, ms));
    };

    run();
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run, { once: true });
    window.addEventListener("load", run);
    try {
      const observer = new MutationObserver(() => window.requestAnimationFrame?.(run) || window.setTimeout(run, 30));
      if (document.body) observer.observe(document.body, { childList: true, subtree: true, characterData: true });
      else document.addEventListener("DOMContentLoaded", () => observer.observe(document.body, { childList: true, subtree: true, characterData: true }), { once: true });
    } catch (error) {}
  }

  installImmediateFixes();

  function showLoadError(error) {
    console.error("Mie Fishing Map v158 bubble size menu background loader failed", error);
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
        const response = await fetch(`${url}?v=${PATCH_VERSION}`, { cache: "reload" });
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
      .replace('// v131: 中勢グリーンパーク池も除いた初期収録。', '// v158: 吹き出しサイズとメニュー背景を修正。')
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
  // v158: 釣りニャンの「釣果記録」ボタンから、アプリ本体の釣果記録画面をすぐ開くための橋渡し。
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

    const defaultBackgroundFunctionV156 = `  function applySidebarBackground(value) {
    const source = String(value || "").trim();
    const defaultBackground = "${MENU_BACKGROUND_URL}";
    const background = source || defaultBackground;
    const cssValue = "url(\"" + background + "\")";
    try {
      document.documentElement.style.setProperty("--menu-bg-image", cssValue);
      document.documentElement.style.setProperty("--sidebar-bg-image", cssValue);
    } catch (error) {}
    document.querySelectorAll(".sidebar, #mobileMenu.sidebar").forEach((sidebar) => {
      sidebar.style.setProperty("--menu-bg-image", cssValue);
      sidebar.style.setProperty("--sidebar-bg-image", cssValue);
    });
  }`;
    patched = patched.replace(/  function applySidebarBackground\(value\) \{[\s\S]*?\n  \}\n\n  async function handleBackgroundFile/, `${defaultBackgroundFunctionV156}\n\n  async function handleBackgroundFile`);

    patched = patched.replace(
      '    applySidebarBackground(localStorage.getItem(BACKGROUND_STORAGE_KEY) || "");',
      `    // v158: メニュー背景だけを指定画像に戻す。地図側には適用しない。
    try {
      const menuBackgroundForceKey = "${MENU_BACKGROUND_FORCE_KEY}";
      if (localStorage.getItem(menuBackgroundForceKey) !== "1") {
        localStorage.removeItem(BACKGROUND_STORAGE_KEY);
        localStorage.setItem(menuBackgroundForceKey, "1");
      }
    } catch (error) {}
    applySidebarBackground(localStorage.getItem(BACKGROUND_STORAGE_KEY) || "");`
    );

    patched = patched.replace(
      '    window.addEventListener("resize", () => invalidateMapSize(120));',
      '    window.addEventListener("resize", () => invalidateMapSize(120));\n    [80, 250, 600, 1200].forEach((ms) => invalidateMapSize(ms));'
    );

    return patched;
  }

  fetchSourceApp()
    .then((source) => {
      const patchedSource = patchSource(source);
      const runPatchedApp = new Function(patchedSource);
      runPatchedApp();
      installImmediateFixes();
    })
    .catch(showLoadError);
})();
