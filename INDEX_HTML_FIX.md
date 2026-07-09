# index.html 修正

`index.html` の読み込みクエリを `v169-photo-camera-fix` に変更してください。

特に下の2行を必ず変更してください。

```html
<script src="pwa-install.js?v=v169-photo-camera-fix"></script>
<script src="app.js?v=v169-photo-camera-fix"></script>
```

古い `app-v156-loader-fixed.js` を読み続ける場合でも、同梱の `app-v156-loader-fixed.js` は v169 内容に差し替えています。
ただし、できれば `app.js` を直接読み込む形にしてください。

manifest とCSSも可能なら変更してください。

```html
<link rel="manifest" href="manifest.json?v=v169-photo-camera-fix">
<link rel="stylesheet" href="style.css?v=v169-photo-camera-fix">
```
