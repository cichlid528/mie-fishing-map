# v133 宮川ダム・七色ダム・池原ダム追加 修正手順

## 変更内容

- `app.js` の `大杉湖` を `宮川ダム` に変更
- `app.js` の `七色貯水池` を `七色ダム` に変更
- 奈良県吉野郡下北山村の `池原ダム` を初期ポイントに追加
- バージョンを `v133-miyagawa-nanairo-ikehara` に更新
- 表示ラベルを `v133・宮川ダム・七色ダム・池原ダム追加版` に更新
- キャッシュ対策として `index.html`、`manifest.json`、`pwa-install.js`、`reset-cache.html`、`sw.js` のバージョン参照も更新

## GitHubで手作業する場合の最重要変更

`app.js` の `seedSpots` にあるこの2行を変更します。

```js
{ id: "lake-osugi", name: "大杉湖", type: "ダム", area: "多気郡大台町", lat: 34.286385, lng: 136.19336, zoom: 14, source: "指定リスト", subtype: "レイク・ダム湖" },
{ id: "reservoir-nanairo", name: "七色貯水池", type: "ダム", area: "熊野市・紀和町周辺", lat: 33.991304, lng: 136.004799, zoom: 14, source: "指定リスト", subtype: "レイク・ダム湖" },
```

これに変更します。

```js
{ id: "lake-osugi", name: "宮川ダム", type: "ダム", area: "多気郡大台町", lat: 34.286385, lng: 136.19336, zoom: 14, source: "指定リスト", subtype: "レイク・ダム湖" },
{ id: "reservoir-nanairo", name: "七色ダム", type: "ダム", area: "熊野市・紀和町周辺", lat: 33.991304, lng: 136.004799, zoom: 14, source: "指定リスト", subtype: "レイク・ダム湖" },
{ id: "dam-ikehara", name: "池原ダム", type: "ダム", area: "奈良県吉野郡下北山村", lat: 34.04694, lng: 135.97111, zoom: 14, source: "指定リスト", subtype: "レイク・ダム湖" },
```

## バージョン置換

全ファイルで以下を置換します。

```text
v131-remove-chusei-green-park
```

を

```text
v133-miyagawa-nanairo-ikehara
```

に変更します。

表示ラベルは以下に変更します。

```text
v133・宮川ダム・七色ダム・池原ダム追加版
```

## コミット名

```text
宮川ダム・七色ダムへ名称変更し池原ダムを追加
```

## アップロード後の確認

先にキャッシュ削除ページを開きます。

```text
https://cichlid528.github.io/mie-fishing-map/reset-cache.html?auto=1
```

その後、確認URLを開きます。

```text
https://cichlid528.github.io/mie-fishing-map/?v=v133-miyagawa-nanairo-ikehara
```
