# v155 アップロード手順

## 変更内容
- 送ってもらった爆釣にゃん師匠画像を、既存端末にも反映される初期背景として設定
- 以前の背景画像が localStorage に残っていても、v155 初回起動時に一度だけ解除
- 背景リセット時も指定画像へ戻るように修正
- v153 の大きめ釣りニャン、ふわふわ縦揺れ、軽量化は継続

## 追加・更新ファイル
- app.js
- pwa-install.js
- manifest.json
- reset-cache.html
- sw.js
- assets/default-app-background-turi-nyan-v155.jpg

## 確認URL
https://cichlid528.github.io/mie-fishing-map/?v=v155-default-background-force
