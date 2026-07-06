# v78 アップロード手順（READMEなし）

このZIPは、READMEを上書きしないために README.md を入れていません。
中身を GitHub リポジトリ `cichlid528/mie-fishing-map` の直下へまとめて上書きしてください。

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

## v78の変更点

- 釣り場一覧の「釣れた」「魚種」「禁止」「駐車」を直接クリック/タップできるチェック項目に変更
- 「魚種」は押した時に魚種名を入力できるように修正
- チェック変更後、端末内保存へ即反映
- 釣り場詳細カード側のチェック状態も同期
- v77の写真付き記録、ポップアウト表示、背景写真調整、標準地図/航空写真のみの設定は維持

## アップロード後の確認

最初にキャッシュ削除ページを開いてください。

https://cichlid528.github.io/mie-fishing-map/reset-cache.html?auto=1

その後、通常ページを確認してください。

https://cichlid528.github.io/mie-fishing-map/?v=v78-spot-checks-fixed

## コミット案

fix: 釣り場一覧のチェック項目を操作可能に修正
