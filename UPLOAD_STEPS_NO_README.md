# v74 アップロード手順（READMEなし）

このZIPは、PC版・スマホ版どちらも地図切替を「標準地図」「航空写真」だけに統一した修正版です。READMEは入れていません。

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

https://cichlid528.github.io/mie-fishing-map/?v=v74-two-maplayers-all-devices

## v74の変更点

- PC版・スマホ版ともに地図切替項目を「標準地図」「航空写真」のみに整理
- 「淡色地図」「陰影起伏図」は出ないように削除
- PC/スマホの操作ボタン左下配置は維持
- 国土地理院（地理院タイル）の出典表記を維持

## コミット案

fix: 全端末の地図項目を標準地図と航空写真だけに整理
