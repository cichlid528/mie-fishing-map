# v73 アップロード手順（READMEなし）

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

https://cichlid528.github.io/mie-fishing-map/?v=v73-desktop-tools-maplayers

## コミット案

fix: PC/スマホの操作ボタン重なりを解消


## v73の変更点
- PCでも「現在地メモ登録・釣り場追加・記録ピン追加」を左下に移動
- 地図切替項目を「標準地図」「航空写真」のみに整理
- 国土地理院（地理院タイル）の出典表記を維持

コミット案: fix: PC操作ボタンの重なりと地図項目を整理
