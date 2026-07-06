# v77 アップロード手順（READMEなし）

このZIPは、記録時の画像添付を確実にし、保存後の記録一覧と地図ポップアップにも写真が出るようにした修正版です。

## 重要

リポジトリ直下へ、ZIPの中身をまとめて上書きしてください。READMEは入れていません。

必ず上書きするファイル:

- index.html
- app.js
- style.css
- manifest.json
- pwa-install.js
- sw.js
- reset-cache.html
- icons フォルダ
- .nojekyll

## v77の変更点

- 写真を選んでからすぐ保存しても、圧縮完了を待ってから記録に添付
- 保存した記録の一覧に写真サムネイルを表示
- 地図上の記録ピンのポップアップにも写真を表示
- 写真ありの記録には「写真あり」バッジを表示
- 既存のポップアウト表示、メニュー背景調整、標準地図／航空写真のみの設定は維持

## アップロード後の確認

まずキャッシュを削除してください。

https://cichlid528.github.io/mie-fishing-map/reset-cache.html?auto=1

その後、以下で確認してください。

https://cichlid528.github.io/mie-fishing-map/?v=v77-record-photo-attached

## コミット案

fix: 記録写真の添付と表示を修正
