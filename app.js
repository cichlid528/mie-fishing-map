const STORAGE_KEY = "mie-bass-map-v1";
const CATCH_STORAGE_KEY = "mie-bass-catches-v1";
const CUSTOM_SPOT_STORAGE_KEY = "mie-bass-custom-spots-v1";
const BACKGROUND_STORAGE_KEY = "mie-fishing-map-sidebar-background-v1";
const POSITION_STORAGE_KEY = "mie-fishing-map-position-overrides-v5";
const PREVIOUS_POSITION_STORAGE_KEYS = [
  "mie-fishing-map-position-overrides-v4",
  "mie-fishing-map-position-overrides-v3",
  "mie-fishing-map-position-overrides-v2",
  "mie-fishing-map-position-overrides-v1"
];
const AUTO_ALIGN_STORAGE_KEY = "mie-fishing-map-auto-align-v5";

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

const portSpots = [
  { id: "port-kuwana", name: "桑名港", type: "港", area: "桑名市 / 木曽三川河口周辺", lat: 35.0647, lng: 136.7042, zoom: 16, source: "港・漁港初期位置補正" },
  { id: "port-yokkaichi", name: "四日市港", type: "港", area: "四日市市", lat: 34.9577, lng: 136.6421, zoom: 15, source: "港・漁港初期位置補正" },
  { id: "port-isodzu", name: "磯津漁港", type: "港", area: "四日市市磯津町", lat: 34.9128, lng: 136.6579, zoom: 17, source: "港・漁港初期位置補正" },
  { id: "port-shiroko", name: "白子漁港", type: "港", area: "鈴鹿市白子", lat: 34.8288, lng: 136.6048, zoom: 17, source: "港・漁港初期位置補正" },
  { id: "port-chiyozaki", name: "千代崎港", type: "港", area: "鈴鹿市岸岡町周辺", lat: 34.8501, lng: 136.6052, zoom: 17, source: "港・漁港初期位置補正" },
  { id: "port-kawage", name: "河芸漁港", type: "港", area: "津市河芸町", lat: 34.7907, lng: 136.5757, zoom: 17, source: "港・漁港初期位置補正" },
  { id: "port-tsu", name: "津港", type: "港", area: "津市なぎさまち周辺", lat: 34.7276, lng: 136.5311, zoom: 16, source: "港・漁港初期位置補正" },
  { id: "port-karasu", name: "香良洲漁港", type: "港", area: "津市香良洲町", lat: 34.6459, lng: 136.5630, zoom: 17, source: "港・漁港初期位置補正" },
  { id: "port-matsusaka", name: "松阪港", type: "港", area: "松阪市大口町周辺", lat: 34.5987, lng: 136.5829, zoom: 16, source: "港・漁港初期位置補正" },
  { id: "port-oyodo", name: "大淀漁港", type: "港", area: "多気郡明和町大淀", lat: 34.5426, lng: 136.6474, zoom: 17, source: "港・漁港初期位置補正" },
  { id: "port-aritaki", name: "有滝漁港", type: "港", area: "伊勢市有滝町", lat: 34.5437, lng: 136.6831, zoom: 17, source: "港・漁港初期位置補正" },
  { id: "port-futami", name: "二見浦漁港", type: "港", area: "伊勢市二見町", lat: 34.5085, lng: 136.7855, zoom: 17, source: "港・漁港初期位置補正" },
  { id: "port-toba", name: "鳥羽港", type: "港", area: "鳥羽市鳥羽", lat: 34.4868, lng: 136.8462, zoom: 16, source: "港・漁港初期位置補正" },
  { id: "port-ohama-toba", name: "小浜漁港", type: "港", area: "鳥羽市小浜町", lat: 34.4940, lng: 136.8293, zoom: 17, source: "港・漁港初期位置補正" },
  { id: "port-arashima", name: "安楽島漁港", type: "港", area: "鳥羽市安楽島町", lat: 34.4696, lng: 136.8661, zoom: 17, source: "港・漁港初期位置補正" },
  { id: "port-ijika", name: "石鏡漁港", type: "港", area: "鳥羽市石鏡町", lat: 34.4447, lng: 136.9130, zoom: 17, source: "港・漁港初期位置補正" },
  { id: "port-kuzaki", name: "国崎漁港", type: "港", area: "鳥羽市国崎町", lat: 34.3971, lng: 136.9093, zoom: 17, source: "港・漁港初期位置補正" },
  { id: "port-osatsu", name: "相差漁港", type: "港", area: "鳥羽市相差町", lat: 34.3893, lng: 136.9089, zoom: 17, source: "港・漁港初期位置補正" },
  { id: "port-matoya", name: "的矢漁港", type: "港", area: "志摩市磯部町的矢", lat: 34.3718, lng: 136.8526, zoom: 17, source: "港・漁港初期位置補正" },
  { id: "port-anori", name: "安乗漁港", type: "港", area: "志摩市阿児町安乗", lat: 34.3586, lng: 136.9083, zoom: 17, source: "港・漁港初期位置補正" },
  { id: "port-wagu-shima", name: "和具漁港", type: "港", area: "志摩市志摩町和具", lat: 34.2469, lng: 136.8064, zoom: 17, source: "港・漁港初期位置補正" },
  { id: "port-nakiri", name: "波切漁港", type: "港", area: "志摩市大王町波切", lat: 34.2758, lng: 136.9011, zoom: 17, source: "港・漁港初期位置補正" },
  { id: "port-katada", name: "片田漁港", type: "港", area: "志摩市志摩町片田", lat: 34.2318, lng: 136.8159, zoom: 17, source: "港・漁港初期位置補正" },
  { id: "port-goza", name: "御座漁港", type: "港", area: "志摩市志摩町御座", lat: 34.2778, lng: 136.7636, zoom: 17, source: "港・漁港初期位置補正" },
  { id: "port-hamajima", name: "浜島港", type: "港", area: "志摩市浜島町", lat: 34.2987, lng: 136.7586, zoom: 17, source: "港・漁港初期位置補正" },
  { id: "port-gokasho", name: "五ヶ所浦", type: "港", area: "南伊勢町五ヶ所湾", lat: 34.3479, lng: 136.7050, zoom: 16, source: "港・漁港初期位置補正" },
  { id: "port-hazamaura", name: "迫間浦", type: "港", area: "南伊勢町迫間浦", lat: 34.3022, lng: 136.7120, zoom: 17, source: "港・漁港初期位置補正" },
  { id: "port-tasoura", name: "田曽浦", type: "港", area: "南伊勢町田曽浦", lat: 34.2803, lng: 136.6686, zoom: 17, source: "港・漁港初期位置補正" },
  { id: "port-shukuura", name: "宿浦漁港", type: "港", area: "南伊勢町宿浦", lat: 34.2823, lng: 136.6640, zoom: 17, source: "港・漁港初期位置補正" },
  { id: "port-kamiesura", name: "神前浦漁港", type: "港", area: "南伊勢町神前浦", lat: 34.2503, lng: 136.5806, zoom: 17, source: "港・漁港初期位置補正" },
  { id: "port-kowaura", name: "古和浦漁港", type: "港", area: "南伊勢町古和浦", lat: 34.2230, lng: 136.5351, zoom: 17, source: "港・漁港初期位置補正" },
  { id: "port-nieura", name: "贄浦漁港", type: "港", area: "南伊勢町贄浦", lat: 34.2146, lng: 136.5140, zoom: 17, source: "港・漁港初期位置補正" },
  { id: "port-hozaura", name: "方座浦漁港", type: "港", area: "南伊勢町方座浦", lat: 34.2001, lng: 136.4932, zoom: 17, source: "港・漁港初期位置補正" },
  { id: "port-nishiki", name: "錦漁港", type: "港", area: "大紀町錦", lat: 34.2031, lng: 136.3930, zoom: 17, source: "港・漁港初期位置補正" },
  { id: "port-kiinagashima", name: "紀伊長島港", type: "港", area: "北牟婁郡紀北町長島", lat: 34.2110, lng: 136.3371, zoom: 16, source: "港・漁港初期位置補正" },
  { id: "port-hikimoto", name: "引本港", type: "港", area: "北牟婁郡紀北町引本浦", lat: 34.1101, lng: 136.2508, zoom: 17, source: "港・漁港初期位置補正" },
  { id: "port-owase", name: "尾鷲港", type: "港", area: "尾鷲市", lat: 34.0713, lng: 136.2025, zoom: 16, source: "港・漁港初期位置補正" },
  { id: "port-kuki", name: "九鬼漁港", type: "港", area: "尾鷲市九鬼町", lat: 33.9862, lng: 136.2370, zoom: 17, source: "港・漁港初期位置補正" },
  { id: "port-haida", name: "早田漁港", type: "港", area: "尾鷲市早田町", lat: 33.9644, lng: 136.2294, zoom: 17, source: "港・漁港初期位置補正" },
  { id: "port-mikiura", name: "三木浦漁港", type: "港", area: "尾鷲市三木浦町", lat: 33.9387, lng: 136.2222, zoom: 17, source: "港・漁港初期位置補正" },
  { id: "port-kata", name: "賀田港", type: "港", area: "尾鷲市賀田町", lat: 33.9001, lng: 136.1907, zoom: 17, source: "港・漁港初期位置補正" },
  { id: "port-atashika", name: "新鹿漁港", type: "港", area: "熊野市新鹿町", lat: 33.9290, lng: 136.1430, zoom: 17, source: "港・漁港初期位置補正" },
  { id: "port-kinomoto", name: "木本港", type: "港", area: "熊野市木本町", lat: 33.8892, lng: 136.1018, zoom: 17, source: "港・漁港初期位置補正" },
  { id: "port-yuki", name: "遊木漁港", type: "港", area: "熊野市遊木町", lat: 33.8654, lng: 136.0926, zoom: 17, source: "港・漁港初期位置補正" },
  { id: "port-udono", name: "鵜殿港", type: "港", area: "南牟婁郡紀宝町鵜殿", lat: 33.7359, lng: 136.0082, zoom: 16, source: "港・漁港初期位置補正" }
];

const marinaSpots = [
  { id: "marina-isewan", name: "伊勢湾マリーナ", type: "マリーナ", area: "四日市市天カ須賀", lat: 34.992667, lng: 136.654650, zoom: 17, source: "海の駅・公式位置情報" },
  { id: "marina-yamato", name: "ヤマトマリーナ", type: "マリーナ", area: "鈴鹿市江島本町", lat: 34.833376, lng: 136.595698, zoom: 18, source: "NAVITIME / Yahoo!マップ" },
  { id: "marina-suzuki-shiroko", name: "スズキマリーナ白子", type: "マリーナ", area: "鈴鹿市江島本町", lat: 34.833230, lng: 136.596120, zoom: 18, source: "所在地から初期配置" },
  { id: "marina-kawage", name: "マリーナ河芸", type: "マリーナ", area: "津市河芸町東千里", lat: 34.798339, lng: 136.562838, zoom: 18, source: "MapFan / 公式所在地" },
  { id: "marina-tsu-yacht", name: "津ヨットハーバー", type: "マリーナ", area: "津市津興", lat: 34.708344, lng: 136.524048, zoom: 17, source: "MapFan / 津市観光協会" },
  { id: "marina-matsusaka", name: "松阪マリーナ", type: "マリーナ", area: "松阪市大口町", lat: 34.593204, lng: 136.552180, zoom: 17, source: "MapFan" },
  { id: "marina-njm", name: "NJMマリーナ", type: "マリーナ", area: "伊勢市有滝町", lat: 34.544386, lng: 136.703818, zoom: 17, source: "NAVITIME / Yahoo!マップ" },
  { id: "marina-ise", name: "マリーナ伊勢", type: "マリーナ", area: "伊勢市大湊町", lat: 34.524407, lng: 136.744185, zoom: 17, source: "NAVITIME / MapFan" },
  { id: "marina-toba", name: "鳥羽マリーナ", type: "マリーナ", area: "鳥羽市千賀町", lat: 34.388732, lng: 136.880716, zoom: 17, source: "NAVITIME / 海の駅" },
  { id: "marina-westcove-iseshima", name: "WestCove伊勢志摩マリーナ", type: "マリーナ", area: "度会郡南伊勢町船越", lat: 34.336252, lng: 136.683410, zoom: 17, source: "MapFan / 公式所在地" },
  { id: "marina-kaiyujin", name: "海遊人マリーナ", type: "マリーナ", area: "度会郡南伊勢町迫間浦", lat: 34.307176, lng: 136.641763, zoom: 17, source: "NAVITIME / 公式所在地" }
];

const fishSpeciesGroups = [
  {
    name: "淡水魚",
    items: ["ブラックバス", "スモールマウスバス", "ブルーギル", "ナマズ", "ライギョ", "コイ", "フナ", "ヘラブナ", "ニゴイ", "ウグイ", "オイカワ", "カワムツ", "アユ", "アマゴ", "イワナ", "ニジマス", "ワカサギ", "テナガエビ"]
  },
  {
    name: "海水魚",
    items: ["アジ", "サバ", "イワシ", "メバル", "カサゴ", "キジハタ", "クロダイ", "チヌ", "シーバス", "ヒラメ", "マゴチ", "マダイ", "グレ", "アイナメ", "カレイ", "キス", "ハゼ", "タチウオ", "アオリイカ", "コウイカ", "タコ"]
  }
];

function safeParseJson(value, fallback) {
  try {
    return JSON.parse(value || "") || fallback;
  } catch (error) {
    return fallback;
  }
}

function loadPositionOverrides() {
  const current = safeParseJson(localStorage.getItem(POSITION_STORAGE_KEY), {});
  if (Object.keys(current).length > 0) return current;

  // v34 以前の自動補正は、表記と違う候補を保存してしまうことがあったため引き継ぎません。
  // 詳細カードから手で直した位置だけ、新しい保存先へ移します。
  const manualOnly = {};
  PREVIOUS_POSITION_STORAGE_KEYS.forEach((key) => {
    const legacy = safeParseJson(localStorage.getItem(key), {});
    Object.entries(legacy).forEach(([spotId, value]) => {
      if (value?.source === "手動補正" && validPosition(value)) manualOnly[spotId] = value;
    });
  });
  if (Object.keys(manualOnly).length > 0) {
    localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(manualOnly));
  }
  return manualOnly;
}

let customSpots = safeParseJson(localStorage.getItem(CUSTOM_SPOT_STORAGE_KEY), []);
let positionOverrides = loadPositionOverrides();
const defaultSpotPositions = new Map(
  [...seedSpots, ...portSpots, ...marinaSpots].map((spot) => [spot.id, { lat: spot.lat, lng: spot.lng }])
);

function validPosition(value) {
  return value
    && Number.isFinite(Number(value.lat))
    && Number.isFinite(Number(value.lng))
    && Number(value.lat) >= 33
    && Number(value.lat) <= 36
    && Number(value.lng) >= 135
    && Number(value.lng) <= 138;
}

function applyPositionOverride(spot) {
  const override = positionOverrides[spot.id];
  if (!validPosition(override)) return spot;
  return {
    ...spot,
    lat: Number(override.lat),
    lng: Number(override.lng),
    positionAdjusted: true,
    positionSource: override.source || "保存済み補正",
    positionLabel: override.label || ""
  };
}

let spots = [...seedSpots, ...portSpots, ...marinaSpots].map(applyPositionOverride).concat(customSpots);

const GSI_AUTO_ALIGN_VERSION = "v36";
const GSI_NAME_SEARCH_ENDPOINT = "https://msearch.gsi.go.jp/address-search/AddressSearch?q=";
const GSI_VECTOR_TILE_ZOOMS = [15];
const GSI_VECTOR_TILE_LAYERS = [
  { id: "experimental_anno", source: "国土地理院地図注記" },
  { id: "experimental_nnfpt", source: "国土地理院自然地名" },
  { id: "experimental_pfpt", source: "国土地理院公共施設" },
  { id: "experimental_nrpt", source: "国土地理院居住地名" }
];
const gsiTileCache = new Map();
let autoAlignRunning = false;

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
const sidebar = document.querySelector(".sidebar");
const menuToggleButton = document.querySelector("#menuToggle");
const menuBackdrop = document.querySelector("#menuBackdrop");
const closeMenuButton = document.querySelector("#closeMenuButton");
const changeBackgroundButton = document.querySelector("#changeBackgroundButton");
const backgroundPanel = document.querySelector("#backgroundPanel");
const backgroundForm = document.querySelector("#backgroundForm");
const backgroundCamera = document.querySelector("#backgroundCamera");
const backgroundPicker = document.querySelector("#backgroundPicker");
const backgroundStatus = document.querySelector("#backgroundStatus");
const resetBackgroundButton = document.querySelector("#resetBackgroundButton");
const closeBackgroundPanelButton = document.querySelector("#closeBackgroundPanel");
const closeBackgroundDoneButton = document.querySelector("#closeBackgroundDone");
const fishPanel = document.querySelector("#fishPanel");
const fishForm = document.querySelector("#fishForm");
const fishPanelSpotName = document.querySelector("#fishPanelSpotName");
const fishSpeciesGroupsContainer = document.querySelector("#fishSpeciesGroups");
const otherFishInput = document.querySelector("#otherFishInput");
const clearFishSelectionButton = document.querySelector("#clearFishSelection");
const closeFishPanelButton = document.querySelector("#closeFishPanel");
const openInfoPanelButton = document.querySelector("#openInfoPanel");
const infoPanel = document.querySelector("#infoPanel");
const closeInfoPanelButton = document.querySelector("#closeInfoPanel");
const closeInfoDoneButton = document.querySelector("#closeInfoDone");
const exportDataButton = document.querySelector("#exportDataButton");
const importDataFile = document.querySelector("#importDataFile");
const backupStatus = document.querySelector("#backupStatus");
const autoAlignPositionsButton = document.querySelector("#autoAlignPositionsButton");
const installAppButton = document.querySelector("#installAppButton");
const installPanel = document.querySelector("#installPanel");
const closeInstallPanelButton = document.querySelector("#closeInstallPanel");
const closeInstallDoneButton = document.querySelector("#closeInstallDone");
const installStatus = document.querySelector("#installStatus");
let deferredInstallPrompt = null;
let editingFishSpotId = null;

function showSpotCard(html) {
  spotCard.innerHTML = html;
  spotCard.classList.remove("is-hidden");
}

function hideSpotCard() {
  spotCard.classList.add("is-hidden");
  spotCard.classList.remove("is-compact", "is-expanded");
  spotCard.replaceChildren();
}

function defaultSpotCardSize() {
  return isMobileMapView() ? "compact" : "expanded";
}

function applySpotCardSize(size = spotCardSize || defaultSpotCardSize()) {
  const nextSize = size === "expanded" ? "expanded" : "compact";
  spotCardSize = nextSize;
  spotCard.classList.toggle("is-expanded", nextSize === "expanded");
  spotCard.classList.toggle("is-compact", nextSize !== "expanded");

  const maximizeButton = spotCard.querySelector("#maximizeSpotCard");
  const minimizeButton = spotCard.querySelector("#minimizeSpotCard");
  if (maximizeButton) maximizeButton.classList.toggle("is-active", nextSize === "expanded");
  if (minimizeButton) minimizeButton.classList.toggle("is-active", nextSize !== "expanded");
  if (maximizeButton) maximizeButton.setAttribute("aria-pressed", String(nextSize === "expanded"));
  if (minimizeButton) minimizeButton.setAttribute("aria-pressed", String(nextSize !== "expanded"));
}
const spotTab = document.querySelector("#spotTab");
const catchTab = document.querySelector("#catchTab");
const spotListHead = document.querySelector("#spotListHead");
const catchListHead = document.querySelector("#catchListHead");
const catchList = document.querySelector("#catchList");
const locateCatchButton = document.querySelector("#locateCatchButton");
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
const catchLocationStatus = document.querySelector("#catchLocationStatus");
const useCurrentLocationButton = document.querySelector("#useCurrentLocationButton");
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
const filterButtons = [...document.querySelectorAll(".filter-chip")];
const markers = new Map();
const catchMarkers = new Map();
let currentLocationMarker = null;
let currentLocationAccuracyCircle = null;
let catches = JSON.parse(localStorage.getItem(CATCH_STORAGE_KEY) || "[]");
let selectedId = null;
let activeFilter = "all";
let activeList = "spots";
let spotMode = false;
let editingSpotId = null;
let catchMode = false;
let editingCatchId = null;
let pendingCatchPhoto = "";
let moveSpotModeId = null;
let spotCardSize = null;

dataStatus.textContent = `池${seedSpots.filter((spot) => spot.type === "池").length}件、港・漁港${portSpots.length}件、マリーナ${marinaSpots.length}件を表示中（港・マリーナの初期位置を追加・補正済み）`;

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function validImageDataUrl(value) {
  return typeof value === "string" && /^data:image\/(?:jpeg|png|webp);base64,/i.test(value);
}

function applySidebarBackground(value) {
  if (validImageDataUrl(value)) {
    sidebar.style.setProperty("--sidebar-bg-image", `url("${value}")`);
    sidebar.classList.add("has-custom-bg");
    return;
  }
  sidebar.style.removeProperty("--sidebar-bg-image");
  sidebar.classList.remove("has-custom-bg");
}

function loadSavedBackground() {
  applySidebarBackground(localStorage.getItem(BACKGROUND_STORAGE_KEY) || "");
}

function openInfoPanel() {
  infoPanel.classList.add("is-open");
  infoPanel.setAttribute("aria-hidden", "false");
}

function closeInfoPanel() {
  infoPanel.classList.remove("is-open");
  infoPanel.setAttribute("aria-hidden", "true");
}

function isAppStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function isIOSDevice() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent || "");
}

function updateInstallStatus(message = "") {
  if (!installStatus) return;
  if (message) {
    installStatus.textContent = message;
    return;
  }
  if (isAppStandalone()) {
    installStatus.textContent = "すでにホーム画面のアイコンからアプリとして起動しています。";
  } else if (deferredInstallPrompt) {
    installStatus.textContent = "この端末では、左メニューの『アプリをダウンロード』からインストールできます。";
  } else if (isIOSDevice()) {
    installStatus.textContent = "iPhoneではSafariの共有ボタンから『ホーム画面に追加』を選んでください。";
  } else {
    installStatus.textContent = "ブラウザのメニューから『アプリをインストール』または『ホーム画面に追加』を選んでください。";
  }
}

function openInstallPanel(message = "") {
  updateInstallStatus(message);
  installPanel.classList.add("is-open");
  installPanel.setAttribute("aria-hidden", "false");
}

function closeInstallPanel() {
  installPanel.classList.remove("is-open");
  installPanel.setAttribute("aria-hidden", "true");
}

async function handleInstallAppClick() {
  if (isAppStandalone()) {
    openInstallPanel("すでにアプリとして起動しています。");
    return;
  }

  if (!deferredInstallPrompt) {
    openInstallPanel();
    return;
  }

  try {
    deferredInstallPrompt.prompt();
    const choice = await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    if (choice?.outcome === "accepted") {
      openInstallPanel("インストールを開始しました。ホーム画面のアイコンを確認してください。");
    } else {
      openInstallPanel("インストールはキャンセルされました。必要なときにもう一度押してください。");
    }
  } catch (error) {
    openInstallPanel("自動インストール画面を開けませんでした。ブラウザのメニューからホーム画面に追加してください。");
  }
}

function setBackupStatus(message) {
  if (backupStatus) backupStatus.textContent = message;
}

function buildBackupData() {
  return {
    app: "mie-fishing-map",
    backupVersion: 1,
    exportedAt: new Date().toISOString(),
    savedState,
    customSpots,
    catches,
    positionOverrides,
    backgroundImage: localStorage.getItem(BACKGROUND_STORAGE_KEY) || ""
  };
}

function downloadTextFile(filename, content, type = "application/json") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportBackupData() {
  try {
    const pad = (value) => String(value).padStart(2, "0");
    const now = new Date();
    const date = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;
    const payload = JSON.stringify(buildBackupData(), null, 2);
    downloadTextFile(`mie-fishing-map-backup-${date}.json`, payload);
    setBackupStatus("バックアップJSONを書き出しました。ダウンロードフォルダに保存されています。");
  } catch (error) {
    setBackupStatus("バックアップ保存に失敗しました。端末の保存設定を確認してください。");
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function applyImportedBackup(data) {
  if (!isPlainObject(data) || data.app !== "mie-fishing-map") {
    throw new Error("このアプリのバックアップJSONではありません");
  }

  const nextState = isPlainObject(data.savedState) ? data.savedState : {};
  const nextCustomSpots = Array.isArray(data.customSpots) ? data.customSpots : [];
  const nextCatches = Array.isArray(data.catches) ? data.catches : [];
  const nextPositionOverrides = isPlainObject(data.positionOverrides) ? data.positionOverrides : {};
  const nextBackground = validImageDataUrl(data.backgroundImage) ? data.backgroundImage : "";

  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  localStorage.setItem(CUSTOM_SPOT_STORAGE_KEY, JSON.stringify(nextCustomSpots));
  localStorage.setItem(CATCH_STORAGE_KEY, JSON.stringify(nextCatches));
  localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(nextPositionOverrides));
  if (nextBackground) {
    localStorage.setItem(BACKGROUND_STORAGE_KEY, nextBackground);
  } else {
    localStorage.removeItem(BACKGROUND_STORAGE_KEY);
  }
}

function importBackupFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(String(reader.result || ""));
      const ok = window.confirm("現在の端末内データを、バックアップ内容で上書きします。続けますか？");
      if (!ok) {
        setBackupStatus("バックアップ読込をキャンセルしました。");
        return;
      }
      applyImportedBackup(data);
      setBackupStatus("バックアップを読み込みました。画面を再読み込みします。");
      window.setTimeout(() => window.location.reload(), 350);
    } catch (error) {
      setBackupStatus(`読込できませんでした: ${error.message}`);
    } finally {
      importDataFile.value = "";
    }
  };
  reader.onerror = () => {
    setBackupStatus("ファイルを読み込めませんでした。");
    importDataFile.value = "";
  };
  reader.readAsText(file);
}

function compressImageFile(file, options = {}) {
  const maxDimension = options.maxDimension || 960;
  const maxLength = options.maxLength || 320000;
  const initialQuality = options.initialQuality || 0.76;
  const minQuality = options.minQuality || 0.42;

  return new Promise((resolve, reject) => {
    if (!file?.type.startsWith("image/")) {
      reject(new Error("画像ファイルではありません"));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
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

      let quality = initialQuality;
      let dataUrl = canvas.toDataURL("image/jpeg", quality);
      while (dataUrl.length > maxLength && quality > minQuality) {
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

async function handleBackgroundFile(file) {
  if (!file) return;
  backgroundStatus.textContent = "背景画像を圧縮しています…";
  try {
    const dataUrl = await compressImageFile(file, {
      maxDimension: 1600,
      maxLength: 900000,
      initialQuality: 0.78,
      minQuality: 0.44
    });
    localStorage.setItem(BACKGROUND_STORAGE_KEY, dataUrl);
    applySidebarBackground(dataUrl);
    backgroundStatus.textContent = "背景画像を保存しました";
  } catch (error) {
    backgroundStatus.textContent = error.message || "背景画像を保存できませんでした";
  }
}

function openBackgroundPanel() {
  backgroundPanel.classList.add("is-open");
  backgroundPanel.setAttribute("aria-hidden", "false");
}

function closeBackgroundPanel() {
  backgroundPanel.classList.remove("is-open");
  backgroundPanel.setAttribute("aria-hidden", "true");
  backgroundCamera.value = "";
  backgroundPicker.value = "";
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

function makeCurrentLocationIcon() {
  return L.divIcon({
    className: "",
    html: '<div class="current-location-marker"><span></span></div>',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16]
  });
}

function formatLatLng(lat, lng) {
  const nextLat = Number(lat);
  const nextLng = Number(lng);
  if (!Number.isFinite(nextLat) || !Number.isFinite(nextLng)) return "位置未指定";
  return `${nextLat.toFixed(6)}, ${nextLng.toFixed(6)}`;
}

function setCatchLocationStatus(lat, lng, source = "記録位置", accuracy = null) {
  if (!catchLocationStatus) return;
  const nextLat = Number(lat);
  const nextLng = Number(lng);
  if (!Number.isFinite(nextLat) || !Number.isFinite(nextLng)) {
    catchLocationStatus.textContent = "地図をタップするか、現在地ボタンで記録位置を指定してください。";
    return;
  }
  const accuracyText = Number.isFinite(Number(accuracy)) ? ` / 誤差約${Math.round(Number(accuracy))}m` : "";
  catchLocationStatus.textContent = `${source}: ${formatLatLng(nextLat, nextLng)}${accuracyText}`;
}

function updateCurrentLocationMarker(lat, lng, accuracy = null) {
  const nextLat = Number(lat);
  const nextLng = Number(lng);
  if (!Number.isFinite(nextLat) || !Number.isFinite(nextLng)) return;
  const latLng = [nextLat, nextLng];

  if (!currentLocationMarker) {
    currentLocationMarker = L.marker(latLng, { icon: makeCurrentLocationIcon(), zIndexOffset: 1200 })
      .addTo(map)
      .bindPopup("現在地");
  } else {
    currentLocationMarker.setLatLng(latLng);
  }

  if (Number.isFinite(Number(accuracy)) && Number(accuracy) > 0) {
    if (!currentLocationAccuracyCircle) {
      currentLocationAccuracyCircle = L.circle(latLng, {
        radius: Number(accuracy),
        className: "current-location-accuracy"
      }).addTo(map);
    } else {
      currentLocationAccuracyCircle.setLatLng(latLng);
      currentLocationAccuracyCircle.setRadius(Number(accuracy));
    }
  }
}

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("この端末・ブラウザでは現在地取得が使えません"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 30000
    });
  });
}

function geolocationErrorMessage(error) {
  if (error?.code === 1) return "現在地の使用が許可されていません。ブラウザの位置情報許可をオンにしてください。";
  if (error?.code === 2) return "現在地を取得できませんでした。電波やGPSの状態を確認してください。";
  if (error?.code === 3) return "現在地の取得がタイムアウトしました。もう一度試してください。";
  return error?.message || "現在地を取得できませんでした。";
}

async function useCurrentLocationForCatch(options = {}) {
  const { openPanel = true, button = locateCatchButton } = options;
  const targetButton = button || locateCatchButton;
  const previousText = targetButton?.textContent;
  if (targetButton) {
    targetButton.disabled = true;
    targetButton.textContent = "現在地取得中…";
  }
  if (dataStatus) dataStatus.textContent = "現在地を取得しています…";
  if (catchLocationStatus && !openPanel) catchLocationStatus.textContent = "現在地を取得しています…";

  try {
    const position = await getCurrentPosition();
    const { latitude, longitude, accuracy } = position.coords;
    const latLng = L.latLng(latitude, longitude);

    setSpotMode(false);
    setCatchMode(false);
    updateCurrentLocationMarker(latitude, longitude, accuracy);
    moveMapTo(latitude, longitude, Math.max(map.getZoom(), 17));

    if (openPanel) {
      openCatchPanel(null, latLng, { source: "現在地", accuracy });
      closeMobileMenu();
    } else {
      catchLat.value = latitude;
      catchLng.value = longitude;
      catchSpot.value = nearestSpotId(latitude, longitude);
      setCatchLocationStatus(latitude, longitude, "現在地", accuracy);
    }

    if (dataStatus) dataStatus.textContent = `現在地を取得しました（誤差約${Math.round(Number(accuracy) || 0)}m）`;
  } catch (error) {
    const message = geolocationErrorMessage(error);
    if (dataStatus) dataStatus.textContent = message;
    if (catchLocationStatus && !openPanel) catchLocationStatus.textContent = message;
  } finally {
    if (targetButton) {
      targetButton.disabled = false;
      targetButton.textContent = previousText || "現在地で記録";
    }
  }
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

function persistPositionOverrides() {
  localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(positionOverrides));
}

function normalizePlaceText(value) {
  return String(value || "")
    .normalize("NFKC")
    .replace(/[\s　・･,，.．()（）\[\]【】「」『』]/g, "")
    .replace(/ヶ/g, "ケ")
    .toLowerCase();
}

function uniqueValues(values) {
  return [...new Set(values.filter(Boolean))];
}

function spotNameVariants(spot) {
  const name = String(spot.name || "").trim();
  const variants = [name];

  // 地図表記と完全一致しやすい別名だけを使います。
  // 末尾を削っただけの短い名前は、市町名や駅名を拾ってピンが大きくずれる原因になるため使いません。
  if (spot.type === "港") {
    if (/漁港$/u.test(name)) variants.push(name.replace(/漁港$/u, "港"));
    if (/港$/u.test(name) && !/漁港$/u.test(name)) variants.push(name.replace(/港$/u, "漁港"));
  }

  if (spot.type === "マリーナ") {
    if (/マリーナ$/u.test(name)) variants.push(name.replace(/マリーナ$/u, "ヨットハーバー"));
    if (/ヨットハーバー$/u.test(name)) variants.push(name.replace(/ヨットハーバー$/u, "マリーナ"));
    if (/^WestCove/u.test(name)) variants.push(name.replace(/^WestCove/u, ""));
    if (/^ＷｅｓｔＣｏｖｅ/u.test(name)) variants.push(name.replace(/^ＷｅｓｔＣｏｖｅ/u, ""));
  }

  if (spot.type === "ダム") {
    variants.push(name.replace(/ダム$/u, "湖"));
  }

  if (spot.type === "池") {
    if (/貯水池$/u.test(name)) {
      variants.push(name.replace(/貯水池$/u, "湖"));
      variants.push(name.replace(/貯水池$/u, "池"));
    }
    if (/湖$/u.test(name)) variants.push(name.replace(/湖$/u, "池"));
    if (/池$/u.test(name) && !/貯水池$/u.test(name)) variants.push(name.replace(/池$/u, "湖"));
  }

  return uniqueValues(variants.map(normalizePlaceText)).filter((value) => value.length >= 2);
}

function shortSpotNameVariants(spot) {
  const name = String(spot.name || "").trim();
  const variants = [];

  // 漁港は、地理院地図では「〇〇漁港」ではなく「〇〇」だけで注記されることがあります。
  // ただし市町名へ飛ぶと大きくズレるため、候補採用時に距離をかなり短く制限します。
  if (spot.type === "港" && /漁港$/u.test(name)) {
    variants.push(name.replace(/漁港$/u, ""));
  }

  if (spot.type === "マリーナ") {
    if (/マリーナ$/u.test(name)) variants.push(name.replace(/マリーナ$/u, ""));
    if (/ヨットハーバー$/u.test(name)) variants.push(name.replace(/ヨットハーバー$/u, ""));
  }

  return uniqueValues(variants.map(normalizePlaceText)).filter((value) => value.length >= 2);
}

function maxShortLabelDistanceKm(spot) {
  if (spot.type === "港") return 0.85;
  if (spot.type === "マリーナ") return 0.55;
  return 0.45;
}

function labelLooksLikeWrongType(spot, labelNorm) {
  if (!labelNorm) return true;
  if (/(市役所|区役所|町役場|村役場|駅|学校|病院|郵便局|警察署|消防署)$/u.test(labelNorm)) return true;
  if (spot.type === "港" && !/(港|漁港|浦|泊|岸壁|埠頭|ふ頭|防波堤|マリーナ|ヨットハーバー|ハーバー|海の駅)$/u.test(labelNorm)) return true;
  if (spot.type === "マリーナ" && !/(マリーナ|ヨットハーバー|ハーバー|港|海の駅|船|係留)$/u.test(labelNorm)) return true;
  if (spot.type === "ダム" && !/(ダム|堰|湖|貯水池)$/u.test(labelNorm)) return true;
  if (spot.type === "川" && !/(川|河川)$/u.test(labelNorm)) return true;
  if (spot.type === "池" && !/(池|湖|沼|溜|ため池|貯水池)$/u.test(labelNorm)) return true;
  return false;
}

function distanceKm(lat1, lng1, lat2, lng2) {
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLng = (lng2 - lng1) * rad;
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function maxAutoAlignDistanceKm(spot) {
  if (spot.type === "川") return 18;
  if (spot.type === "港") return 8;
  if (spot.type === "マリーナ") return 5;
  if (spot.type === "ダム") return 10;
  return 8;
}

function scoreLabelMatch(spot, label) {
  const labelNorm = normalizePlaceText(label);
  if (!labelNorm) return 0;
  const fullName = normalizePlaceText(spot.name);

  // まず正式名の完全一致を最優先。
  if (labelNorm === fullName) return 180;

  // 正式名を含む注記だけ許可します。短い部分一致は誤爆の原因になるため禁止。
  if (labelNorm.includes(fullName) && !labelLooksLikeWrongType(spot, labelNorm)) return 145;

  const variants = spotNameVariants(spot);
  let best = 0;
  variants.forEach((variant) => {
    if (variant.length < 3) return;
    if (labelNorm === variant) best = Math.max(best, 150);
    if (labelNorm.includes(variant) && !labelLooksLikeWrongType(spot, labelNorm)) best = Math.max(best, 118);
  });
  return best;
}

function scoreShortLabelMatch(spot, label) {
  const labelNorm = normalizePlaceText(label);
  if (!labelNorm) return 0;
  let best = 0;
  shortSpotNameVariants(spot).forEach((variant) => {
    if (labelNorm === variant) best = Math.max(best, 104);
  });
  return best;
}

function featureLabel(feature) {
  const properties = feature?.properties || {};
  const keys = [
    "title", "name", "knj", "kana", "anno", "text", "label", "displayName",
    "name_ja", "名称", "地名", "注記", "公共施設名", "自然地名"
  ];
  for (const key of keys) {
    if (properties[key]) return String(properties[key]);
  }

  const characterLabel = Array.from({ length: 22 }, (_, index) => properties[`charG${index + 1}`])
    .filter((value) => typeof value === "string" && value.trim().length > 0)
    .join("");
  if (characterLabel) return characterLabel;

  const fallback = Object.values(properties).find((value) => typeof value === "string" && value.trim().length > 0);
  return fallback ? String(fallback) : "";
}

function collectCoordinatePairs(coordinates, pairs = []) {
  if (!Array.isArray(coordinates)) return pairs;
  if (coordinates.length >= 2 && Number.isFinite(Number(coordinates[0])) && Number.isFinite(Number(coordinates[1]))) {
    const lng = Number(coordinates[0]);
    const lat = Number(coordinates[1]);
    if (lat >= 33 && lat <= 36 && lng >= 135 && lng <= 138) pairs.push([lng, lat]);
    return pairs;
  }
  coordinates.forEach((item) => collectCoordinatePairs(item, pairs));
  return pairs;
}

function centerOfCoordinatePairs(pairs) {
  if (!pairs.length) return null;
  if (pairs.length === 1) {
    const [lng, lat] = pairs[0];
    return { lat, lng };
  }
  const lngs = pairs.map(([lng]) => lng);
  const lats = pairs.map(([, lat]) => lat);
  const lng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
  const lat = (Math.min(...lats) + Math.max(...lats)) / 2;
  return { lat, lng };
}

function featurePoint(feature) {
  const pairs = collectCoordinatePairs(feature?.geometry?.coordinates);
  const point = centerOfCoordinatePairs(pairs);
  if (!point || !Number.isFinite(point.lat) || !Number.isFinite(point.lng)) return null;
  return point;
}

function candidatesFromFeatures(spot, features, source) {
  const maxDistance = maxAutoAlignDistanceKm(spot);
  return (features || [])
    .map((feature) => {
      const label = featureLabel(feature);
      const point = featurePoint(feature);
      if (!label || !point) return null;
      let labelScore = scoreLabelMatch(spot, label);
      let shortLabelOnly = false;
      if (labelScore <= 0) {
        labelScore = scoreShortLabelMatch(spot, label);
        shortLabelOnly = labelScore > 0;
      }
      if (labelScore <= 0) return null;
      const distance = distanceKm(spot.lat, spot.lng, point.lat, point.lng);
      if (distance > maxDistance) return null;
      if (shortLabelOnly && distance > maxShortLabelDistanceKm(spot)) return null;
      return {
        lat: point.lat,
        lng: point.lng,
        label,
        source,
        distance,
        score: labelScore - Math.min(distance, 30)
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.distance - b.distance);
}

async function fetchJsonWithTimeout(url, timeout = 7500) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal, cache: "force-cache" });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function gsiSearchQueries(spot, thorough = false) {
  const queries = [
    `三重県 ${spot.area} ${spot.name}`,
    `三重県 ${spot.name}`
  ];
  if (thorough) {
    queries.push(`${spot.name} ${spot.area}`);
    queries.push(`${spot.area} ${spot.name}`);
    spotNameVariants(spot).forEach((variant) => {
      if (variant.length >= 3) queries.push(`三重県 ${variant}`);
    });
  }
  return uniqueValues(queries);
}

async function lookupGsiNameSearchCandidates(spot, thorough = false) {
  const candidates = [];
  for (const query of gsiSearchQueries(spot, thorough)) {
    const url = `${GSI_NAME_SEARCH_ENDPOINT}${encodeURIComponent(query)}`;
    const data = await fetchJsonWithTimeout(url);
    const features = Array.isArray(data) ? data : data?.features;
    candidates.push(...candidatesFromFeatures(spot, features, "国土地理院地名検索"));
    if (candidates.some((candidate) => candidate.score >= 105)) break;
  }
  return candidates.sort((a, b) => b.score - a.score || a.distance - b.distance);
}

function lonLatToTile(lng, lat, zoom) {
  const latRad = lat * Math.PI / 180;
  const n = 2 ** zoom;
  const x = Math.floor((lng + 180) / 360 * n);
  const y = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n);
  return { x, y };
}

async function fetchGsiVectorTile(layer, x, y, z) {
  const key = `${layer}:${z}:${x}:${y}`;
  if (gsiTileCache.has(key)) return gsiTileCache.get(key);
  const url = `https://cyberjapandata.gsi.go.jp/xyz/${layer}/${z}/${x}/${y}.geojson`;
  const data = await fetchJsonWithTimeout(url, 6500);
  const features = data?.features || [];
  gsiTileCache.set(key, features);
  return features;
}

function tileOffsetsByRadius(radius) {
  const offsets = [];
  for (let ring = 0; ring <= radius; ring += 1) {
    for (let dx = -ring; dx <= ring; dx += 1) {
      for (let dy = -ring; dy <= ring; dy += 1) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) === ring) offsets.push([dx, dy]);
      }
    }
  }
  return offsets;
}

function vectorSearchRadiusForZoom(zoom, thorough) {
  if (thorough) {
    if (zoom >= 17) return 12;
    if (zoom === 16) return 8;
    if (zoom === 15) return 6;
    return 4;
  }
  if (zoom >= 17) return 5;
  if (zoom === 16) return 4;
  if (zoom === 15) return 3;
  return 2;
}

async function lookupGsiVectorLabelCandidates(spot, thorough = false) {
  const candidates = [];

  // 地理院の注記・地名タイルは主に z15 で提供されているため、
  // 存在しないズームを大量に探して補正が進まない問題を避けます。
  for (const zoom of GSI_VECTOR_TILE_ZOOMS) {
    const center = lonLatToTile(spot.lng, spot.lat, zoom);
    const tileOffsets = tileOffsetsByRadius(vectorSearchRadiusForZoom(zoom, thorough));

    for (const layer of GSI_VECTOR_TILE_LAYERS) {
      for (const [dx, dy] of tileOffsets) {
        const features = await fetchGsiVectorTile(layer.id, center.x + dx, center.y + dy, zoom);
        candidates.push(...candidatesFromFeatures(spot, features, layer.source));
        if (candidates.some((candidate) => candidate.score >= 150)) {
          return candidates.sort((a, b) => b.score - a.score || a.distance - b.distance);
        }
      }
    }
  }

  return candidates.sort((a, b) => b.score - a.score || a.distance - b.distance);
}

async function findGsiLabelPosition(spot, thorough = false) {
  // 「地図に表記されている名前」へ合わせるので、住所検索よりも地図注記タイルを優先します。
  // 住所検索は水面・港全体の代表点になりやすく、ラベル文字からズレる原因になるため最後の保険です。
  const vectorCandidates = await lookupGsiVectorLabelCandidates(spot, thorough);
  const strongVector = vectorCandidates.find((candidate) => candidate.score >= 90);
  if (strongVector) return strongVector;

  const nameSearchCandidates = await lookupGsiNameSearchCandidates(spot, thorough);
  return [...vectorCandidates, ...nameSearchCandidates]
    .sort((a, b) => b.score - a.score || a.distance - b.distance)[0] || null;
}

function isManualPositionOverride(spotId) {
  return positionOverrides[spotId]?.source === "手動補正";
}

function baseSpotForAlignment(spot) {
  const base = defaultSpotPositions.get(spot.id);
  return base ? { ...spot, lat: base.lat, lng: base.lng } : spot;
}

function applyAutoAlignedPosition(spot, candidate) {
  const moved = distanceKm(spot.lat, spot.lng, candidate.lat, candidate.lng);
  const nextLat = Number(candidate.lat.toFixed(6));
  const nextLng = Number(candidate.lng.toFixed(6));
  const currentOverride = positionOverrides[spot.id];
  if (moved < 0.03 && currentOverride?.source === candidate.source && currentOverride?.label === candidate.label) return false;
  positionOverrides[spot.id] = {
    lat: nextLat,
    lng: nextLng,
    source: candidate.source,
    label: candidate.label,
    updatedAt: new Date().toISOString()
  };
  spots = spots.map((item) => (
    item.id === spot.id
      ? {
        ...item,
        lat: nextLat,
        lng: nextLng,
        positionAdjusted: true,
        positionSource: candidate.source,
        positionLabel: candidate.label
      }
      : item
  ));
  const updated = spots.find((item) => item.id === spot.id);
  if (updated) updateSpotMarkerPosition(updated);
  return true;
}

async function autoAlignSpotPositions(options = {}) {
  const { thorough = false, silent = false, force = false } = options;
  if (autoAlignRunning) return;
  autoAlignRunning = true;
  if (autoAlignPositionsButton) {
    autoAlignPositionsButton.disabled = true;
    autoAlignPositionsButton.textContent = "位置補正中…";
  }

  const targets = spots.filter((spot) => (
    !spot.custom
      && !isManualPositionOverride(spot.id)
      && (force || !positionOverrides[spot.id])
  ));
  let checked = 0;
  let adjusted = 0;

  try {
    for (const spot of targets) {
      checked += 1;
      const searchSpot = baseSpotForAlignment(spot);
      if (!silent) dataStatus.textContent = `地図上の名称に合わせて補正中 ${checked}/${targets.length}: ${spot.name}`;
      const candidate = await findGsiLabelPosition(searchSpot, thorough);
      if (candidate && applyAutoAlignedPosition(spot, candidate)) {
        adjusted += 1;
      } else if (force && positionOverrides[spot.id] && !isManualPositionOverride(spot.id)) {
        delete positionOverrides[spot.id];
        const base = defaultSpotPositions.get(spot.id);
        if (base) {
          spots = spots.map((item) => (
            item.id === spot.id
              ? { ...item, lat: base.lat, lng: base.lng, positionAdjusted: false, positionSource: "", positionLabel: "" }
              : item
          ));
          const resetSpot = spots.find((item) => item.id === spot.id);
          if (resetSpot) updateSpotMarkerPosition(resetSpot);
        }
      }
    }

    persistPositionOverrides();
    renderList();
    const current = spots.find((spot) => spot.id === selectedId);
    if (current) updateSpotCard(current);

    if (adjusted > 0) {
      dataStatus.textContent = `地図上の名称に合わせて${adjusted}件のピン位置を補正しました`;
    } else if (!silent) {
      dataStatus.textContent = "地図上の名称と一致する候補が見つからなかった場所は、初期位置に戻しました。必要な場所は詳細カードの『位置を修正』で手動補正してください。";
    }

    if (!force) {
      localStorage.setItem(AUTO_ALIGN_STORAGE_KEY, GSI_AUTO_ALIGN_VERSION);
    }
  } finally {
    autoAlignRunning = false;
    if (autoAlignPositionsButton) {
      autoAlignPositionsButton.disabled = false;
      autoAlignPositionsButton.textContent = "地図名へ位置補正";
    }
  }
}

function scheduleInitialAutoAlign() {
  if (localStorage.getItem(AUTO_ALIGN_STORAGE_KEY) === GSI_AUTO_ALIGN_VERSION) return;
  window.setTimeout(() => {
    autoAlignSpotPositions({ thorough: true, silent: true, force: false });
  }, 1200);
}

async function alignSingleSpotPosition(spotId) {
  const spot = spots.find((item) => item.id === spotId);
  if (!spot || spot.custom || isManualPositionOverride(spot.id) || positionOverrides[spot.id]) return;

  const candidate = await findGsiLabelPosition(baseSpotForAlignment(spot), true);
  if (!candidate) return;
  if (!applyAutoAlignedPosition(spot, candidate)) return;

  persistPositionOverrides();
  renderList();
  const updated = spots.find((item) => item.id === spotId);
  if (!updated) return;
  if (selectedId === spotId) {
    updateSpotCard(updated);
    moveMapTo(updated.lat, updated.lng, updated.zoom);
    dataStatus.textContent = `${updated.name} を地図上の名称位置へ補正しました`;
  }
}

function updateSpotMarkerPosition(spot) {
  const marker = markers.get(spot.id);
  if (!marker) return;
  marker.setLatLng([spot.lat, spot.lng]);
  marker.setPopupContent(`<strong>${spot.name}</strong><br>${spot.type} / ${spot.area}`);
}

function setSpotPosition(spotId, lat, lng) {
  const nextLat = Number(lat);
  const nextLng = Number(lng);
  spots = spots.map((spot) => {
    if (spot.id !== spotId) return spot;
    return {
      ...spot,
      lat: nextLat,
      lng: nextLng,
      positionAdjusted: !spot.custom,
      positionSource: spot.custom ? "" : "手動補正"
    };
  });

  const updated = spots.find((spot) => spot.id === spotId);
  if (!updated) return;

  if (updated.custom) {
    persistCustomSpots();
  } else {
    positionOverrides[spotId] = {
      lat: nextLat,
      lng: nextLng,
      source: "手動補正",
      updatedAt: new Date().toISOString()
    };
    persistPositionOverrides();
  }

  updateSpotMarkerPosition(updated);
  renderList();
  updateSpotCard(updated);
  moveMapTo(nextLat, nextLng, Math.max(updated.zoom || 16, 16));
  dataStatus.textContent = `${updated.name} のピン位置を補正しました`;
}

function resetSpotPosition(spotId) {
  const base = defaultSpotPositions.get(spotId);
  if (!base) return;
  delete positionOverrides[spotId];
  persistPositionOverrides();
  spots = spots.map((spot) => (
    spot.id === spotId ? { ...spot, lat: base.lat, lng: base.lng, positionAdjusted: false, positionSource: "", positionLabel: "" } : spot
  ));
  const updated = spots.find((spot) => spot.id === spotId);
  if (!updated) return;
  updateSpotMarkerPosition(updated);
  renderList();
  updateSpotCard(updated);
  moveMapTo(updated.lat, updated.lng, updated.zoom || 16);
  dataStatus.textContent = `${updated.name} のピン位置を初期位置に戻しました`;
}

function setMoveSpotMode(spotId) {
  const spot = spots.find((item) => item.id === spotId);
  if (!spot) return;
  setSpotMode(false);
  setCatchMode(false);
  moveSpotModeId = spotId;
  map.closePopup();
  map.getContainer().style.cursor = "crosshair";
  dataStatus.textContent = `${spot.name} の正しい位置を地図でタップしてください`;
  showSpotCard(`
    <p class="spot-card-type">位置修正中</p>
    <h2>${escapeHtml(spot.name)}</h2>
    <p>地図上で正しい港・堤防付近をタップすると、このピン位置を保存します。</p>
    <div class="spot-card-actions">
      <button class="delete-spot-button" type="button" id="cancelMoveSpot">キャンセル</button>
    </div>
  `);
  const cancelButton = document.querySelector("#cancelMoveSpot");
  if (cancelButton) cancelButton.addEventListener("click", () => {
    moveSpotModeId = null;
    map.getContainer().style.cursor = "";
    dataStatus.textContent = "位置修正をキャンセルしました";
    updateSpotCard(spot);
  });
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
      if (isMobileMapView()) closeMobileMenu();
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
  if (active) {
    moveSpotModeId = null;
    setSpotMode(false);
  }
  addCatchModeButton.classList.toggle("is-active", active);
  addCatchModeButton.textContent = active ? "地図をタップ" : "釣果ピン追加";
  map.getContainer().style.cursor = active ? "crosshair" : "";
}

function setSpotMode(active) {
  spotMode = active;
  if (active) {
    moveSpotModeId = null;
    setCatchMode(false);
  }
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
    : "写真フォルダーから選ぶか、カメラで撮影すると、現在地の記録に添付してこの端末に保存します";
}

function compressCatchPhoto(file) {
  return compressImageFile(file, {
    maxDimension: 960,
    maxLength: 320000,
    initialQuality: 0.76,
    minQuality: 0.42
  });
}

function closeSpotPanel() {
  spotPanel.classList.remove("is-open");
  spotPanel.setAttribute("aria-hidden", "true");
  editingSpotId = null;
  spotForm.reset();
}

function openCatchPanel(catchLog = null, latLng = null, options = {}) {
  editingCatchId = catchLog?.id || null;

  const lat = catchLog?.lat ?? latLng?.lat;
  const lng = catchLog?.lng ?? latLng?.lng;
  catchLat.value = Number.isFinite(Number(lat)) ? Number(lat) : "";
  catchLng.value = Number.isFinite(Number(lng)) ? Number(lng) : "";
  const locationSource = options.source || (catchLog ? "保存済み記録" : "記録位置");
  setCatchLocationStatus(lat, lng, locationSource, options.accuracy);
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

function isMobileMapView() {
  return window.matchMedia("(max-width: 820px)").matches || window.innerWidth <= 820;
}

function setMobileMenuOpen(open) {
  const shouldOpen = Boolean(open) && isMobileMapView();
  document.body.classList.toggle("is-menu-open", shouldOpen);
  sidebar.classList.toggle("is-open", shouldOpen);
  if (menuToggleButton) menuToggleButton.setAttribute("aria-expanded", String(shouldOpen));

  window.setTimeout(() => {
    map.invalidateSize({ pan: false });
  }, 80);
}

function closeMobileMenu() {
  setMobileMenuOpen(false);
}

function openMobileMenu() {
  setMobileMenuOpen(true);
}

function targetZoomForSpot(zoom, options = {}) {
  const requestedZoom = Number(zoom) || 15;
  // スマートフォンでは、釣り場をタップした時にしっかり寄って見えるようにする。
  // 三重県全体に戻す操作だけは、広域ズームを維持する。
  if (isMobileMapView() && options.mobileMinZoom !== false) {
    return Math.max(requestedZoom, Number(options.mobileMinZoom) || 16);
  }
  return requestedZoom;
}

function moveMapTo(lat, lng, zoom, options = {}) {
  const nextLat = Number(lat);
  const nextLng = Number(lng);
  if (!Number.isFinite(nextLat) || !Number.isFinite(nextLng)) return;

  const nextZoom = targetZoomForSpot(zoom, options);
  const target = L.latLng(nextLat, nextLng);

  map.closePopup();
  map.invalidateSize({ pan: false });
  map.setView(target, nextZoom, { animate: !isMobileMapView(), duration: 0.25 });

  // iPhone/Androidでは、レイアウト確定前にsetViewすると移動・ズームが反映されないことがあるため、少し遅らせて再指定する。
  window.setTimeout(() => {
    map.invalidateSize({ pan: false });
    map.setView(target, nextZoom, { animate: false });
  }, 80);

  window.setTimeout(() => {
    map.invalidateSize({ pan: false });
    map.panTo(target, { animate: false });
  }, 220);
}

function scrollSelectedSpotIntoView() {
  if (!isMobileMapView()) return;
  const row = spotList.querySelector(".spot-row.is-selected");
  if (!row) return;
  window.setTimeout(() => {
    row.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, 120);
}

function selectSpot(id) {
  const spot = spots.find((item) => item.id === id);
  if (!spot) return;

  selectedId = id;
  moveMapTo(spot.lat, spot.lng, spot.zoom);
  const marker = markers.get(id);
  if (marker) marker.openPopup();

  updateSpotCard(spot);
  renderList();
  scrollSelectedSpotIntoView();
  alignSingleSpotPosition(id);
  if (isMobileMapView()) closeMobileMenu();
}

function getSpotState(spotId) {
  savedState[spotId] = savedState[spotId] || {};
  if (Object.prototype.hasOwnProperty.call(savedState[spotId], "noBass")) {
    delete savedState[spotId].noBass;
  }
  if (!Array.isArray(savedState[spotId].fishSpecies)) {
    savedState[spotId].fishSpecies = [];
  }
  if (typeof savedState[spotId].otherFish !== "string") {
    savedState[spotId].otherFish = "";
  }
  return savedState[spotId];
}

function getFishList(spotId) {
  const state = getSpotState(spotId);
  const species = state.fishSpecies.filter(Boolean);
  const other = state.otherFish.trim();
  return other ? [...species, other] : species;
}

function getFishSummary(spotId) {
  const list = getFishList(spotId);
  if (!list.length) return "未選択";
  if (list.length === 1) return list[0];
  return `${list[0]} 他${list.length - 1}種`;
}

function setCaughtState(spotId, caught) {
  const state = getSpotState(spotId);
  state.hasBass = caught;
  if (caught && !getFishList(spotId).length) {
    state.fishSpecies = ["ブラックバス"];
  }
  if (!caught) {
    state.fishSpecies = [];
    state.otherFish = "";
  }
  persist();
}

function createFishButton(spot) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "fish-select-button";
  const summary = getFishSummary(spot.id);
  button.textContent = summary === "未選択" ? "選択" : summary;
  button.classList.toggle("has-species", summary !== "未選択");
  button.setAttribute("aria-label", `${spot.name}: 魚種を選択`);
  button.addEventListener("click", () => openFishPanel(spot));
  return button;
}

function renderFishOptions() {
  const state = getSpotState(editingFishSpotId);
  const selected = new Set(state.fishSpecies);
  fishSpeciesGroupsContainer.replaceChildren();

  fishSpeciesGroups.forEach((group) => {
    const section = document.createElement("section");
    section.className = "species-group";

    const title = document.createElement("div");
    title.className = "species-group-title";
    title.textContent = group.name;

    const options = document.createElement("div");
    options.className = "species-options";

    group.items.forEach((species) => {
      const label = document.createElement("label");
      label.className = "species-option";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = species;
      input.checked = selected.has(species);
      label.append(input, document.createTextNode(species));
      options.append(label);
    });

    section.append(title, options);
    fishSpeciesGroupsContainer.append(section);
  });

  otherFishInput.value = state.otherFish || "";
}

function openFishPanel(spot) {
  editingFishSpotId = spot.id;
  fishPanelSpotName.textContent = `${spot.name} / ${spot.area}`;
  renderFishOptions();
  fishPanel.classList.add("is-open");
  fishPanel.setAttribute("aria-hidden", "false");
}

function closeFishPanel() {
  fishPanel.classList.remove("is-open");
  fishPanel.setAttribute("aria-hidden", "true");
  editingFishSpotId = null;
  otherFishInput.value = "";
}

function saveFishSelection() {
  if (!editingFishSpotId) return;
  const state = getSpotState(editingFishSpotId);
  const selected = [...fishSpeciesGroupsContainer.querySelectorAll('input[type="checkbox"]:checked')]
    .map((input) => input.value);
  state.fishSpecies = selected;
  state.otherFish = otherFishInput.value.trim();
  state.hasBass = selected.length > 0 || Boolean(state.otherFish);
  persist();
  renderList();

  if (selectedId === editingFishSpotId) {
    const current = spots.find((spot) => spot.id === selectedId);
    if (current) updateSpotCard(current);
  }
  closeFishPanel();
}

function clearFishSelection() {
  if (!editingFishSpotId) return;
  const state = getSpotState(editingFishSpotId);
  state.fishSpecies = [];
  state.otherFish = "";
  state.hasBass = false;
  persist();
  renderList();
  if (selectedId === editingFishSpotId) {
    const current = spots.find((spot) => spot.id === selectedId);
    if (current) updateSpotCard(current);
  }
  closeFishPanel();
}

function setSpotStateFromCard(spotId, kind, checked) {
  const current = spots.find((item) => item.id === spotId);
  if (!current) return;

  selectedId = spotId;
  if (kind === "hasBass") {
    setCaughtState(spotId, checked);
  } else {
    const state = getSpotState(spotId);
    state[kind] = checked;
    persist();
  }

  renderList();
  updateSpotCard(current);
}

function updateSpotCard(spot) {
  const state = getSpotState(spot.id);
  const fishSummary = getFishSummary(spot.id);
  const hasCaught = Boolean(state.hasBass);
  const isBanned = Boolean(state.banned);
  const hasParking = Boolean(state.parking);
  const hasDefaultPosition = defaultSpotPositions.has(spot.id);
  const positionText = spot.positionAdjusted ? "補正済み" : "初期位置";
  const positionSourceText = spot.positionSource ? ` / ${escapeHtml(spot.positionSource)}` : "";
  const positionLabelText = spot.positionLabel ? `（${escapeHtml(spot.positionLabel)}）` : "";
  const sourceHtml = spot.source
    ? `<p class="spot-source">位置情報: ${escapeHtml(spot.source)} / ${positionText}${positionSourceText}${positionLabelText}（掲載は立入・釣り許可を意味しません）</p>`
    : `<p class="spot-source">位置情報: ${positionText}${positionSourceText}${positionLabelText}</p>`;
  showSpotCard(`
    <div class="spot-card-toolbar">
      <div class="spot-card-title">
        <p class="spot-card-type">${escapeHtml(spot.type)} / ${escapeHtml(spot.area)}</p>
        <h2>${escapeHtml(spot.name)}</h2>
      </div>
      <div class="spot-card-size-controls" aria-label="詳細カードの表示サイズ">
        <button class="spot-card-size-button" type="button" id="maximizeSpotCard" title="詳細カードを最大化" aria-label="詳細カードを最大化">拡大</button>
        <button class="spot-card-size-button" type="button" id="minimizeSpotCard" title="詳細カードを最小化" aria-label="詳細カードを最小化">縮小</button>
      </div>
    </div>
    <div class="spot-card-control-grid" aria-label="詳細カードでチェック">
      <label class="spot-card-check-control ${hasCaught ? "is-on" : ""}">
        <input id="spotCardCaught" type="checkbox" ${hasCaught ? "checked" : ""}>
        <span class="spot-card-control-text"><small>釣れた</small><strong>${hasCaught ? "あり" : "未"}</strong></span>
      </label>
      <button class="spot-card-fish-control ${fishSummary !== "未選択" ? "has-species" : ""}" type="button" id="spotCardFishButton">
        <small>魚種</small><strong>${escapeHtml(fishSummary === "未選択" ? "選択" : fishSummary)}</strong>
      </button>
      <label class="spot-card-check-control is-alert-control ${isBanned ? "is-alert" : ""}">
        <input id="spotCardBanned" type="checkbox" ${isBanned ? "checked" : ""}>
        <span class="spot-card-control-text"><small>禁止</small><strong>${isBanned ? "注意" : "未確認"}</strong></span>
      </label>
      <label class="spot-card-check-control ${hasParking ? "is-on" : ""}">
        <input id="spotCardParking" type="checkbox" ${hasParking ? "checked" : ""}>
        <span class="spot-card-control-text"><small>駐車</small><strong>${hasParking ? "あり" : "未確認"}</strong></span>
      </label>
    </div>
    <div class="spot-card-body">
      <p class="spot-card-note spot-card-safety">掲載は釣り許可を意味しません。現地看板・管理者・自治体・漁協の最新情報を必ず確認してください。</p>
      <p class="spot-card-note spot-card-check-note">このカードでもチェック・魚種選択を変更できます。</p>
      ${sourceHtml}
    </div>
    <div class="spot-card-actions">
      <button class="edit-spot-button" type="button" id="moveSpotPosition">位置を修正</button>
      ${spot.positionAdjusted && hasDefaultPosition ? `<button class="edit-spot-button" type="button" id="resetSpotPosition">初期位置に戻す</button>` : ""}
      ${spot.custom ? `
        <button class="edit-spot-button" type="button" id="editCustomSpot">編集</button>
        <button class="delete-spot-button" type="button" id="deleteCustomSpotCard">削除</button>
      ` : ""}
    </div>
  `);

  if (!spotCardSize) spotCardSize = defaultSpotCardSize();
  applySpotCardSize(spotCardSize);

  const maximizeButton = spotCard.querySelector("#maximizeSpotCard");
  if (maximizeButton) maximizeButton.addEventListener("click", () => applySpotCardSize("expanded"));
  const minimizeButton = spotCard.querySelector("#minimizeSpotCard");
  if (minimizeButton) minimizeButton.addEventListener("click", () => applySpotCardSize("compact"));
  const caughtInput = spotCard.querySelector("#spotCardCaught");
  if (caughtInput) caughtInput.addEventListener("change", (event) => setSpotStateFromCard(spot.id, "hasBass", event.target.checked));
  const bannedInput = spotCard.querySelector("#spotCardBanned");
  if (bannedInput) bannedInput.addEventListener("change", (event) => setSpotStateFromCard(spot.id, "banned", event.target.checked));
  const parkingInput = spotCard.querySelector("#spotCardParking");
  if (parkingInput) parkingInput.addEventListener("change", (event) => setSpotStateFromCard(spot.id, "parking", event.target.checked));
  const fishButton = spotCard.querySelector("#spotCardFishButton");
  if (fishButton) fishButton.addEventListener("click", () => openFishPanel(spot));
  const moveButton = spotCard.querySelector("#moveSpotPosition");
  if (moveButton) moveButton.addEventListener("click", () => setMoveSpotMode(spot.id));
  const resetButton = spotCard.querySelector("#resetSpotPosition");
  if (resetButton) resetButton.addEventListener("click", () => resetSpotPosition(spot.id));
  const editButton = spotCard.querySelector("#editCustomSpot");
  if (editButton) editButton.addEventListener("click", () => openSpotPanel(spot));
  const deleteButton = spotCard.querySelector("#deleteCustomSpotCard");
  if (deleteButton) deleteButton.addEventListener("click", () => deleteCustomSpot(spot.id));
}

function createCheckbox(spot, kind, label) {
  const input = document.createElement("input");
  input.type = "checkbox";
  input.dataset.kind = kind;
  input.checked = Boolean(savedState[spot.id]?.[kind]);
  input.setAttribute("aria-label", `${spot.name}: ${label}`);
  input.addEventListener("click", (event) => {
    // チェック操作が行の選択タップとして扱われないようにする。
    event.stopPropagation();
  });
  input.addEventListener("change", (event) => {
    event.stopPropagation();
    const checked = event.target.checked;
    const state = getSpotState(spot.id);

    if (kind === "hasBass") {
      setCaughtState(spot.id, checked);
    } else {
      state[kind] = checked;
      persist();
    }

    // v25: 釣れた・魚種だけでなく、禁止・駐車もチェックした釣り場の詳細カードへ即反映する。
    selectedId = spot.id;
    renderList();
    const current = spots.find((item) => item.id === spot.id) || spot;
    updateSpotCard(current);
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

    const caughtCell = document.createElement("label");
    caughtCell.className = "check-cell";
    caughtCell.append(createCheckbox(spot, "hasBass", "釣れた"));
    row.append(caughtCell);

    const fishCell = document.createElement("div");
    fishCell.className = "fish-cell";
    fishCell.append(createFishButton(spot));
    row.append(fishCell);

    [
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
  moveSpotModeId = null;
  map.getContainer().style.cursor = "";
  selectedId = null;
  moveMapTo(34.6761, 136.5086, 9, { mobileMinZoom: false });
  hideSpotCard();
  renderList();
  closeMobileMenu();
});

if (menuToggleButton) menuToggleButton.addEventListener("click", openMobileMenu);
if (menuBackdrop) menuBackdrop.addEventListener("click", closeMobileMenu);
if (closeMenuButton) closeMenuButton.addEventListener("click", closeMobileMenu);
window.addEventListener("resize", () => {
  if (!isMobileMapView()) closeMobileMenu();
  if (!spotCard.classList.contains("is-hidden") && spotCardSize) applySpotCardSize(spotCardSize);
  window.setTimeout(() => map.invalidateSize({ pan: false }), 120);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMobileMenu();
});

if (locateCatchButton) locateCatchButton.addEventListener("click", () => useCurrentLocationForCatch({ openPanel: true, button: locateCatchButton }));
addCatchModeButton.addEventListener("click", () => setCatchMode(!catchMode));
addSpotModeButton.addEventListener("click", () => setSpotMode(!spotMode));
closeCatchPanelButton.addEventListener("click", closeCatchPanel);
if (useCurrentLocationButton) useCurrentLocationButton.addEventListener("click", () => useCurrentLocationForCatch({ openPanel: false, button: useCurrentLocationButton }));
closeSpotPanelButton.addEventListener("click", closeSpotPanel);
changeBackgroundButton.addEventListener("click", openBackgroundPanel);
closeBackgroundPanelButton.addEventListener("click", closeBackgroundPanel);
closeBackgroundDoneButton.addEventListener("click", closeBackgroundPanel);
backgroundForm.addEventListener("submit", (event) => event.preventDefault());
backgroundCamera.addEventListener("change", () => handleBackgroundFile(backgroundCamera.files[0]));
backgroundPicker.addEventListener("change", () => handleBackgroundFile(backgroundPicker.files[0]));
resetBackgroundButton.addEventListener("click", () => {
  localStorage.removeItem(BACKGROUND_STORAGE_KEY);
  applySidebarBackground("");
  backgroundStatus.textContent = "初期背景に戻しました";
});
closeFishPanelButton.addEventListener("click", closeFishPanel);
installAppButton.addEventListener("click", handleInstallAppClick);
closeInstallPanelButton.addEventListener("click", closeInstallPanel);
closeInstallDoneButton.addEventListener("click", closeInstallPanel);
openInfoPanelButton.addEventListener("click", openInfoPanel);
closeInfoPanelButton.addEventListener("click", closeInfoPanel);
closeInfoDoneButton.addEventListener("click", closeInfoPanel);
exportDataButton.addEventListener("click", () => {
  openInfoPanel();
  exportBackupData();
});
importDataFile.addEventListener("change", () => {
  openInfoPanel();
  importBackupFile(importDataFile.files[0]);
});
if (autoAlignPositionsButton) {
  autoAlignPositionsButton.addEventListener("click", () => {
    autoAlignSpotPositions({ thorough: true, silent: false, force: true });
  });
}
fishForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveFishSelection();
});
clearFishSelectionButton.addEventListener("click", clearFishSelection);

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

async function handleCatchPhotoChange(input, label = "写真") {
  const [file] = input.files || [];
  if (!file) return;
  catchPhotoStatus.textContent = `${label}を圧縮しています…`;
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

catchPhoto.addEventListener("change", () => handleCatchPhotoChange(catchPhoto, "選択した写真"));
if (catchCamera) {
  catchCamera.addEventListener("change", () => handleCatchPhotoChange(catchCamera, "撮影した写真"));
}

removeCatchPhotoButton.addEventListener("click", () => {
  pendingCatchPhoto = "";
  catchPhoto.value = "";
  if (catchCamera) catchCamera.value = "";
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

  const catchLatValue = Number.parseFloat(catchLat.value);
  const catchLngValue = Number.parseFloat(catchLng.value);
  if (!Number.isFinite(catchLatValue) || !Number.isFinite(catchLngValue)) {
    setCatchLocationStatus(null, null);
    if (catchLocationStatus) catchLocationStatus.textContent = "記録位置がありません。地図をタップするか、現在地を使ってください。";
    return;
  }

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
    lat: catchLatValue,
    lng: catchLngValue
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
  if (moveSpotModeId) {
    const target = spots.find((spot) => spot.id === moveSpotModeId);
    if (!target) {
      moveSpotModeId = null;
      map.getContainer().style.cursor = "";
      return;
    }
    const ok = window.confirm(`${target.name} のピン位置をここに変更しますか？`);
    if (!ok) return;
    const targetId = moveSpotModeId;
    moveSpotModeId = null;
    map.getContainer().style.cursor = "";
    setSpotPosition(targetId, latlng.lat, latlng.lng);
    return;
  }
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
loadSavedBackground();

renderList();
setActiveList("spots");
scheduleInitialAutoAlign();

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  if (installAppButton && !isAppStandalone()) {
    installAppButton.textContent = "アプリをダウンロード";
    installAppButton.disabled = false;
  }
  updateInstallStatus();
});

window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  updateInstallStatus("インストールが完了しました。ホーム画面のアイコンから起動できます。");
});

updateInstallStatus();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js?v=38", { updateViaCache: "none" })
      .then((registration) => {
        console.log("Service worker registered:", registration.scope);
        registration.update().catch(() => {});

        if (registration.waiting) {
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
        }

        registration.addEventListener("updatefound", () => {
          const nextWorker = registration.installing;
          if (!nextWorker) return;
          nextWorker.addEventListener("statechange", () => {
            if (nextWorker.state === "installed" && navigator.serviceWorker.controller) {
              if (dataStatus) dataStatus.textContent = "新しい版を読み込みました。画面を更新します…";
              window.setTimeout(() => window.location.reload(), 500);
            }
          });
        });
      })
      .catch((error) => {
        console.log("Service worker registration failed:", error);
      });
  });
}
