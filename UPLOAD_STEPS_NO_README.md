# v75 アップロード手順（READMEなし）

## 重要
READMEは入れていません。既存のREADMEは上書きしないでください。

今回の修正は、PC版・スマホ版の左メニュー背景です。
設定した写真が濃い緑の塗りつぶしで見えにくかったため、背景の色を薄くして写真を見やすくし、文字は読めるように影と半透明パネルで調整しています。

## アップロードするもの
ZIPを解凍して、中身をリポジトリ直下へまとめてアップロードしてください。

- index.html
- style.css
- app.js
- manifest.json
- sw.js
- pwa-install.js
- reset-cache.html
- icons フォルダ
- .nojekyll
- UPLOAD_STEPS_NO_README.md

## アップロード後の確認

1. 先にキャッシュ削除ページを開く

https://cichlid528.github.io/mie-fishing-map/reset-cache.html?auto=1

2. 通常ページを開く

https://cichlid528.github.io/mie-fishing-map/?v=v75-menu-photo-readable

## v75の変更点

- PC版メニューの背景写真を見やすく調整
- スマホ版メニューの背景写真を見やすく調整
- 濃い緑の上塗りを弱めた
- 文字は読みやすいように影と薄いガラス風パネルを追加
- 地図項目は標準地図／航空写真のみを維持
- 操作ボタンの左下配置は維持

## コミットメッセージ案

fix: メニュー背景写真を見やすく調整
