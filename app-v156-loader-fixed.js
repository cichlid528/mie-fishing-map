(() => {
  "use strict";

  const APP_VERSION = "v168-record-button-fix";
  const APP_STATUS_LABEL = "v168・記録ボタン動作修正版";
  const STORAGE_KEY = "mie-bass-map-v1";
  const CATCH_STORAGE_KEY = "mie-bass-catches-v1";
  const CUSTOM_SPOT_STORAGE_KEY = "mie-bass-custom-spots-v1";
  const BACKGROUND_STORAGE_KEY = "mie-fishing-map-sidebar-background-v1";
  const POSITION_STORAGE_KEY = "mie-fishing-map-position-overrides-v86";
  const BACKUP_META_STORAGE_KEY = "mie-fishing-map-backup-meta-v1";
  const MIE_CENTER = [34.55, 136.48];
  const MIE_HOME_ZOOM = 9;
  const MENU_BACKGROUND_URL = `assets/menu-bg-bakucho-nyanko-sensei-v168.png?v=${APP_VERSION}`;

  const seedSpots = [
    { id: "lake-shorenji", name: "青蓮寺湖", type: "ダム", area: "名張市", lat: 34.600869, lng: 136.11885, zoom: 15, source: "指定リスト", subtype: "レイク・ダム湖" },
    { id: "lake-hinachi", name: "ひなち湖", type: "ダム", area: "名張市", lat: 34.614467, lng: 136.164028, zoom: 15, source: "指定リスト", subtype: "レイク・ダム湖" },
    { id: "reservoir-isaka", name: "伊坂貯水池", type: "ダム", area: "四日市市", lat: 35.041625, lng: 136.616311, zoom: 15, source: "指定リスト", subtype: "レイク・ダム湖" },
    { id: "lake-shakujo", name: "錫杖湖", type: "ダム", area: "津市芸濃町", lat: 34.806622, lng: 136.378553, zoom: 15, source: "指定リスト", subtype: "レイク・ダム湖" },
    { id: "dam-kimigano", name: "君ヶ野ダム", type: "ダム", area: "津市美杉町", lat: 34.5971, lng: 136.313183, zoom: 15, source: "指定リスト", subtype: "レイク・ダム湖" },
    { id: "lake-okukahada", name: "奥香肌湖", type: "ダム", area: "松阪市飯高町", lat: 34.376861, lng: 136.196586, zoom: 14, source: "指定リスト", subtype: "レイク・ダム湖" },
    { id: "lake-okuise", name: "奥伊勢湖", type: "ダム", area: "多気郡大台町", lat: 34.3892, lng: 136.4011, zoom: 15, source: "指定リスト", subtype: "レイク・ダム湖" },
    { id: "lake-osugi", name: "宮川ダム", type: "ダム", area: "多気郡大台町", lat: 34.286385, lng: 136.19336, zoom: 14, source: "指定リスト", subtype: "レイク・ダム湖" },
    { id: "reservoir-nanairo", name: "七色ダム", type: "ダム", area: "熊野市・紀和町周辺", lat: 33.991304, lng: 136.004799, zoom: 14, source: "指定リスト", subtype: "レイク・ダム湖" },
    { id: "dam-ikehara", name: "池原ダム", type: "ダム", area: "奈良県吉野郡下北山村", lat: 34.04694, lng: 135.97111, zoom: 14, source: "指定リスト", subtype: "レイク・ダム湖" },
    { id: "pond-gokatsura", name: "五桂池", type: "池", area: "多気町五桂", lat: 34.466625, lng: 136.545533, zoom: 15, source: "指定リスト", candidate: true },
    { id: "pond-ishigaki", name: "石垣池", type: "池", area: "鈴鹿市西玉垣町", lat: 34.856058, lng: 136.564767, zoom: 15, source: "指定リスト", candidate: true },
    { id: "pond-madoro", name: "真泥池", type: "池", area: "伊賀市真泥", lat: 34.761728, lng: 136.193772, zoom: 16, source: "指定リスト", candidate: true },
    { id: "pond-taisho", name: "大正池", type: "池", area: "伊賀市丸柱", lat: 34.856969, lng: 136.135019, zoom: 16, source: "指定リスト", candidate: true },
    { id: "pond-nameri", name: "なめり湖", type: "池", area: "松阪市嬉野森本町", lat: 34.585853, lng: 136.429147, zoom: 16, source: "指定リスト", candidate: true },
    { id: "pond-tsuga", name: "津賀池", type: "池", area: "鈴鹿市津賀町", lat: 34.897558, lng: 136.508433, zoom: 16, source: "指定リスト", candidate: true },
    { id: "river-miyagawa", name: "宮川", type: "川", area: "伊勢市・大台町", lat: 34.514956, lng: 136.702382, zoom: 11, source: "指定リスト" },
    { id: "river-kumozu", name: "雲出川", type: "川", area: "津市・松阪市", lat: 34.647855, lng: 136.523611, zoom: 12, source: "指定リスト" },
    { id: "river-kushida", name: "櫛田川", type: "川", area: "松阪市・多気町", lat: 34.533946, lng: 136.579491, zoom: 12, source: "指定リスト" },
    { id: "river-suzuka", name: "鈴鹿川", type: "川", area: "鈴鹿市・亀山市", lat: 34.894369, lng: 136.561703, zoom: 12, source: "指定リスト" },
    { id: "river-ano", name: "安濃川", type: "川", area: "津市・芸濃町周辺", lat: 34.727056, lng: 136.515436, zoom: 13, source: "指定リスト" },
    { id: "river-machiya", name: "町屋川", type: "川", area: "四日市市・桑名市", lat: 35.0128, lng: 136.661, zoom: 12, source: "指定リスト" },
    { id: "river-ibi-nagara-estuary", name: "揖斐川・長良川河口", type: "川", area: "桑名市長島町周辺", lat: 35.0707, lng: 136.6917, zoom: 14, source: "指定リスト", subtype: "河口" },
    { id: "river-inabe", name: "員弁川", type: "川", area: "いなべ市・桑名市周辺", lat: 35.0701, lng: 136.6338, zoom: 12, source: "指定リスト" },
    { id: "river-choshi", name: "銚子川", type: "川", area: "紀北町", lat: 34.1165, lng: 136.2265, zoom: 13, source: "指定リスト" },
    { id: "port-yokkaichi", name: "四日市港", type: "港", area: "四日市市", lat: 34.9577, lng: 136.6421, zoom: 15, source: "指定リスト" },
    { id: "port-kasumigaura-wharf", name: "霞ヶ浦ふ頭", type: "港", area: "四日市市霞", lat: 34.9727, lng: 136.6483, zoom: 16, source: "指定リスト" },
    { id: "port-tsu", name: "津港", type: "港", area: "津市なぎさまち周辺", lat: 34.7276, lng: 136.5311, zoom: 16, source: "指定リスト" },
    { id: "port-matsusaka", name: "松阪港", type: "港", area: "松阪市大口町周辺", lat: 34.5987, lng: 136.5829, zoom: 16, source: "指定リスト" },
    { id: "port-toba", name: "鳥羽港", type: "港", area: "鳥羽市鳥羽", lat: 34.4868, lng: 136.8462, zoom: 16, source: "指定リスト" },
    { id: "port-owase", name: "尾鷲港", type: "港", area: "尾鷲市", lat: 34.0713, lng: 136.2025, zoom: 16, source: "指定リスト" },
    { id: "port-kuwana", name: "桑名港", type: "港", area: "桑名市", lat: 35.0639, lng: 136.7005, zoom: 16, source: "指定リスト" },
    { id: "port-tomisu-hara", name: "富洲原港", type: "港", area: "四日市市富洲原", lat: 35.0108, lng: 136.6639, zoom: 16, source: "指定リスト" },
    { id: "port-shiroko", name: "白子漁港", type: "港", area: "鈴鹿市白子", lat: 34.8288, lng: 136.6048, zoom: 17, source: "指定リスト" },
    { id: "port-isodu", name: "磯津漁港", type: "港", area: "四日市市磯津", lat: 34.9033, lng: 136.6402, zoom: 16, source: "指定リスト" },
    { id: "port-kusu", name: "楠漁港", type: "港", area: "四日市市楠町", lat: 34.8969, lng: 136.6322, zoom: 16, source: "指定リスト" },
    { id: "port-karasu", name: "香良洲漁港", type: "港", area: "津市香良洲町", lat: 34.6665, lng: 136.5386, zoom: 16, source: "指定リスト" },
    { id: "port-anori", name: "安乗漁港", type: "港", area: "志摩市阿児町安乗", lat: 34.3606, lng: 136.9019, zoom: 17, source: "指定リスト" },
    { id: "port-nakiri", name: "波切漁港", type: "港", area: "志摩市大王町波切", lat: 34.2761, lng: 136.899, zoom: 16, source: "指定リスト" },
    { id: "port-goza", name: "御座漁港", type: "港", area: "志摩市志摩町御座", lat: 34.2752, lng: 136.7633, zoom: 17, source: "指定リスト" },
    { id: "port-hamajima", name: "浜島港", type: "港", area: "志摩市浜島町", lat: 34.2975, lng: 136.758, zoom: 16, source: "指定リスト" },
    { id: "port-gokasho", name: "五ヶ所浦漁港", type: "港", area: "南伊勢町五ヶ所浦", lat: 34.351, lng: 136.7013, zoom: 16, source: "指定リスト" },
    { id: "port-nishiki", name: "錦漁港", type: "港", area: "大紀町錦", lat: 34.2116, lng: 136.3969, zoom: 16, source: "指定リスト" },
    { id: "port-kiinagashima", name: "紀伊長島港", type: "港", area: "紀北町長島", lat: 34.208, lng: 136.3372, zoom: 16, source: "指定リスト" },
    { id: "port-hikimoto", name: "引本港", type: "港", area: "紀北町引本浦", lat: 34.1306, lng: 136.2361, zoom: 16, source: "指定リスト" },
    { id: "port-kuki", name: "九鬼漁港", type: "港", area: "尾鷲市九鬼町", lat: 33.9965, lng: 136.2517, zoom: 16, source: "指定リスト" },
    { id: "port-kata", name: "賀田港", type: "港", area: "尾鷲市賀田町", lat: 33.9724, lng: 136.2214, zoom: 16, source: "指定リスト" },
    { id: "port-atashika", name: "新鹿港", type: "港", area: "熊野市新鹿町", lat: 33.9309, lng: 136.1404, zoom: 16, source: "指定リスト" },
    { id: "port-kinomoto", name: "木本港", type: "港", area: "熊野市木本町", lat: 33.8898, lng: 136.1016, zoom: 16, source: "指定リスト" },
    { id: "port-udono", name: "鵜殿港", type: "港", area: "紀宝町鵜殿", lat: 33.7338, lng: 136.012, zoom: 16, source: "指定リスト" },
    { id: "marina-tsu-yacht", name: "津ヨットハーバー", type: "マリーナ", area: "津市津興", lat: 34.708344, lng: 136.524048, zoom: 17, source: "指定リスト" },
    { id: "marina-toba", name: "鳥羽マリーナ", type: "マリーナ", area: "鳥羽市千賀町", lat: 34.388732, lng: 136.880716, zoom: 17, source: "指定リスト" },
    { id: "marina-nemu-resort", name: "NEMU RESORT マリーナ周辺", type: "マリーナ", area: "志摩市浜島町迫子", lat: 34.3116, lng: 136.7948, zoom: 17, source: "指定リスト" },
    { id: "marina-shima-yacht", name: "志摩ヨットハーバー周辺", type: "マリーナ", area: "志摩市周辺", lat: 34.3063, lng: 136.7655, zoom: 17, source: "指定リスト" },
    { id: "marina-isewan", name: "伊勢湾マリーナ周辺", type: "マリーナ", area: "三重県北中部沿岸", lat: 34.7979, lng: 136.5632, zoom: 17, source: "指定リスト" }
  ];

  const $ = (id) => document.getElementById(id);
  const safeParse = (value, fallback) => {
    try { const parsed = JSON.parse(value || ""); return parsed ?? fallback; } catch { return fallback; }
  };
  const validPosition = (spot) => spot && Number.isFinite(Number(spot.lat)) && Number.isFinite(Number(spot.lng));
  const escapeHtml = (value) => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");

  const state = {
    spots: [],
    savedState: {},
    catches: [],
    customSpots: [],
    positionOverrides: {},
    search: "",
    activeFilter: "all",
    activeList: "spots",
    selectedSpotId: "",
    catchMode: false
  };

  let map = null;
  let markers = new Map();
  let catchMarkers = new Map();

  function firstFiniteNumber(...values) {
    for (const value of values) {
      const number = Number(value);
      if (Number.isFinite(number)) return number;
    }
    return NaN;
  }

  function recordIdentity(record) {
    return [record.id, record.createdAt, record.updatedAt, record.time, record.lat, record.lng, record.species, record.memo]
      .map((value) => String(value ?? "").trim())
      .join("|");
  }

  function normalizeRecord(raw = {}) {
    const position = raw.position || raw.location || raw.coords || raw.latlng || raw.coordinate || {};
    const lat = firstFiniteNumber(raw.lat, raw.latitude, raw.y, position.lat, position.latitude, position.y);
    const lng = firstFiniteNumber(raw.lng, raw.lon, raw.long, raw.longitude, raw.x, position.lng, position.lon, position.long, position.longitude, position.x);
    return {
      ...raw,
      id: raw.id || raw.recordId || raw.uuid || `record-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      recordType: raw.recordType || raw.type || (raw.species || raw.size || raw.sizeCm || raw.bait || raw.lureName ? "catch" : "note"),
      placeKind: raw.placeKind || raw.kind || "",
      placeName: raw.placeName || raw.title || raw.name || "",
      spotId: raw.spotId || raw.spot || "",
      lat,
      lng,
      species: raw.species || raw.fish || raw.fishSpecies || raw.speciesList || "",
      bait: raw.bait || raw.lureCategory || raw.lure || "",
      lureName: raw.lureName || "",
      lureColor: raw.lureColor || raw.color || "",
      lureWeight: raw.lureWeight || raw.weight || "",
      size: raw.size || raw.sizeClass || "",
      sizeCm: raw.sizeCm || raw.actualSizeCm || raw.lengthCm || "",
      memo: raw.memo || raw.note || "",
      photo: raw.photo || raw.photoData || raw.image || "",
      time: raw.time || raw.datetime || raw.createdAt || "",
      createdAt: raw.createdAt || raw.time || raw.datetime || new Date().toISOString(),
      updatedAt: raw.updatedAt || raw.createdAt || raw.time || raw.datetime || new Date().toISOString()
    };
  }

  function collectRecordCandidatesFromValue(value, source = "") {
    const records = [];
    const pushArray = (array) => {
      array.forEach((item) => {
        if (item && typeof item === "object") records.push({ ...item, __recoveredFrom: source });
      });
    };
    if (Array.isArray(value)) pushArray(value);
    if (value && typeof value === "object") {
      ["records", "catches", "catchRecords", "catchList", "items", "data"].forEach((key) => {
        if (Array.isArray(value[key])) pushArray(value[key]);
      });
      if (value.backup && typeof value.backup === "object") {
        ["records", "catches", "catchRecords"].forEach((key) => {
          if (Array.isArray(value.backup[key])) pushArray(value.backup[key]);
        });
      }
    }
    return records;
  }

  function recoverCatchRecords() {
    const keys = [
      CATCH_STORAGE_KEY,
      "mieFishingMap.v1",
      "mieFishingMap.v1.records",
      "mieFishingMap.v1.catches",
      "mie-fishing-map-catches-v1",
      "mie-fishing-map-records-v1",
      "mie-bass-catch-records-v1",
      "mie-bass-records-v1",
      "mieFishingMap.backup",
      "mie-fishing-map-backup"
    ];
    const candidates = [];
    keys.forEach((key) => {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return;
        candidates.push(...collectRecordCandidatesFromValue(safeParse(raw, null), key));
      } catch (error) {}
    });

    const merged = new Map();
    candidates.map(normalizeRecord).forEach((record) => {
      if (record.spotId && !validPosition(record)) {
        const spot = state.spots.find((item) => item.id === record.spotId || item.name === record.spotId);
        if (spot) {
          record.lat = Number(spot.lat);
          record.lng = Number(spot.lng);
          record.__positionRecoveredFromSpot = true;
        }
      }
      const key = record.id || recordIdentity(record);
      if (!merged.has(key)) merged.set(key, record);
    });

    const list = [...merged.values()]
      .filter((record) => record && (record.id || record.species || record.memo || record.placeName || record.time || validPosition(record)))
      .sort((a, b) => String(b.time || b.createdAt || "").localeCompare(String(a.time || a.createdAt || "")));

    try {
      const current = collectRecordCandidatesFromValue(safeParse(localStorage.getItem(CATCH_STORAGE_KEY), []), CATCH_STORAGE_KEY);
      if (list.length > current.length) localStorage.setItem(CATCH_STORAGE_KEY, JSON.stringify(list));
    } catch (error) {}
    return list;
  }

  function applyMenuBackground() {
    const value = `url("${MENU_BACKGROUND_URL}")`;
    document.documentElement.style.setProperty("--menu-bg-image", value);
    document.documentElement.style.setProperty("--sidebar-bg-image", value);
    document.querySelectorAll(".sidebar, #mobileMenu.sidebar").forEach((sidebar) => {
      sidebar.style.setProperty("--menu-bg-image", value);
      sidebar.style.setProperty("--sidebar-bg-image", value);
      sidebar.style.setProperty("background", `linear-gradient(180deg, rgba(5,30,25,.08), rgba(5,44,36,.02)), ${value}`, "important");
      sidebar.style.setProperty("background-size", "cover", "important");
      sidebar.style.setProperty("background-position", "center", "important");
      sidebar.style.setProperty("background-repeat", "no-repeat", "important");
    });
  }

  function loadState() {
    state.savedState = safeParse(localStorage.getItem(STORAGE_KEY), {});
    state.customSpots = safeParse(localStorage.getItem(CUSTOM_SPOT_STORAGE_KEY), []).filter(validPosition);
    state.positionOverrides = safeParse(localStorage.getItem(POSITION_STORAGE_KEY), {});
    const baseSpots = seedSpots.map((spot) => {
      const override = state.positionOverrides?.[spot.id];
      return validPosition(override) ? { ...spot, lat: Number(override.lat), lng: Number(override.lng), positionAdjusted: true } : spot;
    });
    state.spots = [...baseSpots, ...state.customSpots.map((spot) => ({ ...spot, custom: true }))].filter(validPosition);
    if (!state.spots.length) state.spots = baseSpots;
    state.catches = recoverCatchRecords();
  }

  function initMap() {
    const mapElement = $("map");
    if (!mapElement || typeof L === "undefined") {
      const dataStatus = $("dataStatus");
      if (dataStatus) dataStatus.textContent = "Leafletまたは地図コンテナを読み込めませんでした。通信状態を確認してください。";
      return;
    }
    if (mapElement._leaflet_id) {
      try { mapElement._leaflet_id = null; mapElement.innerHTML = ""; } catch (error) {}
    }
    map = L.map("map", {
      zoomControl: true,
      touchZoom: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
      preferCanvas: true,
      minZoom: 5
    }).setView(MIE_CENTER, MIE_HOME_ZOOM);
    map.attributionControl.setPrefix("");
    const tileOptions = {
      maxZoom: 18,
      noWrap: false,
      keepBuffer: 2,
      updateWhenIdle: true,
      updateWhenZooming: false,
      attribution: '地図出典：<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noopener">国土地理院（地理院タイル）</a>'
    };
    const standardMap = L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png", tileOptions).addTo(map);
    const aerialMap = L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg", tileOptions);
    L.control.layers({ "標準地図": standardMap, "航空写真": aerialMap }, null, { position: "topright" }).addTo(map);
    [80, 250, 600, 1200].forEach((ms) => setTimeout(() => map?.invalidateSize?.({ animate: false }), ms));
  }

  function filteredSpots() {
    const q = state.search.trim().toLowerCase();
    return state.spots.filter((spot) => {
      if (state.activeFilter !== "all" && spot.type !== state.activeFilter) return false;
      if (!q) return true;
      return [spot.name, spot.area, spot.type, spot.subtype].some((v) => String(v || "").toLowerCase().includes(q));
    });
  }

  function markerColorClass(type) {
    if (type === "ダム") return "dam";
    if (type === "池") return "pond";
    if (type === "川") return "river";
    if (type === "港") return "port";
    return "other";
  }

  function makeIcon(spot) {
    const cls = markerColorClass(spot.type);
    return L.divIcon({
      className: `spot-pin spot-pin-${cls}`,
      html: `<span>${escapeHtml(spot.type.slice(0, 1) || "釣")}</span>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -28]
    });
  }

  function showSpot(spot) {
    state.selectedSpotId = spot.id;
    if (map) map.setView([Number(spot.lat), Number(spot.lng)], Number(spot.zoom || 15), { animate: true });
    markers.get(spot.id)?.openPopup?.();
    const card = $("spotCard");
    if (card) {
      card.classList.remove("is-hidden");
      document.body.classList.add("spot-card-open");
      card.innerHTML = `<header><p>${escapeHtml(spot.type)} / ${escapeHtml(spot.area || "")}</p><h2>${escapeHtml(spot.name)}</h2></header><p>${escapeHtml(spot.subtype || spot.source || "")}</p><div class="card-actions"><button type="button" data-action="close">閉じる</button></div>`;
      card.querySelector('[data-action="close"]')?.addEventListener("click", () => { card.classList.add("is-hidden"); document.body.classList.remove("spot-card-open"); });
    }
  }

  function renderSpotMarkers() {
    if (!map) return;
    markers.forEach((marker) => marker.remove());
    markers = new Map();
    filteredSpots().forEach((spot) => {
      const marker = L.marker([Number(spot.lat), Number(spot.lng)], { icon: makeIcon(spot), title: spot.name })
        .addTo(map)
        .bindPopup(`<strong>${escapeHtml(spot.name)}</strong><br>${escapeHtml(spot.type)} / ${escapeHtml(spot.area || "")}`);
      marker.on("click", () => showSpot(spot));
      markers.set(spot.id, marker);
    });
  }

  function renderCatchMarkers() {
    if (!map) return;
    catchMarkers.forEach((marker) => marker.remove());
    catchMarkers = new Map();
    state.catches.forEach((record) => {
      if (!validPosition(record)) return;
      const marker = L.circleMarker([Number(record.lat), Number(record.lng)], {
        radius: 8,
        weight: 3,
        color: "#f97316",
        fillColor: "#fed7aa",
        fillOpacity: .95
      })
        .addTo(map)
        .bindPopup(`<strong>${escapeHtml(record.species || record.placeName || "釣果記録")}</strong><br>${escapeHtml(record.time || "")}<br>${escapeHtml(record.memo || "")}`);
      catchMarkers.set(record.id, marker);
    });
  }

  function renderSpotList() {
    const list = $("spotList");
    const spots = filteredSpots();
    if (list) {
      list.innerHTML = spots.map((spot) => `<button class="spot-item" type="button" data-spot-id="${escapeHtml(spot.id)}"><strong>${escapeHtml(spot.name)}</strong><span>${escapeHtml(spot.type)} / ${escapeHtml(spot.area || "")}</span></button>`).join("");
      list.querySelectorAll("[data-spot-id]").forEach((button) => {
        button.addEventListener("click", () => {
          const spot = state.spots.find((item) => item.id === button.dataset.spotId);
          if (spot) { closeMobileMenu(); showSpot(spot); }
        });
      });
    }
    const visibleCount = $("visibleCount");
    if (visibleCount) visibleCount.textContent = `${spots.length}件表示`;
    const spotCount = $("spotCount");
    if (spotCount) spotCount.textContent = String(state.spots.length);
  }

  function recordTitle(record) {
    return record.species || record.placeName || record.memo || "釣果記録";
  }

  function recordSubText(record) {
    const parts = [];
    if (record.time) parts.push(record.time);
    if (record.sizeCm) parts.push(`${record.sizeCm}cm`);
    if (record.bait) parts.push(record.bait);
    if (validPosition(record)) parts.push("釣果ピンあり");
    else parts.push("位置情報なし");
    return parts.join(" / ");
  }

  function focusCatchRecord(recordId) {
    const record = state.catches.find((item) => item.id === recordId);
    if (!record) return;
    closeMobileMenu();
    if (validPosition(record) && map) {
      map.setView([Number(record.lat), Number(record.lng)], 16, { animate: true });
      const marker = catchMarkers.get(record.id);
      setTimeout(() => marker?.openPopup?.(), 220);
    } else {
      const status = $("dataStatus");
      if (status) status.textContent = "この記録には位置情報がありません。記録一覧には残しています。";
    }
  }

  function renderCatchList() {
    const catchList = $("catchList");
    if (catchList) {
      catchList.innerHTML = state.catches.length
        ? state.catches.map((record, index) => {
            const pinText = validPosition(record) ? "釣果ピンあり" : "位置情報なし";
            const recovered = record.__recoveredFrom ? ` / 復旧元:${escapeHtml(record.__recoveredFrom)}` : "";
            return `<button class="catch-item" type="button" data-catch-id="${escapeHtml(record.id)}"><span class="catch-num ${record.recordType === "note" ? "note" : ""}">${index + 1}</span><span class="catch-main"><strong>${escapeHtml(recordTitle(record))}${Number(record.sizeCm) >= 40 ? '<span class="big-bass-badge">40up</span>' : ''}</strong><small>${escapeHtml(recordSubText(record))}</small><small>${pinText}${recovered}</small></span></button>`;
          }).join("")
        : `<p class="empty-message">釣果記録はまだ見つかりません。端末内に旧形式の記録が残っていれば、自動復旧します。</p>`;
      catchList.querySelectorAll("[data-catch-id]").forEach((button) => {
        button.addEventListener("click", () => focusCatchRecord(button.dataset.catchId));
      });
    }
    const recordCount = $("recordCount");
    if (recordCount) recordCount.textContent = String(state.catches.length);
    const bigBassCount = $("bigBassCount");
    if (bigBassCount) bigBassCount.textContent = String(state.catches.filter((r) => Number(r.sizeCm) >= 40).length);
  }

  function render() {
    if (!state.spots.length) state.spots = seedSpots;
    renderSpotList();
    renderSpotMarkers();
    renderCatchList();
    renderCatchMarkers();
    const status = $("dataStatus");
    if (status) status.textContent = `${APP_STATUS_LABEL} / 釣り場${state.spots.length}件 / 記録${state.catches.length}件`;
  }

  function openMobileMenu() {
    $("mobileMenu")?.classList.add("is-open");
    $("menuBackdrop")?.classList.add("is-open");
    document.body.classList.add("menu-open");
    $("menuToggle")?.setAttribute("aria-expanded", "true");
    setTimeout(() => map?.invalidateSize?.({ animate: false }), 120);
  }

  function closeMobileMenu() {
    $("mobileMenu")?.classList.remove("is-open");
    $("menuBackdrop")?.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    $("menuToggle")?.setAttribute("aria-expanded", "false");
    setTimeout(() => map?.invalidateSize?.({ animate: false }), 120);
  }

  function setupStartScreen() {
    const screen = $("appStartScreen");
    const button = $("startScreenSkip");
    const close = () => {
      screen?.classList.add("is-hidden", "is-closing");
      screen?.setAttribute("aria-hidden", "true");
      screen?.style.setProperty("display", "none", "important");
      document.body.classList.remove("start-screen-active", "start-screen-launching");
      document.body.classList.add("start-screen-done");
      setTimeout(() => map?.invalidateSize?.({ animate: false }), 120);
    };
    button?.addEventListener("click", close);
    button?.addEventListener("touchend", (event) => { event.preventDefault(); close(); }, { passive: false });
    if (screen) document.body.classList.add("start-screen-active");
  }

  function nowLocalInputValue() {
    const date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
  }

  function currentMapLatLng() {
    const center = map?.getCenter?.();
    if (center && Number.isFinite(Number(center.lat)) && Number.isFinite(Number(center.lng))) return center;
    return { lat: MIE_CENTER[0], lng: MIE_CENTER[1] };
  }

  function setPanelOpen(panel, open) {
    if (!panel) return;
    panel.classList.toggle("is-open", Boolean(open));
    panel.classList.toggle("is-hidden", !open);
    panel.setAttribute("aria-hidden", open ? "false" : "true");
    if (open) {
      panel.removeAttribute("hidden");
      panel.style.setProperty("display", "grid", "important");
      document.body.classList.add("panel-open");
    } else {
      panel.style.removeProperty("display");
      document.body.classList.remove("panel-open");
    }
  }

  function closeCatchPanel() {
    setPanelOpen($("catchPanel"), false);
    state.catchMode = false;
    $("addCatchMode")?.classList.remove("is-active");
  }

  function selectedSpeciesText() {
    const checked = [...document.querySelectorAll('[data-catch-species-option]:checked')].map((input) => input.value).filter(Boolean);
    const hiddenValue = String($("catchSpecies")?.value || "").trim();
    return checked.length ? [...new Set(checked)].join("、") : (hiddenValue || "ブラックバス");
  }

  function syncSpeciesHiddenFromChecks() {
    const species = selectedSpeciesText();
    if ($("catchSpecies")) $("catchSpecies").value = species;
    return species;
  }

  function openCatchPanel(latlng = null, options = {}) {
    const panel = $("catchPanel");
    if (!panel) {
      const status = $("dataStatus");
      if (status) status.textContent = "記録パネルが見つかりません。index.htmlのcatchPanelを確認してください。";
      return;
    }
    const pos = latlng || currentMapLatLng();
    const lat = Number(pos.lat);
    const lng = Number(pos.lng);
    closeMobileMenu();
    state.catchMode = false;
    $("addCatchMode")?.classList.remove("is-active");
    if ($("catchIdInput")) $("catchIdInput").value = "";
    if ($("catchLat")) $("catchLat").value = Number.isFinite(lat) ? String(lat) : String(MIE_CENTER[0]);
    if ($("catchLng")) $("catchLng").value = Number.isFinite(lng) ? String(lng) : String(MIE_CENTER[1]);
    if ($("catchRecordType")) $("catchRecordType").value = options.recordType || "catch";
    if ($("catchTime") && !$("catchTime").value) $("catchTime").value = nowLocalInputValue();
    if ($("catchLocationStatus")) $("catchLocationStatus").textContent = options.locationLabel || "地図中央の位置で記録します。必要なら現在地を使ってください。";
    syncSpeciesHiddenFromChecks();
    setPanelOpen(panel, true);
    setTimeout(() => panel.querySelector("input, select, textarea, button")?.focus?.(), 80);
  }

  function useCurrentLocationForCatch() {
    if (!navigator.geolocation) {
      openCatchPanel(currentMapLatLng(), { recordType: "catch", locationLabel: "位置情報が使えないため、地図中央で記録します。" });
      return;
    }
    const status = $("catchLocationStatus") || $("dataStatus");
    if (status) status.textContent = "現在地を取得しています…";
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latlng = { lat: position.coords.latitude, lng: position.coords.longitude };
        if ($("catchLat")) $("catchLat").value = String(latlng.lat);
        if ($("catchLng")) $("catchLng").value = String(latlng.lng);
        if ($("catchLocationStatus")) $("catchLocationStatus").textContent = "現在地で記録します。";
        if (map) map.setView([latlng.lat, latlng.lng], Math.max(map.getZoom() || 15, 15), { animate: true });
        openCatchPanel(latlng, { recordType: "catch", locationLabel: "現在地で記録します。" });
      },
      () => openCatchPanel(currentMapLatLng(), { recordType: "catch", locationLabel: "現在地を取得できなかったため、地図中央で記録します。" }),
      { enableHighAccuracy: true, timeout: 9000, maximumAge: 30000 }
    );
  }

  function saveCatch(event) {
    event?.preventDefault?.();
    const lat = Number($("catchLat")?.value || currentMapLatLng().lat);
    const lng = Number($("catchLng")?.value || currentMapLatLng().lng);
    const id = $("catchIdInput")?.value || `record-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    const record = normalizeRecord({
      id,
      recordType: $("catchRecordType")?.value || "catch",
      placeKind: $("catchPlaceKind")?.value || "",
      placeName: $("catchPlaceName")?.value || "",
      spotId: $("catchSpot")?.value || "",
      time: $("catchTime")?.value || nowLocalInputValue(),
      lat,
      lng,
      species: syncSpeciesHiddenFromChecks(),
      bait: $("catchBait")?.value || "",
      lureName: $("catchLureName")?.value || "",
      lureColor: $("catchLureColor")?.value || "",
      lureWeight: $("catchLureWeight")?.value || "",
      sizeCm: $("catchSizeCm")?.value || "",
      size: $("catchSize")?.value || "",
      weather: $("catchWeather")?.value || "",
      wind: $("catchWind")?.value || "",
      water: $("catchWater")?.value || "",
      waterLevel: $("catchWaterLevel")?.value || "",
      baitfish: $("catchBaitfish")?.value || "",
      cover: $("catchCover")?.value || "",
      reaction: $("catchReaction")?.value || "",
      pressure: $("catchPressure")?.value || "",
      timeBand: $("catchTimeBand")?.value || "",
      memo: $("catchMemo")?.value || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    const index = state.catches.findIndex((item) => item.id === id);
    if (index >= 0) state.catches[index] = record;
    else state.catches.unshift(record);
    try { localStorage.setItem(CATCH_STORAGE_KEY, JSON.stringify(state.catches)); } catch (error) {}
    render();
    switchList("catches");
    closeCatchPanel();
    const status = $("dataStatus");
    if (status) status.textContent = "記録を保存しました。釣果ピンと記録一覧を更新しました。";
  }

  function deleteSelectedCatch() {
    const id = $("catchIdInput")?.value;
    if (!id) { closeCatchPanel(); return; }
    state.catches = state.catches.filter((record) => record.id !== id);
    try { localStorage.setItem(CATCH_STORAGE_KEY, JSON.stringify(state.catches)); } catch (error) {}
    render();
    closeCatchPanel();
  }

  function switchList(listName) {
    state.activeList = listName === "catches" ? "catches" : "spots";
    const showCatches = state.activeList === "catches";
    $("spotTab")?.classList.toggle("is-active", !showCatches);
    $("catchTab")?.classList.toggle("is-active", showCatches);
    $("spotTab")?.setAttribute("aria-selected", showCatches ? "false" : "true");
    $("catchTab")?.setAttribute("aria-selected", showCatches ? "true" : "false");
    $("spotList")?.classList.toggle("is-hidden", showCatches);
    $("catchList")?.classList.toggle("is-hidden", !showCatches);
    $("spotListHead")?.classList.toggle("is-hidden", showCatches);
    $("catchListHead")?.classList.toggle("is-hidden", !showCatches);
    $("recordFilterRow")?.classList.toggle("is-hidden", !showCatches);
    if (showCatches) {
      $("catchList")?.removeAttribute("hidden");
      $("spotList")?.setAttribute("hidden", "hidden");
    } else {
      $("spotList")?.removeAttribute("hidden");
      $("catchList")?.setAttribute("hidden", "hidden");
    }
    renderCatchList();
  }


  function bindEvents() {
    $("menuToggle")?.addEventListener("click", () => {
      const menu = $("mobileMenu");
      if (menu?.classList.contains("is-open")) closeMobileMenu(); else openMobileMenu();
    });
    $("closeMenuButton")?.addEventListener("click", closeMobileMenu);
    $("menuBackdrop")?.addEventListener("click", closeMobileMenu);
    $("resetView")?.addEventListener("click", () => map?.setView?.(MIE_CENTER, MIE_HOME_ZOOM, { animate: false }));
    $("searchInput")?.addEventListener("input", (event) => { state.search = event.target.value || ""; render(); });
    document.querySelectorAll(".filter-chip").forEach((button) => {
      button.addEventListener("click", () => {
        state.activeFilter = button.dataset.filter || "all";
        document.querySelectorAll(".filter-chip").forEach((b) => b.classList.toggle("is-active", b === button));
        render();
      });
    });
    $("spotTab")?.addEventListener("click", () => switchList("spots"));
    $("catchTab")?.addEventListener("click", () => switchList("catches"));
    document.querySelectorAll("[data-record-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        document.querySelectorAll("[data-record-filter]").forEach((b) => b.classList.toggle("is-active", b === button));
        switchList("catches");
      });
    });
    document.querySelectorAll("[data-catch-species-option]").forEach((input) => input.addEventListener("change", syncSpeciesHiddenFromChecks));
    $("catchForm")?.addEventListener("submit", saveCatch);
    $("closeCatchPanel")?.addEventListener("click", closeCatchPanel);
    $("deleteCatch")?.addEventListener("click", deleteSelectedCatch);
    $("useCurrentLocationButton")?.addEventListener("click", useCurrentLocationForCatch);
    $("addSpotMode")?.addEventListener("click", () => alert("釣り場追加機能は復旧作業中です。釣果記録ボタンは使えるように修正しました。"));
    $("addCatchMode")?.addEventListener("click", () => openCatchPanel(currentMapLatLng(), { recordType: "catch", locationLabel: "地図中央の位置で釣果記録を作成します。" }));
    $("locateCatchButton")?.addEventListener("click", useCurrentLocationForCatch);
    window.addEventListener("resize", () => map?.invalidateSize?.({ animate: false }));
  }

  function installRecoveryStyles() {
    if (document.getElementById("v168RecordButtonFixStyle")) return;
    const style = document.createElement("style");
    style.id = "v168RecordButtonFixStyle";
    style.textContent = `
      #appStartScreen.is-hidden, body.start-screen-done #appStartScreen { display: none !important; pointer-events: none !important; visibility: hidden !important; opacity: 0 !important; }
      #map, .map-pane, #map.leaflet-container, .leaflet-container { background: #cfded8 !important; background-image: none !important; }
      .leaflet-tile-pane, .leaflet-layer, .leaflet-tile-container, .leaflet-tile { background: transparent !important; background-image: none !important; }
      .spot-pin { border: 0 !important; background: transparent !important; }
      .spot-pin span { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 999px; background: #0f7b63; color: #fff; border: 3px solid #fff; box-shadow: 0 3px 12px rgba(0,0,0,.35); font-weight: 900; font-size: .78rem; }
      .spot-pin-dam span { background: #2563eb; }
      .spot-pin-pond span { background: #16a34a; }
      .spot-pin-river span { background: #0284c7; }
      .spot-pin-port span { background: #ea580c; }
      .leaflet-interactive { cursor: pointer; }
      .catch-item small { display: block; margin-top: 2px; font-size: .72rem; opacity: .78; }
      .spot-item { width: 100%; display: grid; gap: 2px; text-align: left; margin: 0 0 8px; padding: 10px 12px; border-radius: 14px; border: 1px solid rgba(255,255,255,.35); background: rgba(255,255,255,.86); color: #073f33; }
      .spot-item strong { font-size: .95rem; }
      .spot-item span { font-size: .78rem; opacity: .86; }
      .sidebar, #mobileMenu.sidebar { background: linear-gradient(180deg, rgba(5,30,25,.08), rgba(5,44,36,.02)), var(--menu-bg-image) !important; background-size: cover !important; background-position: center !important; background-repeat: no-repeat !important; }
    `;
    document.head.appendChild(style);
  }

  function init() {
    installRecoveryStyles();
    applyMenuBackground();
    setupStartScreen();
    loadState();
    bindEvents();
    initMap();
    render();
    switchList("spots");
    window.__MIE_APP_READY__ = true;
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
