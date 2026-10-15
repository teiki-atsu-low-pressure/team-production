# 開発フロー（Issue 駆動 × GitHub Flow）

## 全体の流れ

1. **Issue を立てる**（テンプレートを使う）
2. 着手するときに、Issue の **Assignees に自分を入れる**
3. 最新の `main` から作業ブランチを切る
4. 作業ブランチでコミットを積む
5. PR を作成する（本文に `Closes #<Issue番号>` を書く）
6. 1 人以上の承認（Approve）をもらって `main` にマージする
7. マージ後、GitHub 上のブランチは自動で削除される（Issue も `Closes` により自動で閉じる）。ローカルは各自で掃除する：
   ```
   git switch main
   git pull
   git fetch --prune
   git branch -d <ブランチ名>
   ```
   - マージ後に追加の修正が必要になったら、同じブランチは使わず `main` から新しいブランチを切る

## Issue のルール

| 作業の種類 | Issue |
|---|---|
| `feat` / `fix` / `change` | **必須** |
| `refactor` / `docs` / `test` / `chore` | 任意（小さな作業なら Issue なしでよい） |

- Issue は [テンプレート](../.github/ISSUE_TEMPLATE/) を使って作成する
- 着手前に Assignees を確認し、他の人が担当中のものには手を出さない
- タスクは **GitHub Issue に一本化** する。Discord は相談・連絡用とし、Discord で決まったタスクは Issue に起こす

---

# ブランチ戦略

## ブランチの種類

| ブランチ名 | 用途 |
|---|---|
| `main` | 全員の統合先。直接コミット禁止、PR 経由でのみマージする |
| `<type>/<Issue番号>-<説明>` | Issue がある作業ブランチ |
| `<type>/<説明>` | Issue がない作業ブランチ |

`<type>` は[コミットメッセージの type 一覧](#type-一覧)と同じものを使い、**その PR の主な目的** で決める。
ブランチ内のコミットの type は一致しなくてよい（例: `feat/12-google-oauth` の中に `test:` や `docs:` のコミットがあってよい）。

## 命名規則

- 英小文字・数字・ハイフンのみ使用する（`<説明>` は kebab-case）
- 例:
  - `feat/12-google-oauth`
  - `fix/34-cache-race-condition`
  - `docs/update-readme`（Issue なし）

## ルール

- `main` への直接プッシュは禁止
- PR は 1 人以上の承認（Approve）がないとマージできない（自分の PR は自分で承認できない）
- ※ 上記 2 点と `main` の削除・force push 禁止は、GitHub の Ruleset（`protect-main`）で強制されている
- マージ方法は **Merge commit のみ**（Squash / Rebase は GitHub の設定で無効化済み）
  - PR 内のコミットはすべて `main` に残るので、PR を出す前に意味のないコミット（`wip`、`修正` だけ等）がないか見直す
  - PR 単位の流れだけ見たいときは `git log --first-parent main` を使う
- 1 ブランチ = 1 目的（複数の変更を混在させない）
- 個人用の作業ブランチ（例: `daiki-work`）は作らない

---

# コミットメッセージ規約

[Conventional Commits](https://www.conventionalcommits.org/ja/v1.0.0/) をベースにする。絵文字は付けない。

## 基本フォーマット

```
<type>[(scope)]: <説明> [#Issue番号]

[本文（任意）]
```

## type 一覧

| type | 用途 |
|---|---|
| `feat` | 新機能の追加 |
| `fix` | バグ修正 |
| `change` | 既存機能の仕様変更 |
| `refactor` | 動作を変えないコード整理（フォーマット修正を含む） |
| `docs` | ドキュメントのみの変更 |
| `test` | テストの追加・修正 |
| `chore` | 設定・ツール・依存関係・CI などの雑務 |

### `feat` / `change` / `fix` / `refactor` の見分け方

| 状況 | type |
|---|---|
| 今までなかった機能ができた | `feat` |
| すでにある機能の仕様・見た目・動きを **意図して** 変えた | `change` |
| 本来の仕様どおりに動いていなかったのを直した | `fix` |
| 動きは何も変わらず、コードだけ整理した | `refactor` |

## ルール

- `type` と `scope` は英語、`説明` と `本文` は **日本語** で書く
- `説明` は「〜を追加」「〜を修正」のように **体言止め** で簡潔に書く
- 1 行目は 50 文字程度以内を目安にする
- Issue がある場合は 1 行目の末尾に `#Issue番号` を付ける
- scope は変更範囲を括弧で示す（任意）。例: `fix(auth): トークン更新処理を修正 #34`
- 本文には「何を」ではなく「なぜ」変更したかを書く
- Git / GitHub が自動で作るメッセージは規約の対象外とし、そのまま使う
  - `Merge pull request #1 from ...`（PR のマージ時）
  - `Revert "..."`（`git revert` 時）

## 例

```
feat(login): Google OAuth ログインを追加 #12

既存のメール/パスワードログインと共存させる。
```

```
fix: キャッシュ無効化の競合状態を修正 #34
```

```
docs: README にセットアップ手順を追加
```

---

# AI（Claude Code など）を使うときのルール

- AI に作業させる前に、自分で作業ブランチを切っておく（AI に `main` で作業させない）
- AI が push・PR 作成・Issue 操作をするときは、必ず人間が内容を確認してから実行させる
- AI が書いたコードやコミットも、自分が書いたものとして責任を持ってレビューする
- AI が関わったコミットには `Co-Authored-By:` 行を付けたままにする（どこを AI に任せたか後から振り返れるようにするため）
