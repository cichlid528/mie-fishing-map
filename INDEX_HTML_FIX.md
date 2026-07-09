# index.html 修正指示

現在の `index.html` はまだ `v156-menu-bg-map-fix` を読み込んでいます。
背景が変わらない原因になります。

以下を置換してください。

## 1. バージョン文字列の置換
`v156-menu-bg-map-fix`
をすべて
`v160-menu-bg-force`
に置換してください。

## 2. app読み込みの修正
現在：
```html
<script src="app-v156-loader-fixed.js?v=v156-menu-bg-map-fix"></script>
```

推奨：
```html
<script src="app-v156-loader-fixed.js?v=v160-menu-bg-force"></script>
```

または：
```html
<script src="app.js?v=v160-menu-bg-force"></script>
```

## 3. CSSにメニュー背景変数を追加
`<style>` 内の先頭付近に以下を追加してください。

```css
:root {
  --menu-bg-image: url("assets/menu-bg-bakucho-nyanko-sensei-v160.png?v=v160-menu-bg-force");
  --sidebar-bg-image: url("assets/menu-bg-bakucho-nyanko-sensei-v160.png?v=v160-menu-bg-force");
}
.sidebar, #mobileMenu.sidebar {
  background: linear-gradient(180deg, rgba(5,30,25,.08), rgba(5,44,36,.02)), var(--menu-bg-image) !important;
  background-size: cover !important;
  background-position: center center !important;
  background-repeat: no-repeat !important;
}
.sidebar::before, #mobileMenu.sidebar::before {
  background: transparent !important;
  opacity: 0 !important;
}
```
