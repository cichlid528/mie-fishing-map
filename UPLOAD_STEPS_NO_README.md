# v72 アップロード手順（READMEなし）

このZIPは、スマホ版で右上に重なっていた操作ボタンを左下へ移動した修正版です。READMEは入れていません。

## アップロードするもの

ZIPを解凍して、中身を GitHub リポジトリ直下へ上書きしてください。

- index.html
- style.css
- app.js
- manifest.json
- sw.js
- pwa-install.js
- reset-cache.html
- icons フォルダ
- .nojekyll

## 先にキャッシュを消す

アップロード後、まず下のURLを開いてください。

https://cichlid528.github.io/mie-fishing-map/reset-cache.html?auto=1

## 確認URL

https://cichlid528.github.io/mie-fishing-map/?v=v72-mobile-tools-bottom-left

## コミット案

fix: スマホ操作ボタンを左下へ移動
