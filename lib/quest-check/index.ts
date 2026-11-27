import type { Octokit } from "octokit";

import { findQuest } from "../quests/index.ts";
import {
  checkCondition,
  isHttpError,
  type CheckResult,
  type RepoContext,
} from "./conditions.ts";

export type { CheckResult, Condition } from "./conditions.ts";

/** クエスト 1 つ分の判定結果 */
export type QuestCheckResult = {
  questId: string;
  /** すべての条件を満たしていれば true（クリア） */
  passed: boolean;
  /** 条件ごとの結果。定義した順に並ぶ */
  checks: CheckResult[];
};

/** 判定そのものができなかったとき（クエストやリポジトリがない、権限がないなど）に投げる */
export class QuestCheckError extends Error {
  readonly code: "unknown_quest" | "repo_not_found" | "forbidden";

  constructor(code: QuestCheckError["code"], message: string) {
    super(message);
    this.name = "QuestCheckError";
    this.code = code;
  }
}

/**
 * 練習用リポジトリの状態を見て、クエストを達成したかを判定する。
 *
 * octokit は呼ぶ側で作って渡す（GitHub App の installation token でも、手元の個人トークンでもよい）。
 */
export async function checkQuest(
  octokit: Octokit,
  target: { owner: string; repo: string },
  questId: string,
): Promise<QuestCheckResult> {
  const quest = findQuest(questId);
  if (!quest) {
    throw new QuestCheckError(
      "unknown_quest",
      `クエスト ${questId} は存在しない`,
    );
  }

  const ctx = await getRepoContext(octokit, target);
  try {
    const checks: CheckResult[] = [];
    // 順番に判定する（GitHub API に同時にリクエストを送りすぎないため）
    for (const condition of quest.conditions) {
      checks.push(await checkCondition(octokit, ctx, condition));
    }
    return { questId, passed: checks.every((c) => c.passed), checks };
  } catch (error) {
    throw toQuestCheckError(error, target);
  }
}

async function getRepoContext(
  octokit: Octokit,
  target: { owner: string; repo: string },
): Promise<RepoContext> {
  try {
    const { data } = await octokit.rest.repos.get(target);
    return { ...target, defaultBranch: data.default_branch };
  } catch (error) {
    throw toQuestCheckError(error, target);
  }
}

/** 権限やリポジトリの有無に関わる HTTP エラーを、わかりやすいエラーに置き換える */
function toQuestCheckError(
  error: unknown,
  target: { owner: string; repo: string },
): unknown {
  const name = `${target.owner}/${target.repo}`;
  // GitHub は、読む権限がないリポジトリにも 404 を返す
  if (isHttpError(error, 404)) {
    return new QuestCheckError(
      "repo_not_found",
      `リポジトリ ${name} が見つからない（存在しないか、読む権限がない）`,
    );
  }
  if (isHttpError(error, 401) || isHttpError(error, 403)) {
    return new QuestCheckError(
      "forbidden",
      `リポジトリ ${name} を読む権限がない（トークンを確かめる）`,
    );
  }
  return error;
}
