# index.html の修正

`index.html` に残っている古いバージョン指定を、すべて次に置換してください。

```text
v158-bubble-size-menu-bg-fix
```

## 置換対象

```text
v131-remove-chusei-green-park
v155-default-background-force
v156-menu-bg-map-fix
v157-comic-bubble-menu-bg
```

上記をすべて次へ置換します。

```text
v158-bubble-size-menu-bg-fix
```

## 表示ラベル

以下のような古い表示ラベルが残っていたら、

```text
v131・中勢グリーンパーク削除版
v155・釣りニャン初期背景強制反映版
v156・メニュー背景と地図反映修正版
v157・漫画風吹き出しとメニュー背景修正版
```

すべて次へ置換してください。

```text
v158・吹き出しサイズとメニュー背景修正版
```

## 注意

背景画像を設定するのは `.sidebar` と `#mobileMenu.sidebar` だけです。
`body`、`.map-pane`、`#map`、`.leaflet-container` には背景画像を入れないでください。
