import { App, Octokit } from "octokit";

//GitHub Appの認証情報を取得
const appId = process.env.GITHUB_APP_ID;
const privateKey = process.env.GITHUB_APP_PRIVATE_KEY;

//GitHub Appの認証
function getGitHubApp(): App {
  if (!appId || !privateKey) {
    throw new Error("GitHub Appの認証情報が設定されていません。");
  }
  return new App({
    appId: appId,
    privateKey: privateKey.replace(/\\n/g, "\n"),
  });
}
//Installation IDから認証済みのOctokitを取得
export async function getInstallationOctokit(
  installationId: number,
): Promise<Octokit> {
  if (!Number.isSafeInteger(installationId) || installationId <= 0) {
    throw new Error("Installation IDが正しくありません。");
  }
  const app = getGitHubApp();
  return await app.getInstallationOctokit(installationId);
}
// GitHub App のインストール画面の URL を取得
export function getGitHubInstallUrl(): string {
  return "https://github.com/apps/gitbuddy-team/installations/new";
}
