# index.html 修正

`index.html` に古い v156 が残っていると、また古いファイルを読みます。
以下を必ず置換してください。

## 置換前

```html
<link rel="manifest" href="manifest.json?v=v156-menu-bg-map-fix">
<link rel="stylesheet" href="style.css?v=v156-menu-bg-map-fix">
<script src="pwa-install.js?v=v156-menu-bg-map-fix"></script>
<script src="app-v156-loader-fixed.js?v=v156-menu-bg-map-fix"></script>
```

## 置換後

```html
<link rel="manifest" href="manifest.json?v=v162-start-screen-map-fix">
<link rel="stylesheet" href="style.css?v=v162-start-screen-map-fix">
<script src="pwa-install.js?v=v162-start-screen-map-fix"></script>
<script src="app-v156-loader-fixed.js?v=v162-start-screen-map-fix"></script>
```

画面内のバージョン表記も `v162・起動画面と地図表示修正版` に変えてください。
