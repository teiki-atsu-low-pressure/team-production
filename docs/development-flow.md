# 開発フロー

このドキュメントでは、Issue を立ててから develop にマージするまでの作業の流れを定義する。
全員が同じ手順で作業し、迷ったときや困ったとき（コンフリクトなど）に立ち返れるようにすることが目的。

## 全体の流れ

1. **Issue を立てる**（`feat` / `fix` / `change` は必須。それ以外は任意。[Issue のルール](issue-pr.md#issue-のルール)を参照）
2. 着手するときに、Issue の **Assignees（担当者）に自分を入れる**（[用語](#用語)を参照。Issue がない作業は飛ばしてよい）
3. 最新の `develop` から作業ブランチを切る（別の作業ブランチにいるまま切らないこと。名前の付け方は[ブランチ戦略](branch-strategy.md#命名規則)を参照）
   ```
   git switch develop
   git pull
   git switch -c <ブランチ名>
   ```
4. 作業ブランチでコミットを積む（書き方と粒度は[コミット戦略](commit-strategy.md)を参照）
5. `develop` 向けに PR を作成する（本文に `Closes #<Issue番号>` を書く。書き方は[PR の書き方](issue-pr.md#pr-の書き方)を参照）
6. 1 人以上の承認（Approve）をもらい、PR を出した本人が `develop` にマージする（[レビューのルール](issue-pr.md#レビューのルール)を参照）
7. マージ後、GitHub 上のブランチは自動で削除される（Issue も `Closes` により自動で閉じる）。ローカルは各自で掃除する：
   ```
   git switch develop
   git pull
   git fetch --prune
   git branch -d <ブランチ名>
   ```
   - マージ後に追加の修正が必要になったら、同じブランチは使わず `develop` から新しいブランチを切る

## 作業中に `develop` が更新されたとき

自分のブランチに最新の `develop` を取り込む：

```
git switch develop
git pull
git switch <自分のブランチ>
git merge develop
```

- 取り込みは `merge` で行う（`rebase` は使わない。push 済みブランチの rebase には force push が必要になり、事故のもとになるため）
- PR を出す前と、PR でコンフリクトが表示されたときには必ず取り込む

### コンフリクトが起きたら

1. VS Code でコンフリクトしたファイルを開き、どちらの変更を残すか選ぶ（「Resolve in Merge Editor」ボタンを使うとわかりやすい）
2. 解決したら、コミットしてマージを完了する
   ```
   git add <ファイル名>
   git commit
   ```
3. わからなくなったら、`git merge --abort` でマージ前の状態に戻せる

- 相手の変更を消してよいか判断できないときは、自分で決めずに Discord で相手に相談する（誰が変更したかは、GitHub のファイル画面の「Blame」や `git log -p <ファイル名>` で確認できる）

## 用語

| 用語 | 意味 | 設定する場所 |
|---|---|---|
| **Assignees（担当者）** | その Issue / PR の作業を担当する人 | Issue / PR 画面の右側「Assignees」 |
| **Reviewers（レビュアー）** | PR をレビューして承認（Approve）する人。担当者とは別の人を指定する | PR 画面の右側「Reviewers」 |
