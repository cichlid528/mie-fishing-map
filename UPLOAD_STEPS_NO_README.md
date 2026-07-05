# v76 アップロード手順（READMEなし）

このZIPは、メニュー内のボタンから開く画面を、メニューに隠れないポップアウト表示へ直した版です。
READMEは入れていません。

## アップロードする場所

GitHub リポジトリ `cichlid528/mie-fishing-map` の直下へ、ZIPの中身をそのまま上書きしてください。

## 必ず上書きするファイル

- index.html
- style.css
- app.js
- manifest.json
- pwa-install.js
- reset-cache.html
- sw.js
- icons フォルダ
- .nojekyll

## v76の変更点

- メニュー内の「注意・規約」「背景画像変更」「アプリをダウンロード」などをポップアウト表示に修正
- スマホでメニューを開いた状態からボタンを押しても、先にメニューを閉じて画面を前面表示
- 釣り場追加・現地メモ・記録フォームも地図やメニューより前面表示
- PC/スマホ両方で、ポップアウト画面を中央に表示
- 背景写真を見やすくする調整、標準地図／航空写真のみの設定は維持

## キャッシュ削除URL

アップロード後、最初にこちらを開いてください。

https://cichlid528.github.io/mie-fishing-map/reset-cache.html?auto=1

## 確認URL

https://cichlid528.github.io/mie-fishing-map/?v=v76-popout-panels

## コミットメッセージ案

fix: メニュー内ボタンのポップアウト表示を修正
