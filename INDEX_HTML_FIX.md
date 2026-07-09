# index.html の修正

GitHub上の `index.html` が古い `v156-menu-bg-map-fix` を読んでいると、v175の修正が反映されません。

下記に変更してください。

```html
<link rel="manifest" href="manifest.json?v=v175-species-condition-fix">
<link rel="stylesheet" href="style.css?v=v175-species-condition-fix">
<script src="pwa-install.js?v=v175-species-condition-fix"></script>
<script src="app.js?v=v175-species-condition-fix"></script>
```

特に下のJSは、古い `app-v156-loader-fixed.js` ではなく `app.js` を直接読み込ませてください。

```html
<script src="app.js?v=v175-species-condition-fix"></script>
```
