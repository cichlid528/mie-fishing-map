# index.html 修正

`index.html` の読み込みクエリをすべて `v167-catch-records-restore` に変更してください。

```html
<link rel="manifest" href="manifest.json?v=v167-catch-records-restore">
<link rel="stylesheet" href="style.css?v=v167-catch-records-restore">
<script src="pwa-install.js?v=v167-catch-records-restore"></script>
<script src="app.js?v=v167-catch-records-restore"></script>
```

古い `app-v156-loader-fixed.js` を読む指定が残る場合でも、今回のZIPでは同ファイルにも同じ復旧コードを入れています。
ただし推奨は `app.js` を直接読み込む形です。
