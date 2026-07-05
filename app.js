/*
  三重県釣りマップ - 野池メモ版
  GitHub Pagesでそのまま動く、ビルド不要の静的アプリです。
  データはlocalStorageに保存され、バックアップJSONで保存・読込できます。
*/

const STORAGE_KEY = "mieFishingMap.v1";
const MIE_CENTER = [34.7303, 136.5086];

const TYPE_LABELS = {
  pond: "池",
  river: "川",
  dam: "ダム",
  port: "港・漁港",
  marina: "マリーナ"
};

const state = {
  spots: [],
  records: [],
  markers: new Map(),
  recordMarkers: new Map(),
  activeFilter: "all",
  activeTab: "spots",
  search: "",
  selectedLatLng: null,
  photoData: ""
};

const $ = (id) => document.getElementById(id);
const nowLocalInputValue = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};
const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const map = L.map("map", { zoomControl: true }).setView(MIE_CENTER, 9);
L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png", {
  attribution: "&copy; 国土地理院",
  maxZoom: 18
}).addTo(map);
L.control.scale({ imperial: false }).addTo(map);

map.on("click", (event) => {
  state.selectedLatLng = event.latlng;
  toast(`位置を選択しました：${event.latlng.lat.toFixed(5)}, ${event.latlng.lng.toFixed(5)}`);
});

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    state.spots = Array.isArray(data.spots) ? data.spots : [];
    state.records = Array.isArray(data.records) ? data.records : [];
  } catch (error) {
    console.warn("保存データを読み込めませんでした", error);
    toast("保存データの読み込みに失敗しました");
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    version: 1,
    savedAt: new Date().toISOString(),
    spots: state.spots,
    records: state.records
  }));
}

function render() {
  renderStats();
  renderSpotOptions();
  renderLists();
  renderMarkers();
}

function renderStats() {
  $("spotCount").textContent = state.spots.length;
  $("recordCount").textContent = state.records.length;
  $("bigBassCount").textContent = state.records.filter((r) =>
    r.species === "ブラックバス" && (Number(r.sizeCm) >= 40 || r.sizeClass === "40cm台" || r.sizeClass === "50cm以上")
  ).length;
}

function matchesSearch(text) {
  const q = state.search.trim().toLowerCase();
  if (!q) return true;
  return String(text).toLowerCase().includes(q);
}

function filteredSpots() {
  return state.spots.filter((spot) => {
    const typeOk = state.activeFilter === "all" || spot.type === state.activeFilter;
    const haystack = [spot.name, spot.area, spot.memo, TYPE_LABELS[spot.type]].join(" ");
    return typeOk && matchesSearch(haystack);
  });
}

function filteredRecords() {
  return state.records.filter((record) => {
    const spot = state.spots.find((s) => s.id === record.spotId);
    const haystack = [
      record.title,
      record.memo,
      record.species,
      record.lureCategory,
      record.lureName,
      record.lureDetail,
      record.weather,
      record.wind,
      record.water,
      record.waterLevel,
      record.hitArea,
      record.pressure,
      record.timeBand,
      (record.bait || []).join(" "),
      (record.cover || []).join(" "),
      spot?.name,
      spot?.area
    ].join(" ");
    return matchesSearch(haystack);
  });
}

function renderLists() {
  $("spotList").classList.toggle("hidden", state.activeTab !== "spots");
  $("recordList").classList.toggle("hidden", state.activeTab !== "records");
  renderSpotList();
  renderRecordList();
}

function renderSpotList() {
  const spots = filteredSpots();
  $("spotList").innerHTML = spots.length ? spots.map((spot) => `
    <article class="list-card" data-kind="spot" data-id="${spot.id}">
      <h3>${escapeHtml(spot.name || "名称未設定")}</h3>
      <div class="card-meta">${escapeHtml(TYPE_LABELS[spot.type] || spot.type)} / ${escapeHtml(spot.area || "地名未設定")}</div>
      <div class="card-meta">${escapeHtml(shortText(spot.memo, 70))}</div>
      <div class="badge-row">
        ${spot.noFishing ? '<span class="badge danger">要確認</span>' : ""}
        ${spot.parking === "yes" ? '<span class="badge">駐車あり</span>' : ""}
        ${spot.parking === "no" ? '<span class="badge danger">駐車注意</span>' : ""}
      </div>
    </article>
  `).join("") : emptyMessage("釣り場がありません。地図をタップしてから『釣り場追加』で登録できます。");
}

function renderRecordList() {
  const records = filteredRecords().sort((a, b) => String(b.datetime).localeCompare(String(a.datetime)));
  $("recordList").innerHTML = records.length ? records.map((record) => {
    const spot = state.spots.find((s) => s.id === record.spotId);
    const size = record.sizeCm ? `${record.sizeCm}cm` : (record.sizeClass || "サイズ未記録");
    const title = record.title || [record.species, size, record.hitArea].filter(Boolean).join(" / ") || "記録";
    return `
      <article class="list-card" data-kind="record" data-id="${record.id}">
        <h3>${escapeHtml(title)}</h3>
        <div class="card-meta">${formatDate(record.datetime)} / ${escapeHtml(spot?.name || "釣り場未選択")}</div>
        <div class="card-meta">${escapeHtml([record.lureCategory, record.lureName, record.lureDetail].filter(Boolean).join(" / "))}</div>
        <div class="badge-row">
          ${record.species ? `<span class="badge">${escapeHtml(record.species)}</span>` : ""}
          ${size !== "サイズ未記録" ? `<span class="badge">${escapeHtml(size)}</span>` : ""}
          ${record.waterLevel ? `<span class="badge">${escapeHtml(record.waterLevel)}</span>` : ""}
          ${record.pressure ? `<span class="badge">${escapeHtml(record.pressure)}</span>` : ""}
        </div>
      </article>`;
  }).join("") : emptyMessage("記録がありません。『記録ピン追加』から釣果・現地メモを残せます。");
}

function emptyMessage(message) {
  return `<div class="list-card"><div class="card-meta">${escapeHtml(message)}</div></div>`;
}

function shortText(text = "", len = 80) {
  if (!text) return "メモなし";
  return text.length > len ? `${text.slice(0, len)}…` : text;
}

function renderMarkers() {
  for (const marker of state.markers.values()) marker.remove();
  for (const marker of state.recordMarkers.values()) marker.remove();
  state.markers.clear();
  state.recordMarkers.clear();

  for (const spot of filteredSpots()) {
    const marker = L.marker([Number(spot.lat), Number(spot.lng)], { icon: pinIcon(spot.type) })
      .addTo(map)
      .bindPopup(spotPopupHtml(spot));
    marker.on("popupopen", () => bindPopupButtons());
    state.markers.set(spot.id, marker);
  }

  for (const record of filteredRecords()) {
    const marker = L.marker([Number(record.lat), Number(record.lng)], { icon: pinIcon("record") })
      .addTo(map)
      .bindPopup(recordPopupHtml(record));
    marker.on("popupopen", () => bindPopupButtons());
    state.recordMarkers.set(record.id, marker);
  }
}

function pinIcon(type) {
  const label = type === "record" ? "釣" : (TYPE_LABELS[type] || "釣").slice(0, 1);
  return L.divIcon({
    className: "",
    html: `<div class="pin ${type}"><span>${label}</span></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -20]
  });
}

function spotPopupHtml(spot) {
  return `
    <strong>${escapeHtml(spot.name)}</strong><br>
    ${escapeHtml(TYPE_LABELS[spot.type] || spot.type)} / ${escapeHtml(spot.area || "地名未設定")}<br>
    ${escapeHtml(shortText(spot.memo, 120))}<br>
    ${spot.noFishing ? '<span style="color:#b42318;font-weight:700">釣行前に要確認</span><br>' : ""}
    <button class="secondary-button" data-edit-spot="${spot.id}">編集</button>
    <button class="primary-button" data-add-record-at="${spot.lat},${spot.lng},${spot.id}">ここで記録</button>
  `;
}

function recordPopupHtml(record) {
  const spot = state.spots.find((s) => s.id === record.spotId);
  const title = record.title || record.species || "記録";
  const img = record.photo ? `<br><img src="${record.photo}" alt="記録写真" style="max-width:180px;max-height:140px;border-radius:10px;margin-top:8px;object-fit:cover;">` : "";
  return `
    <strong>${escapeHtml(title)}</strong><br>
    ${escapeHtml(formatDate(record.datetime))}<br>
    ${escapeHtml(spot?.name || "釣り場未選択")}<br>
    ${escapeHtml([record.species, record.sizeCm ? `${record.sizeCm}cm` : record.sizeClass, record.lureCategory, record.lureName].filter(Boolean).join(" / "))}<br>
    ${escapeHtml(shortText(record.memo, 140))}${img}<br>
    <button class="secondary-button" data-edit-record="${record.id}">編集</button>
  `;
}

function bindPopupButtons() {
  document.querySelectorAll("[data-edit-spot]").forEach((button) => {
    button.onclick = () => openSpotDialog(button.dataset.editSpot);
  });
  document.querySelectorAll("[data-edit-record]").forEach((button) => {
    button.onclick = () => openRecordDialog(button.dataset.editRecord);
  });
  document.querySelectorAll("[data-add-record-at]").forEach((button) => {
    button.onclick = () => {
      const [lat, lng, spotId] = button.dataset.addRecordAt.split(",");
      openRecordDialog(null, { lat, lng, spotId });
    };
  });
}

function renderSpotOptions() {
  const options = [`<option value="">選択してください</option>`].concat(
    state.spots.map((spot) => `<option value="${spot.id}">${escapeHtml(spot.name)}</option>`)
  );
  $("recordSpotId").innerHTML = options.join("");
}

function openSpotDialog(id = null) {
  const spot = id ? state.spots.find((s) => s.id === id) : null;
  const center = map.getCenter();
  const latlng = state.selectedLatLng || center;
  $("spotId").value = spot?.id || "";
  $("spotName").value = spot?.name || "";
  $("spotType").value = spot?.type || "pond";
  $("spotArea").value = spot?.area || "";
  $("spotParking").value = spot?.parking || "unknown";
  $("spotMemo").value = spot?.memo || "";
  $("spotNoFishing").checked = Boolean(spot?.noFishing);
  $("spotLat").value = spot?.lat || latlng.lat.toFixed(6);
  $("spotLng").value = spot?.lng || latlng.lng.toFixed(6);
  $("deleteSpotButton").classList.toggle("hidden", !spot);
  $("spotDialog").showModal();
}

function openRecordDialog(id = null, defaults = {}) {
  const record = id ? state.records.find((r) => r.id === id) : null;
  const center = map.getCenter();
  const latlng = state.selectedLatLng || center;
  state.photoData = record?.photo || "";

  $("recordId").value = record?.id || "";
  $("recordType").value = record?.type || defaults.type || "memo";
  $("recordSpotId").value = record?.spotId || defaults.spotId || nearestSpotId(defaults.lat || latlng.lat, defaults.lng || latlng.lng) || "";
  $("recordDatetime").value = record?.datetime || nowLocalInputValue();
  $("recordSpecies").value = record?.species || "";
  $("recordSizeClass").value = record?.sizeClass || "";
  $("recordSizeCm").value = record?.sizeCm || "";
  $("recordLureCategory").value = record?.lureCategory || "";
  $("recordLureName").value = record?.lureName || "";
  $("recordLureDetail").value = record?.lureDetail || "";
  $("recordWeather").value = record?.weather || "";
  $("recordWind").value = record?.wind || "";
  $("recordWater").value = record?.water || "";
  $("recordWaterLevel").value = record?.waterLevel || "";
  $("recordHitArea").value = record?.hitArea || "";
  $("recordPressure").value = record?.pressure || "";
  $("recordTimeBand").value = record?.timeBand || "";
  $("recordTitle").value = record?.title || "";
  $("recordMemo").value = record?.memo || "";
  $("recordLat").value = record?.lat || Number(defaults.lat || latlng.lat).toFixed(6);
  $("recordLng").value = record?.lng || Number(defaults.lng || latlng.lng).toFixed(6);
  setCheckedValues("bait", record?.bait || []);
  setCheckedValues("cover", record?.cover || []);
  updatePhotoPreview();
  $("deleteRecordButton").classList.toggle("hidden", !record);
  $("recordDialog").showModal();
}

function nearestSpotId(lat, lng) {
  if (!state.spots.length) return "";
  const target = L.latLng(Number(lat), Number(lng));
  const sorted = [...state.spots].sort((a, b) =>
    target.distanceTo(L.latLng(Number(a.lat), Number(a.lng))) - target.distanceTo(L.latLng(Number(b.lat), Number(b.lng)))
  );
  const nearest = sorted[0];
  return target.distanceTo(L.latLng(Number(nearest.lat), Number(nearest.lng))) < 700 ? nearest.id : "";
}

function getCheckedValues(name) {
  return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map((input) => input.value);
}
function setCheckedValues(name, values) {
  document.querySelectorAll(`input[name="${name}"]`).forEach((input) => {
    input.checked = values.includes(input.value);
  });
}

function updatePhotoPreview() {
  const img = $("photoPreview");
  if (state.photoData) {
    img.src = state.photoData;
    img.classList.remove("hidden");
  } else {
    img.removeAttribute("src");
    img.classList.add("hidden");
  }
}

function saveSpotForm(event) {
  event.preventDefault();
  const id = $("spotId").value || uid();
  const lat = Number($("spotLat").value);
  const lng = Number($("spotLng").value);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return toast("緯度・経度を確認してください");

  const spot = {
    id,
    name: $("spotName").value.trim() || "名称未設定",
    type: $("spotType").value,
    area: $("spotArea").value.trim(),
    parking: $("spotParking").value,
    memo: $("spotMemo").value.trim(),
    noFishing: $("spotNoFishing").checked,
    lat,
    lng,
    updatedAt: new Date().toISOString()
  };
  const index = state.spots.findIndex((s) => s.id === id);
  if (index >= 0) state.spots[index] = { ...state.spots[index], ...spot };
  else state.spots.push(spot);
  saveState();
  render();
  $("spotDialog").close();
  map.setView([lat, lng], Math.max(map.getZoom(), 14));
  toast("釣り場を保存しました");
}

function saveRecordForm(event) {
  event.preventDefault();
  const id = $("recordId").value || uid();
  const lat = Number($("recordLat").value);
  const lng = Number($("recordLng").value);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return toast("緯度・経度を確認してください");

  const record = {
    id,
    type: $("recordType").value,
    spotId: $("recordSpotId").value,
    datetime: $("recordDatetime").value || nowLocalInputValue(),
    species: $("recordSpecies").value,
    sizeClass: $("recordSizeClass").value,
    sizeCm: $("recordSizeCm").value.trim(),
    lureCategory: $("recordLureCategory").value,
    lureName: $("recordLureName").value.trim(),
    lureDetail: $("recordLureDetail").value.trim(),
    weather: $("recordWeather").value,
    wind: $("recordWind").value,
    water: $("recordWater").value,
    waterLevel: $("recordWaterLevel").value,
    bait: getCheckedValues("bait"),
    cover: getCheckedValues("cover"),
    hitArea: $("recordHitArea").value,
    pressure: $("recordPressure").value,
    timeBand: $("recordTimeBand").value,
    title: $("recordTitle").value.trim(),
    memo: $("recordMemo").value.trim(),
    lat,
    lng,
    photo: state.photoData,
    updatedAt: new Date().toISOString()
  };
  const index = state.records.findIndex((r) => r.id === id);
  if (index >= 0) state.records[index] = { ...state.records[index], ...record };
  else state.records.push(record);
  saveState();
  render();
  $("recordDialog").close();
  map.setView([lat, lng], Math.max(map.getZoom(), 15));
  toast("記録を保存しました");
}

function deleteSpot() {
  const id = $("spotId").value;
  if (!id || !confirm("この釣り場を削除しますか？関連記録は残ります。")) return;
  state.spots = state.spots.filter((s) => s.id !== id);
  state.records = state.records.map((r) => r.spotId === id ? { ...r, spotId: "" } : r);
  saveState();
  render();
  $("spotDialog").close();
  toast("釣り場を削除しました");
}

function deleteRecord() {
  const id = $("recordId").value;
  if (!id || !confirm("この記録を削除しますか？")) return;
  state.records = state.records.filter((r) => r.id !== id);
  saveState();
  render();
  $("recordDialog").close();
  toast("記録を削除しました");
}

function exportBackup() {
  const payload = {
    app: "mie-fishing-map",
    version: 1,
    exportedAt: new Date().toISOString(),
    spots: state.spots,
    records: state.records
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `mie-fishing-map-backup-${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast("バックアップを書き出しました");
}

async function importBackup(file) {
  if (!file) return;
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    if (!Array.isArray(data.spots) || !Array.isArray(data.records)) throw new Error("invalid backup");
    if (!confirm("現在の端末内データを、バックアップ内容で上書きしますか？")) return;
    state.spots = data.spots;
    state.records = data.records;
    saveState();
    render();
    toast("バックアップを読み込みました");
  } catch (error) {
    console.error(error);
    toast("バックアップJSONを読み込めませんでした");
  } finally {
    $("importInput").value = "";
  }
}

function locateForRecord() {
  if (!navigator.geolocation) return toast("この端末では現在地を取得できません");
  toast("現在地を取得中です…");
  navigator.geolocation.getCurrentPosition((pos) => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    state.selectedLatLng = L.latLng(lat, lng);
    map.setView([lat, lng], 16);
    openRecordDialog(null, { lat, lng, type: "memo" });
  }, () => toast("現在地を取得できませんでした"), { enableHighAccuracy: true, timeout: 10000 });
}

function setCoordsFromMapCenter(prefix) {
  const center = map.getCenter();
  $(`${prefix}Lat`).value = center.lat.toFixed(6);
  $(`${prefix}Lng`).value = center.lng.toFixed(6);
}

async function compressPhoto(file) {
  if (!file) return;
  const img = new Image();
  const url = URL.createObjectURL(file);
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = url;
  });
  const max = 1200;
  const ratio = Math.min(1, max / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * ratio);
  canvas.height = Math.round(img.height * ratio);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(url);
  state.photoData = canvas.toDataURL("image/jpeg", 0.74);
  updatePhotoPreview();
  toast("写真を添付しました");
}

function focusItem(kind, id) {
  const collection = kind === "spot" ? state.spots : state.records;
  const item = collection.find((x) => x.id === id);
  if (!item) return;
  map.setView([Number(item.lat), Number(item.lng)], 16);
  const marker = kind === "spot" ? state.markers.get(id) : state.recordMarkers.get(id);
  if (marker) marker.openPopup();
  if (window.matchMedia("(max-width: 860px)").matches) $("sidebar").classList.remove("open");
}

function formatDate(value) {
  if (!value) return "日時未記録";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit"
  }).format(date);
}

let toastTimer = null;
function toast(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}

function wireEvents() {
  $("searchInput").addEventListener("input", (event) => {
    state.search = event.target.value;
    render();
  });
  document.querySelectorAll(".chip").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach((b) => b.classList.remove("active"));
      button.classList.add("active");
      state.activeFilter = button.dataset.filter;
      render();
    });
  });
  document.querySelectorAll(".tab").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((b) => b.classList.remove("active"));
      button.classList.add("active");
      state.activeTab = button.dataset.tab;
      renderLists();
    });
  });
  $("addSpotButton").onclick = () => openSpotDialog();
  $("addRecordButton").onclick = () => openRecordDialog();
  $("locateButton").onclick = locateForRecord;
  $("exportButton").onclick = exportBackup;
  $("importInput").onchange = (event) => importBackup(event.target.files[0]);
  $("spotForm").addEventListener("submit", saveSpotForm);
  $("recordForm").addEventListener("submit", saveRecordForm);
  $("deleteSpotButton").onclick = deleteSpot;
  $("deleteRecordButton").onclick = deleteRecord;
  $("spotUseMapCenter").onclick = () => setCoordsFromMapCenter("spot");
  $("recordUseMapCenter").onclick = () => setCoordsFromMapCenter("record");
  $("recordUseCurrent").onclick = () => {
    if (!navigator.geolocation) return toast("この端末では現在地を取得できません");
    navigator.geolocation.getCurrentPosition((pos) => {
      $("recordLat").value = pos.coords.latitude.toFixed(6);
      $("recordLng").value = pos.coords.longitude.toFixed(6);
      map.setView([pos.coords.latitude, pos.coords.longitude], 16);
      toast("現在地を入れました");
    }, () => toast("現在地を取得できませんでした"));
  };
  $("recordPhoto").onchange = (event) => compressPhoto(event.target.files[0]);
  $("removePhotoButton").onclick = () => {
    state.photoData = "";
    $("recordPhoto").value = "";
    updatePhotoPreview();
  };
  document.querySelectorAll("[data-close]").forEach((button) => {
    button.addEventListener("click", () => $(button.dataset.close).close());
  });
  $("spotList").addEventListener("click", (event) => {
    const card = event.target.closest("[data-kind]");
    if (card) focusItem(card.dataset.kind, card.dataset.id);
  });
  $("recordList").addEventListener("click", (event) => {
    const card = event.target.closest("[data-kind]");
    if (card) focusItem(card.dataset.kind, card.dataset.id);
  });
  $("openSidebar").onclick = () => $("sidebar").classList.add("open");
  $("closeSidebar").onclick = () => $("sidebar").classList.remove("open");
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch((error) => console.warn("sw registration failed", error));
  }
}

loadState();
wireEvents();
render();
registerServiceWorker();
