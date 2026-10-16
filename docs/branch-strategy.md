# ブランチ戦略

## ブランチの種類

| ブランチ名 | 用途 |
|---|---|
| `main` | 安定版。発表・デモで使う状態を保つ。`develop` からのリリース PR でのみ更新する |
| `develop` | 開発の統合先（デフォルトブランチ）。作業ブランチはここから切り、ここへ PR を出す |
| `<type>/<Issue番号>-<説明>` | Issue がある作業ブランチ |
| `<type>/<説明>` | Issue がない作業ブランチ |

`<type>` は[コミットメッセージの type 一覧](commit-strategy.md#type-一覧)と同じものを使い、**その PR の主な目的** で決める。
ブランチ内のコミットの type は一致しなくてよい（例: `feat/12-google-oauth` の中に `test:` や `docs:` のコミットがあってよい）。

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

## 命名規則

- 英小文字・数字・ハイフンのみ使用する（`<説明>` は kebab-case）
- 例:
  - `feat/12-google-oauth`
  - `fix/34-cache-race-condition`
  - `docs/update-readme`（Issue なし）

## ルール

- `main` / `develop` への直接プッシュは禁止
- 必要な承認（Approve）の数（自分の PR は自分で承認できない）
  - `develop` への PR：1 人以上
  - `main` への PR：2 人以上
- ※ 上記と `main` / `develop` の削除・force push 禁止は、GitHub の Ruleset（`protect-main` / `protect-develop`）で強制されている
- マージ方法は **Merge commit のみ**（Squash / Rebase は GitHub の設定で無効化済み）
  - PR 内のコミットはすべて履歴に残るので、PR を出す前に意味のないコミット（`wip`、`修正` だけ等）がないか見直す
  - PR 単位の流れだけ見たいときは `git log --first-parent develop` を使う
- 1 ブランチ = 1 目的（複数の変更を混在させない）
- 個人用の作業ブランチ（例: `daiki-work`）は作らない
