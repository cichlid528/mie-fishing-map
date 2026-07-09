# index.html 必須修正

今回の反映漏れの原因は、index.html がまだ古い v156 の読み込み指定を持っていることです。
GitHub の index.html を開いて、以下を必ず置換してください。

## 置換1
```html
<link rel="manifest" href="manifest.json?v=v156-menu-bg-map-fix">
```
を
```html
<link rel="manifest" href="manifest.json?v=v161-menu-bg-reapply">
```
へ。

## 置換2
```html
<link rel="stylesheet" href="style.css?v=v156-menu-bg-map-fix">
```
を
```html
<link rel="stylesheet" href="style.css?v=v161-menu-bg-reapply">
```
へ。

## 置換3
```html
<script src="pwa-install.js?v=v156-menu-bg-map-fix"></script>
<script src="app-v156-loader-fixed.js?v=v156-menu-bg-map-fix"></script>
```
を
```html
<script src="pwa-install.js?v=v161-menu-bg-reapply"></script>
<script src="app-v156-loader-fixed.js?v=v161-menu-bg-reapply"></script>
```
へ。

## 置換4
画面内に残る `v156・メニュー背景と地図反映修正版` などの古い表示を、
`v161・メニュー背景再反映版` に置換してください。
