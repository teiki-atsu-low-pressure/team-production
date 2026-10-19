# ブランチ戦略

このドキュメントでは、ブランチの種類と命名、マージとリリースの方法を定義する。
全員が同じルールでブランチを扱い、安心して並行作業できるようにすることが目的。

## メインブランチ（`main`）

- 安定版。発表・デモで使える状態を常に保つ
- `develop` からのリリース PR でのみ更新する（[リリース](#リリースdevelop--main)を参照）

## 開発ブランチ（`develop`）

- 開発の統合先（デフォルトブランチ）
- 作業ブランチはここから切り、ここへ PR を出してマージする

## 作業ブランチ

### 命名規則

```
<type>/<スコープ>/<Issue番号>-<説明>
```

- `<スコープ>/` は、特定の領域だけを触る場合に付ける（全体に関わる場合・構成が決まっていない間は省略）
- `<Issue番号>-` は、Issue がある場合に付ける

| スコープ | Issue | 例 |
|---|---|---|
| あり | あり | `feat/frontend/12-login-form` |
| あり | なし | `refactor/frontend/split-header` |
| なし | あり | `chore/15-setup-eslint` |
| なし | なし | `docs/update-readme` |

- 英小文字・数字・ハイフンのみ使用する
- `<説明>` は **英語 2〜4 単語程度** で、何をするかを書く（例: `login-form`、`db-connection`）。ローマ字は使わない
- 作業の途中で種類が変わっても、ブランチ名は変えなくてよい（PR タイトルとコミットの type で正しく表す）

### 種類

`<type>` は[コミットの type](commit-strategy.md#type-一覧)と同じものを使い、**その PR の主な目的** で決める。
ブランチ内のコミットの type は一致しなくてよい（例: `feat/frontend/12-login-form` の中に `test:` のコミットがあってよい）。

| type | 目的 | 命名例 |
|---|---|---|
| `feat` | 新しい機能の追加 | `feat/frontend/12-login-form` |
| `fix` | バグの修正 | `fix/backend/34-db-connection` |
| `change` | 既存機能の仕様・見た目・動きの変更 | `change/frontend/41-header-layout` |
| `refactor` | 動きを変えないコードの整理 | `refactor/backend/52-split-user-service` |
| `docs` | ドキュメントのみの変更 | `docs/update-readme` |
| `test` | テストの追加・修正 | `test/backend/60-login-api-tests` |
| `chore` | 設定・ツール・依存関係・CI などの雑務 | `chore/15-setup-eslint` |

- マージ先はすべて `develop`
- type に迷ったら「[feat / change / fix / refactor の見分け方](commit-strategy.md#feat--change--fix--refactor-の見分け方)」を参照

### スコープ

| スコープ | 対象 |
|---|---|
| `frontend` | 画面・クライアント側 |
| `backend` | サーバー・API・DB |

- ※ 仮の一覧。プロジェクトの構成が決まったら確定させる
- コミットメッセージの scope にも同じ一覧を使う
- frontend と backend の両方を触る作業は、できるだけ Issue を分けて別々のブランチにする。どうしても分けられないときはスコープなしにする
（ログイン機能など、フロントとバック両方の変更が必要なもの）

### その他のルール

- 1 ブランチ = 1 目的（複数の変更を混在させない）。大きさの目安は「[粒度の目安](issue-pr.md#粒度の目安)」を参照
- 個人用の作業ブランチ（例: `daiki-work`）は作らない
- GitHub が自動で作るブランチ（Revert ボタンで作られる `revert-...` など）は命名規則の対象外とする

## マージ

- `main` / `develop` への直接プッシュは禁止
- 必要な承認（Approve）の数（自分の PR は自分で承認できない）
  - `develop` への PR：1 人以上
  - `main` への PR：2 人以上
- ※ 上記と `main` / `develop` の削除・force push 禁止は、GitHub の Ruleset（`protect-main` / `protect-develop`）で強制されている
- マージ方法は **Merge commit のみ**（Squash / Rebase は GitHub の設定で無効化済み）
  - PR 内のコミットはすべて履歴に残るので、PR を出す前に意味のないコミット（`wip`、`修正` だけ等）がないか見直す
  - PR 単位の流れだけ見たいときは `git log --first-parent develop` を使う
- マージ後、GitHub 上の作業ブランチは自動で削除される（ローカルの掃除は[開発フロー](development-flow.md#全体の流れ)を参照）

## リリース（`develop` → `main`）

- タイミング：発表・デモの前、または機能のまとまりができたとき
- 担当：**発表・デモを担当する人** がリリース PR を作る（いなければ Discord で決める）
- `main` でバグが見つかった場合も、通常どおり `develop` で修正し、次のリリースで `main` に反映する（`hotfix` ブランチは作らない）

### 手順

1. `develop` → `main` の PR を作成する
   - タイトル例：`中間発表版のリリース`
   - 本文には次の 2 つを書く。PR テンプレートのうち該当しない欄（`Closes #` など）は消してよい
     - 前回のリリースから入った PR の一覧
     - 発表・デモで使う機能が動くことを確認したこと
2. レビュアー 2 人は、`develop` を手元で動かし、発表・デモの流れを一通り試す
3. 2 人以上の承認をもらってマージする
4. GitHub の **Releases** でタグを付けて残す
   1. リポジトリ画面右側の「Releases」→「Draft a new release」を開く
   2. 「Choose a tag」に新しいタグ名を入力して作成する。Target は `main` にする
   3. タイトルを入力し、「Generate release notes」を押す（含まれる PR の一覧が自動で入る）
   4. 「Publish release」を押す

### タグの付け方

| タグ | 使う場面 | タイトル例 |
|---|---|---|
| `v0.1`, `v0.2`, … | 中間発表・デモなど、途中のリリース | `v0.1 中間発表版` |
| `v1.0` | 最終発表 | `v1.0 最終発表版` |

- タグ名は英数字のみにする（日本語はタイトルに書く）
- 過去のリリースの状態は、`git switch --detach v0.1` で見られる（見終わったら `git switch develop` で戻る）
