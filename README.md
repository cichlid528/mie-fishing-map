# 三重県釣りマップ v47 強制更新版

三重県の釣り場・現地メモ・釣果を記録できる、GitHub Pages向けの静的Webアプリです。

この版は、スマホで古い地図や古いService Workerキャッシュが残ってしまう問題を直すための **v47 強制更新版** です。

## 公開URL

```text
https://cichlid528.github.io/mie-fishing-map/?v=47-refresh
```

## 主な修正内容

- `pwa-install.js` を追加
- 古い `bass-spot-log-*` キャッシュを削除
- `sw.js` を `bass-spot-log-v47-refresh` に更新
- `index.html` から `pwa-install.js?v=47-refresh` を読み込み
- `style.css` / `app.js` の読み込みクエリを `v47-refresh` に変更
- スマホでv46が反映されない場合の強制更新に対応

## アプリとして使う方法

### Android / Chrome

1. Chromeで公開URLを開く
2. 画面内の「アプリをダウンロード」を押す
3. インストール画面が出たら、そのまま進める
4. 出ない場合は、Chrome右上の「︙」から「アプリをインストール」または「ホーム画面に追加」を選ぶ

### iPhone / Safari

1. Safariで公開URLを開く
2. 共有ボタンを押す
3. 「ホーム画面に追加」を選ぶ
4. ホーム画面のアイコンから起動する

## GitHubへのアップロード方法

ZIPを解凍して、中身をGitHubリポジトリ直下へ上書きしてください。
**フォルダごとアップロードしないでください。**

アップロード対象の例:

```text
index.html
style.css
app.js
manifest.json
sw.js
pwa-install.js
icons/
README.md
README_FORCE_REFRESH.md
README_MAP_FIX.md
CHANGELOG.md
COMMIT_PLAN.md
.gitignore
```

## 反映されないときの確認

次のURLで開いてください。

```text
https://cichlid528.github.io/mie-fishing-map/?v=47-refresh
```

それでも古い画面や崩れたマップが出る場合は、端末内に古いサイトデータが残っています。

### Android / Chrome

Chromeの設定から、該当サイトのキャッシュ・サイトデータを削除してから開き直してください。

### iPhone / Safari

設定アプリ → Safari → 履歴とWebサイトデータを消去、を実行してからSafariで開き直してください。

## 注意

掲載情報は釣りの許可を意味しません。釣行前に、現地看板・管理者・自治体・漁協などの最新情報を必ず確認してください。

釣果、写真、追加した釣り場、背景画像は基本的に端末内に保存されます。端末変更やブラウザのデータ削除に備えて、アプリ内の「バックアップ保存」でJSONファイルを保管してください。

## おすすめコミット

```text
fix: 古いキャッシュを削除して地図更新を強制
```

分ける場合:

```text
fix: Service Workerキャッシュをv47に更新
feat: PWAインストール処理を追加
docs: 強制更新手順を追記
```
