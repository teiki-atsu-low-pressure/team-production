import type { Octokit } from "octokit";

import { isHttpError } from "../quest-check/conditions.ts";

/** 練習用リポジトリの名前（第 1 章） */
export const PRACTICE_REPO_NAME = "gitbuddy-chapter1";

/**
 * 練習用リポジトリの公開範囲。
 * public にするのは、Free プランでもブランチ保護など GitHub の機能をすべて使えるようにするため。
 */
export const PRACTICE_REPO_VISIBILITY: Visibility = "public";

export type Visibility = "public" | "private";

/** 作った（または、すでにあった）練習用リポジトリの情報 */
export type PracticeRepo = {
  owner: string;
  name: string;
  htmlUrl: string;
  /** 今回新しく作ったなら true。すでにあったものを返したなら false */
  created: boolean;
};

/** リポジトリを用意できなかったときに投げる */
export class PracticeRepoError extends Error {
  readonly code:
    "template_not_found" | "name_taken" | "forbidden" | "not_ready";

  constructor(code: PracticeRepoError["code"], message: string) {
    super(message);
    this.name = "PracticeRepoError";
    this.code = code;
  }
}

/** 作った直後に中身が入るまで待つ時間 */
const READY_TIMEOUT_MS = 10_000;
const READY_INTERVAL_MS = 1_000;

/**
 * テンプレートをコピーして、owner のアカウントに練習用リポジトリを作る。
 *
 * - 同じ名前のリポジトリが同じテンプレートから作られていれば、作らずにそれを返す（ボタンの二度押しや、やり直しのため）
 * - 作った直後は中身が入っていないことがあるので、最初のコミットが見えるまで待ってから返す
 *
 * octokit は呼ぶ側で作って渡す。ユーザー個人のアカウントに作るので、そのユーザーとして操作できるトークン
 * （GitHub App の user access token か、手元なら個人トークン）が必要。
 */
export async function createPracticeRepo(
  octokit: Octokit,
  options: {
    owner: string;
    template: { owner: string; repo: string };
    name?: string;
    visibility?: Visibility;
  },
): Promise<PracticeRepo> {
  const { owner, template } = options;
  const name = options.name ?? PRACTICE_REPO_NAME;
  const visibility = options.visibility ?? PRACTICE_REPO_VISIBILITY;

  const existing = await findExisting(octokit, owner, name, template);
  if (existing) {
    await waitUntilReady(octokit, owner, name);
    return existing;
  }

  try {
    const { data } = await octokit.rest.repos.createUsingTemplate({
      template_owner: template.owner,
      template_repo: template.repo,
      owner,
      name,
      private: visibility === "private",
    });
    await waitUntilReady(octokit, owner, name);
    return { owner, name, htmlUrl: data.html_url, created: true };
  } catch (error) {
    // 422: 確かめた後に、同じ名前のリポジトリが作られた（二度押しなど）。もう一度確かめる
    if (isHttpError(error, 422)) {
      const raced = await findExisting(octokit, owner, name, template);
      if (raced) {
        await waitUntilReady(octokit, owner, name);
        return raced;
      }
    }
    if (isHttpError(error, 404)) {
      throw new PracticeRepoError(
        "template_not_found",
        `テンプレート ${template.owner}/${template.repo} が見つからない（存在しないか、テンプレートになっていないか、読む権限がない）`,
      );
    }
    if (isHttpError(error, 401) || isHttpError(error, 403)) {
      throw new PracticeRepoError(
        "forbidden",
        `${owner} のアカウントにリポジトリを作る権限がない（トークンを確かめる）`,
      );
    }
    throw error;
  }
}

/**
 * 同じ名前のリポジトリを探す。
 * なければ undefined。同じテンプレートから作られたものなら、その情報を返す。違うものならエラー。
 */
async function findExisting(
  octokit: Octokit,
  owner: string,
  name: string,
  template: { owner: string; repo: string },
): Promise<PracticeRepo | undefined> {
  let data;
  try {
    ({ data } = await octokit.rest.repos.get({ owner, repo: name }));
  } catch (error) {
    if (isHttpError(error, 404)) return undefined;
    if (isHttpError(error, 401) || isHttpError(error, 403)) {
      throw new PracticeRepoError(
        "forbidden",
        `${owner}/${name} を確かめる権限がない（トークンを確かめる）`,
      );
    }
    throw error;
  }

  const from = data.template_repository?.full_name?.toLowerCase();
  if (from !== `${template.owner}/${template.repo}`.toLowerCase()) {
    throw new PracticeRepoError(
      "name_taken",
      `${owner}/${name} という名前のリポジトリがすでにある（GitBuddy で作ったものではない）`,
    );
  }
  return { owner, name, htmlUrl: data.html_url, created: false };
}

/** 最初のコミットが見えるまで待つ。時間内に見えなければエラー */
async function waitUntilReady(
  octokit: Octokit,
  owner: string,
  name: string,
): Promise<void> {
  const deadline = Date.now() + READY_TIMEOUT_MS;
  while (true) {
    try {
      const { data } = await octokit.rest.repos.listCommits({
        owner,
        repo: name,
        per_page: 1,
      });
      if (data.length > 0) return;
    } catch (error) {
      // 409: まだ空、404: まだ見えない。どちらも待つ
      if (!isHttpError(error, 409) && !isHttpError(error, 404)) throw error;
    }
    if (Date.now() >= deadline) {
      throw new PracticeRepoError(
        "not_ready",
        `${owner}/${name} は作られたが、中身が入るのを待ちきれなかった（少し待ってから、もう一度試す）`,
      );
    }
    await new Promise((resolve) => setTimeout(resolve, READY_INTERVAL_MS));
  }
}
