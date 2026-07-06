(() => {
  "use strict";

  const APP_VERSION = "v89-more-fish-species";

  const STORAGE_KEY = "mie-bass-map-v1";
  const CATCH_STORAGE_KEY = "mie-bass-catches-v1";
  const CUSTOM_SPOT_STORAGE_KEY = "mie-bass-custom-spots-v1";
  const BACKGROUND_STORAGE_KEY = "mie-fishing-map-sidebar-background-v1";
  const POSITION_STORAGE_KEY = "mie-fishing-map-position-overrides-v86";
  const LEGACY_SINGLE_KEY = "mieFishingMap.v1";

  // v89: 釣果記録・釣り場チェックの魚種候補を追加。
  const MIE_CENTER = [34.55, 136.48];
  const MIE_HOME_ZOOM = 9;
  const MAP_MIN_ZOOM = 5;

  const SPOT_SPECIES_OPTIONS = [
    "", "ブラックバス", "ブルーギル", "ナマズ", "ライギョ", "シーバス", "キス", "アジ", "メバル", "カサゴ", "チヌ", "マゴチ", "ヒラメ", "コイ", "フナ", "ヘラブナ", "スモールマウスバス", "ニゴイ", "ウグイ", "オイカワ", "カワムツ", "ハス", "モロコ", "タナゴ", "ワカサギ", "アユ", "アマゴ", "イワナ", "ニジマス", "ウナギ", "ハゼ", "ボラ", "サヨリ", "イワシ", "サバ", "カマス", "タチウオ", "サゴシ", "ハマチ", "ツバス", "ブリ", "マダイ", "グレ", "キビレ", "アイナメ", "ベラ", "ソイ", "タケノコメバル", "アオリイカ", "タコ", "テナガエビ", "その他"
  ];

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
    { id: "shakujo-lake", name: "錫杖湖", type: "ダム", area: "津市芸濃町", lat: 34.806622, lng: 136.378553, zoom: 15, source: "国土地理院", subtype: "ダム湖" },
    { id: "okukahada-lake", name: "奥香肌湖", type: "ダム", area: "松阪市飯高町", lat: 34.376861, lng: 136.196586, zoom: 14, source: "国土地理院", subtype: "ダム湖" },
    { id: "shorenji-lake", name: "青蓮寺湖", type: "ダム", area: "名張市", lat: 34.600869, lng: 136.118850, zoom: 15, source: "国土地理院", subtype: "ダム湖" },
    { id: "hinachi-lake", name: "ひなち湖", type: "ダム", area: "名張市", lat: 34.614467, lng: 136.164028, zoom: 15, source: "国土地理院", subtype: "ダム湖" },
    { id: "nanairo-reservoir", name: "七色貯水池", type: "ダム", area: "熊野市・紀和町周辺", lat: 33.991304, lng: 136.004799, zoom: 14, source: "国土地理院", subtype: "ダム湖" },
    { id: "isaka-reservoir", name: "伊坂貯水池", type: "ダム", area: "四日市市", lat: 35.041625, lng: 136.616311, zoom: 15, source: "国土地理院", subtype: "ダム湖" },
    { id: "gokatsura-pond", name: "五桂池", type: "池", area: "多気町五桂", lat: 34.466625, lng: 136.545533, zoom: 15, source: "三重県ため池DB", candidate: true },
    { id: "ishigaki-pond", name: "石垣池", type: "池", area: "鈴鹿市西玉垣町", lat: 34.856058, lng: 136.564767, zoom: 15, source: "三重県ため池DB", candidate: true },
    { id: "official-pond-001", name: "なめり湖", type: "池", area: "松阪市嬉野森本町", lat: 34.585853, lng: 136.429147, zoom: 16, source: "三重県ため池DB", candidate: true },
    { id: "official-pond-002", name: "真泥池", type: "池", area: "伊賀市真泥", lat: 34.761728, lng: 136.193772, zoom: 16, source: "三重県ため池DB", candidate: true },
    { id: "official-pond-003", name: "滝谷池", type: "池", area: "伊賀市槇山", lat: 34.882522, lng: 136.115892, zoom: 16, source: "三重県ため池DB", candidate: true },
    { id: "official-pond-004", name: "横山池", type: "池", area: "津市芸濃町椋本", lat: 34.815886, lng: 136.419051, zoom: 16, source: "三重県ため池DB", candidate: true },
    { id: "official-pond-005", name: "風早池", type: "池", area: "津市戸木町", lat: 34.689244, lng: 136.453000, zoom: 16, source: "三重県ため池DB", candidate: true },
    { id: "official-pond-006", name: "笠田大溜", type: "池", area: "いなべ市員弁町笠田新田", lat: 35.130256, lng: 136.559475, zoom: 16, source: "三重県ため池DB", candidate: true },
    { id: "official-pond-007", name: "大正池", type: "池", area: "伊賀市丸柱", lat: 34.856969, lng: 136.135019, zoom: 16, source: "三重県ため池DB", candidate: true },
    { id: "official-pond-008", name: "古田池", type: "池", area: "松阪市嬉野宮野町", lat: 34.612864, lng: 136.407917, zoom: 16, source: "三重県ため池DB", candidate: true },
    { id: "official-pond-009", name: "津賀池", type: "池", area: "鈴鹿市津賀町", lat: 34.897558, lng: 136.508433, zoom: 16, source: "三重県ため池DB", candidate: true },
    { id: "official-pond-010", name: "惣谷池", type: "池", area: "津市白山町上ﾉ村", lat: 34.677294, lng: 136.324125, zoom: 16, source: "三重県ため池DB", candidate: true },
    { id: "official-pond-011", name: "牛尾崎池", type: "池", area: "度会郡玉城町上田辺", lat: 34.498581, lng: 136.620492, zoom: 16, source: "三重県ため池DB", candidate: true },
    { id: "official-pond-012", name: "大杣池", type: "池", area: "伊賀市柘植町", lat: 34.843558, lng: 136.283369, zoom: 16, source: "三重県ため池DB", candidate: true },
    { id: "official-pond-013", name: "鴉山池", type: "池", area: "伊賀市柘植町", lat: 34.842808, lng: 136.274119, zoom: 16, source: "三重県ため池DB", candidate: true },
    { id: "official-pond-014", name: "七郷池", type: "池", area: "津市安濃町草生", lat: 34.752133, lng: 136.415111, zoom: 16, source: "三重県ため池DB", candidate: true },
    { id: "official-pond-015", name: "高束池", type: "池", area: "松阪市飯南町粥見", lat: 34.444714, lng: 136.366378, zoom: 16, source: "三重県ため池DB", candidate: true },
    { id: "official-pond-016", name: "汁谷池", type: "池", area: "度会郡玉城町宮古", lat: 34.458917, lng: 136.628175, zoom: 16, source: "三重県ため池DB", candidate: true },
    { id: "official-pond-017", name: "竹谷池", type: "池", area: "伊賀市柘植町", lat: 34.834647, lng: 136.261289, zoom: 16, source: "三重県ため池DB", candidate: true },
    { id: "official-pond-018", name: "両ヶ池", type: "池", area: "いなべ市大安町平塚", lat: 35.103506, lng: 136.526503, zoom: 16, source: "三重県ため池DB", candidate: true },
    { id: "official-pond-019", name: "山田池", type: "池", area: "津市森町北谷", lat: 34.686578, lng: 136.422500, zoom: 16, source: "三重県ため池DB", candidate: true },
    { id: "official-pond-020", name: "嘉古部池", type: "池", area: "津市美里町三郷", lat: 34.729759, lng: 136.393052, zoom: 16, source: "三重県ため池DB", candidate: true },
    { id: "nanairo-dam", name: "七色ダム", type: "ダム", area: "熊野市・紀和町周辺", lat: 33.962596, lng: 136.002566, zoom: 14 },
    { id: "port-yokkaichi", name: "四日市港", type: "港", area: "四日市市", lat: 34.9577, lng: 136.6421, zoom: 15 },
    { id: "port-shiroko", name: "白子漁港", type: "港", area: "鈴鹿市白子", lat: 34.8288, lng: 136.6048, zoom: 17 },
    { id: "port-tsu", name: "津港", type: "港", area: "津市なぎさまち周辺", lat: 34.7276, lng: 136.5311, zoom: 16 },
    { id: "port-matsusaka", name: "松阪港", type: "港", area: "松阪市大口町周辺", lat: 34.5987, lng: 136.5829, zoom: 16 },
    { id: "port-toba", name: "鳥羽港", type: "港", area: "鳥羽市鳥羽", lat: 34.4868, lng: 136.8462, zoom: 16 },
    { id: "port-owase", name: "尾鷲港", type: "港", area: "尾鷲市", lat: 34.0713, lng: 136.2025, zoom: 16 },
    { id: "marina-kawage", name: "マリーナ河芸", type: "マリーナ", area: "津市河芸町東千里", lat: 34.798339, lng: 136.562838, zoom: 18 },
    { id: "marina-tsu-yacht", name: "津ヨットハーバー", type: "マリーナ", area: "津市津興", lat: 34.708344, lng: 136.524048, zoom: 17 },
    { id: "marina-toba", name: "鳥羽マリーナ", type: "マリーナ", area: "鳥羽市千賀町", lat: 34.388732, lng: 136.880716, zoom: 17 },
    { id: "kawakami-dam", name: "川上ダム", type: "ダム", area: "伊賀市", lat: 34.7003, lng: 136.1404, zoom: 15, source: "国土地理院目視調整" },
    { id: "nakazato-dam", name: "中里ダム", type: "ダム", area: "いなべ市藤原町", lat: 35.1516, lng: 136.4997, zoom: 15, source: "国土地理院目視調整" },
    { id: "nagaragawa-estuary-barrage", name: "長良川河口堰", type: "ダム", area: "桑名市長島町", lat: 35.0707, lng: 136.6917, zoom: 15, source: "国土地理院目視調整" },
    { id: "kasado-reservoir", name: "加佐登調整池", type: "池", area: "鈴鹿市加佐登", lat: 34.8874, lng: 136.5315, zoom: 16, source: "国土地理院目視調整", candidate: true },
    { id: "kameyama-sunshine-pond", name: "亀山サンシャインパーク池", type: "池", area: "亀山市布気町", lat: 34.8578, lng: 136.4848, zoom: 16, source: "国土地理院目視調整", candidate: true },
    { id: "kameyama-park-pond", name: "亀山公園池", type: "池", area: "亀山市若山町", lat: 34.8587, lng: 136.4527, zoom: 16, source: "国土地理院目視調整", candidate: true },
    { id: "nanbu-kyuryo-park-pond", name: "南部丘陵公園池", type: "池", area: "四日市市波木町", lat: 34.9398, lng: 136.5825, zoom: 16, source: "国土地理院目視調整", candidate: true },
    { id: "tarusaka-park-pond", name: "垂坂公園池", type: "池", area: "四日市市垂坂町", lat: 35.0115, lng: 136.6122, zoom: 16, source: "国土地理院目視調整", candidate: true },
    { id: "chusei-green-park-pond", name: "中勢グリーンパーク池", type: "池", area: "津市あのつ台", lat: 34.7601, lng: 136.5022, zoom: 16, source: "国土地理院目視調整", candidate: true },
    { id: "mie-prefectural-forest-pond", name: "三重県民の森池", type: "池", area: "菰野町千草", lat: 35.0335, lng: 136.4594, zoom: 16, source: "国土地理院目視調整", candidate: true },
    { id: "daibutsuyama-park-pond", name: "大仏山公園池", type: "池", area: "明和町・伊勢市周辺", lat: 34.5136, lng: 136.6367, zoom: 16, source: "国土地理院目視調整", candidate: true },
    { id: "kuwana-port", name: "桑名港", type: "港", area: "桑名市", lat: 35.0639, lng: 136.7005, zoom: 16, source: "国土地理院文字位置目安" },
    { id: "tomisu-hara-port", name: "富洲原港", type: "港", area: "四日市市富洲原", lat: 35.0108, lng: 136.6639, zoom: 16, source: "国土地理院文字位置目安" },
    { id: "kasumigaura-wharf", name: "霞ヶ浦ふ頭", type: "港", area: "四日市市霞", lat: 34.9727, lng: 136.6483, zoom: 16, source: "国土地理院文字位置目安" },
    { id: "isodu-fishing-port", name: "磯津漁港", type: "港", area: "四日市市磯津", lat: 34.9033, lng: 136.6402, zoom: 16, source: "国土地理院文字位置目安" },
    { id: "kusu-fishing-port", name: "楠漁港", type: "港", area: "四日市市楠町", lat: 34.8969, lng: 136.6322, zoom: 16, source: "国土地理院文字位置目安" },
    { id: "chiyozaki-fishing-port", name: "千代崎漁港", type: "港", area: "鈴鹿市南若松町", lat: 34.8481, lng: 136.6214, zoom: 16, source: "国土地理院文字位置目安" },
    { id: "kawage-fishing-port", name: "河芸漁港", type: "港", area: "津市河芸町", lat: 34.8038, lng: 136.5699, zoom: 16, source: "国土地理院文字位置目安" },
    { id: "karasu-fishing-port", name: "香良洲漁港", type: "港", area: "津市香良洲町", lat: 34.6665, lng: 136.5386, zoom: 16, source: "国土地理院文字位置目安" },
    { id: "oyodo-fishing-port", name: "大淀漁港", type: "港", area: "明和町大淀", lat: 34.5402, lng: 136.6570, zoom: 16, source: "国土地理院文字位置目安" },
    { id: "futami-fishing-port", name: "二見浦漁港", type: "港", area: "伊勢市二見町", lat: 34.5102, lng: 136.7812, zoom: 16, source: "国土地理院文字位置目安" },
    { id: "matsushita-fishing-port", name: "松下漁港", type: "港", area: "伊勢市二見町松下", lat: 34.5041, lng: 136.8035, zoom: 16, source: "国土地理院文字位置目安" },
    { id: "sakate-port", name: "坂手港", type: "港", area: "鳥羽市坂手町", lat: 34.4851, lng: 136.8625, zoom: 16, source: "国土地理院文字位置目安" },
    { id: "arashima-fishing-port", name: "安楽島漁港", type: "港", area: "鳥羽市安楽島町", lat: 34.4759, lng: 136.8659, zoom: 16, source: "国土地理院文字位置目安" },
    { id: "ijika-fishing-port", name: "石鏡漁港", type: "港", area: "鳥羽市石鏡町", lat: 34.4478, lng: 136.9219, zoom: 16, source: "国土地理院文字位置目安" },
    { id: "kunizaki-fishing-port", name: "国崎漁港", type: "港", area: "鳥羽市国崎町", lat: 34.4193, lng: 136.9230, zoom: 16, source: "国土地理院文字位置目安" },
    { id: "osatsu-fishing-port", name: "相差漁港", type: "港", area: "鳥羽市相差町", lat: 34.3890, lng: 136.9053, zoom: 16, source: "国土地理院文字位置目安" },
    { id: "nakiri-fishing-port", name: "波切漁港", type: "港", area: "志摩市大王町波切", lat: 34.2761, lng: 136.8990, zoom: 16, source: "国土地理院文字位置目安" },
    { id: "katada-fishing-port", name: "片田漁港", type: "港", area: "志摩市志摩町片田", lat: 34.2498, lng: 136.8394, zoom: 16, source: "国土地理院文字位置目安" },
    { id: "wagu-fishing-port", name: "和具漁港", type: "港", area: "志摩市志摩町和具", lat: 34.2526, lng: 136.7877, zoom: 16, source: "国土地理院文字位置目安" },
    { id: "hamajima-port", name: "浜島港", type: "港", area: "志摩市浜島町", lat: 34.2975, lng: 136.7580, zoom: 16, source: "国土地理院文字位置目安" },
    { id: "gokasho-port", name: "五ヶ所浦漁港", type: "港", area: "南伊勢町五ヶ所浦", lat: 34.3510, lng: 136.7013, zoom: 16, source: "国土地理院文字位置目安" },
    { id: "nishiki-fishing-port", name: "錦漁港", type: "港", area: "大紀町錦", lat: 34.2116, lng: 136.3969, zoom: 16, source: "国土地理院文字位置目安" },
    { id: "kiinagashima-port", name: "紀伊長島港", type: "港", area: "紀北町長島", lat: 34.2080, lng: 136.3372, zoom: 16, source: "国土地理院文字位置目安" },
    { id: "hikimoto-port", name: "引本港", type: "港", area: "紀北町引本浦", lat: 34.1306, lng: 136.2361, zoom: 16, source: "国土地理院文字位置目安" },
    { id: "kuki-fishing-port", name: "九鬼漁港", type: "港", area: "尾鷲市九鬼町", lat: 33.9965, lng: 136.2517, zoom: 16, source: "国土地理院文字位置目安" },
    { id: "kata-port", name: "賀田港", type: "港", area: "尾鷲市賀田町", lat: 33.9724, lng: 136.2214, zoom: 16, source: "国土地理院文字位置目安" },
    { id: "atashika-port", name: "新鹿港", type: "港", area: "熊野市新鹿町", lat: 33.9309, lng: 136.1404, zoom: 16, source: "国土地理院文字位置目安" },
    { id: "kinomoto-port", name: "木本港", type: "港", area: "熊野市木本町", lat: 33.8898, lng: 136.1016, zoom: 16, source: "国土地理院文字位置目安" },
    { id: "udono-port", name: "鵜殿港", type: "港", area: "紀宝町鵜殿", lat: 33.7338, lng: 136.0120, zoom: 16, source: "国土地理院文字位置目安" }
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
  function persistPositionOverrides() { saveJson(POSITION_STORAGE_KEY, state.positionOverrides); }

  function initEls() {
    [
      "searchInput", "visibleCount", "spotList", "catchList", "spotListHead", "catchListHead", "spotTab", "catchTab",
      "spotCount", "recordCount", "bigBassCount", "dataStatus", "spotCard", "mobileMenu", "menuToggle", "menuBackdrop", "closeMenuButton",
      "resetView", "locateCatchButton", "addSpotMode", "addCatchMode", "positionAdjustBanner", "positionAdjustText", "cancelPositionAdjustButton", "spotPanel", "spotForm", "spotLat", "spotLng", "spotIdInput",
      "spotNameInput", "spotTypeInput", "spotAreaInput", "spotMemoInput", "deleteSpot", "closeSpotPanel",
      "catchPanel", "catchForm", "catchLat", "catchLng", "catchIdInput", "catchLocationStatus", "useCurrentLocationButton",
      "catchRecordType", "catchPlaceKind", "catchPlaceName", "catchSpot", "catchTime", "catchSpecies", "catchSpeciesGroup", "catchBait", "catchLureName",
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

    els.dataStatus.textContent = "v89・魚種追加";

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
    els.dataStatus.textContent = state.spotMode ? "地図をタップして釣り場を追加します。" : "v89・魚種追加";
  }

  function setCatchMode(value) {
    state.positionAdjustSpotId = null;
    updatePositionAdjustBanner();
    state.catchMode = Boolean(value);
    if (state.catchMode) state.spotMode = false;
    els.addSpotMode.classList.toggle("is-active", state.spotMode);
    els.addCatchMode.classList.toggle("is-active", state.catchMode);
    els.dataStatus.textContent = state.catchMode ? "地図をタップして記録ピンを追加します。" : "v89・魚種追加";
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
      let typeOk = state.activeFilter === "all" || spot.type === state.activeFilter;
      if (state.activeFilter === "池候補") typeOk = candidate;
      const s = spotState(spot.id);
      const text = [spot.name, spot.area, spot.memo, spot.type, spot.source, candidate ? "池候補 未確認" : "", s.species, s.memo].join(" ").toLowerCase();
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

  function spotSpeciesControl(spotId, species) {
    return `<label class="spot-species-control ${species ? "on" : ""}" title="魚種を選択">
      <select class="spot-species-select" data-species-select="1" data-spot-id="${escapeHtml(spotId)}" aria-label="魚種を選択">
        ${speciesOptionsHtml(species)}
      </select>
    </label>`;
  }

  function catchSpeciesInputs() {
    return els.catchSpeciesGroup ? [...els.catchSpeciesGroup.querySelectorAll("input[data-catch-species-option]")] : [];
  }

  function ensureCatchSpeciesOptions(names = []) {
    if (!els.catchSpeciesGroup) return;
    const existing = new Set(catchSpeciesInputs().map((input) => input.value));
    names.forEach((name) => {
      const value = String(name || "").trim();
      if (!value || existing.has(value)) return;
      const label = document.createElement("label");
      label.innerHTML = `<input type="checkbox" data-catch-species-option value="${escapeHtml(value)}"><span>${escapeHtml(value)}</span>`;
      els.catchSpeciesGroup.appendChild(label);
      existing.add(value);
    });
  }

  function syncCatchSpeciesClasses() {
    catchSpeciesInputs().forEach((input) => {
      input.closest("label")?.classList.toggle("is-selected", input.checked);
    });
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
        <button class="spot-main spot-open-button" type="button" data-spot-id="${escapeHtml(spot.id)}" aria-label="${escapeHtml(spot.name)}を地図で開く"><strong>${escapeHtml(spot.name)}${candidate ? '<span class="candidate-badge">候補</span>' : ""}</strong><small>${escapeHtml(spotTypeText(spot))} / ${escapeHtml(spot.area || "地名未設定")}</small></button>
        ${spotFlagControl(spot.id, "caught", Boolean(s.caught), "釣れた", "✓")}
        ${spotSpeciesControl(spot.id, s.species)}
        ${spotFlagControl(spot.id, "noFishing", Boolean(s.noFishing), "禁止", "禁", "—", true)}
        ${spotFlagControl(spot.id, "parking", Boolean(s.parking), "駐車", "P")}
      </div>`;
    }).join("") : '<p class="empty">該当する釣り場がありません。</p>';
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
    s.species = String(species || "").trim();
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
    try { [els.catchPanel, els.spotPanel, els.backgroundPanel, els.installPanel, els.infoPanel].forEach(closePanel); } catch (error) {}
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
        markers.get(spot.id).setLatLng(latlng).setIcon(makeSpotIcon(spot));
        return;
      }
      const marker = L.marker(latlng, { icon: makeSpotIcon(spot) }).addTo(map);
      marker.bindPopup(`<strong>${escapeHtml(spot.name)}</strong><br>${escapeHtml(spotTypeText(spot))} / ${escapeHtml(spot.area || "")}${isPondCandidate(spot) ? "<br>未確認の池候補" : ""}`);
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
      marker.bindPopup(recordPopupInfo(record, index), { maxWidth: 320, className: "record-info-popup" });
      marker.on("click", () => openRecordPopup(record.id));
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
        <label class="spot-card-species"><span>魚種</span><select data-card-species="1" aria-label="魚種を選択">${speciesOptionsHtml(s.species)}</select></label>
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
    setCatchLocationStatus(lat, lng);
    els.deleteCatch.classList.toggle("is-hidden", !record);
    openPanel(els.catchPanel);
  }

  function closeCatchPanel() {
    closePanel(els.catchPanel);
    els.catchForm.reset();
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
    els.spotTab.addEventListener("click", () => { state.activeList = "spots"; renderLists(); });
    els.catchTab.addEventListener("click", () => { state.activeList = "catches"; renderLists(); });
    els.spotList.addEventListener("change", (event) => {
      const select = event.target.closest("select[data-species-select]");
      if (select) { updateSpotSpecies(select.dataset.spotId, select.value); return; }
      const input = event.target.closest("input[data-flag-toggle]");
      if (!input) return;
      updateSpotListFlag(input.dataset.spotId, input.dataset.flagToggle, input.checked);
    });
    els.spotList.addEventListener("click", (event) => {
      if (event.target.closest("input[data-flag-toggle], select[data-species-select], .flag-check, .spot-species-control")) return;
      const item = event.target.closest("[data-spot-id]");
      if (item) selectSpot(item.dataset.spotId);
    });
    els.catchList.addEventListener("click", (event) => {
      const item = event.target.closest("[data-record-id]");
      if (item) openRecordPopup(item.dataset.recordId);
    });
    els.spotCard.addEventListener("change", (event) => {
      if (!state.selectedSpotId) return;
      const speciesSelect = event.target.closest("select[data-card-species]");
      if (speciesSelect) { updateSpotSpecies(state.selectedSpotId, speciesSelect.value); return; }
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
    els.catchSpeciesGroup?.addEventListener("change", updateCatchSpeciesValueFromInputs);
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
    setMobileViewportHeight();
    forceFullscreenLayout();
    loadState();
    initMap();
    bindEvents();
    applySidebarBackground(localStorage.getItem(BACKGROUND_STORAGE_KEY) || "");
    render();
    forceFullscreenLayout();
    window.addEventListener("load", () => { setMobileViewportHeight(); forceFullscreenLayout(); });
    window.addEventListener("resize", () => { setMobileViewportHeight(); forceFullscreenLayout(); });
    registerServiceWorker();
    els.dataStatus.textContent = `v89・魚種追加 / 釣り場${state.spots.length}件 / 記録${state.catches.length}件 / 40up${state.catches.filter(isBigBass).length}件`;
  }

  init();
})();
