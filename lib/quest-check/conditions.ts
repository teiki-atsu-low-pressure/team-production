import type { Octokit } from "octokit";

/**
 * クエストの達成条件。クエストごとに、この中から必要なものを並べて定義する（lib/quests/ を参照）。
 */
export type Condition =
  /**
   * コミットが push されているか。
   * GitHub から見えるのは push されたコミットだけなので、commit と push はまとめて判定する。
   * テンプレートから作ったときの最初のコミットは数えない。
   */
  | { type: "commits_pushed"; minCount: number; branch?: string }
  /** デフォルトブランチ以外のブランチがあるか。namePattern（正規表現）を指定すると名前も確かめる */
  | { type: "branch_created"; namePattern?: string }
  /** PR があるか（open でもマージ済みでもよい）。base を指定すると、マージ先のブランチも確かめる */
  | { type: "pull_request_created"; base?: string };

/** 条件 1 つ分の判定結果 */
export type CheckResult = {
  type: Condition["type"];
  passed: boolean;
  /** 画面に出すための説明。達成していないときは、何が足りないかを書く */
  message: string;
};

/** 判定に使うリポジトリの情報 */
export type RepoContext = {
  owner: string;
  repo: string;
  defaultBranch: string;
};

/** テンプレートから作ったときに最初から入っているコミットの数 */
const TEMPLATE_COMMIT_COUNT = 1;

async function checkCommitsPushed(
  octokit: Octokit,
  ctx: RepoContext,
  condition: Extract<Condition, { type: "commits_pushed" }>,
): Promise<CheckResult> {
  const branch = condition.branch ?? ctx.defaultBranch;
  const needed = condition.minCount + TEMPLATE_COMMIT_COUNT;

  let count = 0;
  try {
    const { data } = await octokit.rest.repos.listCommits({
      owner: ctx.owner,
      repo: ctx.repo,
      sha: branch,
      per_page: needed,
    });
    count = data.length;
  } catch (error) {
    // 409: リポジトリが空、404: ブランチがない。どちらも「まだ push されていない」とみなす
    if (!isHttpError(error, 409) && !isHttpError(error, 404)) throw error;
  }

  const pushed = Math.max(count - TEMPLATE_COMMIT_COUNT, 0);
  if (pushed >= condition.minCount) {
    return {
      type: condition.type,
      passed: true,
      message: `${branch} ブランチにコミットが push されている`,
    };
  }
  return {
    type: condition.type,
    passed: false,
    message: `${branch} ブランチに、まだコミットが push されていない（commit したら push まで行う）`,
  };
}

async function checkBranchCreated(
  octokit: Octokit,
  ctx: RepoContext,
  condition: Extract<Condition, { type: "branch_created" }>,
): Promise<CheckResult> {
  const branches = await octokit.paginate(octokit.rest.repos.listBranches, {
    owner: ctx.owner,
    repo: ctx.repo,
    per_page: 100,
  });
  const pattern = condition.namePattern
    ? new RegExp(condition.namePattern)
    : undefined;
  const found = branches.find(
    (b) => b.name !== ctx.defaultBranch && (!pattern || pattern.test(b.name)),
  );

  if (found) {
    return {
      type: condition.type,
      passed: true,
      message: `ブランチ ${found.name} が作られている`,
    };
  }
  return {
    type: condition.type,
    passed: false,
    message: pattern
      ? `条件に合う名前のブランチが、まだ GitHub にない（作ったブランチを push する）`
      : `${ctx.defaultBranch} 以外のブランチが、まだ GitHub にない（作ったブランチを push する）`,
  };
}

async function checkPullRequestCreated(
  octokit: Octokit,
  ctx: RepoContext,
  condition: Extract<Condition, { type: "pull_request_created" }>,
): Promise<CheckResult> {
  const { data } = await octokit.rest.pulls.list({
    owner: ctx.owner,
    repo: ctx.repo,
    state: "all",
    base: condition.base,
    per_page: 1,
  });

  if (data.length > 0) {
    return {
      type: condition.type,
      passed: true,
      message: `PR #${data[0].number} が作られている`,
    };
  }
  return {
    type: condition.type,
    passed: false,
    message: condition.base
      ? `${condition.base} ブランチ向けの PR が、まだない`
      : `PR が、まだない`,
  };
}

/** 条件 1 つを判定する */
export function checkCondition(
  octokit: Octokit,
  ctx: RepoContext,
  condition: Condition,
): Promise<CheckResult> {
  switch (condition.type) {
    case "commits_pushed":
      return checkCommitsPushed(octokit, ctx, condition);
    case "branch_created":
      return checkBranchCreated(octokit, ctx, condition);
    case "pull_request_created":
      return checkPullRequestCreated(octokit, ctx, condition);
  }
}

/** Octokit が投げたエラーが、指定した HTTP ステータスかどうか */
export function isHttpError(error: unknown, status: number): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    error.status === status
  );
}
