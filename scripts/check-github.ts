import { getInstallationOctokit } from "../lib/github.ts";

async function main() {
  //テスト用のInstallation IDを取得
  const installationId = Number(process.env.GITHUB_APP_INSTALLATION_ID);
  //認証済みのOctokitを取得
  const octokit = await getInstallationOctokit(installationId);
  //アクセス可能なリポジトリを取得
  const { data } = await octokit.rest.apps.listReposAccessibleToInstallation();

  console.log("GitHub Appの認証に成功しました");
  console.log(`リポジトリ数： ${data.total_count}`);

  for (const repo of data.repositories) {
    console.log(repo.full_name);
  }
}
main().catch((error) => {
  console.error("GitHub Appの認証に失敗しました");
  console.error(error.message);
  process.exitCode = 1;
});
