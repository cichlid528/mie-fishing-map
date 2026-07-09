# GitHubアップロード手順

1. ZIPを解凍します。
2. GitHubの `cichlid528/mie-fishing-map` を開きます。
3. 下記ファイルを同じ場所に上書きアップロードします。

```text
app.js
pwa-install.js
manifest.json
sw.js
reset-cache.html
```

4. `assets` フォルダに下記画像を追加します。

```text
assets/menu-bg-bakucho-twin-nyanko-v156.jpg
```

5. `index.html` を開いて、`INDEX_HTML_FIX.md` の通りに置換します。

6. コミット名はこれでOKです。

```text
メニュー背景と地図反映不具合を修正
```

7. 反映後、まず下記を開きます。

```text
https://cichlid528.github.io/mie-fishing-map/reset-cache.html?auto=1
```

8. そのあと下記で確認します。

```text
https://cichlid528.github.io/mie-fishing-map/?v=v156-menu-bg-map-fix
```
