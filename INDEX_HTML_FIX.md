# index.html の修正メモ

このZIPには、巨大な `index.html` の丸ごと差し替え版は入れていません。
その代わり、下の置換をGitHub上の `index.html` に行ってください。

## 1. バージョン文字列の置換

すべて検索して置換してください。

```text
v131-remove-chusei-green-park
```

を

```text
v156-menu-bg-map-fix
```

へ変更。

```text
v131・中勢グリーンパーク削除版
```

を

```text
v156・メニュー背景と地図反映修正版
```

へ変更。

もし下記が残っていたら、同じく置換してください。

```text
v155-default-background-force
```

を

```text
v156-menu-bg-map-fix
```

へ変更。

```text
v155・釣りニャン初期背景強制反映版
```

を

```text
v156・メニュー背景と地図反映修正版
```

へ変更。

## 2. head内にメニュー背景変数を追加

`<style` がある場合、先頭付近に以下を追加してください。

```css
:root {
  --menu-bg-image: url("assets/menu-bg-bakucho-twin-nyanko-v156.jpg?v=v156-menu-bg-map-fix");
}
```

## 3. 注意

背景画像を当てるのは、次の2つだけです。

```css
.sidebar
#mobileMenu.sidebar
```

`body`、`.map-pane`、`#map`、`.leaflet-container` には背景画像を当てないでください。
地図が壊れる原因になります。
