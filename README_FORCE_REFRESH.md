# v47 強制更新版

このZIPは、v46がGitHub上には反映されているのにスマホ側で古い地図が残る場合の強制更新版です。

## 反映内容

- `pwa-install.js` を追加
- 古い `bass-spot-log-*` キャッシュを削除
- `sw.js` を `v47-refresh` に更新
- `index.html` から `pwa-install.js?v=47-refresh` を読み込み
- `style.css` / `app.js` の読み込みクエリを `v47-refresh` に変更

## アップロード方法

ZIPを解凍して、中身をGitHubリポジトリ直下へ上書きしてください。
フォルダごとアップロードしないでください。

## 確認URL

https://cichlid528.github.io/mie-fishing-map/?v=47-refresh

## コミットメッセージ

fix: 古いキャッシュを削除して地図更新を強制
