const STORAGE_KEY = "mie-bass-map-v1";
const CATCH_STORAGE_KEY = "mie-bass-catches-v1";
const CUSTOM_SPOT_STORAGE_KEY = "mie-bass-custom-spots-v1";
const BACKGROUND_STORAGE_KEY = "mie-fishing-map-sidebar-background-v1";
const POSITION_STORAGE_KEY = "mie-fishing-map-position-overrides-v1";

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
  { id: "port-kuwana", name: "桑名港", type: "港", area: "桑名市 / 木曽三川河口周辺", lat: 35.0670, lng: 136.7030, zoom: 15, source: "港・漁港代表地点" },
  { id: "port-yokkaichi", name: "四日市港", type: "港", area: "四日市市", lat: 34.9580, lng: 136.6460, zoom: 14, source: "港・漁港代表地点" },
  { id: "port-isodzu", name: "磯津漁港", type: "港", area: "四日市市磯津町", lat: 34.9125, lng: 136.6578, zoom: 16, source: "港・漁港代表地点" },
  { id: "port-shiroko", name: "白子漁港", type: "港", area: "鈴鹿市白子", lat: 34.8286, lng: 136.5967, zoom: 16, source: "港・漁港代表地点" },
  { id: "port-chiyozaki", name: "千代崎港", type: "港", area: "鈴鹿市岸岡町周辺", lat: 34.8499, lng: 136.5975, zoom: 16, source: "港・漁港代表地点" },
  { id: "port-kawage", name: "河芸漁港", type: "港", area: "津市河芸町", lat: 34.7902, lng: 136.5676, zoom: 16, source: "港・漁港代表地点" },
  { id: "port-tsu", name: "津港", type: "港", area: "津市なぎさまち周辺", lat: 34.7275, lng: 136.5269, zoom: 15, source: "港・漁港代表地点" },
  { id: "port-karasu", name: "香良洲漁港", type: "港", area: "津市香良洲町", lat: 34.6470, lng: 136.5581, zoom: 16, source: "港・漁港代表地点" },
  { id: "port-matsusaka", name: "松阪港", type: "港", area: "松阪市大口町周辺", lat: 34.5968, lng: 136.5688, zoom: 15, source: "港・漁港代表地点" },
  { id: "port-oyodo", name: "大淀漁港", type: "港", area: "多気郡明和町大淀", lat: 34.5450, lng: 136.6406, zoom: 16, source: "港・漁港代表地点" },
  { id: "port-aritaki", name: "有滝漁港", type: "港", area: "伊勢市有滝町", lat: 34.5436, lng: 136.6728, zoom: 16, source: "港・漁港代表地点" },
  { id: "port-futami", name: "二見浦漁港", type: "港", area: "伊勢市二見町", lat: 34.5095, lng: 136.7810, zoom: 16, source: "港・漁港代表地点" },
  { id: "port-toba", name: "鳥羽港", type: "港", area: "鳥羽市鳥羽", lat: 34.4860, lng: 136.8435, zoom: 15, source: "港・漁港代表地点" },
  { id: "port-ohama-toba", name: "小浜漁港", type: "港", area: "鳥羽市小浜町", lat: 34.4934, lng: 136.8280, zoom: 16, source: "港・漁港代表地点" },
  { id: "port-arashima", name: "安楽島漁港", type: "港", area: "鳥羽市安楽島町", lat: 34.4694, lng: 136.8646, zoom: 16, source: "港・漁港代表地点" },
  { id: "port-ijika", name: "石鏡漁港", type: "港", area: "鳥羽市石鏡町", lat: 34.4476, lng: 136.9142, zoom: 16, source: "港・漁港代表地点" },
  { id: "port-kuzaki", name: "国崎漁港", type: "港", area: "鳥羽市国崎町", lat: 34.3985, lng: 136.9080, zoom: 16, source: "港・漁港代表地点" },
  { id: "port-osatsu", name: "相差漁港", type: "港", area: "鳥羽市相差町", lat: 34.3899, lng: 136.9090, zoom: 16, source: "港・漁港代表地点" },
  { id: "port-matoya", name: "的矢漁港", type: "港", area: "志摩市磯部町的矢", lat: 34.3725, lng: 136.8531, zoom: 16, source: "港・漁港代表地点" },
  { id: "port-anori", name: "安乗漁港", type: "港", area: "志摩市阿児町安乗", lat: 34.3576, lng: 136.9045, zoom: 16, source: "港・漁港代表地点" },
  { id: "port-wagu-shima", name: "和具漁港", type: "港", area: "志摩市志摩町和具", lat: 34.2490, lng: 136.8022, zoom: 16, source: "港・漁港代表地点" },
  { id: "port-nakiri", name: "波切漁港", type: "港", area: "志摩市大王町波切", lat: 34.2752, lng: 136.8989, zoom: 16, source: "港・漁港代表地点" },
  { id: "port-katada", name: "片田漁港", type: "港", area: "志摩市志摩町片田", lat: 34.2328, lng: 136.8175, zoom: 16, source: "港・漁港代表地点" },
  { id: "port-goza", name: "御座漁港", type: "港", area: "志摩市志摩町御座", lat: 34.2774, lng: 136.7623, zoom: 16, source: "港・漁港代表地点" },
  { id: "port-hamajima", name: "浜島港", type: "港", area: "志摩市浜島町", lat: 34.2997, lng: 136.7556, zoom: 16, source: "港・漁港代表地点" },
  { id: "port-gokasho", name: "五ヶ所浦", type: "港", area: "南伊勢町五ヶ所湾", lat: 34.3498, lng: 136.7036, zoom: 15, source: "港・漁港代表地点" },
  { id: "port-hazamaura", name: "迫間浦", type: "港", area: "南伊勢町迫間浦", lat: 34.3035, lng: 136.7123, zoom: 16, source: "港・漁港代表地点" },
  { id: "port-tasoura", name: "田曽浦", type: "港", area: "南伊勢町田曽浦", lat: 34.2820, lng: 136.6676, zoom: 16, source: "港・漁港代表地点" },
  { id: "port-shukuura", name: "宿浦漁港", type: "港", area: "南伊勢町宿浦", lat: 34.2824, lng: 136.6622, zoom: 16, source: "港・漁港代表地点" },
  { id: "port-kamiesura", name: "神前浦漁港", type: "港", area: "南伊勢町神前浦", lat: 34.2508, lng: 136.5816, zoom: 16, source: "港・漁港代表地点" },
  { id: "port-kowaura", name: "古和浦漁港", type: "港", area: "南伊勢町古和浦", lat: 34.2239, lng: 136.5355, zoom: 16, source: "港・漁港代表地点" },
  { id: "port-nieura", name: "贄浦漁港", type: "港", area: "南伊勢町贄浦", lat: 34.2157, lng: 136.5144, zoom: 16, source: "港・漁港代表地点" },
  { id: "port-hozaura", name: "方座浦漁港", type: "港", area: "南伊勢町方座浦", lat: 34.2017, lng: 136.4940, zoom: 16, source: "港・漁港代表地点" },
  { id: "port-nishiki", name: "錦漁港", type: "港", area: "大紀町錦", lat: 34.2050, lng: 136.3950, zoom: 16, source: "港・漁港代表地点" },
  { id: "port-kiinagashima", name: "紀伊長島港", type: "港", area: "北牟婁郡紀北町長島", lat: 34.2106, lng: 136.3378, zoom: 15, source: "港・漁港代表地点" },
  { id: "port-hikimoto", name: "引本港", type: "港", area: "北牟婁郡紀北町引本浦", lat: 34.1108, lng: 136.2509, zoom: 16, source: "港・漁港代表地点" },
  { id: "port-owase", name: "尾鷲港", type: "港", area: "尾鷲市", lat: 34.0712, lng: 136.2070, zoom: 15, source: "港・漁港代表地点" },
  { id: "port-kuki", name: "九鬼漁港", type: "港", area: "尾鷲市九鬼町", lat: 33.9856, lng: 136.2365, zoom: 16, source: "港・漁港代表地点" },
  { id: "port-haida", name: "早田漁港", type: "港", area: "尾鷲市早田町", lat: 33.9646, lng: 136.2301, zoom: 16, source: "港・漁港代表地点" },
  { id: "port-mikiura", name: "三木浦漁港", type: "港", area: "尾鷲市三木浦町", lat: 33.9392, lng: 136.2224, zoom: 16, source: "港・漁港代表地点" },
  { id: "port-kata", name: "賀田港", type: "港", area: "尾鷲市賀田町", lat: 33.9020, lng: 136.1905, zoom: 16, source: "港・漁港代表地点" },
  { id: "port-atashika", name: "新鹿漁港", type: "港", area: "熊野市新鹿町", lat: 33.9292, lng: 136.1413, zoom: 16, source: "港・漁港代表地点" },
  { id: "port-kinomoto", name: "木本港", type: "港", area: "熊野市木本町", lat: 33.8907, lng: 136.1005, zoom: 16, source: "港・漁港代表地点" },
  { id: "port-yuki", name: "遊木漁港", type: "港", area: "熊野市遊木町", lat: 33.8660, lng: 136.0930, zoom: 16, source: "港・漁港代表地点" },
  { id: "port-udono", name: "鵜殿港", type: "港", area: "南牟婁郡紀宝町鵜殿", lat: 33.7364, lng: 136.0059, zoom: 15, source: "港・漁港代表地点" }
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

let customSpots = JSON.parse(localStorage.getItem(CUSTOM_SPOT_STORAGE_KEY) || "[]");
let positionOverrides = JSON.parse(localStorage.getItem(POSITION_STORAGE_KEY) || "{}");
const defaultSpotPositions = new Map(
  [...seedSpots, ...portSpots].map((spot) => [spot.id, { lat: spot.lat, lng: spot.lng }])
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
    positionAdjusted: true
  };
}

let spots = [...seedSpots, ...portSpots].map(applyPositionOverride).concat(customSpots);

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
let editingFishSpotId = null;

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
let moveSpotModeId = null;

dataStatus.textContent = `池${seedSpots.filter((spot) => spot.type === "池").length}件、港・漁港${portSpots.length}件を表示中（港ピンは詳細カードから位置補正できます）`;

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
  return "pond";
}

function markerLabel(type) {
  if (type === "川") return "川";
  if (type === "ダム") return "堰";
  if (type === "港") return "港";
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

function persistPositionOverrides() {
  localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(positionOverrides));
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
      positionAdjusted: !spot.custom
    };
  });

  const updated = spots.find((spot) => spot.id === spotId);
  if (!updated) return;

  if (updated.custom) {
    persistCustomSpots();
  } else {
    positionOverrides[spotId] = { lat: nextLat, lng: nextLng };
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
    spot.id === spotId ? { ...spot, lat: base.lat, lng: base.lng, positionAdjusted: false } : spot
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
    : "写真は圧縮してこの端末に保存します";
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

  updateSpotCard(spot);
  renderList();
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

function updateSpotCard(spot) {
  const fishSummary = getFishSummary(spot.id);
  const hasDefaultPosition = defaultSpotPositions.has(spot.id);
  const positionText = spot.positionAdjusted ? "補正済み" : "初期位置";
  showSpotCard(`
    <p class="spot-card-type">${escapeHtml(spot.type)} / ${escapeHtml(spot.area)}</p>
    <h2>${escapeHtml(spot.name)}</h2>
    <p>掲載は釣り許可を意味しません。現地看板・管理者・自治体・漁協の最新情報を必ず確認してください。</p>
    <p>左のチェックで「釣れた魚種」「釣り禁止」「駐車」を記録できます。</p>
    <p class="spot-source">記録魚種: ${escapeHtml(fishSummary)}</p>
    ${spot.source ? `<p class="spot-source">位置情報: ${escapeHtml(spot.source)} / ${positionText}（掲載は立入・釣り許可を意味しません）</p>` : `<p class="spot-source">位置情報: ${positionText}</p>`}
    <div class="spot-card-actions">
      <button class="edit-spot-button" type="button" id="moveSpotPosition">位置を修正</button>
      ${spot.positionAdjusted && hasDefaultPosition ? `<button class="edit-spot-button" type="button" id="resetSpotPosition">初期位置に戻す</button>` : ""}
      ${spot.custom ? `
        <button class="edit-spot-button" type="button" id="editCustomSpot">編集</button>
        <button class="delete-spot-button" type="button" id="deleteCustomSpotCard">削除</button>
      ` : ""}
    </div>
  `);
  const moveButton = document.querySelector("#moveSpotPosition");
  if (moveButton) moveButton.addEventListener("click", () => setMoveSpotMode(spot.id));
  const resetButton = document.querySelector("#resetSpotPosition");
  if (resetButton) resetButton.addEventListener("click", () => resetSpotPosition(spot.id));
  const editButton = document.querySelector("#editCustomSpot");
  if (editButton) editButton.addEventListener("click", () => openSpotPanel(spot));
  const deleteButton = document.querySelector("#deleteCustomSpotCard");
  if (deleteButton) deleteButton.addEventListener("click", () => deleteCustomSpot(spot.id));
}

function createCheckbox(spot, kind, label) {
  const input = document.createElement("input");
  input.type = "checkbox";
  input.dataset.kind = kind;
  input.checked = Boolean(savedState[spot.id]?.[kind]);
  input.setAttribute("aria-label", `${spot.name}: ${label}`);
  input.addEventListener("change", (event) => {
    const state = getSpotState(spot.id);
    state[kind] = event.target.checked;

    if (kind === "hasBass") {
      setCaughtState(spot.id, event.target.checked);
    } else {
      persist();
    }

    renderList();
    if (selectedId === spot.id) updateSpotCard(spot);
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
  moveMapTo(34.6761, 136.5086, 9);
  hideSpotCard();
  renderList();
});

addCatchModeButton.addEventListener("click", () => setCatchMode(!catchMode));
addSpotModeButton.addEventListener("click", () => setSpotMode(!spotMode));
closeCatchPanelButton.addEventListener("click", closeCatchPanel);
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
