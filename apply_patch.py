#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
v127 strict patch:
- app.js の固定ポイント seedSpots を空にする
- 端末内に残った追加ポイント・記録ピン・位置補正を一度だけ削除する
- 「地図ラベル名で池候補追加」ボタンと国土地理院池候補追加機能を無効化する
- index.html / pwa-install.js の読み込みバージョンを v127 に更新する
"""

from pathlib import Path
import re
import shutil
import sys

APP_VERSION = "v127-clear-all-points-strict"
APP_STATUS_LABEL = "v127・全ポイント削除版"

ROOT = Path.cwd()
APP_JS = ROOT / "app.js"
INDEX_HTML = ROOT / "index.html"
PWA_JS = ROOT / "pwa-install.js"
CLEAR_HTML = ROOT / "clear-all-points.html"

POINT_STORAGE_KEYS_JS = """
  const CLEAR_ALL_POINTS_STORAGE_KEY = "mie-fishing-map-clear-all-points-v127";
"""

CLEAR_HELPER_JS = r"""
  function clearAllPointDataOnce() {
    try {
      if (localStorage.getItem(CLEAR_ALL_POINTS_STORAGE_KEY) === APP_VERSION) return;
      [
        STORAGE_KEY,
        CATCH_STORAGE_KEY,
        CUSTOM_SPOT_STORAGE_KEY,
        POSITION_STORAGE_KEY,
        LEGACY_SINGLE_KEY,
        "mie-gsi-pond-candidates-v116-scanned",
        "mie-gsi-pond-candidates-v117-scanned",
        "mie-gsi-pond-candidates-v118-scanned",
        "mie-gsi-pond-candidates-v119-scanned",
        "mie-gsi-pond-candidates-v120-scanned",
        "mie-gsi-pond-candidates-v121-scanned",
        "mie-gsi-pond-candidates-v122-scanned",
        "mie-gsi-pond-candidates-v123-scanned",
        "mie-gsi-pond-candidates-v124-scanned",
        "mie-gsi-pond-candidates-v125-scanned",
        "mie-gsi-pond-candidates-v126-scanned"
      ].forEach((key) => {
        try { localStorage.removeItem(key); } catch (error) {}
      });
      localStorage.setItem(CLEAR_ALL_POINTS_STORAGE_KEY, APP_VERSION);
    } catch (error) {
      console.warn("clearAllPointDataOnce failed", error);
    }
  }

  function loadState() {
    clearAllPointDataOnce();

    state.savedState = safeParse(localStorage.getItem(STORAGE_KEY), {});
    Object.keys(state.savedState).forEach((id) => {
      state.savedState[id] = normalizeSavedSpotState(state.savedState[id]);
    });

    state.customSpots = safeParse(localStorage.getItem(CUSTOM_SPOT_STORAGE_KEY), [])
      .map((spot) => ({
        ...spot,
        id: spot.id || uid("spot"),
        type: spot.type || "池",
        custom: true,
        lat: Number(spot.lat),
        lng: Number(spot.lng)
      }))
      .filter(validPosition);

    state.catches = safeParse(localStorage.getItem(CATCH_STORAGE_KEY), []).map(normalizeRecord).filter((r) => validPosition(r));
    state.positionOverrides = safeParse(localStorage.getItem(POSITION_STORAGE_KEY), {});
    state.backupMeta = safeParse(localStorage.getItem(BACKUP_META_STORAGE_KEY), {});

    state.spots = [...seedSpots.map(applyPositionOverride), ...state.customSpots.map((s) => ({ ...s, custom: true }))];
  }
"""

PWA_CLEAR_JS = r"""
  function clearPointStorageNow() {
    try {
      const marker = "mie-fishing-map-clear-all-points-v127";
      if (localStorage.getItem(marker) === APP_VERSION) return;
      [
        "mie-bass-map-v1",
        "mie-bass-catches-v1",
        "mie-bass-custom-spots-v1",
        "mie-fishing-map-position-overrides-v86",
        "mieFishingMap.v1",
        "mie-gsi-pond-candidates-v116-scanned",
        "mie-gsi-pond-candidates-v117-scanned",
        "mie-gsi-pond-candidates-v118-scanned",
        "mie-gsi-pond-candidates-v119-scanned",
        "mie-gsi-pond-candidates-v120-scanned",
        "mie-gsi-pond-candidates-v121-scanned",
        "mie-gsi-pond-candidates-v122-scanned",
        "mie-gsi-pond-candidates-v123-scanned",
        "mie-gsi-pond-candidates-v124-scanned",
        "mie-gsi-pond-candidates-v125-scanned",
        "mie-gsi-pond-candidates-v126-scanned"
      ].forEach((key) => {
        try { localStorage.removeItem(key); } catch (error) {}
      });
      localStorage.setItem(marker, APP_VERSION);
    } catch (error) {}
  }
"""

def read_text(path: Path) -> str:
    if not path.exists():
        raise FileNotFoundError(f"{path.name} が見つかりません。リポジトリのルートで実行してください。")
    return path.read_text(encoding="utf-8")

def write_text(path: Path, text: str) -> None:
    path.write_text(text, encoding="utf-8", newline="\n")

def backup(path: Path) -> None:
    if path.exists():
        bak = path.with_suffix(path.suffix + ".bak-v127")
        shutil.copy2(path, bak)

def find_matching(text: str, start: int, open_char: str, close_char: str) -> int:
    depth = 0
    quote = None
    escape = False
    line_comment = False
    block_comment = False
    i = start
    while i < len(text):
        c = text[i]
        nxt = text[i + 1] if i + 1 < len(text) else ""

        if line_comment:
            if c == "\n":
                line_comment = False
            i += 1
            continue

        if block_comment:
            if c == "*" and nxt == "/":
                block_comment = False
                i += 2
            else:
                i += 1
            continue

        if quote:
            if escape:
                escape = False
            elif c == "\\":
                escape = True
            elif c == quote:
                quote = None
            i += 1
            continue

        if c in ("'", '"', "`"):
            quote = c
            i += 1
            continue

        if c == "/" and nxt == "/":
            line_comment = True
            i += 2
            continue

        if c == "/" and nxt == "*":
            block_comment = True
            i += 2
            continue

        if c == open_char:
            depth += 1
        elif c == close_char:
            depth -= 1
            if depth == 0:
                return i
        i += 1
    raise ValueError(f"対応する {close_char} が見つかりません。")

def replace_const_array(text: str, const_name: str, replacement: str) -> str:
    marker = f"const {const_name} = ["
    start = text.find(marker)
    if start < 0:
        print(f"注意: {const_name} が見つかりません。スキップします。")
        return text
    bracket_start = text.find("[", start)
    bracket_end = find_matching(text, bracket_start, "[", "]")
    semi = bracket_end + 1
    while semi < len(text) and text[semi].isspace():
        semi += 1
    if semi < len(text) and text[semi] == ";":
        semi += 1
    return text[:start] + replacement + text[semi:]

def replace_function(text: str, function_name: str, replacement: str) -> str:
    marker = f"function {function_name}"
    start = text.find(marker)
    if start < 0:
        print(f"注意: function {function_name} が見つかりません。スキップします。")
        return text
    brace_start = text.find("{", start)
    brace_end = find_matching(text, brace_start, "{", "}")
    return text[:start] + replacement + text[brace_end + 1:]

def patch_app_js(text: str) -> str:
    text = re.sub(r'const APP_VERSION = ".*?";', f'const APP_VERSION = "{APP_VERSION}";', text, count=1)
    text = re.sub(r'const APP_STATUS_LABEL = ".*?";', f'const APP_STATUS_LABEL = "{APP_STATUS_LABEL}";', text, count=1)

    text = replace_const_array(text, "GSI_POND_VECTOR_URLS", "const GSI_POND_VECTOR_URLS = [];")
    text = replace_const_array(text, "GSI_POND_SCAN_LIBS", "const GSI_POND_SCAN_LIBS = [];")
    text = replace_const_array(text, "GSI_POND_FALLBACK_CANDIDATES", "const GSI_POND_FALLBACK_CANDIDATES = [];")
    text = re.sub(r"const GSI_POND_MAX_SCAN_TILES = \d+;", "const GSI_POND_MAX_SCAN_TILES = 0;", text, count=1)

    text = replace_const_array(text, "seedSpots", "const seedSpots = [];")

    if "CLEAR_ALL_POINTS_STORAGE_KEY" not in text:
        text = text.replace('  const LEGACY_SINGLE_KEY = "mieFishingMap.v1";',
                            '  const LEGACY_SINGLE_KEY = "mieFishingMap.v1";\n' + POINT_STORAGE_KEYS_JS,
                            1)

    if "function loadState()" in text:
        text = replace_function(text, "loadState", CLEAR_HELPER_JS.strip("\n"))

    text = replace_function(text, "installGsiPondButton", "function installGsiPondButton() {\n    // v127: 池候補追加ボタンは廃止。\n  }")
    text = text.replace("    installGsiPondButton();\n", "")
    text = text.replace("地図ラベル名で池候補追加", "池候補追加機能は廃止済み")
    return text

def patch_index_html(text: str) -> str:
    text = re.sub(r'v\d+[a-zA-Z0-9\-]*', APP_VERSION, text)
    text = re.sub(r'<button class="filter-chip" type="button" data-filter="池候補">池候補</button>\s*', '', text)
    text = re.sub(r'v\d+・[^<"]+', APP_STATUS_LABEL, text)
    return text

def patch_pwa_js(text: str) -> str:
    text = re.sub(r'const APP_VERSION = ".*?";', f'const APP_VERSION = "{APP_VERSION}";', text, count=1)
    if "function clearPointStorageNow()" not in text:
        text = text.replace("  function isStandalone() {", PWA_CLEAR_JS + "\n\n  function isStandalone() {", 1)

    text = re.sub(
        r'window\.addEventListener\("load",\s*clearOldAppCache\);',
        'window.addEventListener("load", () => { clearPointStorageNow(); clearOldAppCache(); });',
        text,
        count=1
    )
    return text

CLEAR_HTML_CONTENT = f"""<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>全ポイント削除</title>
  <style>
    body {{ font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 24px; line-height: 1.7; }}
    button {{ font-size: 18px; padding: 12px 16px; border-radius: 10px; border: 1px solid #0f7b63; background: #0f7b63; color: white; }}
    code {{ background: #f3f3f3; padding: 2px 5px; border-radius: 5px; }}
  </style>
</head>
<body>
  <h1>全ポイント削除</h1>
  <p>このページは、端末に残った釣り場ポイント・池候補・記録ピン・位置調整データを削除します。</p>
  <button id="clearButton" type="button">全ポイントを削除する</button>
  <p id="status"></p>
  <p><a href="./?v={APP_VERSION}">アプリに戻る</a></p>
  <script>
    const keys = [
      "mie-bass-map-v1",
      "mie-bass-catches-v1",
      "mie-bass-custom-spots-v1",
      "mie-fishing-map-position-overrides-v86",
      "mieFishingMap.v1",
      "mie-gsi-pond-candidates-v116-scanned",
      "mie-gsi-pond-candidates-v117-scanned",
      "mie-gsi-pond-candidates-v118-scanned",
      "mie-gsi-pond-candidates-v119-scanned",
      "mie-gsi-pond-candidates-v120-scanned",
      "mie-gsi-pond-candidates-v121-scanned",
      "mie-gsi-pond-candidates-v122-scanned",
      "mie-gsi-pond-candidates-v123-scanned",
      "mie-gsi-pond-candidates-v124-scanned",
      "mie-gsi-pond-candidates-v125-scanned",
      "mie-gsi-pond-candidates-v126-scanned",
      "mie-fishing-map-clear-all-points-v127"
    ];

    async function clearAll() {{
      keys.forEach((key) => {{
        try {{ localStorage.removeItem(key); }} catch (e) {{}}
      }});
      try {{
        if ("serviceWorker" in navigator) {{
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map((r) => r.unregister()));
        }}
        if ("caches" in window) {{
          const cacheKeys = await caches.keys();
          await Promise.all(cacheKeys.map((key) => caches.delete(key)));
        }}
      }} catch (e) {{}}
      document.getElementById("status").textContent = "削除しました。アプリを開き直してください。";
    }}

    document.getElementById("clearButton").addEventListener("click", clearAll);
    if (new URLSearchParams(location.search).get("auto") === "1") clearAll();
  </script>
</body>
</html>
"""

def main() -> None:
    backup(APP_JS)
    backup(INDEX_HTML)
    backup(PWA_JS)

    app = patch_app_js(read_text(APP_JS))
    index = patch_index_html(read_text(INDEX_HTML))
    pwa = patch_pwa_js(read_text(PWA_JS))

    write_text(APP_JS, app)
    write_text(INDEX_HTML, index)
    write_text(PWA_JS, pwa)
    write_text(CLEAR_HTML, CLEAR_HTML_CONTENT)

    print("OK: v127 全ポイント削除版を適用しました。")
    print("次のコマンドで反映してください:")
    print("  git add app.js index.html pwa-install.js clear-all-points.html")
    print('  git commit -m "v127: 全ポイントを削除して池候補追加機能を廃止"')
    print("  git push")

if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        sys.exit(1)
