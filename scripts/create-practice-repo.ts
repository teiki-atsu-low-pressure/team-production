// テンプレートから、自分のアカウントに練習用リポジトリを作る（手元で試す用）。
// 実行方法: npm run repo:create -- <テンプレートのowner>/<テンプレートのrepo> [リポジトリ名] [--private]
//   例: npm run repo:create -- your-name/gitbuddy-template-test
// .env.local の GITHUB_TOKEN（README を参照）で GitHub にアクセスする。
import { Octokit } from "octokit";

import {
  createPracticeRepo,
  PRACTICE_REPO_NAME,
  PracticeRepoError,
} from "../lib/practice-repo/index.ts";

// --private を付けると private で作る（試すときに公開リポジトリを増やさないため）
const args = process.argv.slice(2);
const isPrivate = args.includes("--private");
const [templateArg, name] = args.filter((a) => a !== "--private");
const [templateOwner, templateRepo] = templateArg?.split("/") ?? [];

if (!templateOwner || !templateRepo) {
  console.error(
    "使い方: npm run repo:create -- <テンプレートのowner>/<テンプレートのrepo> [リポジトリ名] [--private]",
  );
  console.error(`リポジトリ名を省くと ${PRACTICE_REPO_NAME} になる`);
  process.exit(1);
}

const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error(
    "NG: GITHUB_TOKEN を .env.local に設定してください（README を参照）",
  );
  process.exit(1);
}

const octokit = new Octokit({ auth: token });

try {
  // トークンの持ち主のアカウントに作る
  const { data: user } = await octokit.rest.users.getAuthenticated();
  const repo = await createPracticeRepo(octokit, {
    owner: user.login,
    template: { owner: templateOwner, repo: templateRepo },
    name,
    visibility: isPrivate ? "private" : undefined,
  });
  console.log(
    repo.created
      ? `OK: 作った ${repo.htmlUrl}`
      : `OK: すでにあったものを使う ${repo.htmlUrl}`,
  );
} catch (error) {
  if (error instanceof PracticeRepoError) {
    console.error(`NG: ${error.message}`);
    process.exit(1);
  }
  throw error;
}
