# v110 アップロード手順

1. ZIPを解凍します。
2. 中身をGitHubリポジトリ `mie-fishing-map` の直下へ上書きアップロードします。
3. GitHub Pagesの反映を待ちます。
4. 先にキャッシュ削除ページを開きます。

https://cichlid528.github.io/mie-fishing-map/reset-cache.html?auto=1

5. その後、下のURLで確認します。

https://cichlid528.github.io/mie-fishing-map/?v=v110-now-loading

## 今回の変更

- 起動画面を自動で閉じず、「地図を開く」ボタンを押してから地図へ進むように変更
- タイトル画像の実サイズ比率に合わせて、画像内の「地図を開く」ボタン位置にタップ範囲を固定
- ボタン押下後に「Now Loading...」を出してからマップへ切り替える起動シークエンスを追加
- マップ表示後に地図サイズを再計算して、iPhoneでも真っ白・ずれ表示になりにくく調整
- バージョン表示を `v110・Now Loading表示版` に更新

- 地図を開くボタン押下後の表示を `Now Loading...` に変更
