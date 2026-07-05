# v45 Android / iPhone ダウンロード対応

このZIPは、現在の v44 野池バス分析版をベースに、Android と iPhone でホーム画面へ追加しやすくするための差し替えファイルです。

## GitHubへアップロードするファイル

- `index.html`
- `manifest.json`
- `sw.js`
- `pwa-install.js`（新規追加）

既存の `app.js` と `style.css` はそのままで大丈夫です。

## 変更内容

- Service Worker登録処理を追加
- Android / Chrome のインストール確認画面に対応
- iPhone / Safari の「ホーム画面に追加」案内を強化
- PWAキャッシュを `v45` に更新
- `manifest.json` に `id` / `display_override` / `categories` を追加

## おすすめコミット

```text
feat: AndroidとiPhone向けのPWAインストール処理を追加
```

## 使い方

GitHubで上記4ファイルをアップロードまたは上書きしてください。
反映後、AndroidはChromeで「アプリをダウンロード」を押すか、Chrome右上メニューからインストールできます。
iPhoneはSafariで開き、共有ボタンから「ホーム画面に追加」を選んでください。
