# v117 アップロード手順

1. ZIPを解凍します。
2. 中身をGitHubリポジトリ `mie-fishing-map` の直下へ上書きアップロードします。
3. GitHub Pagesの反映を待ちます。
4. 先にキャッシュ削除ページを開きます。

https://cichlid528.github.io/mie-fishing-map/reset-cache.html?auto=1

5. その後、下のURLで確認します。

https://cichlid528.github.io/mie-fishing-map/?v=v117-gsi-pond-button-fix

## 内容

- 「地理院池候補取得」ボタンをアプリ本体側に組み込み、押したあとに即時で池候補一覧へ反映するよう修正。
- 国土地理院ベクトルタイルの探索対象を広げ、labelレイヤー限定・分類番号限定で見つからない問題を避けるよう改善。
- 取得中の進捗と結果メッセージを表示。
