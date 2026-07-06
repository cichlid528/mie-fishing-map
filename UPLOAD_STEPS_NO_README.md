# v79 アップロード手順（READMEなし）

READMEは入れていません。既存のREADMEは上書きしないでください。

## 必ず上書きするファイル

- index.html
- app.js
- style.css
- manifest.json
- sw.js
- pwa-install.js
- reset-cache.html
- icons フォルダ
- .nojekyll
- UPLOAD_STEPS_NO_README.md

## v79の変更点

- スマホで釣り場詳細カードが左下の操作ボタンに被らないように修正
- 詳細カードを「現在地メモ登録 / 釣り場追加 / 記録ピン追加」ボタンより上に表示
- 詳細カードが長い場合はカード内をスクロール
- メニュー表示中やポップアウト表示中は詳細カードを隠して重なりを防止
- v78の釣り場チェック項目修正、v77の写真付き記録、標準地図/航空写真のみの設定は維持

## アップロード後に開くURL

キャッシュ削除:
https://cichlid528.github.io/mie-fishing-map/reset-cache.html?auto=1

確認:
https://cichlid528.github.io/mie-fishing-map/?v=v79-mobile-spot-card-safe

## コミット案

fix: スマホの釣り場詳細カード位置を修正
