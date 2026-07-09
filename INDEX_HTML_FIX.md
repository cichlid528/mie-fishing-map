# index.html 修正内容

`index.html` 内の古い `v156-menu-bg-map-fix` や `app-v156-loader-fixed.js` を残さないでください。

以下のように変更してください。

```html
<link rel="manifest" href="manifest.json?v=v173-motion-nyan-sensei">
<link rel="stylesheet" href="style.css?v=v173-motion-nyan-sensei">
<script src="pwa-install.js?v=v173-motion-nyan-sensei"></script>
<script src="app.js?v=v173-motion-nyan-sensei"></script>
```

特に重要：

```html
<script src="app.js?v=v173-motion-nyan-sensei"></script>
```

古いローダーではなく `app.js` を直接読み込んでください。
