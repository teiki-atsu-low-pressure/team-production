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
| `npm run typecheck` | TypeScript の型のまちがいをチェックする |
| `npm run format` | コードの書式を Prettier でそろえる（VS Code では保存時に自動で実行される） |
| `npm run format:check` | 書式がそろっているかだけを確かめる（ファイルは書き換えない） |
| `npm run build` | 本番用にビルドする（ビルドが通るかの確認に使う） |
| `npm run db:check` | Supabase に接続できているか確かめる |
| `npm run quest:check -- <owner>/<repo> <クエストID>` | リポジトリがクエストを達成しているかを判定する（下を参照） |

### CI（自動チェック）

PR を出すと、GitHub Actions が `lint`・`typecheck`・`format:check` を自動で実行する（設定は [`.github/workflows/ci.yml`](.github/workflows/ci.yml)）。

- 結果は PR 画面の下のほうに表示される。✕ が付いたら「Details」から、どのチェックで失敗したかを確かめる
- 書式チェックで失敗したら、`npm run format` を実行してコミットし直す
- PR を出す前に、手元で同じ 3 つを実行しておくと安心

### クエストの達成判定を手元で試す

クエストの達成条件は [`lib/quests/`](lib/quests/) に、判定の処理は [`lib/quest-check/`](lib/quest-check/) にある。GitHub App がなくても、自分のトークンで試せる。

1. GitHub の Settings → Developer settings → Fine-grained tokens で、トークンを作る
   - Repository access: 試すリポジトリだけを選ぶ
   - Permissions: Contents、Pull requests、Metadata を Read-only にする
2. `.env.local` の `GITHUB_TOKEN=` の右側に貼り付ける
3. 判定する
   ```
   npm run quest:check -- your-name/practice-repo chapter1-first-push
   ```
   条件ごとに `OK` / `NG` が表示される

- commit と push はまとめて判定する（GitHub から見えるのは push されたコミットだけのため）
- テンプレートから作ったときの最初のコミットは数えない

## デプロイ先

アプリは Vercel にデプロイしている（仮のデプロイ先。あとで変える可能性がある）。

- URL: https://gitbuddy-six.vercel.app
- `develop` に PR がマージされると、自動でデプロイされて上の URL が最新になる
- PR を出すと、Vercel のボットがその PR のプレビュー URL をコメントする。ただし、プレビューを開けるのは Vercel プロジェクトのオーナーだけ（他の人は、マージ後に上の URL で確かめる）
- 環境変数（Supabase などのキー）は Vercel の管理画面に登録している。追加・変更が必要なときは Discord でバックエンド担当に頼む（キーをリポジトリにコミットしない）
