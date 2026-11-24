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

### 3. Supabase（データベース）に接続する（最初の 1 回だけ）

ユーザーやクエストの進み具合は Supabase に保存している。接続するためのキーを、自分の PC に設定する。

1. Supabase のプロジェクトに招待してもらう（Discord でバックエンド担当に頼む）
2. `.env.example` をコピーして、同じ場所（リポジトリの一番上のフォルダ）に `.env.local` という名前で保存する
   ```
   cp .env.example .env.local
   ```
3. Supabase の管理画面の Project Settings を開き、`.env.local` の `=` の右側に値を貼り付ける

   | 名前                  | 管理画面での場所                                                                            |
   | --------------------- | ------------------------------------------------------------------------------------------- |
   | `SUPABASE_URL`        | Data API の「API URL」。**末尾の `/rest/v1` は削り**、`https://xxxx.supabase.co` の形にする |
   | `SUPABASE_SECRET_KEY` | API Keys の「Secret keys」。`sb_secret_` で始まるもの                                       |

4. 接続できているか確かめる
   ```
   npm run db:check
   ```
   `すべて OK` と表示されれば完了

- `SUPABASE_SECRET_KEY` は DB を制限なしで読み書きできる強い鍵。Discord や Issue に貼らない（キーを渡すのではなく、プロジェクトに招待して各自で確認してもらう）
- `.env.local` は `.gitignore` で除外されているので、コミットされない

#### テーブルを追加・変更するとき

テーブルの定義は [`supabase/migrations/`](supabase/migrations/) に SQL ファイルとして置いている。

1. `0002_add_xxx.sql` のように、次の番号を付けた SQL ファイルを追加する（すでにあるファイルは書き換えない。書き換えると、ファイルの内容と実際の DB の状態が食い違うため）
2. Supabase の管理画面の SQL Editor に貼り付けて実行する
3. SQL ファイルを PR に含める

### 4. 開発サーバーを起動する

```
npm run dev
```

ブラウザで http://localhost:3000 を開くと画面が表示される。止めるときはターミナルで `Ctrl + C` を押す。

### よく使うコマンド

| コマンド | やること |
|---|---|
| `npm run dev` | 開発サーバーを起動する（保存すると画面が自動で更新される） |
| `npm run lint` | コードの書き方をチェックする（PR を出す前に実行する） |
| `npm run format` | コードの書式を Prettier でそろえる（VS Code では保存時に自動で実行される） |
| `npm run build` | 本番用にビルドする（ビルドが通るかの確認に使う） |
| `npm run db:check` | Supabase に接続できているか確かめる |
