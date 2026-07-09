# index.html 修正箇所

`index.html` の末尾を以下にしてください。

```html
<script src="pwa-install.js?v=v176-spot-species-picker-fix"></script>
<script src="app.js?v=v176-spot-species-picker-fix"></script>
```

head内も可能なら以下にしてください。

```html
<link rel="manifest" href="manifest.json?v=v176-spot-species-picker-fix">
<link rel="stylesheet" href="style.css?v=v176-spot-species-picker-fix">
```

古い `v156-menu-bg-map-fix` が残っていると、新しいJSが読み込まれません。
