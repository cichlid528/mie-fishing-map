const STORAGE_KEY = "mie-bass-map-v1";
const CATCH_STORAGE_KEY = "mie-bass-catches-v1";
const CUSTOM_SPOT_STORAGE_KEY = "mie-bass-custom-spots-v1";

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
  { id: "nanairo-dam", name: "七色ダム", type: "ダム", area: "熊野市・紀和町周辺", lat: 33.962596, lng: 136.002566, zoom: 14 }
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

// 地図の著作権表記は削除せず、右上へ移動します。
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
const spotCard = document.querySelector("#spotCard");
const dataStatus = document.querySelector("#dataStatus");

function showSpotCard(html) {
  spotCard.innerHTML = html;
  spotCard.classList.remove("is-hidden");
}

function hideSpotCard() {
  spotCard.classList.add("is-hidden");
  spotCard.replaceChildren();
}
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
const catchPhotoPreview = document.querySelector("#catchPhotoPreview");
const catchPhotoImage = document.querySelector("#catchPhotoImage");
const removeCatchPhotoButton = document.querySelector("#removeCatchPhoto");
const catchPhotoStatus = document.querySelector("#catchPhotoStatus");
const deleteCatchButton = document.querySelector("#deleteCatch");
const closeCatchPanelButton = document.querySelector("#closeCatchPanel");
const filterButtons = [...document.querySelectorAll(".filter-chip")];
const markers = new Map();
const catchMarkers = new Map();
let catches = JSON.parse(localStorage.getItem(CATCH_STORAGE_KEY) || "[]");
let selectedId = null;
let activeFilter = "all";
let activeList = "spots";
let spotMode = false;
let editingSpotId = null;
let catchMode = false;
let editingCatchId = null;
let pendingCatchPhoto = "";

dataStatus.textContent = `公的データで${seedSpots.filter((spot) => spot.type === "池").length}池の位置を確認済み`;

function markerClass(type) {
  if (type === "川") return "river";
  if (type === "ダム") return "dam";
  return "pond";
}

function markerLabel(type) {
  if (type === "川") return "川";
  if (type === "ダム") return "堰";
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
    .bindPopup(`<strong>${spot.name}</strong><br>${spot.type} / ${spot.area}`);
  marker.on("click", () => selectSpot(spot.id));
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
  hideSpotCard();
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
  addCatchModeButton.textContent = active ? "地図をタップ" : "釣果ピン追加";
  map.getContainer().style.cursor = active ? "crosshair" : "";
}

function setSpotMode(active) {
  spotMode = active;
  if (active) setCatchMode(false);
  addSpotModeButton.classList.toggle("is-active", active);
  addSpotModeButton.textContent = active ? "地図をタップ" : "釣り場追加";
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
    : "写真は圧縮してこの端末に保存します";
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

function closeSpotPanel() {
  spotPanel.classList.remove("is-open");
  spotPanel.setAttribute("aria-hidden", "true");
  editingSpotId = null;
  spotForm.reset();
}

function openCatchPanel(catchLog = null, latLng = null) {
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

function openSpotPanel(spot = null, latLng = null) {
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

function selectSpot(id) {
  const spot = spots.find((item) => item.id === id);
  if (!spot) return;

  selectedId = id;
  moveMapTo(spot.lat, spot.lng, spot.zoom);
  const marker = markers.get(id);
  if (marker) marker.openPopup();

  showSpotCard(`
    <p class="spot-card-type">${spot.type} / ${spot.area}</p>
    <h2>${spot.name}</h2>
    <p>左のチェックで「バスがいる」「いない」「釣り禁止」を記録できます。現地の掲示・管理者情報は必ず確認してください。</p>
    ${spot.source ? `<p class="spot-source">位置情報: ${spot.source}（掲載は立入・釣り許可を意味しません）</p>` : ""}
    ${spot.custom ? `
      <div class="spot-card-actions">
        <button class="edit-spot-button" type="button" id="editCustomSpot">編集</button>
        <button class="delete-spot-button" type="button" id="deleteCustomSpotCard">削除</button>
      </div>
    ` : ""}
  `);
  const editButton = document.querySelector("#editCustomSpot");
  if (editButton) editButton.addEventListener("click", () => openSpotPanel(spot));
  const deleteButton = document.querySelector("#deleteCustomSpotCard");
  if (deleteButton) deleteButton.addEventListener("click", () => deleteCustomSpot(spot.id));
  renderList();
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
      ["hasBass", "ブラックバスがいる"],
      ["noBass", "ブラックバスがいない"],
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
  hideSpotCard();
  renderList();
});

addCatchModeButton.addEventListener("click", () => setCatchMode(!catchMode));
addSpotModeButton.addEventListener("click", () => setSpotMode(!spotMode));
closeCatchPanelButton.addEventListener("click", closeCatchPanel);
closeSpotPanelButton.addEventListener("click", closeSpotPanel);

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

catchPhoto.addEventListener("change", async () => {
  const [file] = catchPhoto.files;
  if (!file) return;
  catchPhotoStatus.textContent = "写真を圧縮しています…";
  try {
    pendingCatchPhoto = await compressCatchPhoto(file);
    showCatchPhoto(pendingCatchPhoto);
  } catch (error) {
    pendingCatchPhoto = "";
    showCatchPhoto("");
    catchPhotoStatus.textContent = error.message;
  }
});

removeCatchPhotoButton.addEventListener("click", () => {
  pendingCatchPhoto = "";
  catchPhoto.value = "";
  showCatchPhoto("");
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
    if (marker) {
      marker.setLatLng([spotData.lat, spotData.lng]);
      marker.setPopupContent(`<strong>${spotData.name}</strong><br>${spotData.type} / ${spotData.area}`);
    }
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
  handleMapTap(event.latlng);
});

window.addEventListener("resize", () => map.invalidateSize({ pan: false }));

requestAnimationFrame(() => map.invalidateSize({ pan: false }));

renderList();
setActiveList("spots");

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js")
      .then((registration) => {
        console.log("Service worker registered:", registration.scope);
      })
      .catch((error) => {
        console.log("Service worker registration failed:", error);
      });
  });
}
