// 練習用リポジトリがクエストを達成しているかを、手元で判定して表示する。
// 実行方法: npm run quest:check -- <owner>/<repo> <クエストID>
//   例: npm run quest:check -- your-name/gitbuddy-practice chapter1-first-push
// .env.local の GITHUB_TOKEN（README を参照）で GitHub にアクセスする。
import { Octokit } from "octokit";

import { checkQuest, QuestCheckError } from "../lib/quest-check/index.ts";
import { quests } from "../lib/quests/index.ts";

const [repoArg, questId] = process.argv.slice(2);
const [owner, repo] = repoArg?.split("/") ?? [];

if (!owner || !repo || !questId) {
  console.error("使い方: npm run quest:check -- <owner>/<repo> <クエストID>");
  console.error(`クエストID: ${quests.map((q) => q.id).join(", ")}`);
  process.exit(1);
}

const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error(
    "NG: GITHUB_TOKEN を .env.local に設定してください（README を参照）",
  );
  process.exit(1);
}

try {
  const result = await checkQuest(
    new Octokit({ auth: token }),
    { owner, repo },
    questId,
  );
  for (const check of result.checks) {
    console.log(`${check.passed ? "OK" : "NG"}: ${check.message}`);
  }
  console.log(result.passed ? "クリア！" : "まだクリアしていない");
} catch (error) {
  if (error instanceof QuestCheckError) {
    console.error(`NG: ${error.message}`);
    process.exit(1);
  }
  throw error;
}
