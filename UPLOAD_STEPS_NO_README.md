# v114 アップロード手順

1. ZIPを解凍します。
2. 中身をGitHubリポジトリ `mie-fishing-map` の直下へ上書きアップロードします。
3. GitHub Pagesの反映を待ちます。
4. 先にキャッシュ削除ページを開きます。

https://cichlid528.github.io/mie-fishing-map/reset-cache.html?auto=1

5. その後、下のURLで確認します。

https://cichlid528.github.io/mie-fishing-map/?v=v114-pond-filter-fix

## 変更内容

- スマホで地図上の釣り場ポイントを押した時も、詳細カードを確実に表示するよう修正
- Leafletの小さいポップアップを出さず、click / tap / touchend / pointerup を詳細カード表示に統一
- 既存マーカー再描画時にも、古いクリック処理が残らないように修正
- 詳細カードをスマホ画面の前面へ出すCSSを追加
- バージョン表示を `v114・池フィルター分離修正版` に更新
