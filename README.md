# 三重県釣りマップ v160 指定メニュー背景強制反映版

このZIPは、ユーザー指定の猫画像をメニュー画面の初期背景に強制設定する修正版です。

## 重要
GitHub上で `assets/menu-bg-bakucho-nyanko-sensei-v159.png` が空ファイルになっている可能性が高いです。
そのため、今回は新しい画像名で `assets/menu-bg-bakucho-nyanko-sensei-v160.png` を入れ直しています。

## バージョン
`v160-menu-bg-force`

## 表示ラベル
`v160・指定メニュー背景強制反映版`

## 変更点
- メニュー画面背景を `assets/menu-bg-bakucho-nyanko-sensei-v160.png` に変更
- `.sidebar` と `#mobileMenu.sidebar` にだけ背景画像を適用
- 地図本体には背景画像を適用しない
- `index.html` が古い `app-v156-loader-fixed.js` を読んでいても効くように、同名ファイルも同梱
- 吹き出し外側は透明のまま維持

## 確認URL
`https://cichlid528.github.io/mie-fishing-map/reset-cache.html?auto=1`

その後：
`https://cichlid528.github.io/mie-fishing-map/?v=v160-menu-bg-force`
