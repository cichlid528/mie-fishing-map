# v127 全ポイント削除版 導入手順

今回の目的:
- アプリ上の固定ポイントをすべて削除
- 端末に残った追加ポイント・記録ピン・位置調整データを一度だけ削除
- 「地図ラベル名で池候補追加」ボタンを廃止
- 国土地理院の池候補追加機能を無効化

## 手順

1. このZIPを展開します。
2. `apply_patch.py` を `mie-fishing-map` のルートに置きます。
   - `app.js`
   - `index.html`
   - `pwa-install.js`
   がある場所です。
3. ターミナルで以下を実行します。

```bash
python apply_patch.py
```

4. GitHubへ反映します。

```bash
git add app.js index.html pwa-install.js clear-all-points.html
git commit -m "v127: 全ポイントを削除して池候補追加機能を廃止"
git push
```

5. 公開ページを開き直します。

```text
https://cichlid528.github.io/mie-fishing-map/?v=v127-clear-all-points-strict
```

6. まだ古いポイントが残る場合は、以下を開いてください。

```text
https://cichlid528.github.io/mie-fishing-map/clear-all-points.html?auto=1
```

## 注意

このパッチはかなり強めです。
釣り場ポイント、池候補、記録ピン、位置補正データを削除します。
背景画像とバックアップ履歴メモは残す設計です。
