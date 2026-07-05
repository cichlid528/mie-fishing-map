# v58 キャッシュ停止・三重県固定表示版（READMEは変更しない）

このZIPには `README.md` は入れていません。既存のREADMEは上書きしないでください。

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

## 重要

今回の版は、古いService Workerキャッシュが地図を壊す可能性を潰すため、アプリシェルのService Workerキャッシュを停止します。
釣果・追加釣り場・写真・背景画像などの localStorage は消しません。

## 反映後に最初に開くURL

https://cichlid528.github.io/mie-fishing-map/reset-cache.html?auto=1

## 通常確認URL

https://cichlid528.github.io/mie-fishing-map/?v=58-nocache-mie

## コミットメッセージ

fix: 古いキャッシュを停止して三重県マップ表示を固定
