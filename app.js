(() => {
  "use strict";

  const APP_VERSION = "v129-smartphone-force-refresh";
  const APP_STATUS_LABEL = "v129・スマホ反映強制更新版";
  const GSI_POND_VECTOR_URLS = [
    // v121: スマホで外部PBF解析ライブラリが失敗しても動くよう、GeoJSONを先に試す。
    "https://cyberjapandata.gsi.go.jp/xyz/experimental_bvmap/{z}/{x}/{y}.geojson",
    "https://cyberjapandata.gsi.go.jp/xyz/experimental_bvmap-v1/{z}/{x}/{y}.geojson",
    "https://cyberjapandata.gsi.go.jp/xyz/experimental_bvmap/{z}/{x}/{y}.pbf",
    "https://cyberjapandata.gsi.go.jp/xyz/experimental_bvmap-v1/{z}/{x}/{y}.pbf"
  ];
  const GSI_MIE_BOUNDS = { south: 33.62, west: 135.72, north: 35.35, east: 137.15 };
  const GSI_POND_SCAN_LIBS = [
    "https://unpkg.com/pbf@3.3.0/dist/pbf.js",
    "https://unpkg.com/@mapbox/vector-tile@1.3.1/dist/vector-tile.js"
  ];
  const GSI_POND_TILE_TIMEOUT_MS = 2500;
  const GSI_POND_MAX_SCAN_TILES = 80;

  // v118: ベクトルタイルの仕様変更・外部ライブラリ失敗時でも、ボタンを押した結果が見えるようにする補助候補。
  // すべて「池候補」として扱い、釣行前の現地確認を前提にする。
  const GSI_POND_FALLBACK_CANDIDATES = [
    // v121: 地図ラベルを直接取得できない時だけ使う補助候補。実際の追加は地図ラベル位置を優先する。
    { name: "岩田池", area: "津市岩田周辺", lat: 34.7119, lng: 136.5112 },
    { name: "尺目池", area: "津市周辺", lat: 34.7068, lng: 136.4984 },
    { name: "片田池", area: "津市片田周辺", lat: 34.7352, lng: 136.4212 },
    { name: "高野尾池", area: "津市高野尾町周辺", lat: 34.7942, lng: 136.4774 },
    { name: "白山池", area: "津市白山町周辺", lat: 34.6628, lng: 136.3239 },
    { name: "木曽岬干拓調整池", area: "木曽岬町周辺", lat: 35.0737, lng: 136.7439 },
    { name: "員弁大池", area: "いなべ市周辺", lat: 35.1372, lng: 136.5576 },
    { name: "菰野調整池", area: "菰野町周辺", lat: 35.0146, lng: 136.4878 },
    { name: "水沢大池", area: "四日市市水沢町周辺", lat: 34.9825, lng: 136.4926 },
    { name: "内部調整池", area: "四日市市内部周辺", lat: 34.9229, lng: 136.5708 },
    { name: "神戸公園池", area: "鈴鹿市神戸周辺", lat: 34.8820, lng: 136.5848 },
    { name: "深谷公園池", area: "鈴鹿市八野町周辺", lat: 34.8944, lng: 136.4988 },
    { name: "関町調整池", area: "亀山市関町周辺", lat: 34.8468, lng: 136.3997 },
    { name: "片田調整池", area: "津市片田周辺", lat: 34.7346, lng: 136.4197 },
    { name: "高野尾池", area: "津市高野尾町周辺", lat: 34.7942, lng: 136.4774 },
    { name: "白山調整池", area: "津市白山町周辺", lat: 34.6628, lng: 136.3239 },
    { name: "嬉野調整池", area: "松阪市嬉野周辺", lat: 34.6121, lng: 136.4206 },
    { name: "阿坂調整池", area: "松阪市阿坂周辺", lat: 34.6088, lng: 136.4612 },
    { name: "多気調整池", area: "多気町周辺", lat: 34.5062, lng: 136.5367 },
    { name: "玉城調整池", area: "玉城町周辺", lat: 34.4918, lng: 136.6322 },
    { name: "二見調整池", area: "伊勢市二見町周辺", lat: 34.5058, lng: 136.7698 },
    { name: "伊賀柘植調整池", area: "伊賀市柘植町周辺", lat: 34.8420, lng: 136.2673 },
    { name: "上野公園池", area: "伊賀市上野周辺", lat: 34.7693, lng: 136.1276 },
    { name: "名張中央公園池", area: "名張市夏見周辺", lat: 34.6204, lng: 136.1037 },
    { name: "青山調整池", area: "伊賀市青山周辺", lat: 34.6597, lng: 136.1852 }
  ];


  const STORAGE_KEY = "mie-bass-map-v1";
  const CATCH_STORAGE_KEY = "mie-bass-catches-v1";
  const CUSTOM_SPOT_STORAGE_KEY = "mie-bass-custom-spots-v1";
  const BACKGROUND_STORAGE_KEY = "mie-fishing-map-sidebar-background-v1";
  const BACKUP_META_STORAGE_KEY = "mie-fishing-map-backup-meta-v1";
  const POSITION_STORAGE_KEY = "mie-fishing-map-position-overrides-v86";
  const LEGACY_SINGLE_KEY = "mieFishingMap.v1";
  const POINTS_CLEARED_STORAGE_KEY = "mie-fishing-map-v129-curated-spots-installed";

  // v104: 地図の拡大縮小は残し、メニュー/UI側のページ拡大を防止。
  const MIE_CENTER = [34.55, 136.48];
  const MIE_HOME_ZOOM = 9;
  const MAP_MIN_ZOOM = 5;

  const SPOT_SPECIES_OPTIONS = [
    "", "ブラックバス", "ブルーギル", "ナマズ", "ライギョ", "シーバス", "キス", "アジ", "メバル", "カサゴ", "チヌ", "マゴチ", "ヒラメ", "コイ", "フナ", "ヘラブナ", "スモールマウスバス", "ニゴイ", "ウグイ", "オイカワ", "カワムツ", "ハス", "モロコ", "タナゴ", "ワカサギ", "アユ", "アマゴ", "イワナ", "ニジマス", "ウナギ", "ハゼ", "ボラ", "サヨリ", "イワシ", "サバ", "カマス", "タチウオ", "サゴシ", "ハマチ", "ツバス", "ブリ", "マダイ", "グレ", "キビレ", "アイナメ", "ベラ", "ソイ", "タケノコメバル", "アオリイカ", "タコ", "テナガエビ", "その他"
  ];


  const POPULAR_SPECIES = new Set(["ブラックバス", "ブルーギル", "シーバス", "キス", "アジ", "メバル", "カサゴ", "チヌ", "マゴチ", "ヒラメ"]);
  const FRESHWATER_SPECIES = new Set(["ブラックバス", "ブルーギル", "ナマズ", "ライギョ", "コイ", "フナ", "ヘラブナ", "スモールマウスバス", "ニゴイ", "ウグイ", "オイカワ", "カワムツ", "ハス", "モロコ", "タナゴ", "ワカサギ", "アユ", "アマゴ", "イワナ", "ニジマス", "ウナギ", "テナガエビ"]);
  const SALTWATER_SPECIES = new Set(["シーバス", "キス", "アジ", "メバル", "カサゴ", "チヌ", "マゴチ", "ヒラメ", "ハゼ", "ボラ", "サヨリ", "イワシ", "サバ", "カマス", "タチウオ", "サゴシ", "ハマチ", "ツバス", "ブリ", "マダイ", "グレ", "キビレ", "アイナメ", "ベラ", "ソイ", "タケノコメバル"]);
  const SQUID_SHELL_SPECIES = new Set(["アオリイカ", "タコ", "テナガエビ"]);

  function fishSpeciesCategory(name) {
    const value = String(name || "").trim();
    if (SQUID_SHELL_SPECIES.has(value)) return "squid";
    if (FRESHWATER_SPECIES.has(value) && !SALTWATER_SPECIES.has(value)) return "freshwater";
    if (SALTWATER_SPECIES.has(value) && !FRESHWATER_SPECIES.has(value)) return "saltwater";
    if (FRESHWATER_SPECIES.has(value) && SALTWATER_SPECIES.has(value)) return "popular";
    return "other";
  }

  function isPopularSpecies(name) {
    return POPULAR_SPECIES.has(String(name || "").trim());
  }

  // v129: スマホでも指定リストが確実に反映されるよう初期収録。
  const seedSpots = [
    { id: "lake-shorenji", name: "青蓮寺湖", type: "ダム", area: "名張市", lat: 34.600869, lng: 136.11885, zoom: 15, source: "指定リスト", subtype: "レイク・ダム湖" },
    { id: "lake-hinachi", name: "ひなち湖", type: "ダム", area: "名張市", lat: 34.614467, lng: 136.164028, zoom: 15, source: "指定リスト", subtype: "レイク・ダム湖" },
    { id: "reservoir-isaka", name: "伊坂貯水池", type: "ダム", area: "四日市市", lat: 35.041625, lng: 136.616311, zoom: 15, source: "指定リスト", subtype: "レイク・ダム湖" },
    { id: "lake-shakujo", name: "錫杖湖", type: "ダム", area: "津市芸濃町", lat: 34.806622, lng: 136.378553, zoom: 15, source: "指定リスト", subtype: "レイク・ダム湖" },
    { id: "dam-kimigano", name: "君ヶ野ダム", type: "ダム", area: "津市美杉町", lat: 34.5971, lng: 136.313183, zoom: 15, source: "指定リスト", subtype: "レイク・ダム湖" },
    { id: "lake-okukahada", name: "奥香肌湖", type: "ダム", area: "松阪市飯高町", lat: 34.376861, lng: 136.196586, zoom: 14, source: "指定リスト", subtype: "レイク・ダム湖" },
    { id: "lake-okuise", name: "奥伊勢湖", type: "ダム", area: "多気郡大台町", lat: 34.3892, lng: 136.4011, zoom: 15, source: "指定リスト", subtype: "レイク・ダム湖" },
    { id: "lake-osugi", name: "大杉湖", type: "ダム", area: "多気郡大台町", lat: 34.286385, lng: 136.19336, zoom: 14, source: "指定リスト", subtype: "レイク・ダム湖" },
    { id: "reservoir-nanairo", name: "七色貯水池", type: "ダム", area: "熊野市・紀和町周辺", lat: 33.991304, lng: 136.004799, zoom: 14, source: "指定リスト", subtype: "レイク・ダム湖" },
    { id: "pond-gokatsura", name: "五桂池", type: "池", area: "多気町五桂", lat: 34.466625, lng: 136.545533, zoom: 15, source: "指定リスト", candidate: true },
    { id: "pond-ishigaki", name: "石垣池", type: "池", area: "鈴鹿市西玉垣町", lat: 34.856058, lng: 136.564767, zoom: 15, source: "指定リスト", candidate: true },
    { id: "pond-madoro", name: "真泥池", type: "池", area: "伊賀市真泥", lat: 34.761728, lng: 136.193772, zoom: 16, source: "指定リスト", candidate: true },
    { id: "pond-taisho", name: "大正池", type: "池", area: "伊賀市丸柱", lat: 34.856969, lng: 136.135019, zoom: 16, source: "指定リスト", candidate: true },
    { id: "pond-nameri", name: "なめり湖", type: "池", area: "松阪市嬉野森本町", lat: 34.585853, lng: 136.429147, zoom: 16, source: "指定リスト", candidate: true },
    { id: "pond-tsuga", name: "津賀池", type: "池", area: "鈴鹿市津賀町", lat: 34.897558, lng: 136.508433, zoom: 16, source: "指定リスト", candidate: true },
    { id: "pond-kasado-reservoir", name: "加佐登調整池", type: "池", area: "鈴鹿市加佐登", lat: 34.8874, lng: 136.5315, zoom: 16, source: "指定リスト", candidate: true },
    { id: "pond-kameyama-sunshine", name: "亀山サンシャインパーク池", type: "池", area: "亀山市布気町", lat: 34.8578, lng: 136.4848, zoom: 16, source: "指定リスト", candidate: true },
    { id: "pond-kameyama-park", name: "亀山公園池", type: "池", area: "亀山市若山町", lat: 34.8587, lng: 136.4527, zoom: 16, source: "指定リスト", candidate: true },
    { id: "pond-nanbu-kyuryo", name: "南部丘陵公園池", type: "池", area: "四日市市波木町", lat: 34.9398, lng: 136.5825, zoom: 16, source: "指定リスト", candidate: true },
    { id: "pond-tarusaka-park", name: "垂坂公園池", type: "池", area: "四日市市垂坂町", lat: 35.0115, lng: 136.6122, zoom: 16, source: "指定リスト", candidate: true },
    { id: "pond-chusei-green", name: "中勢グリーンパーク池", type: "池", area: "津市あのつ台", lat: 34.7601, lng: 136.5022, zoom: 16, source: "指定リスト", candidate: true },
    { id: "pond-mie-prefectural-forest", name: "三重県民の森池", type: "池", area: "菰野町千草", lat: 35.0335, lng: 136.4594, zoom: 16, source: "指定リスト", candidate: true },
    { id: "pond-daibutsuyama-park", name: "大仏山公園池", type: "池", area: "明和町・伊勢市周辺", lat: 34.5136, lng: 136.6367, zoom: 16, source: "指定リスト", candidate: true },
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
  const els = {};
  const state = {
    spots: [],
    savedState: {},
    catches: [],
    customSpots: [],
    positionOverrides: {},
    positionAdjustSpotId: null,
    selectedSpotId: null,
    activeFilter: "all",
    activeList: "spots",
    search: "",
    spotMode: false,
    catchMode: false,
    pendingPhoto: "",
    pendingPhotoPromise: null,
    deferredInstallPrompt: null,
    recordFilter: "all",
    recordEntryMode: "super",
    speciesCategoryFilter: "popular",
    speciesSearch: "",
    spotSpeciesEditSpotId: "",
    spotSpeciesReturnSpotId: "",
    backupMeta: {},
    listFocusSuppressSpotId: "",
    listFocusSuppressUntil: 0
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

  function speciesList(value) {
    if (Array.isArray(value)) {
      return [...new Set(value.map((item) => String(item || "").trim()).filter(Boolean))];
    }
    const text = String(value || "").trim();
    if (!text) return [];
    return [...new Set(text.split(/[、,，/／]+/u).map((item) => item.trim()).filter(Boolean))];
  }

  function speciesText(value, fallback = "") {
    const list = speciesList(value);
    return list.length ? list.join("、") : fallback;
  }

  function speciesShortText(value) {
    const list = speciesList(value);
    if (list.length <= 2) return list.join("・");
    return `${list[0]}ほか${list.length - 1}種`;
  }

  function normalizeSavedSpotState(raw = {}) {
    return {
      caught: Boolean(raw.caught ?? raw.hasCatch ?? raw.checked),
      species: raw.species || raw.fish || raw.fishSpecies || "",
      noFishing: Boolean(raw.noFishing ?? raw.prohibited ?? raw.banned),
      parking: Boolean(raw.parking ?? raw.hasParking),
      // v115: 池候補を「確認済み」にした状態を再起動後も残す。
      pondVerified: Boolean(raw.pondVerified ?? raw.verifiedPond ?? raw.confirmedPond ?? raw.confirmed),
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
      species: recordType === "catch" ? speciesText(raw.species || raw.fish || raw.fishSpecies || raw.speciesList, "ブラックバス") : speciesText(raw.species || raw.fish || raw.fishSpecies || raw.speciesList),
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
    // v82: 釣り場ポイントはユーザーが地理院地図上で合わせ直せるよう、三重県周辺内なら距離制限しない。
    return isWithinMieBounds(override);
  }

  function applyPositionOverride(spot) {
    const override = state.positionOverrides[spot.id];
    if (!isSafePositionOverride(spot, override)) return spot;
    return { ...spot, lat: Number(override.lat), lng: Number(override.lng), positionAdjusted: true };
  }

  function loadState() {
    // v129: スマホにv127の「ポイント初期化」状態が残っていても、指定リスト62件を確実に表示する。
    // 釣果記録は安全のため残します。
    if (!localStorage.getItem(POINTS_CLEARED_STORAGE_KEY)) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(CUSTOM_SPOT_STORAGE_KEY);
      localStorage.removeItem(POSITION_STORAGE_KEY);
      localStorage.setItem(POINTS_CLEARED_STORAGE_KEY, JSON.stringify({ clearedAt: new Date().toISOString(), version: APP_VERSION }));
    }
    state.savedState = safeParse(localStorage.getItem(STORAGE_KEY), {});
    Object.keys(state.savedState).forEach((id) => {
      state.savedState[id] = normalizeSavedSpotState(state.savedState[id]);
    });

    state.customSpots = safeParse(localStorage.getItem(CUSTOM_SPOT_STORAGE_KEY), []);
    state.catches = safeParse(localStorage.getItem(CATCH_STORAGE_KEY), []).map(normalizeRecord);
    state.positionOverrides = safeParse(localStorage.getItem(POSITION_STORAGE_KEY), {});
    state.backupMeta = safeParse(localStorage.getItem(BACKUP_META_STORAGE_KEY), {});

    const legacy = safeParse(localStorage.getItem(LEGACY_SINGLE_KEY), null);
    if (false && legacy && state.customSpots.length === 0 && Array.isArray(legacy.spots)) {
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
  function persistPositionOverrides() { saveJson(POSITION_STORAGE_KEY, state.positionOverrides); }
  function persistBackupMeta() { saveJson(BACKUP_META_STORAGE_KEY, state.backupMeta || {}); }

  function initEls() {
    ensureSpotSpeciesPanel();
    [
      "appStartScreen", "startScreenSkip", "searchInput", "visibleCount", "spotList", "catchList", "spotListHead", "catchListHead", "spotTab", "catchTab",
      "spotCount", "recordCount", "bigBassCount", "dataStatus", "spotCard", "mobileMenu", "menuToggle", "menuBackdrop", "closeMenuButton",
      "resetView", "locateCatchButton", "addSpotMode", "addCatchMode", "positionAdjustBanner", "positionAdjustText", "cancelPositionAdjustButton", "spotPanel", "spotForm", "spotLat", "spotLng", "spotIdInput",
      "spotNameInput", "spotTypeInput", "spotAreaInput", "spotMemoInput", "deleteSpot", "closeSpotPanel",
      "catchPanel", "catchForm", "catchLat", "catchLng", "catchIdInput", "catchLocationStatus", "useCurrentLocationButton",
      "catchRecordType", "catchPlaceKind", "catchPlaceName", "catchSpot", "catchSpotPicker", "catchTime", "catchSpecies", "catchSpeciesGroup", "catchSpeciesSearch", "speciesSearchStatus", "catchBait", "catchLureName",
      "catchLureColor", "catchLureWeight", "catchSizeCm", "catchSize", "catchWeather", "catchWind", "catchWater", "catchWaterLevel",
      "catchBaitfish", "catchCover", "catchReaction", "catchPressure", "catchTimeBand", "catchMemo", "catchPhoto", "catchCamera",
      "catchPhotoPreview", "catchPhotoImage", "removeCatchPhoto", "catchPhotoStatus", "deleteCatch", "closeCatchPanel",
      "changeBackgroundButton", "backgroundPanel", "backgroundCamera", "backgroundPicker", "backgroundStatus", "resetBackgroundButton", "closeBackgroundPanel", "closeBackgroundDone",
      "openInfoPanel", "infoPanel", "closeInfoPanel", "closeInfoDone", "backupStatus", "backupReminder", "exportDataButton", "importDataFile",
      "installAppButton", "installPanel", "installStatus", "closeInstallPanel", "closeInstallDone",
      "spotSpeciesPanel", "spotSpeciesForm", "spotSpeciesTarget", "spotSpeciesChoices", "closeSpotSpeciesPanel", "cancelSpotSpeciesPanel", "clearSpotSpeciesButton"
    ].forEach((id) => { els[id] = $(id); });
    els.filterButtons = [...document.querySelectorAll(".filter-chip")];
    els.recordFilterRow = $("recordFilterRow");
    els.recordFilterButtons = [...document.querySelectorAll("[data-record-filter]")];
    els.recordEntryButtons = [...document.querySelectorAll("[data-record-entry-mode]")];
    els.speciesCategoryButtons = [...document.querySelectorAll("[data-species-category-filter]")];
    els.fishingFields = [...document.querySelectorAll(".fishing-field")];
    prepareCatchSpeciesChoices();
  }

  function invalidateMapSize(delay = 0) {
    if (!map) return;
    window.setTimeout(() => {
      try { map.invalidateSize({ animate: false }); } catch (error) {}
    }, delay);
  }

  function getMieHomeBounds() {
    // 互換用。v68では表示範囲の固定には使わない。
    return typeof L !== "undefined" ? L.latLngBounds([[33.72, 135.78], [35.30, 137.08]]) : null;
  }

  function getMieNavBounds() {
    // 互換用。v68では移動制限には使わない。
    return typeof L !== "undefined" ? L.latLngBounds([[33.50, 135.55], [35.52, 137.32]]) : null;
  }

  function isInsideMieNavBounds(lat, lng) {
    // v68: 三重県固定を廃止。現在地・登録地点・記録地点を範囲で弾かない。
    return Number.isFinite(Number(lat)) && Number.isFinite(Number(lng));
  }

  function lockMieView() {
    // v68: 地図固定なし。Leafletの通常操作に任せる。
  }

  function resetMieView() {
    if (!map || typeof L === "undefined") return;
    map.setView(MIE_CENTER, MIE_HOME_ZOOM, { animate: false });
  }

  function addMieBoundaryLayer() {
    // v68: 県境線や固定枠は描画しない。
  }


  function forceFullscreenLayout() {
    // v70: 全画面強制レイアウトは廃止。CSSの通常レイアウトに任せる。
    invalidateMapSize(120);
  }

  function setMobileViewportHeight() {
    const height = window.visualViewport?.height || window.innerHeight || document.documentElement.clientHeight || 0;
    if (!height) return;
    document.documentElement.style.setProperty("--app-vh", `${height * 0.01}px`);
    invalidateMapSize(80);
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

    map = L.map("map", {
      zoomControl: true,
      touchZoom: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
      preferCanvas: true,
      zoomAnimation: false,
      fadeAnimation: false,
      markerZoomAnimation: false,
      minZoom: MAP_MIN_ZOOM,
      worldCopyJump: false,
      bounceAtZoomLimits: false
    }).setView(MIE_CENTER, MIE_HOME_ZOOM);
    map.attributionControl.setPosition("bottomright");
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
    standardMap.once("load", () => invalidateMapSize(100));
    const aerialMap = L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg", tileOptions);

    L.control.layers(
      {
        "標準地図": standardMap,
        "航空写真": aerialMap
      },
      null,
      { position: "topright" }
    ).addTo(map);

    els.dataStatus.textContent = APP_STATUS_LABEL;

    addMieBoundaryLayer();
    map.on("click", (event) => handleMapClick(event.latlng));
    map.on("popupopen", () => {
      document.body.classList.add("map-popup-open");
      invalidateMapSize(60);
    });
    map.on("popupclose", () => {
      document.body.classList.remove("map-popup-open", "record-popup-open");
    });

    map.whenReady(() => { invalidateMapSize(100); });
    invalidateMapSize(0);
    invalidateMapSize(250);
    invalidateMapSize(800);
    window.addEventListener("resize", () => invalidateMapSize(120));
    window.addEventListener("orientationchange", () => invalidateMapSize(450));
    document.addEventListener("visibilitychange", () => { if (!document.hidden) invalidateMapSize(200); });
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
    if (type === "ダム") return "ダム";
    if (type === "港") return "港";
    if (type === "マリーナ") return "船";
    return "池";
  }

  function isPondCandidate(spot) {
    if (!spot || !spot.candidate) return false;
    if (spot.type !== "池") return false;
    if (/ダム|河口堰/u.test(String(spot.name || ""))) return false;
    return !spotState(spot.id).pondVerified;
  }

  function spotTypeText(spot) {
    if (isPondCandidate(spot)) return "池候補";
    if (spot?.subtype) return spot.subtype;
    return spot?.type || "池";
  }

  function makeSpotIcon(spot) {
    const candidate = isPondCandidate(spot);
    return L.divIcon({
      className: "",
      html: `<div class="custom-marker ${markerClass(spot.type)}${candidate ? " candidate" : ""}">${candidate ? "候" : markerLabel(spot.type)}</div>`,
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


  // v113: スマホではLeafletのclickだけだとピンのタップが小さなポップアップ処理に流れる端末があるため、
  // click / tap / touchend を同じ詳細カード表示にまとめる。
  let lastSpotMarkerOpenAt = 0;
  let lastSpotMarkerOpenId = "";

  function openSpotCardFromMarker(spot, event = null) {
    if (!spot) return;
    const original = event?.originalEvent || event;
    try { original?.preventDefault?.(); } catch (error) {}
    try { original?.stopPropagation?.(); } catch (error) {}
    try { event?.preventDefault?.(); } catch (error) {}
    try { event?.stopPropagation?.(); } catch (error) {}

    const now = Date.now();
    if (lastSpotMarkerOpenId === spot.id && now - lastSpotMarkerOpenAt < 260) return;
    lastSpotMarkerOpenId = spot.id;
    lastSpotMarkerOpenAt = now;

    window.requestAnimationFrame(() => {
      try { map?.closePopup?.(); } catch (error) {}
      document.body.classList.remove("map-popup-open", "record-popup-open");
      selectSpot(spot.id, { source: "marker" });
    });
  }

  function bindSpotMarkerDomTap(marker, spot) {
    const el = marker?.getElement?.();
    if (!el) return;
    if (el.__mieSpotTapHandler) {
      try { el.removeEventListener("touchend", el.__mieSpotTapHandler); } catch (error) {}
      try { el.removeEventListener("pointerup", el.__mieSpotTapHandler); } catch (error) {}
    }
    const handler = (event) => openSpotCardFromMarker(spot, event);
    el.__mieSpotTapHandler = handler;
    el.addEventListener("touchend", handler, { passive: false });
    el.addEventListener("pointerup", handler, { passive: false });
  }

  function bindSpotMarkerCardEvents(marker, spot) {
    if (!marker || !spot) return;
    try { marker.unbindPopup?.(); } catch (error) {}
    try { marker.off?.("click"); } catch (error) {}
    try { marker.off?.("tap"); } catch (error) {}
    try { marker.off?.("touchend"); } catch (error) {}
    marker.on("click", (event) => openSpotCardFromMarker(spot, event));
    marker.on("tap", (event) => openSpotCardFromMarker(spot, event));
    marker.on("touchend", (event) => openSpotCardFromMarker(spot, event));
    marker.on("add", () => bindSpotMarkerDomTap(marker, spot));
    bindSpotMarkerDomTap(marker, spot);
  }

  function updatePositionAdjustBanner(spot = null) {
    const active = Boolean(state.positionAdjustSpotId);
    document.body.classList.toggle("position-adjusting", active);
    if (!els.positionAdjustBanner) return;
    els.positionAdjustBanner.classList.toggle("is-hidden", !active);
    if (!active) {
      if (els.positionAdjustText) els.positionAdjustText.textContent = "";
      return;
    }
    const target = spot || state.spots.find((s) => s.id === state.positionAdjustSpotId);
    if (els.positionAdjustText) {
      els.positionAdjustText.textContent = target
        ? `位置調整中：${target.name}。新しい場所を地図上でタップすると保存します。`
        : "位置調整中です。新しい場所を地図上でタップすると保存します。";
    }
  }

  function cancelSpotPositionAdjust(message = "位置調整をキャンセルしました。") {
    if (!state.positionAdjustSpotId) return;
    state.positionAdjustSpotId = null;
    updatePositionAdjustBanner();
    if (els.dataStatus && message) els.dataStatus.textContent = message;
  }

  function setSpotMode(value) {
    state.positionAdjustSpotId = null;
    updatePositionAdjustBanner();
    state.spotMode = Boolean(value);
    if (state.spotMode) state.catchMode = false;
    els.addSpotMode.classList.toggle("is-active", state.spotMode);
    els.addCatchMode.classList.toggle("is-active", state.catchMode);
    els.dataStatus.textContent = state.spotMode ? "地図をタップして釣り場を追加します。" : APP_STATUS_LABEL;
  }

  function setCatchMode(value) {
    state.positionAdjustSpotId = null;
    updatePositionAdjustBanner();
    state.catchMode = Boolean(value);
    if (state.catchMode) state.spotMode = false;
    els.addSpotMode.classList.toggle("is-active", state.spotMode);
    els.addCatchMode.classList.toggle("is-active", state.catchMode);
    els.dataStatus.textContent = state.catchMode ? "地図をタップして記録ピンを追加します。" : APP_STATUS_LABEL;
  }

  function handleMapClick(latlng) {
    if (state.positionAdjustSpotId) {
      finishSpotPositionAdjust(latlng);
      return;
    }
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
      const candidate = isPondCandidate(spot);
      let typeOk = true;
      if (state.activeFilter === "池") {
        // v115: 「池」は確認済みの池だけを表示し、未確認の池候補とは分ける。
        typeOk = spot.type === "池" && !candidate;
      } else if (state.activeFilter === "池候補") {
        // v115: 「池候補」は未確認候補だけを表示する。
        typeOk = candidate;
      } else {
        typeOk = state.activeFilter === "all" || spot.type === state.activeFilter;
      }
      const s = spotState(spot.id);
      const text = [spot.name, spot.area, spot.memo, spotTypeText(spot), spot.type, spot.source, candidate ? "池候補 未確認" : "池 確認済み", s.species, s.memo].join(" ").toLowerCase();
      return typeOk && (!q || text.includes(q));
    });
  }

  function recordSortTime(record) {
    const value = record?.time || record?.updatedAt || record?.createdAt || "";
    const time = Date.parse(String(value).replace(" ", "T"));
    return Number.isFinite(time) ? time : 0;
  }

  function recordMatchesFilter(record) {
    const filter = state.recordFilter || "all";
    if (filter === "photo") return hasRecordPhoto(record);
    if (filter === "bigBass") return isBigBass(record);
    if (filter === "catch") return record.recordType === "catch";
    if (filter === "note") return record.recordType === "note";
    if (filter === "thisMonth") return String(record.time || "").slice(0, 7) === nowLocalInputValue().slice(0, 7);
    return true;
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
      return recordMatchesFilter(record) && (!q || text.includes(q));
    }).sort((a, b) => recordSortTime(b) - recordSortTime(a));
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
    els.recordFilterRow?.classList.toggle("is-hidden", spotActive);
    els.spotTab.classList.toggle("is-active", spotActive);
    els.catchTab.classList.toggle("is-active", !spotActive);
    els.spotTab.setAttribute("aria-selected", String(spotActive));
    els.catchTab.setAttribute("aria-selected", String(!spotActive));
    renderSpotList();
    renderCatchList();
  }

  function spotFlagControl(spotId, flag, active, label, activeText, offText = "—", warn = false) {
    return `<label class="flag flag-check ${active ? (warn ? "warn" : "on") : ""}" title="${escapeHtml(label)}を切り替え">
      <input class="flag-input" type="checkbox" data-flag-toggle="${escapeHtml(flag)}" data-spot-id="${escapeHtml(spotId)}" ${active ? "checked" : ""} aria-label="${escapeHtml(label)}">
      <span>${active ? escapeHtml(activeText) : escapeHtml(offText)}</span>
    </label>`;
  }

  function speciesOptionsHtml(selected = "") {
    const current = String(selected || "").trim();
    const options = SPOT_SPECIES_OPTIONS.includes(current) ? SPOT_SPECIES_OPTIONS : [...SPOT_SPECIES_OPTIONS, current];
    return options.map((name) => `<option value="${escapeHtml(name)}" ${name === current ? "selected" : ""}>${escapeHtml(name || "未設定")}</option>`).join("");
  }

  function spotSpeciesSummary(value, fallback = "未設定") {
    const list = speciesList(value);
    if (!list.length) return fallback;
    if (list.length <= 2) return list.join("・");
    return `${list[0]}ほか${list.length - 1}種`;
  }

  function spotSpeciesFullText(value, fallback = "魚種未設定") {
    const text = speciesText(value);
    return text || fallback;
  }

  function spotSpeciesControl(spotId, species) {
    const summary = spotSpeciesSummary(species, "魚種");
    const full = spotSpeciesFullText(species, "魚種を選択");
    return `<button class="spot-species-control spot-species-button ${species ? "on" : ""}" type="button" data-species-button="1" data-spot-id="${escapeHtml(spotId)}" title="${escapeHtml(full)}" aria-label="魚種を複数選択"><span>${escapeHtml(summary)}</span></button>`;
  }

  function spotSpeciesChoiceHtml(name) {
    const category = fishSpeciesCategory(name);
    return `<label data-spot-species-choice-wrap data-species-category="${escapeHtml(category)}">
      <input type="checkbox" data-spot-species-choice value="${escapeHtml(name)}">
      <span>${escapeHtml(name)}</span>
    </label>`;
  }

  function ensureSpotSpeciesPanel() {
    if ($("spotSpeciesPanel")) return;
    const choices = SPOT_SPECIES_OPTIONS.filter(Boolean).map(spotSpeciesChoiceHtml).join("");
    document.body.insertAdjacentHTML("beforeend", `<div id="spotSpeciesPanel" class="catch-panel spot-species-panel" aria-hidden="true">
      <form id="spotSpeciesForm" class="catch-form spot-species-form">
        <div class="catch-form-header">
          <div>
            <p class="kicker">Spot Species</p>
            <h2>魚種を選択</h2>
          </div>
          <button id="closeSpotSpeciesPanel" class="icon-button" type="button" aria-label="魚種選択を閉じる">×</button>
        </div>
        <p id="spotSpeciesTarget" class="panel-help">この釣り場で釣れる魚種を複数選べます。</p>
        <div class="spot-species-panel-actions">
          <button type="button" data-spot-species-preset="popular">よく使う</button>
          <button type="button" data-spot-species-preset="freshwater">淡水</button>
          <button type="button" data-spot-species-preset="saltwater">海水</button>
          <button id="clearSpotSpeciesButton" type="button">クリア</button>
        </div>
        <div id="spotSpeciesChoices" class="multi-choice-grid spot-species-choice-grid">${choices}</div>
        <p class="field-hint">選んだ魚種は一覧では短く、詳細ではまとめて表示します。</p>
        <div class="catch-actions">
          <button id="cancelSpotSpeciesPanel" type="button" class="delete-button">キャンセル</button>
          <button type="submit" class="save-button">決定</button>
        </div>
      </form>
    </div>`);
  }

  function spotSpeciesChoiceInputs() {
    return els.spotSpeciesChoices ? [...els.spotSpeciesChoices.querySelectorAll("input[data-spot-species-choice]")] : [];
  }

  function ensureSpotSpeciesChoices(names = []) {
    if (!els.spotSpeciesChoices) return;
    const existing = new Set(spotSpeciesChoiceInputs().map((input) => input.value));
    speciesList(names).forEach((name) => {
      if (!name || existing.has(name)) return;
      els.spotSpeciesChoices.insertAdjacentHTML("beforeend", spotSpeciesChoiceHtml(name));
      existing.add(name);
    });
  }

  function syncSpotSpeciesChoiceClasses() {
    spotSpeciesChoiceInputs().forEach((input) => {
      input.closest("label")?.classList.toggle("is-selected", input.checked);
    });
  }

  function setSpotSpeciesPanelSelection(value = "") {
    const selected = new Set(speciesList(value));
    ensureSpotSpeciesChoices([...selected]);
    spotSpeciesChoiceInputs().forEach((input) => { input.checked = selected.has(input.value); });
    syncSpotSpeciesChoiceClasses();
  }

  function openSpotSpeciesPanel(spotId) {
    const spot = state.spots.find((s) => s.id === spotId);
    if (!spot) return;
    state.spotSpeciesEditSpotId = spotId;
    state.spotSpeciesReturnSpotId = (!els.spotCard?.classList.contains("is-hidden") && state.selectedSpotId === spotId) ? spotId : "";
    const saved = spotState(spotId);
    if (els.spotSpeciesTarget) els.spotSpeciesTarget.textContent = `${spot.name} の魚種を複数選べます。`;
    setSpotSpeciesPanelSelection(saved.species);
    openPanel(els.spotSpeciesPanel);
  }

  function closeSpotSpeciesPanel() {
    const returnSpotId = state.spotSpeciesReturnSpotId;
    state.spotSpeciesEditSpotId = "";
    state.spotSpeciesReturnSpotId = "";
    closePanel(els.spotSpeciesPanel);
    if (returnSpotId) {
      const spot = state.spots.find((s) => s.id === returnSpotId);
      window.setTimeout(() => { if (spot) showSpotCard(spot); }, 0);
    }
  }

  function selectedSpotSpeciesText() {
    const names = spotSpeciesChoiceInputs().filter((input) => input.checked).map((input) => input.value);
    return speciesText(names);
  }

  function saveSpotSpeciesPanel() {
    if (!state.spotSpeciesEditSpotId) return closeSpotSpeciesPanel();
    updateSpotSpecies(state.spotSpeciesEditSpotId, selectedSpotSpeciesText());
    closeSpotSpeciesPanel();
  }

  function applySpotSpeciesPreset(preset) {
    const wanted = new Set();
    spotSpeciesChoiceInputs().forEach((input) => {
      if (preset === "popular" && (isPopularSpecies(input.value) || Number(input.dataset.speciesUsage || 0) > 0)) wanted.add(input.value);
      if (preset === "freshwater" && FRESHWATER_SPECIES.has(input.value)) wanted.add(input.value);
      if (preset === "saltwater" && SALTWATER_SPECIES.has(input.value)) wanted.add(input.value);
    });
    spotSpeciesChoiceInputs().forEach((input) => { input.checked = wanted.has(input.value); });
    syncSpotSpeciesChoiceClasses();
  }

  function catchSpeciesInputs() {
    return els.catchSpeciesGroup ? [...els.catchSpeciesGroup.querySelectorAll("input[data-catch-species-option]")] : [];
  }

  function speciesSearchText(value) {
    return String(value || "").trim().toLowerCase().replace(/\s+/g, "");
  }

  function speciesUsageStats() {
    const counts = new Map();
    const add = (value, weight = 1) => {
      speciesList(value).forEach((name) => counts.set(name, (counts.get(name) || 0) + weight));
    };
    state.catches.forEach((record) => { if (record.recordType === "catch") add(record.species, 3); });
    Object.values(state.savedState || {}).forEach((saved) => add(saved?.species, 1));
    return counts;
  }

  function speciesUsageRank(name) {
    return speciesUsageStats().get(String(name || "").trim()) || 0;
  }

  function applySpeciesMeta(input) {
    if (!input) return;
    const category = fishSpeciesCategory(input.value);
    const usage = speciesUsageRank(input.value);
    input.dataset.speciesCategory = category;
    input.dataset.speciesPopular = String(isPopularSpecies(input.value));
    input.dataset.speciesUsage = String(usage);
    const label = input.closest("label");
    if (label) {
      if (!label.dataset.speciesOrder) label.dataset.speciesOrder = String([...label.parentElement.children].indexOf(label));
      label.dataset.speciesCategory = category;
      label.dataset.speciesPopular = String(isPopularSpecies(input.value));
      label.dataset.speciesUsage = String(usage);
      label.title = usage > 0 ? `よく使う魚種：記録履歴 ${usage}点` : "";
    }
  }

  function speciesMatchesCategory(input) {
    const filter = state.speciesCategoryFilter || "popular";
    const usage = Number(input.dataset.speciesUsage || 0);
    if (filter === "all") return true;
    if (filter === "popular") return input.dataset.speciesPopular === "true" || usage > 0;
    return input.dataset.speciesCategory === filter;
  }

  function speciesMatchesSearch(input) {
    const q = speciesSearchText(state.speciesSearch);
    if (!q) return true;
    return speciesSearchText(input.value).includes(q);
  }

  function sortCatchSpeciesChoices() {
    if (!els.catchSpeciesGroup) return;
    const labels = [...els.catchSpeciesGroup.querySelectorAll("label")];
    const q = speciesSearchText(state.speciesSearch);
    labels.sort((a, b) => {
      const ia = a.querySelector("input[data-catch-species-option]");
      const ib = b.querySelector("input[data-catch-species-option]");
      const ua = Number(ia?.dataset.speciesUsage || 0);
      const ub = Number(ib?.dataset.speciesUsage || 0);
      const sa = ia?.checked ? 1 : 0;
      const sb = ib?.checked ? 1 : 0;
      if (sa !== sb) return sb - sa;
      if (q) {
        const va = speciesSearchText(ia?.value);
        const vb = speciesSearchText(ib?.value);
        const pa = va.startsWith(q) ? 1 : 0;
        const pb = vb.startsWith(q) ? 1 : 0;
        if (pa !== pb) return pb - pa;
      }
      if (ua !== ub) return ub - ua;
      const pa = ia?.dataset.speciesPopular === "true" ? 1 : 0;
      const pb = ib?.dataset.speciesPopular === "true" ? 1 : 0;
      if (pa !== pb) return pb - pa;
      return Number(a.dataset.speciesOrder || 0) - Number(b.dataset.speciesOrder || 0);
    });
    labels.forEach((label) => els.catchSpeciesGroup.appendChild(label));
  }

  function applySpeciesCategoryFilter() {
    let visibleCount = 0;
    catchSpeciesInputs().forEach((input) => {
      applySpeciesMeta(input);
    });
    sortCatchSpeciesChoices();
    catchSpeciesInputs().forEach((input) => {
      const label = input.closest("label");
      if (!label) return;
      const hasSearch = Boolean(speciesSearchText(state.speciesSearch));
      const categoryMatch = speciesMatchesCategory(input);
      const visible = hasSearch ? (speciesMatchesSearch(input) || input.checked) : (categoryMatch || input.checked);
      label.classList.toggle("is-hidden", !visible);
      label.classList.toggle("is-outside-category", input.checked && !categoryMatch && !hasSearch);
      label.classList.toggle("is-frequent", Number(input.dataset.speciesUsage || 0) > 0);
      if (visible) visibleCount += 1;
    });
    els.speciesCategoryButtons?.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.speciesCategoryFilter === state.speciesCategoryFilter);
    });
    if (els.speciesSearchStatus) {
      const q = String(state.speciesSearch || "").trim();
      els.speciesSearchStatus.textContent = q
        ? `検索「${q}」: ${visibleCount}件`
        : (state.speciesCategoryFilter === "popular" ? "よく使う魚種は記録履歴から自動で上に出ます。" : `${visibleCount}件表示`);
    }
  }

  function prepareCatchSpeciesChoices() {
    catchSpeciesInputs().forEach(applySpeciesMeta);
    applySpeciesCategoryFilter();
  }

  function ensureCatchSpeciesOptions(names = []) {
    if (!els.catchSpeciesGroup) return;
    const existing = new Set(catchSpeciesInputs().map((input) => input.value));
    names.forEach((name) => {
      const value = String(name || "").trim();
      if (!value || existing.has(value)) return;
      const label = document.createElement("label");
      const category = fishSpeciesCategory(value);
      label.dataset.speciesCategory = category;
      label.dataset.speciesPopular = String(isPopularSpecies(value));
      label.dataset.speciesOrder = String(els.catchSpeciesGroup.children.length);
      label.innerHTML = `<input type="checkbox" data-catch-species-option data-species-category="${escapeHtml(category)}" data-species-popular="${isPopularSpecies(value)}" value="${escapeHtml(value)}"><span>${escapeHtml(value)}</span>`;
      els.catchSpeciesGroup.appendChild(label);
      existing.add(value);
    });
    applySpeciesCategoryFilter();
  }

  function syncCatchSpeciesClasses() {
    catchSpeciesInputs().forEach((input) => {
      input.closest("label")?.classList.toggle("is-selected", input.checked);
    });
    applySpeciesCategoryFilter();
  }

  function setCatchSpeciesValue(value = "ブラックバス") {
    const names = speciesList(value || "ブラックバス");
    ensureCatchSpeciesOptions(names);
    const selected = new Set(names);
    catchSpeciesInputs().forEach((input) => { input.checked = selected.has(input.value); });
    if (els.catchSpecies) els.catchSpecies.value = speciesText(names);
    syncCatchSpeciesClasses();
  }

  function updateCatchSpeciesValueFromInputs() {
    const names = catchSpeciesInputs().filter((input) => input.checked).map((input) => input.value);
    if (els.catchSpecies) els.catchSpecies.value = speciesText(names);
    syncCatchSpeciesClasses();
  }

  function setSpeciesSearch(value = "") {
    state.speciesSearch = String(value || "");
    if (els.catchSpeciesSearch && els.catchSpeciesSearch.value !== state.speciesSearch) els.catchSpeciesSearch.value = state.speciesSearch;
    applySpeciesCategoryFilter();
  }

  function catchSpeciesValue() {
    updateCatchSpeciesValueFromInputs();
    return String(els.catchSpecies?.value || "").trim();
  }

  function renderSpotList() {
    const list = filteredSpots();
    els.visibleCount.textContent = `${list.length}件`;
    els.spotList.innerHTML = list.length ? list.map((spot) => {
      const s = spotState(spot.id);
      const candidate = isPondCandidate(spot);
      return `<div class="spot-item ${spot.id === state.selectedSpotId ? "is-selected" : ""} ${candidate ? "is-candidate" : ""}" data-spot-id="${escapeHtml(spot.id)}">
        <button class="spot-main spot-open-button" type="button" data-spot-id="${escapeHtml(spot.id)}" aria-label="${escapeHtml(spot.name)}へ地図を移動"><strong>${escapeHtml(spot.name)}${candidate ? '<span class="candidate-badge">候補</span>' : ""}</strong><small>${escapeHtml(spotTypeText(spot))} / ${escapeHtml(spot.area || "地名未設定")}</small></button>
        ${spotFlagControl(spot.id, "caught", Boolean(s.caught), "釣れた", "✓")}
        ${spotSpeciesControl(spot.id, s.species)}
        ${spotFlagControl(spot.id, "noFishing", Boolean(s.noFishing), "禁止", "禁", "—", true)}
        ${spotFlagControl(spot.id, "parking", Boolean(s.parking), "駐車", "P")}
      </div>`;
    }).join("") : '<p class="empty">釣り場ポイントはありません。地図の「釣り場追加」から登録できます。</p>';
  }

  function saveSpotListState(spotId) {
    const spot = state.spots.find((s) => s.id === spotId);
    if (!spot) return;
    persistSavedState();
    if (state.selectedSpotId === spotId) showSpotCard(spot);
    renderSpotList();
  }

  function updateSpotListFlag(spotId, flag, checked) {
    const s = spotState(spotId);
    if (["caught", "noFishing", "parking"].includes(flag)) {
      s[flag] = Boolean(checked);
      saveSpotListState(spotId);
    }
  }

  function updateSpotSpecies(spotId, species) {
    const s = spotState(spotId);
    s.species = speciesText(species);
    if (s.species) s.caught = true;
    saveSpotListState(spotId);
  }

  function recordTitle(record, index) {
    if (record.recordType === "note") return record.placeName || record.placeKind || `現地メモ ${index + 1}`;
    const size = record.sizeCm ? `${record.sizeCm}cm` : record.size || "サイズ未記録";
    const lure = record.lureName || record.bait || "ルアー未記録";
    return `${speciesShortText(record.species) || "釣果"} ${size} / ${lure}`;
  }

  function hasRecordPhoto(record) {
    return /^data:image\//.test(record?.photo || "");
  }

  function recordPhotoThumb(record, altText = "記録写真") {
    if (!hasRecordPhoto(record)) return "";
    return `<span class="catch-photo-thumb"><img src="${record.photo}" alt="${escapeHtml(altText)}" loading="lazy"></span>`;
  }

  function recordPopupPhoto(record, altText = "記録写真") {
    if (!hasRecordPhoto(record)) return "";
    return `<div class="record-popup-photo"><img src="${record.photo}" alt="${escapeHtml(altText)}"></div>`;
  }

  function recordPopupInfo(record, index) {
    const spot = state.spots.find((s) => s.id === record.spotId);
    const title = recordTitle(record, index);
    const isNote = record.recordType === "note";
    const mainRows = [
      ["場所", spot?.name || "釣り場未設定"],
      ["日時", formatDateTime(record.time)],
      isNote ? ["メモ種別", record.placeKind || "現地メモ"] : ["魚種", speciesText(record.species)],
      isNote ? ["内容", record.placeName] : ["サイズ", record.sizeCm ? `${record.sizeCm}cm` : record.size]
    ].filter((row) => row[1]);
    const detailRows = [
      ["ルアー", [record.bait, record.lureName].filter(Boolean).join(" / ")],
      ["色・重さ", [record.lureColor, record.lureWeight].filter(Boolean).join(" / ")],
      ["天気・風", [record.weather, record.wind].filter(Boolean).join(" / ")],
      ["水・水位", [record.water, record.waterLevel].filter(Boolean).join(" / ")],
      ["ベイト", record.baitfish],
      ["カバー", record.cover],
      ["反応場所", record.reaction],
      ["プレッシャー", record.pressure],
      ["時間帯", record.timeBand]
    ].filter((row) => row[1]);
    const memo = record.memo || (isNote ? record.placeName : "");
    const hasInfo = mainRows.length || detailRows.length || memo || hasRecordPhoto(record);
    return `<div class="record-popup-card record-popup-card-v83">
      <div class="record-popup-head record-popup-head-v83">
        <span class="record-popup-num">${isNote ? "メ" : index + 1}</span>
        <span class="record-popup-title"><strong>${escapeHtml(title)}</strong><small>${isNote ? "現地メモ" : "釣果記録"}${hasRecordPhoto(record) ? "・写真あり" : ""}</small></span>
      </div>
      ${hasRecordPhoto(record) ? recordPopupPhoto(record, title) : '<div class="record-popup-no-photo">写真なし</div>'}
      <div class="record-popup-section-title">基本情報</div>
      <div class="record-popup-info record-popup-info-main">
        ${mainRows.map(([label, value]) => `<p><b>${escapeHtml(label)}</b><span>${escapeHtml(value)}</span></p>`).join("")}
      </div>
      ${detailRows.length ? `<div class="record-popup-section-title">状況・釣り方</div><div class="record-popup-info record-popup-info-detail">${detailRows.map(([label, value]) => `<p><b>${escapeHtml(label)}</b><span>${escapeHtml(value)}</span></p>`).join("")}</div>` : ""}
      ${memo ? `<div class="record-popup-section-title">メモ</div><p class="record-popup-memo">${escapeHtml(memo)}</p>` : ""}
      ${!hasInfo ? '<p class="record-popup-memo">記載情報はまだありません。</p>' : ""}
      <div class="record-popup-actions record-popup-actions-v83">
        <button class="record-popup-edit" type="button" data-record-edit="${escapeHtml(record.id)}">この記録を編集</button>
        <button class="record-popup-close" type="button" data-record-popup-close="1">閉じる</button>
      </div>
    </div>`;
  }

  function openRecordPopup(recordId) {
    const record = state.catches.find((r) => r.id === recordId);
    if (!record || !map || typeof L === "undefined") return;
    try { closeMobileMenu(); } catch (error) {}
    try { [els.catchPanel, els.spotPanel, els.backgroundPanel, els.installPanel, els.infoPanel, els.spotSpeciesPanel].forEach(closePanel); } catch (error) {}
    hideSpotCard();
    const lat = Number(record.lat);
    const lng = Number(record.lng);
    if (validPosition({ lat, lng })) map.setView([lat, lng], Math.max(map.getZoom(), 17), { animate: false });
    const marker = catchMarkers.get(record.id);
    if (marker) {
      document.body.classList.add("record-popup-open", "map-popup-open");
      marker.openPopup();
    }
  }

  function renderCatchList() {
    const list = filteredRecords();
    els.visibleCount.textContent = `${list.length}件`;
    els.catchList.innerHTML = list.length ? list.map((record, index) => {
      const spot = state.spots.find((s) => s.id === record.spotId);
      const title = recordTitle(record, index);
      const tags = [record.waterLevel, record.baitfish, record.cover, record.reaction, record.pressure, record.timeBand, record.lureColor, record.lureWeight]
        .filter(Boolean).slice(0, 8);
      return `<button class="catch-item ${hasRecordPhoto(record) ? "has-photo" : ""}" type="button" data-record-id="${escapeHtml(record.id)}">
        <span class="catch-num ${record.recordType === "note" ? "note" : ""}">${record.recordType === "note" ? "メ" : index + 1}</span>
        ${recordPhotoThumb(record, title)}
        <span class="catch-main"><strong>${escapeHtml(title)}${hasRecordPhoto(record) ? '<span class="photo-badge">写真あり</span>' : ""}${isBigBass(record) ? '<span class="big-bass-badge">40up</span>' : ""}</strong>
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
        const marker = markers.get(spot.id);
        marker.setLatLng(latlng).setIcon(makeSpotIcon(spot));
        bindSpotMarkerCardEvents(marker, spot);
        return;
      }
      const marker = L.marker(latlng, { icon: makeSpotIcon(spot), riseOnHover: true }).addTo(map);
      // v113: PCでもスマホでも、釣り場ポイントを押したら必ず詳細カードを開く。
      bindSpotMarkerCardEvents(marker, spot);
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
      marker.bindPopup(recordPopupInfo(record, index), { maxWidth: 320, className: "record-info-popup" });
      marker.on("click", () => openRecordPopup(record.id));
      catchMarkers.set(record.id, marker);
    });
  }

  function formatDateTime(value) {
    if (!value) return "日時未設定";
    return String(value).replace("T", " ");
  }

  function selectSpot(id, options = {}) {
    const spot = state.spots.find((s) => s.id === id);
    if (!spot) return;
    state.selectedSpotId = id;
    try { map?.closePopup?.(); } catch (error) {}
    document.body.classList.remove("map-popup-open", "record-popup-open");
    closeMobileMenu();
    if (map && isInsideMieNavBounds(spot.lat, spot.lng)) {
      const targetZoom = Math.max(map.getZoom(), spot.zoom || 15);
      map.setView([Number(spot.lat), Number(spot.lng)], targetZoom, { animate: options.source !== "marker" });
    } else if (map) {
      els.dataStatus.textContent = "三重県範囲外の座標なので、地図は三重県表示のままにしました。";
      resetMieView();
    }

    const suppressedFromList = state.listFocusSuppressSpotId === id && Date.now() < Number(state.listFocusSuppressUntil || 0);
    if (suppressedFromList || options.showCard === false || options.source === "list") {
      hideSpotCard();
    } else {
      showSpotCard(spot);
    }

    renderSpotList();
    invalidateMapSize(80);
    invalidateMapSize(260);
  }

  function focusSpotFromList(id) {
    const spot = state.spots.find((s) => s.id === id);
    if (!spot) return;
    state.selectedSpotId = id;
    state.listFocusSuppressSpotId = id;
    state.listFocusSuppressUntil = Date.now() + 1600;
    try { map?.closePopup?.(); } catch (error) {}
    document.body.classList.remove("map-popup-open", "record-popup-open");
    hideSpotCard();
    closeMobileMenu();
    if (map && isInsideMieNavBounds(spot.lat, spot.lng)) {
      const targetZoom = Math.max(map.getZoom(), spot.zoom || 16);
      map.setView([Number(spot.lat), Number(spot.lng)], targetZoom, { animate: true });
      els.dataStatus.textContent = `${spot.name} に移動しました。`;
    } else if (map) {
      els.dataStatus.textContent = "三重県範囲外の座標なので、地図は三重県表示のままにしました。";
      resetMieView();
    }
    window.setTimeout(() => {
      if (state.listFocusSuppressSpotId === id) {
        hideSpotCard();
        state.listFocusSuppressSpotId = "";
        state.listFocusSuppressUntil = 0;
      }
    }, 500);
    renderSpotList();
    invalidateMapSize(80);
    invalidateMapSize(260);
  }

  function showSpotCard(spot) {
    document.body.classList.add("spot-card-open");
    const s = spotState(spot.id);
    const candidate = isPondCandidate(spot);
    const recordCount = state.catches.filter((r) => r.spotId === spot.id).length;
    els.spotCard.innerHTML = `<h2>${escapeHtml(spot.name)}${candidate ? '<span class="candidate-badge">池候補</span>' : ""}</h2>
      <p><strong>${escapeHtml(spotTypeText(spot))}</strong> / ${escapeHtml(spot.area || "地名未設定")}</p>
      ${candidate ? '<p class="candidate-warning">未確認の池候補です。釣行前に現地看板・管理者・私有地・立入禁止情報を必ず確認してください。</p>' : ""}
      ${spot.memo ? `<p>${escapeHtml(spot.memo)}</p>` : ""}
      ${spot.source ? `<p class="spot-source-note">出典/登録元: ${escapeHtml(spot.source)}</p>` : ""}
      ${spot.positionAdjusted ? '<p class="position-adjusted-badge">位置調整済み</p>' : ""}
      <p class="catch-photo-status">記録 ${recordCount}件 / ${Number(spot.lat).toFixed(6)}, ${Number(spot.lng).toFixed(6)}</p>
      <div class="card-flags">
        <label><input type="checkbox" data-flag="caught" ${s.caught ? "checked" : ""}>釣れた</label>
        <button class="spot-card-species-button ${s.species ? "on" : ""}" type="button" data-card-species-button="1" title="${escapeHtml(spotSpeciesFullText(s.species))}" aria-label="魚種を複数選択"><span>魚種</span><strong>${escapeHtml(spotSpeciesSummary(s.species, "未設定"))}</strong></button>
        <label><input type="checkbox" data-flag="noFishing" ${s.noFishing ? "checked" : ""}>禁止/注意</label>
        <label><input type="checkbox" data-flag="parking" ${s.parking ? "checked" : ""}>駐車</label>
      </div>
      <div class="card-actions">
        <button type="button" data-action="record">ここで記録</button>
        ${spot.candidate ? (s.pondVerified ? '<button type="button" data-action="unverifyPond">池候補に戻す</button>' : '<button type="button" data-action="verifyPond">確認済みにする</button>') : ""}
        <button type="button" data-action="move">位置調整</button>
        ${spot.positionAdjusted && !spot.custom ? '<button type="button" data-action="resetPosition">位置初期化</button>' : ""}
        ${spot.custom ? '<button type="button" data-action="edit">編集</button><button class="danger" type="button" data-action="delete">削除</button>' : ""}
        <button type="button" data-action="close">閉じる</button>
      </div>
      <p class="spot-card-adjust-note">位置調整は、ボタンを押した後に地図上の新しい場所をタップして保存します。</p>`;
    els.spotCard.classList.remove("is-hidden");
  }

  function hideSpotCard() {
    document.body.classList.remove("spot-card-open");
    els.spotCard.classList.add("is-hidden");
    els.spotCard.innerHTML = "";
  }

  function baseSeedSpot(spotId) {
    return seedSpots.find((spot) => spot.id === spotId) || null;
  }

  function startSpotPositionAdjust(spotId) {
    const spot = state.spots.find((s) => s.id === spotId);
    if (!spot || !map) return;
    state.positionAdjustSpotId = spotId;
    state.spotMode = false;
    state.catchMode = false;
    updatePositionAdjustBanner(spot);
    els.addSpotMode.classList.remove("is-active");
    els.addCatchMode.classList.remove("is-active");
    hideSpotCard();
    try { map.closePopup(); } catch (error) {}
    try { closeMobileMenu(); } catch (error) {}
    map.setView([Number(spot.lat), Number(spot.lng)], Math.max(map.getZoom(), spot.zoom || 16), { animate: false });
    els.dataStatus.textContent = `位置調整中：${spot.name}。新しい場所を地図上でタップすると保存します。`;
  }

  function finishSpotPositionAdjust(latlng) {
    const spotId = state.positionAdjustSpotId;
    const spot = state.spots.find((s) => s.id === spotId);
    if (!spot || !latlng) return;
    const next = { lat: Number(latlng.lat), lng: Number(latlng.lng) };
    if (!isWithinMieBounds(next)) {
      alert("三重県周辺外の位置には移動できません。もう一度、地図上の位置をタップしてください。");
      return;
    }
    if (spot.custom) {
      const custom = state.customSpots.find((s) => s.id === spotId);
      if (custom) { custom.lat = next.lat; custom.lng = next.lng; }
      spot.lat = next.lat;
      spot.lng = next.lng;
      persistCustomSpots();
    } else {
      state.positionOverrides[spotId] = next;
      persistPositionOverrides();
      spot.lat = next.lat;
      spot.lng = next.lng;
      spot.positionAdjusted = true;
    }
    state.positionAdjustSpotId = null;
    updatePositionAdjustBanner();
    renderSpotMarkers();
    renderSpotList();
    selectSpot(spotId);
    els.dataStatus.textContent = `「${spot.name}」の位置を更新しました。`;
  }

  function resetSpotPosition(spotId) {
    cancelSpotPositionAdjust("");
    const base = baseSeedSpot(spotId);
    if (!base) return;
    delete state.positionOverrides[spotId];
    persistPositionOverrides();
    const idx = state.spots.findIndex((spot) => spot.id === spotId);
    if (idx >= 0) state.spots[idx] = { ...base };
    renderSpotMarkers();
    selectSpot(spotId);
    els.dataStatus.textContent = `「${base.name}」の位置を初期位置に戻しました。`;
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

  function openPanel(panel) {
    if (!panel) return;
    hideSpotCard();
    // v76: スマホのメニュー上から開いた時は、先にメニューを閉じてポップアウト画面を最前面に出す。
    try {
      if (els.mobileMenu?.classList.contains("is-open")) closeMobileMenu();
    } catch (error) {}
    document.body.classList.add("panel-open");
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    const firstInput = panel.querySelector("input, select, textarea, button");
    window.setTimeout(() => { try { firstInput?.focus?.({ preventScroll: true }); } catch (error) {} }, 80);
  }

  function closePanel(panel) {
    if (!panel) return;
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    window.setTimeout(() => {
      if (!document.querySelector(".catch-panel.is-open")) document.body.classList.remove("panel-open");
    }, 0);
  }

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

  function updateRecordEntryModeUI() {
    const mode = ["super", "quick", "detail"].includes(state.recordEntryMode) ? state.recordEntryMode : "super";
    const superQuick = mode === "super";
    const quick = mode !== "detail";
    els.catchForm?.classList.toggle("is-super-quick-record", superQuick);
    els.catchForm?.classList.toggle("is-quick-record", quick);
    els.catchForm?.classList.toggle("is-detail-record", mode === "detail");
    document.querySelectorAll(".advanced-fishing-field").forEach((field) => {
      field.classList.toggle("is-quick-hidden", quick);
    });
    document.querySelectorAll(".super-record-hidden-field").forEach((field) => {
      field.classList.toggle("is-super-hidden", superQuick);
    });
    els.recordEntryButtons?.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.recordEntryMode === mode);
      button.setAttribute("aria-pressed", String(button.dataset.recordEntryMode === mode));
    });
  }

  function setRecordEntryMode(mode = "super") {
    state.recordEntryMode = mode === "detail" ? "detail" : (mode === "quick" ? "quick" : "super");
    updateRecordEntryModeUI();
  }

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
    setCatchSpotValue(record?.spotId || (validPosition({ lat, lng }) ? nearestSpotId(lat, lng) : ""), true);
    els.catchTime.value = record?.time || nowLocalInputValue();
    setSpeciesSearch("");
    setCatchSpeciesValue(record?.species || "ブラックバス");
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
    state.pendingPhotoPromise = null;
    updatePhotoPreview();
    if (els.catchPhotoStatus) els.catchPhotoStatus.textContent = state.pendingPhoto ? "保存済みの写真があります。変更する場合は写真を選び直してください。" : "写真を選ぶと、保存時に記録へ添付します。";
    if (els.catchPhoto) els.catchPhoto.value = "";
    if (els.catchCamera) els.catchCamera.value = "";
    updateRecordTypeUI();
    const defaultRecordMode = record ? "detail" : (options.recordMode || (els.catchRecordType.value === "catch" ? "super" : "quick"));
    setRecordEntryMode(defaultRecordMode);
    setCatchLocationStatus(lat, lng);
    els.deleteCatch.classList.toggle("is-hidden", !record);
    openPanel(els.catchPanel);
  }

  function closeCatchPanel() {
    closePanel(els.catchPanel);
    els.catchForm.reset();
    setRecordEntryMode("super");
    setCatchSpeciesValue("ブラックバス");
    state.pendingPhoto = "";
    state.pendingPhotoPromise = null;
    if (els.catchPhoto) els.catchPhoto.value = "";
    if (els.catchCamera) els.catchCamera.value = "";
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

  function setCatchSpotValue(value, scrollIntoView = false) {
    const nextValue = String(value || "");
    els.catchSpot.value = nextValue;
    if (!els.catchSpotPicker) return;
    els.catchSpotPicker.querySelectorAll("[data-catch-spot-picker]").forEach((button) => {
      const selected = button.dataset.catchSpotPicker === nextValue;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-selected", String(selected));
      if (selected && scrollIntoView) button.scrollIntoView({ block: "nearest" });
    });
  }

  function populateCatchSpots() {
    const current = els.catchSpot.value;
    const optionsHtml = '<option value="">選択してください</option>' + state.spots
      .map((spot) => `<option value="${escapeHtml(spot.id)}">${escapeHtml(spot.name)}</option>`).join("");
    els.catchSpot.innerHTML = optionsHtml;
    const exists = [...els.catchSpot.options].some((option) => option.value === current);
    const nextValue = exists ? current : "";
    if (els.catchSpotPicker) {
      els.catchSpotPicker.innerHTML = `<button type="button" data-catch-spot-picker="" role="option">選択なし</button>` + state.spots
        .map((spot) => `<button type="button" data-catch-spot-picker="${escapeHtml(spot.id)}" role="option">${escapeHtml(spot.name)}<small>${escapeHtml(spot.area || spot.type || "")}</small></button>`).join("");
    }
    setCatchSpotValue(nextValue);
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
      species: catchSpeciesValue(),
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

  async function saveCatch(event) {
    event.preventDefault();
    const photoReady = await ensureCatchPhotoReady();
    if (!photoReady && hasSelectedCatchPhotoFile()) {
      const ok = confirm("写真を添付できませんでした。写真なしで記録を保存しますか？");
      if (!ok) return;
    }
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
    updateBackupReminder();
    render();
    closeCatchPanel();
    els.dataStatus.textContent = record.photo ? "写真付きで記録を保存しました。" : "記録を保存しました。";
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

  function hasSelectedCatchPhotoFile() {
    return Boolean(els.catchPhoto?.files?.[0] || els.catchCamera?.files?.[0]);
  }

  async function ensureCatchPhotoReady() {
    if (state.pendingPhotoPromise) {
      try {
        els.catchPhotoStatus.textContent = "写真を記録へ添付しています…";
        await state.pendingPhotoPromise;
      } catch (error) {
        return false;
      }
    }
    if (!state.pendingPhoto && hasSelectedCatchPhotoFile()) {
      return await handleCatchPhoto(els.catchPhoto?.files?.[0] || els.catchCamera?.files?.[0]);
    }
    return true;
  }

  async function handleCatchPhoto(file) {
    if (!file) return false;
    els.catchPhotoStatus.textContent = "写真を圧縮しています…";
    const task = compressImageFile(file, { maxDimension: 1400, maxLength: 520000, initialQuality: 0.78, minQuality: 0.38 });
    state.pendingPhotoPromise = task;
    try {
      const dataUrl = await task;
      if (state.pendingPhotoPromise === task) {
        state.pendingPhoto = dataUrl;
        updatePhotoPreview();
        els.catchPhotoStatus.textContent = "写真を添付しました。保存すると記録に残ります。";
      }
      return true;
    } catch (error) {
      els.catchPhotoStatus.textContent = error.message || "写真を添付できませんでした。";
      return false;
    } finally {
      if (state.pendingPhotoPromise === task) state.pendingPhotoPromise = null;
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
        setCatchSpotValue(nearestSpotId(latitude, longitude), true);
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

  function backupDateText(value) {
    if (!value) return "未実施";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "未実施";
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
  }

  function backupReminderState() {
    const count = state.catches.length;
    const lastAt = state.backupMeta?.lastBackupAt || "";
    const lastCount = Number(state.backupMeta?.catchCount || 0);
    const lastTime = lastAt ? new Date(lastAt).getTime() : NaN;
    const days = Number.isFinite(lastTime) ? Math.floor((Date.now() - lastTime) / 86400000) : Infinity;
    const added = Math.max(0, count - lastCount);
    if (count === 0) return { level: "ok", text: "記録が増えたら、バックアップ保存でJSONを残せます。" };
    if (!lastAt || !Number.isFinite(lastTime)) return { level: "warn", text: `記録${count}件。まだバックアップがありません。早めに保存してください。` };
    if (added >= 10) return { level: "warn", text: `前回バックアップから記録が${added}件増えています。バックアップ推奨です。` };
    if (days >= 30) return { level: "warn", text: `最終バックアップから${days}日経っています。バックアップ推奨です。` };
    return { level: "ok", text: `最終バックアップ: ${backupDateText(lastAt)} / 追加記録${added}件` };
  }

  function updateBackupReminder() {
    const info = backupReminderState();
    if (els.backupReminder) {
      els.backupReminder.textContent = info.text;
      els.backupReminder.classList.toggle("is-warning", info.level === "warn");
      els.backupReminder.classList.toggle("is-ok", info.level !== "warn");
    }
    if (els.exportDataButton) {
      els.exportDataButton.classList.toggle("needs-backup", info.level === "warn");
    }
    if (els.backupStatus && !els.backupStatus.dataset.manualMessage) {
      els.backupStatus.textContent = info.text;
    }
  }

  function markBackupExported() {
    state.backupMeta = {
      lastBackupAt: new Date().toISOString(),
      catchCount: state.catches.length,
      spotCount: state.spots.length
    };
    persistBackupMeta();
    updateBackupReminder();
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
      backupMeta: state.backupMeta || {},
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
    markBackupExported();
    if (els.backupStatus) {
      els.backupStatus.dataset.manualMessage = "1";
      els.backupStatus.textContent = "バックアップJSONを書き出しました。次回の釣行前に別の場所へ保管しておくと安心です。";
    }
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
        state.backupMeta = data.backupMeta && typeof data.backupMeta === "object" ? data.backupMeta : { lastBackupAt: data.exportedAt || new Date().toISOString(), catchCount: state.catches.length, spotCount: state.spots.length };
        persistBackupMeta();
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
    document.body.classList.add("menu-open");
    els.menuToggle.setAttribute("aria-expanded", "true");
    invalidateMapSize(260);
  }

  function closeMobileMenu() {
    els.mobileMenu.classList.remove("is-open");
    els.menuBackdrop.classList.remove("is-open");
    document.body.classList.remove("menu-open");
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
    els.recordFilterButtons?.forEach((button) => button.addEventListener("click", () => {
      state.recordFilter = button.dataset.recordFilter || "all";
      els.recordFilterButtons.forEach((b) => b.classList.toggle("is-active", b === button));
      renderCatchList();
    }));
    els.speciesCategoryButtons?.forEach((button) => button.addEventListener("click", () => {
      state.speciesCategoryFilter = button.dataset.speciesCategoryFilter || "all";
      applySpeciesCategoryFilter();
    }));
    els.recordEntryButtons?.forEach((button) => button.addEventListener("click", () => setRecordEntryMode(button.dataset.recordEntryMode)));
    els.spotTab.addEventListener("click", () => { state.activeList = "spots"; renderLists(); });
    els.catchTab.addEventListener("click", () => { state.activeList = "catches"; renderLists(); });
    els.spotList.addEventListener("change", (event) => {
      const input = event.target.closest("input[data-flag-toggle]");
      if (!input) return;
      updateSpotListFlag(input.dataset.spotId, input.dataset.flagToggle, input.checked);
    });
    els.spotList.addEventListener("click", (event) => {
      const speciesButton = event.target.closest("button[data-species-button]");
      if (speciesButton) { openSpotSpeciesPanel(speciesButton.dataset.spotId); return; }
      if (event.target.closest("input[data-flag-toggle], .flag-check, .spot-species-control")) return;
      const openButton = event.target.closest(".spot-open-button");
      if (openButton) {
        event.preventDefault();
        event.stopPropagation();
        focusSpotFromList(openButton.dataset.spotId);
        return;
      }
      const item = event.target.closest(".spot-item[data-spot-id]");
      if (item) {
        event.preventDefault();
        event.stopPropagation();
        focusSpotFromList(item.dataset.spotId);
      }
    });
    els.catchList.addEventListener("click", (event) => {
      const item = event.target.closest("[data-record-id]");
      if (item) openRecordPopup(item.dataset.recordId);
    });
    els.spotCard.addEventListener("change", (event) => {
      if (!state.selectedSpotId) return;
      const input = event.target.closest("input[data-flag]");
      if (!input) return;
      spotState(state.selectedSpotId)[input.dataset.flag] = input.checked;
      persistSavedState();
      renderSpotList();
    });
    document.addEventListener("click", (event) => {
      const closeButton = event.target.closest("button[data-record-popup-close]");
      if (closeButton) {
        event.preventDefault();
        event.stopPropagation();
        try { map?.closePopup?.(); } catch (error) {}
        return;
      }
      const editButton = event.target.closest("button[data-record-edit]");
      if (!editButton) return;
      event.preventDefault();
      event.stopPropagation();
      try { map?.closePopup?.(); } catch (error) {}
      openCatchPanel(editButton.dataset.recordEdit);
    });

    els.spotCard.addEventListener("click", (event) => {
      const speciesButton = event.target.closest("button[data-card-species-button]");
      if (speciesButton && state.selectedSpotId) { openSpotSpeciesPanel(state.selectedSpotId); return; }
      const action = event.target.closest("button[data-action]")?.dataset.action;
      if (!action || !state.selectedSpotId) return;
      const spot = state.spots.find((s) => s.id === state.selectedSpotId);
      if (action === "close") hideSpotCard();
      if (action === "record") openCatchPanel(null, L.latLng(spot.lat, spot.lng), { recordType: "catch" });
      if (action === "verifyPond") { spotState(spot.id).pondVerified = true; persistSavedState(); showSpotCard(spot); renderSpotList(); renderSpotMarkers(); }
      if (action === "unverifyPond") { spotState(spot.id).pondVerified = false; persistSavedState(); showSpotCard(spot); renderSpotList(); renderSpotMarkers(); }
      if (action === "move") startSpotPositionAdjust(spot.id);
      if (action === "resetPosition") resetSpotPosition(spot.id);
      if (action === "edit") openSpotPanel(spot.id);
      if (action === "delete") { els.spotIdInput.value = spot.id; deleteSelectedSpot(); }
    });

    els.spotSpeciesForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      saveSpotSpeciesPanel();
    });
    els.spotSpeciesChoices?.addEventListener("change", syncSpotSpeciesChoiceClasses);
    els.closeSpotSpeciesPanel?.addEventListener("click", closeSpotSpeciesPanel);
    els.cancelSpotSpeciesPanel?.addEventListener("click", closeSpotSpeciesPanel);
    els.clearSpotSpeciesButton?.addEventListener("click", () => {
      spotSpeciesChoiceInputs().forEach((input) => { input.checked = false; });
      syncSpotSpeciesChoiceClasses();
    });
    els.spotSpeciesPanel?.addEventListener("click", (event) => {
      if (event.target === els.spotSpeciesPanel) closeSpotSpeciesPanel();
    });
    els.spotSpeciesForm?.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-spot-species-preset]");
      if (button) applySpotSpeciesPreset(button.dataset.spotSpeciesPreset);
    });

    els.resetView.addEventListener("click", resetMieView);
    els.menuToggle.addEventListener("click", () => {
      if (els.mobileMenu.classList.contains("is-open")) closeMobileMenu(); else openMobileMenu();
    });
    els.closeMenuButton.addEventListener("click", closeMobileMenu);
    els.menuBackdrop.addEventListener("click", closeMobileMenu);
    window.addEventListener("resize", () => {
      setMobileViewportHeight();
      if (window.matchMedia("(min-width: 921px)").matches) closeMobileMenu();
    });
    window.visualViewport?.addEventListener?.("resize", setMobileViewportHeight);
    window.visualViewport?.addEventListener?.("scroll", setMobileViewportHeight);
    els.locateCatchButton.addEventListener("click", () => useCurrentLocationForCatch(true));
    els.useCurrentLocationButton.addEventListener("click", () => useCurrentLocationForCatch(false));
    els.addSpotMode.addEventListener("click", () => setSpotMode(!state.spotMode));
    els.addCatchMode.addEventListener("click", () => setCatchMode(!state.catchMode));
    els.cancelPositionAdjustButton?.addEventListener("click", () => cancelSpotPositionAdjust());

    els.spotForm.addEventListener("submit", saveSpot);
    els.closeSpotPanel.addEventListener("click", closeSpotPanel);
    els.deleteSpot.addEventListener("click", deleteSelectedSpot);
    els.catchForm.addEventListener("submit", saveCatch);
    els.closeCatchPanel.addEventListener("click", closeCatchPanel);
    els.deleteCatch.addEventListener("click", deleteSelectedCatch);
    els.catchRecordType.addEventListener("change", updateRecordTypeUI);
    els.catchSpot?.addEventListener("change", () => {
      setCatchSpotValue(els.catchSpot.value || "", true);
    });
    els.catchSpotPicker?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-catch-spot-picker]");
      if (!button) return;
      setCatchSpotValue(button.dataset.catchSpotPicker || "", true);
    });
    els.catchSpeciesGroup?.addEventListener("change", updateCatchSpeciesValueFromInputs);
    els.catchSpeciesSearch?.addEventListener("input", () => setSpeciesSearch(els.catchSpeciesSearch.value));
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


  let closeStartScreen = () => {};

  function setupStartScreen() {
    const screen = els.appStartScreen;
    const openButton = els.startScreenSkip;
    if (!screen) return;
    let closed = false;
    let launching = false;
    document.body.classList.add("start-screen-active");

    const finish = () => {
      if (!screen) return;
      screen.classList.add("is-hidden");
      screen.setAttribute("aria-hidden", "true");
      screen.removeAttribute("aria-busy");
      document.body.classList.remove("start-screen-active", "start-screen-launching");
      document.body.classList.add("start-screen-done");
      invalidateMapSize(0);
      invalidateMapSize(160);
      invalidateMapSize(520);
    };

    closeStartScreen = (fast = false) => {
      if (closed) return;
      closed = true;
      screen.classList.add("is-closing");
      window.setTimeout(finish, fast ? 360 : 460);
    };

    const launchToMap = () => {
      if (launching || closed) return;
      launching = true;
      screen.classList.add("is-launching");
      screen.setAttribute("aria-busy", "true");
      document.body.classList.add("start-screen-launching");
      if (openButton) {
        openButton.disabled = true;
        openButton.setAttribute("aria-label", "地図を開いています");
      }

      window.setTimeout(() => {
        try { closeMobileMenu(); } catch (error) {}
        try { [els.catchPanel, els.spotPanel, els.backgroundPanel, els.installPanel, els.infoPanel, els.spotSpeciesPanel].forEach(closePanel); } catch (error) {}
        try { hideSpotCard(); } catch (error) {}
        try {
          if (map) {
            map.closePopup();
            map.setView(MIE_CENTER, MIE_HOME_ZOOM, { animate: false });
          }
        } catch (error) {}
        closeStartScreen(true);
      }, 560);
    };

    openButton?.setAttribute("aria-label", "地図を開く");
    openButton?.addEventListener("click", launchToMap);
    openButton?.addEventListener("touchend", (event) => {
      event.preventDefault();
      launchToMap();
    }, { passive: false });

    window.addEventListener("load", () => {
      screen.classList.add("is-ready");
      if (openButton) openButton.disabled = false;
    });
  }


  function setupUiZoomLock() {
    const uiSelector = [
      ".app-start-screen", ".app-start-card",
      ".sidebar", "#mobileMenu", ".controls", ".spot-list", ".catch-list", ".spot-card",
      ".catch-panel", ".catch-form", "#spotPanel", "#catchPanel", "#backgroundPanel", "#installPanel", "#infoPanel",
      ".map-tools", ".mobile-menu-button", ".menu-backdrop", ".leaflet-control-container", ".leaflet-popup"
    ].join(",");

    const isMapSurfaceElement = (element) => {
      if (!element?.closest) return false;
      if (!element.closest("#map")) return false;
      // 地図上のUI部品やポップアップを触っている時は、地図ズームではなくUI操作として扱う。
      if (element.closest(uiSelector)) return false;
      return true;
    };

    const touchPointIsMapSurface = (touch) => {
      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      return isMapSurfaceElement(element);
    };

    const allTouchesAreOnMapSurface = (event) => {
      const touches = event.touches ? Array.from(event.touches) : [];
      if (!touches.length) return isMapSurfaceElement(event.target);
      return touches.every(touchPointIsMapSurface);
    };

    let activePinchStartedOnMap = false;

    // 2本指がメニューやフォームに乗った時は、ブラウザのページ拡大を止める。
    // 2本指が地図本体だけに乗った時はLeafletの地図ズームを通す。
    document.addEventListener("touchstart", (event) => {
      if (!event.touches || event.touches.length < 2) return;
      activePinchStartedOnMap = allTouchesAreOnMapSurface(event);
      if (!activePinchStartedOnMap) event.preventDefault();
    }, { passive: false, capture: true });

    document.addEventListener("touchmove", (event) => {
      if (!event.touches || event.touches.length < 2) return;
      if (!activePinchStartedOnMap || !allTouchesAreOnMapSurface(event)) event.preventDefault();
    }, { passive: false, capture: true });

    document.addEventListener("touchend", (event) => {
      if (!event.touches || event.touches.length < 2) activePinchStartedOnMap = false;
    }, { passive: true, capture: true });

    // iPhone/iPad Safariのgesture系イベントにも対応。captureで先に止める。
    ["gesturestart", "gesturechange", "gestureend"].forEach((eventName) => {
      document.addEventListener(eventName, (event) => {
        if (!activePinchStartedOnMap) event.preventDefault();
      }, { passive: false, capture: true });
    });

    // PCのタッチパッド/マウスでCtrl+ホイールした時も、UI側のブラウザ拡大を止める。
    window.addEventListener("wheel", (event) => {
      if (!event.ctrlKey && !event.metaKey) return;
      if (isMapSurfaceElement(event.target)) return;
      event.preventDefault();
    }, { passive: false, capture: true });

    // Ctrl + ＋ / － / 0 によるブラウザ拡大縮小も止める。地図にフォーカスがある時だけLeafletのキー操作を優先する。
    window.addEventListener("keydown", (event) => {
      if (!event.ctrlKey && !event.metaKey) return;
      const key = String(event.key || "").toLowerCase();
      if (!["+", "=", "-", "_", "0"].includes(key)) return;
      if (isMapSurfaceElement(document.activeElement)) return;
      event.preventDefault();
    }, { passive: false, capture: true });

    // UIボタン周辺のダブルタップ拡大を抑える。地図上のダブルタップ拡大はLeafletに任せる。
    let lastUiTouchEnd = 0;
    document.addEventListener("touchend", (event) => {
      if (isMapSurfaceElement(event.target)) return;
      const now = Date.now();
      if (now - lastUiTouchEnd <= 350) event.preventDefault();
      lastUiTouchEnd = now;
    }, { passive: false, capture: true });
  }



  // v118: 国土地理院ベクトルタイルの「池」注記を、表示中の地図から池候補として追加する。
  // 以前の外部pwa-install.js依存では反映が分かりにくかったため、アプリ本体側で追加して即時描画する。
  let gsiPondDecoderPromise = null;
  let gsiPondScanning = false;

  function setGsiPondStatus(message) {
    if (els.dataStatus) els.dataStatus.textContent = message;
  }

  function normalizeGsiPondName(value) {
    return String(value || "").replace(/[\s\u3000]+/g, "").replace(/[（(].*?[）)]/g, "").trim();
  }

  function hashGsiPondText(value) {
    let hash = 2166136261;
    for (const ch of String(value || "")) {
      hash ^= ch.codePointAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
  }

  function gsiPondDistanceMeters(aLat, aLng, bLat, bLng) {
    const toRad = (value) => Number(value) * Math.PI / 180;
    const radius = 6371000;
    const dLat = toRad(Number(bLat) - Number(aLat));
    const dLng = toRad(Number(bLng) - Number(aLng));
    const s1 = Math.sin(dLat / 2);
    const s2 = Math.sin(dLng / 2);
    const a = s1 * s1 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * s2 * s2;
    return 2 * radius * Math.asin(Math.min(1, Math.sqrt(a)));
  }

  function isGsiPondDuplicate(candidate, existingSpots) {
    const name = normalizeGsiPondName(candidate.name);
    return existingSpots.some((spot) => {
      if (!Number.isFinite(Number(spot.lat)) || !Number.isFinite(Number(spot.lng))) return false;
      const near = gsiPondDistanceMeters(candidate.lat, candidate.lng, Number(spot.lat), Number(spot.lng)) <= 300;
      if (!near) return false;
      const other = normalizeGsiPondName(spot.name);
      return name && other && (name === other || name.includes(other) || other.includes(name));
    });
  }

  function loadGsiPondScript(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[data-gsi-pond-lib="${src}"]`);
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
      script.dataset.gsiPondLib = src;
      script.addEventListener("load", () => { script.dataset.loaded = "true"; resolve(); }, { once: true });
      script.addEventListener("error", () => reject(new Error(`外部ライブラリを読み込めませんでした: ${src}`)), { once: true });
      document.head.appendChild(script);
    });
  }

  async function ensureGsiPondDecoder() {
    if (gsiPondDecoderPromise) return gsiPondDecoderPromise;
    gsiPondDecoderPromise = (async () => {
      if (typeof window.Pbf === "undefined") await loadGsiPondScript(GSI_POND_SCAN_LIBS[0]);
      if (typeof window.VectorTile === "undefined" && typeof window.vectorTile === "undefined") await loadGsiPondScript(GSI_POND_SCAN_LIBS[1]);
      const vectorGlobal = window.VectorTile || window.vectorTile || {};
      const VectorTileCtor = vectorGlobal.VectorTile || vectorGlobal.default || vectorGlobal;
      if (typeof window.Pbf !== "function" || typeof VectorTileCtor !== "function") {
        throw new Error("ベクトルタイル解析ライブラリの準備に失敗しました。通信状態を確認してください。");
      }
      return { Pbf: window.Pbf, VectorTile: VectorTileCtor };
    })();
    return gsiPondDecoderPromise;
  }

  function gsiPondTilePoint(lat, lng, zoom) {
    const latRad = Number(lat) * Math.PI / 180;
    const n = 2 ** zoom;
    return {
      x: Math.floor((Number(lng) + 180) / 360 * n),
      y: Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n)
    };
  }

  function gsiPondTilesForBounds(bounds, zoom) {
    const nw = gsiPondTilePoint(bounds.north, bounds.west, zoom);
    const se = gsiPondTilePoint(bounds.south, bounds.east, zoom);
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

  function collectGsiPondCoordinates(coords, out) {
    if (!Array.isArray(coords)) return;
    if (typeof coords[0] === "number" && typeof coords[1] === "number") {
      out.push(coords);
      return;
    }
    coords.forEach((item) => collectGsiPondCoordinates(item, out));
  }

  function centerOfGsiPondFeature(feature) {
    const coords = [];
    collectGsiPondCoordinates(feature?.geometry?.coordinates, coords);
    if (!coords.length) return null;
    const total = coords.reduce((acc, coord) => ({ lng: acc.lng + Number(coord[0]), lat: acc.lat + Number(coord[1]) }), { lng: 0, lat: 0 });
    const lat = total.lat / coords.length;
    const lng = total.lng / coords.length;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng };
  }

  function gsiPondFeatureName(properties = {}) {
    const preferredKeys = [
      "vt_text", "vtText", "text", "txt", "label", "name", "knj", "kanji", "kj", "title", "caption", "注記", "名称", "種別"
    ];
    for (const key of preferredKeys) {
      const value = String(properties[key] || "").trim();
      if (value && value.includes("池")) return value;
    }
    const candidates = Object.values(properties)
      .map((value) => String(value || "").trim())
      .filter((value) => value.includes("池") && value.length <= 24);
    candidates.sort((a, b) => a.length - b.length);
    return candidates[0] || "";
  }

  function looksLikeGsiPondName(name) {
    const value = String(name || "").replace(/\s+/g, "").trim();
    if (!value || !value.includes("池")) return false;
    if (/池田|池町|池上|池下|池尻|池辺|池側|池畑|池之|小池さん/u.test(value)) return false;
    return /池$|池[（(]|貯水池|調整池|溜池|ため池|大溜|大池|中池|小池|新池|古池|奥池|上池|下池/u.test(value);
  }

  function gsiPondFeatureToSpot(feature, x, y, z, layerName = "") {
    const props = feature?.properties || {};
    const name = gsiPondFeatureName(props);
    if (!looksLikeGsiPondName(name)) return null;
    const geojson = feature.toGeoJSON(x, y, z);
    const center = centerOfGsiPondFeature(geojson);
    if (!center) return null;
    if (center.lat < GSI_MIE_BOUNDS.south || center.lat > GSI_MIE_BOUNDS.north || center.lng < GSI_MIE_BOUNDS.west || center.lng > GSI_MIE_BOUNDS.east) return null;
    const annoCtg = Number(props.annoCtg ?? props.anno_ctg ?? props.annocategory ?? props.ftCode ?? NaN);
    return {
      id: `gsi-pond-${hashGsiPondText(`${name}-${center.lat.toFixed(5)}-${center.lng.toFixed(5)}`)}`,
      name,
      type: "池",
      area: "国土地理院注記",
      lat: Number(center.lat.toFixed(6)),
      lng: Number(center.lng.toFixed(6)),
      zoom: 16,
      source: "国土地理院ベクトルタイル",
      subtype: "池候補",
      candidate: true,
      custom: true,
      memo: "国土地理院ベクトルタイルの注記から追加した池候補です。釣行前に立入禁止・私有地・管理者情報を必ず確認してください。",
      gsiVectorCandidate: true,
      gsiLayer: layerName,
      gsiAnnoCtg: Number.isFinite(annoCtg) ? annoCtg : ""
    };
  }

  function gsiPondUrlForTile(template, tile) {
    return template.replace("{z}", tile.z).replace("{x}", tile.x).replace("{y}", tile.y);
  }

  async function fetchGsiPondWithTimeout(url, options = {}, timeoutMs = GSI_POND_TILE_TIMEOUT_MS) {
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timer = controller ? window.setTimeout(() => controller.abort(), timeoutMs) : null;
    try {
      return await fetch(url, { ...options, signal: controller?.signal });
    } finally {
      if (timer) window.clearTimeout(timer);
    }
  }

  function geoJsonFeatureToSpot(feature, layerName = "geojson") {
    const props = feature?.properties || {};
    const name = gsiPondFeatureName(props);
    if (!looksLikeGsiPondName(name)) return null;
    const center = centerOfGsiPondFeature(feature);
    if (!center) return null;
    if (center.lat < GSI_MIE_BOUNDS.south || center.lat > GSI_MIE_BOUNDS.north || center.lng < GSI_MIE_BOUNDS.west || center.lng > GSI_MIE_BOUNDS.east) return null;
    return {
      id: `gsi-pond-${hashGsiPondText(`${name}-${center.lat.toFixed(5)}-${center.lng.toFixed(5)}`)}`,
      name,
      type: "池",
      area: "国土地理院注記",
      lat: Number(center.lat.toFixed(6)),
      lng: Number(center.lng.toFixed(6)),
      zoom: 16,
      source: "国土地理院ベクトルタイル",
      subtype: "池候補",
      candidate: true,
      custom: true,
      memo: "国土地理院ベクトルタイルの注記から追加した池候補です。釣行前に立入禁止・私有地・管理者情報を必ず確認してください。",
      gsiVectorCandidate: true,
      gsiLayer: layerName
    };
  }

  async function scanGsiPondTile(tile) {
    for (const template of GSI_POND_VECTOR_URLS) {
      const url = gsiPondUrlForTile(template, tile);
      try {
        const response = await fetchGsiPondWithTimeout(url, { cache: "no-store" });
        if (!response.ok) continue;
        if (/\.geojson(?:$|[?#])/i.test(url)) {
          const json = await response.json();
          const features = Array.isArray(json?.features) ? json.features : [];
          return features.map((feature) => geoJsonFeatureToSpot(feature, "geojson")).filter(Boolean);
        }
        const decoder = await ensureGsiPondDecoder();
        const buffer = await response.arrayBuffer();
        if (!buffer || buffer.byteLength === 0) continue;
        const vt = new decoder.VectorTile(new decoder.Pbf(buffer));
        const spots = [];
        Object.entries(vt.layers || {}).forEach(([layerName, layer]) => {
          for (let i = 0; i < layer.length; i += 1) {
            const spot = gsiPondFeatureToSpot(layer.feature(i), tile.x, tile.y, tile.z, layerName);
            if (spot) spots.push(spot);
          }
        });
        return spots;
      } catch (error) {
        console.warn("GSI pond tile fetch/decode failed", tile, url, error);
      }
    }
    return [];
  }

  function currentGsiPondBoundsForScan() {
    if (!map?.getBounds) return null;
    const b = map.getBounds().pad(0.15);
    const bounds = {
      south: Math.max(b.getSouth(), GSI_MIE_BOUNDS.south),
      west: Math.max(b.getWest(), GSI_MIE_BOUNDS.west),
      north: Math.min(b.getNorth(), GSI_MIE_BOUNDS.north),
      east: Math.min(b.getEast(), GSI_MIE_BOUNDS.east)
    };
    if (bounds.south >= bounds.north || bounds.west >= bounds.east) return null;
    return bounds;
  }

  function gsiPondTileSquare(center, zoom, radius = 2) {
    const base = gsiPondTilePoint(center.lat, center.lng, zoom);
    const tiles = [];
    for (let dx = -radius; dx <= radius; dx += 1) {
      for (let dy = -radius; dy <= radius; dy += 1) tiles.push({ x: base.x + dx, y: base.y + dy, z: zoom });
    }
    return tiles;
  }

  function chooseGsiPondScanPlan(bounds) {
    const currentZoom = Math.round(map?.getZoom?.() || 16);
    const center = map?.getCenter?.() || { lat: MIE_CENTER[0], lng: MIE_CENTER[1] };

    // v124: 画面中央に合わせた「○○池」の地図ラベル名を拾いやすくするため、
    // 中央周辺だけを複数ズームで確認する。広範囲取得はスマホで重くなるので避ける。
    const zooms = [...new Set([
      Math.max(14, Math.min(16, currentZoom)),
      16,
      15,
      14
    ])];
    const seen = new Set();
    const tiles = [];
    zooms.forEach((zoom) => {
      gsiPondTileSquare(center, zoom, 1).forEach((tile) => {
        const key = `${tile.z}/${tile.x}/${tile.y}`;
        if (seen.has(key)) return;
        seen.add(key);
        tiles.push(tile);
      });
    });
    return { bounds, zoom: zooms[0], tiles, limitedToCenter: true };
  }

  function gsiPondFallbackSpot(item) {
    return {
      id: `gsi-fallback-pond-${hashGsiPondText(`${item.name}-${Number(item.lat).toFixed(5)}-${Number(item.lng).toFixed(5)}`)}`,
      name: item.name,
      type: "池",
      area: item.area || "三重県内",
      lat: Number(item.lat),
      lng: Number(item.lng),
      zoom: 16,
      source: "地図名池候補リスト（位置未確認）",
      subtype: "池候補",
      candidate: true,
      custom: true,
      memo: "地図ラベルを直接取得できなかった場合の補助候補です。位置は未確認の目安です。釣行前に立入禁止・私有地・管理者情報を必ず確認してください。",
      gsiFallbackCandidate: true
    };
  }

  function gsiPondBoundsContains(bounds, spot, pad = 0.02) {
    if (!bounds) return true;
    return Number(spot.lat) >= bounds.south - pad && Number(spot.lat) <= bounds.north + pad && Number(spot.lng) >= bounds.west - pad && Number(spot.lng) <= bounds.east + pad;
  }

  function fallbackGsiPondCandidates(existing, bounds = null, center = null) {
    const all = GSI_POND_FALLBACK_CANDIDATES
      .map(gsiPondFallbackSpot)
      .filter((spot) => Number.isFinite(spot.lat) && Number.isFinite(spot.lng))
      .filter((spot) => !isGsiPondDuplicate(spot, existing));
    const visible = all.filter((spot) => gsiPondBoundsContains(bounds, spot, 0.05));
    if (visible.length) return visible;
    const c = center || map?.getCenter?.();
    if (!c) return all.slice(0, 12);
    return all
      .map((spot) => ({ spot, distance: gsiPondDistanceMeters(c.lat, c.lng, spot.lat, spot.lng) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 12)
      .map((item) => item.spot);
  }

  function createCenterGsiPondCandidate(name = "") {
    const center = map?.getCenter?.();
    if (!center || !Number.isFinite(Number(center.lat)) || !Number.isFinite(Number(center.lng))) return null;
    const cleanName = normalizeGsiPondName(name);
    if (!looksLikeGsiPondName(cleanName)) return null;
    const lat = Number(Number(center.lat).toFixed(6));
    const lng = Number(Number(center.lng).toFixed(6));
    return {
      id: `manual-center-pond-${hashGsiPondText(`${cleanName}-${lat.toFixed(5)}-${lng.toFixed(5)}`)}`,
      name: cleanName,
      type: "池",
      area: "地図ラベルから追加",
      lat,
      lng,
      zoom: Math.max(16, Math.round(map?.getZoom?.() || 16)),
      source: "地図中央ラベル名",
      subtype: "池候補",
      candidate: true,
      custom: true,
      memo: "地図上の『○○池』ラベルを画面中央に合わせて追加した池候補です。釣行前に立入禁止・私有地・管理者情報を必ず確認してください。",
      gsiCenterAdded: true,
      gsiLabelPrecise: false,
      createdAt: new Date().toISOString()
    };
  }

  function addOrFocusCenterGsiPondCandidate(name) {
    const candidate = createCenterGsiPondCandidate(name);
    if (!candidate) return { changed: [], added: false };
    const normalizedName = normalizeGsiPondName(candidate.name);
    const nearbyIndex = state.customSpots.findIndex((spot) =>
      spot?.candidate && Number.isFinite(Number(spot.lat)) && Number.isFinite(Number(spot.lng)) &&
      normalizeGsiPondName(spot.name) === normalizedName &&
      gsiPondDistanceMeters(candidate.lat, candidate.lng, Number(spot.lat), Number(spot.lng)) <= 450
    );
    if (nearbyIndex >= 0) {
      const updated = { ...state.customSpots[nearbyIndex], ...candidate, id: state.customSpots[nearbyIndex].id, updatedAt: new Date().toISOString() };
      state.customSpots[nearbyIndex] = updated;
      saveJson(CUSTOM_SPOT_STORAGE_KEY, state.customSpots);
      return { changed: [updated], added: false };
    }
    const nearbyExisting = [...state.spots, ...state.customSpots].find((spot) =>
      spot?.candidate && Number.isFinite(Number(spot.lat)) && Number.isFinite(Number(spot.lng)) &&
      normalizeGsiPondName(spot.name) === normalizedName &&
      gsiPondDistanceMeters(candidate.lat, candidate.lng, Number(spot.lat), Number(spot.lng)) <= 450
    );
    if (nearbyExisting) return { changed: [nearbyExisting], added: false };
    state.customSpots = [...state.customSpots, candidate];
    saveJson(CUSTOM_SPOT_STORAGE_KEY, state.customSpots);
    return { changed: [candidate], added: true };
  }

  function promptGsiPondNameFallback() {
    const value = window.prompt("池名を自動取得できませんでした。地図上に見えている池名を入力してください。例：一ノ口池", "");
    const name = normalizeGsiPondName(value);
    if (!name) return "";
    if (!looksLikeGsiPondName(name)) {
      setGsiPondStatus("池名は『一ノ口池』のように、名前に『池』を含めて入力してください。");
      return "";
    }
    return name;
  }

  function nearestGsiPondLabelCandidate(candidates = [], center = null) {
    const c = center || map?.getCenter?.();
    if (!c) return null;
    const zoom = Math.round(map?.getZoom?.() || 16);
    const limitMeters = zoom >= 17 ? 420 : (zoom >= 16 ? 650 : 1000);
    return candidates
      .filter((spot) => spot && looksLikeGsiPondName(spot.name) && Number.isFinite(Number(spot.lat)) && Number.isFinite(Number(spot.lng)))
      .map((spot) => ({ spot, distance: gsiPondDistanceMeters(c.lat, c.lng, Number(spot.lat), Number(spot.lng)) }))
      .filter((item) => item.distance <= limitMeters)
      .sort((a, b) => a.distance - b.distance)[0]?.spot || null;
  }

  function exactGsiPondNameMatch(a, b) {
    const nameA = normalizeGsiPondName(a?.name);
    const nameB = normalizeGsiPondName(b?.name);
    return Boolean(nameA && nameB && nameA === nameB);
  }

  function preciseGsiPondSpot(spot, existing = {}) {
    return {
      ...existing,
      ...spot,
      id: existing.id || spot.id,
      type: "池",
      subtype: "池候補",
      candidate: true,
      custom: true,
      source: "国土地理院地図ラベル位置",
      memo: "表示中の地図ラベルから取得した池候補です。ラベル位置に合わせて登録しています。釣行前に立入禁止・私有地・管理者情報を必ず確認してください。",
      gsiFallbackCandidate: false,
      gsiLabelPrecise: true,
      updatedAt: new Date().toISOString()
    };
  }

  function applyGsiPondLabelResults(candidates = []) {
    const seen = new Set();
    const changed = [];
    const additions = [];
    let customChanged = false;

    candidates.forEach((candidate) => {
      if (!candidate || !Number.isFinite(Number(candidate.lat)) || !Number.isFinite(Number(candidate.lng))) return;
      const key = `${normalizeGsiPondName(candidate.name)}:${Number(candidate.lat).toFixed(5)}:${Number(candidate.lng).toFixed(5)}`;
      if (seen.has(key)) return;
      seen.add(key);

      // v121: 以前の「地図名池候補リスト」でズレた位置に入った同名候補は、新しい地図ラベル位置へ上書きする。
      const customIndex = state.customSpots.findIndex((spot) => exactGsiPondNameMatch(candidate, spot) && (spot.candidate || spot.gsiFallbackCandidate || String(spot.source || "").includes("地図名")));
      if (customIndex >= 0) {
        const updated = preciseGsiPondSpot(candidate, state.customSpots[customIndex]);
        state.customSpots[customIndex] = updated;
        changed.push(updated);
        customChanged = true;
        return;
      }

      // v124: ボタンで先に画面中央へ置いた仮の池候補がある場合、近い地図ラベル名で上書きする。
      const centerAddedIndex = state.customSpots.findIndex((spot) =>
        spot?.gsiCenterAdded && Number.isFinite(Number(spot.lat)) && Number.isFinite(Number(spot.lng)) &&
        gsiPondDistanceMeters(candidate.lat, candidate.lng, Number(spot.lat), Number(spot.lng)) <= 350
      );
      if (centerAddedIndex >= 0) {
        const updated = preciseGsiPondSpot(candidate, state.customSpots[centerAddedIndex]);
        state.customSpots[centerAddedIndex] = updated;
        changed.push(updated);
        customChanged = true;
        return;
      }

      const precise = preciseGsiPondSpot(candidate);
      if (isGsiPondDuplicate(precise, [...state.spots, ...state.customSpots, ...additions])) return;
      additions.push(precise);
      changed.push(precise);
    });

    if (additions.length) {
      state.customSpots = [...state.customSpots, ...additions];
      customChanged = true;
    }
    if (customChanged) saveJson(CUSTOM_SPOT_STORAGE_KEY, state.customSpots);
    return changed;
  }

  function focusGsiPondSpot(spot) {
    if (!spot || !map || !Number.isFinite(Number(spot.lat)) || !Number.isFinite(Number(spot.lng))) return;
    try { closeMobileMenu(); } catch (error) {}
    state.selectedSpotId = spot.id;
    map.setView([Number(spot.lat), Number(spot.lng)], Math.max(17, spot.zoom || 17), { animate: false });
    window.setTimeout(() => {
      const target = state.spots.find((s) => s.id === spot.id) || spot;
      showSpotCard(target);
      renderSpotList();
      try { markers.get(target.id)?.openTooltip?.(); } catch (error) {}
      invalidateMapSize(80);
    }, 80);
  }

  function refreshAfterGsiPondChange(changed, message) {
    if (!changed.length) return;
    state.spots = [...seedSpots.map(applyPositionOverride), ...state.customSpots.map((s) => ({ ...s, custom: true }))];
    state.activeList = "spots";
    state.activeFilter = "池候補";
    els.filterButtons.forEach((filterButton) => filterButton.classList.toggle("is-active", filterButton.dataset.filter === "池候補"));
    render();
    updateBackupReminder();
    setGsiPondStatus(message);
    focusGsiPondSpot(changed[0]);
  }

  function showGsiPondAdditions(additions, message) {
    const changed = applyGsiPondLabelResults(additions);
    refreshAfterGsiPondChange(changed, message);
  }

  async function scanGsiPondCandidates() {
    if (gsiPondScanning) return;
    const bounds = currentGsiPondBoundsForScan() || GSI_MIE_BOUNDS;
    const center = map?.getCenter?.() || { lat: MIE_CENTER[0], lng: MIE_CENTER[1] };
    const plan = chooseGsiPondScanPlan(bounds);
    if (!plan.tiles.length) {
      setGsiPondStatus("三重県内の地図を表示してから押してください。");
      return;
    }

    gsiPondScanning = true;
    const buttons = [...document.querySelectorAll("[data-gsi-pond-scan-button]")];
    const oldTexts = new Map(buttons.map((button) => [button, button.textContent || "地図ラベル名で池候補追加"]));
    buttons.forEach((button) => {
      button.disabled = true;
      button.textContent = "Now Loading...";
    });

    try {
      setGsiPondStatus(`画面中央の池名ラベルを確認中… ${plan.tiles.length}タイル`);

      const found = [];
      const batchSize = 3;
      for (let i = 0; i < plan.tiles.length; i += batchSize) {
        const batch = plan.tiles.slice(i, i + batchSize);
        const results = await Promise.all(batch.map((tile) => scanGsiPondTile(tile).catch((error) => {
          console.warn("GSI pond tile failed", tile, error);
          return [];
        })));
        found.push(...results.flat());
        buttons.forEach((button) => { button.textContent = `確認中 ${Math.min(i + batch.length, plan.tiles.length)}/${plan.tiles.length}`; });
      }

      const nearest = nearestGsiPondLabelCandidate(found, center);
      if (nearest) {
        const changed = applyGsiPondLabelResults([{ ...nearest, lat: Number(nearest.lat), lng: Number(nearest.lng) }]);
        if (changed.length) {
          refreshAfterGsiPondChange(changed, `${changed[0].name} を池候補として追加・更新しました。`);
          return;
        }
        const centerResult = addOrFocusCenterGsiPondCandidate(nearest.name);
        if (centerResult.changed.length) {
          refreshAfterGsiPondChange(centerResult.changed, `${centerResult.changed[0].name} を池候補として追加しました。`);
          return;
        }
      }

      const manualName = promptGsiPondNameFallback();
      if (manualName) {
        const centerResult = addOrFocusCenterGsiPondCandidate(manualName);
        if (centerResult.changed.length) {
          refreshAfterGsiPondChange(centerResult.changed, `${centerResult.changed[0].name} を画面中央の池候補として追加しました。`);
          return;
        }
      }

      setGsiPondStatus("池名ラベルを取得できませんでした。『○○池』の文字を画面中央に大きく表示して、もう一度押してください。");
    } catch (error) {
      console.error("GSI pond candidate scan failed", error);
      const manualName = promptGsiPondNameFallback();
      if (manualName) {
        const centerResult = addOrFocusCenterGsiPondCandidate(manualName);
        if (centerResult.changed.length) {
          refreshAfterGsiPondChange(centerResult.changed, `${centerResult.changed[0].name} を画面中央の池候補として追加しました。`);
          return;
        }
      }
      setGsiPondStatus("池名ラベルを取得できませんでした。通信状態を確認して、もう一度押してください。");
    } finally {
      gsiPondScanning = false;
      buttons.forEach((button) => {
        button.disabled = false;
        button.textContent = oldTexts.get(button) || "地図ラベル名で池候補追加";
      });
    }
  }

  let lastGsiPondButtonPress = 0;

  function handleGsiPondButtonPress(event) {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    const now = Date.now();
    if (now - lastGsiPondButtonPress < 650) return;
    lastGsiPondButtonPress = now;
    scanGsiPondCandidates();
  }

  function bindGsiPondButton(button) {
    if (!button || button.dataset.gsiPondScanBound === "true") return;
    button.dataset.gsiPondScanButton = "1";
    button.dataset.gsiPondScanBound = "true";
    button.addEventListener("click", handleGsiPondButtonPress, { passive: false });
    button.addEventListener("touchend", handleGsiPondButtonPress, { passive: false });
    button.addEventListener("pointerup", handleGsiPondButtonPress, { passive: false });
  }

  function installGsiPondButton() {
    // v127: 池候補追加ボタンは削除。釣り場は「釣り場追加」から手動登録します。
    return;
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
    setupStartScreen();
    setMobileViewportHeight();
    setupUiZoomLock();
    forceFullscreenLayout();
    loadState();
    initMap();
    installGsiPondButton();
    bindEvents();
    applySidebarBackground(localStorage.getItem(BACKGROUND_STORAGE_KEY) || "");
    render();
    forceFullscreenLayout();
    window.addEventListener("load", () => { setMobileViewportHeight(); forceFullscreenLayout(); });
    window.addEventListener("resize", () => { setMobileViewportHeight(); forceFullscreenLayout(); });
    registerServiceWorker();
    els.dataStatus.textContent = `${APP_STATUS_LABEL} / 釣り場${state.spots.length}件 / 記録${state.catches.length}件 / 40up${state.catches.filter(isBigBass).length}件`;
    updateBackupReminder();
  }

  init();
})();
