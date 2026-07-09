# v173・爆釣にゃん師匠モーション版

爆釣にゃん師匠のモーション表示を追加した修正版です。

## 修正内容

- 添付されたキャラクターシートから表情画像を切り出し
- 爆釣にゃん師匠が数秒ごとに表情を変えるように修正
- タップ時にも表情が変わるように修正
- 軽い上下アニメーションを追加
- 既存の釣り場ポイント、チェック欄、釣果記録、写真、追加ポイントは削除しません

## アップロードする主なファイル

- `app.js`
- `pwa-install.js`
- `manifest.json`
- `sw.js`
- `reset-cache.html`
- `assets/turi-nyan-motion-*-v173.png`
- `assets/turi-nyan-motion-sheet-v173.png`
- `assets/menu-bg-bakucho-nyanko-sensei-v173.png`
- `assets/turi-nyan-speech-bubble-comic-transparent-v173.png`

## index.html の重要修正

`index.html` の読み込みを必ず以下へ変更してください。

```html
<link rel="manifest" href="manifest.json?v=v173-motion-nyan-sensei">
<link rel="stylesheet" href="style.css?v=v173-motion-nyan-sensei">
<script src="pwa-install.js?v=v173-motion-nyan-sensei"></script>
<script src="app.js?v=v173-motion-nyan-sensei"></script>
```

古い `app-v156-loader-fixed.js` は読み込まないでください。
