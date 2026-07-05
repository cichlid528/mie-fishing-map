# v55 三重県範囲修正版（READMEは変更しない）

このZIPには `README.md` は入れていません。
既存のREADMEは上書きしないでください。

## アップロード対象

GitHubリポジトリ直下に、ZIPの中身を上書きしてください。

- index.html
- style.css
- app.js
- manifest.json
- sw.js
- pwa-install.js
- reset-cache.html
- icons/
- .nojekyll
- UPLOAD_STEPS_NO_README.md

## 反映後に最初に開くURL

https://cichlid528.github.io/mie-fishing-map/reset-cache.html?auto=1

このページで古いService Workerとキャッシュを消してから、最新版を開き直します。

## 通常確認URL

https://cichlid528.github.io/mie-fishing-map/?v=55-mie-boundsfix

## 修正内容

- v54で初期表示が広すぎて日本海側まで見える問題を修正
- 初期表示を三重県中央へ固定
- 最小ズームを画面幅に合わせて自動調整
- 地図タイルの読込範囲も三重県周辺に制限

## コミットメッセージ

fix: 三重県表示範囲を再固定して日本海側表示を防ぐ
