# v53 地図ズレ修正版（READMEは変更しない）

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

https://cichlid528.github.io/mie-fishing-map/?v=53-mapfix

## コミットメッセージ

fix: 地図ズレを防ぐ位置補正とLeaflet表示を修正
