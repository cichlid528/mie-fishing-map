# 三重県釣りマップ v156 修正ZIP

修正名：v156・メニュー背景と地図反映修正版

## 修正内容

- メニュー画面だけを爆釣ツインニャンコ背景に変更。
- 地図本体には背景画像を当てないように修正。
- スマホで釣りニャンが大きすぎて邪魔になる問題を軽減。
- 地図表示が反映されにくい時のため、リサイズ再計算を追加。
- reset-cache.html / manifest.json / sw.js を v156 に更新。

## ZIPの中身

- app.js
- pwa-install.js
- manifest.json
- sw.js
- reset-cache.html
- assets/menu-bg-bakucho-twin-nyanko-v156.jpg
- INDEX_HTML_FIX.md
- UPLOAD_STEPS.md

## 重要

このZIPだけをアップロードしても、index.html の中に古い `v131` が残る場合があります。
必ず `INDEX_HTML_FIX.md` の置換も行ってください。

## 確認URL

先にキャッシュ削除：

```text
https://cichlid528.github.io/mie-fishing-map/reset-cache.html?auto=1
```

そのあと確認：

```text
https://cichlid528.github.io/mie-fishing-map/?v=v156-menu-bg-map-fix
```

## コミット名

```text
メニュー背景と地図反映不具合を修正
```
