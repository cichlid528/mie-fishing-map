const STORAGE_KEY = "mie-bass-map-v1";
const CATCH_STORAGE_KEY = "mie-bass-catches-v1";
const CUSTOM_SPOT_STORAGE_KEY = "mie-bass-custom-spots-v1";
const LOCATION_PIN_STORAGE_KEY = "mie-map-location-pins-v1";
const BACKGROUND_DB_NAME = "mie-fishing-map-settings";
const BACKGROUND_DB_STORE = "appearance";
const BACKGROUND_DB_KEY = "sidebar-background";

// 国土地理院の名称検索で同名地点を確認できた座標に合わせています。
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
  { id: "official-pond-021", name: "榊原池", type: "池", area: "津市榊原町", lat: 34.698239, lng: 136.327319, zoom: 16, source: "三重県ため池DB" },
  { id: "official-pond-022", name: "寺井池", type: "池", area: "鈴鹿市下大久保", lat: 34.931158, lng: 136.519569, zoom: 16, source: "三重県ため池DB" },
  { id: "official-pond-023", name: "祓川池", type: "池", area: "鈴鹿市野村町", lat: 34.849142, lng: 136.559822, zoom: 16, source: "三重県ため池DB" },
  { id: "official-pond-024", name: "浄土池", type: "池", area: "鈴鹿市稲生町", lat: 34.852836, lng: 136.554961, zoom: 16, source: "三重県ため池DB" },
  { id: "official-pond-025", name: "奈良池", type: "池", area: "鈴鹿市住吉町", lat: 34.854475, lng: 136.530906, zoom: 16, source: "三重県ため池DB" },
  { id: "official-pond-026", name: "安部池", type: "池", area: "津市安濃町草生", lat: 34.755817, lng: 136.415942, zoom: 16, source: "三重県ため池DB" },
  { id: "official-pond-027", name: "大野木池", type: "池", area: "度会郡度会町大野木", lat: 34.447333, lng: 136.635758, zoom: 16, source: "三重県ため池DB" },
  { id: "official-pond-028", name: "八重田池", type: "池", area: "松阪市八重田町馬立", lat: 34.564208, lng: 136.486642, zoom: 16, source: "三重県ため池DB" },
  { id: "official-pond-029", name: "岩田池", type: "池", area: "津市岩田", lat: 34.699442, lng: 136.502875, zoom: 16, source: "三重県ため池DB" },
  { id: "official-pond-030", name: "藤溜", type: "池", area: "いなべ市員弁町大泉", lat: 35.117617, lng: 136.577586, zoom: 16, source: "三重県ため池DB" },
  { id: "official-pond-031", name: "捨田池", type: "池", area: "松阪市嬉野黒野町", lat: 34.592003, lng: 136.482611, zoom: 16, source: "三重県ため池DB" },
  { id: "official-pond-032", name: "蛇喰池", type: "池", area: "伊賀市愛田", lat: 34.803450, lng: 136.243272, zoom: 16, source: "三重県ため池DB" },
  { id: "official-pond-033", name: "馬場谷池", type: "池", area: "伊賀市柘植町", lat: 34.839753, lng: 136.274258, zoom: 16, source: "三重県ため池DB" },
  { id: "official-pond-034", name: "丸竹池", type: "池", area: "鈴鹿市国府町", lat: 34.845419, lng: 136.523656, zoom: 16, source: "三重県ため池DB" },
  { id: "official-pond-035", name: "佐倉池", type: "池", area: "津市片田井戸町", lat: 34.698772, lng: 136.446028, zoom: 16, source: "三重県ため池DB" },
  { id: "official-pond-036", name: "田野池", type: "池", area: "津市芸濃町萩野", lat: 34.801844, lng: 136.443497, zoom: 16, source: "三重県ため池DB" },
  { id: "official-pond-037", name: "黒岩池", type: "池", area: "南牟婁郡御浜町下市木", lat: 33.841811, lng: 136.045253, zoom: 16, source: "三重県ため池DB" },
  { id: "official-pond-038", name: "笹原池", type: "池", area: "伊勢市佐八町", lat: 34.457028, lng: 136.662731, zoom: 16, source: "三重県ため池DB" },
  { id: "official-pond-039", name: "落合池", type: "池", area: "伊勢市佐八町", lat: 34.459114, lng: 136.675336, zoom: 16, source: "三重県ため池DB" },
  { id: "official-pond-040", name: "鐘突池", type: "池", area: "松阪市中万町", lat: 34.518989, lng: 136.544353, zoom: 16, source: "三重県ため池DB" },
  { id: "official-pond-041", name: "大釜池", type: "池", area: "津市神戸", lat: 34.694717, lng: 136.476778, zoom: 16, source: "三重県ため池DB" },
  { id: "official-pond-042", name: "畑新田溜", type: "池", area: "いなべ市員弁町畑新田", lat: 35.123794, lng: 136.569578, zoom: 16, source: "三重県ため池DB" },
  { id: "official-pond-043", name: "山上池", type: "池", area: "鈴鹿市西玉垣町", lat: 34.862225, lng: 136.582433, zoom: 16, source: "三重県ため池DB" },
  { id: "nanairo-dam", name: "七色ダム", type: "ダム", area: "熊野市・紀和町周辺", lat: 33.962596, lng: 136.002566, zoom: 14 },
  { id: "isozu-port", name: "磯津漁港", type: "漁港", area: "四日市市塩浜・楠町吉崎", lat: 34.929185, lng: 136.648500, zoom: 15, source: "三重県 漁港一覧・国土地理院" },
  { id: "wakamatsu-port", name: "若松漁港", type: "漁港", area: "鈴鹿市若松", lat: 34.865365, lng: 136.620509, zoom: 15, source: "三重県 漁港一覧・国土地理院" },
  { id: "shiroko-port", name: "白子漁港", type: "漁港", area: "鈴鹿市白子", lat: 34.828600, lng: 136.596500, zoom: 15, source: "三重県 漁港一覧・国土地理院" },
  { id: "shiratsuka-port", name: "白塚漁港", type: "漁港", area: "津市白塚町・河芸町一色", lat: 34.768000, lng: 136.548000, zoom: 15, source: "三重県 漁港一覧・国土地理院" },
  { id: "karasu-port", name: "香良洲漁港", type: "漁港", area: "津市香良洲町", lat: 34.661000, lng: 136.552250, zoom: 15, source: "三重県 漁港一覧・国土地理院" },
  { id: "matsugasaki-port", name: "松ヶ崎漁港", type: "漁港", area: "松阪市松崎浦町", lat: 34.621000, lng: 136.555000, zoom: 15, source: "三重県 漁港一覧・国土地理院" },
  { id: "ryoshi-port", name: "猟師漁港", type: "漁港", area: "松阪市猟師町", lat: 34.603650, lng: 136.560000, zoom: 15, source: "三重県 漁港一覧・国土地理院" },
  { id: "shimomiito-port", name: "下御糸漁港", type: "漁港", area: "多気郡明和町", lat: 34.558800, lng: 136.658000, zoom: 15, source: "三重県 漁港一覧・国土地理院" },
  { id: "oizu-port", name: "大淀漁港", type: "漁港", area: "多気郡明和町大淀", lat: 34.529500, lng: 136.683000, zoom: 15, source: "三重県 漁港一覧・国土地理院" },
  { id: "muramatsu-port", name: "村松漁港", type: "漁港", area: "伊勢市村松町", lat: 34.515000, lng: 136.722000, zoom: 15, source: "三重県 漁港一覧・国土地理院" },
  { id: "yokkaichi-harbor", name: "四日市港", type: "港", area: "四日市市・三重郡川越町", lat: 34.9553109, lng: 136.6449348, zoom: 16, source: "地図名称位置（2026年7月確認）" },
  { id: "tsu-matsusaka-harbor", name: "松阪港（津松阪港）", type: "港", area: "松阪市大口町", lat: 34.6133673, lng: 136.5587269, zoom: 16, source: "地図名称位置（2026年7月確認）" },
  { id: "owase-harbor", name: "尾鷲港", type: "港", area: "尾鷲市", lat: 34.0741243, lng: 136.2048044, zoom: 16, source: "地図名称位置（2026年7月確認）" },
  { id: "kuwana-harbor", name: "桑名港", type: "港", area: "桑名市外堀", lat: 35.0610533, lng: 136.6929696, zoom: 16, source: "地図名称位置（2026年7月確認）" },
  { id: "chiyozaki-harbor", name: "千代崎港", type: "港", area: "鈴鹿市中若松町", lat: 34.8546490, lng: 136.6152344, zoom: 16, source: "地図名称位置（2026年7月確認）" },
  { id: "ujiyamada-harbor", name: "宇治山田港", type: "港", area: "伊勢市", lat: 34.5236329, lng: 136.7432210, zoom: 16, source: "地図名称位置（2026年7月確認）" },
  { id: "toba-harbor", name: "鳥羽港", type: "港", area: "鳥羽市", lat: 34.4802944, lng: 136.8467641, zoom: 16, source: "地図名称位置（2026年7月確認）" },
  { id: "kashikojima-harbor", name: "賢島港", type: "港", area: "志摩市", lat: 34.3074066, lng: 136.8188755, zoom: 16, source: "地図名称位置（2026年7月確認）" },
  { id: "hamajima-harbor", name: "浜島港", type: "港", area: "志摩市浜島町", lat: 34.2977415, lng: 136.7595214, zoom: 16, source: "地図名称位置（2026年7月確認）" },
  { id: "udono-harbor", name: "鵜殿港", type: "港", area: "南牟婁郡紀宝町", lat: 33.7330007, lng: 136.0155256, zoom: 16, source: "地図名称位置（2026年7月確認）" },
  { id: "tsu-yacht-harbor-marina", name: "津ヨットハーバー", type: "マリーナ", area: "津市津興", lat: 34.7085275, lng: 136.5233700, zoom: 17, memo: "伊勢湾海洋スポーツセンター。ヨット・ボート体験やスクールを実施。", source: "地図名称位置・施設公式" },
  { id: "marina-kawage-marina", name: "マリーナ河芸", type: "マリーナ", area: "津市河芸町東千里", lat: 34.8007085, lng: 136.5626337, zoom: 17, memo: "伊勢湾に面したマリーナと海辺のレジャースポット。", source: "地図名称位置・施設公式" },
  { id: "ise-shima-marina", name: "WestCove伊勢志摩マリーナ", type: "マリーナ", area: "度会郡南伊勢町船越", lat: 34.3363278, lng: 136.6830094, zoom: 17, memo: "五ヶ所湾に面したヨット・ボートのリゾートマリーナ。", source: "地図名称位置・施設公式" },
  { id: "toba-marina", name: "鳥羽マリーナ", type: "マリーナ", area: "鳥羽市千賀町", lat: 34.3887081, lng: 136.8807123, zoom: 17, memo: "的矢湾に位置するヨット・ボート向けマリーナ。", source: "地図名称位置・施設公式" },
  { id: "nemu-resort-marina", name: "NEMU RESORT マリーナ", type: "マリーナ", area: "志摩市浜島町迫子", lat: 34.2955310, lng: 136.7993228, zoom: 17, memo: "英虞湾に面したリゾート内のマリーナ。", source: "地図名称位置・施設公式" }
];

let customSpots = JSON.parse(localStorage.getItem(CUSTOM_SPOT_STORAGE_KEY) || "[]");
let spots = [...seedSpots, ...customSpots];

const map = L.map("map", {
  zoomControl: true,
  preferCanvas: true,
  zoomAnimation: false,
  fadeAnimation: false,
  markerZoomAnimation: false
}).setView([34.6761, 136.5086], 9);
map.attributionControl.setPosition("topright");

const standardMap = L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png", {
  maxZoom: 18,
  keepBuffer: 4,
  updateWhenIdle: false,
  updateWhenZooming: false,
  attribution: '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noopener">国土地理院</a>'
}).addTo(map);

const aerialMap = L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg", {
  maxZoom: 18,
  keepBuffer: 4,
  updateWhenIdle: false,
  updateWhenZooming: false,
  attribution: '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noopener">国土地理院</a>'
});

L.control.layers({
  "標準地図": standardMap,
  "航空写真": aerialMap
}, null, {
  position: "topright",
  collapsed: false
}).addTo(map);

const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
const spotList = document.querySelector("#spotList");
const searchInput = document.querySelector("#searchInput");
const visibleCount = document.querySelector("#visibleCount");
const dataStatus = document.querySelector("#dataStatus");
const spotTab = document.querySelector("#spotTab");
const catchTab = document.querySelector("#catchTab");
const spotListHead = document.querySelector("#spotListHead");
const catchListHead = document.querySelector("#catchListHead");
const catchList = document.querySelector("#catchList");
const addSpotModeButton = document.querySelector("#addSpotMode");
const addCatchModeButton = document.querySelector("#addCatchMode");
const spotPanel = document.querySelector("#spotPanel");
const spotForm = document.querySelector("#spotForm");
const spotLat = document.querySelector("#spotLat");
const spotLng = document.querySelector("#spotLng");
const spotNameInput = document.querySelector("#spotNameInput");
const spotTypeInput = document.querySelector("#spotTypeInput");
const spotAreaInput = document.querySelector("#spotAreaInput");
const spotMemoInput = document.querySelector("#spotMemoInput");
const deleteSpotButton = document.querySelector("#deleteSpot");
const closeSpotPanelButton = document.querySelector("#closeSpotPanel");
const catchPanel = document.querySelector("#catchPanel");
const catchForm = document.querySelector("#catchForm");
const catchSpot = document.querySelector("#catchSpot");
const catchTime = document.querySelector("#catchTime");
const catchLat = document.querySelector("#catchLat");
const catchLng = document.querySelector("#catchLng");
const catchBait = document.querySelector("#catchBait");
const catchWeather = document.querySelector("#catchWeather");
const catchWind = document.querySelector("#catchWind");
const catchWater = document.querySelector("#catchWater");
const catchSize = document.querySelector("#catchSize");
const catchMemo = document.querySelector("#catchMemo");
const catchPhoto = document.querySelector("#catchPhoto");
const catchCamera = document.querySelector("#catchCamera");
const catchPhotoPreview = document.querySelector("#catchPhotoPreview");
const catchPhotoImage = document.querySelector("#catchPhotoImage");
const removeCatchPhotoButton = document.querySelector("#removeCatchPhoto");
const catchPhotoStatus = document.querySelector("#catchPhotoStatus");
const deleteCatchButton = document.querySelector("#deleteCatch");
const closeCatchPanelButton = document.querySelector("#closeCatchPanel");
const locationPinPanel = document.querySelector("#locationPinPanel");
const locationPinForm = document.querySelector("#locationPinForm");
const locationPinLat = document.querySelector("#locationPinLat");
const locationPinLng = document.querySelector("#locationPinLng");
const locationPinName = document.querySelector("#locationPinName");
const locationPinMemo = document.querySelector("#locationPinMemo");
const locationPinPhoto = document.querySelector("#locationPinPhoto");
const locationPinCamera = document.querySelector("#locationPinCamera");
const locationPinPhotoPreview = document.querySelector("#locationPinPhotoPreview");
const locationPinPhotoImage = document.querySelector("#locationPinPhotoImage");
const locationPinPhotoStatus = document.querySelector("#locationPinPhotoStatus");
const removeLocationPinPhotoButton = document.querySelector("#removeLocationPinPhoto");
const deleteLocationPinButton = document.querySelector("#deleteLocationPin");
const closeLocationPinPanelButton = document.querySelector("#closeLocationPinPanel");
const locateMeButton = document.querySelector("#locateMe");
const pinCurrentLocationButton = document.querySelector("#pinCurrentLocation");
const installAppButton = document.querySelector("#installApp");
const iosInstallHint = document.querySelector("#iosInstallHint");
const closeIosInstallHintButton = document.querySelector("#closeIosInstallHint");
const gpsStatus = document.querySelector("#gpsStatus");
const mobileListToggle = document.querySelector("#mobileListToggle");
const sidebar = document.querySelector(".sidebar");
const openBackgroundPanelButton = document.querySelector("#openBackgroundPanel");
const backgroundPanel = document.querySelector("#backgroundPanel");
const closeBackgroundPanelButton = document.querySelector("#closeBackgroundPanel");
const backgroundCamera = document.querySelector("#backgroundCamera");
const backgroundPhoto = document.querySelector("#backgroundPhoto");
const backgroundPreview = document.querySelector("#backgroundPreview");
const backgroundStatus = document.querySelector("#backgroundStatus");
const resetBackgroundButton = document.querySelector("#resetBackground");
const filterButtons = [...document.querySelectorAll(".filter-chip")];
const markers = new Map();
const catchMarkers = new Map();
const locationPinMarkers = new Map();
let catches = JSON.parse(localStorage.getItem(CATCH_STORAGE_KEY) || "[]");
let locationPins = JSON.parse(localStorage.getItem(LOCATION_PIN_STORAGE_KEY) || "[]");
let selectedId = null;
let activeFilter = "all";
let activeList = "spots";
let spotMode = false;
let editingSpotId = null;
let catchMode = false;
let editingCatchId = null;
let pendingCatchPhoto = "";
let editingLocationPinId = null;
let pendingLocationPinPhoto = "";
let locationWatchId = null;
let currentLocationMarker = null;
let currentAccuracyCircle = null;
let lastKnownLocation = null;
let pendingCurrentLocationPin = false;
let deferredInstallPrompt = null;
let backgroundDbPromise = null;
let backgroundObjectUrl = "";

dataStatus.textContent = `公的データで${seedSpots.filter((spot) => spot.type === "池").length}池・${seedSpots.filter((spot) => spot.type === "漁港").length}漁港・${seedSpots.filter((spot) => spot.type === "港").length}港・${seedSpots.filter((spot) => spot.type === "マリーナ").length}マリーナを登録`;

function markerClass(type) {
  if (type === "川") return "river";
  if (type === "ダム") return "dam";
  if (type === "漁港") return "fishing-port";
  if (type === "港") return "harbor";
  if (type === "マリーナ") return "marina";
  return "pond";
}

function markerLabel(type) {
  if (type === "川") return "川";
  if (type === "ダム") return "堰";
  if (type === "漁港") return "漁";
  if (type === "港") return "港";
  if (type === "マリーナ") return "艇";
  return "池";
}

function makeIcon(spot) {
  return L.divIcon({
    className: "",
    html: `<div class="custom-marker ${markerClass(spot.type)}">${markerLabel(spot.type)}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
}

function makeCatchIcon(number) {
  return L.divIcon({
    className: "",
    html: `<div class="catch-marker"><span>${number}</span></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28]
  });
}

function addMarker(spot) {
  if (markers.has(spot.id)) return;
  const marker = L.marker([spot.lat, spot.lng], { icon: makeIcon(spot) })
    .addTo(map)
    .bindPopup(spotPopupHtml(spot));
  marker.on("click", () => selectSpot(spot.id));
  marker.on("popupopen", () => {
    const editButton = document.querySelector(`[data-edit-spot-id="${spot.id}"]`);
    if (editButton) editButton.addEventListener("click", () => openSpotPanel(spot));
    const deleteButton = document.querySelector(`[data-delete-spot-id="${spot.id}"]`);
    if (deleteButton) deleteButton.addEventListener("click", () => deleteCustomSpot(spot.id));
  });
  markers.set(spot.id, marker);
}

function deleteCustomSpot(spotId) {
  const target = spots.find((spot) => spot.id === spotId);
  if (!target?.custom) return;

  spots = spots.filter((spot) => spot.id !== spotId);
  const marker = markers.get(spotId);
  if (marker) marker.remove();
  markers.delete(spotId);
  delete savedState[spotId];
  catches = catches.map((catchLog) => (
    catchLog.spotId === spotId ? { ...catchLog, spotId: spots[0]?.id || "" } : catchLog
  ));

  persist();
  persistCustomSpots();
  persistCatches();
  populateCatchSpots();
  renderList();
  renderCatchMarkers();
  renderCatchList();
  closeSpotPanel();

  selectedId = null;
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedState));
}

function persistCustomSpots() {
  customSpots = spots.filter((spot) => spot.custom);
  localStorage.setItem(CUSTOM_SPOT_STORAGE_KEY, JSON.stringify(customSpots));
}

function persistCatches() {
  try {
    localStorage.setItem(CATCH_STORAGE_KEY, JSON.stringify(catches));
    return true;
  } catch (error) {
    return false;
  }
}

function persistLocationPins() {
  try {
    localStorage.setItem(LOCATION_PIN_STORAGE_KEY, JSON.stringify(locationPins));
    return true;
  } catch (error) {
    return false;
  }
}

function formatDateTimeForInput(date = new Date()) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatCatchTime(value) {
  if (!value) return "未入力";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.replace("T", " ");
  return date.toLocaleString("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function nearestSpotId(lat, lng) {
  let nearest = spots[0]?.id || "";
  let nearestDistance = Infinity;

  spots.forEach((spot) => {
    const distance = Math.hypot(spot.lat - lat, spot.lng - lng);
    if (distance < nearestDistance) {
      nearest = spot.id;
      nearestDistance = distance;
    }
  });

  return nearest;
}

function catchPopupHtml(catchLog) {
  const spot = spots.find((item) => item.id === catchLog.spotId);
  const number = catches.findIndex((item) => item.id === catchLog.id) + 1;
  const rows = [
    ["No.", number || "-"],
    ["場所", spot?.name || "未選択"],
    ["日時", formatCatchTime(catchLog.time)],
    ["ルアー", catchLog.bait || "未入力"],
    ["天気", catchLog.weather || "未入力"],
    ["風", catchLog.wind || "未入力"],
    ["水", catchLog.water || "未入力"],
    ["サイズ", catchLog.size || "未入力"]
  ];

  const detailRows = rows
    .map(([label, value]) => `<dt>${label}</dt><dd>${value}</dd>`)
    .join("");

  return `
    <div class="catch-popup">
      <strong>釣果記録</strong>
      ${validCatchPhoto(catchLog.photo) ? `<img class="catch-popup-photo" src="${catchLog.photo}" alt="釣果写真">` : ""}
      <dl>${detailRows}</dl>
      ${catchLog.memo ? `<p>${catchLog.memo}</p>` : ""}
      <button class="popup-edit-button" type="button" data-catch-id="${catchLog.id}">編集</button>
    </div>
  `;
}

function addCatchMarker(catchLog) {
  const number = catches.findIndex((item) => item.id === catchLog.id) + 1;
  const marker = L.marker([catchLog.lat, catchLog.lng], { icon: makeCatchIcon(number) })
    .addTo(map)
    .bindPopup(catchPopupHtml(catchLog));

  marker.on("popupopen", () => {
    const button = document.querySelector(`[data-catch-id="${catchLog.id}"]`);
    if (button) {
      button.addEventListener("click", () => openCatchPanel(catchLog));
    }
  });

  catchMarkers.set(catchLog.id, marker);
}

function renderCatchMarkers() {
  catchMarkers.forEach((marker) => marker.remove());
  catchMarkers.clear();
  catches.forEach(addCatchMarker);
}

function locationPinPopupHtml(pin) {
  return `
    <div class="catch-popup">
      <strong>${escapeHtml(pin.name || "保存したピン")}</strong>
      ${validCatchPhoto(pin.photo) ? `<img class="catch-popup-photo" src="${pin.photo}" alt="ピンの写真">` : ""}
      ${pin.memo ? `<p>${escapeHtml(pin.memo)}</p>` : ""}
      <button class="popup-edit-button" type="button" data-location-pin-id="${pin.id}">編集</button>
    </div>
  `;
}

function addLocationPinMarker(pin) {
  const marker = L.marker([pin.lat, pin.lng], {
    title: pin.name || "保存したピン"
  })
    .addTo(map)
    .bindPopup(locationPinPopupHtml(pin));

  marker.on("popupopen", () => {
    const button = document.querySelector(`[data-location-pin-id="${pin.id}"]`);
    if (button) button.addEventListener("click", () => openLocationPinPanel(pin));
  });

  locationPinMarkers.set(pin.id, marker);
}

function renderLocationPinMarkers() {
  locationPinMarkers.forEach((marker) => marker.remove());
  locationPinMarkers.clear();
  locationPins.forEach(addLocationPinMarker);
}

function renderCatchList() {
  catchList.replaceChildren();

  if (!catches.length) {
    const empty = document.createElement("div");
    empty.className = "empty-list";
    empty.textContent = "釣果ピンはまだありません";
    catchList.append(empty);
    return;
  }

  catches.forEach((catchLog, index) => {
    const spot = spots.find((item) => item.id === catchLog.spotId);
    const row = document.createElement("button");
    row.className = "catch-row";
    row.type = "button";
    row.addEventListener("click", () => {
      moveMapTo(catchLog.lat, catchLog.lng, 17);
      const marker = catchMarkers.get(catchLog.id);
      if (marker) marker.openPopup();
    });

    const number = document.createElement("span");
    number.className = "catch-number";
    number.textContent = String(index + 1);

    const summary = document.createElement("span");
    summary.className = "catch-summary";

    if (validCatchPhoto(catchLog.photo)) {
      summary.classList.add("has-photo");
      const thumbnail = document.createElement("img");
      thumbnail.className = "catch-thumbnail";
      thumbnail.src = catchLog.photo;
      thumbnail.alt = "";
      summary.append(thumbnail);
    }

    const title = document.createElement("strong");
    title.textContent = spot?.name || "未選択";

    const meta = document.createElement("span");
    meta.textContent = [
      formatCatchTime(catchLog.time),
      catchLog.bait || "未入力",
      catchLog.weather || "天気未入力"
    ].join(" / ");

    summary.append(title, meta);
    row.append(number, summary);
    catchList.append(row);
  });
}

function setActiveList(nextList) {
  activeList = nextList;
  const showingCatches = activeList === "catches";

  spotTab.classList.toggle("is-active", !showingCatches);
  catchTab.classList.toggle("is-active", showingCatches);
  spotTab.setAttribute("aria-selected", String(!showingCatches));
  catchTab.setAttribute("aria-selected", String(showingCatches));
  spotListHead.classList.toggle("is-hidden", showingCatches);
  spotList.classList.toggle("is-hidden", showingCatches);
  catchListHead.classList.toggle("is-hidden", !showingCatches);
  catchList.classList.toggle("is-hidden", !showingCatches);
  visibleCount.textContent = showingCatches ? `${catches.length}件` : `${spotList.children.length}件`;
}

function populateCatchSpots() {
  catchSpot.replaceChildren();

  spots.forEach((spot) => {
    const option = document.createElement("option");
    option.value = spot.id;
    option.textContent = spot.name;
    catchSpot.append(option);
  });
}

function setCatchMode(active) {
  catchMode = active;
  if (active) setSpotMode(false);
  addCatchModeButton.classList.toggle("is-active", active);
  addCatchModeButton.setAttribute("aria-pressed", String(active));
  addCatchModeButton.querySelector(".tool-label").textContent = active ? "位置選択" : "釣果";
  map.getContainer().style.cursor = active ? "crosshair" : "";
}

function setSpotMode(active) {
  spotMode = active;
  if (active) setCatchMode(false);
  addSpotModeButton.classList.toggle("is-active", active);
  addSpotModeButton.setAttribute("aria-pressed", String(active));
  addSpotModeButton.querySelector(".tool-label").textContent = active ? "位置選択" : "釣り場";
  map.getContainer().style.cursor = active ? "crosshair" : "";
}

function closeCatchPanel() {
  catchPanel.classList.remove("is-open");
  catchPanel.setAttribute("aria-hidden", "true");
  editingCatchId = null;
  pendingCatchPhoto = "";
  catchForm.reset();
  showCatchPhoto("");
}

function validCatchPhoto(value) {
  return typeof value === "string" && /^data:image\/(?:jpeg|png|webp);base64,/i.test(value);
}

function showCatchPhoto(value) {
  const photo = validCatchPhoto(value) ? value : "";
  catchPhotoImage.removeAttribute("src");
  catchPhotoPreview.classList.toggle("is-hidden", !photo);
  if (photo) catchPhotoImage.src = photo;
  catchPhotoStatus.textContent = photo
    ? "写真を添付します"
    : "Googleフォトまたは端末の写真を圧縮して保存します";
}

function compressCatchPhoto(file) {
  return new Promise((resolve, reject) => {
    if (!file?.type.startsWith("image/")) {
      reject(new Error("画像ファイルではありません"));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const maxDimension = 960;
      const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
      const width = Math.max(1, Math.round(image.naturalWidth * scale));
      const height = Math.max(1, Math.round(image.naturalHeight * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      context.fillStyle = "#fff";
      context.fillRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);

      let quality = 0.76;
      let dataUrl = canvas.toDataURL("image/jpeg", quality);
      while (dataUrl.length > 320000 && quality > 0.42) {
        quality -= 0.08;
        dataUrl = canvas.toDataURL("image/jpeg", quality);
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

function setBackgroundStatus(message, isError = false) {
  backgroundStatus.textContent = message;
  backgroundStatus.classList.toggle("is-error", isError);
}

function openBackgroundDatabase() {
  if (backgroundDbPromise) return backgroundDbPromise;
  if (!("indexedDB" in window)) {
    return Promise.reject(new Error("この端末では背景画像を保存できません"));
  }

  backgroundDbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(BACKGROUND_DB_NAME, 1);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(BACKGROUND_DB_STORE)) {
        database.createObjectStore(BACKGROUND_DB_STORE, { keyPath: "key" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error("背景画像の保存領域を開けませんでした"));
    request.onblocked = () => reject(new Error("アプリを閉じてから、もう一度お試しください"));
  });

  return backgroundDbPromise;
}

async function loadStoredBackground() {
  const database = await openBackgroundDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(BACKGROUND_DB_STORE, "readonly");
    const request = transaction.objectStore(BACKGROUND_DB_STORE).get(BACKGROUND_DB_KEY);
    request.onsuccess = () => resolve(request.result?.blob || null);
    request.onerror = () => reject(new Error("保存した背景画像を読み込めませんでした"));
  });
}

async function saveStoredBackground(blob) {
  const database = await openBackgroundDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(BACKGROUND_DB_STORE, "readwrite");
    transaction.objectStore(BACKGROUND_DB_STORE).put({
      key: BACKGROUND_DB_KEY,
      blob,
      updatedAt: Date.now()
    });
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(new Error("背景画像を保存できませんでした"));
    transaction.onabort = () => reject(new Error("背景画像の保存が中断されました"));
  });
}

async function deleteStoredBackground() {
  const database = await openBackgroundDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(BACKGROUND_DB_STORE, "readwrite");
    transaction.objectStore(BACKGROUND_DB_STORE).delete(BACKGROUND_DB_KEY);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(new Error("保存した背景画像を削除できませんでした"));
    transaction.onabort = () => reject(new Error("背景画像の初期化が中断されました"));
  });
}

function canvasToJpegBlob(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("画像を圧縮できませんでした"));
    }, "image/jpeg", quality);
  });
}

function compressBackgroundPhoto(file) {
  return new Promise((resolve, reject) => {
    if (!file?.type.startsWith("image/")) {
      reject(new Error("画像ファイルを選んでください"));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = async () => {
      URL.revokeObjectURL(objectUrl);
      try {
        const maxDimension = 1600;
        const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
        const width = Math.max(1, Math.round(image.naturalWidth * scale));
        const height = Math.max(1, Math.round(image.naturalHeight * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("画像を処理できませんでした");
        context.fillStyle = "#000";
        context.fillRect(0, 0, width, height);
        context.drawImage(image, 0, 0, width, height);

        let quality = 0.82;
        let blob = await canvasToJpegBlob(canvas, quality);
        while (blob.size > 1500000 && quality > 0.5) {
          quality -= 0.08;
          blob = await canvasToJpegBlob(canvas, quality);
        }
        resolve(blob);
      } catch (error) {
        reject(error);
      }
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("画像を読み込めませんでした"));
    };
    image.src = objectUrl;
  });
}

function applySidebarBackground(blob) {
  if (backgroundObjectUrl) {
    URL.revokeObjectURL(backgroundObjectUrl);
    backgroundObjectUrl = "";
  }

  if (blob instanceof Blob) {
    backgroundObjectUrl = URL.createObjectURL(blob);
    const imageValue = `url("${backgroundObjectUrl}")`;
    sidebar.style.setProperty("--sidebar-custom-background", imageValue);
    sidebar.classList.add("has-custom-background");
    backgroundPreview.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.42)), ${imageValue}`;
    resetBackgroundButton.disabled = false;
    setBackgroundStatus("設定した背景画像を使用しています");
    return;
  }

  sidebar.classList.remove("has-custom-background");
  sidebar.style.removeProperty("--sidebar-custom-background");
  backgroundPreview.style.backgroundImage = getComputedStyle(sidebar).backgroundImage;
  resetBackgroundButton.disabled = true;
  setBackgroundStatus("現在は初期背景です");
}

async function restoreSidebarBackground() {
  applySidebarBackground(null);
  try {
    const blob = await loadStoredBackground();
    if (blob instanceof Blob) applySidebarBackground(blob);
  } catch (error) {
    setBackgroundStatus(error.message, true);
  }
}

async function handleBackgroundSelection(input) {
  const [file] = input.files;
  if (!file) return;
  setBackgroundStatus("画像を縮小・圧縮しています…");
  try {
    const blob = await compressBackgroundPhoto(file);
    await saveStoredBackground(blob);
    applySidebarBackground(blob);
    setBackgroundStatus("背景画像を保存しました");
  } catch (error) {
    setBackgroundStatus(error.message, true);
  } finally {
    backgroundCamera.value = "";
    backgroundPhoto.value = "";
  }
}

function closeBackgroundPanel() {
  backgroundPanel.classList.remove("is-open");
  backgroundPanel.setAttribute("aria-hidden", "true");
}

function openBackgroundPanel() {
  closeCatchPanel();
  closeSpotPanel();
  closeLocationPinPanel();
  setCatchMode(false);
  setSpotMode(false);
  backgroundPanel.classList.add("is-open");
  backgroundPanel.setAttribute("aria-hidden", "false");
  if (window.matchMedia("(max-width: 820px)").matches) setMobileList(false);
}

async function handleCatchPhotoSelection(input) {
  const [file] = input.files;
  if (!file) return;
  catchPhotoStatus.textContent = "写真を圧縮しています…";
  try {
    pendingCatchPhoto = await compressCatchPhoto(file);
    showCatchPhoto(pendingCatchPhoto);
  } catch (error) {
    pendingCatchPhoto = "";
    showCatchPhoto("");
    catchPhotoStatus.textContent = error.message;
  } finally {
    input.value = "";
  }
}

function showLocationPinPhoto(value) {
  const photo = validCatchPhoto(value) ? value : "";
  locationPinPhotoImage.removeAttribute("src");
  locationPinPhotoPreview.classList.toggle("is-hidden", !photo);
  if (photo) locationPinPhotoImage.src = photo;
  locationPinPhotoStatus.textContent = photo
    ? "写真をピンに添付します"
    : "写真は圧縮してこの端末に保存します";
}

async function handleLocationPinPhotoSelection(input) {
  const [file] = input.files;
  if (!file) return;
  locationPinPhotoStatus.textContent = "写真を圧縮しています…";
  try {
    pendingLocationPinPhoto = await compressCatchPhoto(file);
    showLocationPinPhoto(pendingLocationPinPhoto);
  } catch (error) {
    pendingLocationPinPhoto = "";
    showLocationPinPhoto("");
    locationPinPhotoStatus.textContent = error.message;
  } finally {
    input.value = "";
  }
}

function closeSpotPanel() {
  spotPanel.classList.remove("is-open");
  spotPanel.setAttribute("aria-hidden", "true");
  editingSpotId = null;
  spotForm.reset();
}

function openCatchPanel(catchLog = null, latLng = null) {
  closeBackgroundPanel();
  editingCatchId = catchLog?.id || null;

  const lat = catchLog?.lat ?? latLng?.lat;
  const lng = catchLog?.lng ?? latLng?.lng;
  catchLat.value = lat;
  catchLng.value = lng;
  catchSpot.value = catchLog?.spotId || nearestSpotId(lat, lng);
  catchTime.value = catchLog?.time || formatDateTimeForInput();
  catchBait.value = catchLog?.bait || "";
  catchWeather.value = catchLog?.weather || "";
  catchWind.value = catchLog?.wind || "";
  catchWater.value = catchLog?.water || "";
  catchSize.value = catchLog?.size || "";
  catchMemo.value = catchLog?.memo || "";
  pendingCatchPhoto = validCatchPhoto(catchLog?.photo) ? catchLog.photo : "";
  showCatchPhoto(pendingCatchPhoto);
  deleteCatchButton.classList.toggle("is-hidden", !editingCatchId);

  catchPanel.classList.add("is-open");
  catchPanel.setAttribute("aria-hidden", "false");
  setCatchMode(false);
}

function closeLocationPinPanel() {
  locationPinPanel.classList.remove("is-open");
  locationPinPanel.setAttribute("aria-hidden", "true");
  editingLocationPinId = null;
  pendingLocationPinPhoto = "";
  locationPinForm.reset();
  showLocationPinPhoto("");
}

function openLocationPinPanel(pin = null, latLng = null) {
  closeBackgroundPanel();
  editingLocationPinId = pin?.id || null;
  locationPinLat.value = pin?.lat ?? latLng?.lat;
  locationPinLng.value = pin?.lng ?? latLng?.lng;
  locationPinName.value = pin?.name || "保存したピン";
  locationPinMemo.value = pin?.memo || "";
  pendingLocationPinPhoto = validCatchPhoto(pin?.photo) ? pin.photo : "";
  showLocationPinPhoto(pendingLocationPinPhoto);
  deleteLocationPinButton.classList.toggle("is-hidden", !editingLocationPinId);

  locationPinPanel.classList.add("is-open");
  locationPinPanel.setAttribute("aria-hidden", "false");
}

function openSpotPanel(spot = null, latLng = null) {
  closeBackgroundPanel();
  editingSpotId = spot?.id || null;
  const lat = spot?.lat ?? latLng?.lat;
  const lng = spot?.lng ?? latLng?.lng;

  spotLat.value = lat;
  spotLng.value = lng;
  spotNameInput.value = spot?.name || "";
  spotTypeInput.value = spot?.type || "池";
  spotAreaInput.value = spot?.area || "";
  spotMemoInput.value = spot?.memo || "";
  deleteSpotButton.classList.toggle("is-hidden", !spot?.custom);

  spotPanel.classList.add("is-open");
  spotPanel.setAttribute("aria-hidden", "false");
  setSpotMode(false);
}

function moveMapTo(lat, lng, zoom) {
  map.closePopup();
  map.invalidateSize({ pan: false });
  map.setView([lat, lng], zoom, { animate: false });

  requestAnimationFrame(() => {
    map.invalidateSize({ pan: false });
  });
}

function setMobileList(open) {
  sidebar.classList.toggle("is-open", open);
  mobileListToggle.setAttribute("aria-expanded", String(open));
  mobileListToggle.setAttribute("aria-label", open ? "場所リストを閉じる" : "場所リストを開く");
  mobileListToggle.textContent = open ? "×" : "☰";
  requestAnimationFrame(() => map.invalidateSize({ pan: false }));
}

function setGpsStatus(message, isError = false) {
  gpsStatus.textContent = message;
  gpsStatus.classList.toggle("is-error", isError);
  gpsStatus.classList.toggle("is-visible", Boolean(message));
}

function stopLocationTracking() {
  if (locationWatchId !== null) {
    navigator.geolocation.clearWatch(locationWatchId);
    locationWatchId = null;
  }
  locateMeButton.classList.remove("is-active");
  locateMeButton.setAttribute("aria-pressed", "false");
}

function showCurrentLocation(position) {
  const { latitude, longitude, accuracy } = position.coords;
  const latlng = [latitude, longitude];
  lastKnownLocation = {
    lat: latitude,
    lng: longitude,
    accuracy,
    timestamp: position.timestamp || Date.now()
  };

  if (!currentLocationMarker) {
    currentAccuracyCircle = L.circle(latlng, {
      radius: accuracy,
      color: "#2f8fff",
      weight: 1,
      fillColor: "#2f8fff",
      fillOpacity: 0.12
    }).addTo(map);
    currentLocationMarker = L.circleMarker(latlng, {
      radius: 9,
      color: "#ffffff",
      weight: 3,
      fillColor: "#2f8fff",
      fillOpacity: 1
    }).addTo(map).bindTooltip("現在地");
    map.setView(latlng, 16, { animate: false });
  } else {
    currentLocationMarker.setLatLng(latlng);
    currentAccuracyCircle.setLatLng(latlng).setRadius(accuracy);
  }

  setGpsStatus(`現在地を表示中（精度 約${Math.round(accuracy)}m）`);

  if (pendingCurrentLocationPin) {
    pendingCurrentLocationPin = false;
    openLocationPinPanel(null, lastKnownLocation);
  }
}

function handleLocationError(error) {
  pendingCurrentLocationPin = false;
  stopLocationTracking();
  const messages = {
    1: "位置情報の利用が許可されていません。端末の設定で許可してください。",
    2: "現在地を取得できませんでした。電波状況を確認してください。",
    3: "現在地の取得がタイムアウトしました。もう一度お試しください。"
  };
  setGpsStatus(messages[error.code] || "現在地を取得できませんでした。", true);
}

function toggleLocationTracking() {
  if (!navigator.geolocation) {
    setGpsStatus("この端末ではGPSを利用できません。", true);
    return;
  }

  if (locationWatchId !== null) {
    stopLocationTracking();
    setGpsStatus("GPS追跡を停止しました。");
    return;
  }

  setGpsStatus("現在地を確認しています…");
  locateMeButton.classList.add("is-active");
  locateMeButton.setAttribute("aria-pressed", "true");
  locationWatchId = navigator.geolocation.watchPosition(
    showCurrentLocation,
    handleLocationError,
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 15000
    }
  );
}

function addPinAtCurrentLocation() {
  if (lastKnownLocation) {
    openLocationPinPanel(null, lastKnownLocation);
    return;
  }

  if (!navigator.geolocation) {
    setGpsStatus("この端末ではGPSを利用できません。", true);
    return;
  }

  pendingCurrentLocationPin = true;
  setGpsStatus("現在地を取得してピンを準備しています…");
  if (locationWatchId === null) toggleLocationTracking();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function spotPopupHtml(spot) {
  return `
    <div class="spot-popup">
      <strong>${escapeHtml(spot.name)}</strong>
      <p>${escapeHtml(spot.type)} / ${escapeHtml(spot.area)}</p>
      ${spot.memo ? `<p>${escapeHtml(spot.memo)}</p>` : ""}
      ${spot.custom ? `
        <div class="popup-spot-actions">
          <button class="edit-spot-button" type="button" data-edit-spot-id="${spot.id}">編集</button>
          <button class="delete-spot-button" type="button" data-delete-spot-id="${spot.id}">削除</button>
        </div>
      ` : ""}
    </div>
  `;
}

function selectSpot(id) {
  const spot = spots.find((item) => item.id === id);
  if (!spot) return;

  selectedId = id;
  moveMapTo(spot.lat, spot.lng, spot.zoom);
  const marker = markers.get(id);
  if (marker) marker.openPopup();

  renderList();
  if (window.matchMedia("(max-width: 820px)").matches) setMobileList(false);
}

function createCheckbox(spot, kind, label) {
  const input = document.createElement("input");
  input.type = "checkbox";
  input.dataset.kind = kind;
  input.checked = Boolean(savedState[spot.id]?.[kind]);
  input.setAttribute("aria-label", `${spot.name}: ${label}`);
  input.addEventListener("change", (event) => {
    savedState[spot.id] = savedState[spot.id] || {};
    savedState[spot.id][kind] = event.target.checked;

    if (kind === "hasBass" && event.target.checked) savedState[spot.id].noBass = false;
    if (kind === "noBass" && event.target.checked) savedState[spot.id].hasBass = false;

    persist();
    renderList();
  });
  return input;
}

function rowMatches(spot, text) {
  const target = `${spot.name} ${spot.type} ${spot.area}`.toLowerCase();
  return target.includes(text.toLowerCase());
}

function renderList() {
  const text = searchInput.value.trim();
  const filtered = spots.filter((spot) => {
    const typeOk = activeFilter === "all" || spot.type === activeFilter;
    return typeOk && rowMatches(spot, text);
  });

  spotList.replaceChildren();

  filtered.forEach((spot) => {
    const row = document.createElement("article");
    row.className = `spot-row${spot.id === selectedId ? " is-selected" : ""}`;

    const main = document.createElement("button");
    main.className = "spot-main";
    main.type = "button";
    main.addEventListener("click", () => selectSpot(spot.id));

    const name = document.createElement("span");
    name.className = "spot-name";
    name.textContent = spot.name;

    const meta = document.createElement("span");
    meta.className = "spot-meta";
    meta.textContent = `${spot.type} / ${spot.area}`;

    main.append(name, meta);
    row.append(main);

    [
      ["hasBass", "釣れた"],
      ["noBass", "釣れてない"],
      ["banned", "釣り禁止"],
      ["parking", "駐車スペースがある"]
    ].forEach(([kind, label]) => {
      const cell = document.createElement("label");
      cell.className = "check-cell";
      cell.append(createCheckbox(spot, kind, label));
      row.append(cell);
    });

    spotList.append(row);
  });

  if (activeList === "spots") {
    visibleCount.textContent = `${filtered.length}件`;
  }
}

spots.forEach(addMarker);
populateCatchSpots();
renderCatchMarkers();
renderCatchList();
renderLocationPinMarkers();

searchInput.addEventListener("input", renderList);

spotTab.addEventListener("click", () => {
  renderList();
  setActiveList("spots");
});

catchTab.addEventListener("click", () => {
  renderCatchList();
  setActiveList("catches");
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    renderList();
  });
});

document.querySelector("#resetView").addEventListener("click", () => {
  selectedId = null;
  moveMapTo(34.6761, 136.5086, 9);
  renderList();
});

addCatchModeButton.addEventListener("click", () => setCatchMode(!catchMode));
addSpotModeButton.addEventListener("click", () => setSpotMode(!spotMode));
locateMeButton.addEventListener("click", toggleLocationTracking);
pinCurrentLocationButton.addEventListener("click", addPinAtCurrentLocation);
mobileListToggle.addEventListener("click", () => {
  setMobileList(!sidebar.classList.contains("is-open"));
});
closeCatchPanelButton.addEventListener("click", closeCatchPanel);
closeSpotPanelButton.addEventListener("click", closeSpotPanel);
closeLocationPinPanelButton.addEventListener("click", closeLocationPinPanel);
openBackgroundPanelButton.addEventListener("click", openBackgroundPanel);
closeBackgroundPanelButton.addEventListener("click", closeBackgroundPanel);
backgroundCamera.addEventListener("change", () => handleBackgroundSelection(backgroundCamera));
backgroundPhoto.addEventListener("change", () => handleBackgroundSelection(backgroundPhoto));

resetBackgroundButton.addEventListener("click", async () => {
  resetBackgroundButton.disabled = true;
  setBackgroundStatus("初期背景へ戻しています…");
  try {
    await deleteStoredBackground();
    applySidebarBackground(null);
    setBackgroundStatus("初期背景へ戻しました");
  } catch (error) {
    resetBackgroundButton.disabled = false;
    setBackgroundStatus(error.message, true);
  }
});

restoreSidebarBackground();

deleteSpotButton.addEventListener("click", () => {
  if (!editingSpotId) return;
  deleteCustomSpot(editingSpotId);
});

deleteCatchButton.addEventListener("click", () => {
  if (!editingCatchId) return;
  catches = catches.filter((catchLog) => catchLog.id !== editingCatchId);
  persistCatches();
  renderCatchMarkers();
  renderCatchList();
  setActiveList("catches");
  closeCatchPanel();
});

catchPhoto.addEventListener("change", () => handleCatchPhotoSelection(catchPhoto));
catchCamera.addEventListener("change", () => handleCatchPhotoSelection(catchCamera));

removeCatchPhotoButton.addEventListener("click", () => {
  pendingCatchPhoto = "";
  catchPhoto.value = "";
  catchCamera.value = "";
  showCatchPhoto("");
});

locationPinPhoto.addEventListener("change", () => handleLocationPinPhotoSelection(locationPinPhoto));
locationPinCamera.addEventListener("change", () => handleLocationPinPhotoSelection(locationPinCamera));

removeLocationPinPhotoButton.addEventListener("click", () => {
  pendingLocationPinPhoto = "";
  locationPinPhoto.value = "";
  locationPinCamera.value = "";
  showLocationPinPhoto("");
});

deleteLocationPinButton.addEventListener("click", () => {
  if (!editingLocationPinId) return;
  locationPins = locationPins.filter((pin) => pin.id !== editingLocationPinId);
  persistLocationPins();
  renderLocationPinMarkers();
  closeLocationPinPanel();
});

spotForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = spotNameInput.value.trim() || "未命名の池";
  const area = spotAreaInput.value.trim() || "現地登録";
  const spotData = {
    id: editingSpotId || `custom-spot-${Date.now()}`,
    name,
    type: spotTypeInput.value,
    area,
    lat: Number(spotLat.value),
    lng: Number(spotLng.value),
    zoom: 16,
    memo: spotMemoInput.value.trim(),
    custom: true
  };

  if (editingSpotId) {
    spots = spots.map((spot) => (spot.id === editingSpotId ? spotData : spot));
    const marker = markers.get(spotData.id);
    if (marker) marker.remove();
    markers.delete(spotData.id);
    addMarker(spotData);
  } else {
    spots.push(spotData);
    addMarker(spotData);
  }

  persistCustomSpots();
  populateCatchSpots();
  renderList();
  closeSpotPanel();
  setActiveList("spots");
  selectSpot(spotData.id);
});

locationPinForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const pinData = {
    id: editingLocationPinId || `location-pin-${Date.now()}`,
    name: locationPinName.value.trim() || "保存したピン",
    memo: locationPinMemo.value.trim(),
    photo: pendingLocationPinPhoto,
    lat: Number(locationPinLat.value),
    lng: Number(locationPinLng.value)
  };

  const previousPins = locationPins;
  if (editingLocationPinId) {
    locationPins = locationPins.map((pin) => (pin.id === editingLocationPinId ? pinData : pin));
  } else {
    locationPins = [...locationPins, pinData];
  }

  if (!persistLocationPins()) {
    locationPins = previousPins;
    locationPinPhotoStatus.textContent = "端末の保存容量が不足しています。写真を外すか、小さい画像を選んでください。";
    return;
  }

  renderLocationPinMarkers();
  closeLocationPinPanel();
  const marker = locationPinMarkers.get(pinData.id);
  if (marker) marker.openPopup();
});

catchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const catchLog = {
    id: editingCatchId || `catch-${Date.now()}`,
    spotId: catchSpot.value,
    time: catchTime.value,
    bait: catchBait.value,
    weather: catchWeather.value,
    wind: catchWind.value,
    water: catchWater.value,
    size: catchSize.value,
    memo: catchMemo.value.trim(),
    photo: pendingCatchPhoto,
    lat: Number(catchLat.value),
    lng: Number(catchLng.value)
  };

  const previousCatches = catches;
  if (editingCatchId) {
    catches = catches.map((item) => (item.id === editingCatchId ? catchLog : item));
  } else {
    catches = [...catches, catchLog];
  }

  if (!persistCatches()) {
    catches = previousCatches;
    catchPhotoStatus.textContent = "端末の保存容量が不足しています。写真を外すか、小さい画像を選んでください。";
    return;
  }
  renderCatchMarkers();
  renderCatchList();
  setActiveList("catches");
  closeCatchPanel();
  const marker = catchMarkers.get(catchLog.id);
  if (marker) marker.openPopup();
});

function handleMapTap(latlng) {
  if (spotMode) {
    openSpotPanel(null, latlng);
    return;
  }
  if (!catchMode) return;
  openCatchPanel(null, latlng);
}

map.on("click", (event) => {
  if (window.matchMedia("(max-width: 820px)").matches && sidebar.classList.contains("is-open")) {
    setMobileList(false);
  }
  handleMapTap(event.latlng);
});

window.addEventListener("resize", () => {
  if (!window.matchMedia("(max-width: 820px)").matches) setMobileList(false);
  map.invalidateSize({ pan: false });
});

window.addEventListener("beforeunload", () => {
  stopLocationTracking();
  if (backgroundObjectUrl) URL.revokeObjectURL(backgroundObjectUrl);
});

const isStandaloneMode = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone === true;

const isIosDevice = /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const isIosSafari = isIosDevice &&
  /Safari/i.test(navigator.userAgent) &&
  !/CriOS|FxiOS|EdgiOS|OPiOS/i.test(navigator.userAgent);
const iosHintDismissed = localStorage.getItem("mie-ios-install-hint-dismissed-v1") === "1";

installAppButton.classList.add("is-hidden");
iosInstallHint.classList.toggle("is-visible", isIosSafari && !isStandaloneMode() && !iosHintDismissed);
iosInstallHint.setAttribute(
  "aria-hidden",
  String(!isIosSafari || isStandaloneMode() || iosHintDismissed)
);

closeIosInstallHintButton.addEventListener("click", () => {
  iosInstallHint.classList.remove("is-visible");
  iosInstallHint.setAttribute("aria-hidden", "true");
  try {
    localStorage.setItem("mie-ios-install-hint-dismissed-v1", "1");
  } catch (error) {
    // The hint still closes when private browsing blocks storage.
  }
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  if (!isStandaloneMode()) installAppButton.classList.remove("is-hidden");
});

installAppButton.addEventListener("click", async () => {
  if (!deferredInstallPrompt) {
    setGpsStatus("Chromeのメニューから「アプリをインストール」または「ホーム画面に追加」を選んでください。");
    return;
  }

  installAppButton.disabled = true;
  await deferredInstallPrompt.prompt();
  const choice = await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  installAppButton.disabled = false;
  installAppButton.classList.toggle("is-hidden", choice.outcome === "accepted");
});

window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  installAppButton.classList.add("is-hidden");
  iosInstallHint.classList.remove("is-visible");
  iosInstallHint.setAttribute("aria-hidden", "true");
});

requestAnimationFrame(() => map.invalidateSize({ pan: false }));

renderList();
setActiveList("spots");

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js", {
      scope: "./",
      updateViaCache: "none"
    })
      .then((registration) => {
        registration.update();
        console.log("Service worker registered:", registration.scope);
      })
      .catch((error) => {
        console.log("Service worker registration failed:", error);
      });
  });
}
