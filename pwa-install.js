(() => {
  "use strict";
  window.__MIE_PWA_INSTALL_MANAGED__ = true;

  const APP_VERSION = "v116-gsi-pond-candidates";
  const CUSTOM_SPOT_STORAGE_KEY = "mie-bass-custom-spots-v1";
  const GSI_POND_SCAN_DONE_KEY = "mie-gsi-pond-candidates-v116-scanned";
  const GSI_POND_VECTOR_URL = "https://cyberjapandata.gsi.go.jp/xyz/experimental_bvmap/{z}/{x}/{y}.pbf";
  const GSI_POND_LABEL_CATEGORIES = new Set([321, 820]);
  const GSI_MIE_BOUNDS = { south: 33.62, west: 135.72, north: 35.35, east: 137.15 };
  const installButton = document.querySelector("#installAppButton");
  const installPanel = document.querySelector("#installPanel");
  const installStatus = document.querySelector("#installStatus");
  const closeInstallPanelButton = document.querySelector("#closeInstallPanel");
  const closeInstallDoneButton = document.querySelector("#closeInstallDone");
  let deferredInstallPrompt = null;
  let decoderPromise = null;
  let existingSpotPromise = null;
  let scanningGsiPonds = false;

  function installLeafletMapCapture() {
    const patchLeaflet = (leaflet) => {
      if (!leaflet || leaflet.__mieMapCapturePatched || typeof leaflet.map !== "function") return;
      const originalMap = leaflet.map;
      leaflet.map = function patchedLeafletMap(...args) {
        const instance = originalMap.apply(this, args);
        window.__MIE_LEAFLET_MAP__ = instance;
        return instance;
      };
      leaflet.__mieMapCapturePatched = true;
    };

    if (window.L) {
      patchLeaflet(window.L);
      return;
    }

    let leafletValue;
    try {
      Object.defineProperty(window, "L", {
        configurable: true,
        get() { return leafletValue; },
        set(value) {
          leafletValue = value;
          patchLeaflet(value);
        }
      });
    } catch (error) {
      console.warn("Leaflet map capture setup failed", error);
    }
  }

  installLeafletMapCapture();

  function isStandalone() {
    return window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator.standalone === true;
  }

  function isIOS() {
    return /iphone|ipad|ipod/i.test(window.navigator.userAgent || "");
  }

  function setStatus(message) {
    if (installStatus) installStatus.textContent = message;
  }

  function setGsiStatus(message) {
    const dataStatus = document.querySelector("#dataStatus");
    if (dataStatus) dataStatus.textContent = message;
    else setStatus(message);
  }

  function openInstallPanel(message = "") {
    if (message) setStatus(message);
    installPanel?.classList.add("is-open");
    installPanel?.setAttribute("aria-hidden", "false");
  }

  function closeInstallPanel() {
    installPanel?.classList.remove("is-open");
    installPanel?.setAttribute("aria-hidden", "true");
  }

  async function clearOldAppCache() {
    try {
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => registration.unregister()));
      }
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.filter((key) => key.startsWith("bass-spot-log-")).map((key) => caches.delete(key)));
      }
      setStatus(`古いアプリキャッシュを削除しました。最新版 ${APP_VERSION} で表示します。`);
    } catch (error) {
      setStatus("古いキャッシュの削除に失敗しました。reset-cache.html を開いてください。");
    }
  }

  async function installApp() {
    if (isStandalone()) {
      openInstallPanel("すでにホーム画面のアイコンからアプリとして起動しています。古い表示なら一度閉じて、reset-cache.html?auto=1 を開いてください。");
      return;
    }
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const choice = await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      openInstallPanel(choice?.outcome === "accepted"
        ? "インストールを開始しました。ホーム画面のアイコンを確認してください。"
        : "インストールはキャンセルされました。必要なときにもう一度押してください。");
      return;
    }
    openInstallPanel(isIOS()
      ? "iPhoneはSafariで開いて、共有ボタンから『ホーム画面に追加』を選んでください。"
      : "Chrome右上の『︙』から『アプリをインストール』または『ホーム画面に追加』を選んでください。");
  }

  function safeParse(value, fallback) {
    try { return JSON.parse(value || "") || fallback; } catch { return fallback; }
  }

  function readCustomSpots() {
    return safeParse(localStorage.getItem(CUSTOM_SPOT_STORAGE_KEY), []).filter((spot) => spot && Number.isFinite(Number(spot.lat)) && Number.isFinite(Number(spot.lng)));
  }

  function writeCustomSpots(spots) {
    localStorage.setItem(CUSTOM_SPOT_STORAGE_KEY, JSON.stringify(spots));
  }

  function normalizeName(name) {
    return String(name || "").replace(/[\s\u3000]+/g, "").replace(/[（(].*?[）)]/g, "").trim();
  }

  function hashText(value) {
    let hash = 2166136261;
    for (const ch of String(value || "")) {
      hash ^= ch.codePointAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
  }

  function distanceMeters(aLat, aLng, bLat, bLng) {
    const toRad = (value) => Number(value) * Math.PI / 180;
    const radius = 6371000;
    const dLat = toRad(Number(bLat) - Number(aLat));
    const dLng = toRad(Number(bLng) - Number(aLng));
    const s1 = Math.sin(dLat / 2);
    const s2 = Math.sin(dLng / 2);
    const a = s1 * s1 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * s2 * s2;
    return 2 * radius * Math.asin(Math.min(1, Math.sqrt(a)));
  }

  async function loadExistingSpotPositions() {
    if (existingSpotPromise) return existingSpotPromise;
    existingSpotPromise = (async () => {
      try {
        const response = await fetch(`app.js?v=${APP_VERSION}`, { cache: "no-store" });
        const text = await response.text();
        const spots = [];
        const pattern = /\{[^{}]*name:\s*"([^"]+)"[^{}]*lat:\s*([0-9.\-]+)[^{}]*lng:\s*([0-9.\-]+)/g;
        let match;
        while ((match = pattern.exec(text))) {
          spots.push({ name: match[1], lat: Number(match[2]), lng: Number(match[3]) });
        }
        return spots.filter((spot) => Number.isFinite(spot.lat) && Number.isFinite(spot.lng));
      } catch (error) {
        console.warn("Existing spot parsing failed", error);
        return [];
      }
    })();
    return existingSpotPromise;
  }

  function isDuplicateSpot(candidate, existingSpots) {
    const name = normalizeName(candidate.name);
    return existingSpots.some((spot) => {
      if (!Number.isFinite(Number(spot.lat)) || !Number.isFinite(Number(spot.lng))) return false;
      const near = distanceMeters(candidate.lat, candidate.lng, Number(spot.lat), Number(spot.lng)) <= 350;
      if (!near) return false;
      const other = normalizeName(spot.name);
      return name && other && (name === other || name.includes(other) || other.includes(name));
    });
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[data-gsi-lib="${src}"]`);
      if (existing) {
        if (existing.dataset.loaded === "true") resolve();
        else {
          existing.addEventListener("load", resolve, { once: true });
          existing.addEventListener("error", reject, { once: true });
        }
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.dataset.gsiLib = src;
      script.addEventListener("load", () => { script.dataset.loaded = "true"; resolve(); }, { once: true });
      script.addEventListener("error", () => reject(new Error(`読み込み失敗: ${src}`)), { once: true });
      document.head.appendChild(script);
    });
  }

  async function ensureDecoder() {
    if (decoderPromise) return decoderPromise;
    decoderPromise = (async () => {
      if (typeof window.Pbf === "undefined") await loadScript("https://unpkg.com/pbf@3.3.0/dist/pbf.js");
      if (typeof window.VectorTile === "undefined") await loadScript("https://unpkg.com/@mapbox/vector-tile@1.3.1/dist/vector-tile.js");
      const globalValue = window.VectorTile || {};
      const VectorTileCtor = globalValue.VectorTile || globalValue.default || globalValue;
      if (typeof window.Pbf !== "function" || typeof VectorTileCtor !== "function") throw new Error("ベクトルタイル解析ライブラリを読み込めませんでした。");
      return { Pbf: window.Pbf, VectorTile: VectorTileCtor };
    })();
    return decoderPromise;
  }

  function tilePoint(lat, lng, zoom) {
    const latRad = Number(lat) * Math.PI / 180;
    const n = 2 ** zoom;
    return {
      x: Math.floor((Number(lng) + 180) / 360 * n),
      y: Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n)
    };
  }

  function tilesForBounds(bounds, zoom) {
    const nw = tilePoint(bounds.north, bounds.west, zoom);
    const se = tilePoint(bounds.south, bounds.east, zoom);
    const minX = Math.min(nw.x, se.x);
    const maxX = Math.max(nw.x, se.x);
    const minY = Math.min(nw.y, se.y);
    const maxY = Math.max(nw.y, se.y);
    const tiles = [];
    for (let x = minX; x <= maxX; x += 1) {
      for (let y = minY; y <= maxY; y += 1) tiles.push({ x, y, z: zoom });
    }
    return tiles;
  }

  function collectCoordinates(coords, out) {
    if (!Array.isArray(coords)) return;
    if (typeof coords[0] === "number" && typeof coords[1] === "number") {
      out.push(coords);
      return;
    }
    coords.forEach((item) => collectCoordinates(item, out));
  }

  function centerOfFeature(feature) {
    const coords = [];
    collectCoordinates(feature?.geometry?.coordinates, coords);
    if (!coords.length) return null;
    const total = coords.reduce((acc, coord) => ({ lng: acc.lng + Number(coord[0]), lat: acc.lat + Number(coord[1]) }), { lng: 0, lat: 0 });
    const lat = total.lat / coords.length;
    const lng = total.lng / coords.length;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng };
  }

  function featureToPondSpot(feature, x, y, z) {
    const props = feature?.properties || {};
    const annoCtg = Number(props.annoCtg ?? props.anno_ctg ?? props.annocategory);
    if (!GSI_POND_LABEL_CATEGORIES.has(annoCtg)) return null;
    const name = String(props.knj || props.name || props.kanji || "").trim();
    if (!name || !name.includes("池")) return null;
    const geojson = feature.toGeoJSON(x, y, z);
    const center = centerOfFeature(geojson);
    if (!center) return null;
    if (center.lat < GSI_MIE_BOUNDS.south || center.lat > GSI_MIE_BOUNDS.north || center.lng < GSI_MIE_BOUNDS.west || center.lng > GSI_MIE_BOUNDS.east) return null;
    return {
      id: `gsi-pond-${hashText(`${name}-${center.lat.toFixed(5)}-${center.lng.toFixed(5)}`)}`,
      name,
      type: "池",
      area: "地理院地図注記",
      lat: Number(center.lat.toFixed(6)),
      lng: Number(center.lng.toFixed(6)),
      zoom: 16,
      source: "国土地理院ベクトルタイル 湖沼注記",
      subtype: "池候補",
      candidate: true,
      custom: true,
      memo: "国土地理院ベクトルタイルの湖沼注記で、名称に『池』を含む水辺です。釣行前に立入禁止・私有地・管理者情報を必ず確認してください。",
      gsiVectorCandidate: true,
      gsiAnnoCtg: annoCtg
    };
  }

  async function scanTile(tile, decoder) {
    const url = GSI_POND_VECTOR_URL.replace("{z}", tile.z).replace("{x}", tile.x).replace("{y}", tile.y);
    const response = await fetch(url);
    if (!response.ok) return [];
    const buffer = await response.arrayBuffer();
    const vt = new decoder.VectorTile(new decoder.Pbf(buffer));
    const label = vt.layers?.label;
    if (!label) return [];
    const spots = [];
    for (let i = 0; i < label.length; i += 1) {
      const spot = featureToPondSpot(label.feature(i), tile.x, tile.y, tile.z);
      if (spot) spots.push(spot);
    }
    return spots;
  }

  async function scanGsiPondCandidates(bounds, zoom, options = {}) {
    if (scanningGsiPonds) return 0;
    scanningGsiPonds = true;
    try {
      const tiles = tilesForBounds(bounds, zoom);
      const maxTiles = options.maxTiles || 160;
      if (tiles.length > maxTiles) {
        setGsiStatus(`地図をもう少し拡大してください。対象タイルが多すぎます（${tiles.length}枚）。`);
        return 0;
      }
      setGsiStatus(`地理院の池候補を取得中… ${tiles.length}タイル`);
      const decoder = await ensureDecoder();
      const existing = [...await loadExistingSpotPositions(), ...readCustomSpots()];
      const found = [];
      const batchSize = 8;
      for (let i = 0; i < tiles.length; i += batchSize) {
        const batch = tiles.slice(i, i + batchSize);
        const results = await Promise.all(batch.map((tile) => scanTile(tile, decoder).catch((error) => {
          console.warn("GSI pond tile failed", tile, error);
          return [];
        })));
        found.push(...results.flat());
      }

      const custom = readCustomSpots();
      const allExisting = [...existing, ...custom];
      const seen = new Set();
      const additions = [];
      found.forEach((spot) => {
        const key = `${normalizeName(spot.name)}:${spot.lat.toFixed(5)}:${spot.lng.toFixed(5)}`;
        if (seen.has(key)) return;
        seen.add(key);
        if (isDuplicateSpot(spot, [...allExisting, ...additions])) return;
        additions.push(spot);
      });

      if (!additions.length) {
        if (options.manual) setGsiStatus("新しい地理院池候補は見つかりませんでした。");
        return 0;
      }

      writeCustomSpots([...custom, ...additions]);
      setGsiStatus(`地理院注記から池候補を${additions.length}件追加しました。再読み込みします。`);
      if (options.reload !== false) window.setTimeout(() => location.reload(), 900);
      return additions.length;
    } catch (error) {
      console.error("GSI pond candidate scan failed", error);
      setGsiStatus(`地理院池候補を取得できませんでした: ${error.message || error}`);
      return 0;
    } finally {
      scanningGsiPonds = false;
    }
  }

  function currentMapBoundsForScan() {
    const map = window.__MIE_LEAFLET_MAP__;
    if (!map?.getBounds) return null;
    const b = map.getBounds().pad(0.2);
    const bounds = {
      south: Math.max(b.getSouth(), GSI_MIE_BOUNDS.south),
      west: Math.max(b.getWest(), GSI_MIE_BOUNDS.west),
      north: Math.min(b.getNorth(), GSI_MIE_BOUNDS.north),
      east: Math.min(b.getEast(), GSI_MIE_BOUNDS.east)
    };
    if (bounds.south >= bounds.north || bounds.west >= bounds.east) return null;
    return bounds;
  }

  function installGsiPondButton() {
    const tools = document.querySelector(".map-tools");
    if (!tools || document.querySelector("#scanGsiPondCandidates")) return;
    const button = document.createElement("button");
    button.id = "scanGsiPondCandidates";
    button.type = "button";
    button.className = "spot-mode-button";
    button.textContent = "地理院池候補取得";
    button.title = "表示範囲の国土地理院注記から、名前に『池』を含む水辺を池候補へ追加します。";
    button.addEventListener("click", () => {
      const map = window.__MIE_LEAFLET_MAP__;
      const bounds = currentMapBoundsForScan();
      if (!map || !bounds) {
        setGsiStatus("地図の準備ができてから、三重県内を表示して押してください。");
        return;
      }
      const zoom = Math.max(12, Math.min(16, Math.round(map.getZoom() || 12)));
      scanGsiPondCandidates(bounds, zoom, { manual: true, reload: true, maxTiles: 180 });
    });
    tools.appendChild(button);
  }

  function scheduleInitialGsiPondScan() {
    if (localStorage.getItem(GSI_POND_SCAN_DONE_KEY)) return;
    window.setTimeout(async () => {
      const added = await scanGsiPondCandidates(GSI_MIE_BOUNDS, 12, { reload: true, maxTiles: 520 });
      localStorage.setItem(GSI_POND_SCAN_DONE_KEY, JSON.stringify({ scannedAt: new Date().toISOString(), added }));
    }, 2200);
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    setStatus("Android / Chromeでは、このボタンからインストールできます。");
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    openInstallPanel("インストールが完了しました。ホーム画面のアイコンから起動できます。");
  });

  installButton?.addEventListener("click", installApp);
  closeInstallPanelButton?.addEventListener("click", closeInstallPanel);
  closeInstallDoneButton?.addEventListener("click", closeInstallPanel);
  window.addEventListener("load", () => {
    clearOldAppCache();
    installGsiPondButton();
    scheduleInitialGsiPondScan();
  });
})();
