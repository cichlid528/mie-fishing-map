# v56 三重県固定表示版（READMEは変更しない）

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

https://cichlid528.github.io/mie-fishing-map/?v=56-mie-fixed

## 修正内容

- 初期表示を三重県中央に固定
- 最小ズームを固定して、日本海側までズームアウトしないように修正
- 三重県外へ大きく移動できないように制限
- 三重県の範囲を見分けやすいように境界線と外側マスクを追加
- バージョンを v56-mie-fixed に統一

## コミットメッセージ

fix: 地図表示を三重県中央に固定
