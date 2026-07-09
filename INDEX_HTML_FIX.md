# index.html の修正

`index.html` に古い `v156` や `v171` が残っていると、新しい修正が読み込まれません。
以下のように変更してください。

```html
<link rel="manifest" href="manifest.json?v=v172-spot-checklist-restore">
<link rel="stylesheet" href="style.css?v=v172-spot-checklist-restore">
<script src="pwa-install.js?v=v172-spot-checklist-restore"></script>
<script src="app.js?v=v172-spot-checklist-restore"></script>
```

古い `app-v156-loader-fixed.js` の読み込みは使わず、`app.js` を直接読み込んでください。
