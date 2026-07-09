(() => {
  "use strict";

  const APP_VERSION = "v176-spot-species-picker-fix";
  const APP_STATUS_LABEL = "v176・魚種と釣況選択復旧版";
  const STORAGE_KEY = "mie-bass-map-v1";
  const CATCH_STORAGE_KEY = "mie-bass-catches-v1";
  const CUSTOM_SPOT_STORAGE_KEY = "mie-bass-custom-spots-v1";
  const BACKGROUND_STORAGE_KEY = "mie-fishing-map-sidebar-background-v1";
  const POSITION_STORAGE_KEY = "mie-fishing-map-position-overrides-v86";
  const BACKUP_META_STORAGE_KEY = "mie-fishing-map-backup-meta-v1";
  const MIE_CENTER = [34.55, 136.48];
  const MIE_HOME_ZOOM = 9;
  const MENU_BACKGROUND_URL = `assets/menu-bg-bakucho-nyanko-sensei-v176.png?v=${APP_VERSION}`;

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
    spotMode: false,
    catchMode: false,
    pendingPhoto: "",
    pendingPhotoPromise: null,
    recordEntryMode: "detail",
    speciesCategoryFilter: "all",
    speciesSearch: ""
  };

  function normalizeSavedSpotState(raw = {}) {
    return {
      caught: Boolean(raw.caught ?? raw.hasCatch ?? raw.checked),
      species: String(raw.species || raw.fish || raw.fishSpecies || "").trim(),
      noFishing: Boolean(raw.noFishing ?? raw.prohibited ?? raw.banned),
      parking: Boolean(raw.parking ?? raw.hasParking),
      memo: String(raw.memo || "").trim()
    };
  }

  function spotState(id) {
    if (!state.savedState || typeof state.savedState !== "object") state.savedState = {};
    const key = String(id || "");
    if (!key) return normalizeSavedSpotState({});
    state.savedState[key] = normalizeSavedSpotState(state.savedState[key] || {});
    return state.savedState[key];
  }

  function persistSavedState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.savedState || {})); } catch (error) {}
  }

  function spotSpeciesSummary(value, fallback = "魚種") {
    const list = String(value || "").split(/[、,，/／]+/u).map((item) => item.trim()).filter(Boolean);
    if (!list.length) return fallback;
    if (list.length <= 2) return list.join("・");
    return `${list[0]}ほか${list.length - 1}`;
  }

  function editSpotSpecies(spotId) {
    const spot = state.spots.find((item) => item.id === spotId);
    const saved = spotState(spotId);
    const next = window.prompt(`「${spot?.name || "釣り場"}」で釣れた魚種を入力してください。例：ブラックバス、シーバス、アジ`, saved.species || "");
    if (next === null) return;
    saved.species = String(next || "").trim();
    persistSavedState();
    renderSpotList();
    if (state.selectedSpotId === spotId && spot) renderSpotCard(spot);
    const status = $("dataStatus");
    if (status) status.textContent = saved.species ? `「${spot?.name || "釣り場"}」の魚種を保存しました。` : `「${spot?.name || "釣り場"}」の魚種を未設定に戻しました。`;
  }

  function updateSpotFlag(spotId, flag, value) {
    const spot = state.spots.find((item) => item.id === spotId);
    const saved = spotState(spotId);
    saved[flag] = Boolean(value);
    persistSavedState();
    renderSpotList();
    if (state.selectedSpotId === spotId && spot) renderSpotCard(spot);
    const label = flag === "caught" ? "釣れた" : flag === "noFishing" ? "禁止/注意" : flag === "parking" ? "駐車" : flag;
    const status = $("dataStatus");
    if (status) status.textContent = `「${spot?.name || "釣り場"}」の${label}を${value ? "オン" : "オフ"}にしました。`;
  }

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

  function applyMenuBackground(customSource = "") {
    let source = String(customSource || "").trim();
    if (!source) {
      try { source = String(localStorage.getItem(BACKGROUND_STORAGE_KEY) || "").trim(); } catch (error) {}
    }
    const backgroundUrl = source || MENU_BACKGROUND_URL;
    const value = backgroundUrl.startsWith("url(") ? backgroundUrl : `url("${backgroundUrl}")`;
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


  function cleanCustomSpotForStorage(spot) {
    return {
      id: spot.id || `custom-spot-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      name: String(spot.name || "未命名の釣り場").trim() || "未命名の釣り場",
      type: String(spot.type || "池").trim() || "池",
      area: String(spot.area || "").trim(),
      lat: Number(spot.lat),
      lng: Number(spot.lng),
      zoom: Number(spot.zoom || 16),
      source: "ユーザー追加",
      subtype: String(spot.subtype || "").trim(),
      memo: String(spot.memo || "").trim(),
      custom: true,
      createdAt: spot.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  function rebuildSpotsFromState() {
    const baseSpots = seedSpots.map((spot) => {
      const override = state.positionOverrides?.[spot.id];
      return validPosition(override) ? { ...spot, lat: Number(override.lat), lng: Number(override.lng), positionAdjusted: true } : spot;
    });
    state.customSpots = (Array.isArray(state.customSpots) ? state.customSpots : [])
      .map(cleanCustomSpotForStorage)
      .filter(validPosition);
    state.spots = [...baseSpots, ...state.customSpots].filter(validPosition);
    if (!state.spots.length) state.spots = baseSpots;
  }

  function saveCustomSpotsToStorage() {
    try { localStorage.setItem(CUSTOM_SPOT_STORAGE_KEY, JSON.stringify(state.customSpots.map(cleanCustomSpotForStorage))); } catch (error) {}
  }

  function loadState() {
    state.savedState = safeParse(localStorage.getItem(STORAGE_KEY), {});
    state.customSpots = safeParse(localStorage.getItem(CUSTOM_SPOT_STORAGE_KEY), []).filter(validPosition);
    state.positionOverrides = safeParse(localStorage.getItem(POSITION_STORAGE_KEY), {});
    rebuildSpotsFromState();
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
    map.on("click", (event) => {
      if (!state.spotMode) return;
      openSpotPanel(event.latlng, {});
    });
    [80, 250, 600, 1200].forEach((ms) => setTimeout(() => map?.invalidateSize?.({ animate: false }), ms));
  }

  function filteredSpots() {
    const q = state.search.trim().toLowerCase();
    return state.spots.filter((spot) => {
      if (state.activeFilter !== "all" && spot.type !== state.activeFilter) return false;
      if (!q) return true;
      const saved = spotState(spot.id);
      const savedWords = [
        saved.caught ? "釣れた" : "",
        saved.noFishing ? "禁止 注意 釣り禁止" : "",
        saved.parking ? "駐車 駐車場" : "",
        saved.species
      ];
      return [spot.name, spot.area, spot.type, spot.subtype, spot.source, spot.memo, ...savedWords]
        .some((v) => String(v || "").toLowerCase().includes(q));
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

  function renderSpotCard(spot) {
    const card = $("spotCard");
    if (!card || !spot) return;
    const saved = spotState(spot.id);
    card.classList.remove("is-hidden");
    document.body.classList.add("spot-card-open");
    card.innerHTML = `<header><p>${escapeHtml(spot.type)} / ${escapeHtml(spot.area || "")}</p><h2>${escapeHtml(spot.name)}</h2></header>
      <p>${escapeHtml(spot.subtype || spot.source || "")}</p>
      ${spot.memo ? `<p>${escapeHtml(spot.memo)}</p>` : ""}
      <div class="card-flags spot-check-card" data-spot-id="${escapeHtml(spot.id)}">
        <label class="card-flag-label"><input type="checkbox" data-card-spot-flag="caught" ${saved.caught ? "checked" : ""}><span>釣れた</span></label>
        <button class="card-species-button ${saved.species ? "on" : ""}" type="button" data-card-spot-species="${escapeHtml(spot.id)}"><small>魚種</small><strong>${escapeHtml(spotSpeciesSummary(saved.species, "未設定"))}</strong></button>
        <label class="card-flag-label"><input type="checkbox" data-card-spot-flag="noFishing" ${saved.noFishing ? "checked" : ""}><span>禁止/注意</span></label>
        <label class="card-flag-label"><input type="checkbox" data-card-spot-flag="parking" ${saved.parking ? "checked" : ""}><span>駐車</span></label>
      </div>
      <div class="card-actions"><button type="button" data-action="close">閉じる</button></div>`;
    card.querySelector('[data-action="close"]')?.addEventListener("click", () => { card.classList.add("is-hidden"); document.body.classList.remove("spot-card-open"); });
    card.querySelectorAll("[data-card-spot-flag]").forEach((input) => {
      input.addEventListener("change", () => updateSpotFlag(spot.id, input.dataset.cardSpotFlag, input.checked));
    });
    card.querySelector("[data-card-spot-species]")?.addEventListener("click", () => editSpotSpecies(spot.id));
  }

  function showSpot(spot) {
    state.selectedSpotId = spot.id;
    if (map) map.setView([Number(spot.lat), Number(spot.lng)], Number(spot.zoom || 15), { animate: true });
    markers.get(spot.id)?.openPopup?.();
    renderSpotCard(spot);
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
        .bindPopup(`${photoMarkup(record, "popup-record-photo")}<strong>${escapeHtml(record.species || record.placeName || "釣果記録")}</strong><br>${escapeHtml(record.time || "")}<br>${escapeHtml(record.memo || "")}`);
      catchMarkers.set(record.id, marker);
    });
  }

  function renderSpotList() {
    const list = $("spotList");
    const spots = filteredSpots();
    if (list) {
      list.innerHTML = spots.map((spot) => {
        const saved = spotState(spot.id);
        const selected = state.selectedSpotId === spot.id ? " is-selected" : "";
        return `<article class="spot-item spot-check-row${selected}" data-spot-id="${escapeHtml(spot.id)}">
          <button class="spot-main spot-focus-button" type="button" data-spot-focus="${escapeHtml(spot.id)}">
            <strong>${escapeHtml(spot.name)}</strong>
            <small>${escapeHtml(spot.type)} / ${escapeHtml(spot.area || "")}</small>
          </button>
          <label class="spot-flag-label" title="釣れた"><input type="checkbox" data-spot-id="${escapeHtml(spot.id)}" data-spot-flag="caught" ${saved.caught ? "checked" : ""}><span>釣れた</span></label>
          <button class="spot-species-button ${saved.species ? "on" : ""}" type="button" data-spot-species="${escapeHtml(spot.id)}" title="${escapeHtml(saved.species || "魚種未設定")}"><small>魚種</small><strong>${escapeHtml(spotSpeciesSummary(saved.species, "未設定"))}</strong></button>
          <label class="spot-flag-label" title="禁止・注意"><input type="checkbox" data-spot-id="${escapeHtml(spot.id)}" data-spot-flag="noFishing" ${saved.noFishing ? "checked" : ""}><span>禁止</span></label>
          <label class="spot-flag-label" title="駐車"><input type="checkbox" data-spot-id="${escapeHtml(spot.id)}" data-spot-flag="parking" ${saved.parking ? "checked" : ""}><span>駐車</span></label>
        </article>`;
      }).join("");
      list.querySelectorAll("[data-spot-focus]").forEach((button) => {
        button.addEventListener("click", () => {
          const spot = state.spots.find((item) => item.id === button.dataset.spotFocus);
          if (spot) { closeMobileMenu(); showSpot(spot); }
        });
      });
      list.querySelectorAll("[data-spot-flag]").forEach((input) => {
        input.addEventListener("click", (event) => event.stopPropagation());
        input.addEventListener("change", () => updateSpotFlag(input.dataset.spotId, input.dataset.spotFlag, input.checked));
      });
      list.querySelectorAll("[data-spot-species]").forEach((button) => {
        button.addEventListener("click", (event) => {
          event.stopPropagation();
          editSpotSpecies(button.dataset.spotSpecies);
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
    if (record.cover) parts.push(`地形:${record.cover}`);
    if (record.reaction) parts.push(`反応:${record.reaction}`);
    if (record.water) parts.push(`水:${record.water}`);
    if (record.weather) parts.push(`天気:${record.weather}`);
    if (record.wind) parts.push(`風:${record.wind}`);
    if (record.pressure) parts.push(`圧:${record.pressure}`);
    if (record.photo) parts.push("写真あり");
    if (validPosition(record)) parts.push("釣果ピンあり");
    else parts.push("位置情報なし");
    return parts.join(" / ");
  }

  function safePhotoSrc(value) {
    const src = String(value || "").trim();
    if (!src) return "";
    if (src.startsWith("data:image/")) return src;
    if (src.startsWith("blob:")) return src;
    if (src.startsWith("https://") || src.startsWith("http://")) return src;
    if (src.startsWith("assets/")) return src;
    return "";
  }

  function photoMarkup(record, className = "record-photo-thumb") {
    const src = safePhotoSrc(record?.photo);
    if (!src) return "";
    return `<img class="${className}" src="${escapeHtml(src)}" alt="釣果写真" loading="lazy">`;
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
            return `<button class="catch-item ${record.photo ? "has-photo" : ""}" type="button" data-catch-id="${escapeHtml(record.id)}"><span class="catch-num ${record.recordType === "note" ? "note" : ""}">${index + 1}</span>${photoMarkup(record)}<span class="catch-main"><strong>${escapeHtml(recordTitle(record))}${Number(record.sizeCm) >= 40 ? '<span class="big-bass-badge">40up</span>' : ''}</strong><small>${escapeHtml(recordSubText(record))}</small><small>${pinText}${recovered}</small></span></button>`;
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


  function closeSpotPanel() {
    setPanelOpen($("spotPanel"), false);
    state.spotMode = false;
    $("addSpotMode")?.classList.remove("is-active");
    document.body.classList.remove("position-adjusting");
  }

  function openSpotPanel(latlng = null, options = {}) {
    const panel = $("spotPanel");
    if (!panel) {
      const status = $("dataStatus");
      if (status) status.textContent = "釣り場追加パネルが見つかりません。index.htmlのspotPanelを確認してください。";
      return;
    }
    const pos = latlng || currentMapLatLng();
    const lat = Number(pos.lat);
    const lng = Number(pos.lng);
    closeMobileMenu();
    try { map?.closePopup?.(); } catch (error) {}
    const card = $("spotCard");
    if (card) card.classList.add("is-hidden");
    document.body.classList.remove("spot-card-open");
    state.spotMode = false;
    $("addSpotMode")?.classList.remove("is-active");
    if ($("spotIdInput")) $("spotIdInput").value = options.id || "";
    if ($("spotLat")) $("spotLat").value = Number.isFinite(lat) ? String(lat) : String(MIE_CENTER[0]);
    if ($("spotLng")) $("spotLng").value = Number.isFinite(lng) ? String(lng) : String(MIE_CENTER[1]);
    if ($("spotNameInput")) $("spotNameInput").value = options.name || "";
    if ($("spotTypeInput")) $("spotTypeInput").value = options.type || "池";
    if ($("spotAreaInput")) $("spotAreaInput").value = options.area || "";
    if ($("spotMemoInput")) $("spotMemoInput").value = options.memo || "";
    setPanelOpen(panel, true);
    const status = $("dataStatus");
    if (status) status.textContent = "釣り場追加を開きました。名前を入力して保存してください。位置は地図中央です。";
    setTimeout(() => $("spotNameInput")?.focus?.(), 80);
  }

  function saveSpot(event) {
    event?.preventDefault?.();
    const lat = Number($("spotLat")?.value || currentMapLatLng().lat);
    const lng = Number($("spotLng")?.value || currentMapLatLng().lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      const status = $("dataStatus");
      if (status) status.textContent = "釣り場の位置を取得できませんでした。地図中央を表示してからもう一度試してください。";
      return;
    }
    const id = $("spotIdInput")?.value || `custom-spot-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    const spot = cleanCustomSpotForStorage({
      id,
      name: $("spotNameInput")?.value || "未命名の釣り場",
      type: $("spotTypeInput")?.value || "池",
      area: $("spotAreaInput")?.value || "",
      memo: $("spotMemoInput")?.value || "",
      lat,
      lng,
      zoom: Math.max(Number(map?.getZoom?.() || 16), 13),
      createdAt: state.customSpots.find((item) => item.id === id)?.createdAt
    });
    const index = state.customSpots.findIndex((item) => item.id === id);
    if (index >= 0) state.customSpots[index] = spot;
    else state.customSpots.unshift(spot);
    saveCustomSpotsToStorage();
    rebuildSpotsFromState();
    render();
    closeSpotPanel();
    switchList("spots");
    showSpot(spot);
    const status = $("dataStatus");
    if (status) status.textContent = `釣り場「${spot.name}」を追加しました。`;
  }

  function deleteSelectedSpot() {
    const id = $("spotIdInput")?.value;
    if (!id) { closeSpotPanel(); return; }
    state.customSpots = state.customSpots.filter((spot) => spot.id !== id);
    saveCustomSpotsToStorage();
    rebuildSpotsFromState();
    render();
    closeSpotPanel();
    const status = $("dataStatus");
    if (status) status.textContent = "追加した釣り場を削除しました。";
  }

  function startAddSpotFromMapCenter() {
    const latlng = currentMapLatLng();
    openSpotPanel(latlng, {});
  }

  function closeCatchPanel() {
    setPanelOpen($("catchPanel"), false);
    state.catchMode = false;
    $("addCatchMode")?.classList.remove("is-active");
  }

  function clearFileInput(input) {
    try { if (input) input.value = ""; } catch (error) {}
  }

  function updateCatchPhotoPreview(dataUrl = state.pendingPhoto) {
    const preview = $("catchPhotoPreview");
    const image = $("catchPhotoImage");
    const src = safePhotoSrc(dataUrl);
    if (image) {
      if (src) image.src = src;
      else image.removeAttribute("src");
    }
    preview?.classList.toggle("is-hidden", !src);
  }

  function resetCatchPhotoSelection(message = "写真を選ぶと、この端末に圧縮保存します") {
    state.pendingPhoto = "";
    state.pendingPhotoPromise = null;
    clearFileInput($("catchPhoto"));
    clearFileInput($("catchCamera"));
    updateCatchPhotoPreview("");
    const status = $("catchPhotoStatus");
    if (status) status.textContent = message;
  }

  function compressImageFile(file, options = {}) {
    const maxDimension = options.maxDimension || 1280;
    const maxLength = options.maxLength || 520000;
    const initialQuality = options.initialQuality || 0.78;
    const minQuality = options.minQuality || 0.42;
    return new Promise((resolve, reject) => {
      if (!file || !String(file.type || "").startsWith("image/")) {
        reject(new Error("画像ファイルではありません"));
        return;
      }
      const objectUrl = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth || 1, image.naturalHeight || 1));
        const width = Math.max(1, Math.round((image.naturalWidth || 1) * scale));
        const height = Math.max(1, Math.round((image.naturalHeight || 1) * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(image, 0, 0, width, height);
        let quality = initialQuality;
        let dataUrl = canvas.toDataURL("image/jpeg", quality);
        while (dataUrl.length > maxLength && quality > minQuality) {
          quality = Math.max(minQuality, quality - 0.08);
          dataUrl = canvas.toDataURL("image/jpeg", quality);
          if (quality <= minQuality) break;
        }
        resolve(dataUrl);
      };
      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("画像を読み込めませんでした"));
      };
      image.src = objectUrl;
    });
  }

  function handleCatchPhoto(file) {
    const status = $("catchPhotoStatus");
    if (!file) {
      if (status) status.textContent = "写真が選択されていません。";
      return;
    }
    if (status) status.textContent = "写真を圧縮しています…";
    state.pendingPhotoPromise = compressImageFile(file)
      .then((dataUrl) => {
        state.pendingPhoto = dataUrl;
        updateCatchPhotoPreview(dataUrl);
        if (status) status.textContent = "写真を添付しました。保存すると記録に残ります。";
        return dataUrl;
      })
      .catch((error) => {
        console.warn("catch photo failed", error);
        state.pendingPhoto = "";
        updateCatchPhotoPreview("");
        if (status) status.textContent = "写真を読み込めませんでした。別の画像で試してください。";
        return "";
      });
  }

  function handleBackgroundFile(file) {
    const status = $("backgroundStatus");
    if (!file) {
      if (status) status.textContent = "画像が選択されていません。";
      return;
    }
    if (status) status.textContent = "背景画像を圧縮しています…";
    compressImageFile(file, { maxDimension: 1600, maxLength: 700000, initialQuality: 0.8 })
      .then((dataUrl) => {
        try { localStorage.setItem(BACKGROUND_STORAGE_KEY, dataUrl); } catch (error) {}
        applyMenuBackground(dataUrl);
        if (status) status.textContent = "メニュー背景を変更しました。";
      })
      .catch(() => { if (status) status.textContent = "背景画像を読み込めませんでした。"; });
  }


  const FRESHWATER_SPECIES = new Set("ブラックバス ブルーギル ナマズ ライギョ コイ フナ ヘラブナ スモールマウスバス ニゴイ ウグイ オイカワ カワムツ ハス モロコ タナゴ ワカサギ アユ アマゴ イワナ ニジマス ウナギ".split(" "));
  const SQUID_SPECIES = new Set("アオリイカ タコ テナガエビ".split(" "));
  const POPULAR_SPECIES = new Set("ブラックバス ブルーギル シーバス キス アジ メバル カサゴ チヌ マゴチ ヒラメ アオリイカ".split(" "));

  function speciesCategory(value) {
    const name = String(value || "").trim();
    if (SQUID_SPECIES.has(name)) return "squid";
    if (FRESHWATER_SPECIES.has(name)) return "freshwater";
    if (name === "その他") return "all";
    return "saltwater";
  }

  function speciesSearchValue(value) {
    return String(value || "").trim().toLowerCase().replace(/\s+/g, "");
  }

  function catchSpeciesInputs() {
    return Array.from(document.querySelectorAll("[data-catch-species-option]"));
  }

  function refreshSpeciesSelectionStatus() {
    const checked = catchSpeciesInputs().filter((input) => input.checked).map((input) => input.value);
    const status = $("speciesSearchStatus");
    const hidden = $("catchSpecies");
    if (hidden) hidden.value = checked.length ? [...new Set(checked)].join("、") : "";
    if (status) {
      const q = String(state.speciesSearch || "").trim();
      const visible = catchSpeciesInputs().filter((input) => !input.closest("label")?.classList.contains("is-hidden")).length;
      status.textContent = checked.length
        ? `選択中：${checked.join("、")}`
        : (q ? `検索「${q}」: ${visible}件` : `${visible}件表示。複数の魚種を選択できます。`);
    }
  }

  function prepareSpeciesChoices() {
    catchSpeciesInputs().forEach((input) => {
      const label = input.closest("label");
      const category = speciesCategory(input.value);
      input.dataset.speciesCategory = category;
      input.dataset.speciesPopular = String(POPULAR_SPECIES.has(input.value));
      if (label) {
        label.dataset.speciesCategory = category;
        label.dataset.speciesPopular = String(POPULAR_SPECIES.has(input.value));
        label.classList.toggle("is-selected", input.checked);
      }
    });
    applySpeciesFilter();
  }

  function applySpeciesFilter() {
    const filter = state.speciesCategoryFilter || "all";
    const q = speciesSearchValue(state.speciesSearch);
    document.querySelectorAll(".species-category-chip").forEach((button) => {
      button.classList.toggle("is-active", (button.dataset.speciesCategoryFilter || "all") === filter);
      button.setAttribute("aria-pressed", (button.dataset.speciesCategoryFilter || "all") === filter ? "true" : "false");
    });
    catchSpeciesInputs().forEach((input) => {
      const label = input.closest("label");
      if (!label) return;
      const category = input.dataset.speciesCategory || speciesCategory(input.value);
      const popular = input.dataset.speciesPopular === "true";
      const categoryOk = filter === "all" || (filter === "popular" ? popular : category === filter);
      const searchOk = !q || speciesSearchValue(input.value).includes(q);
      const visible = input.checked || (categoryOk && searchOk);
      label.classList.toggle("is-hidden", !visible);
      label.classList.toggle("is-selected", input.checked);
    });
    refreshSpeciesSelectionStatus();
  }

  function setRecordEntryMode(mode = "detail") {
    const next = ["super", "quick", "detail"].includes(mode) ? mode : "detail";
    state.recordEntryMode = next;
    const panel = $("catchPanel");
    if (panel) panel.dataset.recordEntryMode = next;
    document.querySelectorAll("[data-record-entry-mode]").forEach((button) => {
      const active = button.dataset.recordEntryMode === next;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    const hint = document.querySelector(".quick-record-hint");
    if (hint) {
      hint.textContent = next === "detail"
        ? "詳細入力では、魚種・ルアー・天気・風・水位・カバー・岩盤・沈み石などを選択できます。"
        : next === "quick"
          ? "かんたん記録では、よく使う項目を中心に入力できます。"
          : "超かんたんは、魚種・サイズ・写真・メモだけで素早く保存できます。";
    }
  }

  function setSelectOptions(selectId, values) {
    const select = $(selectId);
    if (!select) return;
    const current = select.value;
    const seen = new Set();
    select.innerHTML = "";
    values.forEach((value) => {
      if (seen.has(value)) return;
      seen.add(value);
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value || "選択してください";
      select.appendChild(option);
    });
    if ([...select.options].some((option) => option.value === current)) select.value = current;
  }

  function restoreFishingConditionOptions() {
    setSelectOptions("catchBait", ["", "ワーム", "ミノー", "クランクベイト", "スピナーベイト", "バイブレーション", "ラバージグ", "チャター", "ビッグベイト", "トップウォーター", "メタルジグ", "ジグヘッド", "エギ", "サビキ", "餌", "その他"]);
    setSelectOptions("catchWeather", ["", "晴れ", "曇り", "雨", "小雨", "雪", "強風", "無風", "ローライト", "晴れ時々曇り"]);
    setSelectOptions("catchWind", ["", "無風", "弱い", "普通", "強い", "向かい風", "追い風", "横風"]);
    setSelectOptions("catchWater", ["", "クリア", "普通", "濁り", "強い濁り", "ささ濁り", "増水", "減水", "流れあり", "流れ弱い"]);
    setSelectOptions("catchWaterLevel", ["", "満水", "普通", "減水", "大減水", "増水", "干潮", "満潮", "上げ潮", "下げ潮"]);
    setSelectOptions("catchBaitfish", ["", "ギル", "小魚", "ベイトフィッシュ", "イナッコ", "アユ", "ワカサギ", "エビ", "カニ", "虫", "カエル", "不明"]);
    setSelectOptions("catchCover", ["", "アシ", "オーバーハング", "沈み木", "レイダウン", "立木", "杭", "護岸", "ウィード", "ブレイク", "流れ込み", "堰堤", "シェード", "沈み石", "岩盤", "ゴロタ", "テトラ", "橋脚", "桟橋", "リップラップ", "岬", "ワンド", "馬の背", "ディープ", "シャロー", "砂地", "泥底", "その他"]);
    setSelectOptions("catchReaction", ["", "岸際", "カバー奥", "シェード", "ブレイク", "流れ込み", "堰堤", "岩盤際", "沈み石周り", "ウィード際", "橋脚周り", "明暗", "流れのヨレ", "表層", "中層", "ボトム", "沖", "足元", "その他"]);
    setSelectOptions("catchPressure", ["", "低い", "普通", "高い", "人多い", "先行者あり", "足跡あり", "船多い", "雨後", "平日", "休日"]);
    setSelectOptions("catchTimeBand", ["", "朝", "昼", "夕方", "夜", "夜明け前", "朝まずめ", "夕まずめ", "深夜"]);
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
    setRecordEntryMode(options.mode || "detail");
    prepareSpeciesChoices();
    resetCatchPhotoSelection();
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

  async function saveCatch(event) {
    event?.preventDefault?.();
    const lat = Number($("catchLat")?.value || currentMapLatLng().lat);
    const lng = Number($("catchLng")?.value || currentMapLatLng().lng);
    const id = $("catchIdInput")?.value || `record-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    if (state.pendingPhotoPromise) {
      const status = $("catchPhotoStatus") || $("dataStatus");
      if (status) status.textContent = "写真の処理完了を待っています…";
      await state.pendingPhotoPromise;
    }
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
      photo: state.pendingPhoto || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    const index = state.catches.findIndex((item) => item.id === id);
    if (index >= 0) state.catches[index] = record;
    else state.catches.unshift(record);
    if (record.recordType === "catch" && record.spotId) {
      const saved = spotState(record.spotId);
      saved.caught = true;
      if (record.species) saved.species = String(record.species || "").trim();
      persistSavedState();
    }
    let savedWithPhoto = true;
    try {
      localStorage.setItem(CATCH_STORAGE_KEY, JSON.stringify(state.catches));
    } catch (error) {
      savedWithPhoto = false;
      record.photo = "";
      try { localStorage.setItem(CATCH_STORAGE_KEY, JSON.stringify(state.catches)); } catch (error2) {}
    }
    resetCatchPhotoSelection();
    render();
    switchList("catches");
    closeCatchPanel();
    const status = $("dataStatus");
    if (status) status.textContent = savedWithPhoto ? "写真付きで記録を保存しました。釣果ピンと記録一覧を更新しました。" : "記録は保存しましたが、端末容量の都合で写真は保存できませんでした。";
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


  // v170: 爆釣にゃん師匠の吹き出し内「地図」ボタンなど、どこから押しても地図画面へ戻す共通処理。
  function openMapViewFromAnyButton(reason = "map-button") {
    try {
      const screen = $("appStartScreen");
      if (screen) {
        screen.classList.add("is-hidden", "is-closing");
        screen.setAttribute("aria-hidden", "true");
        screen.style.setProperty("display", "none", "important");
        screen.style.setProperty("pointer-events", "none", "important");
      }

      ["catchPanel", "spotPanel", "backgroundPanel", "installPanel", "infoPanel"].forEach((id) => {
        const panel = $(id);
        if (!panel) return;
        panel.classList.remove("is-open");
        panel.classList.add("is-hidden");
        panel.setAttribute("aria-hidden", "true");
        panel.style.removeProperty("display");
      });

      $("mobileMenu")?.classList.remove("is-open");
      $("menuBackdrop")?.classList.remove("is-open");
      $("menuToggle")?.setAttribute("aria-expanded", "false");
      $("addCatchMode")?.classList.remove("is-active");
      $("addSpotMode")?.classList.remove("is-active");
      try { map?.closePopup?.(); } catch (error) {}
      try { hideSpotCard?.(); } catch (error) {}

      state.catchMode = false;
      state.spotMode = false;
      state.positionAdjustSpotId = null;
      document.body.classList.remove(
        "start-screen-active",
        "start-screen-launching",
        "menu-open",
        "panel-open",
        "position-adjusting",
        "map-popup-open",
        "record-popup-open",
        "spot-card-open"
      );
      document.body.classList.add("start-screen-done");

      [40, 120, 300, 700].forEach((ms) => window.setTimeout(() => {
        try { map?.invalidateSize?.({ animate: false }); } catch (error) {}
        try { window.dispatchEvent(new Event("resize")); } catch (error) {}
      }, ms));

      const status = $("dataStatus");
      if (status) status.textContent = `${APP_STATUS_LABEL} / 地図画面を開きました。`;
      return true;
    } catch (error) {
      console.warn("open map view failed", error);
      return false;
    }
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
    document.querySelectorAll("[data-record-entry-mode]").forEach((button) => {
      button.addEventListener("click", () => setRecordEntryMode(button.dataset.recordEntryMode || "detail"));
    });
    document.querySelectorAll(".species-category-chip").forEach((button) => {
      button.addEventListener("click", () => {
        state.speciesCategoryFilter = button.dataset.speciesCategoryFilter || "all";
        applySpeciesFilter();
      });
    });
    $("catchSpeciesSearch")?.addEventListener("input", (event) => {
      state.speciesSearch = event.target.value || "";
      applySpeciesFilter();
    });
    document.querySelectorAll("[data-catch-species-option]").forEach((input) => input.addEventListener("change", () => { syncSpeciesHiddenFromChecks(); applySpeciesFilter(); }));
    $("catchPhoto")?.addEventListener("change", () => handleCatchPhoto($("catchPhoto")?.files?.[0]));
    $("catchCamera")?.addEventListener("change", () => handleCatchPhoto($("catchCamera")?.files?.[0]));
    $("removeCatchPhoto")?.addEventListener("click", () => resetCatchPhotoSelection("写真を外しました。"));
    $("changeBackgroundButton")?.addEventListener("click", () => setPanelOpen($("backgroundPanel"), true));
    $("closeBackgroundPanel")?.addEventListener("click", () => setPanelOpen($("backgroundPanel"), false));
    $("closeBackgroundDone")?.addEventListener("click", () => setPanelOpen($("backgroundPanel"), false));
    $("backgroundCamera")?.addEventListener("change", () => handleBackgroundFile($("backgroundCamera")?.files?.[0]));
    $("backgroundPicker")?.addEventListener("change", () => handleBackgroundFile($("backgroundPicker")?.files?.[0]));
    $("resetBackgroundButton")?.addEventListener("click", () => { try { localStorage.removeItem(BACKGROUND_STORAGE_KEY); } catch (error) {} applyMenuBackground(MENU_BACKGROUND_URL); const status = $("backgroundStatus"); if (status) status.textContent = "初期背景に戻しました。"; });
    $("catchForm")?.addEventListener("submit", saveCatch);
    $("closeCatchPanel")?.addEventListener("click", closeCatchPanel);
    $("deleteCatch")?.addEventListener("click", deleteSelectedCatch);
    $("useCurrentLocationButton")?.addEventListener("click", useCurrentLocationForCatch);
    $("spotForm")?.addEventListener("submit", saveSpot);
    $("closeSpotPanel")?.addEventListener("click", closeSpotPanel);
    $("deleteSpot")?.addEventListener("click", deleteSelectedSpot);
    $("addSpotMode")?.addEventListener("click", startAddSpotFromMapCenter);
    $("addCatchMode")?.addEventListener("click", () => openCatchPanel(currentMapLatLng(), { recordType: "catch", locationLabel: "地図中央の位置で釣果記録を作成します。" }));
    $("locateCatchButton")?.addEventListener("click", useCurrentLocationForCatch);
    window.addEventListener("resize", () => map?.invalidateSize?.({ animate: false }));
  }

  function installRecoveryStyles() {
    if (document.getElementById("v176SpeciesConditionFixStyle")) return;
    const style = document.createElement("style");
    style.id = "v176SpeciesConditionFixStyle";
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
      .record-photo-thumb { width: 64px; height: 64px; object-fit: cover; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,.18); align-self: center; }
      .popup-record-photo { display: block; width: 180px; max-width: 72vw; max-height: 180px; object-fit: cover; border-radius: 12px; margin: 0 0 8px; }
      .catch-photo-preview { margin: 8px 0 0; }
      .catch-photo-preview img { display: block; width: 100%; max-height: 260px; object-fit: contain; border-radius: 14px; background: #fff; }
      .catch-photo-preview.is-hidden { display: none !important; }
      .photo-picker input { display: block; width: 100%; margin-top: 6px; }
      .record-entry-mode-row, .species-category-row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin: 8px 0 12px; }
      .record-entry-mode-button, .species-category-chip { border: 0; border-radius: 999px; padding: 8px 11px; background: #edf4f0; color: #095a48; font-weight: 900; }
      .record-entry-mode-button.is-active, .species-category-chip.is-active { background: #0f7b63; color: #fff; }
      .quick-record-hint { font-size: .78rem; color: #54635e; line-height: 1.35; }
      .multi-choice-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(112px, 1fr)); gap: 8px; max-height: 240px; overflow: auto; padding: 8px; border-radius: 14px; background: #f8fbfa; }
      .multi-choice-grid label { display: flex; align-items: center; gap: 6px; min-height: 36px; padding: 7px 8px; border-radius: 999px; background: #fff; color: #073f33; border: 1px solid #dbe7e2; font-weight: 800; cursor: pointer; user-select: none; }
      .multi-choice-grid label.is-selected { background: #e6f4ef; color: #095a48; border-color: rgba(15,123,99,.35); box-shadow: inset 0 0 0 2px rgba(15,123,99,.12); }
      .multi-choice-grid label.is-hidden { display: none !important; }
      .multi-choice-grid input { width: auto; margin: 0; }
      .species-search-row { display: grid; gap: 5px; margin: 8px 0; }
      .species-search-status { color: #64736e; font-size: .78rem; }
      #catchPanel[data-record-entry-mode="super"] .super-record-hidden-field, #catchPanel[data-record-entry-mode="super"] .advanced-fishing-field { display: none !important; }
      #catchPanel[data-record-entry-mode="quick"] .advanced-fishing-field { display: none !important; }
      #catchPanel[data-record-entry-mode="detail"] .super-record-hidden-field, #catchPanel[data-record-entry-mode="detail"] .advanced-fishing-field { display: block !important; }
      #catchPanel[data-record-entry-mode="detail"] label.full-width.advanced-fishing-field, #catchPanel[data-record-entry-mode="detail"] label.full-width { grid-column: 1 / -1; }
      .spot-item { width: 100%; display: grid !important; grid-template-columns: minmax(0, 1fr) 44px 52px 44px 44px; gap: 6px; align-items: center; text-align: left; margin: 0 0 8px; padding: 10px 8px; border-radius: 16px; border: 1px solid rgba(255,255,255,.35); background: rgba(255,255,255,.92); color: #073f33; box-shadow: 0 8px 24px rgba(0,0,0,.08); }
      .spot-item.is-selected { outline: 3px solid rgba(255, 211, 95, .9); }
      .spot-focus-button { min-width: 0; border: 0; background: transparent; color: inherit; text-align: left; padding: 0; }
      .spot-focus-button strong { display: block; font-size: .95rem; line-height: 1.2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .spot-focus-button small { display: block; margin-top: 3px; color: #54635e; line-height: 1.25; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .spot-flag-label { display: grid; place-items: center; min-width: 0; }
      .spot-flag-label input { position: absolute; opacity: 0; pointer-events: none; }
      .spot-flag-label span, .spot-species-button { display: grid; place-items: center; width: 100%; min-height: 34px; border: 0; border-radius: 11px; padding: 3px 4px; background: #f1f5f3; color: #6f7d78; font-size: .62rem; font-weight: 900; line-height: 1.05; text-align: center; }
      .spot-species-button small { display: block; font-size: .52rem; opacity: .75; line-height: 1; }
      .spot-species-button strong { display: block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: .58rem; line-height: 1.05; }
      .spot-flag-label input:checked + span, .spot-species-button.on { background: #e6f4ef; color: #095a48; box-shadow: inset 0 0 0 2px rgba(15,123,99,.25); }
      .spot-check-card, .card-flags { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin: 10px 0; }
      .card-flag-label input { margin-right: 6px; }
      .card-flag-label, .card-species-button { border: 0; border-radius: 12px; padding: 9px 10px; background: #f1f5f3; color: #073f33; font-weight: 900; text-align: center; }
      .card-species-button.on, .card-flag-label:has(input:checked) { background: #e6f4ef; color: #095a48; }
      .card-species-button small { display: block; font-size: .72rem; opacity: .7; }
      .card-species-button strong { display: block; font-size: .88rem; }
      .spot-mode-button.is-active { background: #ff9b3f !important; color: #432500 !important; }
      .sidebar, #mobileMenu.sidebar { background: linear-gradient(180deg, rgba(5,30,25,.08), rgba(5,44,36,.02)), var(--menu-bg-image) !important; background-size: cover !important; background-position: center !important; background-repeat: no-repeat !important; }
    `;
    document.head.appendChild(style);
  }

  function init() {
    installRecoveryStyles();
    applyMenuBackground();
    setupStartScreen();
    loadState();
    restoreFishingConditionOptions();
    setRecordEntryMode("detail");
    prepareSpeciesChoices();
    bindEvents();
    initMap();
    render();
    switchList("spots");
    window.__MIE_OPEN_MAP_VIEW__ = openMapViewFromAnyButton;
    window.__MIE_APP_READY__ = true;
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
