# 三重県釣りマップ v157 修正ZIP

修正名：v157・漫画風吹き出しとメニュー背景修正版

## 修正内容

- メニュー画面だけを今回指定された背景画像に変更。
- 地図本体には背景画像を当てないように修正。
- スマホで釣りニャンが大きすぎて邪魔になる問題を軽減。
- 地図表示が反映されにくい時のため、リサイズ再計算を追加。
- reset-cache.html / manifest.json / sw.js を v157 に更新。

## ZIPの中身

- app.js
- pwa-install.js
- manifest.json
- sw.js
- reset-cache.html
- assets/menu-bg-bakucho-nyanko-sensei-v157.png
assets/turi-nyan-speech-bubble-comic-v157.png
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
https://cichlid528.github.io/mie-fishing-map/?v=v157-comic-bubble-menu-bg
```

## コミット名

```text
漫画風吹き出しとメニュー背景を修正
```
