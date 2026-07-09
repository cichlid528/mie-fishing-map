# v156 アップロード手順

## 変更内容
- スマホで「地図を開く」を押しても地図に移動できない場合の緊急回避処理を追加
- 起動画面で釣りニャンが邪魔をしないよう非表示化
- 送ってもらった爆釣にゃん師匠画像を、起動画面とメニュー背景の両方に反映
- 既存端末に残った古い背景を、v156初回起動時に一度だけ解除
- アプリ本体ソースの読み込みは、オンライン取得失敗時に過去キャッシュへフォールバック

## 追加・更新ファイル
- app.js
- pwa-install.js
- manifest.json
- reset-cache.html
- sw.js
- assets/default-app-background-turi-nyan-v156.jpg

## 確認URL
https://cichlid528.github.io/mie-fishing-map/?v=v156-map-open-background-fix
