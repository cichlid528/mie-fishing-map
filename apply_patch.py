from pathlib import Path
import re

APP_VERSION = "v118-clear-all-points"
APP_STATUS = "v118・全ポイント削除版"
ROOT = Path.cwd()
app_path = ROOT / "app.js"
index_path = ROOT / "index.html"
pwa_path = ROOT / "pwa-install.js"

if not app_path.exists():
    raise SystemExit("app.js が見つかりません。このスクリプトは mie-fishing-map のルートで実行してください。")
if not index_path.exists():
    raise SystemExit("index.html が見つかりません。このスクリプトは mie-fishing-map のルートで実行してください。")

app = app_path.read_text(encoding="utf-8")
index = index_path.read_text(encoding="utf-8")

# 1) バージョン更新
app = re.sub(r'const APP_VERSION = "[^"]+";', f'const APP_VERSION = "{APP_VERSION}";', app, count=1)
app = re.sub(r'const APP_STATUS_LABEL = "[^"]+";', f'const APP_STATUS_LABEL = "{APP_STATUS}";', app, count=1)

# 2) 固定スポット seedSpots を空にする
marker = "const seedSpots = ["
start = app.find(marker)
if start == -1:
    raise SystemExit("const seedSpots = [ が見つかりませんでした。app.js の構造を確認してください。")
open_bracket = app.find("[", start)
if open_bracket == -1:
    raise SystemExit("seedSpots の開始 [ が見つかりませんでした。")

depth = 0
end = None
for i in range(open_bracket, len(app)):
    ch = app[i]
    if ch == "[":
        depth += 1
    elif ch == "]":
        depth -= 1
        if depth == 0:
            semi = app.find(";", i)
            if semi == -1:
                raise SystemExit("seedSpots 配列末尾の ; が見つかりませんでした。")
            end = semi + 1
            break
if end is None:
    raise SystemExit("seedSpots 配列の終端が見つかりませんでした。")

app = app[:start] + "const seedSpots = [\n  ];" + app[end:]

# 3) 初回起動時にローカル保存された追加スポット・記録ピンも消す
wipe_const = 'const POINT_WIPE_STORAGE_KEY = "mie-fishing-map-points-wiped-v118";'
if wipe_const not in app:
    app = app.replace(
        'const LEGACY_SINGLE_KEY = "mieFishingMap.v1";',
        'const LEGACY_SINGLE_KEY = "mieFishingMap.v1";\n  ' + wipe_const,
        1,
    )

wipe_block = '''

    // v118: 既存の固定ポイントを全削除したため、端末内に残った追加ポイント・記録ピンも一度だけ削除する。
    if (!localStorage.getItem(POINT_WIPE_STORAGE_KEY)) {
      state.savedState = {};
      state.customSpots = [];
      state.catches = [];
      state.positionOverrides = {};
      saveJson(STORAGE_KEY, state.savedState);
      saveJson(CUSTOM_SPOT_STORAGE_KEY, state.customSpots);
      saveJson(CATCH_STORAGE_KEY, state.catches);
      saveJson(POSITION_STORAGE_KEY, state.positionOverrides);
      localStorage.setItem(POINT_WIPE_STORAGE_KEY, new Date().toISOString());
    }
'''
if "既存の固定ポイントを全削除したため" not in app:
    anchor = "    state.backupMeta = safeParse(localStorage.getItem(BACKUP_META_STORAGE_KEY), {});\n"
    if anchor not in app:
        raise SystemExit("loadState 内の backupMeta 読み込み位置が見つかりませんでした。")
    app = app.replace(anchor, anchor + wipe_block, 1)

# 4) もし過去版の地理院池候補取得コードが app.js に入っていた場合は、最低限ボタンを作らせない
app = re.sub(r'\n\s*installGsiPondCandidateScanner\(\);', '', app)
app = re.sub(r'\n\s*installGsiPondButton\(\);', '', app)
app = app.replace('地理院池候補取得', '')
app = app.replace('池候補追加', '')

# 5) index.html のキャッシュバスター更新
index = re.sub(r'pwa-install\.js\?v=[^"\']+', f'pwa-install.js?v={APP_VERSION}', index)
index = re.sub(r'app\.js\?v=[^"\']+', f'app.js?v={APP_VERSION}', index)
index = re.sub(r'style\.css\?v=[^"\']+', f'style.css?v={APP_VERSION}', index)
index = re.sub(r'id="v\d+[^"\']*"', f'id="{APP_VERSION}-fix"', index)

# 6) pwa-install.js は同梱のクリーン版で差し替え
source_pwa = Path(__file__).with_name("pwa-install.js")
if source_pwa.exists():
    pwa_path.write_text(source_pwa.read_text(encoding="utf-8"), encoding="utf-8")
else:
    print("注意: 同梱 pwa-install.js が見つからないため、pwa-install.js の差し替えはスキップしました。")

app_path.write_text(app, encoding="utf-8")
index_path.write_text(index, encoding="utf-8")

print("完了: 全ポイント削除版へ更新しました。")
print("変更ファイル: app.js / index.html / pwa-install.js")
print('推奨コミット: git commit -m "v118: 全ポイントを削除して池候補追加機能を廃止"')
