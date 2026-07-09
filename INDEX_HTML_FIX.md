# index.html の置換

`index.html` に残っている古いバージョン指定を、すべて `v163-menu-points-fix` に置換してください。

特にここが重要です。

```html
<link rel="manifest" href="manifest.json?v=v163-menu-points-fix">
<link rel="stylesheet" href="style.css?v=v163-menu-points-fix">
<script src="pwa-install.js?v=v163-menu-points-fix"></script>
<script src="app-v156-loader-fixed.js?v=v163-menu-points-fix"></script>
```

古い `v156-menu-bg-map-fix`、`v161-menu-bg-reapply`、`v162-start-screen-map-fix` が残ると、スマホ側で古いJS/CSSが読まれて、メニューが開かない・表示が戻る原因になります。
