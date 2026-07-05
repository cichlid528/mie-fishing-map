# v54 三重県限定マップ版（READMEは変更しない）

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

https://cichlid528.github.io/mie-fishing-map/?v=54-mie-only

## コミットメッセージ

fix: 地図表示を三重県範囲に限定

## 今回の修正内容

- 地図の初期表示を三重県全体に合わせました。
- 地図を三重県周辺の範囲外へ大きく移動できないようにしました。
- 「三重県全体に戻す」ボタンも三重県範囲へ戻るようにしました。
