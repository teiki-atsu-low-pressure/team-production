# team-production

チーム低気圧の制作物のリポジトリです。

## 開発に参加する前に

[開発ルール（docs/README.md）](docs/README.md) を必ず読むこと。
ドキュメントは `docs/` にまとめ、目次は [docs/README.md](docs/README.md) にある。

## 起動方法

### 1. Node.js を準備する（最初の 1 回だけ）

Node.js は **v26** を使う。

1. [nodejs.org](https://nodejs.org/) から **v26（LTS）** のインストーラーをダウンロードしてインストールする
2. ターミナルを開き直して、バージョンを確認する
   ```
   node -v
   ```
   `v26.x.x` と表示されれば OK

### 2. 依存パッケージをインストールする

リポジトリのフォルダで実行する。

```
npm install
```

- 最初の 1 回と、`git pull` で `package.json` が変わったときに実行する
- `EBADENGINE` という警告が出たら、Node.js のバージョンが v26 になっていない

### 3. 開発サーバーを起動する

```
npm run dev
```

ブラウザで http://localhost:3000 を開くと画面が表示される。止めるときはターミナルで `Ctrl + C` を押す。

### よく使うコマンド

| コマンド | やること |
|---|---|
| `npm run dev` | 開発サーバーを起動する（保存すると画面が自動で更新される） |
| `npm run lint` | コードの書き方をチェックする（PR を出す前に実行する） |
| `npm run build` | 本番用にビルドする（ビルドが通るかの確認に使う） |
