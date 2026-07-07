# 大杉湖を宮川ダムに名称変更する修正

## 変更内容

- `app.js` の初期ポイント `lake-osugi` の表示名を `大杉湖` から `宮川ダム` に変更
- バージョンを `v132-rename-osugi-to-miyagawa-dam` に更新
- 表示ラベルを `v132・大杉湖を宮川ダムに名称変更版` に更新
- `manifest.json`、`pwa-install.js`、`reset-cache.html`、`sw.js` のバージョンも更新

## GitHubで手作業する場合の最重要変更

`app.js` の初期ポイントで、次の1行を変更します。

```js
{ id: "lake-osugi", name: "大杉湖", type: "ダム", area: "多気郡大台町", lat: 34.286385, lng: 136.19336, zoom: 14, source: "指定リスト", subtype: "レイク・ダム湖" },
```

これに変更します。

```js
{ id: "lake-osugi", name: "宮川ダム", type: "ダム", area: "多気郡大台町", lat: 34.286385, lng: 136.19336, zoom: 14, source: "指定リスト", subtype: "レイク・ダム湖" },
```

## コミット名

```text
大杉湖を宮川ダムに名称変更
```

## アップロード後の確認

先にキャッシュ削除ページを開きます。

```text
https://cichlid528.github.io/mie-fishing-map/reset-cache.html?auto=1
```

その後、確認URLを開きます。

```text
https://cichlid528.github.io/mie-fishing-map/?v=v132-rename-osugi-to-miyagawa-dam
```
