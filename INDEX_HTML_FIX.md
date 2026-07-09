# index.html の修正

古い `v156-menu-bg-map-fix` や `v167-catch-records-restore` を、すべて次に置換してください。

```text
v168-record-button-fix
```

特に下記を確認してください。

```html
<link rel="manifest" href="manifest.json?v=v168-record-button-fix">
<link rel="stylesheet" href="style.css?v=v168-record-button-fix">
<script src="pwa-install.js?v=v168-record-button-fix"></script>
<script src="app.js?v=v168-record-button-fix"></script>
```

`app-v156-loader-fixed.js` ではなく、できれば `app.js` を直接読み込んでください。
