# index.html の修正

`index.html` 内に残っている古いバージョン文字列をすべて置換してください。

## 置換前

```text
v131-remove-chusei-green-park
v155-default-background-force
v156-menu-bg-map-fix
v157-comic-bubble-menu-bg
v158-bubble-size-menu-bg-fix
```

## 置換後

```text
v159-menu-bg-transparent-bubble
```

## 表示ラベルの置換

古い表示ラベルをすべて次に置換してください。

```text
v159・メニュー背景と透明吹き出し修正版
```

## 追加するCSS変数

`<style>` 内、または既存の `:root` に次を追加してください。

```css
:root {
  --menu-bg-image: url("assets/menu-bg-bakucho-nyanko-sensei-v159.png?v=v159-menu-bg-transparent-bubble");
}
```

## 注意

背景画像を当てるのはメニューだけです。

```css
.sidebar,
#mobileMenu.sidebar
```

以下には背景画像を当てないでください。

```css
body
.app-shell
.map-pane
#map
.leaflet-container
.leaflet-tile-pane
.leaflet-layer
```
