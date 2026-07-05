# v71 アップロード手順（READMEなし）

このZIPの中身を、GitHubリポジトリ `cichlid528/mie-fishing-map` のルートへそのまま上書きアップロードしてください。

## 重要

- `index.html`
- `style.css`
- `app.js`
- `sw.js`
- `pwa-install.js`
- `manifest.json`
- `reset-cache.html`
- `icons/` フォルダ

上記をまとめて上書きしてください。

## 変更内容

- スマホ版の `☰ メニュー` ボタンを地図の外側、body直下へ移動
- メニューボタン、右上操作ボタン、メニュー本体をLeaflet地図より前面に固定
- メニューを開いた時に検索、フィルター、釣り場リスト、記録リスト、設定ボタンを使えるように調整
- 国土地理院（地理院タイル）の表記を維持
- 三重県固定・マップ固定は入れていません

## アップロード後に開くURL

最初にキャッシュ削除ページを開いてください。

```text
https://cichlid528.github.io/mie-fishing-map/reset-cache.html?auto=1
```

その後、最新版URLで確認してください。

```text
https://cichlid528.github.io/mie-fishing-map/?v=v71-mobile-menu-front
```

## コミットメッセージ案

```text
fix: スマホメニューを地図より前面に固定
```
