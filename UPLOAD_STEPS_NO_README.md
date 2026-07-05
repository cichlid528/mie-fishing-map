# v64 完全全画面マップ版（READMEは変更しない）

このZIPには `README.md` は入れていません。
既存のREADMEは上書きしないでください。

## 重要

今回は `style.css` の上書きが必須です。
現在の公開アプリが全画面にならない原因は、古い `style.css` が左メニュー用の `grid-template-columns: 380px 1fr` を持ったまま残っているためです。
ZIPの中身をリポジトリ直下へまとめて上書きしてください。

## アップロード対象

- index.html
- style.css
- app.js
- manifest.json
- sw.js
- pwa-install.js
- reset-cache.html
- mie-map-reference-clean.png
- icons/
- .nojekyll
- UPLOAD_STEPS_NO_README.md

## 反映後に最初に開くURL

https://cichlid528.github.io/mie-fishing-map/reset-cache.html?auto=1

## 通常確認URL

https://cichlid528.github.io/mie-fishing-map/?v=64-hard-fullscreen

## コミットメッセージ

fix: 地図を完全全画面表示に固定
