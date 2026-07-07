# v134 反映されない問題の修正版アップロード手順

## 反映されなかった理由

前回のZIPは、実際のアプリファイルではなく `.patch` と説明書だけでした。
GitHub Pages は `.patch` ファイルを自動では読み込みません。
そのため、リポジトリ上の `app.js` は `v131-remove-chusei-green-park` のままで、`大杉湖` と `七色貯水池` も残ったままでした。

## 今回のZIPの中身

今回は、GitHubのリポジトリ直下へ上書きする実ファイルを入れています。

- `app.js`
- `pwa-install.js`
- `manifest.json`
- `reset-cache.html`
- `sw.js`
- `v134-source-change.patch`
- `V134_UPLOAD_STEPS.md`

## 変更内容

- `大杉湖` を `宮川ダム` に変更
- `七色貯水池` を `七色ダム` に変更
- `池原ダム` を追加
- 表示バージョンを `v134・宮川ダム・七色ダム・池原ダム反映版` に更新

## アップロード方法

1. ZIPを解凍します。
2. 中にあるファイルを GitHub の `mie-fishing-map` リポジトリ直下へアップロードします。
3. ZIPファイルそのものではなく、中のファイルをアップロードしてください。
4. 同じ名前のファイルがある場合は上書きします。
5. コミットします。

## コミット名

```text
七色ダムへの名称変更を反映し池原ダムを追加
```

## アップロード後の確認

先にキャッシュ削除ページを開きます。

```text
https://cichlid528.github.io/mie-fishing-map/reset-cache.html?auto=1
```

その後、確認URLを開きます。

```text
https://cichlid528.github.io/mie-fishing-map/?v=v134-nanairo-dam-fix
```

## 注意

このZIPの `app.js` は、現在公開中の v131 のアプリ本体を読み込み、起動前に名称変更と池原ダム追加を反映する橋渡し版です。
恒久的にきれいに直す場合は、同梱の `v134-source-change.patch` の内容を本体 `app.js` に直接反映してください。
