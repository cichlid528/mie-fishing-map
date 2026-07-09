# アップロード手順

1. このZIPを解凍します。
2. GitHub の `mie-fishing-map` リポジトリを開きます。
3. 中のファイルを同じ場所へアップロードして上書きします。
4. `assets/menu-bg-bakucho-nyanko-sensei-v161.png` が 0 bytes ではなく、約4MBで入っていることを確認します。
5. `INDEX_HTML_FIX.md` の通り、index.html の読み込みクエリを v161 に変更します。
6. コミットします。

コミット名：

```text
指定メニュー背景を再反映
```

確認URL：

```text
https://cichlid528.github.io/mie-fishing-map/reset-cache.html?auto=1
```

その後：

```text
https://cichlid528.github.io/mie-fishing-map/?v=v161-menu-bg-reapply
```
