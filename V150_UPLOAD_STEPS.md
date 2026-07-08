# v150・釣りニャン軽量ふわふわ復活版 アップロード手順

1. このZIPを解凍します。
2. 中身をGitHubリポジトリ `mie-fishing-map` の直下へ上書きアップロードします。
   - `app.js`
   - `pwa-install.js`
   - `manifest.json`
   - `reset-cache.html`
   - `sw.js`
   - `assets` フォルダ

3. コミット名は以下がおすすめです。

```text
釣りニャンの軽量ふわふわ縦揺れを復活
```

4. アップロード後、まずキャッシュ削除ページを開きます。

```text
https://cichlid528.github.io/mie-fishing-map/reset-cache.html?auto=1
```

5. その後、確認URLを開きます。

```text
https://cichlid528.github.io/mie-fishing-map/?v=v150-pet-light-float
```

## 今回の変更

- v149の軽量化は維持
- スマホでも爆釣にゃん師匠のふわふわ縦揺れを復活
- 自動見回りモーションはスマホでは停止したまま
- `prefers-reduced-motion` の端末設定ではアニメーション停止
