# v112 アップロード手順

1. ZIPを解凍します。
2. 中身をGitHubリポジトリ `mie-fishing-map` の直下へ上書きアップロードします。
3. GitHub Pagesの反映を待ちます。
4. 先にキャッシュ削除ページを開きます。

https://cichlid528.github.io/mie-fishing-map/reset-cache.html?auto=1

5. その後、下のURLで確認します。

https://cichlid528.github.io/mie-fishing-map/?v=v112-spot-card-on-point

## 変更内容

- 地図上の釣り場ポイントを押した時、小さなポップアップではなく詳細カードを表示
- 詳細カードが `map-popup-open` 状態で隠れないよう調整
- 一覧から釣り場を押した時も詳細カード表示を維持
- 魚種複数選択、Now Loading、起動画面、UIズーム固定など前回までの変更を維持
- バージョン表示を `v112・ポイント詳細カード版` に更新

## コミット案

地図ポイント押下時に詳細カードを表示
