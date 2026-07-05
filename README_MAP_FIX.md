# 三重県釣りマップ v46 地図表示復旧版

このZIPは、地図が崩れる・真っ白になる・タイルだけずれる症状を直すための復旧版です。

## アップロードするファイル

GitHubリポジトリ直下に、ZIPの中身をそのままアップロードしてください。

- index.html
- style.css
- app.js
- manifest.json
- sw.js
- icons フォルダ
- .nojekyll

## 反映後に開くURL

https://cichlid528.github.io/mie-fishing-map/?v=46-mapfix

## 直した内容

- 地図エリアの高さを `100dvh` 対応に変更
- Leafletの `invalidateSize()` を起動時・回転時・メニュー開閉時に実行
- スマホで古いキャッシュが残りにくいようにService Workerをv46へ更新
- 古い `bass-spot-log-*` キャッシュを削除
- GitHub PagesでCSS/JSが確実に新しく読まれるように `v=46-mapfix` を付与

## コミットメッセージ

```text
fix: スマホで崩れる地図表示を復旧
```

## スマホ側でまだ崩れる場合

Android Chrome: アプリ情報またはChrome設定からサイトデータ/キャッシュを削除して、もう一度開いてください。

iPhone Safari: 設定 → Safari → 履歴とWebサイトデータを消去してから、Safariで開き直してください。
