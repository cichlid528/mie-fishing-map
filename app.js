(() => {
  "use strict";

  const APP_VERSION = "v66-visible-buttons";

  const STORAGE_KEY = "mie-bass-map-v1";
  const CATCH_STORAGE_KEY = "mie-bass-catches-v1";
  const CUSTOM_SPOT_STORAGE_KEY = "mie-bass-custom-spots-v1";
  const BACKGROUND_STORAGE_KEY = "mie-fishing-map-sidebar-background-v1";
  const POSITION_STORAGE_KEY = "mie-fishing-map-position-overrides-v66";
  const LEGACY_SINGLE_KEY = "mieFishingMap.v1";

  // v66: 国土地理院タイルの全画面マップに、見えるボタン色を強制指定。
  // Leafletは [緯度, 経度] の順番。三重県全体が自然に入る範囲へ初期表示する。
  const MIE_CENTER = [34.55, 136.48];
  const MIE_HOME_ZOOM = 9;
  const MIE_MIN_ZOOM = 8;
  const MIE_HOME_BOUNDS = [[33.72, 135.78], [35.30, 137.08]];
  const MIE_NAV_BOUNDS = [[33.50, 135.55], [35.52, 137.32]];

  const seedSpots = [
    { id: "ano-river", name: "安濃川", type: "川", area: "津市・芸濃町周辺", lat: 34.727056, lng: 136.515436, zoom: 13 },
    { id: "shidomo-river", name: "志登茂川", type: "川", area: "津市北部", lat: 34.766730, lng: 136.505533, zoom: 13 },
    { id: "iwata-river", name: "岩田川", type: "川", area: "津市中心部", lat: 34.713058, lng: 136.514262, zoom: 14 },
    { id: "kumozu-river", name: "雲出川", type: "川", area: "津市・松阪市", lat: 34.647855, lng: 136.523611, zoom: 12 },
    { id: "kushida-river", name: "櫛田川", type: "川", area: "松阪市・多気町", lat: 34.533946, lng: 136.579491, zoom: 12 },
    { id: "miya-river", name: "宮川", type: "川", area: "伊勢市・大台町", lat: 34.514956, lng: 136.702382, zoom: 11 },
    { id: "suzuka-river", name: "鈴鹿川", type: "川", area: "鈴鹿市・亀山市", lat: 34.894369, lng: 136.561703, zoom: 12 },
    { id: "machiya-river", name: "町屋川", type: "川", area: "四日市市・桑名市", lat: 35.0128, lng: 136.6610, zoom: 12 },
    { id: "ano-dam", name: "安濃ダム", type: "ダム", area: "津市芸濃町", lat: 34.807137, lng: 136.383074, zoom: 15 },
    { id: "kimigano-dam", name: "君ヶ野ダム", type: "ダム", area: "津市美杉町", lat: 34.597100, lng: 136.313183, zoom: 15 },
    { id: "misetani-dam", name: "三瀬谷ダム", type: "ダム", area: "多気郡大台町", lat: 34.3892, lng: 136.4011, zoom: 15 },
    { id: "miyagawa-dam", name: "宮川ダム", type: "ダム", area: "多気郡大台町", lat: 34.286385, lng: 136.193360, zoom: 14 },
    { id: "hachisu-dam", name: "蓮ダム", type: "ダム", area: "松阪市飯高町", lat: 34.379054, lng: 136.208732, zoom: 14 },
    { id: "hinachi-dam", name: "比奈知ダム", type: "ダム", area: "名張市", lat: 34.613780, lng: 136.155521, zoom: 15 },
    { id: "shorenji-dam", name: "青蓮寺ダム", type: "ダム", area: "名張市", lat: 34.604084, lng: 136.119925, zoom: 15 },
    { id: "isakadamu", name: "伊坂ダム", type: "ダム", area: "四日市市", lat: 35.0386, lng: 136.6186, zoom: 15 },
    { id: "shakujo-lake", name: "錫杖湖", type: "池", area: "津市芸濃町", lat: 34.806622, lng: 136.378553, zoom: 15, source: "国土地理院" },
    { id: "okukahada-lake", name: "奥香肌湖", type: "池", area: "松阪市飯高町", lat: 34.376861, lng: 136.196586, zoom: 14, source: "国土地理院" },
    { id: "shorenji-lake", name: "青蓮寺湖", type: "池", area: "名張市", lat: 34.600869, lng: 136.118850, zoom: 15, source: "国土地理院" },
    { id: "hinachi-lake", name: "ひなち湖", type: "池", area: "名張市", lat: 34.614467, lng: 136.164028, zoom: 15, source: "国土地理院" },
    { id: "nanairo-reservoir", name: "七色貯水池", type: "池", area: "熊野市・紀和町周辺", lat: 33.991304, lng: 136.004799, zoom: 14, source: "国土地理院" },
    { id: "isaka-reservoir", name: "伊坂貯水池", type: "池", area: "四日市市", lat: 35.041625, lng: 136.616311, zoom: 15, source: "国土地理院" },
    { id: "gokatsura-pond", name: "五桂池", type: "池", area: "多気町五桂", lat: 34.466625, lng: 136.545533, zoom: 15, source: "三重県ため池DB" },
    { id: "ishigaki-pond", name: "石垣池", type: "池", area: "鈴鹿市西玉垣町", lat: 34.856058, lng: 136.564767, zoom: 15, source: "三重県ため池DB" },
    { id: "official-pond-001", name: "なめり湖", type: "池", area: "松阪市嬉野森本町", lat: 34.585853, lng: 136.429147, zoom: 16, source: "三重県ため池DB" },
    { id: "official-pond-002", name: "真泥池", type: "池", area: "伊賀市真泥", lat: 34.761728, lng: 136.193772, zoom: 16, source: "三重県ため池DB" },
    { id: "official-pond-003", name: "滝谷池", type: "池", area: "伊賀市槇山", lat: 34.882522, lng: 136.115892, zoom: 16, source: "三重県ため池DB" },
    { id: "official-pond-004", name: "横山池", type: "池", area: "津市芸濃町椋本", lat: 34.815886, lng: 136.419051, zoom: 16, source: "三重県ため池DB" },
    { id: "official-pond-005", name: "風早池", type: "池", area: "津市戸木町", lat: 34.689244, lng: 136.453000, zoom: 16, source: "三重県ため池DB" },
    { id: "official-pond-006", name: "笠田大溜", type: "池", area: "いなべ市員弁町笠田新田", lat: 35.130256, lng: 136.559475, zoom: 16, source: "三重県ため池DB" },
    { id: "official-pond-007", name: "大正池", type: "池", area: "伊賀市丸柱", lat: 34.856969, lng: 136.135019, zoom: 16, source: "三重県ため池DB" },
    { id: "official-pond-008", name: "古田池", type: "池", area: "松阪市嬉野宮野町", lat: 34.612864, lng: 136.407917, zoom: 16, source: "三重県ため池DB" },
    { id: "official-pond-009", name: "津賀池", type: "池", area: "鈴鹿市津賀町", lat: 34.897558, lng: 136.508433, zoom: 16, source: "三重県ため池DB" },
    { id: "official-pond-010", name: "惣谷池", type: "池", area: "津市白山町上ﾉ村", lat: 34.677294, lng: 136.324125, zoom: 16, source: "三重県ため池DB" },
    { id: "official-pond-011", name: "牛尾崎池", type: "池", area: "度会郡玉城町上田辺", lat: 34.498581, lng: 136.620492, zoom: 16, source: "三重県ため池DB" },
    { id: "official-pond-012", name: "大杣池", type: "池", area: "伊賀市柘植町", lat: 34.843558, lng: 136.283369, zoom: 16, source: "三重県ため池DB" },
    { id: "official-pond-013", name: "鴉山池", type: "池", area: "伊賀市柘植町", lat: 34.842808, lng: 136.274119, zoom: 16, source: "三重県ため池DB" },
    { id: "official-pond-014", name: "七郷池", type: "池", area: "津市安濃町草生", lat: 34.752133, lng: 136.415111, zoom: 16, source: "三重県ため池DB" },
    { id: "official-pond-015", name: "高束池", type: "池", area: "松阪市飯南町粥見", lat: 34.444714, lng: 136.366378, zoom: 16, source: "三重県ため池DB" },
    { id: "official-pond-016", name: "汁谷池", type: "池", area: "度会郡玉城町宮古", lat: 34.458917, lng: 136.628175, zoom: 16, source: "三重県ため池DB" },
    { id: "official-pond-017", name: "竹谷池", type: "池", area: "伊賀市柘植町", lat: 34.834647, lng: 136.261289, zoom: 16, source: "三重県ため池DB" },
    { id: "official-pond-018", name: "両ヶ池", type: "池", area: "いなべ市大安町平塚", lat: 35.103506, lng: 136.526503, zoom: 16, source: "三重県ため池DB" },
    { id: "official-pond-019", name: "山田池", type: "池", area: "津市森町北谷", lat: 34.686578, lng: 136.422500, zoom: 16, source: "三重県ため池DB" },
    { id: "official-pond-020", name: "嘉古部池", type: "池", area: "津市美里町三郷", lat: 34.729759, lng: 136.393052, zoom: 16, source: "三重県ため池DB" },
    { id: "nanairo-dam", name: "七色ダム", type: "ダム", area: "熊野市・紀和町周辺", lat: 33.962596, lng: 136.002566, zoom: 14 },
    { id: "port-yokkaichi", name: "四日市港", type: "港", area: "四日市市", lat: 34.9577, lng: 136.6421, zoom: 15 },
    { id: "port-shiroko", name: "白子漁港", type: "港", area: "鈴鹿市白子", lat: 34.8288, lng: 136.6048, zoom: 17 },
    { id: "port-tsu", name: "津港", type: "港", area: "津市なぎさまち周辺", lat: 34.7276, lng: 136.5311, zoom: 16 },
    { id: "port-matsusaka", name: "松阪港", type: "港", area: "松阪市大口町周辺", lat: 34.5987, lng: 136.5829, zoom: 16 },
    { id: "port-toba", name: "鳥羽港", type: "港", area: "鳥羽市鳥羽", lat: 34.4868, lng: 136.8462, zoom: 16 },
    { id: "port-owase", name: "尾鷲港", type: "港", area: "尾鷲市", lat: 34.0713, lng: 136.2025, zoom: 16 },
    { id: "marina-kawage", name: "マリーナ河芸", type: "マリーナ", area: "津市河芸町東千里", lat: 34.798339, lng: 136.562838, zoom: 18 },
    { id: "marina-tsu-yacht", name: "津ヨットハーバー", type: "マリーナ", area: "津市津興", lat: 34.708344, lng: 136.524048, zoom: 17 },
    { id: "marina-toba", name: "鳥羽マリーナ", type: "マリーナ", area: "鳥羽市千賀町", lat: 34.388732, lng: 136.880716, zoom: 17 }
  ];

  const $ = (id) => document.getElementById(id);
  const els = {};
  const state = {
    spots: [],
    savedState: {},
    catches: [],
    customSpots: [],
    positionOverrides: {},
    selectedSpotId: null,
    activeFilter: "all",
    activeList: "spots",
    search: "",
    spotMode: false,
    catchMode: false,
    pendingPhoto: "",
    deferredInstallPrompt: null
  };

  let map;
  let markers = new Map();
  let catchMarkers = new Map();
  let currentLocationMarker = null;
  let accuracyCircle = null;

  function safeParse(value, fallback) {
    try { return JSON.parse(value || "") || fallback; } catch { return fallback; }
  }

  function saveJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function uid(prefix = "id") {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function nowLocalInputValue() {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  }

  function timeBandFromInput(value) {
    const hour = Number(String(value || "").slice(11, 13));
    if (!Number.isFinite(hour)) return "";
    if (hour >= 4 && hour < 10) return "朝";
    if (hour >= 10 && hour < 15) return "昼";
    if (hour >= 15 && hour < 19) return "夕方";
    return "夜";
  }

  function normalizeSavedSpotState(raw = {}) {
    return {
      caught: Boolean(raw.caught ?? raw.hasCatch ?? raw.checked),
      species: raw.species || raw.fish || raw.fishSpecies || "",
      noFishing: Boolean(raw.noFishing ?? raw.prohibited ?? raw.banned),
      parking: Boolean(raw.parking ?? raw.hasParking),
      memo: raw.memo || ""
    };
  }

  function normalizeRecord(raw = {}) {
    const recordType = raw.recordType || raw.type || (raw.species || raw.size || raw.sizeCm || raw.bait || raw.lureName ? "catch" : "note");
    return {
      id: raw.id || uid("record"),
      recordType,
      placeKind: raw.placeKind || raw.kind || "",
      placeName: raw.placeName || raw.title || raw.name || "",
      spotId: raw.spotId || "",
      time: raw.time || raw.datetime || nowLocalInputValue(),
      lat: Number(raw.lat),
      lng: Number(raw.lng),
      species: raw.species || "ブラックバス",
      bait: raw.bait || raw.lureCategory || raw.lure || "",
      lureName: raw.lureName || "",
      lureColor: raw.lureColor || raw.color || "",
      lureWeight: raw.lureWeight || raw.weight || "",
      weather: raw.weather || "",
      wind: raw.wind || "",
      water: raw.water || "",
      waterLevel: raw.waterLevel || "",
      baitfish: raw.baitfish || raw.baitFish || raw.baitCheck || "",
      cover: raw.cover || "",
      reaction: raw.reaction || raw.hitArea || raw.reactionPlace || "",
      pressure: raw.pressure || "",
      timeBand: raw.timeBand || timeBandFromInput(raw.time || raw.datetime),
      size: raw.size || raw.sizeClass || "",
      sizeCm: raw.sizeCm || raw.actualSizeCm || "",
      memo: raw.memo || raw.note || "",
      photo: raw.photo || raw.photoData || raw.image || "",
      createdAt: raw.createdAt || new Date().toISOString(),
      updatedAt: raw.updatedAt || raw.createdAt || new Date().toISOString()
    };
  }

  function validPosition(value) {
    return value && Number.isFinite(Number(value.lat)) && Number.isFinite(Number(value.lng));
  }

  function isWithinMieBounds(value) {
    if (!validPosition(value)) return false;
    const lat = Number(value.lat);
    const lng = Number(value.lng);
    return lat >= 33.6 && lat <= 35.4 && lng >= 135.7 && lng <= 137.2;
  }

  function isSafePositionOverride(spot, override) {
    if (!isWithinMieBounds(override)) return false;
    const latDiff = Math.abs(Number(override.lat) - Number(spot.lat));
    const lngDiff = Math.abs(Number(override.lng) - Number(spot.lng));
    return Math.hypot(latDiff, lngDiff) <= 0.08;
  }

  function applyPositionOverride(spot) {
    const override = state.positionOverrides[spot.id];
    if (!isSafePositionOverride(spot, override)) return spot;
    return { ...spot, lat: Number(override.lat), lng: Number(override.lng), positionAdjusted: true };
  }

  function loadState() {
    state.savedState = safeParse(localStorage.getItem(STORAGE_KEY), {});
    Object.keys(state.savedState).forEach((id) => {
      state.savedState[id] = normalizeSavedSpotState(state.savedState[id]);
    });

    state.customSpots = safeParse(localStorage.getItem(CUSTOM_SPOT_STORAGE_KEY), []);
    state.catches = safeParse(localStorage.getItem(CATCH_STORAGE_KEY), []).map(normalizeRecord);
    state.positionOverrides = safeParse(localStorage.getItem(POSITION_STORAGE_KEY), {});

    const legacy = safeParse(localStorage.getItem(LEGACY_SINGLE_KEY), null);
    if (legacy && state.customSpots.length === 0 && Array.isArray(legacy.spots)) {
      state.customSpots = legacy.spots.map((spot) => ({
        ...spot,
        id: spot.id || uid("spot"),
        type: spot.type || "池",
        custom: true,
        lat: Number(spot.lat),
        lng: Number(spot.lng)
      })).filter(validPosition);
      saveJson(CUSTOM_SPOT_STORAGE_KEY, state.customSpots);
    }
    if (legacy && state.catches.length === 0 && Array.isArray(legacy.records)) {
      state.catches = legacy.records.map(normalizeRecord).filter((r) => validPosition(r));
      saveJson(CATCH_STORAGE_KEY, state.catches);
    }

    state.spots = [...seedSpots.map(applyPositionOverride), ...state.customSpots.map((s) => ({ ...s, custom: true }))];
  }

  function persistSavedState() { saveJson(STORAGE_KEY, state.savedState); }
  function persistCustomSpots() {
    state.customSpots = state.spots.filter((s) => s.custom).map(({ positionAdjusted, ...spot }) => spot);
    saveJson(CUSTOM_SPOT_STORAGE_KEY, state.customSpots);
  }
  function persistCatches() { saveJson(CATCH_STORAGE_KEY, state.catches); }

  function initEls() {
    [
      "searchInput", "visibleCount", "spotList", "catchList", "spotListHead", "catchListHead", "spotTab", "catchTab",
      "spotCount", "recordCount", "bigBassCount", "dataStatus", "spotCard", "mobileMenu", "menuToggle", "menuBackdrop", "closeMenuButton",
      "resetView", "locateCatchButton", "addSpotMode", "addCatchMode", "spotPanel", "spotForm", "spotLat", "spotLng", "spotIdInput",
      "spotNameInput", "spotTypeInput", "spotAreaInput", "spotMemoInput", "deleteSpot", "closeSpotPanel",
      "catchPanel", "catchForm", "catchLat", "catchLng", "catchIdInput", "catchLocationStatus", "useCurrentLocationButton",
      "catchRecordType", "catchPlaceKind", "catchPlaceName", "catchSpot", "catchTime", "catchSpecies", "catchBait", "catchLureName",
      "catchLureColor", "catchLureWeight", "catchSizeCm", "catchSize", "catchWeather", "catchWind", "catchWater", "catchWaterLevel",
      "catchBaitfish", "catchCover", "catchReaction", "catchPressure", "catchTimeBand", "catchMemo", "catchPhoto", "catchCamera",
      "catchPhotoPreview", "catchPhotoImage", "removeCatchPhoto", "catchPhotoStatus", "deleteCatch", "closeCatchPanel",
      "changeBackgroundButton", "backgroundPanel", "backgroundCamera", "backgroundPicker", "backgroundStatus", "resetBackgroundButton", "closeBackgroundPanel", "closeBackgroundDone",
      "openInfoPanel", "infoPanel", "closeInfoPanel", "closeInfoDone", "backupStatus", "exportDataButton", "importDataFile",
      "installAppButton", "installPanel", "installStatus", "closeInstallPanel", "closeInstallDone"
    ].forEach((id) => { els[id] = $(id); });
    els.filterButtons = [...document.querySelectorAll(".filter-chip")];
    els.fishingFields = [...document.querySelectorAll(".fishing-field")];
  }

  function invalidateMapSize(delay = 0) {
    if (!map) return;
    window.setTimeout(() => {
      try { map.invalidateSize({ animate: false }); } catch (error) {}
    }, delay);
  }

  function getMieHomeBounds() {
    return L.latLngBounds(MIE_HOME_BOUNDS);
  }

  function getMieNavBounds() {
    return L.latLngBounds(MIE_NAV_BOUNDS);
  }

  function isInsideMieNavBounds(lat, lng) {
    if (typeof L === "undefined") return true;
    return getMieNavBounds().contains(L.latLng(Number(lat), Number(lng)));
  }

  function lockMieView() {
    if (!map || typeof L === "undefined") return;
    const navBounds = getMieNavBounds();
    map.setMaxBounds(navBounds);
    map.setMinZoom(MIE_MIN_ZOOM);
    if (map.getZoom() < MIE_MIN_ZOOM) map.setZoom(MIE_MIN_ZOOM, { animate: false });
    if (!navBounds.contains(map.getCenter())) {
      resetMieView();
    }
  }

  function resetMieView() {
    if (!map || typeof L === "undefined") return;
    map.fitBounds(getMieHomeBounds(), { padding: [8, 8], animate: false });
    if (map.getZoom() < MIE_MIN_ZOOM) map.setZoom(MIE_MIN_ZOOM, { animate: false });
    map.panInsideBounds(getMieNavBounds(), { animate: false });
  }

  function addMieBoundaryLayer() {
    // v66: 国土地理院タイルをそのまま表示し、県境線やラベルは追加しない。
  }


  function forceFullscreenLayout() {
    const root = document.querySelector(".app-shell");
    const pane = document.querySelector(".map-pane");
    const mapElement = document.getElementById("map");
    [document.documentElement, document.body, root, pane, mapElement].forEach((el) => {
      if (!el) return;
      el.style.setProperty("width", "100vw", "important");
      el.style.setProperty("height", "100dvh", "important");
      el.style.setProperty("margin", "0", "important");
      el.style.setProperty("padding", "0", "important");
    });
    if (pane) {
      pane.style.setProperty("position", "fixed", "important");
      pane.style.setProperty("inset", "0", "important");
    }
    if (mapElement) {
      mapElement.style.setProperty("position", "absolute", "important");
      mapElement.style.setProperty("inset", "0", "important");
    }
    invalidateMapSize(0);
    invalidateMapSize(250);
  }

  function initMap() {
    const mapElement = document.getElementById("map");
    if (!mapElement || typeof L === "undefined") {
      if (els.dataStatus) els.dataStatus.textContent = "地図ライブラリを読み込めませんでした。通信状態を確認して再読み込みしてください。";
      return;
    }

    if (map) {
      try { map.remove(); } catch (error) {}
    }

    const navBounds = getMieNavBounds();
    map = L.map("map", {
      zoomControl: true,
      preferCanvas: true,
      zoomAnimation: false,
      fadeAnimation: false,
      markerZoomAnimation: false,
      minZoom: MIE_MIN_ZOOM,
      maxBounds: navBounds,
      maxBoundsViscosity: 0.9,
      worldCopyJump: false,
      bounceAtZoomLimits: false
    }).setView(MIE_CENTER, MIE_HOME_ZOOM);
    map.attributionControl.setPosition("topright");

    const tileOptions = {
      maxZoom: 18,
      noWrap: true,
      keepBuffer: 2,
      updateWhenIdle: true,
      updateWhenZooming: false,
      attribution: '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noopener">国土地理院</a>'
    };

    const standardMap = L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png", tileOptions).addTo(map);
    standardMap.once("load", () => invalidateMapSize(100));
    const paleMap = L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png", tileOptions);
    const aerialMap = L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg", tileOptions);
    const hillshadeMap = L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/hillshademap/{z}/{x}/{y}.png", {
      ...tileOptions,
      opacity: 0.30
    }).addTo(map);

    L.control.layers(
      {
        "標準地図（国土地理院）": standardMap,
        "淡色地図（国土地理院）": paleMap,
        "航空写真（国土地理院）": aerialMap
      },
      { "陰影起伏図を重ねる": hillshadeMap },
      { position: "topright" }
    ).addTo(map);
    map.attributionControl.addAttribution("国土地理院ライブタイル");
    addMieBoundaryLayer();
    map.on("moveend", lockMieView);
    map.on("click", (event) => handleMapClick(event.latlng));

    map.whenReady(() => { resetMieView(); invalidateMapSize(100); });
    invalidateMapSize(0);
    invalidateMapSize(250);
    invalidateMapSize(800);
    window.addEventListener("resize", () => { invalidateMapSize(120); window.setTimeout(lockMieView, 180); });
    window.addEventListener("orientationchange", () => { invalidateMapSize(450); window.setTimeout(lockMieView, 520); });
    document.addEventListener("visibilitychange", () => { if (!document.hidden) { invalidateMapSize(200); window.setTimeout(lockMieView, 260); } });
  }

  function markerClass(type) {
    if (type === "川") return "river";
    if (type === "ダム") return "dam";
    if (type === "港") return "port";
    if (type === "マリーナ") return "marina";
    return "pond";
  }

  function markerLabel(type) {
    if (type === "川") return "川";
    if (type === "ダム") return "堰";
    if (type === "港") return "港";
    if (type === "マリーナ") return "船";
    return "池";
  }

  function makeSpotIcon(spot) {
    return L.divIcon({
      className: "",
      html: `<div class="custom-marker ${markerClass(spot.type)}">${markerLabel(spot.type)}</div>`,
      iconSize: [30, 30], iconAnchor: [15, 15], popupAnchor: [0, -14]
    });
  }

  function makeRecordIcon(record, index) {
    const note = record.recordType === "note";
    return L.divIcon({
      className: "",
      html: note ? '<div class="place-record-marker"><span>メ</span></div>' : `<div class="catch-marker"><span>${index + 1}</span></div>`,
      iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -28]
    });
  }

  function makeCurrentLocationIcon() {
    return L.divIcon({ className: "", html: '<div class="current-location-marker"><span></span></div>', iconSize: [28, 28], iconAnchor: [14, 14] });
  }

  function setSpotMode(value) {
    state.spotMode = Boolean(value);
    if (state.spotMode) state.catchMode = false;
    els.addSpotMode.classList.toggle("is-active", state.spotMode);
    els.addCatchMode.classList.toggle("is-active", state.catchMode);
    els.dataStatus.textContent = state.spotMode ? "地図をタップして釣り場を追加します。" : "v66・ボタン視認性修正";
  }

  function setCatchMode(value) {
    state.catchMode = Boolean(value);
    if (state.catchMode) state.spotMode = false;
    els.addSpotMode.classList.toggle("is-active", state.spotMode);
    els.addCatchMode.classList.toggle("is-active", state.catchMode);
    els.dataStatus.textContent = state.catchMode ? "地図をタップして記録ピンを追加します。" : "v66・ボタン視認性修正";
  }

  function handleMapClick(latlng) {
    if (state.spotMode) {
      openSpotPanel(null, latlng);
      setSpotMode(false);
      closeMobileMenu();
      return;
    }
    if (state.catchMode) {
      openCatchPanel(null, latlng, { recordType: "catch" });
      setCatchMode(false);
      closeMobileMenu();
    }
  }

  function spotState(id) {
    if (!state.savedState[id]) state.savedState[id] = normalizeSavedSpotState({});
    return state.savedState[id];
  }

  function isBigBass(record) {
    if (record.recordType !== "catch") return false;
    const species = String(record.species || "");
    const bassLike = !species || /バス|ブラックバス|スモールマウス/u.test(species);
    if (!bassLike) return false;
    const cm = Number(record.sizeCm);
    return (Number.isFinite(cm) && cm >= 40) || /40cm台|50cm以上/u.test(String(record.size || ""));
  }

  function filteredSpots() {
    const q = state.search.trim().toLowerCase();
    return state.spots.filter((spot) => {
      const typeOk = state.activeFilter === "all" || spot.type === state.activeFilter;
      const s = spotState(spot.id);
      const text = [spot.name, spot.area, spot.memo, spot.type, s.species, s.memo].join(" ").toLowerCase();
      return typeOk && (!q || text.includes(q));
    });
  }

  function filteredRecords() {
    const q = state.search.trim().toLowerCase();
    return state.catches.filter((record) => {
      const spot = state.spots.find((s) => s.id === record.spotId);
      const text = [
        record.placeName, record.placeKind, record.species, record.bait, record.lureName, record.lureColor, record.lureWeight,
        record.weather, record.wind, record.water, record.waterLevel, record.baitfish, record.cover, record.reaction, record.pressure,
        record.timeBand, record.size, record.sizeCm, record.memo, spot?.name, spot?.area
      ].join(" ").toLowerCase();
      return !q || text.includes(q);
    });
  }

  function render() {
    populateCatchSpots();
    renderStats();
    renderLists();
    renderSpotMarkers();
    renderCatchMarkers();
  }

  function renderStats() {
    els.spotCount.textContent = String(state.spots.length);
    els.recordCount.textContent = String(state.catches.length);
    els.bigBassCount.textContent = String(state.catches.filter(isBigBass).length);
  }

  function renderLists() {
    const spotActive = state.activeList === "spots";
    els.spotList.classList.toggle("is-hidden", !spotActive);
    els.spotListHead.classList.toggle("is-hidden", !spotActive);
    els.catchList.classList.toggle("is-hidden", spotActive);
    els.catchListHead.classList.toggle("is-hidden", spotActive);
    els.spotTab.classList.toggle("is-active", spotActive);
    els.catchTab.classList.toggle("is-active", !spotActive);
    els.spotTab.setAttribute("aria-selected", String(spotActive));
    els.catchTab.setAttribute("aria-selected", String(!spotActive));
    renderSpotList();
    renderCatchList();
  }

  function renderSpotList() {
    const list = filteredSpots();
    els.visibleCount.textContent = `${list.length}件`;
    els.spotList.innerHTML = list.length ? list.map((spot) => {
      const s = spotState(spot.id);
      return `<button class="spot-item ${spot.id === state.selectedSpotId ? "is-selected" : ""}" type="button" data-spot-id="${escapeHtml(spot.id)}">
        <span class="spot-main"><strong>${escapeHtml(spot.name)}</strong><small>${escapeHtml(spot.type)} / ${escapeHtml(spot.area || "地名未設定")}</small></span>
        <span class="flag ${s.caught ? "on" : ""}">${s.caught ? "✓" : "—"}</span>
        <span class="flag ${s.species ? "on" : ""}">${s.species ? "有" : "—"}</span>
        <span class="flag ${s.noFishing ? "warn" : ""}">${s.noFishing ? "禁" : "—"}</span>
        <span class="flag ${s.parking ? "on" : ""}">${s.parking ? "P" : "—"}</span>
      </button>`;
    }).join("") : '<p class="empty">該当する釣り場がありません。</p>';
  }

  function recordTitle(record, index) {
    if (record.recordType === "note") return record.placeName || record.placeKind || `現地メモ ${index + 1}`;
    const size = record.sizeCm ? `${record.sizeCm}cm` : record.size || "サイズ未記録";
    const lure = record.lureName || record.bait || "ルアー未記録";
    return `${record.species || "釣果"} ${size} / ${lure}`;
  }

  function renderCatchList() {
    const list = filteredRecords();
    els.visibleCount.textContent = `${list.length}件`;
    els.catchList.innerHTML = list.length ? list.map((record, index) => {
      const spot = state.spots.find((s) => s.id === record.spotId);
      const title = recordTitle(record, index);
      const tags = [record.waterLevel, record.baitfish, record.cover, record.reaction, record.pressure, record.timeBand, record.lureColor, record.lureWeight]
        .filter(Boolean).slice(0, 8);
      return `<button class="catch-item" type="button" data-record-id="${escapeHtml(record.id)}">
        <span class="catch-num ${record.recordType === "note" ? "note" : ""}">${record.recordType === "note" ? "メ" : index + 1}</span>
        <span class="catch-main"><strong>${escapeHtml(title)}${isBigBass(record) ? '<span class="big-bass-badge">40up</span>' : ""}</strong>
        <small>${escapeHtml(spot?.name || "釣り場未設定")} / ${escapeHtml(formatDateTime(record.time))}</small>
        ${tags.length ? `<span class="record-tags">${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</span>` : ""}</span>
      </button>`;
    }).join("") : '<p class="empty">記録がありません。</p>';
  }

  function renderSpotMarkers() {
    if (!map || typeof L === "undefined") return;
    const ids = new Set(state.spots.map((spot) => spot.id));
    markers.forEach((marker, id) => { if (!ids.has(id)) { marker.remove(); markers.delete(id); } });
    state.spots.forEach((spot) => {
      const latlng = [Number(spot.lat), Number(spot.lng)];
      if (!validPosition({ lat: latlng[0], lng: latlng[1] })) return;
      if (markers.has(spot.id)) {
        markers.get(spot.id).setLatLng(latlng).setIcon(makeSpotIcon(spot));
        return;
      }
      const marker = L.marker(latlng, { icon: makeSpotIcon(spot) }).addTo(map);
      marker.bindPopup(`<strong>${escapeHtml(spot.name)}</strong><br>${escapeHtml(spot.type)} / ${escapeHtml(spot.area || "")}`);
      marker.on("click", () => selectSpot(spot.id));
      markers.set(spot.id, marker);
    });
  }

  function renderCatchMarkers() {
    if (!map || typeof L === "undefined") return;
    catchMarkers.forEach((marker) => marker.remove());
    catchMarkers = new Map();
    state.catches.forEach((record, index) => {
      if (!validPosition(record)) return;
      const marker = L.marker([Number(record.lat), Number(record.lng)], { icon: makeRecordIcon(record, index), zIndexOffset: 700 }).addTo(map);
      marker.bindPopup(`<strong>${escapeHtml(recordTitle(record, index))}</strong><br>${escapeHtml(record.memo || "")}`);
      marker.on("click", () => openCatchPanel(record.id));
      catchMarkers.set(record.id, marker);
    });
  }

  function formatDateTime(value) {
    if (!value) return "日時未設定";
    return String(value).replace("T", " ");
  }

  function selectSpot(id) {
    const spot = state.spots.find((s) => s.id === id);
    if (!spot) return;
    state.selectedSpotId = id;
    if (isInsideMieNavBounds(spot.lat, spot.lng)) {
      map.setView([Number(spot.lat), Number(spot.lng)], Math.max(map.getZoom(), spot.zoom || 15));
    } else {
      els.dataStatus.textContent = "三重県範囲外の座標なので、地図は三重県表示のままにしました。";
      resetMieView();
    }
    const marker = markers.get(id);
    if (marker) marker.openPopup();
    showSpotCard(spot);
    renderSpotList();
    closeMobileMenu();
  }

  function showSpotCard(spot) {
    const s = spotState(spot.id);
    const recordCount = state.catches.filter((r) => r.spotId === spot.id).length;
    els.spotCard.innerHTML = `<h2>${escapeHtml(spot.name)}</h2>
      <p><strong>${escapeHtml(spot.type)}</strong> / ${escapeHtml(spot.area || "地名未設定")}</p>
      ${spot.memo ? `<p>${escapeHtml(spot.memo)}</p>` : ""}
      <p class="catch-photo-status">記録 ${recordCount}件 / ${Number(spot.lat).toFixed(6)}, ${Number(spot.lng).toFixed(6)}</p>
      <div class="card-flags">
        <label><input type="checkbox" data-flag="caught" ${s.caught ? "checked" : ""}>釣れた</label>
        <label><input type="checkbox" data-flag="noFishing" ${s.noFishing ? "checked" : ""}>禁止/注意</label>
        <label><input type="checkbox" data-flag="parking" ${s.parking ? "checked" : ""}>駐車</label>
      </div>
      <div class="card-actions">
        <button type="button" data-action="species">魚種: ${escapeHtml(s.species || "未設定")}</button>
        <button type="button" data-action="record">ここで記録</button>
        ${spot.custom ? '<button type="button" data-action="edit">編集</button><button class="danger" type="button" data-action="delete">削除</button>' : ""}
        <button type="button" data-action="close">閉じる</button>
      </div>`;
    els.spotCard.classList.remove("is-hidden");
  }

  function hideSpotCard() {
    els.spotCard.classList.add("is-hidden");
    els.spotCard.innerHTML = "";
  }

  function nearestSpotId(lat, lng) {
    let best = "";
    let bestDistance = Infinity;
    state.spots.forEach((spot) => {
      const d = Math.hypot(Number(spot.lat) - Number(lat), Number(spot.lng) - Number(lng));
      if (d < bestDistance) { best = spot.id; bestDistance = d; }
    });
    return best;
  }

  function openPanel(panel) { panel.classList.add("is-open"); panel.setAttribute("aria-hidden", "false"); }
  function closePanel(panel) { panel.classList.remove("is-open"); panel.setAttribute("aria-hidden", "true"); }

  function openSpotPanel(id = null, latlng = null) {
    const spot = id ? state.spots.find((s) => s.id === id) : null;
    els.spotIdInput.value = spot?.id || "";
    els.spotNameInput.value = spot?.name || "";
    els.spotTypeInput.value = spot?.type || "池";
    els.spotAreaInput.value = spot?.area || "";
    els.spotMemoInput.value = spot?.memo || "";
    els.spotLat.value = spot?.lat ?? latlng?.lat ?? "";
    els.spotLng.value = spot?.lng ?? latlng?.lng ?? "";
    els.deleteSpot.classList.toggle("is-hidden", !spot?.custom);
    openPanel(els.spotPanel);
  }

  function closeSpotPanel() { closePanel(els.spotPanel); els.spotForm.reset(); }

  function openCatchPanel(id = null, latlng = null, options = {}) {
    const record = id ? state.catches.find((r) => r.id === id) : null;
    const lat = record?.lat ?? latlng?.lat ?? "";
    const lng = record?.lng ?? latlng?.lng ?? "";
    els.catchIdInput.value = record?.id || "";
    els.catchLat.value = lat;
    els.catchLng.value = lng;
    els.catchRecordType.value = record?.recordType || options.recordType || "note";
    els.catchPlaceKind.value = record?.placeKind || "";
    els.catchPlaceName.value = record?.placeName || "";
    els.catchSpot.value = record?.spotId || (validPosition({ lat, lng }) ? nearestSpotId(lat, lng) : "");
    els.catchTime.value = record?.time || nowLocalInputValue();
    els.catchSpecies.value = record?.species || "ブラックバス";
    els.catchBait.value = record?.bait || "";
    els.catchLureName.value = record?.lureName || "";
    els.catchLureColor.value = record?.lureColor || "";
    els.catchLureWeight.value = record?.lureWeight || "";
    els.catchSizeCm.value = record?.sizeCm || "";
    els.catchSize.value = record?.size || "";
    els.catchWeather.value = record?.weather || "";
    els.catchWind.value = record?.wind || "";
    els.catchWater.value = record?.water || "";
    els.catchWaterLevel.value = record?.waterLevel || "";
    els.catchBaitfish.value = record?.baitfish || "";
    els.catchCover.value = record?.cover || "";
    els.catchReaction.value = record?.reaction || "";
    els.catchPressure.value = record?.pressure || "";
    els.catchTimeBand.value = record?.timeBand || timeBandFromInput(els.catchTime.value);
    els.catchMemo.value = record?.memo || "";
    state.pendingPhoto = record?.photo || "";
    updatePhotoPreview();
    updateRecordTypeUI();
    setCatchLocationStatus(lat, lng);
    els.deleteCatch.classList.toggle("is-hidden", !record);
    openPanel(els.catchPanel);
  }

  function closeCatchPanel() {
    closePanel(els.catchPanel);
    els.catchForm.reset();
    state.pendingPhoto = "";
    updatePhotoPreview();
  }

  function setCatchLocationStatus(lat, lng, source = "記録位置", accuracy = null) {
    const nLat = Number(lat), nLng = Number(lng);
    if (!validPosition({ lat: nLat, lng: nLng })) {
      els.catchLocationStatus.textContent = "地図をタップするか、現在地ボタンで記録位置を指定してください。";
      return;
    }
    const acc = Number.isFinite(Number(accuracy)) ? ` / 誤差約${Math.round(Number(accuracy))}m` : "";
    els.catchLocationStatus.textContent = `${source}: ${nLat.toFixed(6)}, ${nLng.toFixed(6)}${acc}`;
  }

  function updateRecordTypeUI() {
    const isCatch = els.catchRecordType.value === "catch";
    els.fishingFields.forEach((field) => field.classList.toggle("is-hidden", !isCatch));
  }

  function populateCatchSpots() {
    const current = els.catchSpot.value;
    els.catchSpot.innerHTML = '<option value="">選択してください</option>' + state.spots
      .map((spot) => `<option value="${escapeHtml(spot.id)}">${escapeHtml(spot.name)}</option>`).join("");
    if ([...els.catchSpot.options].some((option) => option.value === current)) els.catchSpot.value = current;
  }

  function collectRecordForm() {
    const existing = state.catches.find((r) => r.id === els.catchIdInput.value);
    const recordType = els.catchRecordType.value;
    const time = els.catchTime.value || nowLocalInputValue();
    return {
      id: els.catchIdInput.value || uid("record"),
      recordType,
      placeKind: els.catchPlaceKind.value,
      placeName: els.catchPlaceName.value.trim(),
      spotId: els.catchSpot.value,
      time,
      lat: Number(els.catchLat.value),
      lng: Number(els.catchLng.value),
      species: els.catchSpecies.value,
      bait: els.catchBait.value,
      lureName: els.catchLureName.value.trim(),
      lureColor: els.catchLureColor.value.trim(),
      lureWeight: els.catchLureWeight.value.trim(),
      weather: els.catchWeather.value,
      wind: els.catchWind.value,
      water: els.catchWater.value,
      waterLevel: els.catchWaterLevel.value,
      baitfish: els.catchBaitfish.value,
      cover: els.catchCover.value,
      reaction: els.catchReaction.value,
      pressure: els.catchPressure.value,
      timeBand: els.catchTimeBand.value || timeBandFromInput(time),
      size: els.catchSize.value,
      sizeCm: els.catchSizeCm.value,
      memo: els.catchMemo.value.trim(),
      photo: state.pendingPhoto,
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  function saveCatch(event) {
    event.preventDefault();
    const record = collectRecordForm();
    if (!validPosition(record)) {
      alert("記録位置が未指定です。地図をタップするか、現在地を使ってください。");
      return;
    }
    if (!isInsideMieNavBounds(record.lat, record.lng)) {
      alert("三重県外の座標は記録できません。三重県内で指定してください。");
      resetMieView();
      return;
    }
    const idx = state.catches.findIndex((r) => r.id === record.id);
    if (idx >= 0) state.catches[idx] = record; else state.catches.push(record);
    if (record.recordType === "catch" && record.spotId) {
      const s = spotState(record.spotId);
      s.caught = true;
      if (record.species) s.species = record.species;
      persistSavedState();
    }
    persistCatches();
    render();
    closeCatchPanel();
    els.dataStatus.textContent = "記録を保存しました。";
  }

  function saveSpot(event) {
    event.preventDefault();
    const id = els.spotIdInput.value || uid("custom-spot");
    const spot = {
      id,
      name: els.spotNameInput.value.trim() || "未命名の釣り場",
      type: els.spotTypeInput.value,
      area: els.spotAreaInput.value.trim(),
      memo: els.spotMemoInput.value.trim(),
      lat: Number(els.spotLat.value),
      lng: Number(els.spotLng.value),
      zoom: 16,
      custom: true
    };
    if (!validPosition(spot)) { alert("位置が未指定です。地図をタップして登録してください。"); return; }
    if (!isInsideMieNavBounds(spot.lat, spot.lng)) { alert("三重県外の座標は登録できません。三重県内で指定してください。"); resetMieView(); return; }
    const idx = state.spots.findIndex((s) => s.id === id);
    if (idx >= 0) state.spots[idx] = spot; else state.spots.push(spot);
    persistCustomSpots();
    render();
    selectSpot(id);
    closeSpotPanel();
  }

  function deleteSelectedSpot() {
    const id = els.spotIdInput.value || state.selectedSpotId;
    const spot = state.spots.find((s) => s.id === id);
    if (!spot?.custom) return;
    if (!confirm(`${spot.name}を削除しますか？ 関連する記録の釣り場指定は解除されます。`)) return;
    state.spots = state.spots.filter((s) => s.id !== id);
    state.catches = state.catches.map((r) => r.spotId === id ? { ...r, spotId: "" } : r);
    delete state.savedState[id];
    persistCustomSpots();
    persistCatches();
    persistSavedState();
    hideSpotCard();
    closeSpotPanel();
    render();
  }

  function deleteSelectedCatch() {
    const id = els.catchIdInput.value;
    if (!id) return;
    if (!confirm("この記録を削除しますか？")) return;
    state.catches = state.catches.filter((r) => r.id !== id);
    persistCatches();
    closeCatchPanel();
    render();
  }

  function compressImageFile(file, options = {}) {
    const maxDimension = options.maxDimension || 1200;
    const maxLength = options.maxLength || 420000;
    const initialQuality = options.initialQuality || 0.76;
    const minQuality = options.minQuality || 0.42;
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith("image/")) { reject(new Error("画像ファイルではありません")); return; }
      const objectUrl = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
        const width = Math.max(1, Math.round(image.naturalWidth * scale));
        const height = Math.max(1, Math.round(image.naturalHeight * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, width, height); ctx.drawImage(image, 0, 0, width, height);
        let quality = initialQuality;
        let dataUrl = canvas.toDataURL("image/jpeg", quality);
        while (dataUrl.length > maxLength && quality > minQuality) {
          quality -= 0.08;
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }
        resolve(dataUrl);
      };
      image.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error("画像を読み込めませんでした")); };
      image.src = objectUrl;
    });
  }

  async function handleCatchPhoto(file) {
    if (!file) return;
    els.catchPhotoStatus.textContent = "写真を圧縮しています…";
    try {
      state.pendingPhoto = await compressImageFile(file);
      updatePhotoPreview();
      els.catchPhotoStatus.textContent = "写真を添付しました。";
    } catch (error) {
      els.catchPhotoStatus.textContent = error.message || "写真を添付できませんでした。";
    }
  }

  function updatePhotoPreview() {
    const ok = /^data:image\//.test(state.pendingPhoto || "");
    els.catchPhotoPreview.classList.toggle("is-hidden", !ok);
    if (ok) els.catchPhotoImage.src = state.pendingPhoto; else els.catchPhotoImage.removeAttribute("src");
  }

  function applySidebarBackground(value) {
    if (/^data:image\//.test(value || "")) {
      document.querySelector(".sidebar").style.setProperty("--sidebar-bg-image", `url("${value}")`);
    } else {
      document.querySelector(".sidebar").style.removeProperty("--sidebar-bg-image");
    }
  }

  async function handleBackgroundFile(file) {
    if (!file) return;
    els.backgroundStatus.textContent = "背景画像を圧縮しています…";
    try {
      const dataUrl = await compressImageFile(file, { maxDimension: 1600, maxLength: 900000 });
      localStorage.setItem(BACKGROUND_STORAGE_KEY, dataUrl);
      applySidebarBackground(dataUrl);
      els.backgroundStatus.textContent = "背景画像を保存しました。";
    } catch (error) {
      els.backgroundStatus.textContent = error.message || "背景画像を保存できませんでした。";
    }
  }

  function updateCurrentLocationMarker(lat, lng, accuracy = null) {
    const latlng = [Number(lat), Number(lng)];
    if (!validPosition({ lat: latlng[0], lng: latlng[1] })) return;
    if (!currentLocationMarker) {
      currentLocationMarker = L.marker(latlng, { icon: makeCurrentLocationIcon(), zIndexOffset: 1000 }).addTo(map).bindPopup("現在地");
    } else currentLocationMarker.setLatLng(latlng);
    if (Number.isFinite(Number(accuracy)) && Number(accuracy) > 0) {
      if (!accuracyCircle) accuracyCircle = L.circle(latlng, { radius: Number(accuracy), className: "current-location-accuracy" }).addTo(map);
      else { accuracyCircle.setLatLng(latlng); accuracyCircle.setRadius(Number(accuracy)); }
    }
  }

  function getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) { reject(new Error("このブラウザでは現在地取得が使えません。")); return; }
      navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 });
    });
  }

  function geoErrorMessage(error) {
    if (error?.code === 1) return "現在地の使用が許可されていません。ブラウザの位置情報許可をオンにしてください。";
    if (error?.code === 2) return "現在地を取得できませんでした。電波やGPSの状態を確認してください。";
    if (error?.code === 3) return "現在地の取得がタイムアウトしました。もう一度試してください。";
    return error?.message || "現在地を取得できませんでした。";
  }

  async function useCurrentLocationForCatch(openPanel = true) {
    els.locateCatchButton.disabled = true;
    const oldText = els.locateCatchButton.textContent;
    els.locateCatchButton.textContent = "現在地取得中…";
    try {
      const pos = await getCurrentPosition();
      const { latitude, longitude, accuracy } = pos.coords;
      if (!isInsideMieNavBounds(latitude, longitude)) {
        resetMieView();
        els.dataStatus.textContent = "現在地が三重県範囲外のため、地図は三重県表示のままにしました。";
        if (!openPanel) setCatchLocationStatus("", "");
        return;
      }
      updateCurrentLocationMarker(latitude, longitude, accuracy);
      map.setView([latitude, longitude], Math.max(map.getZoom(), 17));
      if (openPanel) {
        openCatchPanel(null, L.latLng(latitude, longitude), { recordType: "note" });
        closeMobileMenu();
      } else {
        els.catchLat.value = latitude;
        els.catchLng.value = longitude;
        els.catchSpot.value = nearestSpotId(latitude, longitude);
        setCatchLocationStatus(latitude, longitude, "現在地", accuracy);
      }
      els.dataStatus.textContent = `現在地を取得しました（誤差約${Math.round(Number(accuracy) || 0)}m）`;
    } catch (error) {
      const msg = geoErrorMessage(error);
      els.dataStatus.textContent = msg;
      if (!openPanel) els.catchLocationStatus.textContent = msg;
    } finally {
      els.locateCatchButton.disabled = false;
      els.locateCatchButton.textContent = oldText;
    }
  }

  function buildBackupData() {
    return {
      app: "mie-fishing-map",
      backupVersion: 2,
      exportedAt: new Date().toISOString(),
      savedState: state.savedState,
      customSpots: state.customSpots,
      catches: state.catches,
      positionOverrides: state.positionOverrides,
      backgroundImage: localStorage.getItem(BACKGROUND_STORAGE_KEY) || ""
    };
  }

  function downloadTextFile(filename, content) {
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function exportBackup() {
    const now = new Date();
    const pad = (v) => String(v).padStart(2, "0");
    const stamp = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;
    downloadTextFile(`mie-fishing-map-backup-${stamp}.json`, JSON.stringify(buildBackupData(), null, 2));
    els.backupStatus.textContent = "バックアップJSONを書き出しました。";
  }

  function importBackup(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result || ""));
        if (data.app !== "mie-fishing-map") throw new Error("このアプリのバックアップJSONではありません");
        if (!confirm("現在の端末内データを、バックアップ内容で上書きします。続けますか？")) return;
        state.savedState = data.savedState && typeof data.savedState === "object" ? data.savedState : {};
        state.customSpots = Array.isArray(data.customSpots) ? data.customSpots : [];
        state.catches = Array.isArray(data.catches) ? data.catches.map(normalizeRecord) : [];
        state.positionOverrides = data.positionOverrides && typeof data.positionOverrides === "object" ? data.positionOverrides : {};
        saveJson(STORAGE_KEY, state.savedState);
        saveJson(CUSTOM_SPOT_STORAGE_KEY, state.customSpots);
        saveJson(CATCH_STORAGE_KEY, state.catches);
        saveJson(POSITION_STORAGE_KEY, state.positionOverrides);
        if (/^data:image\//.test(data.backgroundImage || "")) localStorage.setItem(BACKGROUND_STORAGE_KEY, data.backgroundImage);
        else localStorage.removeItem(BACKGROUND_STORAGE_KEY);
        els.backupStatus.textContent = "バックアップを読み込みました。画面を再読み込みします。";
        setTimeout(() => location.reload(), 350);
      } catch (error) {
        els.backupStatus.textContent = `読込できませんでした: ${error.message}`;
      } finally {
        els.importDataFile.value = "";
      }
    };
    reader.readAsText(file);
  }

  function openMobileMenu() {
    els.mobileMenu.classList.add("is-open");
    els.menuBackdrop.classList.add("is-open");
    els.menuToggle.setAttribute("aria-expanded", "true");
    invalidateMapSize(260);
  }

  function closeMobileMenu() {
    els.mobileMenu.classList.remove("is-open");
    els.menuBackdrop.classList.remove("is-open");
    els.menuToggle.setAttribute("aria-expanded", "false");
    invalidateMapSize(260);
  }

  function openInstallPanel(message = "") {
    updateInstallStatus(message);
    openPanel(els.installPanel);
  }

  function updateInstallStatus(message = "") {
    if (message) { els.installStatus.textContent = message; return; }
    if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone) {
      els.installStatus.textContent = "すでにホーム画面のアイコンからアプリとして起動しています。";
    } else if (state.deferredInstallPrompt) {
      els.installStatus.textContent = "この端末ではインストール画面を開けます。";
    } else if (/iphone|ipad|ipod/i.test(navigator.userAgent || "")) {
      els.installStatus.textContent = "iPhoneではSafariの共有ボタンから『ホーム画面に追加』を選んでください。";
    } else {
      els.installStatus.textContent = "ブラウザのメニューから『アプリをインストール』または『ホーム画面に追加』を選んでください。";
    }
  }

  async function handleInstallClick() {
    if (!state.deferredInstallPrompt) { openInstallPanel(); return; }
    try {
      state.deferredInstallPrompt.prompt();
      const choice = await state.deferredInstallPrompt.userChoice;
      state.deferredInstallPrompt = null;
      openInstallPanel(choice?.outcome === "accepted" ? "インストールを開始しました。" : "インストールはキャンセルされました。必要なときにもう一度押してください。");
    } catch {
      openInstallPanel("自動インストール画面を開けませんでした。ブラウザのメニューからホーム画面に追加してください。");
    }
  }

  function bindEvents() {
    els.searchInput.addEventListener("input", () => { state.search = els.searchInput.value; renderLists(); });
    els.filterButtons.forEach((button) => button.addEventListener("click", () => {
      state.activeFilter = button.dataset.filter;
      els.filterButtons.forEach((b) => b.classList.toggle("is-active", b === button));
      renderLists();
    }));
    els.spotTab.addEventListener("click", () => { state.activeList = "spots"; renderLists(); });
    els.catchTab.addEventListener("click", () => { state.activeList = "catches"; renderLists(); });
    els.spotList.addEventListener("click", (event) => {
      const item = event.target.closest("[data-spot-id]");
      if (item) selectSpot(item.dataset.spotId);
    });
    els.catchList.addEventListener("click", (event) => {
      const item = event.target.closest("[data-record-id]");
      if (item) openCatchPanel(item.dataset.recordId);
    });
    els.spotCard.addEventListener("change", (event) => {
      const input = event.target.closest("input[data-flag]");
      if (!input || !state.selectedSpotId) return;
      spotState(state.selectedSpotId)[input.dataset.flag] = input.checked;
      persistSavedState();
      renderSpotList();
    });
    els.spotCard.addEventListener("click", (event) => {
      const action = event.target.closest("button[data-action]")?.dataset.action;
      if (!action || !state.selectedSpotId) return;
      const spot = state.spots.find((s) => s.id === state.selectedSpotId);
      if (action === "close") hideSpotCard();
      if (action === "record") openCatchPanel(null, L.latLng(spot.lat, spot.lng), { recordType: "catch" });
      if (action === "edit") openSpotPanel(spot.id);
      if (action === "delete") { els.spotIdInput.value = spot.id; deleteSelectedSpot(); }
      if (action === "species") {
        const s = spotState(spot.id);
        const next = prompt("釣れた魚種を入力してください", s.species || "ブラックバス");
        if (next !== null) { s.species = next.trim(); persistSavedState(); showSpotCard(spot); renderSpotList(); }
      }
    });

    els.resetView.addEventListener("click", resetMieView);
    els.menuToggle.addEventListener("click", openMobileMenu);
    els.closeMenuButton.addEventListener("click", closeMobileMenu);
    els.menuBackdrop.addEventListener("click", closeMobileMenu);
    els.locateCatchButton.addEventListener("click", () => useCurrentLocationForCatch(true));
    els.useCurrentLocationButton.addEventListener("click", () => useCurrentLocationForCatch(false));
    els.addSpotMode.addEventListener("click", () => setSpotMode(!state.spotMode));
    els.addCatchMode.addEventListener("click", () => setCatchMode(!state.catchMode));

    els.spotForm.addEventListener("submit", saveSpot);
    els.closeSpotPanel.addEventListener("click", closeSpotPanel);
    els.deleteSpot.addEventListener("click", deleteSelectedSpot);
    els.catchForm.addEventListener("submit", saveCatch);
    els.closeCatchPanel.addEventListener("click", closeCatchPanel);
    els.deleteCatch.addEventListener("click", deleteSelectedCatch);
    els.catchRecordType.addEventListener("change", updateRecordTypeUI);
    els.catchTime.addEventListener("change", () => { if (!els.catchTimeBand.value) els.catchTimeBand.value = timeBandFromInput(els.catchTime.value); });
    els.catchPhoto.addEventListener("change", () => handleCatchPhoto(els.catchPhoto.files?.[0]));
    els.catchCamera.addEventListener("change", () => handleCatchPhoto(els.catchCamera.files?.[0]));
    els.removeCatchPhoto.addEventListener("click", () => { state.pendingPhoto = ""; updatePhotoPreview(); els.catchPhotoStatus.textContent = "写真を外しました。"; });

    els.changeBackgroundButton.addEventListener("click", () => openPanel(els.backgroundPanel));
    els.closeBackgroundPanel.addEventListener("click", () => closePanel(els.backgroundPanel));
    els.closeBackgroundDone.addEventListener("click", () => closePanel(els.backgroundPanel));
    els.backgroundCamera.addEventListener("change", () => handleBackgroundFile(els.backgroundCamera.files?.[0]));
    els.backgroundPicker.addEventListener("change", () => handleBackgroundFile(els.backgroundPicker.files?.[0]));
    els.resetBackgroundButton.addEventListener("click", () => { localStorage.removeItem(BACKGROUND_STORAGE_KEY); applySidebarBackground(""); els.backgroundStatus.textContent = "初期背景に戻しました。"; });

    els.openInfoPanel.addEventListener("click", () => openPanel(els.infoPanel));
    els.closeInfoPanel.addEventListener("click", () => closePanel(els.infoPanel));
    els.closeInfoDone.addEventListener("click", () => closePanel(els.infoPanel));
    els.exportDataButton.addEventListener("click", exportBackup);
    els.importDataFile.addEventListener("change", () => importBackup(els.importDataFile.files?.[0]));
    if (!window.__MIE_PWA_INSTALL_MANAGED__) els.installAppButton.addEventListener("click", handleInstallClick);
    els.closeInstallPanel.addEventListener("click", () => closePanel(els.installPanel));
    els.closeInstallDone.addEventListener("click", () => closePanel(els.installPanel));

    if (!window.__MIE_PWA_INSTALL_MANAGED__) window.addEventListener("beforeinstallprompt", (event) => { event.preventDefault(); state.deferredInstallPrompt = event; updateInstallStatus(); });
  }

  function registerServiceWorker() {
    if (window.__MIE_PWA_INSTALL_MANAGED__) return;
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        
      });
    }
  }

  function init() {
    initEls();
    forceFullscreenLayout();
    loadState();
    initMap();
    bindEvents();
    applySidebarBackground(localStorage.getItem(BACKGROUND_STORAGE_KEY) || "");
    render();
    forceFullscreenLayout();
    window.addEventListener("load", forceFullscreenLayout);
    window.addEventListener("resize", forceFullscreenLayout);
    registerServiceWorker();
    els.dataStatus.textContent = `v66・ボタン視認性修正 / 釣り場${state.spots.length}件 / 記録${state.catches.length}件 / 40up${state.catches.filter(isBigBass).length}件`;
  }

  init();
})();
