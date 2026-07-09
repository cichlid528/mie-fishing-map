# index.html の修正

必ず下のように変更してください。古い `v156` や `app-v156-loader-fixed.js` を読み続けると、釣り場追加ボタンの修正が反映されません。

```html
<link rel="manifest" href="manifest.json?v=v171-add-spot-button-fix">
<link rel="stylesheet" href="style.css?v=v171-add-spot-button-fix">
<script src="pwa-install.js?v=v171-add-spot-button-fix"></script>
<script src="app.js?v=v171-add-spot-button-fix"></script>
```

古い指定例：

```html
<script src="app-v156-loader-fixed.js?v=v156-menu-bg-map-fix"></script>
```

これは使わず、`app.js` を直接読み込んでください。
