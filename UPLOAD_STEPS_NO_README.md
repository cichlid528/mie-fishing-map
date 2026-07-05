# v69 アップロード手順（READMEなし）

今回の目的:
- PCでは左メニューを常時表示して、検索・絞り込み・一覧・バックアップ等を全部使えるように戻す
- スマホでは「☰ メニュー」で開く引き出し式を維持
- 全画面固定CSSと強制z-indexを整理して、地図がメニューを隠さないようにする
- 国土地理院の表記を「地図: 国土地理院（地理院タイル）」に修正
- 地図は国土地理院の地理院タイルを直接使用し、三重県固定・移動制限はしない

## アップロード

このZIPの中身を、GitHubリポジトリ `cichlid528/mie-fishing-map` のルートに上書きしてください。

## 反映確認

最初に開くURL:

https://cichlid528.github.io/mie-fishing-map/reset-cache.html?auto=1

通常確認URL:

https://cichlid528.github.io/mie-fishing-map/?v=v69-menu-gsi-fixed

## コミット案

fix: メニュー表示と国土地理院表記を修正
