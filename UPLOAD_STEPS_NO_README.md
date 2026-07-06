# v118 アップロード手順

1. ZIPを解凍します。
2. 中身をGitHubリポジトリ `mie-fishing-map` の直下へ上書きアップロードします。
3. GitHub Pagesの反映を待ちます。
4. 先にキャッシュ削除ページを開きます。

https://cichlid528.github.io/mie-fishing-map/reset-cache.html?auto=1

5. その後、下のURLで確認します。

https://cichlid528.github.io/mie-fishing-map/?v=v118-gsi-pond-scan-hard-fix

## 修正内容

- 「地理院池候補取得」ボタンの取得処理を強化しました。
- 国土地理院ベクトルタイルの `vt_text` など、実際の注記名プロパティを拾えるようにしました。
- pbf / geojson、旧URL / v1 URLを順番に試します。
- 通信や端末側の外部ライブラリ読み込みが失敗しても、補助候補を追加して池候補リストに反映します。
- 追加後は自動で「池候補」表示に切り替わります。
