# v115 アップロード手順

1. ZIPを解凍します。
2. 中身をGitHubリポジトリ `mie-fishing-map` の直下へ上書きアップロードします。
3. GitHub Pagesの反映を待ちます。
4. 先にキャッシュ削除ページを開きます。

https://cichlid528.github.io/mie-fishing-map/reset-cache.html?auto=1

5. その後、下のURLで確認します。

https://cichlid528.github.io/mie-fishing-map/?v=v115-pond-confirm-persist

## 変更内容

- 池候補を「確認済み」にした状態が、アプリ再起動後も池として残るように修正
- 保存データ正規化時に `pondVerified` を消さないように修正
- 「池」と「池候補」の絞り込み分離は維持
- バージョン表示を `v115・池確認保存修正版` に更新
