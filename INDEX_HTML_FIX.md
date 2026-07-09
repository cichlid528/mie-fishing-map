# index.html の修正

`index.html` 内の古い `v156-menu-bg-map-fix`、`v163-menu-points-fix` などを、すべて以下に置換してください。

```text
v166-gsi-map-pins-fix
```

特にここを確認してください。

```html
<link rel="manifest" href="manifest.json?v=v166-gsi-map-pins-fix">
<link rel="stylesheet" href="style.css?v=v166-gsi-map-pins-fix">
<script src="pwa-install.js?v=v166-gsi-map-pins-fix"></script>
<script src="app.js?v=v166-gsi-map-pins-fix"></script>
```

もし今の `index.html` が `app-v156-loader-fixed.js` を読んでいる場合でも、このフォルダには同名ファイルを入れてあります。
ただし、できれば最終的には `app.js` を直接読む形にしてください。
