from pathlib import Path

ROOT = Path.cwd()
PACK_DIR = Path(__file__).resolve().parent

NEW_VERSION = "v116-gsi-pond-candidates"
OLD_VERSION = "v115-pond-confirm-persist"

pwa_src = PACK_DIR / "pwa-install.js"
pwa_dst = ROOT / "pwa-install.js"
index_path = ROOT / "index.html"

if not pwa_src.exists():
    raise SystemExit("pwa-install.js が見つかりません。ZIPを展開した場所を確認してください。")
if not index_path.exists():
    raise SystemExit("index.html が見つかりません。mie-fishing-map のルートフォルダで実行してください。")

pwa_dst.write_text(pwa_src.read_text(encoding="utf-8"), encoding="utf-8")

index = index_path.read_text(encoding="utf-8")
index = index.replace(OLD_VERSION, NEW_VERSION)
index_path.write_text(index, encoding="utf-8")

print("v116-gsi-pond-candidates を反映しました。")
print("変更ファイル: pwa-install.js, index.html")
print("次に git add / commit / push をしてください。")
