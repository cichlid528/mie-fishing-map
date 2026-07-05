# v68 アップロード手順（READMEなし）

このZIPは、国土地理院タイルを直接使うフリーマップ版です。
三重県固定・移動制限・ズーム固定・県境枠線は入れていません。

## 手順

1. ZIPを展開します。
2. 中身を GitHub リポジトリ `cichlid528/mie-fishing-map` のルートへ上書きアップロードします。
3. 画像ファイルの追加は不要です。
4. アップロード後、まず下記を開いて古いキャッシュを消します。

```text
https://cichlid528.github.io/mie-fishing-map/reset-cache.html?auto=1
```

5. 通常確認URLです。

```text
https://cichlid528.github.io/mie-fishing-map/?v=v68-gsi-free-map
```

## コミット案

```text
fix: 国土地理院の自由操作マップに戻す
```
