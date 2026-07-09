(() => {
  "use strict";

  const PATCH_VERSION = "v156-menu-bg-map-fix";
  const PATCH_STATUS_LABEL = "v156・メニュー背景と地図反映修正版";
  const MENU_BACKGROUND_URL = `assets/menu-bg-bakucho-twin-nyanko-v156.jpg?v=${PATCH_VERSION}`;
  const SOURCE_APP_URL = "https://rawcdn.githack.com/cichlid528/mie-fishing-map/486490f1fda171ba9dfdf8ac9a431d4b3b09c530/app.js";
  const BACKGROUND_STORAGE_KEY = "mie-fishing-map-sidebar-background-v1";
  const MENU_BACKGROUND_FORCE_KEY = "mie-fishing-map-v156-menu-bg-installed";
  const CUSTOM_SPOT_STORAGE_KEY = "mie-bass-custom-spots-v1";
  const POINTS_CLEARED_STORAGE_KEY = "mie-fishing-map-v129-curated-spots-installed";

  const VERSION_LABELS = [
    "v131・中勢グリーンパーク削除版",
    "v133・宮川ダム・七色ダム・池原ダム追加版",
    "v134・宮川ダム・七色ダム・池原ダム反映版",
    "v135・釣りニャン追加版",
    "v136・釣りニャン後ろ姿モーション追加版",
    "v137・釣りニャン表情モーション採用版",
    "v138・釣りニャン丸アイコン撤去・漫画吹き出し版",
    "v139・釣りニャン口元透過修正版",
    "v140・釣りニャン指差し吹き出し版",
    "v141・釣りニャン吹き出し文字調整版",
    "v142・釣りニャン吹き出し右下しっぽ版",
    "v143・釣りニャン吹き出し文字内側調整版",
    "v144・釣りニャン吹き出し文字右寄せ調整版",
    "v145・釣りニャン吹き出し文字下げ調整版",
    "v146・釣りニャン反応モード追加版",
    "v147・釣りニャン釣果記録ボタン連動版",
    "v148・釣りニャン釣果記録高速化版",
    "v149・釣りニャン高速化・軽量化版",
    "v150・釣りニャン軽量ふわふわ復活版",
    "v151・釣りニャンスマホ表示少し大きめ版",
    "v152・釣りニャンスマホ表示さらに大きめ版",
    "v153・釣りニャンスマホ表示ほぼ倍サイズ版",
    "v154・釣りニャン初期背景採用版",
    "v155・釣りニャン初期背景強制反映版"
  ];

  function patchVisibleText(value) {
    let text = String(value || "");
    VERSION_LABELS.forEach((label) => { text = text.replaceAll(label, PATCH_STATUS_LABEL); });
    return text
      .replaceAll("v131-remove-chusei-green-park", PATCH_VERSION)
      .replaceAll("v155-default-background-force", PATCH_VERSION)
      .replaceAll("大杉湖", "宮川ダム")
      .replaceAll("七色貯水池", "七色ダム")
      .replaceAll("爆調ニャンコ視聴", "爆釣ツインニャンコ")
      .replaceAll("爆調ツインニャンコ", "爆釣ツインニャンコ")
      .replaceAll("爆釣ニャンコ師匠", "爆釣にゃん師匠");
  }

  function installStyle() {
    const cssValue = `url("${MENU_BACKGROUND_URL}")`;
    document.documentElement.style.setProperty("--menu-bg-image", cssValue);
    document.documentElement.style.setProperty("--sidebar-bg-image", cssValue);
    document.querySelectorAll(".sidebar, #mobileMenu.sidebar").forEach((sidebar) => {
      sidebar.style.setProperty("--menu-bg-image", cssValue);
      sidebar.style.setProperty("--sidebar-bg-image", cssValue);
    });
    if (document.getElementById("v156MenuBgMapFix")) return;
    const style = document.createElement("style");
    style.id = "v156MenuBgMapFix";
    style.textContent = `
      :root { --menu-bg-image: ${cssValue}; --sidebar-bg-image: ${cssValue}; }
      .sidebar, #mobileMenu.sidebar {
        background-image: linear-gradient(180deg, rgba(5,30,25,.22), rgba(5,44,36,.10)), var(--sidebar-bg-image) !important;
        background-size: cover !important;
        background-position: center !important;
        background-repeat: no-repeat !important;
        color: #fff !important;
      }
      .map-pane, #map, #map.leaflet-container, .leaflet-container { background: #cfded8 !important; background-image: none !important; }
      .leaflet-tile-pane, .leaflet-layer, .leaflet-tile-container, .leaflet-tile { background: transparent !important; background-image: none !important; }
      @media (max-width: 920px) {
        #turiNyanPet { right: calc(6px + env(safe-area-inset-right)) !important; bottom: calc(76px + env(safe-area-inset-bottom)) !important; max-width: calc(100vw - 12px) !important; }
        #turiNyanPet .pet-button { width: 118px !important; height: 118px !important; }
        #turiNyanPet .pet-button img { transform: scale(1.12) !important; transform-origin: center bottom !important; }
        #turiNyanPet.is-lookout .pet-button img { transform: scale(1.16) !important; }
        #turiNyanPet .pet-bubble { width: min(318px, calc(100vw - 14px)) !important; padding: 88px 50px 98px 88px !important; }
        body.menu-open #turiNyanPet, body.panel-open #turiNyanPet, body.position-adjusting #turiNyanPet, body.map-popup-open #turiNyanPet, body.record-popup-open #turiNyanPet, body.spot-card-open #turiNyanPet { display: none !important; }
      }
    `;
    document.head.appendChild(style);
  }

  function patchDom(root = document.body) {
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
  }

  function prepareStorage() {
    try {
      if (!localStorage.getItem(POINTS_CLEARED_STORAGE_KEY)) {
        localStorage.setItem(POINTS_CLEARED_STORAGE_KEY, JSON.stringify({ clearedAt: new Date().toISOString(), version: PATCH_VERSION }));
      }
      if (localStorage.getItem(MENU_BACKGROUND_FORCE_KEY) !== "1") {
        localStorage.removeItem(BACKGROUND_STORAGE_KEY);
        localStorage.setItem(MENU_BACKGROUND_FORCE_KEY, "1");
      }
      const spots = JSON.parse(localStorage.getItem(CUSTOM_SPOT_STORAGE_KEY) || "[]");
      if (Array.isArray(spots) && !spots.some((spot) => spot && spot.id === "dam-ikehara")) {
        spots.push({
          id: "dam-ikehara",
          name: "池原ダム",
          type: "ダム",
          area: "奈良県吉野郡下北山村",
          lat: 34.04694,
          lng: 135.97111,
          zoom: 14,
          source: "v156追加",
          subtype: "レイク・ダム湖",
          custom: true,
          memo: "v156で追加したダム湖ポイントです。釣行前に現地看板・管理者・漁協情報を確認してください。"
        });
        localStorage.setItem(CUSTOM_SPOT_STORAGE_KEY, JSON.stringify(spots));
      }
    } catch (error) {}
  }

  function refreshMapLayout() {
    try { window.dispatchEvent(new Event("resize")); } catch (error) {}
  }

  function showLoadError(error) {
    console.error("Mie Fishing Map v156 script load failed", error);
    const message = "アプリ本体の読み込みに失敗しました。通信状況を確認して、reset-cache.html?auto=1 を開き直してください。";
    const target = document.querySelector("#dataStatus") || document.body;
    if (target === document.body) {
      const notice = document.createElement("div");
      notice.textContent = message;
      notice.style.cssText = "position:fixed;left:12px;right:12px;bottom:12px;z-index:2147483647;padding:12px 14px;border-radius:14px;background:#fff3cd;color:#4d3b00;font-weight:800;box-shadow:0 12px 30px rgba(0,0,0,.25);line-height:1.5;";
      document.body.appendChild(notice);
    } else if (target) {
      target.textContent = message;
    }
  }

  function startPatches() {
    installStyle();
    patchDom(document.body);
    [80, 250, 600, 1200, 2200].forEach((ms) => window.setTimeout(() => {
      installStyle();
      patchDom(document.body);
      refreshMapLayout();
    }, ms));
    try {
      const observer = new MutationObserver(() => window.requestAnimationFrame(() => {
        installStyle();
        patchDom(document.body);
      }));
      if (document.body) observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true });
    } catch (error) {}
  }

  function loadBaseApp() {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `${SOURCE_APP_URL}?v=${PATCH_VERSION}`;
      script.async = false;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Failed to load ${script.src}`));
      document.head.appendChild(script);
    });
  }

  prepareStorage();
  startPatches();
  loadBaseApp()
    .then(() => startPatches())
    .catch(showLoadError);
})();
